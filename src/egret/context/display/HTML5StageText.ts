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
        private _size:number = 30;

        private _call;
        constructor() {
            super();
        }

        private _isShow:boolean = true;
        private _text:string = "";
        /**
         * @method egret.StageText#getText
         * @returns {string}
         */
        public _getText():string {
            return this._isShow ? this.inputElement.value : this._text;
        }

        /**
         * @method egret.StageText#setText
         * @param value {string}
         */
        public _setText(value:string):void {
            this._isShow ? this.inputElement.value = value : this._text = value
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

        public _setMultiline(value:boolean):void {
            super._setMultiline(value);

            this._createInput();
        }

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
            div.style.width = width + "px";
            div.scale.x = scaleX;
            div.scale.y = scaleY;
            div.transforms();
            div.style[egret_dom.getTrans("transformOrigin")] = "0% 0% 0px";

            var stageDelegateDiv = this.getStageDelegateDiv();
            stageDelegateDiv.appendChild(div);

            this.div = div;

            this._createInput();

            if (div && !div.parentNode) {
                var stageDelegateDiv = this.getStageDelegateDiv();
                stageDelegateDiv.appendChild(div);
            }
            div.style.display = "block";

            this._call = this.onHandler.bind(this);
        }

        private _inputType:string = "";
        private _createInput():void {
            var isChanged:boolean = false;

            var inputElement:any;
            if (this._multiline && this._inputType != "textarea") {
                isChanged = true;
                this._inputType = "textarea";
                inputElement = document.createElement("textarea");
            }
            else if (!this._multiline && this._inputType != "input") {
                isChanged = true;
                this._inputType = "input";
                inputElement = document.createElement("input");
            }

            if (isChanged) {
                inputElement.type = "text";
                inputElement.style.fontSize = this._size + "px";
                inputElement.style.lineHeight = this._size + "px";
                inputElement.style.textAlign = "left";
                inputElement.style.fontFamily = "Arial";
                inputElement.style.fontStyle = "normal";
                inputElement.style.fontWeight = "normal";

                inputElement.style.color = "#FFFFFF";
                inputElement.style.border = "none";
                inputElement.style.background = "none";
                inputElement.style.width = this.div.style.width;
                inputElement.style.padding = "0";
                inputElement.style.outline = "medium";

                if (this.inputElement && this.inputElement.parentNode) {
                    this.inputElement.parentNode.removeChild(this.inputElement);
                    this._removeListeners();
                    this.inputElement = inputElement;
                    this._addListeners();
                }
                else {
                    this.inputElement = inputElement;
                }
                this.div.appendChild(inputElement);
            }
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
                this.inputElement.value = this._text;
            }
        }

        private _closeInput():void {
            if (this._isShow) {
                this._isShow = false;
                this._text = this.inputElement.value;
                this.inputElement.value = "";

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
//                stageDelegateDiv.style["top"] = egret.StageDelegate.getInstance().getOffSetY() + "px";
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                container.appendChild(stageDelegateDiv);
                stageDelegateDiv.transforms();
            }
            return stageDelegateDiv;
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

        public changeSize(width:number, height:number):void {
            this.inputElement.style.width = width + "px";

            this.div.style.width = width + "px";
            this.div.transforms();
        }

        public setSize(value:number):void {
            this._size = value;
            this.inputElement.style.fontSize = this._size + "px";
        }

        public setTextColor(value:string):void {
            this.inputElement.style.color = value;
        }

        public setTextFontFamily(value:string):void {
            this.inputElement.style.fontFamily = value;
        }

        public setWidth(value:number):void{
            this.inputElement.style.width = value + "px";
        }

        public setHeight(value:number):void{
            this.inputElement.style.height = value + "px";
        }
    }
}


egret.StageText.create = function(){
    return new egret.HTML5StageText();
}