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
     * @version Egret 2.0
     * @platform Web,Native
     */
    export class NativeStageText extends EventDispatcher implements StageText {

        /**
         * @private
         */
        private textValue:string = "";

        public $textfield:egret.TextField;

        /**
         * @private
         */
        private container:egret.DisplayObjectContainer;
        /**
         * @private
         */
        private textBg:egret.Shape;
        /**
         * @private
         */
        private textBorder:egret.Shape;

        /**
         * @private
         */
        private textType:string = null;

        /**
         * @version Egret 2.0
         * @platform Web,Native
         */
        constructor() {
            super();
            this.$textfield = new egret.TextField();
            var tf:egret.TextField = this.$textfield;
            tf.textColor = 0;
            tf.text = "";
            tf.textAlign = egret.HorizontalAlign.LEFT;
            this.container = new egret.DisplayObjectContainer();

            this.textValue = "";
        }

        /**
         * @private
         * 
         */
        private createText():void {
            var container:egret.DisplayObjectContainer = this.container;
            var stage:egret.Stage = egret.MainContext.instance.stage;
            var stageWidth:number = stage.stageWidth;
            var stageHeight:number = stage.stageHeight;
            if (container.numChildren <= 0) {

                var shape:egret.Shape = new egret.Shape();
                shape.graphics.beginFill(0x000000, .7);
                shape.graphics.drawRect(0, 0, stageWidth, stageHeight);
                shape.graphics.endFill();
                shape.width = stageWidth;
                shape.height = stageHeight;
                shape.touchEnabled = true;
                container.addChild(shape);

                var textInputBackground:egret.Shape = new egret.Shape();
                this.textBg = textInputBackground;
                container.addChild(textInputBackground);
                textInputBackground.touchEnabled = true;

                var tf:egret.TextField = this.$textfield;
                tf.x = 15;
                tf.touchEnabled = true;
                container.addChild(tf);
                tf.width = stageWidth;
                tf.size = 30;

                var border:egret.Shape = new egret.Shape();
                this.textBorder = border;
                container.addChild(border);
                border.touchEnabled = true;
                this.textBg.width = stageWidth - 30;
                this.textBorder.width = stageWidth - 30;
            }

            this.textBg.graphics.clear();
            this.textBorder.graphics.clear();
            this.textBorder.graphics.lineStyle(8, 0xff0000, 1);
            this.textBg.graphics.beginFill(0xffffff, 1);

            var h:number = 30;
            if (this.$textfield.multiline) {
                h = 90;
            }
            this.textBg.graphics.drawRect(4, 4, stageWidth - 8, h + 22);
            this.textBorder.graphics.drawRect(4, 4, stageWidth - 8, h + 22);

            var maxH:number = Math.max(this.$textfield.height, h);
            this.$textfield.y = h - maxH + 15;
            this.textBg.height = h + 22;
            this.textBorder.height = h + 22;

            this.textBg.graphics.endFill();
            this.textBorder.graphics.endFill();
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
        public $setText(value:string):void {
            this.textValue = value;

            this.resetText();
        }

        /**
         * @private
         * 
         * @param type 
         */
        public $setTextType(type:string):void {
            this.textType = type;

            this.resetText();
        }

        /**
         * @private
         * 
         * @returns 
         */
        public $getTextType():string {
            return this.textType;
        }

        /**
         * @private
         *
         */
        $onBlur():void {
        }

        /**
         * @private
         * 
         */
        private resetText():void {
            if (this.textType == "password") {
                var passwordStr = "";
                for (var i = 0; i < this.textValue.length; i++) {
                    switch (this.textValue.charAt(i)) {
                        case '\n' :
                            passwordStr += "\n";
                            break;
                        case '\r' :
                            break;
                        default :
                            passwordStr += '*';
                    }
                }
                this.$textfield.text = passwordStr;
            }
            else {
                this.$textfield.text = this.textValue;
            }

            var h:number = 30;
            if (this.$textfield.multiline) {
                h = 90;
            }
            var maxH:number = Math.max(this.$textfield.height, h);
            this.$textfield.y = h - maxH + 15;
        }

        /**
         * @private
         */
        private isFinishDown:boolean = false;
        //全屏键盘
        private showScreenKeyboard():void {
            var self = this;
            self.dispatchEvent(new egret.Event("blur"));
            egret_native.EGT_TextInput = function (appendText:string) {
                if (self.$textfield.multiline) {//多行文本
                    if (self.isFinishDown) {
                        self.isFinishDown = false;

                        self.textValue = appendText;
                        self.resetText();

                        self.dispatchEvent(new egret.Event("updateText"));
                    }
                }
                else {//单行文本
                    self.textValue = appendText.replace(/[\n|\r]/, "");
                    self.resetText();

                    //关闭软键盘
                    egret_native.TextInputOp.setKeybordOpen(false);

                    self.dispatchEvent(new egret.Event("updateText"));
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
        private showPartKeyboard():void {
            var container:egret.DisplayObjectContainer = this.container;
            var stage:egret.Stage = egret.MainContext.instance.stage;
            stage.addChild(container);
            this.createText();

            var self = this;

            egret_native.EGT_TextInput = function (appendText:string) {
                if (self.$textfield.multiline) {//多行文本

                }
                else {
                    if (appendText == "\n") {
                        if (container && container.parent) {
                            self.dispatchEvent(new egret.Event("blur"));
                            container.parent.removeChild(container);
                        }
                        egret_native.TextInputOp.setKeybordOpen(false);
                        return;
                    }
                }
                self.textValue += appendText;

                self.resetText();
                self.dispatchEvent(new egret.Event("updateText"));
            };

            egret_native.EGT_deleteBackward = function () {
                var text = self.$getText();
                text = text.substr(0, text.length - 1);
                self.textValue = text;

                self.resetText();
                self.dispatchEvent(new egret.Event("updateText"));
            };

            //系统关闭键盘
            egret_native.EGT_keyboardDidHide = function () {
                if (container && container.parent) {
                    self.dispatchEvent(new egret.Event("blur"));
                    container.parent.removeChild(container);
                }
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
                if (egret_native.TextInputOp.isFullScreenKeyBoard()) {//横屏
                    self.showScreenKeyboard();
                }
                else {
                    self.showPartKeyboard();
                }

                egret_native.EGT_keyboardDidShow = function () {
                }
            };

            egret_native.TextInputOp.setInputTextMaxLenght(self.$textfield.maxChars > 0 ? self.$textfield.maxChars : -1);

            egret_native.TextInputOp.setKeybordOpen(true);
        }

        /**
         * @private
         * 
         */
        public $remove():void {
            var container = this.container;
            if (container && container.parent) {
                container.parent.removeChild(container);
            }
        }

        /**
         * @private
         * 
         */
        public $hide():void {
            this.$remove();
            this.dispatchEvent(new egret.Event("blur"));
            egret_native.TextInputOp.setKeybordOpen(false);
        }

        $resetStageText():void {

        }

        public $addToStage():void {

        }

        public $removeFromStage():void {

        }

        public $setTextField(value:egret.TextField):void {

        }
    }

    StageText = NativeStageText;
}