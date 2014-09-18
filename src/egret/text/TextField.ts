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
        public _text:string;

        public get text():string {
            return this._text;
        }

        public _setTextDirty():void {
            this._setSizeDirty();

        }

        public set text(value:string) {
            this._setText(value);
        }

        public _setText(value:string):void {
            if (this._text != value) {
                this._setTextDirty();
                this._text = value;
            }
        }

        /**
         * 字体
         * @member {any} egret.TextField#fontFamily
         */
        public _fontFamily = "Arial";

        public get fontFamily():string {
            return this._fontFamily;
        }

        public set fontFamily(value:string) {
            this._setFontFamily(value);
        }

        public _setFontFamily(value:string):void {
            if (this._fontFamily != value) {
                this._setTextDirty();
                this._fontFamily = value;
            }
        }

        /**
         * 字号
         * @member {number} egret.TextField#size
         */
        public _size:number = 30;

        public get size():number {
            return this._size;
        }

        public set size(value:number) {
            this._setSize(value);
        }

        public _setSize(value:number):void {
            if (this._size != value) {
                this._setTextDirty();
                this._size = value;
            }
        }

        /**
         * 是否显示为斜体，默认false。
         * @member {boolean} egret.TextField#italic
         */
        public _italic:boolean;

        public get italic():boolean {
            return this._italic;
        }

        public set italic(value:boolean) {
            this._setItalic(value);
        }

        public _setItalic(value:boolean):void {
            if (this._italic != value) {
                this._setTextDirty();
                this._italic = value;
            }
        }

        /**
         * 是否显示为粗体，默认false。
         * @member {boolean} egret.TextField#bold
         */
        public _bold:boolean;

        public get bold():boolean {
            return this._bold;
        }

        public set bold(value:boolean) {
            this._setBold(value);
        }

        public _setBold(value:boolean):void {
            if (this._bold != value) {
                this._setTextDirty();
                this._bold = value;
            }
        }

        public _textColorString:string = "#FFFFFF";

        public _textColor:number = 0xFFFFFF;
        /**
         * 文字颜色
         * @member {number} egret.TextField#textColor
         */
        public get textColor():number {
            return this._textColor;
        }

        public set textColor(value:number) {
            this._setTextColor(value);
        }

        public _setTextColor(value:number):void {
            if (this._textColor != value) {
                this._setTextDirty();
                this._textColor = value;
                this._textColorString = toColorString(value);
            }
        }

        public _strokeColorString:string = "#000000";

        private _strokeColor:number = 0x000000;
        /**
         * 描边颜色
         * @member {number} egret.TextField#strokeColor
         */
        public get strokeColor():number {
            return this._strokeColor;
        }

        public set strokeColor(value:number) {
            this._setStrokeColor(value);
        }

        public _setStrokeColor(value:number):void {
            if (this._strokeColor != value) {
                this._setTextDirty();
                this._strokeColor = value;
                this._strokeColorString = toColorString(value);
            }
        }

        /**
         * 描边宽度，0为没有描边
         * @member {number} egret.TextField#stroke
         */
        public _stroke:number = 0;

        public get stroke():number {
            return this._stroke;
        }

        public set stroke(value:number) {
            this._setStroke(value);
        }

        public _setStroke(value:number):void {
            if (this._stroke != value) {
                this._setTextDirty();
                this._stroke = value;
            }
        }

        /**
         * 文本水平对齐方式,使用HorizontalAlign定义的常量，默认值HorizontalAlign.LEFT。
         * @member {string} egret.TextField#textAlign
         */
        public _textAlign:string = "left";

        public get textAlign():string {
            return this._textAlign;
        }

        public set textAlign(value:string) {
            this._setTextAlign(value);
        }

        public _setTextAlign(value:string):void {
            if (this._textAlign != value) {
                this._setTextDirty();
                this._textAlign = value;
            }
        }

        /**
         * 文本垂直对齐方式,使用VerticalAlign定义的常量，默认值VerticalAlign.TOP。
         * @member {string} egret.TextField#verticalAlign
         */
        public _verticalAlign:string = "top";

        public get verticalAlign():string {
            return this._verticalAlign;
        }

        public set verticalAlign(value:string) {
            this._setVerticalAlign(value);
        }

        public _setVerticalAlign(value:string):void {
            if (this._verticalAlign != value) {
                this._setTextDirty();
                this._verticalAlign = value;
            }
        }

        /**
         * @member {any} egret.TextField#maxWidth
         */
        public maxWidth;

        /**
         * 行间距
         * @member {number} egret.TextField#lineSpacing
         */
        public _lineSpacing:number = 0;

        public get lineSpacing():number {
            return this._lineSpacing;
        }

        public set lineSpacing(value:number) {
            this._setLineSpacing(value);
        }

        public _setLineSpacing(value:number):void {
            if (this._lineSpacing != value) {
                this._setTextDirty();
                this._lineSpacing = value;
            }
        }

        private _numLines:number = 0;
        /**
         * 文本行数
         * @member {number} egret.TextField#numLines
         */
        public get numLines():number {
            return this._numLines;
        }

        constructor() {
            super();
        }

        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {
            this.drawText(renderContext, false);

            this._clearDirty();
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():egret.Rectangle {
            var renderContext = egret.MainContext.instance.rendererContext;
            return this.drawText(renderContext, true);
        }

        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext:RendererContext, forMeasure:boolean):Rectangle {

            var lines:Array<string> = this.getTextLines(renderContext);
            if (!lines) {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }
            var length:number = lines.length;
            var drawY:number = this._size * 0.5;
            var hGap:number = this._size + this._lineSpacing;
            var textHeight:number = length * hGap - this._lineSpacing;
            this._textHeight = textHeight;
            var explicitHeight:number = this._hasHeightSet?this._explicitHeight:Number.POSITIVE_INFINITY;
            if (this._hasHeightSet&&textHeight < explicitHeight) {
                var valign:number = 0;
                if (this._verticalAlign == VerticalAlign.MIDDLE)
                    valign = 0.5;
                else if (this._verticalAlign == VerticalAlign.BOTTOM)
                    valign = 1;
                drawY += valign * (explicitHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var minY:number = drawY;
            var halign:number = 0;
            if (this._textAlign == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (this._textAlign == HorizontalAlign.RIGHT) {
                halign = 1;
            }
            var measuredWidths = this.measuredWidths;
            var maxWidth:number;
            if (this._hasWidthSet) {
                maxWidth = this._explicitWidth;
            }
            else {
                maxWidth = this._textWidth;
            }
            var minX:number = Number.POSITIVE_INFINITY;
            for (var i:number = 0; i < length; i++) {
                var line:string = lines[i];
                var measureW:number = measuredWidths[i];
                var drawX:number = Math.round((maxWidth - measureW) * halign);
                if (drawX < minX) {
                    minX = drawX;
                }
                if (!forMeasure && drawY < explicitHeight) {
                    renderContext.drawText(this, line, drawX, drawY, maxWidth);
                }
                drawY += hGap;
            }
            return Rectangle.identity.initialize(minX, minY, maxWidth, textHeight);
        }

        private _textWidth:number;
        private _textHeight:number;
        private measuredWidths:Array<number> = [];

        private getTextLines(renderContext:RendererContext):Array<string>{
            var text:string = this._text ? this._text.toString() : "";
            if(!text){
                return null;
            }
            var measuredWidths = this.measuredWidths;
            measuredWidths.length = 0;
            renderContext.setupFont(this);
            var lines:Array<string> = text.split(/(?:\r\n|\r|\n)/);
            var length:number = lines.length;
            var maxWidth:number = 0;
            if (this._hasWidthSet) {
                var explicitWidth:number = this._explicitWidth;
                for (var i:number = 0; i < length; i++) {
                    var line:string = lines[i];
                    var measureW:number = renderContext.measureText(line);
                    if (measureW > explicitWidth) {
                        var newLine:string = "";
                        var lineWidth:number = 0;
                        var len:number = line.length;
                        for (var j:number = 0; j < len; j++) {
                            var word:string = line.charAt(j);
                            measureW = renderContext.measureText(word);
                            if(lineWidth+measureW>explicitWidth){

                                if(lineWidth==0){
                                    lines.splice(i,0,word);
                                    measuredWidths[i] = measureW;
                                    if (maxWidth < measureW) {
                                        maxWidth = measureW;
                                    }
                                    measureW = 0;
                                    word = "";
                                }
                                else {
                                    lines.splice(i, 0, newLine);
                                    measuredWidths[i] = lineWidth;
                                    if (maxWidth < lineWidth) {
                                        maxWidth = lineWidth;
                                    }
                                    newLine = "";
                                    lineWidth = 0;
                                }
                                i++;
                                length++;
                            }
                            lineWidth += measureW;
                            newLine += word;
                        }
                        lines[i]=newLine;
                        measuredWidths[i] = lineWidth;
                    }
                    else {
                        measuredWidths[i] = measureW;
                        if (maxWidth < measureW) {
                            maxWidth = measureW;
                        }
                    }
                }
            }
            else {
                for (i = 0; i < length; i++) {
                    line = lines[i];
                    measureW = renderContext.measureText(line);
                    measuredWidths[i] = measureW;
                    if (maxWidth < measureW) {
                        maxWidth = measureW;
                    }
                }
            }
            this._textWidth = maxWidth;
            return lines;
        }
    }
}