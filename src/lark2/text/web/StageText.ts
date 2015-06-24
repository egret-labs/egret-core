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
     * @extends egret.EventDispatcher
     * @private
     */
    export class StageText extends EventDispatcher {

        constructor() {
            super();

        }

        public _textfield:egret.TextField1;
        public _setTextField(textfield:egret.TextField1):void {
            this._textfield = textfield;
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

        public _show(multiline:boolean, size:number, width:number, height:number):void {

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

        public _size:number = 30;

        public _color:string = "#FFFFFF";

        public _verticalAlign:string = "top";

        public _visible:boolean = false;
        public _setVisible(value:boolean):void {
            this._visible = value;
        }


        public _multiline:boolean = false;
        public _setMultiline(value:boolean):void {
            this._multiline = value;
        }

        public _resetStageText():void {

        }

        public _initElement(x:number, y:number, cX:number, cY:number):void {

        }

        public _removeInput():void {

        }

        public static create():StageText {
            return null;
        }

    }
}