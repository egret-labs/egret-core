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
namespace egret {
    /**
     * Bitmap font adopts the Bitmap+SpriteSheet mode to render text.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     * @language en_US
     */
    /**
     * 位图字体采用了Bitmap+SpriteSheet的方式来渲染文字。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/BitmapText.ts
     * @language zh_CN
     */
    export class BitmapText extends DisplayObject {

        /**
         * Create an egret.BitmapText object
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 创建一个 egret.BitmapText 对象
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public constructor() {
            super();
            if (!egret.nativeRender) {
                this.$renderNode = new sys.BitmapNode();
            }
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.BITMAP_TEXT);
        }

        private $smoothing: boolean = Bitmap.defaultSmoothing;

        /**
         * Whether or not is smoothed when scaled.
         * @default true。
         * @version Egret 3.0
         * @platform Web
         * @language en_US
         */
        /**
         * 控制在缩放时是否进行平滑处理。
         * @default true。
         * @version Egret 3.0
         * @platform Web
         * @language zh_CN
         */
        public get smoothing(): boolean {
            return this.$smoothing;
        }

        public set smoothing(value: boolean) {
            let self = this;
            if (value == self.$smoothing) {
                return;
            }
            self.$smoothing = value;
        }

        private $text: string = "";

        /**
         * A string to display in the text field.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要显示的文本内容
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get text(): string {
            return this.$text;
        }

        public set text(value: string) {
            this.$setText(value);
        }

        /**
         * @private
         */
        $setText(value: string): boolean {
            if (value == null) {
                value = "";
            }
            let self = this;
            if (value == self.$text)
                return false;
            self.$text = value;
            self.$invalidateContentBounds();

            return true;
        }

        protected $textFieldWidth: number = NaN;

        /**
         * @private
         */
        $getWidth(): number {
            let self = this;
            let w = self.$textFieldWidth;
            return isNaN(w) ? self.$getContentBounds().width : w;
        }

        /**
         * @private
         */
        $setWidth(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$textFieldWidth) {
                return false;
            }
            self.$textFieldWidth = value;
            self.$invalidateContentBounds();
            return true;
        }

        private $textLinesChanged: boolean = false;

        /**
         * @private
         */
        $invalidateContentBounds(): void {
            this.$renderDirty = true;
            this.$textLinesChanged = true;
            //todo lcj
            this.$updateRenderNode();
        }

        protected $textFieldHeight: number = NaN;

        /**
         * @private
         */
        $getHeight(): number {
            let self = this;
            let h = self.$textFieldHeight;
            return isNaN(h) ? self.$getContentBounds().height : h;
        }

        /**
         * @private
         */
        $setHeight(value: number): boolean {
            let self = this;
            if (value < 0 || value == self.$textFieldHeight) {
                return false;
            }
            self.$textFieldHeight = value;
            self.$invalidateContentBounds();
            return true;
        }

        protected $font: BitmapFont = null;
        protected $fontStringChanged: boolean = false;

        /**
         * The name of the font to use, or a comma-separated list of font names, the type of value must be BitmapFont.
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要使用的字体的名称或用逗号分隔的字体名称列表，类型必须是 BitmapFont。
         * @default null
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get font(): Object {
            return this.$font;
        }

        public set font(value: Object) {
            this.$setFont(value);
        }

        $setFont(value: any): boolean {
            let self = this;
            if (self.$font == value) {
                return false;
            }
            self.$font = value;
            self.$fontStringChanged = true;
            this.$invalidateContentBounds();
            return true;
        }

        private $lineSpacing: number = 0;

        /**
         /**
         * An integer representing the amount of vertical space between lines.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个整数，表示行与行之间的垂直间距量
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get lineSpacing(): number {
            return this.$lineSpacing;
        }

        public set lineSpacing(value: number) {
            this.$setLineSpacing(value);
        }

        $setLineSpacing(value: number): boolean {
            let self = this;
            if (self.$lineSpacing == value)
                return false;
            self.$lineSpacing = value;
            self.$invalidateContentBounds();
            return true;
        }

        private $letterSpacing: number = 0;

        /**
         * An integer representing the amount of distance between characters.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个整数，表示字符之间的距离。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get letterSpacing(): number {
            return this.$letterSpacing;
        }

        public set letterSpacing(value: number) {
            this.$setLetterSpacing(value);
        }

        $setLetterSpacing(value: number): boolean {
            let self = this;
            if (self.$letterSpacing == value) {
                return false;
            }
            self.$letterSpacing = value;
            self.$invalidateContentBounds();
            return true;
        }

        private $textAlign: string = egret.HorizontalAlign.LEFT;

        /**
         * Horizontal alignment of text.
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.5.6
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本的水平对齐方式。
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.5.6
         * @platform Web,Native
         * @language zh_CN
         */
        public get textAlign(): string {
            return this.$textAlign;
        }

        public set textAlign(value: string) {
            this.$setTextAlign(value);
        }

        $setTextAlign(value: string): boolean {
            let self = this;
            if (self.$textAlign == value) {
                return false;
            }
            self.$textAlign = value;
            self.$invalidateContentBounds();
            return true;
        }

        private $verticalAlign: string = egret.VerticalAlign.TOP;

        /**
         * Vertical alignment of text.
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.5.6
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文字的垂直对齐方式。
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.5.6
         * @platform Web,Native
         * @language zh_CN
         */
        public get verticalAlign(): string {
            return this.$verticalAlign;
        }

        public set verticalAlign(value: string) {
            this.$setVerticalAlign(value);
        }

        $setVerticalAlign(value: string): boolean {
            let self = this;
            if (self.$verticalAlign == value) {
                return false;
            }
            self.$verticalAlign = value;
            self.$invalidateContentBounds();
            return true;
        }

        /**
         * A ratio of the width of the space character. This value is multiplied by the height of the first character is the space character width.
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个空格字符的宽度比例。这个数值乘以第一个字符的高度即为空格字符的宽。
         * @default 0.33
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static EMPTY_FACTOR: number = 0.33;

        /**
         * @private
         */
        $updateRenderNode(): void {
            let self = this;
            let textLines: string[] = this.$getTextLines();
            let length: number = textLines.length;
            if (length == 0) {
                return;
            }
            let drawArr = [];
            let textLinesWidth: number[] = this.$textLinesWidth;
            let bitmapFont: BitmapFont = self.$font;
            let node
            if (!egret.nativeRender) {
                node = <sys.BitmapNode>this.$renderNode;
                if (bitmapFont.$texture) {
                    node.image = bitmapFont.$texture.$bitmapData;
                }
                node.smoothing = self.$smoothing;
            }
            let emptyHeight: number = bitmapFont._getFirstCharHeight();
            let emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            let hasSetHeight: boolean = !isNaN(self.$textFieldHeight);
            let textWidth: number = self.$textWidth;
            let textFieldWidth: number = self.$textFieldWidth;
            let textFieldHeight: number = self.$textFieldHeight;
            let align: string = self.$textAlign;
            let yPos: number = this.$textOffsetY + this.$textStartY;
            let lineHeights: number[] = this.$lineHeights;
            for (let i: number = 0; i < length; i++) {
                let lineHeight: number = lineHeights[i];
                if (hasSetHeight && i > 0 && yPos + lineHeight > textFieldHeight) {
                    break;
                }
                let line = textLines[i];
                let len = line.length;
                let xPos = this.$textOffsetX;

                if (align != egret.HorizontalAlign.LEFT) {
                    let countWidth: number = textFieldWidth > textWidth ? textFieldWidth : textWidth;
                    if (align == egret.HorizontalAlign.RIGHT) {
                        xPos += countWidth - textLinesWidth[i];
                    } else if (align == egret.HorizontalAlign.CENTER) {
                        xPos += Math.floor((countWidth - textLinesWidth[i]) / 2);
                    }
                }
                for (let j: number = 0; j < len; j++) {
                    let character = line.charAt(j);
                    let texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            xPos += emptyWidth;
                        }
                        else {
                            egret.$warn(1046, character);
                        }
                        continue;
                    }
                    let bitmapWidth = texture.$bitmapWidth;
                    let bitmapHeight = texture.$bitmapHeight;
                    if (egret.nativeRender) {
                        drawArr.push(texture.$bitmapX, texture.$bitmapY,
                            bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY,
                            texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight(),
                            texture.$sourceWidth, texture.$sourceHeight);
                    }
                    else {
                        node.imageWidth = texture.$sourceWidth;
                        node.imageHeight = texture.$sourceHeight;
                        node.drawImage(texture.$bitmapX, texture.$bitmapY,
                            bitmapWidth, bitmapHeight, xPos + texture.$offsetX, yPos + texture.$offsetY,
                            texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());
                    }
                    xPos += (bitmapFont.getConfig(character, "xadvance") || texture.$getTextureWidth()) + self.$letterSpacing;
                }
                yPos += lineHeight + self.$lineSpacing;
            }
            if (egret.nativeRender) {
                self.$nativeDisplayObject.setDataToBitmapNode(self.$nativeDisplayObject.id, bitmapFont.$texture, drawArr);
                let bounds = self.$getContentBounds();
                self.$nativeDisplayObject.setWidth(bounds.width);
                self.$nativeDisplayObject.setHeight(bounds.height);
            }
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            let lines: string[] = this.$getTextLines();
            if (lines.length == 0) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$textWidth - this.$textOffsetX,
                    this.$textHeight - this.$textOffsetY);
            }
        }

        private $textWidth: number = NaN;

        /**
         * Get the BitmapText measured width
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取位图文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textWidth(): number {
            this.$getTextLines();
            return this.$textWidth;
        }

        private $textHeight: number = NaN;

        /**
         * Get Text BitmapText height
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取位图文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textHeight(): number {
            this.$getTextLines();
            return this.$textHeight;
        }

        /**
         * @private
         */
        private $textOffsetX: number = 0;
        /**
         * @private
         */
        private $textOffsetY: number = 0;
        /**
         * @private
         */
        private $textStartX: number = 0;
        /**
         * @private
         */
        private $textStartY: number = 0;

        /**
         * @private
         */
        private textLines: string[] = [];
        /**
         * @private 每一行文字的宽度
         */
        private $textLinesWidth: number[];
        /**
         * @private
         */
        public $lineHeights: number[] = [];

        /**
         * @private
         *
         * @returns
         */
        $getTextLines(): string[] {
            let self = this;
            if (!self.$textLinesChanged) {
                return self.textLines;
            }
            let textLines: string[] = [];
            self.textLines = textLines;
            let textLinesWidth: number[] = [];
            self.$textLinesWidth = textLinesWidth;
            self.$textLinesChanged = false;
            let lineHeights: number[] = [];
            self.$lineHeights = lineHeights;
            if (!self.$text || !self.$font) {
                self.$textWidth = 0;
                self.$textHeight = 0;
                return textLines;
            }
            let lineSpacing = self.$lineSpacing;
            let letterSpacing = self.$letterSpacing;
            let textWidth: number = 0;
            let textHeight: number = 0;
            let textOffsetX: number = 0;
            let textOffsetY: number = 0;
            let hasWidthSet: boolean = !isNaN(self.$textFieldWidth);
            let textFieldWidth: number = self.$textFieldWidth;
            let textFieldHeight: number = self.$textFieldHeight;
            let bitmapFont: BitmapFont = self.$font;
            let emptyHeight: number = bitmapFont._getFirstCharHeight();
            let emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            let text: string = self.$text;
            let textArr: string[] = text.split(/(?:\r\n|\r|\n)/);
            let length: number = textArr.length;
            let isFirstLine: boolean = true;
            let isFirstChar: boolean;
            let isLastChar: boolean;
            let lineHeight: number;
            let xPos: number;
            for (let i = 0; i < length; i++) {
                let line: string = textArr[i];
                let len = line.length;
                lineHeight = 0;
                xPos = 0;
                isFirstChar = true;
                isLastChar = false;
                for (let j = 0; j < len; j++) {
                    if (!isFirstChar) {
                        xPos += letterSpacing;
                    }
                    let character = line.charAt(j);
                    let texureWidth: number;
                    let textureHeight: number;
                    let offsetX: number = 0;
                    let offsetY: number = 0;
                    let texture = bitmapFont.getTexture(character);
                    if (!texture) {
                        if (character == " ") {
                            texureWidth = emptyWidth;
                            textureHeight = emptyHeight;
                        }
                        else {
                            egret.$warn(1046, character);
                            if (isFirstChar) {
                                isFirstChar = false;
                            }
                            continue;
                        }
                    }
                    else {
                        texureWidth = texture.$getTextureWidth();
                        textureHeight = texture.$getTextureHeight();
                        offsetX = texture.$offsetX;
                        offsetY = texture.$offsetY;
                    }

                    if (isFirstChar) {
                        isFirstChar = false;
                        textOffsetX = Math.min(offsetX, textOffsetX);
                    }

                    if (isFirstLine) {
                        isFirstLine = false;
                        textOffsetY = Math.min(offsetY, textOffsetY);
                    }
                    if (hasWidthSet && j > 0 && xPos + texureWidth > textFieldWidth) {
                        if (!setLineData(line.substring(0, j)))
                            break;
                        line = line.substring(j);
                        len = line.length;
                        j = 0;
                        //最后一个字符要计算纹理宽度，而不是xadvance
                        if (j == len - 1) {
                            xPos = texureWidth;
                        }
                        else {
                            xPos = bitmapFont.getConfig(character, "xadvance") || texureWidth;
                        }
                        lineHeight = textureHeight;
                        continue;
                    }
                    //最后一个字符要计算纹理宽度，而不是xadvance
                    if (j == len - 1) {
                        xPos += texureWidth;
                    }
                    else {
                        xPos += bitmapFont.getConfig(character, "xadvance") || texureWidth;
                    }
                    lineHeight = Math.max(textureHeight, lineHeight);
                }
                if (textFieldHeight && i > 0 && textHeight > textFieldHeight) {
                    break;
                }
                isLastChar = true;
                if (!setLineData(line))
                    break;
            }
            function setLineData(str: string): boolean {
                if (textFieldHeight && textLines.length > 0 && textHeight > textFieldHeight) {
                    return false;
                }
                textHeight += lineHeight + lineSpacing;
                if (!isFirstChar && !isLastChar) {
                    xPos -= letterSpacing;
                }
                textLines.push(str);
                lineHeights.push(lineHeight);
                textLinesWidth.push(xPos);
                textWidth = Math.max(xPos, textWidth);
                return true;
            }
            textHeight -= lineSpacing;
            self.$textWidth = textWidth;
            self.$textHeight = textHeight;
            this.$textOffsetX = textOffsetX;
            this.$textOffsetY = textOffsetY;
            this.$textStartX = 0;
            this.$textStartY = 0;
            let alignType;
            if (textFieldWidth > textWidth) {
                alignType = self.$textAlign;
                if (alignType == egret.HorizontalAlign.RIGHT) {
                    this.$textStartX = textFieldWidth - textWidth;
                } else if (alignType == egret.HorizontalAlign.CENTER) {
                    this.$textStartX = Math.floor((textFieldWidth - textWidth) / 2);
                }
            }
            if (textFieldHeight > textHeight) {
                alignType = self.$verticalAlign;
                if (alignType == egret.VerticalAlign.BOTTOM) {
                    this.$textStartY = textFieldHeight - textHeight;
                } else if (alignType == egret.VerticalAlign.MIDDLE) {
                    this.$textStartY = Math.floor((textFieldHeight - textHeight) / 2);
                }
            }
            return textLines;
        }
    }
}
