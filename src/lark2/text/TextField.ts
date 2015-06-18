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
        colorString,
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
        selectionAnchorPosition
    }
}

module egret {

    /**
     * @language en_US
     * The TextField class is used to create display objects for text display. You can use the methods and properties of
     * the TextField class to manipulate it.<br/>
     * In TextField, three character sequences are recognized as explicit line breaks: CR ("\r"), LF ("\n"), and CR+LF ("\r\n").<br/>
     * If you don't specify any kind of width for a TextField, then the longest line, as determined by these explicit line
     * breaks, determines the width of the TextField.<br/>
     * If you do specify some kind of width, then the specified text is word-wrapped at the right edge of the component's
     * bounds, because the default value of the wordWrap is true. If the text extends below the bottom of the component, it is clipped.<br/>
     * To disable this automatic wrapping, set the wordWrap to false. Then lines are broken only where the text contains
     * an explicit line break, and the ends of lines extending past the right edge is clipped.
     * @see egret.TextInput
     * @version Lark 1.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * TextField 类用于创建显示对象以显示文本。可以使用 TextField 类的方法和属性对文本字段进行操作。<br/>
     * 在 TextField 中，将以下三个字符序列识别为显式换行符：CR（“\r”）、LF（“\n”）和 CR+LF（“\r\n”）。<br/>
     * 如果没有为 TextField 指定宽度，则由这些显式换行符确定的最长行确定 TextField 的宽度。<br/>
     * 如果指定了某个宽度，则指定文本将在组件边界的右边缘换行，因为 wordWrap 的默认值为 true。如果文本扩展到低于组件底部，则将被剪切。<br/>
     * 要禁用此自动换行，请将 wordWrap 设置为 false。这样的话，只有 text 包含显式换行符时才会换行，且将剪切超过右边缘的行尾。
     * @see egret.TextInput
     * @version Lark 1.0
     * @platform Web,Native
     */
    export class TextField extends DisplayObject {
        /**
         * @language en_US
         * Creates a new TextField instance.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个TextField对象
         * @version Lark 1.0
         * @platform Web,Native
         */
        public constructor(text?:string) {
            super();
            this.$renderRegion = new sys.Region();
            this.$TextField = {
                0: 30,             //fontSize
                1: 0,              //lineSpacing
                2: 0x000000,       //textColor
                3: NONE,           //textFieldWidth
                4: NONE,           //textFieldHeight
                5: 0,              //textWidth
                6: 0,              //textHeight
                7: 0,              //textDrawWidth
                8: "sans-serif",   //fontFamily
                9: "left",         //textAlign
                10: "top",         //verticalAlign
                11: "#000000",     //colorString
                12: "",            //fontString
                13: "",            //text
                14: [],            //measuredWidths
                15: false,         //bold,
                16: false,         //italic,
                17: true,          //fontStringChanged,
                18: false,         //textLinesChanged,
                19: true,          //wordWrap
                20: false,         //displayAsPassword
                21: 0              //maxChars
            };
            this.text = text;
        }

        /**
         * @private
         */
        $TextField:Object;

        /**
         * @language en_US
         * The name of the font to use, or a comma-separated list of font names.
         * @default "sans-serif"
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要使用的字体的名称或用逗号分隔的字体名称列表。
         * @default "sans-serif"
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get fontFamily():string {
            return this.$TextField[sys.TextKeys.fontFamily];
        }

        public set fontFamily(value:string) {
            var values = this.$TextField;
            if (values[sys.TextKeys.fontFamily] == value) {
                return;
            }
            values[sys.TextKeys.fontFamily] = value;
            this.invalidateFontString();
        }

        /**
         * @language en_US
         * The size in pixels of text
         * @default 30
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本的字号大小。
         * @default 30
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get fontSize():number {
            return this.$TextField[sys.TextKeys.fontSize];
        }

        public set fontSize(value:number) {
            value = +value || 0;
            var values = this.$TextField;
            if (values[sys.TextKeys.fontSize] === value) {
                return;
            }
            values[sys.TextKeys.fontSize] = value;
            this.invalidateFontString();
        }

        /**
         * @language en_US
         * Specifies whether the text is boldface.
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否显示为粗体。
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get bold():boolean {
            return this.$TextField[sys.TextKeys.bold];
        }

        public set bold(value:boolean) {
            value = !!value;
            var values = this.$TextField;
            if (value === values[sys.TextKeys.bold]) {
                return;
            }
            values[sys.TextKeys.bold] = value;
            this.invalidateFontString();
        }

        /**
         * @language en_US
         * Determines whether the text is italic font.
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 是否显示为斜体。
         * @default false
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get italic():boolean {
            return this.$TextField[sys.TextKeys.italic];
        }

        public set italic(value:boolean) {
            value = !!value;
            var values = this.$TextField;
            if (value === values[sys.TextKeys.italic]) {
                return;
            }
            values[sys.TextKeys.italic] = value;
            this.invalidateFontString();
        }

        /**
         * @private
         * 
         */
        private invalidateFontString():void {
            this.$TextField[sys.TextKeys.fontStringChanged] = true;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         * 获取字体信息的字符串形式。
         */
        private getFontString():string {
            var values = this.$TextField;
            if (values[sys.TextKeys.fontStringChanged]) {
                values[sys.TextKeys.fontStringChanged] = false;
                values[sys.TextKeys.fontString] = sys.toFontString(this);
            }
            return values[sys.TextKeys.fontString];
        }

        /**
         * @language en_US
         * Horizontal alignment of text.
         * @default：egret.HorizontalAlign.LEFT
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本的水平对齐方式。
         * @default：egret.HorizontalAlign.LEFT
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get textAlign():string {
            return this.$TextField[sys.TextKeys.textAlign];
        }

        public set textAlign(value:string) {
            var values = this.$TextField;
            if (values[sys.TextKeys.textAlign] == value) {
                return;
            }
            values[sys.TextKeys.textAlign] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @language en_US
         * Vertical alignment of text.
         * @default：egret.VerticalAlign.TOP
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文字的垂直对齐方式。
         * @default：egret.VerticalAlign.TOP
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get verticalAlign():string {
            return this.$TextField[sys.TextKeys.verticalAlign];
        }

        public set verticalAlign(value:string) {
            var values = this.$TextField;
            if (values[sys.TextKeys.verticalAlign] == value) {
                return;
            }
            values[sys.TextKeys.verticalAlign] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @language en_US
         * An integer representing the amount of vertical space between lines.
         * @default 0
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个整数，表示行与行之间的垂直间距量
         * @default 0
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get lineSpacing():number {
            return this.$TextField[sys.TextKeys.lineSpacing];
        }

        public set lineSpacing(value:number) {
            value = +value || 0;
            var values = this.$TextField;
            if (values[sys.TextKeys.lineSpacing] === value)
                return;
            values[sys.TextKeys.lineSpacing] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @language en_US
         * Color of the text.
         * @default 0x000000
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 文本颜色
         * @default 0x000000
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get textColor():number {
            return this.$TextField[sys.TextKeys.textColor];
        }

        public set textColor(value:number) {
            value = +value | 0;
            var values = this.$TextField;
            if (values[sys.TextKeys.textColor] === value) {
                return;
            }
            values[sys.TextKeys.textColor] = value;
            values[sys.TextKeys.colorString] = sys.toColorString(value);
            this.$invalidate();
        }

        /**
         * @language en_US
         * A Boolean value that indicates whether the text field has word wrap. If the value of wordWrap is true, the text
         * field has word wrap; if the value is false, the text field does not have word wrap.
         * @default true
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 一个布尔值，表示文本字段是否自动换行。如果 wordWrap 的值为 true，则该文本字段自动换行；
         * 如果值为 false，则该文本字段不自动换行,如果同时显式设置过宽度，超出宽度的部分将被截断。
         * @default true
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get wordWrap():boolean {
            return this.$TextField[sys.TextKeys.wordWrap];
        }

        public set wordWrap(value:boolean) {
            value = !!value;
            var values = this.$TextField;
            if (value === values[sys.TextKeys.wordWrap]) {
                return;
            }
            if(values[sys.TextKeys.displayAsPassword]){
                return;
            }
            values[sys.TextKeys.wordWrap] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @language en_US
         * A string to display in the text field.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 要显示的文本内容
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get text():string {
            return this.$TextField[sys.TextKeys.text];
        }

        public set text(value:string) {
            if(value===null||value===undefined){
                value = "";
            }
            value = value + "";
            this.$setText(value);
        }

        /**
         * @private
         */
        $setText(value:string):void{
            var values = this.$TextField;
            if (value == values[sys.TextKeys.text])
                return;
            values[sys.TextKeys.text] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        private textLines:string[] = [];
        /**
         * @language en_US
         * [read-only] Defines the number of text lines in a multiline text field. If wordWrap property is set to true, the number of
         * lines increases when text wraps.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [只读] 定义多行文本字段中的文本行数。如果 wordWrap 属性设置为 true，则在文本自动换行时会增加行数。
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get numLines():number {
            return this.textLines.length;
        }

        /**
         * @language en_US
         * [read-only] The width of the text in pixels.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [只读] 文本内容宽度
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get textWidth():number {
            this.updateTextLines();
            return this.$TextField[sys.TextKeys.textWidth];
        }

        /**
         * @language en_US
         * [read-only] The height of the text in pixels.
         * @version Lark 1.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * [只读] 文本内容高度
         * @version Lark 1.0
         * @platform Web,Native
         */
        public get textHeight():number {
            this.updateTextLines();
            return this.$TextField[sys.TextKeys.textHeight];
        }

        /**
         * @private
         */
        $getWidth():number {
            var w = this.$TextField[sys.TextKeys.textFieldWidth];
            return isNone(w) ? this.$getContentBounds().width : w;
        }

        /**
         * @private
         */
        $setWidth(value:number) {
            value = +value || 0;
            var values = this.$TextField;
            if (value < 0 || value === values[sys.TextKeys.textFieldWidth]) {
                return;
            }
            values[sys.TextKeys.textFieldWidth] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        $getHeight():number {
            var h = this.$TextField[sys.TextKeys.textFieldHeight];
            return isNone(h) ? this.$getContentBounds().height : h;
        }

        /**
         * @private
         */
        $setHeight(value:number) {
            value = +value || 0;
            var values = this.$TextField;
            if (value < 0 || value === values[sys.TextKeys.textFieldHeight]) {
                return;
            }
            values[sys.TextKeys.textFieldHeight] = value;
            this.$invalidateContentBounds();
        }

        /**
         * @private
         */
        $invalidateContentBounds():void {
            super.$invalidateContentBounds();
            this.$TextField[sys.TextKeys.textLinesChanged] = true;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.updateTextLines();
            var values = this.$TextField;
            var height:number;
            if (isNone(values[sys.TextKeys.textFieldHeight])) {
                height = values[sys.TextKeys.textHeight];
            }
            else {
                height = values[sys.TextKeys.textFieldHeight];
                var lineHeight = values[sys.TextKeys.fontSize] + 4;
                if (height < lineHeight) {
                    height = lineHeight;
                }
            }
            var width = isNone(values[sys.TextKeys.textFieldWidth]) ?
                values[sys.TextKeys.textWidth] : values[sys.TextKeys.textFieldWidth];
            if (width < values[sys.TextKeys.textDrawWidth]) {
                width = values[sys.TextKeys.textDrawWidth];
            }
            bounds.setTo(0, 0, width, height);
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            var lines = this.updateTextLines();
            if (!lines) {
                return;
            }
            var values = this.$TextField;
            context.textAlign = "left";
            context.textBaseline = "middle";
            context.font = this.getFontString();
            context.fillStyle = values[sys.TextKeys.colorString];
            var length = lines.length;
            var lineHeight = values[sys.TextKeys.fontSize];
            var halfLineHeight = lineHeight * 0.5;
            var drawY = halfLineHeight + 2;
            var vGap = lineHeight + values[sys.TextKeys.lineSpacing];

            var textHeight = values[sys.TextKeys.textHeight];
            var hasHeightSet = !isNone(values[sys.TextKeys.textFieldHeight]);
            var explicitHeight = hasHeightSet ? values[sys.TextKeys.textFieldHeight] : Number.POSITIVE_INFINITY;
            if (hasHeightSet && textHeight < explicitHeight) {
                var vAlign = 0;
                if (values[sys.TextKeys.verticalAlign] == VerticalAlign.MIDDLE)
                    vAlign = 0.5;
                else if (values[sys.TextKeys.verticalAlign] == VerticalAlign.BOTTOM)
                    vAlign = 1;
                drawY += vAlign * (explicitHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var hAlign = 0;
            if (values[sys.TextKeys.textAlign] == HorizontalAlign.CENTER) {
                hAlign = 0.5;
            }
            else if (values[sys.TextKeys.textAlign] == HorizontalAlign.RIGHT) {
                hAlign = 1;
            }
            var measuredWidths = values[sys.TextKeys.measuredWidths];
            var maxWidth:number;
            if (isNone(values[sys.TextKeys.textFieldWidth])) {
                maxWidth = values[sys.TextKeys.textWidth];
            }
            else {
                maxWidth = values[sys.TextKeys.textFieldWidth];
            }
            var maxYPos = explicitHeight - 2;
            for (var i = 0; i < length; i++) {
                var line = lines[i];
                var measureW = measuredWidths[i];
                var drawX = Math.round((maxWidth - measureW) * hAlign);
                if (drawX < 0) {
                    drawX = 0;
                }
                if (drawY + halfLineHeight <= maxYPos || i === 0) {
                    context.fillText(line, drawX, drawY);
                }
                drawY += vGap;
            }
        }

        /**
         * @private
         */
        private updateTextLines():string[] {

            var values = this.$TextField;
            if (!values[sys.TextKeys.textLinesChanged]) {
                return this.textLines;
            }

            this.textLines.length = 0;
            var measuredWidths = values[sys.TextKeys.measuredWidths];
            measuredWidths.length = 0;
            values[sys.TextKeys.textWidth] = 0;
            values[sys.TextKeys.textHeight] = 0;
            var textFieldWidth = values[sys.TextKeys.textFieldWidth];

            var text:string = values[sys.TextKeys.text];
            if (!text || textFieldWidth === 0) {
                return null;
            }

            var displayAsPassword = values[sys.TextKeys.displayAsPassword];
            if(displayAsPassword){
                var textLength = text.length;
                var asterisks = "";
                for(var i=0;i<textLength;i++){
                    asterisks+="•";
                }
                text = asterisks;
            }

            var hasWidthSet = !isNone(textFieldWidth);
            var font = this.getFontString();
            var lines = text.split(/(?:\r\n|\r|\n)/);
            var length = lines.length;
            var maxWidth = 0;
            var drawWidth = 0;
            var index:number;
            if (hasWidthSet && values[sys.TextKeys.wordWrap]) {
                for (var i = 0; i < length; i++) {
                    var line = lines[i];
                    var measureW = TextMeasurer.measureText(line, font);
                    if (measureW > textFieldWidth) {
                        var newLine = "";
                        var lineWidth = 0;
                        var words = this.$splitWords(line);
                        var len = words.length;
                        for (var j = 0; j < len; j++) {
                            var word = words[j];
                            measureW = TextMeasurer.measureText(word, font);
                            if (lineWidth + measureW > textFieldWidth) {

                                if (lineWidth === 0) {
                                    index = getMaxIndex(word, textFieldWidth, font);
                                    words.splice(j + 1, 0, word.substring(index));
                                    word = word.substring(0, index);
                                    measureW = TextMeasurer.measureText(word, font);
                                    lines.splice(i, 0, word);
                                    measuredWidths[i] = measureW;
                                    len++;
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
                                    if (measureW > textFieldWidth) {
                                        measureW = 0;
                                        word = "";
                                        j--;
                                    }
                                }
                                i++;
                                length++;
                            }
                            lineWidth += measureW;
                            newLine += word;
                        }
                        lines[i] = newLine;
                        measuredWidths[i] = lineWidth;
                    }
                    else {
                        measuredWidths[i] = measureW;
                        if (maxWidth < measureW) {
                            maxWidth = measureW;
                        }
                    }
                }
                drawWidth = Math.max(drawWidth, maxWidth);
            }
            else {
                for (i = 0; i < length; i++) {
                    line = lines[i];
                    measureW = TextMeasurer.measureText(line, font);
                    if (hasWidthSet && measureW > textFieldWidth) {
                        index = getMaxIndex(line, textFieldWidth, font);
                        line = lines[i] = line.substring(0, index);
                        drawWidth = Math.max(drawWidth, TextMeasurer.measureText(line, font));
                    }
                    measuredWidths[i] = measureW;
                    if (maxWidth < measureW) {
                        maxWidth = measureW;
                    }
                }
            }
            values[sys.TextKeys.textDrawWidth] = drawWidth;
            values[sys.TextKeys.textWidth] = Math.ceil(maxWidth);
            //由于Canvas不提供文本行高测量功能，这里以字号为默认行高测量，并在顶部和底部各留2像素边距防止文本截断。
            values[sys.TextKeys.textHeight] = Math.ceil(lines.length * (values[sys.TextKeys.fontSize] +
                values[sys.TextKeys.lineSpacing]) - values[sys.TextKeys.lineSpacing] + 4);
            this.textLines = lines;
            return lines;
        }

        /**
         * @private
         */
        protected $splitWords(line:string):string[] {
            return line.split(/\b/);
        }

    }

    /**
     * @private
     * 返回不超过最大宽度的字符结束索引(不包括)。
     */
    function getMaxIndex(text:string, maxWidth:number, font:string):number {
        var lineWidth = 0;
        var length = text.length;
        var index:number;
        for (var i = 0; i < length; i++) {
            var word = text.charAt(i);
            var measureW = TextMeasurer.measureText(word, font);
            if (lineWidth + measureW > maxWidth) {
                index = i;
                break;
            }
            lineWidth += measureW;
        }
        return index == 0 ? 1 : index;
    }

    registerClass(TextField, Types.TextField);
}


module egret.sys {

    /**
     * @private
     * 返回格式化的字体样式文本
     */
    export function toFontString(style:{fontFamily?:string;fontSize?:number;bold?:boolean;italic?:boolean}):string {
        var font = "";
        if (style.italic)
            font += "italic ";
        if (style.bold)
            font += "bold ";
        font += (style.fontSize || 12) + "px ";
        font += (style.fontFamily || "sans-serif");
        return font;
    }

    /**
     * @private
     * 返回字符串形式的颜色值
     */
    export function toColorString(value:number):string {
        if (value < 0)
            value = 0;
        if (value > 16777215)
            value = 16777215;
        var color = value.toString(16).toUpperCase();
        while (color.length < 6) {
            color = "0" + color;
        }
        return "#" + color;
    }

    if(DEBUG){
        egret.$markReadOnly(TextField.prototype,"numLines");
        egret.$markReadOnly(TextField.prototype,"textWidth");
        egret.$markReadOnly(TextField.prototype,"textWidth");
    }
}