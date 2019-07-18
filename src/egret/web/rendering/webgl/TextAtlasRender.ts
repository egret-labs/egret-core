//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

namespace egret.web {

    //测试开关,打开会截住老的字体渲染
    export const textAtlasRenderEnable: boolean = false;

    //测试对象, 先不用singleton的，后续整理代码，就new一个，放在全局的context上做成员变量
    export let __textAtlasRender__: TextAtlasRender = null;

    //不想改TextNode的代码了，先用这种方式实现，以后稳了再改
    export const property_drawLabel: string = 'DrawLabel';

    //开启这个，用textAtlas渲染出来的，都是红字，而且加黑框
    const textAtlasDebug: boolean = false;

    //画一行
    export class DrawLabel extends HashObject {
        //池子，防止反复创建
        private static pool: DrawLabel[] = [];
        //记录初始位置
        public anchorX: number = 0;
        public anchorY: number = 0;
        //要画的字块
        public textBlocks: TextBlock[] = [];
        //清除数据，回池
        private clear(): void {
            this.anchorX = 0;
            this.anchorY = 0;
            this.textBlocks.length = 0; //这个没事,实体在book里面存着
        }
        //池子创建
        public static create(): DrawLabel {
            const pool = DrawLabel.pool;
            if (pool.length === 0) {
                pool.push(new DrawLabel);
            }
            return pool.pop();
        }
        //回池
        public static back(drawLabel: DrawLabel, checkRepeat: boolean): void {
            if (!drawLabel) {
                return;
            }
            const pool = DrawLabel.pool;
            if (checkRepeat && pool.indexOf(drawLabel) >= 0) {
                console.error('DrawLabel.back repeat');
                return;
            }
            drawLabel.clear();
            pool.push(drawLabel);
        }
    }

    //记录样式的
    class StyleInfo extends HashObject {
        //各种记录信息
        public readonly textColor: number;
        public readonly strokeColor: number;
        public readonly size: number;
        public readonly stroke: number;
        public readonly bold: boolean;
        public readonly italic: boolean;
        public readonly fontFamily: string;
        public readonly font: string;
        public readonly format: sys.TextFormat = null;
        public readonly description: string;
        //
        constructor(textNode: sys.TextNode, format: sys.TextFormat) {
            super();
            //debug强制红色
            let saveTextColorForDebug = 0;
            if (textAtlasDebug) {
                saveTextColorForDebug = textNode.textColor;
                textNode.textColor = 0xff0000;
            }
            //存上
            this.textColor = textNode.textColor;
            this.strokeColor = textNode.strokeColor;
            this.size = textNode.size;
            this.stroke = textNode.stroke;
            this.bold = textNode.bold;
            this.italic = textNode.italic;
            this.fontFamily = textNode.fontFamily;
            this.format = format;
            this.font = getFontString(textNode, this.format);
            //描述用于生成hashcode
            const textColor = (!format.textColor ? textNode.textColor : format.textColor);
            const strokeColor = (!format.strokeColor ? textNode.strokeColor : format.strokeColor);
            const stroke = (!format.stroke ? textNode.stroke : format.stroke);
            const size = (!format.size ? textNode.size : format.size);
            //
            this.description = '' + this.font + '-' + size;
            this.description += '-' + toColorString(textColor);
            this.description += '-' + toColorString(strokeColor);
            if (stroke) {
                this.description += '-' + stroke * 2;
            }
            //还原
            if (textAtlasDebug) {
                textNode.textColor = saveTextColorForDebug;
            }
        }
    }

    //测量字体和绘制的
    class CharImageRender extends HashObject {
        //要渲染的字符串
        public char: string = '';
        //StyleInfo
        public styleInfo: StyleInfo = null;
        //生成hashcode的字符串
        public hashCodeString: string = '';
        //字母：style设置行程唯一值
        public charWithStyleHashCode: number = 0;
        //测量实际的size
        public measureWidth: number = 0;
        public measureHeight: number = 0;
        //边缘放大之后的偏移
        public canvasWidthOffset: number = 0;
        public canvasHeightOffset: number = 0;
        //描边的记录
        public stroke2: number = 0;
        //针对中文的加速查找
        private static readonly chineseCharactersRegExp: RegExp = new RegExp("^[\u4E00-\u9FA5]$");
        private static readonly chineseCharacterMeasureFastMap: { [index: string]: number } = {};

        public reset(char: string, styleKey: StyleInfo): CharImageRender {
            this.char = char;
            this.styleInfo = styleKey;
            this.hashCodeString = char + ':' + styleKey.description;
            this.charWithStyleHashCode = NumberUtils.convertStringToHashCode(this.hashCodeString);
            this.canvasWidthOffset = 0;
            this.canvasHeightOffset = 0;
            this.stroke2 = 0;
            return this;
        }

        public measureAndDraw(targetCanvas: HTMLCanvasElement): void {
            const canvas = targetCanvas;
            if (!canvas) {
                return;
            }
            //读取设置
            const text = this.char;
            const format: sys.TextFormat = this.styleInfo.format;
            const textColor = (!format.textColor ? this.styleInfo.textColor : format.textColor);
            const strokeColor = (!format.strokeColor ? this.styleInfo.strokeColor : format.strokeColor);
            const stroke = (!format.stroke ? this.styleInfo.stroke : format.stroke);
            const size = (!format.size ? this.styleInfo.size : format.size);
            //开始测量---------------------------------------
            this.measureWidth = this.measure(text, this.styleInfo, size);
            this.measureHeight = size;//this.styleInfo.size;
            //调整 参考TextField: $getRenderBounds(): Rectangle {
            let canvasWidth = this.measureWidth;
            let canvasHeight = this.measureHeight;
            const _strokeDouble = stroke * 2;
            if (_strokeDouble > 0) {
                canvasWidth += _strokeDouble * 2;
                canvasHeight += _strokeDouble * 2;
            }
            this.stroke2 = _strokeDouble;
            //赋值
            canvas.width = canvasWidth = Math.ceil(canvasWidth) + 2 * 2;
            canvas.height = canvasHeight = Math.ceil(canvasHeight) + 2 * 2;
            this.canvasWidthOffset = (canvas.width - this.measureWidth) / 2;
            this.canvasHeightOffset = (canvas.height - this.measureHeight) / 2;
            //全部保留numberOfPrecision位小数
            const numberOfPrecision = 3;
            const precision = Math.pow(10, numberOfPrecision);
            this.canvasWidthOffset = Math.floor(this.canvasWidthOffset * precision) / precision;
            this.canvasHeightOffset = Math.floor(this.canvasHeightOffset * precision) / precision;
            //再开始绘制---------------------------------------
            const context = egret.sys.getContext2d(canvas);
            context.save();
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.lineJoin = 'round';
            context.font = this.styleInfo.font;
            context.fillStyle = toColorString(textColor);
            context.strokeStyle = toColorString(strokeColor);
            context.clearRect(0, 0, canvas.width, canvas.height);
            if (stroke) {
                context.lineWidth = stroke * 2;
                context.strokeText(text, canvas.width / 2, canvas.height / 2);
            }
            context.fillText(text, canvas.width / 2, canvas.height / 2);
            context.restore();
        }

        private measure(text: string, styleKey: StyleInfo, textFlowSize: number): number {
            const isChinese = CharImageRender.chineseCharactersRegExp.test(text);
            if (isChinese) {
                if (CharImageRender.chineseCharacterMeasureFastMap[styleKey.font]) {
                    return CharImageRender.chineseCharacterMeasureFastMap[styleKey.font];
                }
            }
            const measureTextWidth = egret.sys.measureText(text, styleKey.fontFamily, textFlowSize || styleKey.size, styleKey.bold, styleKey.italic);
            if (isChinese) {
                CharImageRender.chineseCharacterMeasureFastMap[styleKey.font] = measureTextWidth;
            }
            return measureTextWidth;
        }
    }

    //对外的类
    export class TextAtlasRender extends HashObject {

        private readonly book: Book = null;
        private readonly charImageRender: CharImageRender = new CharImageRender;
        private readonly textBlockMap: { [index: number]: TextBlock } = {};
        private _canvas: HTMLCanvasElement = null;
        private readonly textAtlasTextureCache: WebGLTexture[] = [];
        private readonly webglRenderContext: WebGLRenderContext = null;

        //
        constructor(webglRenderContext: WebGLRenderContext, maxSize: number, border: number) {
            super();
            this.webglRenderContext = webglRenderContext;
            this.book = new Book(maxSize, border);
        }

        //分析textNode，把数据提取出来，然后给textNode挂上渲染的信息
        public static analysisTextNodeAndFlushDrawLabel(textNode: sys.TextNode): void {
            if (!textNode) {
                return;
            }
            if (!__textAtlasRender__) {
                //创建，后续会转移给WebGLRenderContext
                const webglcontext = egret.web.WebGLRenderContext.getInstance(0, 0);
                //初期先512，因为不会大规模batch, 老项目最好不要直接使用这个，少数几个总变内容的TextField可以用，所以先不用$maxTextureSize
                __textAtlasRender__ = new TextAtlasRender(webglcontext, textAtlasDebug ? 512 : 512/*webglcontext.$maxTextureSize*/, textAtlasDebug ? 12 : 1);
            }
            //清除命令
            textNode[property_drawLabel] = textNode[property_drawLabel] || [];
            let drawLabels = textNode[property_drawLabel] as DrawLabel[];
            for (const drawLabel of drawLabels) {
                //还回去
                DrawLabel.back(drawLabel, false);
            }
            drawLabels.length = 0;
            //重新装填
            const offset = 4;
            const drawData = textNode.drawData;
            let anchorX = 0;
            let anchorY = 0;
            let labelString = '';
            let labelFormat: sys.TextFormat = {};
            let resultAsRenderTextBlocks: TextBlock[] = [];
            for (let i = 0, length = drawData.length; i < length; i += offset) {
                anchorX = drawData[i + 0] as number;
                anchorY = drawData[i + 1] as number;
                labelString = drawData[i + 2] as string;
                labelFormat = drawData[i + 3] as sys.TextFormat || {};
                resultAsRenderTextBlocks.length = 0;
                //提取数据
                __textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleInfo(textNode, labelFormat), resultAsRenderTextBlocks);
                //pool创建 + 添加命令
                const drawLabel = DrawLabel.create();
                drawLabel.anchorX = anchorX;
                drawLabel.anchorY = anchorY;
                drawLabel.textBlocks = [].concat(resultAsRenderTextBlocks);
                drawLabels.push(drawLabel);
            }
        }

        //字符串转化成为TextBlock
        private convertLabelStringToTextAtlas(labelstring: string, styleKey: StyleInfo, resultAsRenderTextBlocks: TextBlock[]): void {
            const canvas = this.canvas;
            const charImageRender = this.charImageRender;
            const textBlockMap = this.textBlockMap;
            for (const char of labelstring) {
                //不反复创建
                charImageRender.reset(char, styleKey);
                if (textBlockMap[charImageRender.charWithStyleHashCode]) {
                    //检查重复
                    resultAsRenderTextBlocks.push(textBlockMap[charImageRender.charWithStyleHashCode]);
                    continue;
                }
                //画到到canvas
                charImageRender.measureAndDraw(canvas);
                //创建新的文字块
                const txtBlock = this.book.createTextBlock(char,
                    canvas.width, canvas.height,
                    charImageRender.measureWidth, charImageRender.measureHeight,
                    charImageRender.canvasWidthOffset, charImageRender.canvasHeightOffset,
                    charImageRender.stroke2);

                if (!txtBlock) {
                    continue;
                }
                //需要绘制
                resultAsRenderTextBlocks.push(txtBlock);
                //记录快速查找
                textBlockMap[charImageRender.charWithStyleHashCode] = txtBlock;
                //生成纹理
                const page = txtBlock.page;
                if (!page.webGLTexture) {
                    page.webGLTexture = this.createTextTextureAtlas(page.pageWidth, page.pageHeight, textAtlasDebug);
                }
                const gl = this.webglRenderContext.context;
                page.webGLTexture[glContext] = gl;
                gl.bindTexture(gl.TEXTURE_2D, page.webGLTexture);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                page.webGLTexture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
                gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
                
            }
        }

        //给一个page创建一个纹理
        private createTextTextureAtlas(width: number, height: number, debug: boolean): WebGLTexture {
            let texture: WebGLTexture = null;
            if (debug) {
                //做一个黑底子的，方便调试代码
                const canvas = egret.sys.createCanvas(width, width);
                const context = egret.sys.getContext2d(canvas);
                context.fillStyle = 'black';
                context.fillRect(0, 0, width, width);
                texture = egret.sys.createTexture(this.webglRenderContext, canvas);
            }
            else {
                //真的
                texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
            }
            if (texture) {
                //存起来，未来可以删除，或者查看
                this.textAtlasTextureCache.push(texture);
            }
            return texture;
        }

        //给CharImageRender用的canvas
        private get canvas(): HTMLCanvasElement {
            if (!this._canvas) {
                //就用默认体积24
                this._canvas = egret.sys.createCanvas(24, 24);
            }
            return this._canvas;
        }
    }
}
