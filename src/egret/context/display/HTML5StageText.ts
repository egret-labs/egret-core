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
     * @classdesc
     * @extends egret.StageText
     * @private
     */
    export class HTML5StageText extends StageText {

        constructor() {
            super();
            HTMLInput.getInstance();
        }

        private _isNeedShow:boolean = false;
        private inputElement:any = null;
        private inputDiv:any = null;

        public _initElement(x:number, y:number, cX:number, cY:number):void {
            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();

            this.inputDiv.position.x = x * scaleX;
            this.inputDiv.position.y = y * scaleY;

            this.inputDiv.scale.x = scaleX * cX;
            this.inputDiv.scale.y = scaleY * cY;

            this.inputDiv.transforms();
        }

        public _show(multiline:boolean, size:number, width:number, height:number):void {
            this._multiline = multiline;
            if (!HTMLInput.getInstance().isCurrentStageText(this)) {
                this.inputElement = HTMLInput.getInstance().getInputElement(this);

                this.inputDiv = HTMLInput.getInstance()._inputDIV;
            }
            else {
                this.inputElement.onblur = null;
            }

            HTMLInput.getInstance()._needShow = true;

            //标记当前文本被选中
            this._isNeedShow = true;
        }

        private onBlurHandler():void {
            HTMLInput.getInstance().clearInputElement();
            window.scrollTo(0, 0);
        }

        private executeShow():void {
            var self = this;
            //打开
            this.inputElement.value = this._getText();

            if (this.inputElement.onblur == null) {
                this.inputElement.onblur = this.onBlurHandler;
            }

            this._resetStageText();

            if (this._textfield._properties._maxChars > 0) {
                this.inputElement.setAttribute("maxlength", this._textfield._properties._maxChars);
            }
            else {
                this.inputElement.removeAttribute("maxlength");
            }

            this.inputElement.selectionStart = this.inputElement.value.length;
            this.inputElement.selectionEnd = this.inputElement.value.length;
            this.inputElement.focus();
        }

        private _isNeesHide:boolean = false;
        public _hide():void {
            //标记当前点击其他地方关闭
            this._isNeesHide = true;
        }

        private textValue:string = "";
        public _getText():string {
            if (!this.textValue) {
                this.textValue = "";
            }
            return this.textValue;
        }

        public _setText(value:string):void {
            this.textValue = value;

            this.resetText();
        }

        private resetText():void {
            if (this.inputElement) {
                this.inputElement.value = this.textValue;
            }
        }

        public _onInput():void {
            var self = this;
            self.textValue = self.inputElement.value;

            egret.Event.dispatchEvent(self, "updateText", false);
        }

        public _onClickHandler(e):void {
            if (this._isNeedShow) {
                e.stopImmediatePropagation();
                //e.preventDefault();
                this._isNeedShow = false;

                this.executeShow();

                this.dispatchEvent(new egret.Event("focus"));
            }
        }

        public _onDisconnect():void {
            this.inputElement = null;

            this.dispatchEvent(new egret.Event("blur"));
        }

        private _styleInfoes:Object = {};
        private setElementStyle(style:string, value:any):void {
            if (this.inputElement) {
                if (this._styleInfoes[style] != value) {
                    this.inputElement.style[style] = value;
                    //this._styleInfoes[style] = value;
                }
            }
        }

        public _removeInput():void {
            if (this.inputElement) {
                HTMLInput.getInstance().disconnectStageText(this);
            }
        }

        /**
         * 修改位置
         * @private
         */
        public _resetStageText():void {
            if (this.inputElement) {
                var textfield:egret.TextField = this._textfield;
                var propertie:egret.TextFieldProperties = textfield._properties;
                this.setElementStyle("fontFamily", propertie._fontFamily);
                this.setElementStyle("fontStyle", propertie._italic ? "italic" : "normal");
                this.setElementStyle("fontWeight", propertie._bold ? "bold" : "normal");
                this.setElementStyle("textAlign", propertie._textAlign);
                this.setElementStyle("fontSize", propertie._size + "px");
                this.setElementStyle("lineHeight", propertie._size + "px");
                this.setElementStyle("color", propertie._textColorString);
                this.setElementStyle("width", textfield._getSize(Rectangle.identity).width + "px");
                this.setElementStyle("height", textfield._getSize(Rectangle.identity).height + "px");
                this.setElementStyle("verticalAlign", propertie._verticalAlign);
            }
        }
    }

    export class HTMLInput {
        private _stageText:HTML5StageText;

        private _simpleElement:any;
        private _multiElement:any;

        private _inputElement:any;
        public _inputDIV:any;

        public isInputOn():boolean {
            return this._stageText != null;
        }

        public isCurrentStageText(stageText):boolean {
            return this._stageText == stageText;
        }

        private initValue(dom:any):void {
            dom.style.position = "absolute";
            dom.style.left = "0px";
            dom.style.top = "0px";
            dom.style.border = "none";
            dom.style.padding = "0";
        }

        public _needShow:boolean = false;

        private initStageDelegateDiv():any {
            var self = this;
            var stageDelegateDiv = egret.Browser.getInstance().$("#StageDelegateDiv");
            if (!stageDelegateDiv) {
                stageDelegateDiv = egret.Browser.getInstance().$new("div");
                stageDelegateDiv.id = "StageDelegateDiv";
                var container = document.getElementById(egret.StageDelegate.egret_root_div);
                container.appendChild(stageDelegateDiv);
                stageDelegateDiv.transforms();

                self.initValue(stageDelegateDiv);

                stageDelegateDiv.style.width = "0px";
                stageDelegateDiv.style.height = "0px";

                self._inputDIV = egret.Browser.getInstance().$new("div");
                self.initValue(self._inputDIV);
                self._inputDIV.style.width = "0px";
                self._inputDIV.style.height = "0px";

                self._inputDIV.position.x = 0;
                self._inputDIV.position.y = -100;
                self._inputDIV.scale.x = 1;
                self._inputDIV.scale.y = 1;
                self._inputDIV.transforms();
                self._inputDIV.style[Browser.getInstance().getTrans("transformOrigin")] = "0% 0% 0px";
                stageDelegateDiv.appendChild(self._inputDIV);

                var canvasDiv = document.getElementById(egret.StageDelegate.canvas_div_name);
                canvasDiv.addEventListener("click", function (e) {
                    if (self._needShow) {
                        self._needShow = false;

                        egret.MainContext.instance.stage._changeSizeDispatchFlag = false;
                        self._stageText._onClickHandler(e);

                        HTMLInput.getInstance().show();

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

        public show():void {
            var self = this;
            var inputElement = self._inputElement;
            //隐藏输入框
            egret.__callAsync(function () {
                inputElement.style.opacity = 1;
            }, self);
        }

        public disconnectStageText(stageText):void {
            if (this._stageText == stageText) {
                this.clearInputElement();

                this._inputElement.blur();
            }
        }

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

                self._inputDIV.position.x = 0;
                self._inputDIV.position.y = -100;
                self._inputDIV.transforms();
            }

            if (self._stageText) {
                self._stageText._onDisconnect();
                self._stageText = null;
            }
            egret.MainContext.instance.stage._changeSizeDispatchFlag = true;
        }

        public getInputElement(stageText):any {
            var self = this;
            self.clearInputElement();

            self._stageText = stageText;

            if (self._stageText._multiline) {
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

        private static _instance:HTMLInput;

        public static getInstance():HTMLInput {
            if (HTMLInput._instance == null) {
                HTMLInput._instance = new egret.HTMLInput();
                HTMLInput._instance.initStageDelegateDiv();
            }

            return HTMLInput._instance;
        }
    }
}

egret.StageText.create = function () {
    return new egret.HTML5StageText();
};