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
namespace egret.web {

    /**
     * @classdesc
     * @extends egret.StageText
     * @private
     */
    export class HTML5StageText extends EventDispatcher implements StageText {

        /**
         * @private
         */
        private htmlInput: egret.web.HTMLInput;
        /**
         * @private
         */
        constructor() {
            super();

        }

        /**
         * @private
         */
        $textfield: egret.TextField;
        /**
         * @private
         * 
         * @param textfield 
         */
        $setTextField(textfield: egret.TextField): boolean {
            this.$textfield = textfield;

            return true;
        }

        /**
         * @private
         */
        private _isNeedShow: boolean = false;
        /**
         * @private
         */
        private inputElement: any = null;
        /**
         * @private
         */
        private inputDiv: any = null;

        /**
         * @private
         */
        private _gscaleX: number = 0;
        /**
         * @private
         */
        private _gscaleY: number = 0;

        /**
         * @private
         * 
         */
        $addToStage(): void {
            this.htmlInput = egret.web.$getTextAdapter(this.$textfield);
        }

        /**
         * @private
         * 
         */
        private _initElement(): void {
            let point = this.$textfield.localToGlobal(0, 0);
            let x = point.x;
            let y = point.y;
            // let m = this.$textfield.$renderNode.renderMatrix;
            // let cX = m.a;
            // let cY = m.d;

            let scaleX = this.htmlInput.$scaleX;
            let scaleY = this.htmlInput.$scaleY;

            this.inputDiv.style.left = x * scaleX + "px";
            this.inputDiv.style.top = y * scaleY + "px";

            if (this.$textfield.multiline && this.$textfield.height > this.$textfield.size) {
                this.inputDiv.style.top = (y) * scaleY + "px";

                this.inputElement.style.top = (-this.$textfield.lineSpacing / 2) * scaleY + "px";
            }
            else {
                this.inputDiv.style.top = y * scaleY + "px";

                this.inputElement.style.top = 0 + "px";
            }

            let node: any = this.$textfield;
            let cX = 1;
            let cY = 1;
            let rotation = 0;
            while (node.parent) {
                cX *= node.scaleX;
                cY *= node.scaleY;
                rotation += node.rotation;

                node = node.parent;
            }

            let transformKey = egret.web.getPrefixStyleName("transform");
            this.inputDiv.style[transformKey] = "rotate(" + rotation + "deg)";

            this._gscaleX = scaleX * cX;
            this._gscaleY = scaleY * cY;
        }

        /**
         * @private
         * 
         */
        $show(): void {
            if (!this.htmlInput.isCurrentStageText(this)) {
                this.inputElement = this.htmlInput.getInputElement(this);
                if (!this.$textfield.multiline) {
                    this.inputElement.type = this.$textfield.inputType;
                }
                else {
                    this.inputElement.type = "text";
                }
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
        private onBlurHandler(): void {
            this.htmlInput.clearInputElement();
            window.scrollTo(0, 0);
        }

        /**
         * @private
         * 
         */
        private executeShow(): void {
            let self = this;
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
        $hide(): void {
            if (this.htmlInput) {
                this.htmlInput.disconnectStageText(this);
            }
        }

        /**
         * @private
         */
        private textValue: string = "";

        /**
         * @private
         * 
         * @returns 
         */
        $getText(): string {
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
        $setText(value: string): boolean {
            this.textValue = value;

            this.resetText();

            return true;
        }
        /**
         * @private
         * 
         */
        private resetText(): void {
            if (this.inputElement) {
                this.inputElement.value = this.textValue;
            }
        }
        /**
         * @private
         */
        private colorValue: number = 0xffffff;
        $setColor(value: number): boolean {
            this.colorValue = value;
            this.resetColor();
            return true;
        }
        /**
         * @private
         *
         */
        private resetColor(): void {
            if (this.inputElement) {
                this.setElementStyle("color", toColorString(this.colorValue));
            }
        }


        $onBlur(): void {
            if (Html5Capatibility._System_OS == SystemOSType.WPHONE) {
                egret.Event.dispatchEvent(this, "updateText", false);
            }
        }

        /**
         * @private
         * 
         */
        public _onInput(): void {
            let self = this;

            if (Html5Capatibility._System_OS == SystemOSType.WPHONE) {
                let values = this.$textfield.$TextField;
                if (values[sys.TextKeys.restrictAnd] == null && values[sys.TextKeys.restrictNot] == null) {
                    self.textValue = self.inputElement.value;

                    egret.Event.dispatchEvent(self, "updateText", false);
                }
                else {
                    window.setTimeout(function () {
                        if (self.inputElement && self.inputElement.selectionStart && self.inputElement.selectionEnd) {
                            if (self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                                self.textValue = self.inputElement.value;

                                egret.Event.dispatchEvent(self, "updateText", false);
                            }
                        }
                    }, 0);
                }
            }
            else {
                window.setTimeout(function () {
                    if (self.inputElement && self.inputElement.selectionStart == self.inputElement.selectionEnd) {
                        self.textValue = self.inputElement.value;

                        egret.Event.dispatchEvent(self, "updateText", false);
                    }
                }, 0);
            }
        }

        private setAreaHeight() {
            let textfield: egret.TextField = this.$textfield;
            if (textfield.multiline) {
                let textheight = TextFieldUtils.$getTextHeight(textfield);
                if (textfield.height <= textfield.size) {
                    this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");

                    this.setElementStyle("padding", "0px");
                    this.setElementStyle("lineHeight", (textfield.size) * this._gscaleY + "px");
                }
                else if (textfield.height < textheight) {
                    this.setElementStyle("height", (textfield.height) * this._gscaleY + "px");

                    this.setElementStyle("padding", "0px");
                    this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                }
                else {
                    this.setElementStyle("height", (textheight + textfield.lineSpacing) * this._gscaleY + "px");

                    let rap = (textfield.height - textheight) * this._gscaleY;
                    let valign: number = TextFieldUtils.$getValign(textfield);
                    let top = rap * valign;
                    let bottom = rap - top;
                    this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                    this.setElementStyle("lineHeight", (textfield.size + textfield.lineSpacing) * this._gscaleY + "px");
                }

            }
        }

        /**
         * @private
         * 
         * @param e 
         */
        public _onClickHandler(e): void {
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
        public _onDisconnect(): void {
            this.inputElement = null;

            this.dispatchEvent(new egret.Event("blur"));
        }

        /**
         * @private
         */
        private _styleInfoes: Object = {};

        /**
         * @private
         * 
         * @param style 
         * @param value 
         */
        private setElementStyle(style: string, value: any): void {
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
        $removeFromStage(): void {
            if (this.inputElement) {
                this.htmlInput.disconnectStageText(this);
            }
        }

        /**
         * 修改位置
         * @private
         */
        $resetStageText(): void {
            if (this.inputElement) {
                let textfield: egret.TextField = this.$textfield;
                this.setElementStyle("fontFamily", textfield.fontFamily);
                this.setElementStyle("fontStyle", textfield.italic ? "italic" : "normal");
                this.setElementStyle("fontWeight", textfield.bold ? "bold" : "normal");
                this.setElementStyle("textAlign", textfield.textAlign);
                this.setElementStyle("fontSize", textfield.size * this._gscaleY + "px");
                this.setElementStyle("color", toColorString(textfield.textColor));

                let tw: number;
                if (textfield.stage) {
                    tw = textfield.localToGlobal(0, 0).x;
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
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");

                        let bottom = (textfield.size / 2) * this._gscaleY;
                        this.setElementStyle("padding", "0px 0px " + bottom + "px 0px");
                    }
                    else {
                        this.setElementStyle("height", (textfield.size) * this._gscaleY + "px");
                        let rap = (textfield.height - textfield.size) * this._gscaleY;
                        let valign = egret.TextFieldUtils.$getValign(textfield);
                        let top = rap * valign;
                        let bottom = rap - top;
                        if (bottom < textfield.size / 2 * this._gscaleY) {
                            bottom = textfield.size / 2 * this._gscaleY;
                        }
                        this.setElementStyle("padding", top + "px 0px " + bottom + "px 0px");
                    }
                }

                this.inputDiv.style.clip = "rect(0px " + (textfield.width * this._gscaleX) + "px " + (textfield.height * this._gscaleY) + "px 0px)";
                this.inputDiv.style.height = textfield.height * this._gscaleY + "px";
                this.inputDiv.style.width = tw * this._gscaleX + "px";
            }
        }
    }

    StageText = HTML5StageText;
}

namespace egret.web {
    /**
     * @private
     */
    export class HTMLInput {
        /**
         * @private
         */
        private _stageText: HTML5StageText;

        /**
         * @private
         */
        private _simpleElement: any;
        /**
         * @private
         */
        private _multiElement: any;

        /**
         * @private
         */
        private _inputElement: any;
        /**
         * @private
         */
        public _inputDIV: any;

        /**
         * @private
         * 
         * @returns 
         */
        public isInputOn(): boolean {
            return this._stageText != null;
        }

        /**
         * @private
         * 
         * @param stageText 
         * @returns 
         */
        public isCurrentStageText(stageText): boolean {
            return this._stageText == stageText;
        }

        /**
         * @private
         * 
         * @param dom 
         */
        private initValue(dom: any): void {
            dom.style.position = "absolute";
            dom.style.left = "0px";
            dom.style.top = "0px";
            dom.style.border = "none";
            dom.style.padding = "0";
        }

        /**
         * @private
         */
        public _needShow: boolean = false;

        /**
         * @private
         */
        $scaleX: number = 1;
        /**
         * @private
         */
        $scaleY: number = 1;

        /**
         * @private
         * 
         */
        $updateSize(): void {
            if (!this.canvas) {
                return;
            }

            this.$scaleX = egret.sys.DisplayList.$canvasScaleX;
            this.$scaleY = egret.sys.DisplayList.$canvasScaleY;

            this.StageDelegateDiv.style.left = this.canvas.style.left;
            this.StageDelegateDiv.style.top = this.canvas.style.top;

            let transformKey = egret.web.getPrefixStyleName("transform");
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
        public _initStageDelegateDiv(container, canvas): any {
            this.canvas = canvas;
            let self = this;
            let stageDelegateDiv;
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
        private initInputElement(multiline: boolean): void {
            let self = this;

            //增加1个空的textarea
            let inputElement: any;
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
        public show(): void {
            let self = this;
            let inputElement = self._inputElement;
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
        public disconnectStageText(stageText): void {
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
        public clearInputElement(): void {
            let self = this;
            if (self._inputElement) {
                self._inputElement.value = "";

                self._inputElement.onblur = null;

                self._inputElement.style.width = "1px";
                self._inputElement.style.height = "12px";
                self._inputElement.style.left = "0px";
                self._inputElement.style.top = "0px";
                self._inputElement.style.opacity = 0;

                let otherElement;
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
        public getInputElement(stageText): any {
            let self = this;
            self.clearInputElement();

            self._stageText = stageText;

            this.canvas['userTyping'] = true;

            if (self._stageText.$textfield.multiline) {
                self._inputElement = self._multiElement;
            }
            else {
                self._inputElement = self._simpleElement;
            }

            let otherElement;
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

namespace egret.web {

    let stageToTextLayerMap: any = {};
    let stageToCanvasMap: any = {};
    let stageToContainerMap: any = {};

    /**
     * @private
     * 获取
     */
    export function $getTextAdapter(textfield: TextField): HTMLInput {
        let stageHash = textfield.stage ? textfield.stage.$hashCode : 0;
        let adapter = stageToTextLayerMap[stageHash];
        let canvas = stageToCanvasMap[stageHash];
        let container = stageToContainerMap[stageHash];
        if (canvas && container) {
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
    export function $cacheTextAdapter(adapter: HTMLInput, stage, container: HTMLDivElement, canvas) {
        adapter._initStageDelegateDiv(container, canvas);
        stageToTextLayerMap[stage.$hashCode] = adapter;
        stageToCanvasMap[stage.$hashCode] = canvas;
        stageToContainerMap[stage.$hashCode] = container;
    }
}
