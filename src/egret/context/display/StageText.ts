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
     * @extends egret.EventDispatcher
     * @private
     */
    export class StageText extends EventDispatcher {

        constructor() {
            super();
        }

        /**
         * @returns {string}
         */
        public _getText():string {
            return null;
        }

        /**
         * @param value {string}
         */
        public _setText(value:string):void {

        }

        /**
         * @param type {string}
         */
        public _setTextType(type:string):void {

        }

        /**
         * @returns {string}
         */
        public _getTextType():string {
            return null;
        }

        /**
         * @param x {number}
         * @param y {number}
         * @param width {number}
         * @param height {number}
         */
        public _open(x:number, y:number, width:number = 160, height:number = 21):void {

        }

        public _show():void {

        }

        public _add():void {

        }

        public _remove():void {

        }

        public _hide():void {

        }

        public _addListeners():void {

        }

        public _removeListeners():void {

        }

        public _scaleX:number = 1;
        public _scaleY:number = 1;
        public _setScale(x:number, y:number):void {
            this._scaleX = x;
            this._scaleY = y;
        }

        public changePosition(x:number, y:number):void {

        }

        public _size:number = 30;
        public _setSize(value:number):void {
            this._size = value;
        }

        public _color:string = "#FFFFFF";
        public _setTextColor(value:string):void {
            this._color = value;
        }

        public _fontFamily:string = "Arial";
        public _setTextFontFamily(value:string):void {
            this._fontFamily = value;
        }

        public _bold:boolean = false;
        public _setBold(value:boolean):void {
            this._bold = value;
        }

        public _italic:boolean = false;
        public _setItalic(value:boolean):void {
            this._italic = value;
        }

        public _textAlign:string = "left";
        public _setTextAlign(value:string):void {
            this._textAlign = value;
        }

        public _visible:boolean = false;
        public _setVisible(value:boolean):void {
            this._visible = value;
        }

        public _setWidth(value:number):void {

        }

        public _setHeight(value:number):void {
        }

        public _multiline:boolean = false;
        public _setMultiline(value:boolean):void {
            this._multiline = value;
        }

        public _maxChars:number = 0;
        public _setMaxChars(value:number):void {
            this._maxChars = value;
        }

        public _resetStageText():void {

        }

        public static create():StageText {
            return null;
        }

    }
}