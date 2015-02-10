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

        public static default_fontFamily:string = "Arial";

        private isInput():boolean {
            return this._type == TextFieldType.INPUT;
        }

        public _inputEnabled:boolean = false;
        public _setTouchEnabled(value:boolean):void {
            super._setTouchEnabled(value);

            if (this.isInput()) {
                this._inputEnabled = true;
            }
        }

        public _type:string = "";
        private _inputUtils:InputController = null;

        /**
         * 文本字段的类型。
         * 以下 TextFieldType 常量中的任一个：TextFieldType.DYNAMIC（指定用户无法编辑的动态文本字段），或 TextFieldType.INPUT（指定用户可以编辑的输入文本字段）。
         * 默认值为 dynamic。
         * @member {string} egret.TextField#type
         */
        public set type(value:string) {
            this._setType(value);
        }

        public _setType(value:string):void {
            if (this._type != value) {
                this._type = value;
                if (this._type == TextFieldType.INPUT) {//input，如果没有设置过宽高，则设置默认值为100，30
                    if (!this._hasWidthSet) {
                        this._setWidth(100);
                    }
                    if (!this._hasHeightSet) {
                        this._setHeight(30);
                    }

                    //创建stageText
                    if (this._inputUtils == null) {
                        this._inputUtils = new egret.InputController();
                    }

                    this._inputUtils.init(this);
                    this._setDirty();

                    if (this._stage) {
                        this._inputUtils._addStageText();
                    }
                }
                else {
                    if (this._inputUtils) {
                        this._inputUtils._removeStageText();
                        this._inputUtils = null;
                    }
                }
            }
        }

        public get type():string {
            return this._type;
        }

        public get text():string {
            return this._getText();
        }

        public _getText():string {
            if (this._type == egret.TextFieldType.INPUT) {
                return this._inputUtils._getText();
            }

            return this._text;
        }

        public _setSizeDirty():void {
            super._setSizeDirty();

            this._isArrayChanged = true;
        }

        public _setTextDirty():void {
            this._setSizeDirty();
        }

        /**
         * 作为文本字段中当前文本的字符串
         * @member {string} egret.TextField#text
         */
        public set text(value:string) {
            this._setText(value);
        }

        public _text:string = "";

        public _setBaseText(value:string):void {
            if (value == null) {
                value = "";
            }

            this._isFlow = false;
            if (this._text != value) {
                this._setTextDirty();
                this._text = value;
                var text:string = "";
                if (this._displayAsPassword) {
                    text = this.changeToPassText(this._text);
                }
                else {
                    text = this._text;
                }

                this.setMiddleStyle([<egret.ITextElement>{text: text}]);
            }
        }

        public _setText(value:string):void {
            if (value == null) {
                value = "";
            }
            this._setBaseText(value);
            if (this._inputUtils) {
                this._inputUtils._setText(this._text);
            }
        }

        public _displayAsPassword:boolean = false;
        public get displayAsPassword():boolean {
            return this._displayAsPassword;
        }

        /**
         * 指定文本字段是否是密码文本字段。
         * 如果此属性的值为 true，则文本字段被视为密码文本字段，并使用星号而不是实际字符来隐藏输入的字符。如果为 false，则不会将文本字段视为密码文本字段。
         * 默认值为 false。
         * @member {boolean} egret.TextInput#displayAsPassword
         */
        public set displayAsPassword(value:boolean) {
            this._setDisplayAsPassword(value);
        }

        public _setDisplayAsPassword(value:boolean):void {
            if (this._displayAsPassword != value) {
                this._displayAsPassword = value;
                
                this._setTextDirty();
                var text:string = "";
                if (this._displayAsPassword) {
                    text = this.changeToPassText(this._text);
                }
                else {
                    text = this._text;
                }

                this.setMiddleStyle([<egret.ITextElement>{text: text}]);
            }
        }

        public _fontFamily = TextField.default_fontFamily;

        public get fontFamily():string {
            return this._fontFamily;
        }

        /**
         * 使用此文本格式的文本的字体名称，以字符串形式表示。
         * 默认值 Arial。
         * @member {any} egret.TextField#fontFamily
         */
        public set fontFamily(value:string) {
            this._setFontFamily(value);
        }

        public _setFontFamily(value:string):void {
            if (this._fontFamily != value) {
                this._setTextDirty();
                this._fontFamily = value;
            }
        }

        public _size:number = 30;

        public get size():number {
            return this._size;
        }

        /**
         * 使用此文本格式的文本的大小（以像素为单位）。
         * 默认值为 30。
         * @member {number} egret.TextField#size
         */
        public set size(value:number) {
            this._setSize(value);
        }

        public _setSize(value:number):void {
            if (this._size != value) {
                this._setTextDirty();
                this._size = value;
            }
        }

        public _italic:boolean = false;

        public get italic():boolean {
            return this._italic;
        }

        /**
         * 表示使用此文本格式的文本是否为斜体。
         * 如果值为 true，则文本为斜体；false，则为不使用斜体。
         * 默认值为 false。
         * @member {boolean} egret.TextField#italic
         */
        public set italic(value:boolean) {
            this._setItalic(value);
        }

        public _setItalic(value:boolean):void {
            if (this._italic != value) {
                this._setTextDirty();
                this._italic = value;
            }
        }

        public _bold:boolean = false;

        public get bold():boolean {
            return this._bold;
        }

        /**
         * 指定文本是否为粗体字。
         * 如果值为 true，则文本为粗体字；false，则为非粗体字。
         * 默认值为 false。
         * @member {boolean} egret.TextField#bold
         */
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
        public get textColor():number {
            return this._textColor;
        }

        /**
         * 表示文本的颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0xFFFFFF。
         * @member {number} egret.TextField#textColor
         */
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

        public _strokeColor:number = 0x000000;
        public get strokeColor():number {
            return this._strokeColor;
        }

        /**
         * 表示文本的描边颜色。
         * 包含三个 8 位 RGB 颜色成分的数字；例如，0xFF0000 为红色，0x00FF00 为绿色。
         * 默认值为 0x000000。
         * @member {number} egret.TextField#strokeColor
         */
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

        public _stroke:number = 0;

        public get stroke():number {
            return this._stroke;
        }

        /**
         * 表示描边宽度。
         * 0为没有描边。
         * 默认值为 0。
         * @member {number} egret.TextField#stroke
         */
        public set stroke(value:number) {
            this._setStroke(value);
        }

        public _setStroke(value:number):void {
            if (this._stroke != value) {
                this._setTextDirty();
                this._stroke = value;
            }
        }

        public _textAlign:string = "left";

        public get textAlign():string {
            return this._textAlign;
        }

        /**
         * 文本水平对齐方式
         * 使用HorizontalAlign定义的常量。
         * 默认值为 HorizontalAlign.LEFT。
         * @member {string} egret.TextField#textAlign
         */
        public set textAlign(value:string) {
            this._setTextAlign(value);
        }

        public _setTextAlign(value:string):void {
            if (this._textAlign != value) {
                this._setTextDirty();
                this._textAlign = value;
            }
        }

        public _verticalAlign:string = "top";

        public get verticalAlign():string {
            return this._verticalAlign;
        }

        /**
         * 文本垂直对齐方式。
         * 使用VerticalAlign定义的常量。
         * 默认值为 VerticalAlign.TOP。
         * @member {string} egret.TextField#verticalAlign
         */
        public set verticalAlign(value:string) {
            this._setVerticalAlign(value);
        }

        public _setVerticalAlign(value:string):void {
            if (this._verticalAlign != value) {
                this._setTextDirty();
                this._verticalAlign = value;
            }
        }

        public maxWidth;

        public _maxChars:number = 0;
        public get maxChars():number {
            return this._maxChars;
        }

        /**
         * 文本字段中最多可包含的字符数（即用户输入的字符数）。
         * 脚本可以插入比 maxChars 允许的字符数更多的文本；maxChars 属性仅表示用户可以输入多少文本。如果此属性的值为 0，则用户可以输入无限数量的文本。
         * 默认值为 0。
         */
        public set maxChars(value:number) {
            this._setMaxChars(value);
        }

        public _setMaxChars(value:number):void {
            if (this._maxChars != value) {
                this._maxChars = value;
            }
        }

        public _scrollV:number = -1;
        /**
         * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
         * 垂直滚动的单位是行，而水平滚动的单位是像素。
         * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
         * @param value
         */
        public set scrollV(value:number) {
            this._scrollV = value;

            this._setDirty();
        }

        private _maxScrollV:number = 0;
        public get maxScrollV():number {
            return this._maxScrollV;
        }

        public get selectionBeginIndex():number {
            return 0;
        }
        public get selectionEndIndex():number {
            return 0;
        }
        public get caretIndex():number {
            return 0;
        }
        public _setSelection(beginIndex:number, endIndex:number) {

        }

        public _lineSpacing:number = 0;

        public get lineSpacing():number {
            return this._lineSpacing;
        }

        /**
         * 行间距
         * 一个整数，表示行与行之间的垂直间距量。
         * 默认值为 0。
         * @member {number} egret.TextField#lineSpacing
         */
        public set lineSpacing(value:number) {
            this._setLineSpacing(value);
        }

        public _setLineSpacing(value:number):void {
            if (this._lineSpacing != value) {
                this._setTextDirty();
                this._lineSpacing = value;
            }
        }

        public _getLineHeight():number {
            return this._lineSpacing + this._size;
        }

        public _numLines:number = 0;
        /**
         * 文本行数。【只读】
         * @member {number} egret.TextField#numLines
         */
        public get numLines():number {
            return this._numLines;
        }

        public _multiline:boolean = false;
        /**
         * 表示字段是否为多行文本字段。注意，此属性仅在type为TextFieldType.INPUT时才有效。
         * 如果值为 true，则文本字段为多行文本字段；如果值为 false，则文本字段为单行文本字段。在类型为 TextFieldType.INPUT 的字段中，multiline 值将确定 Enter 键是否创建新行（如果值为 false，则将忽略 Enter 键）。
         * 默认值为 false。
         * @member {boolean} egret.TextField#multiline
         */
        public set multiline(value:boolean) {
            this._setMultiline(value);
        }
        public _setMultiline(value:boolean):void {
            this._multiline = value;

            this._setDirty();
        }

        public get multiline():boolean {
            return this._multiline;
        }

        public setFocus() {
            //todo:
            Logger.warningWithErrorId(1013);
        }

        constructor() {
            super();
            this.needDraw = true;
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();

            if (this._type == TextFieldType.INPUT) {
                this._inputUtils._removeStageText();
            }
        }

        public _onAddToStage():void {
            super._onAddToStage();

            if (this._type == TextFieldType.INPUT) {
                this._inputUtils._addStageText();
            }
        }

        public _updateBaseTransform():void {
            super._updateTransform();
        }

        public _updateTransform():void {
            if (this._type == TextFieldType.INPUT) {
                if (this._normalDirty) {//本身有变化
                    //this._clearDirty();
                    this._inputUtils._updateProperties();
                }
                else {//兼容可能父层有变化
                    this._inputUtils._updateTransform();
                }
            }
            else {
                this._updateBaseTransform();
            }
        }

        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {
            this.drawText(renderContext);

            this._clearDirty();
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():egret.Rectangle {
            var lines:Array<egret.ILineElement> = this._getLinesArr();
            if (!lines) {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }

            return Rectangle.identity.initialize(0, 0, this._textMaxWidth, this._textMaxHeight + (this._numLines - 1) * this._lineSpacing);
        }


        private _isFlow:boolean = false;

        /**
         * 设置富文本
         * @param textArr 富文本数据
         */
        public set textFlow(textArr:Array<egret.ITextElement>) {
            this._isFlow = true;
            var text:string = "";
            if (textArr == null)
                textArr = [];
            for (var i:number = 0; i < textArr.length; i++) {
                var element:egret.ITextElement = textArr[i];
                text += element.text;
            }

            if (this._displayAsPassword) {
                this._setBaseText(text);
            }
            else {
                this._text = text;
                this.setMiddleStyle(textArr);
            }
        }

        public get textFlow() { 
            return this._textArr;
        }

        private changeToPassText(text:string):string {
            if (this._displayAsPassword) {
                var passText:string = "";
                for (var i:number = 0, num = text.length; i < num; i++) {
                    switch (text.charAt(i)) {
                        case '\n' :
                            passText += "\n";
                            break;
                        case '\r' :
                            break;
                        default :
                            passText += '*';
                    }
                }
                return passText;
            }
            return text;
        }

        private _textArr:Array<egret.ITextElement> = [];
        private _isArrayChanged:boolean = false;

        private setMiddleStyle(textArr:Array<egret.ITextElement>):void {
            this._isArrayChanged = true;
            this._textArr = textArr;
            this._setSizeDirty();
        }

        public _textMaxWidth:number = 0;//文本全部显示时宽
        public get textWidth():number {
            return this._textMaxWidth;
        }

        public _textMaxHeight:number = 0;//文本全部显示时高（无行间距）
        public get textHeight():number {
            return this._textMaxHeight;
        }

        public appendText(text:string):void {
            this.appendElement(<egret.ITextElement>{text:text});
        }

        public appendElement(element:egret.ITextElement):void {
            this._textArr.push(element);
            this.setMiddleStyle(this._textArr);
        }

        private _linesArr:Array<egret.ILineElement> = [];
        public _getLinesArr():Array<egret.ILineElement> {
            if (!this._isArrayChanged) {
                return this._linesArr;
            }
            this._isArrayChanged = false;
            var text2Arr:Array<egret.ITextElement> = this._textArr;
            var renderContext = egret.MainContext.instance.rendererContext;

            this._linesArr = [];
            this._textMaxHeight = 0;
            this._textMaxWidth = 0;

            //宽度被设置为0
            if (this._hasWidthSet && this._explicitWidth == 0) {

                this._numLines = 0;
                return [{ width: 0, height: 0, elements: [] }];
            }

            var linesArr:Array<egret.ILineElement> = this._linesArr;
            var lineW:number = 0;
            var lineH:number = 0;
            var lineCount:number = 0;
            var lineElement:egret.ILineElement;


            if (!this._isFlow) {
                renderContext.setupFont(this);
            }

            for (var i:number = 0; i < text2Arr.length; i++) {
                var element:egret.ITextElement = text2Arr[i];
                element.style = element.style || <egret.ITextStyle>{};

                var text:string = element.text.toString();
                var textArr:Array<string> = text.split(/(?:\r\n|\r|\n)/);

                for (var j:number = 0; j < textArr.length; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = <egret.ILineElement>{width:0, height:0, elements:[]};
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                    }

                    if (this._type == egret.TextFieldType.INPUT) {
                        lineH = this._size;
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || this._size);
                    }


                    if (textArr[j] == "") {

                    }
                    else {
                        if (this._isFlow) {
                            renderContext.setupFont(this, element.style);
                        }
                        var w:number = renderContext.measureText(textArr[j]);
                        if (!this._hasWidthSet) {//没有设置过宽
                            lineW += w;
                            lineElement.elements.push(<egret.IWTextElement>{width:w, text:textArr[j], style:element.style});
                        }
                        else {
                            if (lineW + w <= this._explicitWidth) {//在设置范围内
                                lineElement.elements.push(<egret.IWTextElement>{width:w, text:textArr[j], style:element.style});
                                lineW += w;
                            }
                            else {
                                var k:number = 0;
                                var ww:number = 0;
                                var word:string = textArr[j];
                                var wl:number = word.length;
                                for (; k < wl; k++) {
                                    w = renderContext.measureText(word.charAt(k));
                                    if (lineW + w > this._explicitWidth && lineW + k != 0) {
                                        break;
                                    }
                                    ww += w;
                                    lineW += w;
                                }

                                if (k > 0) {
                                    lineElement.elements.push(<egret.IWTextElement>{width:ww, text:word.substring(0, k), style:element.style});
                                    textArr[j] = word.substring(k);
                                }

                                j--;
                            }
                        }
                    }

                    if (j < textArr.length - 1) {//非最后一个
                        lineElement.width = lineW;
                        lineElement.height = lineH;
                        this._textMaxWidth = Math.max(this._textMaxWidth, lineW);
                        this._textMaxHeight += lineH;

                        if (this._type == TextFieldType.INPUT && !this._multiline) {
                            this._numLines = linesArr.length;
                            return linesArr;
                        }
                        lineCount++;
                    }
                }

                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    this._textMaxWidth = Math.max(this._textMaxWidth, lineW);
                    this._textMaxHeight += lineH;
                }
            }

            this._numLines = linesArr.length;
            return linesArr;
        }

        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext:RendererContext):void {
            var lines:Array<egret.ILineElement> = this._getLinesArr();
            if (!lines) {
                return;
            }

            if (!this._isFlow) {//非富文本
                renderContext.setupFont(this);
            }

            var maxWidth:number = this._hasWidthSet ? this._explicitWidth : this._textMaxWidth;
            var textHeight:number = this._textMaxHeight + (this._numLines - 1) * this._lineSpacing;

            var drawY:number = 0;
            var startLine:number = 0;
            if (this._hasHeightSet) {//
                if (textHeight < this._explicitHeight) {//最大高度比需要显示的高度小
                    var valign:number = 0;
                    if (this._verticalAlign == VerticalAlign.MIDDLE)
                        valign = 0.5;
                    else if (this._verticalAlign == VerticalAlign.BOTTOM)
                        valign = 1;
                    drawY += valign * (this._explicitHeight - textHeight);
                }
                else if (textHeight > this._explicitHeight) {//最大高度比需要显示的高度大
                    startLine = Math.max(this._scrollV - 1, 0);
                    startLine = Math.min(this._numLines - 1, startLine);
                }
            }

            drawY = Math.round(drawY);
            var halign:number = 0;
            if (this._textAlign == HorizontalAlign.CENTER) {
                halign = 0.5;
            }
            else if (this._textAlign == HorizontalAlign.RIGHT) {
                halign = 1;
            }

            var drawX:number = 0;
            for (var i = startLine; i < this._numLines; i++) {
                var line:egret.ILineElement = lines[i];
                var h:number = line.height;
                drawY += h / 2;

                if (i != 0 && this._hasHeightSet && drawY > this._explicitHeight) {
                    break;
                }

                drawX = Math.round((maxWidth - line.width) * halign);

                for (var j:number = 0; j < line.elements.length; j++) {
                    var element:egret.IWTextElement = line.elements[j];
                    var size:number = element.style.size || this._size;

                    if (this._type == egret.TextFieldType.INPUT) {
                        renderContext.drawText(this, element.text, drawX, drawY + (h - size) / 2, element.width);
                    }
                    else {
                        if (this._isFlow) {
                            renderContext.setupFont(this, element.style);
                        }

                        renderContext.drawText(this, element.text, drawX, drawY + (h - size) / 2, element.width, element.style);
                    }
                    drawX += element.width;
                }
                drawY += h / 2 + this._lineSpacing;
            }
        }

        public _getTextElement(x:number, y:number):ITextElement {
            var hitTextEle:IHitTextElement = this._getHit(x, y);

            var lineArr:Array<egret.ILineElement>  = this._getLinesArr();
            if (lineArr[hitTextEle.lineIndex] && lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex]) {
                return lineArr[hitTextEle.lineIndex].elements[hitTextEle.textElementIndex];
            }
            return null;
        }

        private _getHit(x:number, y:number):IHitTextElement {
            var line:number = 0;

            var lineArr:Array<egret.ILineElement>  = this._getLinesArr();
            if (lineArr.length < line) {//点击在空白处外
                return null;
            }

            var lineH:number = 0;
            for (var i:number = 0; i < lineArr.length; i++) {
                var lineEle:egret.ILineElement = lineArr[i];
                if (lineH + lineEle.height >= y) {
                    line = i + 1;
                    break;
                }
                else {
                    lineH += lineEle.height;
                }

                if (lineH + this._lineSpacing > y) {
                    return null;
                }

                lineH += this._lineSpacing;
            }

            var lineElement:egret.ILineElement = lineArr[line - 1];
            var lineW:number = 0;
            for (i = 0; i < lineElement.elements.length; i++) {
                var iwTE:IWTextElement = lineElement.elements[i];

                if (lineW + iwTE.width < x) {
                    lineW += iwTE.width;
                }
                else {
                    return {"lineIndex" : line - 1, "textElementIndex" : i};
                }
            }

            return null;
        }
    }

    /**
     * @private
     */
    export interface IHitTextElement {
        lineIndex:number;
        textElementIndex:number;
    }

    export interface ITextStyle {
        textColor?:number;
        strokeColor?:number;
        size?:number;
        stroke?:number;
        bold?:boolean;
        italic?:boolean;
        fontFamily?:string;
    }

    export interface ITextElement {
        text:string;
        style?:ITextStyle;
    }

    export interface IWTextElement extends ITextElement {
        width:number;
    }

    export interface ILineElement {
        width:number;
        height:number;

        elements:Array<IWTextElement>;
    }

}