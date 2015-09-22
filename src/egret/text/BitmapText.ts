//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
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


module egret {
    /**
     * @classdesc
     * @class egret.BitmapText
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @extends egret.DisplayObject
     * @includeExample egret/text/BitmapText.ts
     */
    export class BitmapText extends DisplayObject {

        /**
         * 创建一个 egret.BitmapText 对象
         */
        public constructor() {
            super();
            this.cacheAsBitmap = true;
            this.needDraw = true;
        }

        /**
         * 设置文本
         */
        private _text:string = "";
        private _textChanged:boolean = false;

        /**
         * 显示的文本内容
         * @member {string} egret.BitmapText#text
         */
        public get text():string {
            return this._text;
        }

        public set text(value:string) {
            this.$setText(value);
        }

        $setText(value:string):void {
            if (this._text == value) {
                return;
            }
            this._textChanged = true;
            this._text = value;

            this._setSizeDirty();
        }

        public _font:BitmapFont = null;
        private _fontChanged:boolean = false;

        /**
         * BitmapFont对象，缓存了所有文本的位图纹理
         * @member {egret.BitmapFont} egret.BitmapText#font
         */
        public get font():BitmapFont {
            return this._font;
        }

        public set font(value:BitmapFont) {
            this.$setFont(value);
        }

        $setFont(value:BitmapFont):void {
            if (this._font == value)
                return;
            this._font = value;
            this._fontChanged = true;
            this._setSizeDirty();
        }

        public _letterSpacing:number = 0;
        /**
         * 字符之间的距离
         * @default 0
         * @version 1.7.2
         * @param value
         */
        public set letterSpacing(value:number) {
            this._setLetterSpacing(value);
        }

        public _setLetterSpacing(value:number):void {
            this._letterSpacing = value;

            this._setSizeDirty();
        }

        public get letterSpacing():number {
            return this._letterSpacing;
        }

        public _lineSpacing:number = 0;
        /**
         * 行与行之间的距离
         * @default 0
         * @version 1.7.2
         * @param value
         */
        public set lineSpacing(value:number) {
            this._setLineSpacing(value);
        }

        public _setLineSpacing(value:number):void {
            this._lineSpacing = value;
        }

        public get lineSpacing():number {
            return this._lineSpacing;
        }

        public _setSizeDirty():void {
            super._setSizeDirty();
            this.textLinesChange = true;
        }

        /**
         * @private
         */
        public static EMPTY_FACTOR:number = 0.33;

        public _render(renderContext:RendererContext):void {
            var self = this;
            var textLines:Array<string> = self._getTextLines();
            var length:number = textLines.length;
            if (length == 0) {
                return;
            }
            var bitmapFont:BitmapFont = self._font;
            var emptyHeight:number = bitmapFont._getFirstCharHeight();
            var emptyWidth:number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var yPos:number = 0;
            var maxHeight:number = self._DO_Props_._hasHeightSet ? self._DO_Props_._explicitHeight : Number.POSITIVE_INFINITY;
            var lineHeights:Array<number> = self._lineHeights;
            for (var i:number = 0; i < length; i++) {
                var lineHeight:number = lineHeights[i];
                if (i > 0 && yPos + lineHeight > maxHeight) {
                    break;
                }
                var line:string = textLines[i];
                var len:number = line.length;
                var xPos:number = 0;
                for (var j:number = 0; j < len; j++) {
                    var character = line.charAt(j);
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            $warn(1011, character);
                        }
                        continue;
                    }
                    var bitmapWidth:number = texture._bitmapWidth || texture._textureWidth;
                    var bitmapHeight:number = texture._bitmapHeight || texture._textureHeight;
                    self._texture_to_render = texture;
                    RenderFilter.getInstance().drawImage(renderContext, self, texture._bitmapX, texture._bitmapY,
                        bitmapWidth, bitmapHeight, xPos + texture._offsetX, yPos + texture._offsetY, bitmapWidth, bitmapHeight);
                    xPos += texture._textureWidth + self._letterSpacing;
                }
                yPos += lineHeight + self._lineSpacing;
            }
            self._texture_to_render = null;
        }

        public _measureBounds():egret.Rectangle {
            var lines:Array<string> = this._getTextLines();
            if (lines.length == 0) {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }
            return Rectangle.identity.initialize(this._textOffsetX, this._textOffsetY, this._textWidth - this._textOffsetX, this._textHeight - this._textOffsetY + (lines.length - 1) * this._lineSpacing);
        }

        private _textWidth:number = 0;
        private _textHeight:number = 0;
        private _textOffsetX:number = 0;
        private _textOffsetY:number = 0;

        private textLinesChange:boolean = true;
        private _textLines:Array<string>;
        public _lineHeights:Array<number> = [];

        public _getTextLines():Array<string> {
            var self = this;
            if (!self.textLinesChange) {
                return self._textLines;
            }
            var textLines:Array<string> = [];
            self._textLines = textLines;
            self.textLinesChange = false;
            var lineHeights:Array<number> = [];
            self._lineHeights = lineHeights;
            if (!self._text || !self._font) {
                return textLines;
            }
            var textWidth:number = 0;
            var textHeight:number = 0;
            var textStartX:number = 0;
            var textStartY:number = 0;
            var hasWidthSet:boolean = self._DO_Props_._hasWidthSet;
            var maxWidth:number = self._DO_Props_._hasWidthSet ? self._DO_Props_._explicitWidth : Number.POSITIVE_INFINITY;
            var bitmapFont:BitmapFont = self._font;
            var emptyHeight:number = bitmapFont._getFirstCharHeight();
            var emptyWidth:number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var text:string = self._text;
            var textArr:Array<string> = text.split(/(?:\r\n|\r|\n)/);
            var length:number = textArr.length;
            var isFirstLine:boolean = true;
            for (var i = 0; i < length; i++) {
                var line:string = textArr[i];
                var len = line.length;
                var lineHeight:number = 0;
                var xPos:number = 0;
                var isFirstChar:boolean = true;
                for (var j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += self._letterSpacing;
                    }

                    var character = line.charAt(j);
                    var texureWidth:number;
                    var textureHeight:number;
                    var offsetX:number = 0;
                    var offsetY:number = 0;
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            $warn(1011, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture._textureWidth;
                        textureHeight = texture._textureHeight;
                        offsetX = texture._offsetX;
                        offsetY = texture._offsetY;
                    }
                    if (isFirstChar) {
                        isFirstChar = false;
                        textStartX = Math.min(offsetX, textStartX);
                    }
                    if (isFirstLine) {
                        textStartY = Math.min(offsetY, textStartY);
                    }
                    if (hasWidthSet && j > 0 && xPos + texureWidth > maxWidth) {
                        textLines.push(line.substring(0, j));
                        lineHeights.push(lineHeight);
                        textHeight += lineHeight;
                        textWidth = Math.max(xPos, textWidth);
                        line = line.substring(j);
                        len = line.length;
                        j = 0;
                        xPos = texureWidth;
                        lineHeight = textureHeight;
                        continue;
                    }
                    xPos += texureWidth;
                    lineHeight = Math.max(textureHeight, lineHeight);
                }
                if (isFirstLine) {
                    isFirstLine = false;
                }
                textLines.push(line);
                lineHeights.push(lineHeight);
                textHeight += lineHeight;
                textWidth = Math.max(xPos, textWidth);
            }
            self._textWidth = textWidth;
            self._textHeight = textHeight;
            self._textOffsetX = textStartX;
            self._textOffsetY = textStartY;
            return textLines;
        }
    }
}
