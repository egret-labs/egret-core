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
/// <reference path="DisplayObject.ts"/>
/// <reference path="../geom/Rectangle.ts"/>

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
//        private _text:string;
//        public get text():string {
//            return this._text;
//        }
//
//        public set text(value:string) {
//            this._text = value;
//        }

        /**
         * 字体
         */
        public font = "Arial";
        /**
         * 字号
         */
        public size:number = 30;
        /**
         * 文字颜色
         */
        public textColor = "#ffffff";
        /**
         * 描边颜色
         */
        public strokeColor = "#000000";

        /**
         * 描边宽度，0为没有描边
         */
        public stroke:number = 0;
        /**
         * 文字水平对齐方式
         * @stable B API名称可能修改
         */
        public textAlign;
        /**
         * 文字垂直对齐方式
         * @stable B API名称可能修改
         */
        public textBaseline;
        public lineWidth;

        public maxWidth;

        /**
         * 垂直 行间距
         */
        public vSpacing:number;

        /**
         * 水平 字间距
         */
        public hSpacing:number;

        private __hackIgnoreDrawText:boolean = false;

        constructor() {
            super();

            this.vSpacing = 0;
            this.hSpacing = 0;
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

            renderContext.setupFont(this.size + "px " + this.font, this.textAlign, this.textBaseline);
            this.drawText(renderContext);
        }

        public getBounds():ns_egret.Rectangle {
            var renderContext = ns_egret.MainContext.instance.rendererContext;
            renderContext.setupFont(this.size + "px " + this.font, this.textAlign, this.textBaseline);
            this.drawText(renderContext, true);
            var anchorX, anchorY;
            if (this.relativeAnchorPointX != 0 || this.relativeAnchorPointY != 0) {
                anchorX = this._contentWidth * this.relativeAnchorPointX;
                anchorY = this._contentHeight * this.relativeAnchorPointY;
            }
            else {
                anchorX = this.anchorPointX;
                anchorY = this.anchorPointY;
            }
            return Rectangle.identity.initialize(-anchorX, -anchorY,
                this._contentWidth, this._contentHeight);
        }

        /**
         * @private
         * @param renderContext
         * @returns {null}
         */
        private drawText(renderContext:RendererContext, forMeasureContentSize:boolean = false) {
            if (forMeasureContentSize) {
                this.__hackIgnoreDrawText = true;
            }
            var o = null;

            var maxW = 0;
            //按 行获取数据
            var lines = String(this.text).split(/(?:\r\n|\r|\n)/);
            var drawH = 0;
            var rap = this.size + this.vSpacing;

            var linesNum = 0;
            if (this.lineWidth == null || this.lineWidth == 0) {
                //没有设置 宽度
                linesNum = lines.length;
                //第一遍，算出 最长寛
                for (var i = 0, l = linesNum; i < l; i++) {
                    //获得 一行数据
                    var str = lines[i];

                    var rect = renderContext.measureText(str);
                    if (rect.width > maxW) {
                        maxW = rect.width;
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
                maxW = this.lineWidth;

                //设置宽度
                for (var i = 0, l = lines.length; i < l; i++) {
                    //获得 一行数据
                    var str = lines[i];

                    //获取 字符串 真实显示的 寛高
                    var rect = renderContext.measureText(str);
                    if (rect.width > this.lineWidth) {
                        var tempStr = str;
                        var tempLineW = 0;
                        str = "";
                        for (var j = 0; j < tempStr.length; j++) {
                            var wordW = renderContext.measureText(tempStr[j]).width;
                            if (tempLineW + wordW > this.lineWidth) {
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

            if (forMeasureContentSize) {
                super.setContentSize(maxW, linesNum * rap);
                this.__hackIgnoreDrawText = false;
            }

            return o;
        }

        /**
         * 显式设置显示对象的size
         * @param contentWidth
         * @param contentHeight
         */
            setContentSize(contentWidth:number, contentHeight:number) {
            super.setContentSize(contentWidth, contentHeight);

            this.lineWidth = contentWidth;
        }

        /**
         * 渲染单行文字
         * @private
         * @param renderContext
         * @param text
         * @param y
         * @private
         */
            _drawTextLine(renderContext:RendererContext, text, y, maxWidth) {
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