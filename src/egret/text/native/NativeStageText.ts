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
        private textValue:string = "";

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
        public $getText():string {
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

            return true;
        }

        /**
         * @private
         *
         */
        $onBlur():void {
        }

        /**
         * @private
         */
        private isFinishDown:boolean = false;
        //全屏键盘
        private showScreenKeyboard():void {
            var self = this;

            self.dispatchEvent(new egret.Event("focus"));
            Event.dispatchEvent(self, "focus", false, {"showing" : true});

            egret_native.EGT_TextInput = function (appendText:string) {
                if (self.$textfield.multiline) {//多行文本
                    if (self.isFinishDown) {
                        self.isFinishDown = false;

                        self.textValue = appendText;

                        self.dispatchEvent(new egret.Event("updateText"));
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
                self.dispatchEvent(new egret.Event("blur"));
            };
        }

        /**
         * @private
         * 
         */
        public $show():void {
            var self = this;
            egret_native.EGT_getTextEditerContentText = function () {
                return self.$getText();
            };

            egret_native.EGT_keyboardDidShow = function () {
                //if (egret_native.TextInputOp.isFullScreenKeyBoard()) {//横屏
                //}
                self.showScreenKeyboard();

                egret_native.EGT_keyboardDidShow = function () {
                }
            };

            var textfield:egret.TextField = this.$textfield;
            var inputMode = textfield.multiline ? 0 : 6;
            var inputFlag = -1;//textfield.displayAsPassword ? 0 : -1;
            var returnType = 1;
            var maxLength = textfield.maxChars <= 0 ? -1 : textfield.maxChars;
            egret_native.TextInputOp.setKeybordOpen(true, JSON.stringify({"inputMode" : inputMode,  "inputFlag" : inputFlag,   "returnType" :returnType,   "maxLength" :maxLength}));
        }

        /**
         * @private
         * 
         */
        public $hide():void {
            this.dispatchEvent(new egret.Event("blur"));
            egret_native.TextInputOp.setKeybordOpen(false);
        }

        $resetStageText():void {
        }

        public $addToStage():void {

        }

        public $removeFromStage():void {

        }

        /**
         * @private
         */
        $textfield:egret.TextField;

        $setTextField(value:egret.TextField):boolean {
            this.$textfield = value;

            return true;
        }
    }

    StageText = NativeStageText;
}