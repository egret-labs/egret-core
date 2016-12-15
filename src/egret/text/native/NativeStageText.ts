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


namespace egret.native {

    /**
     * @classdesc
     * @implements egret.StageText
     * @private
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class NativeStageText extends EventDispatcher implements StageText {

        /**
         * @private
         */
        private textValue: string = "";

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        constructor() {
            super();
            this.textValue = "";
        }

        /**
         * @private
         * 
         * @returns 
         */
        public $getText(): string {
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

            return true;
        }
        /**
         * @private
         */
        private colorValue: number = 0xffffff;
        $setColor(value: number): boolean {
            this.colorValue = value;
            return true;
        }

        /**
         * @private
         *
         */
        $onBlur(): void {
        }

        /**
         * @private
         */
        private isFinishDown: boolean = false;
        //全屏键盘
        private showScreenKeyboard(): void {
            let self = this;

            self.dispatchEvent(new egret.Event("focus"));
            Event.dispatchEvent(self, "focus", false, { "showing": true });

            egret_native.EGT_TextInput = function (appendText: string) {
                if (self.$textfield.multiline) {//多行文本
                    self.textValue = appendText;
                    self.dispatchEvent(new egret.Event("updateText"));
                    if (self.isFinishDown) {
                        self.isFinishDown = false;
                        self.dispatchEvent(new egret.Event("blur"));
                    }
                }
                else {//单行文本
                    self.textValue = appendText.replace(/[\n|\r]/, "");

                    //关闭软键盘
                    egret_native.TextInputOp.setKeybordOpen(false);

                    self.dispatchEvent(new egret.Event("updateText"));
                    self.dispatchEvent(new egret.Event("blur"));
                }
            };

            //点击完成
            egret_native.EGT_keyboardFinish = function () {
                if (self.$textfield.multiline) {//多行文本
                    self.isFinishDown = true;
                }
            };
        }

        /**
         * @private
         * 
         */
        public $show(): void {
            let self = this;

            let textfield: egret.TextField = this.$textfield;
            let values = textfield.$TextField;

            egret_native.TextInputOp.setKeybordOpen(false);

            egret_native.EGT_getTextEditerContentText = function () {
                return self.$getText();
            };

            egret_native.EGT_keyboardDidShow = function () {
                //if (egret_native.TextInputOp.isFullScreenKeyBoard()) {//横屏
                //}
                self.showScreenKeyboard();

                egret_native.EGT_keyboardDidShow = function () {
                }

                if(egret_native.TextInputOp.updateConfig) {
                    egret_native.TextInputOp.updateConfig(JSON.stringify({
                        "font_color": values[sys.TextKeys.textColor]
                    }));
                }
            };

            egret_native.EGT_keyboardDidHide = function () {
            };

            egret_native.EGT_deleteBackward = function () {
            };
            let inputType = values[sys.TextKeys.inputType];
            let inputMode = values[sys.TextKeys.multiline] ? 0 : 6;
            let inputFlag = -1;//textfield.displayAsPassword ? 0 : -1;
            if (inputType == TextFieldInputType.PASSWORD) {
                inputFlag = 0;
            }
            else if (inputType == TextFieldInputType.TEL) {
                inputMode = 3;
            }
            let returnType = 1;
            let maxLength = values[sys.TextKeys.maxChars] <= 0 ? -1 : values[sys.TextKeys.maxChars];
            let node = textfield.$getRenderNode();
            let point = this.$textfield.localToGlobal(0, 0);
            egret_native.TextInputOp.setKeybordOpen(true, JSON.stringify({
                "inputMode": inputMode,
                "inputFlag": inputFlag,
                "returnType": returnType,
                "maxLength": maxLength,
                
                "x": point.x,
                "y": point.y,
                "width": textfield.width,
                "height": textfield.height,
                "font_size": values[sys.TextKeys.fontSize],
                "font_color": values[sys.TextKeys.textColor],
                "textAlign": values[sys.TextKeys.textAlign],
                "verticalAlign": values[sys.TextKeys.verticalAlign]
            }));
        }

        /**
         * @private
         * 
         */
        public $hide(): void {
            egret_native.TextInputOp.setKeybordOpen(false);
            this.dispatchEvent(new egret.Event("blur"));
        }

        $resetStageText(): void {
        }

        public $addToStage(): void {

        }

        public $removeFromStage(): void {

        }

        /**
         * @private
         */
        $textfield: egret.TextField;

        $setTextField(value: egret.TextField): boolean {
            this.$textfield = value;

            return true;
        }
    }

    StageText = NativeStageText;
}