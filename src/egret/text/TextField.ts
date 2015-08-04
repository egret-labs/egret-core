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
     * @class egret.TextField
     * @classdesc
     * TextField是egret的文本渲染类，采用浏览器/设备的API进行渲染，在不同的浏览器/设备中由于字体渲染方式不一，可能会有渲染差异
     * 如果开发者希望所有平台完全无差异，请使用BitmapText
     * @extends egret.DisplayObject
     * @see http://edn.egret.com/cn/index.php?g=&m=article&a=index&id=141&terms1_id=25&terms2_id=33 创建文本
     * @event egret.TextEvent.LINK 点击链接后调度。
     * @includeExample egret/text/TextField.ts
     */
    export class TextField extends DisplayObject {

        /**
         * @private
         */
        public static default_fontFamily:string = "Arial";

        private isInput():boolean {
            return this._TF_Props_._type == TextFieldType.INPUT;
        }

        public _inputEnabled:boolean = false;
        public _setTouchEnabled(value:boolean):void {
            super._setTouchEnabled(value);

            if (this.isInput()) {
                this._inputEnabled = true;
            }
        }

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
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            if (properties._type != value) {
                properties._type = value;
                if (properties._type == TextFieldType.INPUT) {//input，如果没有设置过宽高，则设置默认值为100，30
                    if (!this._DO_Props_._hasWidthSet) {
                        this._setWidth(100);
                    }
                    if (!this._DO_Props_._hasHeightSet) {
                        this._setHeight(30);
                    }

                    //创建stageText
                    if (this._inputUtils == null) {
                        this._inputUtils = new egret.InputController();
                    }

                    this._inputUtils.init(this);
                    this._setDirty();

                    if (this._DO_Props_._stage) {
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
            return this._TF_Props_._type;
        }

        public get text():string {
            return this._getText();
        }

        public _getText():string {
            if (this._TF_Props_._type == egret.TextFieldType.INPUT) {
                return this._inputUtils._getText();
            }

            return this._TF_Props_._text;
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


        public _setBaseText(value:string):void {
            if (value == null) {
                value = "";
            }
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;

            this._isFlow = false;
            if (properties._text != value) {
                this._setTextDirty();
                properties._text = value;
                var text:string = "";
                if (properties._displayAsPassword) {
                    text = this.changeToPassText(properties._text);
                }
                else {
                    text = properties._text;
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
                this._inputUtils._setText(this._TF_Props_._text);
            }
        }

        public get displayAsPassword():boolean {
            return this._TF_Props_._displayAsPassword;
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
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            if (properties._displayAsPassword != value) {
                properties._displayAsPassword = value;

                this._setTextDirty();
                var text:string = "";
                if (properties._displayAsPassword) {
                    text = this.changeToPassText(properties._text);
                }
                else {
                    text = properties._text;
                }

                this.setMiddleStyle([<egret.ITextElement>{text: text}]);
            }
        }


        public get fontFamily():string {
            return this._TF_Props_._fontFamily;
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
            if (this._TF_Props_._fontFamily != value) {
                this._setTextDirty();
                this._TF_Props_._fontFamily = value;
            }
        }


        public get size():number {
            return this._TF_Props_._size;
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
            if (this._TF_Props_._size != value) {
                this._setTextDirty();
                this._TF_Props_._size = value;
            }
        }


        public get italic():boolean {
            return this._TF_Props_._italic;
        }

        /**
         * 表示使用此文本格式的文本是否为斜体。
         * 如果值为 true，则文本为斜体；false，则为不使用斜体。
         * 默认值为 false。
         * @member {boolean} egret.TextField#italic
         * @platform Web
         */
        public set italic(value:boolean) {
            this._setItalic(value);
        }

        public _setItalic(value:boolean):void {
            if (this._TF_Props_._italic != value) {
                this._setTextDirty();
                this._TF_Props_._italic = value;
            }
        }


        public get bold():boolean {
            return this._TF_Props_._bold;
        }

        /**
         * 指定文本是否为粗体字。
         * 如果值为 true，则文本为粗体字；false，则为非粗体字。
         * 默认值为 false。
         * @member {boolean} egret.TextField#bold
         * @platform Web
         */
        public set bold(value:boolean) {
            this._setBold(value);
        }

        public _setBold(value:boolean):void {
            if (this._TF_Props_._bold != value) {
                this._setTextDirty();
                this._TF_Props_._bold = value;
            }
        }

        public get textColor():number {
            return this._TF_Props_._textColor;
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
            if (this._TF_Props_._textColor != value) {
                this._setTextDirty();
                this._TF_Props_._textColor = value;
                this._TF_Props_._textColorString = toColorString(value);
            }
        }

        public get strokeColor():number {
            return this._TF_Props_._strokeColor;
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
            if (this._TF_Props_._strokeColor != value) {
                this._setTextDirty();
                this._TF_Props_._strokeColor = value;
                this._TF_Props_._strokeColorString = toColorString(value);
            }
        }


        public get stroke():number {
            return this._TF_Props_._stroke;
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
            if (this._TF_Props_._stroke != value) {
                this._setTextDirty();
                this._TF_Props_._stroke = value;
            }
        }


        public get textAlign():string {
            return this._TF_Props_._textAlign;
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
            if (this._TF_Props_._textAlign != value) {
                this._setTextDirty();
                this._TF_Props_._textAlign = value;
            }
        }


        public get verticalAlign():string {
            return this._TF_Props_._verticalAlign;
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
            if (this._TF_Props_._verticalAlign != value) {
                this._setTextDirty();
                this._TF_Props_._verticalAlign = value;
            }
        }

        /**
         * @private
         */
        public maxWidth;

        public get maxChars():number {
            return this._TF_Props_._maxChars;
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
            if (this._TF_Props_._maxChars != value) {
                this._TF_Props_._maxChars = value;
            }
        }

        /**
         * 文本在文本字段中的垂直位置。scrollV 属性可帮助用户定位到长篇文章的特定段落，还可用于创建滚动文本字段。
         * 垂直滚动的单位是行，而水平滚动的单位是像素。
         * 如果显示的第一行是文本字段中的第一行，则 scrollV 设置为 1（而非 0）。
         * @param value
         */
        public set scrollV(value:number) {
            this._TF_Props_._scrollV = Math.max(value, 1);

            this._setDirty();
        }

        public get scrollV():number {
            return Math.min(Math.max(this._TF_Props_._scrollV, 1), this.maxScrollV);
        }

        /**
         * scrollV 的最大值
         * @returns {number}
         */
        public get maxScrollV():number {
            this._getLinesArr();
            return Math.max(this._TF_Props_._numLines - TextFieldUtils._getScrollNum(this) + 1, 1);
        }

        /**
         * @private
         */
        public get selectionBeginIndex():number {
            return 0;
        }
        /**
         * @private
         */
        public get selectionEndIndex():number {
            return 0;
        }
        /**
         * @private
         */
        public get caretIndex():number {
            return 0;
        }
        public _setSelection(beginIndex:number, endIndex:number) {

        }


        public get lineSpacing():number {
            return this._TF_Props_._lineSpacing;
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
            if (this._TF_Props_._lineSpacing != value) {
                this._setTextDirty();
                this._TF_Props_._lineSpacing = value;
            }
        }

        public _getLineHeight():number {
            return this._TF_Props_._lineSpacing + this._TF_Props_._size;
        }

        /**
         * 文本行数。
         * @member {number} egret.TextField#numLines
         */
        public get numLines():number {
            return this._TF_Props_._numLines;
        }

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
            this._TF_Props_._multiline = value;

            this._setDirty();
        }

        public get multiline():boolean {
            return this._TF_Props_._multiline;
        }

        public _setWidth(value:number):void {
            super._setWidth(value);
        }

        public _setHeight(value:number):void {
            super._setHeight(value);
        }

        private _bgGraphics:Graphics = null;

        /**
         * 指定文本字段是否具有边框。
         * 如果为 true，则文本字段具有边框。如果为 false，则文本字段没有边框。
         * 使用 borderColor 属性来设置边框颜色。
         * 默认值为 false。
         * @member {boolean} egret.TextField#border
         */
        public set border(value:boolean) {
            this._TF_Props_._border = value;
            this.fillBackground();
        }
        public get border():boolean {
            return this._TF_Props_._border;
        }

        /**
         * 文本字段边框的颜色。默认值为 0x000000（黑色）。
         * 即使当前没有边框，也可检索或设置此属性，但只有当文本字段已将 border 属性设置为 true 时，才可以看到颜色。
         * @member {number} egret.TextField#borderColor
         */
        public set borderColor(value:number) {
            this._TF_Props_._borderColor = value;
            this.fillBackground();
        }
        public get borderColor():number {
            return this._TF_Props_._borderColor;
        }

        /**
         * 指定文本字段是否具有背景填充。
         * 如果为 true，则文本字段具有背景填充。如果为 false，则文本字段没有背景填充。
         * 使用 backgroundColor 属性来设置文本字段的背景颜色。
         * 默认值为 false。
         * @member {boolean} egret.TextField#background
         */
        public set background(value:boolean) {
            this._TF_Props_._background = value;
            this.fillBackground();
        }
        public get background():boolean {
            return this._TF_Props_._background;
        }

        /**
         * 文本字段背景的颜色。默认值为 0xFFFFFF（白色）。
         * 即使当前没有背景，也可检索或设置此属性，但只有当文本字段已将 background 属性设置为 true 时，才可以看到颜色。
         * @member {number} egret.TextField#backgroundColor
         */
        public set backgroundColor(value:number) {
            this._TF_Props_._backgroundColor = value;
            this.fillBackground();
        }

        public get backgroundColor():number {
            return this._TF_Props_._backgroundColor;
        }

        private fillBackground():void {
            var self = this;
            var graphics:egret.Graphics = self._bgGraphics;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            if (graphics) {
                graphics.clear();
            }
            if (properties._background || properties._border) {
                if (graphics == null) {
                    graphics = self._bgGraphics = new egret.Graphics();
                }
                if (properties._background) {
                    graphics.beginFill(properties._backgroundColor, 1);
                }
                if (properties._border) {
                    graphics.lineStyle(1, properties._borderColor);
                }
                graphics.drawRect(0, 0, self._getWidth(), self._getHeight());
                graphics.endFill();
            }
        }

        /**
         * @private
         */
        public setFocus() {
            //todo:
            $warn(1013);
        }

        public _TF_Props_:TextFieldProperties;

        /**
         * 创建一个 egret.TextField 对象
         */
        constructor() {
            super();
            this.needDraw = true;

            this._TF_Props_ = new egret.TextFieldProperties();
        }

        public _onRemoveFromStage():void {
            super._onRemoveFromStage();

            this._removeEvent();

            if (this._TF_Props_._type == TextFieldType.INPUT) {
                this._inputUtils._removeStageText();
            }
        }

        public _onAddToStage():void {
            super._onAddToStage();

            this._addEvent();

            if (this._TF_Props_._type == TextFieldType.INPUT) {
                this._inputUtils._addStageText();
            }
        }

        public _updateBaseTransform():void {
            this._getLinesArr();
            if (this._TF_Props_._textMaxWidth == 0 && this._TF_Props_._type != TextFieldType.INPUT) {
                return;
            }

            super._updateTransform();

            var matrix = this._worldTransform;
        }

        public _updateTransform():void {
            if (this._TF_Props_._type == TextFieldType.INPUT) {
                if (this._DO_Props_._normalDirty) {//本身有变化
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

        public _draw(renderContext:RendererContext):void {
            super._draw(renderContext);
        }

        /**
         * @see egret.DisplayObject._render
         * @param renderContext
         */
        public _render(renderContext:RendererContext):void {
            var self = this;

            if(self._bgGraphics)
                self._bgGraphics._draw(renderContext);

            var properties:egret.TextFieldProperties = self._TF_Props_;
            if (properties._type == egret.TextFieldType.INPUT) {
                if (self._isTyping) {
                    return;
                }
            }
            else if (properties._textMaxWidth == 0) {
                return;
            }

            this.drawText(renderContext);

            this._clearDirty();
        }

        /**
         * 测量显示对象坐标与大小
         */
        public _measureBounds():egret.Rectangle {
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            this._getLinesArr();
            if (properties._textMaxWidth == 0) {
                return Rectangle.identity.initialize(0, 0, 0, 0);
            }

            return Rectangle.identity.initialize(0, 0, properties._textMaxWidth, TextFieldUtils._getTextHeight(self));
        }


        private _isFlow:boolean = false;

        /**
         * 设置富文本
         * @param textArr 富文本数据
         */
        public set textFlow(textArr:Array<egret.ITextElement>) {
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            this._isFlow = true;
            var text:string = "";
            if (textArr == null)
                textArr = [];
            for (var i:number = 0; i < textArr.length; i++) {
                var element:egret.ITextElement = textArr[i];
                text += element.text;
            }

            if (properties._displayAsPassword) {
                this._setBaseText(text);
            }
            else {
                properties._text = text;
                this.setMiddleStyle(textArr);
            }
        }

        public get textFlow():Array<egret.ITextElement> {
            return this._textArr;
        }

        private changeToPassText(text:string):string {
            if (this._TF_Props_._displayAsPassword) {
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

        /**
         * 文本的宽度，以像素为单位。
         * @member {number} egret.TextField#textWidth
         */
        public get textWidth():number {
            return this._TF_Props_._textMaxWidth;
        }

        /**
         * 文本的高度，以像素为单位。
         * @member {number} egret.TextField#textHeight
         */
        public get textHeight():number {
            return TextFieldUtils._getTextHeight(this);
        }

        /**
         * 将 newText 参数指定的字符串追加到文本字段的文本的末尾。
         * @method {number} egret.TextField#appendText
         * @param newText {string} 要追加到现有文本末尾的字符串
         */
        public appendText(newText:string):void {
            this.appendElement(<egret.ITextElement>{text:newText});
        }

        /**
         * 将 newElement 参数指定的文本内容追加到文本字段的文本的末尾。
         * @method {number} egret.TextField#appendElement
         * @param newElement {egret.ITextElement} 要追加到现有文本末尾的文本内容
         */
        public appendElement(newElement:egret.ITextElement):void {
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;

            var text:string = properties._text + newElement.text;

            if (properties._displayAsPassword) {
                self._setBaseText(text);
            }
            else {
                properties._text = text;

                self._textArr.push(newElement);
                self.setMiddleStyle(self._textArr);
            }
        }

        private _linesArr:Array<egret.ILineElement> = [];
        public _getLinesArr():Array<egret.ILineElement> {
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;
            if (!self._isArrayChanged) {
                return self._linesArr;
            }

            self._isArrayChanged = false;
            var text2Arr:Array<egret.ITextElement> = self._textArr;
            var renderContext = egret.MainContext.instance.rendererContext;

            self._linesArr.length = 0;
            properties._textMaxHeight = 0;
            properties._textMaxWidth = 0;

            //宽度被设置为0
            if (self._DO_Props_._hasWidthSet && self._DO_Props_._explicitWidth == 0) {
                properties._numLines = 0;
                return [{ width: 0, height: 0, charNum:0, elements: [], hasNextLine:false }];
            }

            if (!self._isFlow) {
                renderContext.setupFont(self);
            }

            var linesArr:Array<egret.ILineElement> = self._linesArr;
            var lineW:number = 0;
            var lineCharNum:number = 0;
            var lineH:number = 0;
            var lineCount:number = 0;
            var lineElement:egret.ILineElement;

            for (var i:number = 0, text2ArrLength:number = text2Arr.length; i < text2ArrLength; i++) {
                var element:egret.ITextElement = text2Arr[i];
                element.style = element.style || <egret.ITextStyle>{};

                var text:string = element.text.toString();
                var textArr:Array<string> = text.split(/(?:\r\n|\r|\n)/);

                for (var j:number = 0, textArrLength:number = textArr.length; j < textArrLength; j++) {
                    if (linesArr[lineCount] == null) {
                        lineElement = {width:0, height:0, elements:[], charNum:0, hasNextLine:false};
                        linesArr[lineCount] = lineElement;
                        lineW = 0;
                        lineH = 0;
                        lineCharNum = 0;
                    }

                    if (properties._type == egret.TextFieldType.INPUT) {
                        lineH = properties._size;
                    }
                    else {
                        lineH = Math.max(lineH, element.style.size || properties._size);
                    }

                    var isNextLine:boolean = true;
                    if (textArr[j] == "") {
                        if (j == textArrLength - 1) {
                            isNextLine = false;
                        }
                    }
                    else {
                        if (self._isFlow) {
                            renderContext.setupFont(self, element.style);
                        }
                        var w:number = renderContext.measureText(textArr[j]);
                        if (!self._DO_Props_._hasWidthSet) {//没有设置过宽
                            lineW += w;
                            lineCharNum += textArr[j].length;
                            lineElement.elements.push(<egret.IWTextElement>{width:w, text:textArr[j], style:element.style});

                            if (j == textArrLength - 1) {
                                isNextLine = false;
                            }
                        }
                        else {
                            if (lineW + w <= self._DO_Props_._explicitWidth) {//在设置范围内
                                lineElement.elements.push(<egret.IWTextElement>{width:w, text:textArr[j], style:element.style});
                                lineW += w;
                                lineCharNum += textArr[j].length;

                                if (j == textArrLength - 1) {
                                    isNextLine = false;
                                }
                            }
                            else {
                                var k:number = 0;
                                var ww:number = 0;
                                var word:string = textArr[j];
                                if (this._TF_Props_._wordWrap) {
                                    var words:Array<string> = word.split(/\b/);
                                }
                                else {
                                    words = word.match(/./g);
                                }
                                var wl:number = words.length;
                                var charNum = 0;
                                for (; k < wl; k++) {
                                    w = renderContext.measureText(words[k]);
                                    if (lineW != 0 && lineW + w > self._DO_Props_._explicitWidth && lineW + k != 0) {
                                        break;
                                    }
                                    charNum += words[k].length;
                                    ww += w;
                                    lineW += w;
                                    lineCharNum += charNum;
                                }

                                if (k > 0) {
                                    lineElement.elements.push(<egret.IWTextElement>{
                                        width: ww,
                                        text: word.substring(0, charNum),
                                        style: element.style
                                    });

                                    var leftWord:string = word.substring(charNum);
                                    for (var m:number = 0, lwleng = leftWord.length; m < lwleng; m++) {
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
                        properties._textMaxWidth = Math.max(properties._textMaxWidth, lineW);
                        properties._textMaxHeight += lineH;

                        //if (self._type == TextFieldType.INPUT && !self._multiline) {
                        //    self._numLines = linesArr.length;
                        //    return linesArr;
                        //}
                        lineCount++;
                    }


                }

                if (i == text2Arr.length - 1 && lineElement) {
                    lineElement.width = lineW;
                    lineElement.height = lineH;
                    lineElement.charNum = lineCharNum;
                    properties._textMaxWidth = Math.max(properties._textMaxWidth, lineW);
                    properties._textMaxHeight += lineH;
                }
            }

            properties._numLines = linesArr.length;
            this.fillBackground();
            return linesArr;
        }


        /**
         * @private
         */
        public get wordWrap():boolean {
            return this._TF_Props_._wordWrap;
        }

        /**
         * @private
         */
        public set wordWrap(value:boolean) {
            this._TF_Props_._wordWrap = value;
        }

        public _isTyping:boolean = false;
        /**
         * @private
         * @param renderContext
         * @returns {Rectangle}
         */
        private drawText(renderContext:RendererContext):void {
            var self = this;
            var properties:egret.TextFieldProperties = self._TF_Props_;

            //先算出需要的数值
            var lines:Array<egret.ILineElement> = self._getLinesArr();
            if (properties._textMaxWidth == 0) {
                return;
            }

            var maxWidth:number = self._DO_Props_._hasWidthSet ? self._DO_Props_._explicitWidth : properties._textMaxWidth;
            var textHeight:number = TextFieldUtils._getTextHeight(self);

            var drawY:number = 0;
            var startLine:number = TextFieldUtils._getStartLine(self);
            if (self._DO_Props_._hasHeightSet && self._DO_Props_._explicitHeight > textHeight) {
                var valign:number = TextFieldUtils._getValign(self);
                drawY += valign * (self._DO_Props_._explicitHeight - textHeight);
            }
            drawY = Math.round(drawY);
            var halign:number = TextFieldUtils._getHalign(self);

            var drawX:number = 0;
            for (var i:number = startLine, numLinesLength:number = properties._numLines; i < numLinesLength; i++) {
                var line:egret.ILineElement = lines[i];
                var h:number = line.height;
                drawY += h / 2;
                if (i != startLine) {
                    if (properties._type == egret.TextFieldType.INPUT && !properties._multiline) {
                        break;
                    }
                    if (self._DO_Props_._hasHeightSet && drawY > self._DO_Props_._explicitHeight) {
                        break;
                    }
                }

                drawX = Math.round((maxWidth - line.width) * halign);
                for (var j:number = 0, elementsLength:number = line.elements.length; j < elementsLength; j++) {
                    var element:egret.IWTextElement = line.elements[j];
                    var size:number = element.style.size || properties._size;

                    renderContext.drawText(self, element.text, drawX, drawY + (h - size) / 2, element.width, element.style);
                    drawX += element.width;
                }
                drawY += h / 2 + properties._lineSpacing;
            }
        }

        //增加点击事件
        private _addEvent():void {
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        }

        //释放点击事件
        private _removeEvent():void {
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapHandler, this);
        }

        //处理富文本中有href的
        private onTapHandler(e:egret.TouchEvent):void {
            if (this._TF_Props_._type == egret.TextFieldType.INPUT) {
                return;
            }
            var ele:ITextElement = TextFieldUtils._getTextElement(this, e.localX, e.localY);
            if (ele == null) {
                return;
            }
            var style:egret.ITextStyle = ele.style;

            if (style && style.href) {
                if (style.href.match(/^event:/)) {
                    var type:string = style.href.match(/^event:/)[0];
                    egret.TextEvent.dispatchTextEvent(this, egret.TextEvent.LINK, style.href.substring(type.length));
                }
                else {

                }
            }
        }
    }
}