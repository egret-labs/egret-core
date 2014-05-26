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

/// <reference path="../context/MainContext.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../utils/toColorString.ts"/>

module ns_egret {
    /**
	 * @class ns_egret.TextField
	 * @classdesc
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
	 * @extends ns_egret.DisplayObject
     */
    export class TextField extends DisplayObject {
        /**
         * 显示文本
		 * @member {string} ns_egret.TextField#text
         */
        public text:string;

        /**
         * 字体
		 * @member {any} ns_egret.TextField#fontFamily
         */
        public fontFamily = "Arial";
        /**
         * 字号
		 * @member {number} ns_egret.TextField#size
         */
        public size:number = 30;

        public _textColorString:string = "#FFFFFF";

        private _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
		 * @member {number} ns_egret.TextField#textColor
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
		 * @member {number} ns_egret.TextField#strokeColor
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
		 * @member {number} ns_egret.TextField#stroke
         */
        public stroke:number = 0;
        /**
         * 文本水平对齐方式,使用HorizontalAlign定义的常量，默认值HorizontalAlign.LEFT。
		 * @member {string} ns_egret.TextField#textAlign
         */
        public textAlign:string = "left";
        /**
         * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
		 * @member {string} ns_egret.TextField#verticalAlign
         */
        public verticalAlign:string = "top";

        /**
         * 文本基准线
		 * @member {any} ns_egret.TextField#textBaseline
         */
        public textBaseline;

		/**
		 * @member {any} ns_egret.TextField#maxWidth
		 */
        public maxWidth;

        /**
         * 行间距
		 * @member {number} ns_egret.TextField#lineSpacing
         */
        public lineSpacing:number = 0;

        /**
         * 字符间距
		 * @member {number} ns_egret.TextField#letterSpacing
         */
        public letterSpacing:number = 0;

        private _numLines:number = 0;
        /**
         * 文本行数
		 * @member {number} ns_egret.TextField#numLines
         */
        public get numLines():number{
            return this._numLines;
        }

        private __hackIgnoreDrawText:boolean = false;

        constructor() {
            super();
        }

        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {
            if (!this.text) {
                return;
            }

            renderContext.setupFont(this);
            this.drawText(renderContext);
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():ns_egret.Rectangle {
            var renderContext = ns_egret.MainContext.instance.rendererContext;
            renderContext.setupFont(this);
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
         public _drawTextLine(renderContext:RendererContext, text, y, maxWidth):void {
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