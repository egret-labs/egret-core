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
     * @private
     */
    export class InputController extends HashObject {
        private stageText:egret.StageText;

        private _text:TextField = null;

        private _isFocus:boolean = false;
        public constructor() {
            super();
        }

        public init(text:TextField):void {
            this._text = text;
            this.stageText = egret.StageText.create();
            this.stageText._setTextField(this._text);
        }

        public _addStageText():void {
            if (!this._text._inputEnabled) {
                this._text._DO_Props_._touchEnabled = true;
            }

            this.stageText._add();
            this.stageText._addListeners();

            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);
        }

        public _removeStageText():void {
            if (!this._text._inputEnabled) {
                this._text._DO_Props_._touchEnabled = false;
            }

            this.stageText._remove();
            this.stageText._removeListeners();
            this.stageText._removeInput();

            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);
        }

        public _getText():string {
            return this.stageText._getText();
        }

        public _setText(value:string) {
            this.stageText._setText(value);
        }

        private focusHandler(event:Event):void {
            //不再显示竖线，并且输入框显示最开始
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text._isTyping = true;
                }

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
            }
        }

        private blurHandler(event:Event):void {
            if (this._isFocus) {
                //不再显示竖线，并且输入框显示最开始
                this._isFocus = false;
                this._text._isTyping = false;

                //失去焦点后调用
                this.stageText.$onBlur();

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT, true));
            }
        }

        //点中文本
        private onMouseDownHandler(event:TouchEvent) {
            event.stopPropagation();

            var self = this;
            if (!this._text._DO_Props_._visible) {
                return;
            }

            if (this._isFocus) {
                return;
            }

            //强制更新输入框位置
            this.stageText._show(this._text._TF_Props_._multiline, this._text.size, this._text.width, this._text.height);

            var point = this._text.localToGlobal();
            this.stageText._initElement(point.x, point.y, self._text._worldTransform.a, self._text._worldTransform.d);
        }

        //未点中文本
        private onStageDownHandler(event:TouchEvent) {
            this.stageText._hide();
        }

        private updateTextHandler(event:Event):void {
            var values = this._text._TF_Props_;
            var textValue = this.stageText._getText();
            var isChanged:boolean = false;
            if (values._restrictAnd != null) {//内匹配
                var reg = new RegExp("[" + values._restrictAnd + "]", "g");
                var result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values._restrictNot != null) {//外匹配
                reg = new RegExp("[^" + values._restrictNot + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }

            if (isChanged) {
                this.stageText._setText(textValue);
            }
            this.resetText();

            //抛出change事件
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE, true));
        }

        private resetText():void {
            this._text._setBaseText(this.stageText._getText());
        }

        public _hideInput():void {
            this.stageText._removeInput();
        }

        public _updateTransform():void {//
            this._text._updateBaseTransform();

            if (!this._text._DO_Props_._visible && this.stageText) {
                this._hideInput();
            }
        }

        public _updateProperties():void {
            if (this._isFocus) {
                this._updateTransform();
                return;
            }

            var stage:egret.Stage = this._text._DO_Props_._stage;
            if (stage == null) {
                this.stageText._setVisible(false);
            }
            else {
                var item:DisplayObject = this._text;
                var visible:boolean = item._DO_Props_._visible;
                while (true) {
                    if (!visible) {
                        break;
                    }
                    item = item.parent;
                    if (item == stage) {
                        break;
                    }
                    visible = item._DO_Props_._visible;
                }
                this.stageText._setVisible(visible);
            }

            this.stageText._setMultiline(this._text._TF_Props_._multiline);

            this.stageText._setTextType(this._text._TF_Props_._displayAsPassword ? "password" :  "text");
            this.stageText._setText(this._text._TF_Props_._text);

            //整体修改
            this.stageText._resetStageText();

            this._updateTransform();
        }
    }
}