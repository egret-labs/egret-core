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
namespace egret.sys {
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
        /**
         * @private
         */
        textAlign,
        /**
         * @private
         */
        verticalAlign,
        /**
         * @private
         */
        smoothing
    }
}
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
            this.$renderNode = new sys.BitmapNode();
            //this.cacheAsBitmap = true;
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
                9: false,       //textHeight,
                10: "left",     //textAlign,
                11: "top",      //verticalAlign
                12: Bitmap.defaultSmoothing       //smoothing
            };
        }

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
            let values = this.$BitmapText;
            return values[sys.BitmapTextKeys.smoothing];
        }

        public set smoothing(value: boolean) {
            value = !!value;
            let values = this.$BitmapText;
            if (value == values[sys.BitmapTextKeys.smoothing]) {
                return;
            }
            values[sys.BitmapTextKeys.smoothing] = value;
            this.$invalidate();
        }

        /**
         * @private
         */
        $BitmapText: Object;

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
            return this.$BitmapText[sys.BitmapTextKeys.text];
        }

        public set text(value: string) {
            this.$setText(value);
        }

        /**
         * @private
         */
        $setText(value: string): boolean {
            if(value == null){
                value = "";
            }
            value = String(value);
            let values = this.$BitmapText;
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
            let w = this.$BitmapText[sys.BitmapTextKeys.textFieldWidth];
            return isNaN(w) ? this.$getContentBounds().width : w;
        }

        /**
         * @private
         */
        $setWidth(value: number): boolean {
            //value = +value || 0;
            let values = this.$BitmapText;
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
            let h = this.$BitmapText[sys.BitmapTextKeys.textFieldHeight];
            return isNaN(h) ? this.$getContentBounds().height : h;
        }

        /**
         * @private
         */
        $setHeight(value: number): boolean {
            //value = +value || 0;
            let values = this.$BitmapText;
            if (value < 0 || value == values[sys.BitmapTextKeys.textFieldHeight]) {
                return false;
            }
            values[sys.BitmapTextKeys.textFieldHeight] = value;
            this.$invalidateContentBounds();
            return true;
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.font];
        }

        public set font(value: Object) {
            this.$setFont(value);
        }

        $setFont(value: any): boolean {
            let values = this.$BitmapText;
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
            return this.$BitmapText[sys.BitmapTextKeys.lineSpacing];
        }

        public set lineSpacing(value: number) {
            this.$setLineSpacing(value);
        }

        $setLineSpacing(value: number): boolean {
            value = +value || 0;
            let values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.lineSpacing] == value)
                return false;
            values[sys.BitmapTextKeys.lineSpacing] = value;
            this.$invalidateContentBounds();
            return true;
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.letterSpacing];
        }

        public set letterSpacing(value: number) {
            this.$setLetterSpacing(value);
        }

        $setLetterSpacing(value: number): boolean {
            value = +value || 0;
            let values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.letterSpacing] == value)
                return false;
            values[sys.BitmapTextKeys.letterSpacing] = value;
            this.$invalidateContentBounds();

            return true;
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.textAlign];
        }

        public set textAlign(value: string) {
            this.$setTextAlign(value);
        }

        $setTextAlign(value: string): boolean {
            let values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.textAlign] == value)
                return false;
            values[sys.BitmapTextKeys.textAlign] = value;
            this.$invalidateContentBounds();
            return true;
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.verticalAlign];
        }

        public set verticalAlign(value: string) {
            this.$setVerticalAlign(value);
        }

        $setVerticalAlign(value: string): boolean {
            let values = this.$BitmapText;
            if (values[sys.BitmapTextKeys.verticalAlign] == value)
                return false;
            values[sys.BitmapTextKeys.verticalAlign] = value;
            this.$invalidateContentBounds();
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
        $render(): void {
            let values = this.$BitmapText;
            let textLines: string[] = this.$getTextLines();
            let length: number = textLines.length;
            if (length == 0) {
                return;
            }
            let textLinesWidth: number[] = this.$textLinesWidth;
            let bitmapFont: BitmapFont = values[sys.BitmapTextKeys.font];
            let node = <sys.BitmapNode>this.$renderNode;
            if (bitmapFont.$texture) {
                node.image = bitmapFont.$texture._bitmapData;
            }
            node.smoothing = values[sys.BitmapTextKeys.smoothing];
            let emptyHeight: number = bitmapFont._getFirstCharHeight();
            let emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            let hasSetHeight: boolean = !isNaN(values[sys.BitmapTextKeys.textFieldHeight]);
            let textWidth: number = values[sys.BitmapTextKeys.textWidth];
            let textFieldWidth: number = values[sys.BitmapTextKeys.textFieldWidth];
            let textFieldHeight: number = values[sys.BitmapTextKeys.textFieldHeight];
            let align: string = values[sys.BitmapTextKeys.textAlign];
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
                    let bitmapWidth = texture._bitmapWidth;
                    let bitmapHeight = texture._bitmapHeight;
                    node.imageWidth = texture._sourceWidth;
                    node.imageHeight = texture._sourceHeight;
                    node.drawImage(texture._bitmapX, texture._bitmapY,
                        bitmapWidth, bitmapHeight, xPos + texture._offsetX, yPos + texture._offsetY,
                        texture.$getScaleBitmapWidth(), texture.$getScaleBitmapHeight());

                    xPos += (bitmapFont.getConfig(character, "xadvance") || texture.$getTextureWidth()) + values[sys.BitmapTextKeys.letterSpacing];
                }
                yPos += lineHeight + values[sys.BitmapTextKeys.lineSpacing];
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
                bounds.setTo(this.$textOffsetX + this.$textStartX, this.$textOffsetY + this.$textStartY, this.$BitmapText[sys.BitmapTextKeys.textWidth] - this.$textOffsetX,
                    this.$BitmapText[sys.BitmapTextKeys.textHeight] - this.$textOffsetY);
            }
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.textWidth];
        }

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
            return this.$BitmapText[sys.BitmapTextKeys.textHeight];
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
            let values = this.$BitmapText;
            if (!values[sys.BitmapTextKeys.textLinesChanged]) {
                return this.textLines;
            }
            let textLines: string[] = [];
            this.textLines = textLines;
            let textLinesWidth: number[] = [];
            this.$textLinesWidth = textLinesWidth;
            values[sys.BitmapTextKeys.textLinesChanged] = false;
            let lineHeights: number[] = [];
            this.$lineHeights = lineHeights;
            if (!values[sys.BitmapTextKeys.text] || !values[sys.BitmapTextKeys.font]) {
                return textLines;
            }
            let lineSpacing = values[egret.sys.BitmapTextKeys.lineSpacing]
            let letterSpacing = values[sys.BitmapTextKeys.letterSpacing];
            let textWidth: number = 0;
            let textHeight: number = 0;
            let textOffsetX: number = 0;
            let textOffsetY: number = 0;
            let hasWidthSet: boolean = !isNaN(values[sys.BitmapTextKeys.textFieldWidth]);
            let textFieldWidth: number = values[sys.BitmapTextKeys.textFieldWidth];
            let textFieldHeight: number = values[sys.BitmapTextKeys.textFieldHeight];
            let bitmapFont: BitmapFont = values[sys.BitmapTextKeys.font];
            let emptyHeight: number = bitmapFont._getFirstCharHeight();
            let emptyWidth: number = Math.ceil(emptyHeight * BitmapText.EMPTY_FACTOR);
            let text: string = values[sys.BitmapTextKeys.text];
            let textArr: string[] = text.split(/(?:\r\n|\r|\n)/);
            let length: number = textArr.length;
            let isFirstLine: boolean = true;
            let isFirstChar: boolean;
            let isLastChar: boolean;
            let lineHeight: number;
            let xPos:number;
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
                        offsetX = texture._offsetX;
                        offsetY = texture._offsetY;
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
            values[sys.BitmapTextKeys.textWidth] = textWidth;
            values[sys.BitmapTextKeys.textHeight] = textHeight;
            this.$textOffsetX = textOffsetX;
            this.$textOffsetY = textOffsetY;
            this.$textStartX = 0;
            this.$textStartY = 0;
            let alignType;
            if (textFieldWidth > textWidth) {
                alignType = values[sys.BitmapTextKeys.textAlign];
                if (alignType == egret.HorizontalAlign.RIGHT) {
                    this.$textStartX = textFieldWidth - textWidth;
                } else if (alignType == egret.HorizontalAlign.CENTER) {
                    this.$textStartX = Math.floor((textFieldWidth - textWidth) / 2);
                }
            }
            if (textFieldHeight > textHeight) {
                alignType = values[sys.BitmapTextKeys.verticalAlign];
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
