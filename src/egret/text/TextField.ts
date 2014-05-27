/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/// <reference path="../context/MainContext.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="../geom/Rectangle.ts"/>
/// <reference path="../utils/toColorString.ts"/>

module egret {
    /**
	 * @class egret.TextField
	 * @classdesc
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
	 * @extends egret.DisplayObject
     */
    export class TextField extends DisplayObject {
        /**
         * 显示文本
		 * @member {string} egret.TextField#text
         */
        public text:string;

        /**
         * 字体
		 * @member {any} egret.TextField#fontFamily
         */
        public fontFamily = "Arial";
        /**
         * 字号
		 * @member {number} egret.TextField#size
         */
        public size:number = 30;

        public _textColorString:string = "#FFFFFF";

        private _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
		 * @member {number} egret.TextField#textColor
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
		 * @member {number} egret.TextField#strokeColor
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
		 * @member {number} egret.TextField#stroke
         */
        public stroke:number = 0;
        /**
         * 文本水平对齐方式,使用HorizontalAlign定义的常量，默认值HorizontalAlign.LEFT。
		 * @member {string} egret.TextField#textAlign
         */
        public textAlign:string = "left";
        /**
         * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
		 * @member {string} egret.TextField#verticalAlign
         */
        public verticalAlign:string = "top";

        /**
         * 文本基准线
		 * @member {any} egret.TextField#textBaseline
         */
        public textBaseline;

		/**
		 * @member {any} egret.TextField#maxWidth
		 */
        public maxWidth;

        /**
         * 行间距
		 * @member {number} egret.TextField#lineSpacing
         */
        public lineSpacing:number = 0;

        /**
         * 字符间距
		 * @member {number} egret.TextField#letterSpacing
         */
        public letterSpacing:number = 0;

        private _numLines:number = 0;
        /**
         * 文本行数
		 * @member {number} egret.TextField#numLines
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
        public _measureBounds():egret.Rectangle {
            var renderContext = egret.MainContext.instance.rendererContext;
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