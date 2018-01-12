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
namespace egret.wxapp {

    /**
     * @classdesc
     * @extends egret.StageText
     * @private
     */
    export class HTML5StageText extends EventDispatcher implements StageText {

        /**
         * @private
         */
        constructor() {
            super();
            this.onKeyboardComplete = this.onKeyboardComplete.bind(this);
            this.onKeyboardInput = this.onKeyboardInput.bind(this);
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
         * 
         */
        $addToStage(): void {
        }

        /**
         * @private
         * 
         */
        $show(): void {
            let info: any = {
                defaultValue: this.$textfield.text,
                multiple: this.$textfield.multiline,
                confirmHold: true,
                confirmType: 'done',
                fail: function (res) {
                    console.log(res.errMsg)
                }
            };
            if (this.$textfield.maxChars) {
                info.maxLength = this.$textfield.maxChars;
            }
            wx.showKeyboard(info);
            wx.onKeyboardConfirm(this.onKeyboardComplete);
            wx.onKeyboardComplete(this.onKeyboardComplete);
            wx.onKeyboardInput(this.onKeyboardInput);

            this.dispatchEvent(new egret.Event("focus"));
        }

        private onKeyboardInput(data): void {
            this.textValue = data.value;
            egret.Event.dispatchEvent(this, "updateText", false);
        }

        private onKeyboardComplete(res): void {
            this.$textfield.text = res.value;
            this.$hide();
        }

        /**
         * @private
         */
        $hide(): void {
            wx.offKeyboardComplete();
            wx.offKeyboardConfirm();
            wx.offKeyboardInput();
            wx.hideKeyboard({});
            this.dispatchEvent(new egret.Event("blur"));
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

            // this.resetText();

            return true;
        }
        /**
         * @private
         */
        $setColor(value: number): boolean {
            return true;
        }


        $onBlur(): void {

        }

        /**
         * @private
         * 
         */
        $removeFromStage(): void {

        }

        /**
         * 修改位置
         * @private
         */
        $resetStageText(): void {

        }
    }

    StageText = HTML5StageText;
}
