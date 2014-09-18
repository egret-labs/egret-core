/**
 * Created by wander on 14-9-15.
 */
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
    export class NativeStageText extends StageText {

        private tf:egret.TextField;
        private container:egret.DisplayObjectContainer;
        private textType:string;

        constructor() {
            super();
            this.tf = new egret.TextField();
            var tf:egret.TextField = this.tf;
            tf.textColor = 0;
            tf.text = "";
            tf.textAlign = egret.HorizontalAlign.LEFT;
            this.container = new egret.DisplayObjectContainer();
        }

        /**
         * @method egret.StageText#getText
         * @returns {string}
         */
        public _getText():string {
            var text = this.tf.text;
            if (!text){
                text = "";
            }
            return text;
        }

        /**
         * @method egret.StageText#setText
         * @param value {string}
         */
        public _setText(value:string):void {
            this.tf.text = value;
        }

        /**
         * @method egret.StageText#setTextType
         * @param type {string}
         */
        public _setTextType(type:string):void {
            this.textType = type;
        }

        /**
         * @method egret.StageText#getTextType
         * @returns {string}
         */
        public _getTextType():string {
            return this.textType;
        }

        /**
         * @method egret.StageText#open
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         */
        public _open(x:number, y:number, width:number = 160, height:number = 21):void {


        }

        /**
         * @method egret.StageText#add
         */
        public _show():void {

            egret_native.TextInputOp.setKeybordOpen(true);

            var container:egret.DisplayObjectContainer = this.container;
            var stage:egret.Stage = egret.MainContext.instance.stage;
            stage.addChild(container);


            var stageWidth:number = stage.stageWidth;
            var stageHeight:number = stage.stageHeight;

            var shape:egret.Shape = new egret.Shape();
            shape.graphics.beginFill(0x000000, .7);
            shape.graphics.drawRect(0, 0, stageWidth, stageHeight);
            shape.graphics.endFill();
            shape.width = stageWidth;
            shape.height = stageHeight;
            shape.touchEnabled = true;
            container.addChild(shape);


            var textInputBackground:egret.Shape = new egret.Shape();
            textInputBackground.graphics.lineStyle(8, 0xff0000, 1);
            textInputBackground.graphics.beginFill(0xffffff, 1);
            textInputBackground.graphics.drawRect(4, 4, stageWidth - 8, 52);
            textInputBackground.graphics.endFill();
            container.addChild(textInputBackground);

            var tf:egret.TextField = this.tf;
            tf.x = tf.y = 15;
            container.addChild(tf);
            tf.width = stageWidth;


            var self = this;

            egret_native.EGT_TextInput = function (appendText:string) {
                if (appendText == "\n") return;
                var text = self._getText();
                text += appendText;
                if (self.textType == "password"){
                    var passwordStr = "";
                    for (var i = 0 ; i < text.length ; i++){
                        passwordStr += "*";
                    }
                    tf.text = passwordStr;
                }
                else{
                    tf.text = text;
                }

            }

            egret_native.EGT_deleteBackward = function () {
                var text = self._getText();
                text = text.substr(0, text.length - 1);
                tf.text = text;
            }



            egret_native.EGT_keyboardDidHide = function () {
                if (container && container.parent) {
                    container.parent.removeChild(container);
                    self.dispatchEvent(new egret.Event("blur"));
                }

            }

            egret_native.EGT_keyboardDidShow = function () {
                self.dispatchEvent(new egret.Event("focus"));
            }


            egret_native.EGT_getTextEditerContentText = function(){
                return self._getText();
            }
        }

        /**
         * @method egret.StageText#remove
         */
        public _remove():void {
            var container = this.container;
            if (container && container.parent) {
                container.parent.removeChild(container);
            }
        }

        public _hide():void {
            egret_native.TextInputOp.setKeybordOpen(false);

        }

        public changePosition(x:number, y:number):void {
        }

        public changeSize(width:number, height:number):void {
        }

        public setSize(value:number):void {
        }

        public setTextColor(value:string):void {
        }

        public setTextFontFamily(value:string):void {
        }

        public setWidth(value:number):void {
        }

        public setHeight(value:number):void {
        }
    }
}


egret.StageText.create = function () {
    return new egret.NativeStageText();
}