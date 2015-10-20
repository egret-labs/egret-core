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
module egret.web {

    /**
     * @classdesc
     * @extends egret.StageText
     * @private
     */
    export class HTML5StageText extends EventDispatcher implements StageText {

        /**
         * @private
         */
        private htmlInput:egret.web.HTMLInput;
        /**
         * @private
         */
        constructor() {
            super();

        }

        /**
         * @private
         */
        $textfield:egret.TextField;
        /**
         * @private
         * 
         * @param textfield 
         */
        $setTextField(textfield:egret.TextField):boolean {
            this.$textfield = textfield;

            return true;
        }

        /**
         * @private
         */
        private _isNeedShow:boolean = false;
        /**
         * @private
         */
        private inputElement:any = null;
        /**
         * @private
         */
        private inputDiv:any = null;

        /**
         * @private
         */
        private _gscaleX:number = 0;
        /**
         * @private
         */
        private _gscaleY:number = 0;

        /**
         * @private
         * 
         */
        $addToStage():void {
            this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
        }

        /**
         * @private
         * 
         */
        private _initElement():void {
            var point = this.$textfield.localToGlobal(0, 0);
            var x = point.x;
            var y = point.y;
            var cX = this.$textfield.$renderMatrix.a;
            var cY = this.$textfield.$renderMatrix.d;

            var scaleX = this.htmlInput.$scaleX;
            var scaleY = this.htmlInput.$scaleY;

            this.inputDiv.style.left = x * scaleX + "px";
            this.inputDiv.style.top = y * scaleY + "px";

            if (this.$textfield.multiline) {
                this.inputDiv.style.top = (y) * scaleY + "px";

                this.inputElement.style.top = (-this.$textfield.lineSpacing / 2) + "px";
            }
            else {
                this.inputDiv.style.top = y * scaleY + "px";

                this.inputElement.style.top = 0 + "px";
            }

            this._gscaleX = scaleX * cX;
            this._gscaleY = scaleY * cY;
        }

        /**
         * @private
         * 
         */
        $show():void {
            if (!this.htmlInput.isCurrentStageText(this)) {
                this.inputElement = this.htmlInput.getInputElement(this);

                this.inputDiv = this.htmlInput._inputDIV;
            }
            else {
                this.inputElement.onblur = null;
            }

            this.htmlInput._needShow = true;

            //标记当前文本被选中
            this._isNeedShow = true;

            this._initElement();
        }

        /**
         * @private
         * 
         */
        private onBlurHandler():void {
            this.htmlInput.clearInputElement();
            window.scrollTo(0, 0);
        }

        /**
         * @private
         * 
         */
        private executeShow():void {
            var self = this;
            //打开
            this.inputElement.value = this.$getText();

            if (this.inputElement.onblur == null) {
                this.inputElement.onblur = this.onBlurHandler.bind(this);
            }

            this.$resetStageText();

            if (this.$textfield.maxChars > 0) {
                this.inputElement.setAttribute("maxlength", this.$textfield.maxChars);
            }
            else {
                this.inputElement.removeAttribute("maxlength");
            }

            this.inputElement.selectionStart = this.inputElement.value.length;
            this.inputElement.selectionEnd = this.inputElement.value.length;
            this.inputElement.focus();
        }

        /**
         * @private
         */
        private _isNeesHide:boolean = false;

        /**
         * @private
         * 
         */
        $hide():void {
            //标记当前点击其他地方关闭
            this._isNeesHide = true;

            if (this.htmlInput && egret.web.Html5Capatibility._System_OS == egret.web.SystemOSType.IOS) {//ios
                this.htmlInput.disconnectStageText(this);
            }
        }

        /**
         * @private
         */
        private textValue:string = "";

        /**
         * @private
         * 
         * @returns 
         */
        $getText():string {
            if (!this.textValue) {
                this.textValue = "";
            }
            return this.textValue;
        }

        /**
         * @private
         * 
         * @param value 
         */
        $setText(value:string):boolean {
            this.textValue = value;

            this.resetText();

            return true;
        }

        /**
         * @private
         * 
         */
        private resetText():void {
            if (this.inputElement) {
                this.inputElement.value = this.textValue;
            }
        }

        $onBlur():void {
            if (Html5Capatibility._System_OS == SystemOSType.WPHONE) {
                egret.Event.dispatchEvent(this, "updateText", false);
            }
        }

        /**
         * @private
         * 
         */
        public _onInput():void {
            var self = this;

            if (Html5Capatibility._System_OS == SystemOSType.WPHONE) {
                var values = this.$textfield.$TextField;
                if (values[sys.TextKeys.restrictAnd] == null && values[sys.TextKeys.restrictNot] == null) {
                    self.textValue = self.inputElement.value;

                    egret.Event.dispatchEvent(self, "updateText", false);
                }
            }
            else {
                if (self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                    self.textValue = self.inputElement.value;

                    egret.Event.dispatchEvent(self, "updateText", false);
                }
            }
        }

        private setAreaHeight() {
            var textfield:egret.TextField = this.$textfield;
            if (textfield.multiline) {
                var textheight = TextFieldUtils.$getTextHeight(textfield);
                if (textfield.height < textheight) {
                    this.setElementStyle("height", (textfield.height + textfield.lineSpacing) * this._gscaleY + "px");

                    this.setElementStyle("padding", "0px");
                }
                else {
                    this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");

                    var rap = (textfield.height - textheight) * this._gscaleY;
                    var valign:number = TextFieldUtils.$getValign(textfield);
                    var top = rap * valign;
                    var bottom = rap - top;
                    this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                }

                this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
            }
        }

        /**
         * @private
         * 
         * @param e 
         */
        public _onClickHandler(e):void {
            if (this._isNeedShow) {
                e.stopImmediatePropagation();
                //e.preventDefault();
                this._isNeedShow = false;

                this.executeShow();

                this.dispatchEvent(new egret.Event("focus"));
            }
        }

        /**
         * @private
         * 
         */
        public _onDisconnect():void {
            this.inputElement = null;

            this.dispatchEvent(new egret.Event("blur"));
        }

        /**
         * @private
         */
        private _styleInfoes:Object = {};

        /**
         * @private
         * 
         * @param style 
         * @param value 
         */
        private setElementStyle(style:string, value:any):void {
            if (this.inputElement) {
                if (this._styleInfoes[style] != value) {
                    this.inputElement.style[style] = value;
                    //this._styleInfoes[style] = value;
                }
            }
        }

        /**
         * @private
         * 
         */
        $removeFromStage():void {
            if (this.inputElement) {
                this.htmlInput.disconnectStageText(this);
            }
        }

        /**
         * 修改位置
         * @private
         */
        $resetStageText():void {
            if (this.inputElement) {
                var textfield:egret.TextField = this.$textfield;
                this.setElementStyle("fontFamily", textfield.fontFamily);
                this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                this.setElementStyle("textAlign", textfield.textAlign);
                this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                this.setElementStyle("color", toColorString(textfield.textColor));

                if (textfield.stage) {
                    var tw = textfield.localToGlobal(0, 0).x;
                    tw = Math.min(textfield.width, textfield.stage.stageWidth - tw);
                }
                else {
                    tw = textfield.width
                }

                this.setElementStyle("width", tw * this._gscaleX + "px");

                this.setElementStyle("verticalAlign", textfield.verticalAlign);
                if (textfield.multiline) {
                    this.setAreaHeight();
                }
                else {
                    this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");

                    if (textfield.height < textfield.size) {
                        this.setElementStyle("height", (textfield.height) * this._gscaleY + "px");

                        this.setElementStyle("padding", "0px");
                    }
                    else {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");

                        var rap = (textfield.height - textfield.size) * this._gscaleY;
                        var valign:number = TextFieldUtils.$getValign(textfield);
                        var top = rap * valign;
                        var bottom = rap - top;
                        this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                    }

                }

                this.inputDiv.style.clip = "rect(0px "+(textfield.width * this._gscaleX)+"px " +(textfield.height * this._gscaleY)+"px 0px)";
                this.inputDiv.style.height = textfield.height * this._gscaleY + "px";
                this.inputDiv.style.width = tw * this._gscaleX + "px";
            }
        }
    }

    StageText = HTML5StageText;
}

module egret.web {
    /**
     * @private
     */
    export class HTMLInput {
        /**
         * @private
         */
        private _stageText:HTML5StageText;

        /**
         * @private
         */
        private _simpleElement:any;
        /**
         * @private
         */
        private _multiElement:any;

        /**
         * @private
         */
        private _inputElement:any;
        /**
         * @private
         */
        public _inputDIV:any;

        /**
         * @private
         * 
         * @returns 
         */
        public isInputOn():boolean {
            return this._stageText != null;
        }

        /**
         * @private
         * 
         * @param stageText 
         * @returns 
         */
        public isCurrentStageText(stageText):boolean {
            return this._stageText == stageText;
        }

        /**
         * @private
         * 
         * @param dom 
         */
        private initValue(dom:any):void {
            dom.style.position = "absolute";
            dom.style.left = "0px";
            dom.style.top = "0px";
            dom.style.border = "none";
            dom.style.padding = "0";
        }

        /**
         * @private
         */
        public _needShow:boolean = false;

        /**
         * @private
         */
        $scaleX:number = 1;
        /**
         * @private
         */
        $scaleY:number = 1;

        /**
         * @private
         * 
         */
        $updateSize():void {
            if(!this.canvas) {
                return;
            }
            var stageW = this.canvas.width;
            var stageH = this.canvas.height;
            var screenW = this.canvas.style.width.split("px")[0];
            var screenH = this.canvas.style.height.split("px")[0];

            this.$scaleX = screenW / stageW;
            this.$scaleY = screenH / stageH;

            this.StageDelegateDiv.style.left = this.canvas.style.left;
            this.StageDelegateDiv.style.top = this.canvas.style.top;

            var transformKey = egret.web.getPrefixStyleName("transform");
            this.StageDelegateDiv.style[transformKey] = this.canvas.style[transformKey];
            this.StageDelegateDiv.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
        }

        /**
         * @private
         */
        private StageDelegateDiv;
        /**
         * @private
         */
        private canvas;
        /**
         * @private
         * 
         * @param container 
         * @param canvas 
         * @returns 
         */
        public _initStageDelegateDiv(container, canvas):any {
            this.canvas = canvas;
            var self = this;
            var stageDelegateDiv;
            if (!stageDelegateDiv) {
                stageDelegateDiv = document.createElement("div");
                this.StageDelegateDiv = stageDelegateDiv;
                stageDelegateDiv.id = "StageDelegateDiv";
                container.appendChild(stageDelegateDiv);
                self.initValue(stageDelegateDiv);

                self._inputDIV = document.createElement("div");
                self.initValue(self._inputDIV);
                self._inputDIV.style.width = "0px";
                self._inputDIV.style.height = "0px";

                self._inputDIV.style.left = 0 + "px";
                self._inputDIV.style.top = "-100px";

                self._inputDIV.style[egret.web.getPrefixStyleName("transformOrigin")] = "0% 0% 0px";
                stageDelegateDiv.appendChild(self._inputDIV);

                this.canvas.addEventListener("click", function (e) {
                    if (self._needShow) {
                        self._needShow = false;

                        self._stageText._onClickHandler(e);

                        self.show();

                    }
                    else {
                        if (self._inputElement) {
                            self.clearInputElement();
                            self._inputElement.blur();
                            self._inputElement = null;
                        }
                    }
                });

                self.initInputElement(true);
                self.initInputElement(false);
            }
        }

        //初始化输入框
        private initInputElement(multiline:boolean):void {
            var self = this;

            //增加1个空的textarea
            var inputElement:any;
            if (multiline) {
                inputElement = document.createElement("textarea");
                inputElement.style["resize"] = "none";
                self._multiElement = inputElement;
                inputElement.id = "egretTextarea";
            }
            else {
                inputElement = document.createElement("input");
                self._simpleElement = inputElement;
                inputElement.id = "egretInput";
            }

            inputElement.type = "text";

            self._inputDIV.appendChild(inputElement);
            inputElement.setAttribute("tabindex", "-1");
            inputElement.style.width = "1px";
            inputElement.style.height = "12px";

            self.initValue(inputElement);
            inputElement.style.outline = "thin";
            inputElement.style.background = "none";

            inputElement.style.overflow = "hidden";
            inputElement.style.wordBreak = "break-all";

            //隐藏输入框
            inputElement.style.opacity = 0;

            inputElement.oninput = function () {
                if (self._stageText) {
                    self._stageText._onInput();
                }
            };
        }

        /**
         * @private
         * 
         */
        public show():void {
            var self = this;
            var inputElement = self._inputElement;
            //隐藏输入框
            egret.$callAsync(function () {
                inputElement.style.opacity = 1;
            }, self);
        }

        /**
         * @private
         * 
         * @param stageText 
         */
        public disconnectStageText(stageText):void {
            if (this._stageText == null || this._stageText == stageText) {
                this.clearInputElement();

                if (this._inputElement) {
                    this._inputElement.blur();
                }
            }
        }

        /**
         * @private
         * 
         */
        public clearInputElement():void {
            var self = this;
            if (self._inputElement) {
                self._inputElement.value = "";

                self._inputElement.onblur = null;

                self._inputElement.style.width = "1px";
                self._inputElement.style.height = "12px";
                self._inputElement.style.left = "0px";
                self._inputElement.style.top = "0px";
                self._inputElement.style.opacity = 0;

                var otherElement;
                if (self._simpleElement == self._inputElement) {
                    otherElement = self._multiElement;
                }
                else {
                    otherElement = self._simpleElement;
                }
                otherElement.style.display = "block";

                self._inputDIV.style.left = 0 + "px";
                self._inputDIV.style.top = "-100px";
                self._inputDIV.style.height = 0 + "px";
                self._inputDIV.style.width = 0 + "px";

            }

            if (self._stageText) {
                self._stageText._onDisconnect();
                self._stageText = null;
                this.canvas['userTyping'] = false;
            }
        }

        /**
         * @private
         * 
         * @param stageText 
         * @returns 
         */
        public getInputElement(stageText):any {
            var self = this;
            self.clearInputElement();

            self._stageText = stageText;

            this.canvas['userTyping'] = true;

            if (self._stageText.$textfield.multiline) {
                self._inputElement = self._multiElement;
            }
            else {
                self._inputElement = self._simpleElement;
            }

            var otherElement;
            if (self._simpleElement == self._inputElement) {
                otherElement = self._multiElement;
            }
            else {
                otherElement = self._simpleElement;
            }
            otherElement.style.display = "none";

            return self._inputElement;
        }
    }
}

module egret.web {

    var stageToTextLayerMap:any = {};
    var stageToCanvasMap:any = {};
    var stageToContainerMap:any = {};

    /**
     * @private
     * 获取
     */
    export function $getTextAdapter(textfield:TextField):HTMLInput{
        var stageHash = textfield.stage?textfield.stage.$hashCode:0;
        var adapter = stageToTextLayerMap[stageHash];
        var canvas = stageToCanvasMap[stageHash];
        var container = stageToContainerMap[stageHash];
        if(canvas && container) {
            //adapter._initStageDelegateDiv(container, canvas);
            //adapter.$updateSize();
            delete stageToCanvasMap[stageHash];
            delete stageToContainerMap[stageHash];
        }
        return adapter;
    }

    /**
     * @private
     */
    export function $cacheTextAdapter(adapter:HTMLInput, stage, container:HTMLDivElement, canvas){
        adapter._initStageDelegateDiv(container, canvas);
        stageToTextLayerMap[stage.$hashCode] = adapter;
        stageToCanvasMap[stage.$hashCode] = canvas;
        stageToContainerMap[stage.$hashCode] = container;
    }
}
