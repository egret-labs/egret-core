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
namespace egret {
    /**
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class InputController extends HashObject {
        /**
         * @private
         */
        private stageText: egret.StageText;

        /**
         * @private
         */
        private stageTextAdded: boolean = false;

        /**
         * @private
         */
        private _text: TextField = null;

        /**
         * @private
         */
        private _isFocus: boolean = false;
        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
        }

        /**
         * 
         * @param text 
         * @version Egret 2.4
         * @platform Web,Native
         */
        public init(text: TextField): void {
            this._text = text;
            this.stageText = new egret.StageText();
            this.stageText.$setTextField(this._text);
        }

        /**
         * @private
         * 
         */
        public _addStageText(): void {
            if (this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = true;
            }

            this.tempStage = this._text.stage;

            this.stageText.$addToStage();

            this.stageText.addEventListener("updateText", this.updateTextHandler, this);
            this._text.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);

            this.stageText.addEventListener("blur", this.blurHandler, this);
            this.stageText.addEventListener("focus", this.focusHandler, this);

            this.stageTextAdded = true;
        }

        /**
         * @private
         * 
         */
        public _removeStageText(): void {
            if (!this.stageTextAdded) {
                return;
            }
            if (!this._text.$inputEnabled) {
                this._text.$touchEnabled = false;
            }

            this.stageText.$removeFromStage();

            this.stageText.removeEventListener("updateText", this.updateTextHandler, this);
            this._text.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

            this.stageText.removeEventListener("blur", this.blurHandler, this);
            this.stageText.removeEventListener("focus", this.focusHandler, this);

            this.stageTextAdded = false;
        }

        /**
         * @private
         * 
         * @returns 
         */
        public _getText(): string {
            return this.stageText.$getText();
        }

        /**
         * @private
         * 
         * @param value 
         */
        public _setText(value: string) {
            this.stageText.$setText(value);
        }
        /**
         * @private
         */
        public _setColor(value: number) {
            this.stageText.$setColor(value);
        }

        /**
         * @private
         * 
         * @param event 
         */
        private focusHandler(event: Event): void {
            //不再显示竖线，并且输入框显示最开始
            if (!this._isFocus) {
                this._isFocus = true;
                if (!event["showing"]) {
                    this._text.$isTyping = true;
                    this._text.$invalidateTextField();
                }

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_IN, true));
            }
        }

        /**
         * @private
         * 
         * @param event 
         */
        private blurHandler(event: Event): void {
            if (this._isFocus) {
                //不再显示竖线，并且输入框显示最开始
                this._isFocus = false;
                this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);

                this._text.$isTyping = false;
                this._text.$invalidateTextField();
                //失去焦点后调用
                this.stageText.$onBlur();

                this._text.dispatchEvent(new egret.FocusEvent(egret.FocusEvent.FOCUS_OUT, true));
            }
        }

        private tempStage: egret.Stage;
        //点中文本
        private onMouseDownHandler(event: TouchEvent) {
            this.$onFocus();
        }

        $onFocus(): void {
            let self = this;
            if (!this._text.visible) {
                return;
            }

            if (this._isFocus) {
                return;
            }

            this.tempStage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            egret.callLater(() => {
                this.tempStage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onStageDownHandler, this);
            }, this);


            //强制更新输入框位置
            this.stageText.$show();
        }

        //未点中文本
        private onStageDownHandler(event: TouchEvent) {
            if (event.$target != this._text) {
                this.stageText.$hide();
            }
        }

        /**
         * @private
         * 
         * @param event 
         */
        private updateTextHandler(event: Event): void {
            let values = this._text.$TextField;
            let textValue = this.stageText.$getText();
            let isChanged: boolean = false;
            let reg: RegExp;
            let result: string[];
            if (values[sys.TextKeys.restrictAnd] != null) {//内匹配
                reg = new RegExp("[" + values[sys.TextKeys.restrictAnd] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }
            if (values[sys.TextKeys.restrictNot] != null) {//外匹配
                reg = new RegExp("[^" + values[sys.TextKeys.restrictNot] + "]", "g");
                result = textValue.match(reg);
                if (result) {
                    textValue = result.join("");
                }
                else {
                    textValue = "";
                }
                isChanged = true;
            }

            if (isChanged && this.stageText.$getText() != textValue) {
                this.stageText.$setText(textValue);
            }
            this.resetText();

            //抛出change事件
            this._text.dispatchEvent(new egret.Event(egret.Event.CHANGE, true));
        }

        /**
         * @private
         * 
         */
        private resetText(): void {
            this._text.$setBaseText(this.stageText.$getText());
        }

        /**
         * @private
         * 
         */
        public _hideInput(): void {
            this.stageText.$removeFromStage();
        }

        /**
         * @private
         * 
         */
        private updateInput(): void {//
            if (!this._text.$visible && this.stageText) {
                this._hideInput();
            }
        }

        /**
         * @private
         * 
         */
        public _updateProperties(): void {
            if (this._isFocus) {
                //整体修改
                this.stageText.$resetStageText();
                this.updateInput();
                return;
            }

            this.stageText.$setText(this._text.$TextField[egret.sys.TextKeys.text]);

            //整体修改
            this.stageText.$resetStageText();

            this.updateInput();
        }
    }
}