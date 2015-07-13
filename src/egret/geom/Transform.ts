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
     * @class egret.Transform
     * @classdesc
     * 利用 Transform 类，可以访问可应用于显示对象的颜色调整属性和二维转换对象。
     * @extends egret.HashObject
     * @private
     */
    export class Transform extends HashObject {
        private _display:DisplayObject;

        constructor(display:DisplayObject) {
            super();
            this._display = display;
        }

        private _matrix:Matrix = new Matrix();
        private _matrix2:Matrix = new Matrix();

        public get matrix():Matrix {
            this._matrix2.identityMatrix(this._matrix);
            return this._matrix2;
        }

        /**
         * 一个 Matrix 对象，其中包含更改显示对象的缩放、旋转和平移的值。
         * @member {number} egret.Transform#matrix
         */
        public set matrix(value:Matrix) {
            this._setMatrix(value);
        }

        private _setMatrix(value:Matrix):void {
            if(!this._display.__hack_local_matrix) {
                this._display.__hack_local_matrix = new Matrix();
            }
            this._display.__hack_local_matrix.identityMatrix(value);
            this._matrix.identityMatrix(value);
        }

        /**
         * @private
         */
        public _colorTransform:ColorTransform = new ColorTransform();
        private _colorTransform2:ColorTransform = new ColorTransform();

        public get colorTransform():ColorTransform {
            this._colorTransform2.identityColorTransform(this._colorTransform);
            return this._colorTransform2;
        }

        /**
         * 一个 ColorTransform 对象，其中包含整体调整显示对象颜色的值。
         * @member {egret.ColorTransform} egret.Transform#colorTransform
         */
        public set colorTransform(value:ColorTransform) {
            this._setColorTransform(value);
        }

        private _setColorTransform(value:ColorTransform):void {
            this._colorTransform.identityColorTransform(value);
        }
    }
}