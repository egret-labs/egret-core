/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../core/MainContext.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../utils/toColorString.ts"/>

module ns_egret {
    /**
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @todo GitHub 为什么文本渲染存在差异以及如何规避
     */
    export class TextField extends DisplayObject {
        /**
         * 显示文本
         */
        public text:string;

        /**
         * 字体
         */
        public fontFamily = "Arial";
        /**
         * 字号
         */
        public size:number = 30;

        public _textColorString:string = "#FFFFFF";

        private _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
         */
        public get textColor():number{
            return this._textColor;
        }
        public set textColor(value:number){
            if(this._textColor==value)
                return;
            this._textColor = value;
            this._textColorString = toColorString(value);
        }

        public _strokeColorString:string = "#000000";

        private _strokeColor:number = 0x000000;
        /**
         * 描边颜色
         */
        public get strokeColor():number{
            return this._strokeColor;
        }
        public set strokeColor(value:number){
            if(this._strokeColor==value)
                return;
            this._strokeColor = value;
            this._strokeColorString = toColorString(value);
        }

        /**
         * 描边宽度，0为没有描边
         */
        public stroke:number = 0;
        /**
         * 文本水平对齐方式,使用TextAlign定义的常量，默认值TextAlign.LEFT。
         * @stable B API名称可能修改
         */
        public textAlign:string;
        /**
         * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
         * @stable B API名称可能修改
         */
        public verticalAlign:string;

        /**
         * 文本基准线
         * @stable B 可能移除，用户不需要设置这个属性。
         */
        public textBaseline;

        public maxWidth;

        /**
         * 行间距
         */
        public lineSpacing:number;

        /**
         * 字符间距
         */
        public letterSpacing:number;

        private _numLines:number = 0;
        /**
         * 文本行数
         */
        public get numLines():number{
            return this._numLines;
        }

        private __hackIgnoreDrawText:boolean = false;

        constructor() {
            super();

            this.lineSpacing = 0;
            this.letterSpacing = 0;
            this.textAlign = "left";
        }

        /**
         * @see egret.DisplayObject.render
         * @param renderContext
         */
        public render(renderContext:RendererContext) {
            if (!this.text) {
                return;
            }

            renderContext.setupFont(this.size + "px " + this.fontFamily, this.textAlign, this.textBaseline);
            this.drawText(renderContext);
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():ns_egret.Rectangle {
            var renderContext = ns_egret.MainContext.instance.rendererContext;
            renderContext.setupFont(this.size + "px " + this.fontFamily, this.textAlign, this.textBaseline);
            return this.drawText(renderContext, true);
        }

        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext:RendererContext, forMeasureContentSize:boolean = false):Rectangle {
            if (forMeasureContentSize) {
                this.__hackIgnoreDrawText = true;
            }

            var explicitW:number = this._explicitWidth;
            var maxW = 0;
            //按 行获取数据
            var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
            var drawH = 0;
            var rap = this.size + this.lineSpacing;

            var linesNum = 0;
            if (isNaN(explicitW)) {
                //没有设置 宽度
                linesNum = lines.length;
                //第一遍，算出 最长寛
                for (var i = 0, l = linesNum; i < l; i++) {
                    //获得 一行数据
                    var str = lines[i];

                    var w:number = renderContext.measureText(str);
                    if (w > maxW) {
                        maxW = w;
                    }
                }

                //第二遍，绘制
                for (var i = 0, l = linesNum; i < l; i++) {
                    //获得 一行数据
                    var str = lines[i];
                    this._drawTextLine(renderContext, str, drawH, maxW);
                    drawH += rap;
                }
            }
            else {
                maxW = explicitW;

                //设置宽度
                for (var i = 0, l = lines.length; i < l; i++) {
                    //获得 一行数据
                    var str = lines[i];

                    //获取 字符串 真实显示的 寛高
                    var w:number = renderContext.measureText(str);
                    if (w > explicitW) {
                        var tempStr = str;
                        var tempLineW = 0;
                        str = "";
                        for (var j = 0; j < tempStr.length; j++) {
                            var wordW = renderContext.measureText(tempStr[j]);
                            if (tempLineW + wordW > explicitW) {
                                if (tempLineW == 0) {
                                    tempLineW += wordW;
                                    str += tempStr[j];
                                    maxW = wordW;
                                }
                                else {
                                    //超出 绘制当前已经取得的字符串
                                    this._drawTextLine(renderContext, str, drawH, maxW);
                                    linesNum++;
                                    j--;
                                    str = "";
                                    tempLineW = 0;
                                    drawH += rap;
                                }
                            }
                            else {
                                tempLineW += wordW;
                                str += tempStr[j];
                            }
                        }
                    }

                    this._drawTextLine(renderContext, str, drawH, maxW);
                    linesNum++;
                    drawH += rap;
                }
            }
            this._numLines = linesNum;

            var rect:Rectangle = Rectangle.identity;
            if (forMeasureContentSize) {
                rect.x = rect.y = 0;
                rect.width = maxW;
                rect.height = linesNum * rap;
                this.__hackIgnoreDrawText = false;
            }

            return rect;
        }

        /**
         * 渲染单行文字
         * @private
         * @param renderContext
         * @param text
         * @param y
         * @private
         */
         public _drawTextLine(renderContext:RendererContext, text, y, maxWidth) {
            if (this.__hackIgnoreDrawText) return;
            var x;
            if (this.textAlign == "left") {
                x = 0;
            }
            else if (this.textAlign == "center") {
                x = maxWidth / 2;
            }
            else {
                x = maxWidth;
            }

            renderContext.drawText(this,text,x,y,maxWidth);
        }
    }
}