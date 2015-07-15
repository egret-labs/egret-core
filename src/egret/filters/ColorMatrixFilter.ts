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
     * @class egret.ColorMatrixFilter
     * @classdesc
     * 使用 ColorMatrixFilter 类可以将 4 x 5 矩阵转换应用于输入图像上的每个像素的 RGBA 颜色和 Alpha 值，以生成具有一组新的 RGBA 颜色和 Alpha 值的结果。
     * @extends egret.Filter
     * @private
     */
    export class ColorMatrixFilter extends Filter {
        /**
         * @private
         */
        public _matrix:Array<number> = [];
        private _matrix2:Array<number> = [];

        /**
         * 创建一个 egret.ColorMatrixFilter 对象
         * @method egret.ColorMatrixFilter#constructor
         * @param matrix {Array<number>} 由 20 个项目（排列成 4 x 5 矩阵）组成的数组。
         */
        constructor(matrix:Array<number> = null) {
            super();
            this.type = "colorTransform";
            this._setMatrix(matrix);
        }

        public get matrix():Array<number> {
            for (var i = 0; i < 20; i++) {
                this._matrix2[i] = this._matrix[i];
            }
            return this._matrix2;
        }

        /**
         * 由 20 个项目组成的数组，适用于 4 x 5 颜色转换。
         * @member egret.ColorMatrixFilter#matrix
         */
        public set matrix(value:Array<number>) {
            this._setMatrix(value);
        }

        private _setMatrix(value:Array<number>):void {
            for (var i = 0; i < 20; i++) {
                this._matrix[i] = (value && value[i]) || 0;
            }
        }
    }
}