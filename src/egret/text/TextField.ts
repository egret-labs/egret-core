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
    export const enum TextKeys {
        /**
         * @private
         */
        fontSize,
        /**
         * @private
         */
        lineSpacing,
        /**
         * @private
         */
        textColor,
        /**
         * @private
         */
        textFieldWidth,
        /**
         * @private
         */
        textFieldHeight,
        /**
         * @private
         */
        textWidth,
        /**
         * @private
         */
        textHeight,
        /**
         * @private
         */
        textDrawWidth,
        /**
         * @private
         */
        fontFamily,
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
        textColorString,
        /**
         * @private
         */
        fontString,
        /**
         * @private
         */
        text,
        /**
         * @private
         */
        measuredWidths,
        /**
         * @private
         */
        bold,
        /**
         * @private
         */
        italic,
        /**
         * @private
         */
        fontStringChanged,
        /**
         * @private
         */
        textLinesChanged,
        /**
         * @private
         */
        wordWrap,
        /**
         * @private
         */
        displayAsPassword,
        /**
         * @private
         */
        maxChars,
        /**
         * @private
         */
        selectionActivePosition,
        /**
         * @private
         */
        selectionAnchorPosition,
        /**
         * @private
         */
        type,
        /**
         * @private
         */
        strokeColor,
        /**
         * @private
         */
        strokeColorString,
        /**
         * @private
         */
        stroke,
        /**
         * @private
         */
        scrollV,
        /**
         * @private
         */
        numLines,
        /**
         * @private
         */
        multiline,
        /**
         * @private
         */
        border,
        /**
         * @private
         */
        borderColor,
        /**
         * @private
         */
        background,
        /**
         * @private
         */
        backgroundColor,
        /**
         * @private
         */
        restrictAnd,
        /**
         * @private
         */
        restrictNot,
        /**
         * @private
         */
        inputType
    }
}

namespace egret {

    let SplitRegex = new RegExp("(?=[\\u00BF-\\u1FFF\\u2C00-\\uD7FF]|\\b|\\s)(?![。，！、》…）)}”】\\.\\,\\!\\?\\]\\:])");

    /**
     * @private
     * 根据样式测量文本宽度
     */
    function measureTextWidth(text, values: any, style?: ITextStyle): number {
        style = style || <egret.ITextStyle>{};
        let italic: boolean = style.italic == null ? values[sys.TextKeys.italic] : style.italic;
        let bold: boolean = style.bold == null ? values[sys.TextKeys.bold] : style.bold;
        let size: number = style.size == null ? values[sys.TextKeys.fontSize] : style.size;
        let fontFamily: string = style.fontFamily || values[sys.TextKeys.fontFamily] || TextField.default_fontFamily;
        return sys.measureText(text, fontFamily, size, bold, italic);
    }

    /**
     * TextField is the text rendering class of egret. It conducts rendering by using the browser / device API. Due to different ways of font rendering in different browsers / devices, there may be differences in the rendering
     * If developers expect  no differences among all platforms, please use BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 Create Text
     *
     * @event egret.Event.CHANGE Dispatched when entering text user input。
     * @event egret.FocusEvent.FOCUS_IN Dispatched after the focus to enter text.
     * @event egret.FocusEvent.FOCUS_OUT Enter the text loses focus after dispatch.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     * @language en_US
     */
    /**
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @see http://edn.egret.com/cn/docs/page/141 创建文本
     *
     * @event egret.Event.CHANGE 输入文本有用户输入时调度。
     * @event egret.FocusEvent.FOCUS_IN 聚焦输入文本后调度。
     * @event egret.FocusEvent.FOCUS_OUT 输入文本失去焦点后调度。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/text/TextField.ts
     * @language zh_CN
     */
    export class TextField extends DisplayObject {

        /**
         * default fontFamily
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本字体
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public static default_fontFamily: string = "Arial";

        /**
         * default size in pixels of text
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本字号大小
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        public static default_size: number = 30;

        /**
         * default color of the text.
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 默认文本颜色
         * @version Egret 3.2.1
         * @platform Web,Native
         * @language zh_CN
         */
        public static default_textColor: number = 0xffffff;

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            super();
            let textNode = new sys.TextNode();
            textNode.fontFamily = TextField.default_fontFamily;
            this.textNode = textNode;
            this.$renderNode = textNode;
            this.$TextField = {
                0: TextField.default_size,             //fontSize
                1: 0,              //lineSpacing
                2: TextField.default_textColor,       //textColor
                3: NaN,           //textFieldWidth
                4: NaN,           //textFieldHeight
                5: 0,              //textWidth
                6: 0,              //textHeight
                7: 0,              //textDrawWidth
                8: TextField.default_fontFamily,   //fontFamily
                9: "left",         //textAlign
                10: "top",         //verticalAlign
                11: "#ffffff",     //textColorString
                12: "",            //fontString
                13: "",            //text
                14: [],            //measuredWidths
                15: false,         //bold,
                16: false,         //italic,
                17: true,          //fontStringChanged,
                18: false,         //textLinesChanged,
                19: false,          //wordWrap
                20: false,         //displayAsPassword
                21: 0,              //maxChars
                22: 0, //selectionActivePosition,
                23: 0, //selectionAnchorPosition,
                24: TextFieldType.DYNAMIC,              //type
                25: 0x000000,              //strokeColor
                26: "#000000",              //strokeColorString
                27: 0,              //stroke
                28: -1,              //scrollV
                29: 0,              //numLines
                30: false,              //multiline
                31: false,              //border
                32: 0x000000,              //borderColor
                33: false,              //background
                34: 0xffffff,              //backgroundColor
                35: null,           //restrictAnd
                36: null,           //restrictNot
                37: TextFieldInputType.TEXT            //inputType
            };
        }

        protected createNativeDisplayObject(): void {
            this.$nativeDisplayObject = new egret_native.NativeDisplayObject(egret_native.NativeObjectType.TEXT);
        }

        /**
         * @private
         */
        $TextField: Object;

        /**
         * @private
         */
        private isInput(): boolean {
            return this.$TextField[sys.TextKeys.type] == TextFieldType.INPUT;
        }

        $inputEnabled: boolean = false;

        $setTouchEnabled(value: boolean): void {
            super.$setTouchEnabled(value);

            if (this.isInput()) {
                this.$inputEnabled = true;
            }
        }

        /**
         * The name of the font to use, or a comma-separated list of font names.
         * @default "Arial"
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 要使用的字体的名称或用逗号分隔的字体名称列表。
         * @default "Arial"
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get fontFamily(): string {
            return this.$TextField[sys.TextKeys.fontFamily];
        }

        public set fontFamily(value: string) {
            this.$setFontFamily(value);
        }

        $setFontFamily(value: string): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.fontFamily] == value) {
                return false;
            }
            values[sys.TextKeys.fontFamily] = value;
            this.invalidateFontString();

            return true;
        }

        /**
         * The size in pixels of text
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本的字号大小。
         * @default 30
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get size(): number {
            return this.$TextField[sys.TextKeys.fontSize];
        }

        public set size(value: number) {
            this.$setSize(value);
        }

        $setSize(value: number): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.fontSize] == value) {
                return false;
            }
            values[sys.TextKeys.fontSize] = value;
            this.invalidateFontString();

            return true;
        }

        /**
         * Specifies whether the text is boldface.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否显示为粗体。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get bold(): boolean {
            return this.$TextField[sys.TextKeys.bold];
        }

        public set bold(value: boolean) {
            this.$setBold(value);
        }

        $setBold(value: boolean): boolean {
            let values = this.$TextField;
            if (value == values[sys.TextKeys.bold]) {
                return false;
            }
            values[sys.TextKeys.bold] = value;
            this.invalidateFontString();

            return true;
        }

        /**
         * Determines whether the text is italic font.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 是否显示为斜体。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get italic(): boolean {
            return this.$TextField[sys.TextKeys.italic];
        }

        public set italic(value: boolean) {
            this.$setItalic(value);
        }

        $setItalic(value: boolean): boolean {
            let values = this.$TextField;
            if (value == values[sys.TextKeys.italic]) {
                return false;
            }
            values[sys.TextKeys.italic] = value;
            this.invalidateFontString();

            return true;
        }

        /**
         * @private
         *
         */
        private invalidateFontString(): void {
            this.$TextField[sys.TextKeys.fontStringChanged] = true;
            this.$invalidateTextField();
        }

        /**
         * Horizontal alignment of text.
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本的水平对齐方式。
         * @default：egret.HorizontalAlign.LEFT
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textAlign(): string {
            return this.$TextField[sys.TextKeys.textAlign];
        }

        public set textAlign(value: string) {
            this.$setTextAlign(value);
        }

        $setTextAlign(value: string): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.textAlign] == value) {
                return false;
            }
            values[sys.TextKeys.textAlign] = value;
            this.$invalidateTextField();

            return true;
        }

        /**
         * Vertical alignment of text.
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文字的垂直对齐方式。
         * @default：egret.VerticalAlign.TOP
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get verticalAlign(): string {
            return this.$TextField[sys.TextKeys.verticalAlign];
        }

        public set verticalAlign(value: string) {
            this.$setVerticalAlign(value);
        }

        $setVerticalAlign(value: string): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.verticalAlign] == value) {
                return false;
            }
            values[sys.TextKeys.verticalAlign] = value;
            this.$invalidateTextField();

            return true;
        }

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
            return this.$TextField[sys.TextKeys.lineSpacing];
        }

        public set lineSpacing(value: number) {
            this.$setLineSpacing(value);
        }

        $setLineSpacing(value: number): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.lineSpacing] == value)
                return false;
            values[sys.TextKeys.lineSpacing] = value;
            this.$invalidateTextField();

            return true;
        }

        /**
         * Color of the text.
         * @default 0x000000
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本颜色
         * @default 0x000000
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textColor(): number {
            return this.$TextField[sys.TextKeys.textColor];
        }

        public set textColor(value: number) {
            this.$setTextColor(value);
        }

        $setTextColor(value: number): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.textColor] == value) {
                return false;
            }
            values[sys.TextKeys.textColor] = value;
            if (this.inputUtils) {
                this.inputUtils._setColor(this.$TextField[sys.TextKeys.textColor]);
            }
            this.$invalidateTextField();
            return true;
        }

        /**
         * A Boolean value that indicates whether the text field word wrap. If the value is true, then the text field by word wrap; 
         * if the value is false, the text field by newline characters.
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 一个布尔值，表示文本字段是否按单词换行。如果值为 true，则该文本字段按单词换行；
         * 如果值为 false，则该文本字段按字符换行。
         * @default false
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get wordWrap(): boolean {
            return this.$TextField[sys.TextKeys.wordWrap];
        }

        public set wordWrap(value: boolean) {
            this.$setWordWrap(value);
        }

        $setWordWrap(value: boolean): void {
            let values = this.$TextField;
            if (value == values[sys.TextKeys.wordWrap]) {
                return;
            }
            if (values[sys.TextKeys.displayAsPassword]) {
                return;
            }
            values[sys.TextKeys.wordWrap] = value;
            this.$invalidateTextField();
        }

        /**
         * @private
         */
        private inputUtils: InputController = null;

        /**
         * Type of the text field.
         * Any one of the following TextFieldType constants: TextFieldType.DYNAMIC (specifies the dynamic text field that users can not edit), or TextFieldType.INPUT (specifies the dynamic text field that users can edit).
         * @default egret.TextFieldType.DYNAMIC
         * @language en_US
         */
        /**
         * 文本字段的类型。
         * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
         * @default egret.TextFieldType.DYNAMIC
         * @language zh_CN
         */
        public set type(value: string) {
            this.$setType(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setType(value: string): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.type] != value) {
                values[sys.TextKeys.type] = value;
                if (value == TextFieldType.INPUT) {//input，如果没有设置过宽高，则设置默认值为100，30
                    if (isNaN(values[sys.TextKeys.textFieldWidth])) {
                        this.$setWidth(100);
                    }
                    if (isNaN(values[sys.TextKeys.textFieldHeight])) {
                        this.$setHeight(30);
                    }

                    this.$setTouchEnabled(true);

                    //创建stageText
                    if (this.inputUtils == null) {
                        this.inputUtils = new egret.InputController();
                    }

                    this.inputUtils.init(this);
                    this.$invalidateTextField();

                    if (this.$stage) {
                        this.inputUtils._addStageText();
                    }
                }
                else {
                    if (this.inputUtils) {
                        this.inputUtils._removeStageText();
                        this.inputUtils = null;
                    }
                    this.$setTouchEnabled(false);
                }

                return true;
            }
            return false;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get type(): string {
            return this.$TextField[sys.TextKeys.type];
        }

        /**
         * Pop-up keyboard type.
         * Any of a TextFieldInputType constants.
         * @language en_US
         */
        /**
         * 弹出键盘的类型。
         * TextFieldInputType 常量中的任一个。
         * @language zh_CN
         */
        public set inputType(value: string) {
            this.$TextField[sys.TextKeys.inputType] = value;
        }

        /**
         * @version Egret 3.1.2
         * @platform Web,Native
         */
        public get inputType(): string {
            return this.$TextField[sys.TextKeys.inputType];
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get text(): string {
            return this.$getText();
        }

        /**
         * @private
         *
         * @returns
         */
        public $getText(): string {
            if (this.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
                return this.inputUtils._getText();
            }

            return this.$TextField[sys.TextKeys.text];
        }

        /**
         * Serve as a string of the current text field in the text
         * @language en_US
         */
        /**
         * 作为文本字段中当前文本的字符串
         * @language zh_CN
         */
        public set text(value: string) {
            this.$setText(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setBaseText(value: string): boolean {
            if (value == null) {
                value = "";
            }
            this.isFlow = false;
            let values = this.$TextField;
            if (values[sys.TextKeys.text] != value) {
                this.$invalidateTextField();
                values[sys.TextKeys.text] = value;
                let text: string = "";
                if (values[sys.TextKeys.displayAsPassword]) {
                    text = this.changeToPassText(value);
                }
                else {
                    text = value;
                }

                this.setMiddleStyle([<egret.ITextElement>{ text: text }]);
                return true;
            }
            return false;
        }

        /**
         * @private
         *
         * @param value
         */
        $setText(value: string): boolean {
            if (value == null) {
                value = "";
            }
            let result: boolean = this.$setBaseText(value);
            if (this.inputUtils) {
                this.inputUtils._setText(this.$TextField[sys.TextKeys.text]);
            }
            return result;
        }

        /**
         * Specify whether the text field is a password text field.
         * If the value of this property is true, the text field is treated as a password text field and hides the input characters using asterisks instead of the actual characters. If false, the text field is not treated as a password text field.
         * @default false
         * @language en_US
         */
        /**
         * 指定文本字段是否是密码文本字段。
         * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * @default false
         * @language zh_CN
         */
        public get displayAsPassword(): boolean {
            return this.$TextField[sys.TextKeys.displayAsPassword];
        }

        public set displayAsPassword(value: boolean) {
            this.$setDisplayAsPassword(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setDisplayAsPassword(value: boolean): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.displayAsPassword] != value) {
                values[sys.TextKeys.displayAsPassword] = value;
                this.$invalidateTextField();

                let text: string = "";
                if (value) {
                    text = this.changeToPassText(values[sys.TextKeys.text]);
                }
                else {
                    text = values[sys.TextKeys.text];
                }

                this.setMiddleStyle([<egret.ITextElement>{ text: text }]);

                return true;
            }
            return false;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get strokeColor(): number {
            return this.$TextField[sys.TextKeys.strokeColor];
        }

        /**
         * Represent the stroke color of the text.
         * Contain three 8-bit numbers with RGB color components; for example, 0xFF0000 is red, 0x00FF00 is green.
         * @default 0x000000
         * @language en_US
         */
        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * @default 0x000000
         * @language zh_CN
         */
        public set strokeColor(value: number) {
            this.$setStrokeColor(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setStrokeColor(value: number): boolean {
            let values = this.$TextField;
            if (values[sys.TextKeys.strokeColor] != value) {
                this.$invalidateTextField();
                values[sys.TextKeys.strokeColor] = value;
                values[sys.TextKeys.strokeColorString] = toColorString(value);

                return true;
            }

            return false;
        }


        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get stroke(): number {
            return this.$TextField[sys.TextKeys.stroke];
        }

        /**
         * Indicate the stroke width.
         * 0 means no stroke.
         * @default 0
         * @language en_US
         */
        /**
         * 表示描边宽度。
         * 0为没有描边。
         * @default 0
         * @language zh_CN
         */
        public set stroke(value: number) {
            this.$setStroke(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setStroke(value: number): boolean {
            if (this.$TextField[sys.TextKeys.stroke] != value) {
                this.$invalidateTextField();
                this.$TextField[sys.TextKeys.stroke] = value;

                return true;
            }
            return false;
        }


        /**
         * The maximum number of characters that the text field can contain, as entered by a user. \n A script can insert more text than maxChars allows; the maxChars property indicates only how much text a user can enter. If the value of this property is 0, a user can enter an unlimited amount of text.
         * The default value is 0.
         * @default 0
         * @language en_US
         */
        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * @default 0
         * @language zh_CN
         */
        public get maxChars(): number {
            return this.$TextField[sys.TextKeys.maxChars];
        }

        public set maxChars(value: number) {
            this.$setMaxChars(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setMaxChars(value: number): boolean {
            if (this.$TextField[sys.TextKeys.maxChars] != value) {
                this.$TextField[sys.TextKeys.maxChars] = value;

                return true;
            }

            return false;
        }

        /**
         * Vertical position of text in a text field. scrollV property helps users locate specific passages in a long article, and create scrolling text fields.
         * Vertically scrolling units are lines, and horizontal scrolling unit is pixels.
         * If the first displayed line is the first line in the text field, scrollV is set to 1 (instead of 0).
         * @language en_US
         */
        /**
         * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
         * 垂直滚动的单位是行，而水平滚动的单位是像素。
         * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
         * @language zh_CN
         */
        public set scrollV(value: number) {
            this.$TextField[sys.TextKeys.scrollV] = Math.max(value, 1);

            this.$invalidateTextField();
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get scrollV(): number {
            return Math.min(Math.max(this.$TextField[sys.TextKeys.scrollV], 1), this.maxScrollV);
        }

        /**
         * The maximum value of scrollV
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * scrollV 的最大值
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get maxScrollV(): number {
            this.$getLinesArr();
            return Math.max(this.$TextField[sys.TextKeys.numLines] - TextFieldUtils.$getScrollNum(this) + 1, 1);
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get selectionBeginIndex(): number {
            return 0;
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get selectionEndIndex(): number {
            return 0;
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get caretIndex(): number {
            return 0;
        }

        /**
         * @private
         *
         * @param beginIndex
         * @param endIndex
         */
        $setSelection(beginIndex: number, endIndex: number): boolean {
            return false;
        }

        /**
         * @private
         *
         * @returns
         */
        $getLineHeight(): number {
            return this.$TextField[sys.TextKeys.lineSpacing] + this.$TextField[sys.TextKeys.fontSize];
        }

        /**
         * Number of lines of text.
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 文本行数。
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get numLines(): number {
            this.$getLinesArr();
            return this.$TextField[sys.TextKeys.numLines];
        }

        /**
         * Indicate whether field is a multiline text field. Note that this property is valid only when the type is TextFieldType.INPUT.
         * If the value is true, the text field is multiline; if the value is false, the text field is a single-line text field. In a field of type TextFieldType.INPUT, the multiline value determines whether the Enter key creates a new line (a value of false, and the Enter key is ignored).
         * @default false
         * @language en_US
         */
        /**
         * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
         * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * @default false
         * @language zh_CN
         */
        public set multiline(value: boolean) {
            this.$setMultiline(value);
        }

        /**
         * @private
         *
         * @param value
         */
        $setMultiline(value: boolean): boolean {
            this.$TextField[sys.TextKeys.multiline] = value;
            this.$invalidateTextField();
            return true;
        }

        public get multiline(): boolean {
            return this.$TextField[sys.TextKeys.multiline];
        }

        /**
         * Indicates a user can enter into the text field character set. If you restrict property is null, you can enter any character. If you restrict property is an empty string, you can not enter any character. If you restrict property is a string of characters, you can enter only characters in the string in the text field. The string is scanned from left to right. You can use a hyphen (-) to specify a range. Only restricts user interaction; a script may put any text into the text field. <br/>
                  * If the string of characters caret (^) at the beginning, all characters are initially accepted, then the string are excluded from receiving ^ character. If the string does not begin with a caret (^) to, any characters are initially accepted and then a string of characters included in the set of accepted characters. <br/>
                  * The following example allows only uppercase characters, spaces, and numbers in the text field: <br/>
                  * My_txt.restrict = "A-Z 0-9"; <br/>
                  * The following example includes all characters except lowercase letters: <br/>
                  * My_txt.restrict = "^ a-z"; <br/>
                  * If you need to enter characters \ ^, use two backslash "\\ -" "\\ ^": <br/>
                  * Can be used anywhere in the string ^ to rule out including characters and switch between characters, but can only be used to exclude a ^. The following code includes only uppercase letters except uppercase Q: <br/>
                  * My_txt.restrict = "A-Z ^ Q"; <br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         * @language en_US
         */
        /**
         * 表示用户可输入到文本字段中的字符集。如果 restrict 属性的值为 null，则可以输入任何字符。如果 restrict 属性的值为空字符串，则不能输入任何字符。如果 restrict 属性的值为一串字符，则只能在文本字段中输入该字符串中的字符。从左向右扫描该字符串。可以使用连字符 (-) 指定一个范围。只限制用户交互；脚本可将任何文本放入文本字段中。<br/>
         * 如果字符串以尖号 (^) 开头，则先接受所有字符，然后从接受字符集中排除字符串中 ^ 之后的字符。如果字符串不以尖号 (^) 开头，则最初不接受任何字符，然后将字符串中的字符包括在接受字符集中。<br/>
         * 下例仅允许在文本字段中输入大写字符、空格和数字：<br/>
         * my_txt.restrict = "A-Z 0-9";<br/>
         * 下例包含除小写字母之外的所有字符：<br/>
         * my_txt.restrict = "^a-z";<br/>
         * 如果需要输入字符 \ ^，请使用2个反斜杠 "\\-" "\\^" ：<br/>
         * 可在字符串中的任何位置使用 ^，以在包含字符与排除字符之间进行切换，但是最多只能有一个 ^ 用来排除。下面的代码只包含除大写字母 Q 之外的大写字母：<br/>
         * my_txt.restrict = "A-Z^Q";<br/>
         * @version Egret 2.4
         * @platform Web,Native
         * @default null
         * @language zh_CN
         */
        public set restrict(value: string) {
            let values = this.$TextField;
            if (value == null) {
                values[sys.TextKeys.restrictAnd] = null;
                values[sys.TextKeys.restrictNot] = null;
            }
            else {
                let index = -1;
                while (index < value.length) {
                    index = value.indexOf("^", index);
                    if (index == 0) {
                        break;
                    }
                    else if (index > 0) {
                        if (value.charAt(index - 1) != "\\") {
                            break;
                        }
                        index++;
                    }
                    else {
                        break;
                    }
                }

                if (index == 0) {
                    values[sys.TextKeys.restrictAnd] = null;
                    values[sys.TextKeys.restrictNot] = value.substring(index + 1);
                }
                else if (index > 0) {
                    values[sys.TextKeys.restrictAnd] = value.substring(0, index);
                    values[sys.TextKeys.restrictNot] = value.substring(index + 1);
                }
                else {
                    values[sys.TextKeys.restrictAnd] = value;
                    values[sys.TextKeys.restrictNot] = null;
                }
            }

        }

        public get restrict(): string {
            let values = this.$TextField;

            let str: string = null;
            if (values[sys.TextKeys.restrictAnd] != null) {
                str = values[sys.TextKeys.restrictAnd];
            }

            if (values[sys.TextKeys.restrictNot] != null) {
                if (str == null) {
                    str = "";
                }
                str += "^" + values[sys.TextKeys.restrictNot];
            }
            return str;
        }

        /**
         * @private
         *
         * @param value
         */
        $setWidth(value: number): boolean {
            let values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[sys.TextKeys.textFieldWidth])) {
                    return false;
                }

                values[sys.TextKeys.textFieldWidth] = NaN;
            }
            else {
                if (values[sys.TextKeys.textFieldWidth] == value) {
                    return false;
                }

                values[sys.TextKeys.textFieldWidth] = value;
            }

            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();

            return true;
        }

        /**
         * @private
         *
         * @param value
         */
        $setHeight(value: number): boolean {
            let values = this.$TextField;
            if (isNaN(value)) {
                if (isNaN(values[sys.TextKeys.textFieldHeight])) {
                    return false;
                }

                values[sys.TextKeys.textFieldHeight] = NaN;
            }
            else {
                if (values[sys.TextKeys.textFieldHeight] == value) {
                    return false;
                }

                values[sys.TextKeys.textFieldHeight] = value;
            }

            value = +value;
            if (value < 0) {
                return false;
            }
            this.$invalidateTextField();

            return true;
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getWidth(): number {
            let values = this.$TextField;
            return isNaN(values[sys.TextKeys.textFieldWidth]) ? this.$getContentBounds().width : values[sys.TextKeys.textFieldWidth];
        }

        /**
         * @private
         * 获取显示宽度
         */
        $getHeight(): number {
            let values = this.$TextField;
            return isNaN(values[sys.TextKeys.textFieldHeight]) ? this.$getContentBounds().height : values[sys.TextKeys.textFieldHeight];
        }

        /**
         * @private
         */
        private textNode: sys.TextNode;
        /**
         * @private
         */
        public $graphicsNode: sys.GraphicsNode = null;

        /**
         * Specifies whether the text field has a border.
         * If true, the text field has a border. If false, the text field has no border.
         * Use borderColor property to set the border color.
         * @default false
         * @language en_US
         */
        /**
         * 指定文本字段是否具有边框。
         * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
         * 使用 borderColor 属性来设置边框颜色。
         * @default false
         * @language zh_CN
         */
        public set border(value: boolean) {
            this.$setBorder(value);
        }

        /**
         * @private
         */
        $setBorder(value: boolean): void {
            this.$TextField[sys.TextKeys.border] = !!value;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get border(): boolean {
            return this.$TextField[sys.TextKeys.border];
        }

        /**
         * The color of the text field border.
         * Even currently is no border can be retrieved or set this property, but only if the text field has the border property is set to true, the color is visible.
         * @default 0x000000
         * @language en_US
         */
        /**
         * 文本字段边框的颜色。
         * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
         * @default 0x000000
         * @language zh_CN
         */
        public set borderColor(value: number) {
            this.$setBorderColor(value);
        }

        /**
         * @private
         */
        $setBorderColor(value: number): void {
            this.$TextField[sys.TextKeys.borderColor] = +value || 0;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get borderColor(): number {
            return this.$TextField[sys.TextKeys.borderColor];
        }

        /**
         * Specifies whether the text field has a background fill.
         * If true, the text field has a background fill. If false, the text field has no background fill.
         * Use the backgroundColor property to set the background color of the text field.
         * @default false
         * @language en_US
         */
        /**
         * 指定文本字段是否具有背景填充。
         * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
         * 使用 backgroundColor 属性来设置文本字段的背景颜色。
         * @default false
         * @language zh_CN
         */
        public set background(value: boolean) {
            this.$setBackground(value);
        }

        /**
         * @private
         */
        $setBackground(value: boolean): void {
            this.$TextField[sys.TextKeys.background] = value;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get background(): boolean {
            return this.$TextField[sys.TextKeys.background];
        }

        /**
         * Color of the text field background.
         * Even currently is no background, can be retrieved or set this property, but only if the text field has the background property set to true, the color is visible.
         * @default 0xFFFFFF
         * @language en_US
         */
        /**
         * 文本字段背景的颜色。
         * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
         * @default 0xFFFFFF
         * @language zh_CN
         */
        public set backgroundColor(value: number) {
            this.$setBackgroundColor(value);
        }

        /**
         * @private
         */
        $setBackgroundColor(value: number): void {
            this.$TextField[sys.TextKeys.backgroundColor] = value;
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get backgroundColor(): number {
            return this.$TextField[sys.TextKeys.backgroundColor];
        }

        /**
         * @private
         *
         */
        private fillBackground(lines?: number[]): void {
            let graphics = this.$graphicsNode;
            if (graphics) {
                graphics.clear();
            }
            let values = this.$TextField;
            if (values[sys.TextKeys.background] || values[sys.TextKeys.border] || (lines && lines.length > 0)) {
                if (!graphics) {
                    graphics = this.$graphicsNode = new sys.GraphicsNode();
                    if (!egret.nativeRender) {
                        let groupNode = new sys.GroupNode();
                        groupNode.addNode(graphics);
                        groupNode.addNode(this.textNode);
                        this.$renderNode = groupNode;
                    }
                    else {
                        this.$renderNode = this.textNode;
                    }
                }
                let fillPath: sys.Path2D;
                let strokePath: sys.Path2D;
                //渲染背景
                if (values[sys.TextKeys.background]) {
                    fillPath = graphics.beginFill(values[sys.TextKeys.backgroundColor]);
                    fillPath.drawRect(0, 0, this.$getWidth(), this.$getHeight());
                }
                //渲染边框
                if (values[sys.TextKeys.border]) {
                    strokePath = graphics.lineStyle(1, values[sys.TextKeys.borderColor]);
                    //1像素和3像素线条宽度的情况，会向右下角偏移0.5像素绘制。少画一像素宽度，正好能不超出文本测量边界。
                    strokePath.drawRect(0, 0, this.$getWidth() - 1, this.$getHeight() - 1);
                }
                //渲染下划线
                if (lines && lines.length > 0) {
                    let textColor = values[sys.TextKeys.textColor];
                    let lastColor = -1;
                    let length = lines.length;
                    for (let i = 0; i < length; i += 4) {
                        let x: number = lines[i];
                        let y: number = lines[i + 1];
                        let w: number = lines[i + 2];
                        let color: number = lines[i + 3] || textColor;
                        if (lastColor < 0 || lastColor != color) {
                            lastColor = color;
                            strokePath = graphics.lineStyle(2, color, 1, CapsStyle.NONE);
                        }
                        strokePath.moveTo(x, y);
                        strokePath.lineTo(x + w, y);
                    }
                }
            }
            if (graphics) {
                let bounds = this.$getRenderBounds();
                graphics.x = bounds.x;
                graphics.y = bounds.y;
                graphics.width = bounds.width;
                graphics.height = bounds.height;
                Rectangle.release(bounds);
            }
        }

        /**
         * Enter the text automatically entered into the input state, the input type is text only and may only be invoked in the user interaction.
         * @version Egret 3.0.8
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 输入文本自动进入到输入状态，仅在类型是输入文本并且是在用户交互下才可以调用。
         * @version Egret 3.0.8
         * @platform Web,Native
         * @language zh_CN
         */
        public setFocus(): void {
            if (this.type == egret.TextFieldType.INPUT && this.$stage) {
                this.inputUtils.$onFocus();
            }
        }

        /**
         * @private
         *
         */
        public $onRemoveFromStage(): void {
            super.$onRemoveFromStage();

            this.removeEvent();

            if (this.$TextField[sys.TextKeys.type] == TextFieldType.INPUT) {
                this.inputUtils._removeStageText();
            }

            if (this.textNode) {
                this.textNode.clean();
                if (egret.nativeRender) {
                    egret_native.NativeDisplayObject.disposeTextData(this);
                }
            }

        }

        /**
         * @private
         *
         * @param stage
         * @param nestLevel
         */
        public $onAddToStage(stage: Stage, nestLevel: number): void {
            super.$onAddToStage(stage, nestLevel);

            this.addEvent();

            if (this.$TextField[sys.TextKeys.type] == TextFieldType.INPUT) {
                this.inputUtils._addStageText();
            }
        }

        $invalidateTextField(): void {
            let self = this;
            self.$renderDirty = true;
            self.$TextField[sys.TextKeys.textLinesChanged] = true;
            if (egret.nativeRender) {
                egret_native.dirtyTextField(this);
            }
            else {
                let p = self.$parent;
                if (p && !p.$cacheDirty) {
                    p.$cacheDirty = true;
                    p.$cacheDirtyUp();
                }
                let maskedObject = self.$maskedObject;
                if (maskedObject && !maskedObject.$cacheDirty) {
                    maskedObject.$cacheDirty = true;
                    maskedObject.$cacheDirtyUp();
                }
            }
        }

        $getRenderBounds(): Rectangle {
            let bounds = this.$getContentBounds();
            let tmpBounds = Rectangle.create();
            tmpBounds.copyFrom(bounds);
            if (this.$TextField[sys.TextKeys.border]) {
                tmpBounds.width += 2;
                tmpBounds.height += 2;
            }
            let _strokeDouble = this.$TextField[sys.TextKeys.stroke] * 2;
            if (_strokeDouble > 0) {
                tmpBounds.width += _strokeDouble * 2;
                tmpBounds.height += _strokeDouble * 2;
            }
            tmpBounds.x -= _strokeDouble + 2;//+2和+4 是为了webgl纹理太小导致裁切问题
            tmpBounds.y -= _strokeDouble + 2;
            tmpBounds.width = Math.ceil(tmpBounds.width) + 4;
            tmpBounds.height = Math.ceil(tmpBounds.height) + 4;
            return tmpBounds;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds: Rectangle): void {
            this.$getLinesArr();

            let w: number = !isNaN(this.$TextField[sys.TextKeys.textFieldWidth]) ? this.$TextField[sys.TextKeys.textFieldWidth] : this.$TextField[sys.TextKeys.textWidth];
            let h: number = !isNaN(this.$TextField[sys.TextKeys.textFieldHeight]) ? this.$TextField[sys.TextKeys.textFieldHeight] : TextFieldUtils.$getTextHeight(this);
            bounds.setTo(0, 0, w, h);
        }

        $updateRenderNode(): void {
            if (this.$TextField[sys.TextKeys.type] == TextFieldType.INPUT) {
                this.inputUtils._updateProperties();
                if (this.$isTyping) {
                    this.fillBackground();
                    return;
                }
            }
            else if (this.$TextField[sys.TextKeys.textFieldWidth] == 0) {
                let graphics = this.$graphicsNode;
                if (graphics) {
                    graphics.clear();
                }
                return;
            }

            let underLines = this.drawText();
            this.fillBackground(underLines);
            //tudo 宽高很小的情况下webgl模式绘制异常
            let bounds = this.$getRenderBounds();
            let node = this.textNode;
            node.x = bounds.x;
            node.y = bounds.y;
            node.width = Math.ceil(bounds.width);
            node.height = Math.ceil(bounds.height);
            Rectangle.release(bounds);
        }

        /**
         * @private
         */
        private isFlow: boolean = false;

        /**
         * Set rich text
         * @language en_US
         */
        /**
         * 设置富文本
         * @see http://edn.egret.com/cn/index.php/article/index/id/146
         * @language zh_CN
         */
        public set textFlow(textArr: Array<egret.ITextElement>) {
            this.isFlow = true;
            let text: string = "";
            if (textArr == null)
                textArr = [];
            for (let i: number = 0; i < textArr.length; i++) {
                let element: egret.ITextElement = textArr[i];
                text += element.text;
            }

            if (this.$TextField[sys.TextKeys.displayAsPassword]) {
                this.$setBaseText(text);
            }
            else {
                this.$TextField[sys.TextKeys.text] = text;
                this.setMiddleStyle(textArr);
            }
        }

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get textFlow(): Array<egret.ITextElement> {
            return this.textArr;
        }

        /**
         * @private
         *
         * @param text
         * @returns
         */
        private changeToPassText(text: string): string {
            if (this.$TextField[sys.TextKeys.displayAsPassword]) {
                let passText: string = "";
                for (let i: number = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n':
                            passText += "\n";
                            break;
                        case '\r':
                            break;
                        default:
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        }

        /**
         * @private
         */
        private textArr: Array<egret.ITextElement> = [];

        /**
         * @private
         *
         * @param textArr
         */
        private setMiddleStyle(textArr: Array<egret.ITextElement>): void {
            this.$TextField[sys.TextKeys.textLinesChanged] = true;
            this.textArr = textArr;
            this.$invalidateTextField();
        }

        /**
         * Get the text measured width
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取文本测量宽度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textWidth(): number {
            this.$getLinesArr();
            return this.$TextField[sys.TextKeys.textWidth];
        }

        /**
         * Get Text measuring height
         * @version Egret 2.4
         * @platform Web,Native
         * @language en_US
         */
        /**
         * 获取文本测量高度
         * @version Egret 2.4
         * @platform Web,Native
         * @language zh_CN
         */
        public get textHeight(): number {
            this.$getLinesArr();
            return TextFieldUtils.$getTextHeight(this);
        }

        /**
         * @private
         * @param text
         * @version Egret 2.4
         * @platform Web,Native
         */
        public appendText(text: string): void {
            this.appendElement(<egret.ITextElement>{ text: text });
        }

        /**
         * @private
         * @param element
         * @version Egret 2.4
         * @platform Web,Native
         */
        public appendElement(element: egret.ITextElement): void {
            let text: string = this.$TextField[sys.TextKeys.text] + element.text;

            if (this.$TextField[sys.TextKeys.displayAsPassword]) {
                this.$setBaseText(text);
            }
            else {
                this.$TextField[sys.TextKeys.text] = text;

                this.textArr.push(element);
                this.setMiddleStyle(this.textArr);
            }
        }

        /**
         * @private
         */
        private linesArr: Array<egret.ILineElement> = [];

        /**
         * @private
         *
         * @returns
         */
        $getLinesArr(): Array<egret.ILineElement> {
            let values = this.$TextField;
            if (!values[sys.TextKeys.textLinesChanged]) {
                return this.linesArr;
            }

            values[sys.TextKeys.textLinesChanged] = false;
            let text2Arr: Array<egret.ITextElement> = this.textArr;

            this.linesArr.length = 0;
            values[sys.TextKeys.textHeight] = 0;
            values[sys.TextKeys.textWidth] = 0;

            let textFieldWidth: number = values[sys.TextKeys.textFieldWidth];
            //宽度被设置为0
            if (!isNaN(textFieldWidth) && textFieldWidth == 0) {
                values[sys.TextKeys.numLines] = 0;
                return [{ width: 0, height: 0, charNum: 0, elements: [], hasNextLine: false }];
            }

            let linesArr: Array<egret.ILineElement> = this.linesArr;
            let lineW: number = 0;
            let lineCharNum: number = 0;
            let lineH: number = 0;
            let lineCount: number = 0;
            let lineElement: egret.ILineElement;

            for (let i: number = 0, text2ArrLength: number = text2Arr.length; i < text2ArrLength; i++) {
                let element: egret.ITextElement = text2Arr[i];
                //可能设置为没有文本，忽略绘制
                if (!element.text) {
                    if (lineElement) {
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
                        values[sys.TextKeys.textHeight] += lineH;
                    }
                    continue;
                }
                element.style = element.style || <egret.ITextStyle>{};

                let text: string = element.text.toString();
                let textArr: string[] = text.split(/(?:\r\n|\r|\n)/);

                for (let j: number = 0, textArrLength: number = textArr.length; j < textArrLength; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = { width: 0, height: 0, elements: [], charNum: 0, hasNextLine: false };
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                        lineCharNum = 0;
                    }

                    if (values[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
                        lineH = values[sys.TextKeys.fontSize];
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || values[sys.TextKeys.fontSize]);
                    }

                    let isNextLine: boolean = true;
                    if (textArr[j] == "") {
                        if (j == textArrLength - 1) {
                            isNextLine = false;
                        }
                    }
                    else {
                        let w: number = measureTextWidth(textArr[j], values, element.style);
                        if (isNaN(textFieldWidth)) {//没有设置过宽
                            lineW += w;
                            lineCharNum += textArr[j].length;
                            lineElement.elements.push(<egret.IWTextElement>{
                                width: w,
                                text: textArr[j],
                                style: element.style
                            });

                            if (j == textArrLength - 1) {
                                isNextLine = false;
                            }
                        }
                        else {
                            if (lineW + w <= textFieldWidth) {//在设置范围内
                                lineElement.elements.push(<egret.IWTextElement>{
                                    width: w,
                                    text: textArr[j],
                                    style: element.style
                                });
                                lineW += w;
                                lineCharNum += textArr[j].length;

                                if (j == textArrLength - 1) {
                                    isNextLine = false;
                                }
                            }
                            else {
                                let k: number = 0;
                                let ww: number = 0;
                                let word: string = textArr[j];
                                let words: string[];
                                if (values[sys.TextKeys.wordWrap]) {
                                    words = word.split(SplitRegex);
                                }
                                else {
                                    words = word.match(/./g);
                                }
                                let wl: number = words.length;
                                let charNum = 0;
                                for (; k < wl; k++) {

                                    // detect 4 bytes unicode, refer https://mths.be/punycode
                                    var codeLen = words[k].length;
                                    var has4BytesUnicode = false;
                                    if (codeLen == 1 && k < wl - 1) // when there is 2 bytes high surrogate
                                    {
                                        var charCodeHigh = words[k].charCodeAt(0);
                                        var charCodeLow = words[k + 1].charCodeAt(0);
                                        if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) { // low
                                            var realWord = words[k] + words[k + 1];
                                            codeLen = 2;
                                            has4BytesUnicode = true;
                                            w = measureTextWidth(realWord, values, element.style);
                                        } else {
                                            w = measureTextWidth(words[k], values, element.style);
                                        }
                                    } else {
                                        w = measureTextWidth(words[k], values, element.style);
                                    }

                                    // w = measureTextWidth(words[k], values, element.style);
                                    if (lineW != 0 && lineW + w > textFieldWidth && lineW + k != 0) {
                                        break;
                                    }
                                    if (ww + w > textFieldWidth) {//纯英文，一个词就超出宽度的情况
                                        var words2: Array<string> = words[k].match(/./g);
                                        for (var k2 = 0, wl2 = words2.length; k2 < wl2; k2++) {

                                            // detect 4 bytes unicode, refer https://mths.be/punycode
                                            var codeLen = words2[k2].length;
                                            var has4BytesUnicode2 = false;
                                            if (codeLen == 1 && k2 < wl2 - 1) // when there is 2 bytes high surrogate
                                            {
                                                var charCodeHigh = words2[k2].charCodeAt(0);
                                                var charCodeLow = words2[k2 + 1].charCodeAt(0);
                                                if (charCodeHigh >= 0xD800 && charCodeHigh <= 0xDBFF && (charCodeLow & 0xFC00) == 0xDC00) { // low
                                                    var realWord = words2[k2] + words2[k2 + 1];
                                                    codeLen = 2;
                                                    has4BytesUnicode2 = true;
                                                    w = measureTextWidth(realWord, values, element.style);
                                                } else {
                                                    w = measureTextWidth(words2[k2], values, element.style);
                                                }
                                            } else {
                                                w = measureTextWidth(words2[k2], values, element.style);
                                            }
                                            // w = measureTextWidth(words2[k2], values, element.style);

                                            if (k2 > 0 && lineW + w > textFieldWidth) {
                                                break;
                                            }
                                            // charNum += words2[k2].length;
                                            charNum += codeLen;
                                            ww += w;
                                            lineW += w;
                                            lineCharNum += charNum;

                                            if (has4BytesUnicode2) {
                                                k2++;
                                            }
                                        }
                                    } else {
                                        // charNum += words[k].length;
                                        charNum += codeLen;
                                        ww += w;
                                        lineW += w;
                                        lineCharNum += charNum;
                                    }

                                    if (has4BytesUnicode) {
                                        k++;
                                    }

                                }

                                if (k > 0) {
                                    lineElement.elements.push(<egret.IWTextElement>{
                                        width: ww,
                                        text: word.substring(0, charNum),
                                        style: element.style
                                    });

                                    let leftWord: string = word.substring(charNum);
                                    let m: number;
                                    let lwleng = leftWord.length;
                                    for (m = 0; m < lwleng; m++) {
                                        if (leftWord.charAt(m) != " ") {
                                            break;
                                        }
                                    }
                                    textArr[j] = leftWord.substring(m);
                                }
                                if (textArr[j] != "") {
                                    j--;
                                    isNextLine = false;
                                }
                            }
                        }
                    }

                    if (isNextLine) {
                        lineCharNum++;
                        lineElement.hasNextLine = true;
                    }

                    if (j < textArr.length - 1) {//非最后一个
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        lineElement.charNum = lineCharNum;
                        values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
                        values[sys.TextKeys.textHeight] += lineH;

                        //if (this._type == TextFieldType.INPUT && !this._multiline) {
                        //    this._numLines = linesArr.length;
                        //    return linesArr;
                        //}
                        lineCount++;
                    }


                }

                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    lineElement.charNum = lineCharNum;
                    values[sys.TextKeys.textWidth] = Math.max(values[sys.TextKeys.textWidth], lineW);
                    values[sys.TextKeys.textHeight] += lineH;
                }
            }

            values[sys.TextKeys.numLines] = linesArr.length;
            return linesArr;
        }

        /**
         * @private
         */
        $isTyping: boolean = false;

        /**
         * @private
         * 返回要绘制的下划线列表
         */
        private drawText(): number[] {
            let node = this.textNode;
            let values = this.$TextField;
            //更新文本样式
            node.bold = values[sys.TextKeys.bold];
            node.fontFamily = values[sys.TextKeys.fontFamily] || TextField.default_fontFamily;
            node.italic = values[sys.TextKeys.italic];
            node.size = values[sys.TextKeys.fontSize];
            node.stroke = values[sys.TextKeys.stroke];
            node.strokeColor = values[sys.TextKeys.strokeColor];
            node.textColor = values[sys.TextKeys.textColor];
            //先算出需要的数值
            let lines: Array<egret.ILineElement> = this.$getLinesArr();
            if (values[sys.TextKeys.textWidth] == 0) {
                return [];
            }

            let maxWidth: number = !isNaN(values[sys.TextKeys.textFieldWidth]) ? values[sys.TextKeys.textFieldWidth] : values[sys.TextKeys.textWidth];
            let textHeight: number = TextFieldUtils.$getTextHeight(this);

            let drawY: number = 0;
            let startLine: number = TextFieldUtils.$getStartLine(this);

            let textFieldHeight: number = values[sys.TextKeys.textFieldHeight];
            if (!isNaN(textFieldHeight) && textFieldHeight > textHeight) {
                let vAlign: number = TextFieldUtils.$getValign(this);
                drawY += vAlign * (textFieldHeight - textHeight);
            }
            drawY = Math.round(drawY);
            let hAlign: number = TextFieldUtils.$getHalign(this);

            let drawX: number = 0;
            let underLineData: number[] = [];
            for (let i: number = startLine, numLinesLength: number = values[sys.TextKeys.numLines]; i < numLinesLength; i++) {
                let line: egret.ILineElement = lines[i];
                let h: number = line.height;
                drawY += h / 2;
                if (i != startLine) {
                    if (values[sys.TextKeys.type] == egret.TextFieldType.INPUT && !values[sys.TextKeys.multiline]) {
                        break;
                    }
                    if (!isNaN(textFieldHeight) && drawY > textFieldHeight) {
                        break;
                    }
                }

                drawX = Math.round((maxWidth - line.width) * hAlign);
                for (let j: number = 0, elementsLength: number = line.elements.length; j < elementsLength; j++) {
                    let element: egret.IWTextElement = line.elements[j];
                    let size: number = element.style.size || values[sys.TextKeys.fontSize];

                    node.drawText(drawX, drawY + (h - size) / 2, element.text, element.style);

                    if (element.style.underline) {
                        underLineData.push(
                            drawX,
                            drawY + (h) / 2,
                            element.width,
                            element.style.textColor
                        );
                    }

                    drawX += element.width;
                }
                drawY += h / 2 + values[sys.TextKeys.lineSpacing];
            }

            return underLineData;
        }

        //增加点击事件
        private addEvent(): void {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        }

        //释放点击事件
        private removeEvent(): void {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        }

        //处理富文本中有href的
        private onTapHandler(e: egret.TouchEvent): void {
            if (this.$TextField[sys.TextKeys.type] == egret.TextFieldType.INPUT) {
                return;
            }
            let ele: ITextElement = TextFieldUtils.$getTextElement(this, e.localX, e.localY);
            if (ele == null) {
                return;
            }
            let style: egret.ITextStyle = ele.style;

            if (style && style.href) {
                if (style.href.match(/^event:/)) {
                    let type: string = style.href.match(/^event:/)[0];
                    egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
                }
                else {
                    open(style.href, style.target || "_blank");
                }
            }
        }
    }

    export interface TextField {
        addEventListener<Z>(type: "link"
            , listener: (this: Z, e: TextEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
        addEventListener<Z>(type: "focusIn" |
            "focusOut"
            , listener: (this: Z, e: FocusEvent) => void, thisObject: Z, useCapture?: boolean, priority?: number);
        addEventListener(type: string, listener: Function, thisObject: any, useCapture?: boolean, priority?: number);
    }
}
