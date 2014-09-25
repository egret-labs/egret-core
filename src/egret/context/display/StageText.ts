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
    export class StageText extends EventDispatcher {
        public _multiline:boolean = false;
        public _maxChars:number = 0;

        constructor() {
            super();
        }

        /**
         * @method egret.StageText#getText
         * @returns {string}
         */
        public _getText():string {
            return null;
        }

        /**
         * @method egret.StageText#setText
         * @param value {string}
         */
        public _setText(value:string):void {

        }

        /**
         * @method egret.StageText#setTextType
         * @param type {string}
         */
        public _setTextType(type:string):void {

        }

        /**
         * @method egret.StageText#getTextType
         * @returns {string}
         */
        public _getTextType():string {
            return null;
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

        }

        /**
         * @method egret.StageText#remove
         */
        public _remove():void {

        }

        public _hide():void {

        }

        public _draw():void {

        }

        public _addListeners():void {

        }

        public _removeListeners():void {

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

        public _setMultiline(value:boolean):void {
            this._multiline = value;
        }

        public static create():StageText {
            return null;
        }

    }
}