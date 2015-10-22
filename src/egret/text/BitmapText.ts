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
module egret.sys {
    /**
     * @private
     */
    export const enum BitmapTextKeys {
        /**
         * @private 外部设定的值
         */
        textFieldWidth,
        /**
         * @private 外部设定的值
         */
        textFieldHeight,        
        /**
         * @private
         */
        text,
        /**
         * @private
         */
        lineSpacing,
        /**
         * @private
         */
        letterSpacing,
        /**
         * @private
         */
        font,
        /**
         * @private
         */
        fontStringChanged,
        /**
         * @private
         */
        textLinesChanged,
        /**
         * @private 测量的值
         */
        textWidth,
        /**
         * @private 测量的值
         */
        textHeight,
    }
}
module egret {
    /**
     * @language en_US
     * Bitmap font adopts the Bitmap+SpriteSheet mode to render text.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    /**
     * @language zh_CN
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     */
    export class BitmapText extends DisplayObject {

        /**
         * @language en_US
         * Create an egret.BitmapText object
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.BitmapText 对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            //this.cacheAsBitmap = true;

            this.$renderRegion = new sys.Region();
            this.$BitmapText = {
                0: NaN,    //textFieldWidth,
                1: NaN,    //textFieldHeight,
                2: "",      //text,
                3: 0,       //lineSpacing,
                4: 0,        //letterSpacing,
                5: null,        //font,
                6: false,        //fontStringChanged,
                7: false,        //textLinesChanged,
                8: false,       //textWidth,
                9: false        //textHeight,
            };
        }

        /**
         * @private
         */
        $BitmapText: Object;

        /**
         * @language en_US
         * A string to display in the text field.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要显示的文本内容
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get text(): string {
            return this.$BitmapText[sys.BitmapTextKeys.text];
        }

        public set text(value: string) {
            this.$setText(value);
        }

        /**
         * @private
         */
        $setText(value: string): boolean {
            var values = this.$BitmapText;
            if (value == values[sys.BitmapTextKeys.text])
                return false;
            values[sys.BitmapTextKeys.text] = value;
            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @private
         */
        $getWidth(): number {
            var w = this.$BitmapText[sys.BitmapTextKeys.textFieldWidth];
            return isNaN(w) ? this.$getContentBounds().width : w;
        }

        /**
         * @private
         */
        $setWidth(value: number): boolean {
            //value = +value || 0;
            var values = this.$BitmapText;
            if (value < 0 || value == values[sys.BitmapTextKeys.textFieldWidth]) {
                return false;
            }
            values[sys.BitmapTextKeys.textFieldWidth] = value;
            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @private
         */
        $invalidateContentBounds(): void {
            super.$invalidateContentBounds();
            this.$BitmapText[sys.BitmapTextKeys.textLinesChanged] = true;
        }

        /**
         * @private
         */
        $getHeight(): number {
            var h = this.$BitmapText[sys.BitmapTextKeys.textFieldHeight];
            return isNaN(h) ? this.$getContentBounds().height : h;
        }

        /**
         * @private
         */
        $setHeight(value: number): boolean {
            //value = +value || 0;
            var values = this.$BitmapText;
            if (value < 0 || value == values[sys.BitmapTextKeys.textFieldHeight]) {
                return false;
            }
            values[sys.BitmapTextKeys.textFieldHeight] = value;
            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @language en_US
         * The name of the font to use, or a comma-separated list of font names, the type of value must be BitmapFont.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont。
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get font(): Object {
            return this.$BitmapText[sys.BitmapTextKeys.font];
        }

        public set font(value: Object) {
            this.$setFont(value);
        }

        $setFont(value: any): boolean {
            var values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.font] == value) {
                return false;
            }
            values[sys.BitmapTextKeys.font] = value;

            this.$BitmapText[sys.BitmapTextKeys.fontStringChanged] = true;
            this.$invalidateContentBounds();

            return true;
        }

        /**
        /**
         * @language en_US
         * An integer representing the amount of vertical space between lines.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示行与行之间的垂直间距量
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get lineSpacing(): number {
            return this.$BitmapText[sys.BitmapTextKeys.lineSpacing];
        }

        public set lineSpacing(value: number) {
            this.$setLineSpacing(value);
        }

        $setLineSpacing(value: number): boolean {
            value = +value || 0;
            var values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.lineSpacing] == value)
                return false;
            values[sys.BitmapTextKeys.lineSpacing] = value;
            this.$invalidateContentBounds();
            return true;
        }

        /**
         * @language en_US
         * An integer representing the amount of distance between characters.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示字符之间的距量。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get letterSpacing(): number {
            return this.$BitmapText[sys.BitmapTextKeys.letterSpacing];
        }

        public set letterSpacing(value: number) {
            this.$setLetterSpacing(value);
        }

        $setLetterSpacing(value: number): boolean {
            value = +value || 0;
            var values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.letterSpacing] == value)
                return false;
            values[sys.BitmapTextKeys.letterSpacing] = value;
            this.$invalidateContentBounds();

            return true;
        }

        /**
         * @language en_US
         * A ratio of the width of the space character. This value is multiplied by the height of the first character is the space character width.
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个空格字符的宽度比例。这个数值乘以第一个字符的高度即为空格字符的宽。
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static EMPTY_FACTOR: number = 0.33;

        /**
         * @private
         */
        $render(context:sys.RenderContext): void {
            var self = this;
            var textLines: Array<string> = self.$getTextLines();
            var length: number = textLines.length;
            if (length == 0) {
                return;
            }
            var bitmapFont: BitmapFont = self.$BitmapText[sys.BitmapTextKeys.font];
            var emptyHeight: number = bitmapFont._getFirstCharHeight();
            var emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var yPos: number = 0;
            var hasSetHeight: boolean = !isNaN(self.$BitmapText[sys.BitmapTextKeys.textFieldHeight]);
            var textFieldHeight: number = self.$BitmapText[sys.BitmapTextKeys.textFieldHeight];
            var lineHeights: Array<number> = self.$lineHeights;
            for (var i: number = 0; i < length; i++) {
                var lineHeight: number = lineHeights[i];
                if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) {
                    break;
                }
                var line: string = textLines[i];
                var len: number = line.length;
                var xPos: number = 0;
                for (var j: number = 0; j < len; j++) {
                    var character = line.charAt(j);
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            egret.$warn(1011, character);
                        }
                        continue;
                    }
                    var bitmapWidth: number = texture._bitmapWidth;
                    var bitmapHeight: number = texture._bitmapHeight;

                    context.drawImage(texture._bitmapData, texture._bitmapX, texture._bitmapY,
                        bitmapWidth, bitmapHeight, xPos + texture._offsetX, yPos + texture._offsetY, texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());

                    xPos += texture.$getTextureWidth() + self.$BitmapText[sys.BitmapTextKeys.letterSpacing];
                }
                yPos += lineHeight + self.$BitmapText[sys.BitmapTextKeys.lineSpacing];
            }
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            var lines: Array<string> = this.$getTextLines();
            if (lines.length == 0) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.textOffsetX, this.textOffsetY, this.$BitmapText[sys.BitmapTextKeys.textWidth] - this.textOffsetX,
                    this.$BitmapText[sys.BitmapTextKeys.textHeight] - this.textOffsetY + (lines.length - 1) * this.$BitmapText[sys.BitmapTextKeys.lineSpacing]);
            }
        }

        /**
         * @language en_US
         * Get the BitmapText measured width
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位图文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get textWidth(): number {
            this.$getTextLines();
            return this.$BitmapText[sys.BitmapTextKeys.textWidth];
        }
        /**
         * @language en_US
         * Get Text BitmapText height
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 获取位图文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get textHeight(): number {
            this.$getTextLines();
            return this.$BitmapText[sys.BitmapTextKeys.textHeight];
        }
        /**
         * @private
         */
        private textOffsetX: number = 0;
        /**
         * @private
         */
        private textOffsetY: number = 0;

        /**
         * @private
         */
        private textLines: Array<string>;
        /**
         * @private
         */
        public $lineHeights: Array<number> = [];

        /**
         * @private
         *
         * @returns
         */
        $getTextLines(): Array<string> {
            var self = this;
            if (!this.$BitmapText[sys.BitmapTextKeys.textLinesChanged]) {
                return self.textLines;
            }
            var textLines: Array<string> = [];
            self.textLines = textLines;
            this.$BitmapText[sys.BitmapTextKeys.textLinesChanged] = false;
            var lineHeights: Array<number> = [];
            self.$lineHeights = lineHeights;
            if (!self.$BitmapText[sys.BitmapTextKeys.text] || !self.$BitmapText[sys.BitmapTextKeys.font]) {
                return textLines;
            }
            var textWidth: number = 0;
            var textHeight: number = 0;
            var textStartX: number = 0;
            var textStartY: number = 0;
            var hasWidthSet: boolean = !isNaN(self.$BitmapText[sys.BitmapTextKeys.textFieldWidth]);
            var textFieldWidth: number = self.$BitmapText[sys.BitmapTextKeys.textFieldWidth];
            var bitmapFont: BitmapFont = self.$BitmapText[sys.BitmapTextKeys.font];
            var emptyHeight: number = bitmapFont._getFirstCharHeight();
            var emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            var text: string = self.$BitmapText[sys.BitmapTextKeys.text];
            var textArr: Array<string> = text.split(/(?:\r\n|\r|\n)/);
            var length: number = textArr.length;
            var isFirstLine: boolean = true;
            for (var i = 0; i < length; i++) {
                var line: string = textArr[i];
                var len = line.length;
                var lineHeight: number = 0;
                var xPos: number = 0;
                var isFirstChar: boolean = true;
                for (var j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += self.$BitmapText[sys.BitmapTextKeys.letterSpacing];
                    }

                    var character = line.charAt(j);
                    var texureWidth: number;
                    var textureHeight: number;
                    var offsetX: number = 0;
                    var offsetY: number = 0;
                    var texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            egret.$warn(1011, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture.$getTextureWidth();
                        textureHeight = texture.$getTextureHeight();
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
                    if (hasWidthSet && j > 0 && xPos + texureWidth > textFieldWidth) {
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
            this.$BitmapText[sys.BitmapTextKeys.textWidth] = textWidth;
            this.$BitmapText[sys.BitmapTextKeys.textHeight] = textHeight;
            self.textOffsetX = textStartX;
            self.textOffsetY = textStartY;
            return textLines;
        }
    }
}
