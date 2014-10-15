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
     * @class egret.StageText
     * @classdesc
     * @extends egret.HashObject
     */
    export class HTML5StageText extends StageText {

        private div:any;
        private inputElement:any;

        private _call;
        constructor() {
            super();
        }

        private _isShow:boolean = true;
        /**
         * @method egret.StageText#open
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         */
        public _open(x:number, y:number, width:number = 160, height:number = 21):void {
            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();

            var div = egret.Browser.getInstance().$new("div");
            div.position.x = x * scaleX;
            div.position.y = y * scaleY;
            div.scale.x = scaleX;
            div.scale.y = scaleY;
            div.transforms();
            div.style[egret_dom.getTrans("transformOrigin")] = "0% 0% 0px";

            this.div = div;

            this._createInput();

            div.style.display = "block";
            div.style.background = "none";
            div.style.pointerEvents = "none";

            this._call = this.onHandler.bind(this);
        }

        public _addListeners():void {
            if (window.navigator.msPointerEnabled) {
                this.addListener("MSPointerDown");
                this.addListener("MSPointerUp");
            }
            else if(MainContext.deviceType == MainContext.DEVICE_MOBILE){
                this.addListener("touchstart");
                this.addListener("touchend");
                this.addListener("touchcancel");
            }
            else if(MainContext.deviceType == MainContext.DEVICE_PC){
                this.addListener("mousedown");
                this.addListener("mouseup");
            }

            this.addListener("focus");
            this.addListener("blur");

            this._isShow = true;
            this._closeInput();
            this.closeKeyboard();
        }

        public _removeListeners():void {
            if (window.navigator.msPointerEnabled) {
                this.removeListener("MSPointerDown");
                this.removeListener("MSPointerUp");
            }
            else if(MainContext.deviceType == MainContext.DEVICE_MOBILE){
                this.removeListener("touchstart");
                this.removeListener("touchend");
                this.removeListener("touchcancel");

            }
            else if(MainContext.deviceType == MainContext.DEVICE_PC){
                this.removeListener("mousedown");
                this.removeListener("mouseup");
            }
            this.removeListener("blur");
            this.removeListener("focus");
        }

        private addListener(type:string):void {
            this.inputElement.addEventListener(type, this._call);
        }

        private removeListener(type:string):void {
            this.inputElement.removeEventListener(type, this._call);
        }

        private onHandler(e):void {
            e["isScroll"] = true;
            if (e.type == "blur") {//失去焦点
                this.dispatchEvent(new egret.Event("blur"));

                this._closeInput();
            } else if (e.type == "focus") {
                if (this._canUse) {//可以点击
                    this._canUse = false;
                    this._openInput();

                    this.dispatchEvent(new egret.Event("focus"));
                }
                else {//不可以点击
                    e["isScroll"] = false;

                    this.inputElement.blur();
                }
            }
            else if (e.type == "touchstart" || e.type == "mousedown" || e.type == "MSPointerDown") {
                if (this._isShow) {//已经打开中 强制
                    e.stopPropagation();
                }
            }
        }

        private _canUse:boolean = false;
        /**
         * @method egret.StageText#add
         */
        public _show():void {
            this._canUse = true;
        }

        public _hide():void {
            this._canUse = false;

            this._closeInput();
            this.closeKeyboard();
        }

        private _openInput():void {
            if (!this._isShow) {
                this._isShow = true;
                if (this._isFirstClick) {
                    this._isFirstClick = false;
                    this._text = this._defaultText;
                    this.setElementValue(this._defaultText);
                }
                else {
                    this.setElementValue(this._text);
                }
            }
        }

        private _closeInput():void {
            if (this._isShow) {
                this._text = this.inputElement.value;
                this._isShow = false;
                this.setElementValue("");
            }
        }

        private closeKeyboard():void {
            this.inputElement.focus();
            this.inputElement.blur();
        }

        private getStageDelegateDiv():any {
            var stageDelegateDiv = egret.Browser.getInstance().$("#StageDelegateDiv");
            if (!stageDelegateDiv) {
                stageDelegateDiv = egret.Browser.getInstance().$new("div");
                stageDelegateDiv.id = "StageDelegateDiv";
                stageDelegateDiv.style.position = "absolute";
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                container.appendChild(stageDelegateDiv);
                stageDelegateDiv.transforms();
            }
            return stageDelegateDiv;
        }

        public _add():void {
            var div = this.div;
            if (div && !div.parentNode) {
                var stageDelegateDiv = this.getStageDelegateDiv();
                stageDelegateDiv.appendChild(div);
            }
        }

        /**
         * @method egret.StageText#remove
         */
        public _remove():void {
            var div = this.div;
            if (div && div.parentNode) {
                div.parentNode.removeChild(div);
            }
        }

        public changePosition(x:number, y:number):void {
            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();

            this.div.position.x = x * scaleX;
            this.div.position.y = y * scaleY;
            this.div.transforms();
        }

        private _inputType:string = "";
        private _isFirstClick:boolean = true;
        private _createInput():void {

            var self = this;
            var isChanged:boolean = false;

            var inputElement:any;
            if (this._multiline && self._inputType != "textarea") {
                isChanged = true;
                this._inputType = "textarea";
                inputElement = document.createElement("textarea");
                inputElement.type = "text";
                inputElement.style.resize = "none";
            }
            else if (!this._multiline && self._inputType != "input") {
                isChanged = true;
                this._inputType = "input";
                inputElement = document.createElement("input");
                inputElement.type = "text";
            }

            if (isChanged) {//单、多行切换
                this._styleInfoes = {};
                this._isFirstClick = true;

                if (self.inputElement && self.inputElement.parentNode) {
                    var parentNode = self.inputElement.parentNode;
                    parentNode.removeChild(self.inputElement);
                    this._removeListeners();

                    this.inputElement = inputElement;
                    parentNode.appendChild(self.inputElement);
                    this._addListeners();
                }
                else {
                    this.inputElement = inputElement;
                }
                this.setElementValue(self._defaultText);
                self.div.appendChild(inputElement);
            }

            //修改属性
            self.setElementStyle("fontStyle", this._italic ? "italic" : "normal");
            self.setElementStyle("fontWeight", this._bold ? "bold" : "normal");
            self.setElementStyle("textAlign", this._textAlign);
            self.setElementStyle("fontSize", self._size + "px");
            self.setElementStyle("lineHeight", self._size + "px");
            self.setElementStyle("fontFamily", self._fontFamily);
            self.setElementStyle("color", self._color);
            self.setElementStyle("width", self._width + "px");
            self.setElementStyle("height", self._height + "px");
            //默认值
            self.setElementStyle("border", "none");
            self.setElementStyle("background", "none");
            self.setElementStyle("margin", "0");
            self.setElementStyle("padding", "0");
            self.setElementStyle("outline", "medium");
            self.setElementStyle("verticalAlign", "top");

            self.div.style.pointerEvents = self._visible ? "auto" : "none";
        }

        public _resetStageText():void {
            this._createInput();
        }

        private setElementValue(value:string):void {
            if (!this._isFirstClick) {
                this.inputElement.value = value;
            }
        }

        private _text:string = "";

        //默认文本内容，只有在创建输入文本的时候才可以使用
        private _defaultText:string = "";
        /**
         * @method egret.StageText#getText
         * @returns {string}
         */
        public _getText():string {
            if (this._isShow) {
                if (this._isFirstClick) {
                    return this._defaultText;
                }
                return this.inputElement.value;
            }
            return this._text;
        }

        /**
         * @method egret.StageText#setText
         * @param value {string}
         */
        public _setText(value:string):void {
//            this._text = value;
            this._defaultText = value;
//            if (this._isShow) {
//                this.setElementValue(value);
//            }
        }

        /**
         * @method egret.StageText#setTextType
         * @param type {string}
         */
        public _setTextType(type:string):void {
            this.inputElement.type = type;
        }

        /**
         * @method egret.StageText#getTextType
         * @returns {string}
         */
        public _getTextType():string {
            return this.inputElement.type;
        }

        private _width:number = 0;
        public _setWidth(value:number):void{
            this._width = value;
        }

        private _height:number = 0;
        public _setHeight(value:number):void{
            this._height = value;
        }

        private _styleInfoes:Object = {};
        private setElementStyle(style:string, value:any):void {
            if (this.inputElement) {
                if (this._styleInfoes[style] != value) {
                    this.inputElement.style[style] = value;
                    this._styleInfoes[style] = value;
                }
            }
        }
    }
}


egret.StageText.create = function(){
    return new egret.HTML5StageText();
}