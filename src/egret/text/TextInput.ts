/// <reference path="DisplayObjectContainer.ts"/>
/// <reference path="../context/display/StageText.ts"/>
/**
 * Copyright (c) Egret-Labs.org. Permission is hereby granted, free of charge,
 * to any person obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/// <reference path="../geom/Rectangle.ts"/>

module ns_egret {
    export class TextInput extends DisplayObject {

        private _domInputSprite;
        private _edTxt;
        private _delegate:TextInputDegelete;
        private _placeholderText:string = "";
        private _edFontSize = 14;
        private _textColor = "#ff0000";
        private _placeholderFontSize = 14;
        private _placeholderColor = "#ffff00";

        private _preX:number = 0;
        private _preY:number = 0;


        private stageText:ns_egret.StageText;

        public _onAddToStage():void {
            super._onAddToStage();
            var point = this.localToGlobal();
            var stageText = new ns_egret.StageText();
            stageText.open(point.x, point.y,this._contentWidth,this._contentHeight);
            this.addEventListener(ns_egret.TouchEvent.TOUCH_BEGAN, this.onMouseDownHandler, this);
            this.stageText = stageText;
        }

        public setText(value:string):void {
            this.stageText.setText(value);
        }

        public getText():string {
            return this.stageText.getText();
        }

        public setTextType(type:string):void {
            this.stageText.setTextType(type);
        }

        public getTextType():string {
            return this.stageText.getTextType();
        }



        private onMouseDownHandler() {

        }

        public _onRemoveFromStage() {
            this.stageText.remove();
        }

        _measureBounds():ns_egret.Rectangle {
            return ns_egret.Rectangle.identity;
        }

        hitTest(x, y){
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