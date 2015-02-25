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

        private div:any = null;
        private inputElement:any = null;

        private _shape:egret.Shape;

        constructor() {
            super();

            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();

            var div = egret.Browser.getInstance().$new("div");
            div.position.x = 0;
            div.position.y = 0;
            div.scale.x = scaleX;
            div.scale.y = scaleY;
            div.transforms();
            div.style[HTML5StageText.getTrans("transformOrigin")] = "0% 0% 0px";
            this.div = div;

            var stage:egret.Stage = egret.MainContext.instance.stage;
            var stageWidth:number = stage.stageWidth;
            var stageHeight:number = stage.stageHeight;
            var shape:egret.Shape = new egret.Shape();
//            shape.graphics.beginFill(0x000000, .3);
//            shape.graphics.drawRect(0, 0, stageWidth, stageHeight);
//            shape.graphics.endFill();
            shape.width = stageWidth;
            shape.height = stageHeight;
            shape.touchEnabled = true;

            this._shape = shape;

            this.getStageDelegateDiv().appendChild(this.div);
        }

        private static header:string = "";

        /**
         * 获取当前浏览器类型
         * @type {string}
         */
        private static getTrans(type:string):string {
        if (HTML5StageText.header == "") {
            HTML5StageText.header = HTML5StageText.getHeader();
        }

        return HTML5StageText.header + type.substring(1, type.length);
    }

        /**
         * 获取当前浏览器的类型
         * @returns {string}
         */
        private static getHeader():string {
            var tempStyle = document.createElement('div').style;
            var transArr:Array<string> = ["t", "webkitT", "msT", "MozT", "OT"];
            for (var i:number = 0; i < transArr.length; i++) {
                var transform:string = transArr[i] + 'ransform';

                if (transform in tempStyle)
                    return transArr[i];
            }

            return transArr[0];
        }

        private getStageDelegateDiv():any {
            var stageDelegateDiv = egret.Browser.getInstance().$("#StageDelegateDiv");
            if (!stageDelegateDiv) {
                stageDelegateDiv = egret.Browser.getInstance().$new("div");
                stageDelegateDiv.id = "StageDelegateDiv";
//                stageDelegateDiv.style.position = "absolute";
                var container = document.getElementById(egret.StageDelegate.canvas_div_name);
                container.appendChild(stageDelegateDiv);
                stageDelegateDiv.transforms();
            }
            return stageDelegateDiv;
        }

        public _setMultiline(value:boolean):void {
            super._setMultiline(value);

            this.createInput();
        }

        private callHandler(e):void {
            e.stopPropagation();
        }

        public _add():void {
            if (this.div && this.div.parentNode == null) {
                this.getStageDelegateDiv().appendChild(this.div);
            }
        }

        public _remove():void {
            if (this._shape && this._shape.parent) {
                this._shape.parent.removeChild(this._shape);
            }
            if (this.div && this.div.parentNode) {
                this.div.parentNode.removeChild(this.div);
            }
        }

        private _hasListeners:boolean = false;
        public _addListeners():void {
            if (this.inputElement && !this._hasListeners) {
                this._hasListeners = true;
                this.inputElement.addEventListener("mousedown", this.callHandler);
                this.inputElement.addEventListener("touchstart", this.callHandler);
                this.inputElement.addEventListener("MSPointerDown", this.callHandler);
            }
        }

        public _removeListeners():void {
            if (this.inputElement && this._hasListeners) {
                this._hasListeners = false;
                this.inputElement.removeEventListener("mousedown", this.callHandler);
                this.inputElement.removeEventListener("touchstart", this.callHandler);
                this.inputElement.removeEventListener("MSPointerDown", this.callHandler);
            }
        }

        private _inputType:string = "";
        private createInput():void {
            var type:string = this._multiline ? "textarea" : "input";
            if (this._inputType == type) {
                return;
            }

            this._inputType = type;
            if (this.inputElement != null) {
                this._removeListeners();
                this.div.removeChild(this.inputElement);
            }

            if (this._multiline) {
                var inputElement:any = document.createElement("textarea");
                inputElement.style["resize"] = "none";
            }
            else {
                inputElement = document.createElement("input");
            }
            this._styleInfoes = {};
            inputElement.type = "text";
            this.inputElement = inputElement;
            this.inputElement.value = "";

            this.div.appendChild(inputElement);

            this._addListeners();

            this.setElementStyle("width", 0 + "px");

            //默认值
            this.setElementStyle("border", "none");
            this.setElementStyle("margin", "0");
            this.setElementStyle("padding", "0");
            this.setElementStyle("outline", "medium");
            this.setElementStyle("verticalAlign", "top");
            this.setElementStyle("wordBreak", "break-all");
            this.setElementStyle("overflow", "hidden");
        }

        public _open(x:number, y:number, width:number = 160, height:number = 21):void {

        }

        public _setScale(x:number, y:number):void {
            super._setScale(x, y);

            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();
            this.div.scale.x = scaleX * x;
            this.div.scale.y = scaleY * y;
            this.div.transforms();
        }

        public changePosition(x:number, y:number):void {
//            if (this._isShow) {
            var scaleX = egret.StageDelegate.getInstance().getScaleX();
            var scaleY = egret.StageDelegate.getInstance().getScaleY();

            this.div.position.x = x * scaleX;
            this.div.position.y = y * scaleY;
            this.div.transforms();
//            }
        }

        private setStyles():void {

            //修改属性
            this.setElementStyle("fontStyle", this._italic ? "italic" : "normal");
            this.setElementStyle("fontWeight", this._bold ? "bold" : "normal");
            this.setElementStyle("textAlign", this._textAlign);
            this.setElementStyle("fontSize", this._size + "px");

            this.setElementStyle("color", "#000000");
            this.setElementStyle("width", this._width + "px");
//            if (this._multiline) {
                this.setElementStyle("height", this._height + "px");
//            }
//            this.setElementStyle("border", "1px solid red");
            this.setElementStyle("display", "block");
        }

        private _isShow:boolean = false;


        public _show():void {
            egret.MainContext.instance.stage._changeSizeDispatchFlag = false;
            if (this._maxChars > 0) {
                this.inputElement.setAttribute("maxlength", this._maxChars);
            }
            else {
                this.inputElement.removeAttribute("maxlength");
            }


            this._isShow = true;
            //打开
            var txt = this._getText();
            this.inputElement.value = txt;
            var self = this;
            this.inputElement.oninput = function () {
                self.textValue = self.inputElement.value;
                self.dispatchEvent(new egret.Event("updateText"));
            };
            this.setStyles();
            this.inputElement.focus();
//            if (this._multiline) {
            this.inputElement.selectionStart = txt.length;
            this.inputElement.selectionEnd = txt.length;
//            }

            if (this._shape && this._shape.parent == null) {
                egret.MainContext.instance.stage.addChild(this._shape);
            }
        }

        public _hide():void {
            egret.MainContext.instance.stage._changeSizeDispatchFlag = true;

            if (this.inputElement == null) {
                return;
            }
            this._isShow = false;
            this.inputElement.oninput = function () {
            };
            this.setElementStyle("border", "none");
            this.setElementStyle("display", "none");
            //关闭
            this.inputElement.value = "";
            this.setElementStyle("width", 0 + "px");

            window.scrollTo(0, 0);

            var self = this;
            egret.setTimeout(function () {
                self.inputElement.blur();
                window.scrollTo(0, 0);
            }, this, 50);

            if (this._shape && this._shape.parent) {
                this._shape.parent.removeChild(this._shape);
            }
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