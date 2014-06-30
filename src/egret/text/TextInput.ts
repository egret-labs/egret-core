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
    export class TextInput extends DisplayObject {

        private _domInputSprite;
        private _edTxt;
        private _delegate:TextInputDegelete;
        private _placeholderText:string = "";
        private _edFontSize:number = 14;
        private _textColor:number = 0xff0000;
        private _placeholderFontSize = 14;
        private _placeholderColor:number = 0xffff00;

        private _preX:number = 0;
        private _preY:number = 0;


        private stageText:egret.StageText;

        public _onAddToStage():void {
            super._onAddToStage();
            var point = this.localToGlobal();
            var stageText = new egret.StageText();
            stageText._open(point.x, point.y,this._explicitWidth,this._explicitHeight);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onMouseDownHandler, this);
            this.stageText = stageText;
        }

        public setText(value:string):void {
            this.stageText._setText(value);
        }

        public getText():string {
            return this.stageText._getText();
        }

        public setTextType(type:string):void {
            this.stageText._setTextType(type);
        }

        public getTextType():string {
            return this.stageText._getTextType();
        }



        private onMouseDownHandler(event:TouchEvent) {

        }

        public _onRemoveFromStage() {
            this.stageText._remove();
        }

        public _measureBounds():egret.Rectangle {
            return egret.Rectangle.identity;
        }

        public hitTest(x, y, ignoreTouchEnabled:boolean = false):DisplayObject {
            //它不能被点击
            return null;
        }
    }

    export class TextInputDegelete {

        public editBoxEditingDidBegin(sender) {
        }

        public editBoxEditingDidEnd(sender) {
        }

        public editBoxTextChanged(sender, text) {
        }

        public editBoxReturn(sender) {
        }
    }
}