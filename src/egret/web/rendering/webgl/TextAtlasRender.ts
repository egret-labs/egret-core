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

    // function __hashCode__(str: string): number {
    //     if (str.length === 0) {
    //         return 0;
    //     }
    //     let hash = 0;
    //     for (let i = 0, length = str.length; i < length; ++i) {
    //         const chr = str.charCodeAt(i);
    //         hash = ((hash << 5) - hash) + chr;
    //         hash |= 0; // Convert to 32bit integer
    //     }
    //     return hash;
    // }

    //针对中文的加速查找
    const __chineseCharactersRegExp__ = new RegExp("^[\u4E00-\u9FA5]$");
    const __chineseCharacterMeasureFastMap__: { [index: string]: TextMetrics } = {};

    //属性关键子
    // const property_tag: string = 'tag';
    // const property_textTextureAtlas: string = 'textTextureAtlas';

    //
    class StyleKey extends HashObject {
        /**
         * 颜色值
         */
        public readonly textColor: number;
        /**
         * 描边颜色值
         */
        public readonly strokeColor: number;
        /**
         * 字号
         */
        public readonly size: number;
        /**
         * 描边大小
         */
        public readonly stroke: number;
        /**
         * 是否加粗
         */
        public readonly bold: boolean;
        /**
         * 是否倾斜
         */
        public readonly italic: boolean;
        /**
         * 字体名称
         */
        public readonly fontFamily: string;

        //
        public readonly font: string;

        //
        public readonly format: sys.TextFormat = null;


        public readonly $canvasScaleX: number;
        public readonly $canvasScaleY: number;

        /**
         * ????
         */
        public __string__: string;

        constructor(textNode: sys.TextNode, format: sys.TextFormat) {
            super();

            this.textColor = textNode.textColor;
            this.strokeColor = textNode.strokeColor;
            this.size = textNode.size;
            this.stroke = textNode.stroke;
            this.bold = textNode.bold;
            this.italic = textNode.italic;
            this.fontFamily = textNode.fontFamily;
            this.format = format;
            this.font = getFontString(textNode, this.format);
            this.$canvasScaleX = parseFloat(textNode.$canvasScaleX.toFixed(2)); //不搞那么长
            this.$canvasScaleY = parseFloat(textNode.$canvasScaleY.toFixed(2));
            //
            this.__string__ = '' + this.font;
            const textColor = format.textColor == null ? textNode.textColor : format.textColor;
            const strokeColor = format.strokeColor == null ? textNode.strokeColor : format.strokeColor;
            const stroke = format.stroke == null ? textNode.stroke : format.stroke;
            this.__string__ += '-' + toColorString(textColor);
            this.__string__ += '-' + toColorString(strokeColor);
            if (stroke) {
                this.__string__ += '-' + stroke * 2;
            }
            this.__string__ += '-' + this.$canvasScaleX;
            this.__string__ += '-' + this.$canvasScaleY;
        }
    }

    class CharValue extends HashObject {

        public _char: string = '';
        public _styleKey: StyleKey = null;
        public _string: string = '';
        public _hashCode: number = 0;
        public measureWidth: number = 0;
        public measureHeight: number = 0;

        constructor() {
            super();
        }

        public reset(char: string, styleKey: StyleKey): CharValue {
            this._char = char;
            this._styleKey = styleKey;
            this._string = char + ':' + styleKey.__string__;
            this._hashCode = NumberUtils.convertStringToHashCode(this._string);
            return this;
        }

        public get renderWidth(): number {
            return this.measureWidth * this._styleKey.$canvasScaleX;
        }

        public get renderHeight(): number {
            return this.measureHeight * this._styleKey.$canvasScaleY;
        }

        public drawToCanvas(canvas: HTMLCanvasElement): void {
            if (!canvas) {
                return;
            }
            //
            const text = this._char;
            const format: sys.TextFormat = this._styleKey.format;
            const textColor = format.textColor == null ? this._styleKey.textColor : format.textColor;
            const strokeColor = format.strokeColor == null ? this._styleKey.strokeColor : format.strokeColor;
            const stroke = format.stroke == null ? this._styleKey.stroke : format.stroke;
            //
            const context = egret.sys.getContext2d(canvas);
            //Step1: 重新测试字体大小
            const measureText = this.measureText(context, text, this._styleKey.font);
            if (measureText) {
                this.measureWidth = measureText.width;
                this.measureHeight = this._styleKey.size;
            }
            else {
                console.error('text = ' + text + ', measureText is null');
                this.measureWidth = this._styleKey.size;
                this.measureHeight = this._styleKey.size;
            }
            //
            canvas.width = this.renderWidth;
            canvas.height = this.renderHeight;
            //再开始绘制
            context.save();
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.lineJoin = 'round';
            context.font = this._styleKey.font;
            context.fillStyle = toColorString(textColor);
            context.strokeStyle = toColorString(strokeColor);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.translate(0, 0);
            context.scale(this._styleKey.$canvasScaleX, this._styleKey.$canvasScaleY);
            //
            if (stroke) {
                context.lineWidth = stroke * 2;
                context.strokeText(text, 0, 0);
            }
            context.fillText(text, 0, 0);
            context.restore();
        }

        private measureText(context: CanvasRenderingContext2D, text: string, font: string): TextMetrics {
            const isChinese = __chineseCharactersRegExp__.test(text);
            if (isChinese) {
                if (__chineseCharacterMeasureFastMap__[font]) {
                    return __chineseCharacterMeasureFastMap__[font];
                }
            }
            context.font = font;
            const measureText = context.measureText(text);
            if (isChinese) {
                __chineseCharacterMeasureFastMap__[font] = measureText;
            }
            return measureText;
        }
    }

    //测试开关
    export const textAtlasRenderEnable: boolean = true;
    //测试对象
    export let __textAtlasRender__: TextAtlasRender = null;

    export class DrawTextBlocksCommand extends HashObject {
        public anchorX: number = 0;
        public anchorY: number = 0;
        public textBlocks: TextBlock[] = [];
    }

    //
    export class TextAtlasRender extends HashObject {
        //
        private readonly $charValue = new CharValue;
        private readonly textBlockMap: { [index: number]: TextBlock } = {};
        private _canvas: HTMLCanvasElement = null;
        private readonly textAtlasTextureCache: WebGLTexture[] = [];
        private readonly webglRenderContext: WebGLRenderContext = null;

        //
        constructor(webglRenderContext: WebGLRenderContext) {
            super();
            this.webglRenderContext = webglRenderContext;
        }

        public static readonly renderTextBlocks: TextBlock[] = [];
        public static readonly renderTextBlockCommands: DrawTextBlocksCommand[] = [];
        //public static readonly textAtlasBorder = 1;
        public static readonly book = new Book(512, 1);
        public static analysisTextNode(textNode: sys.TextNode): void {
            if (!textNode) {
                return;
            }
            //先配置这个模型
            //configTextTextureAtlasStrategy(512);
            //__book__ = __book__ || configTextTextureAtlasStrategy(512, 1);
            __textAtlasRender__ = __textAtlasRender__ || new TextAtlasRender(egret.web.WebGLRenderContext.getInstance(0, 0));
            //
            const offset = 4;
            const drawData = textNode.drawData;
            let anchorX = 0;
            let anchorY = 0;
            let labelString = '';
            let format: sys.TextFormat = {};
            TextAtlasRender.renderTextBlocks.length = 0;
            TextAtlasRender.renderTextBlockCommands.length = 0;
            for (let i = 0, length = drawData.length; i < length; i += offset) {
                anchorX = drawData[i + 0] as number;
                anchorY = drawData[i + 1] as number;
                labelString = drawData[i + 2] as string;
                format = drawData[i + 3] as sys.TextFormat || {};
                TextAtlasRender.renderTextBlocks.length = 0;
                __textAtlasRender__.convertLabelStringToTextAtlas(labelString, new StyleKey(textNode, format));

                //
                const drawCmd = new DrawTextBlocksCommand;
                drawCmd.anchorX = anchorX;
                drawCmd.anchorY = anchorY;
                drawCmd.textBlocks = [].concat(TextAtlasRender.renderTextBlocks);
                TextAtlasRender.renderTextBlockCommands.push(drawCmd);
            }
        }

        public convertLabelStringToTextAtlas(labelstring: string, styleKey: StyleKey): void {
            const canvas = this.canvas;
            const $charValue = this.$charValue;
            const textBlockMap = this.textBlockMap;
            for (const char of labelstring) {
                //不反复创建
                $charValue.reset(char, styleKey);
                if (textBlockMap[$charValue._hashCode]) {
                    //检查重复
                    TextAtlasRender.renderTextBlocks.push(textBlockMap[$charValue._hashCode]);
                    continue;
                }
                //尝试渲染到canvas
                $charValue.drawToCanvas(canvas);
                //console.log(char + ':' + canvas.width + ', ' + canvas.height);
                //创建新的文字块
                const txtBlock = TextAtlasRender.book.createTextBlock($charValue.renderWidth, $charValue.renderHeight, $charValue.measureWidth, $charValue.measureHeight);
                if (!txtBlock) {
                    continue;
                }
                //
                textBlockMap[$charValue._hashCode] = txtBlock;
                txtBlock.tag = char;
                TextAtlasRender.renderTextBlocks.push(txtBlock);
                //
                const page = txtBlock.page;
                page.webGLTexture = page.webGLTexture || this.createTextTextureAtlas(page.pageWidth, page.pageHeight);
                const textAtlas = page.webGLTexture;
                const gl = this.webglRenderContext.context;
                gl.bindTexture(gl.TEXTURE_2D, textAtlas);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
                gl.texSubImage2D(gl.TEXTURE_2D, 0, txtBlock.subImageOffsetX, txtBlock.subImageOffsetY, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
                gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
            }
        }

        private createTextTextureAtlas(width: number, height: number): WebGLTexture {
            const texture = egret.sys._createTexture(this.webglRenderContext, width, height, null);
            if (texture) {
                this.textAtlasTextureCache.push(texture);
            }
            return texture;
        }

        private get canvas(): HTMLCanvasElement {
            const size = 24;
            this._canvas = this._canvas || egret.sys.createCanvas(size, size);
            return this._canvas;
        }
    }
}
