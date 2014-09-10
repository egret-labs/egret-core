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
     * @class egret.Matrix
     * @classdesc
     * 2D矩阵类，包括常见矩阵算法
     * @extends egret.HashObject
     */
    export class Matrix extends HashObject {
        /**
         * @method egret.Matrix#constructor
         * @constructor
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         */
        constructor(public a = 1, public b = 0, public c = 0, public d = 1, public tx = 0, public ty = 0) {
            super();
        }

        /**
         * @member {any} egret.Matrix.
         */
// static public properties:

        static identity = new Matrix();

        static DEG_TO_RAD = Math.PI / 180;

        /**
         * @member {any} egret.Matrix#
         */
// public methods:

        /**
         * 前置矩阵
         * @method egret.Matrix#prepend
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         * @returns {egret.Matrix}
         */
        public prepend(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix {
            var tx1 = this.tx;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                var a1 = this.a;
                var c1 = this.c;
                this.a = a1 * a + this.b * c;
                this.b = a1 * b + this.b * d;
                this.c = c1 * a + this.d * c;
                this.d = c1 * b + this.d * d;
            }
            this.tx = tx1 * a + this.ty * c + tx;
            this.ty = tx1 * b + this.ty * d + ty;
            return this;
        }


        /**
         * 后置矩阵
         * @method egret.Matrix#append
         * @param a {number}
         * @param b {number}
         * @param c {number}
         * @param d {number}
         * @param tx {number}
         * @param ty {number}
         * @returns {egret.Matrix}
         */
        public append(a, b, c, d, tx, ty):Matrix {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                this.a = a * a1 + b * c1;
                this.b = a * b1 + b * d1;
                this.c = c * a1 + d * c1;
                this.d = c * b1 + d * d1;
            }
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        }


        /**
         * 前置矩阵
         * @method egret.Matrix#prependMatrix
         * @param matrix {number}
         * @returns {egret.Matrix}
         */
        public prependMatrix(matrix:Matrix):Matrix {
            this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
//        this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
            return this;
        }


        /**
         * 后置矩阵
         * @method egret.Matrix#appendMatrix
         * @param matrix {egret.Matrix}
         * @returns {egret.Matrix}
         */
        public appendMatrix(matrix:Matrix):Matrix {
            this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
//        this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
            return this;
        }


        /**
         * 前置矩阵
         * @method egret.Matrix#prependTransform
         * @param x {number}
         * @param y {number}
         * @param scaleX {number}
         * @param scaleY {number}
         * @param rotation {number}
         * @param skewX {number}
         * @param skewY {number}
         * @param regX {number}
         * @param regY {number}
         * @returns {egret.Matrix}
         */
        public prependTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix {
            if (rotation % 360) {
                var r = rotation * Matrix.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (regX || regY) {
                // append the registration offset:
                this.tx -= regX;
                this.ty -= regY;
            }
            if (skewX || skewY) {
                // TODO: can this be combined into a single prepend operation?
                skewX *= Matrix.DEG_TO_RAD;
                skewY *= Matrix.DEG_TO_RAD;
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
            } else {
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            return this;
        }


        /**
         * 后置矩阵
         * @method egret.Matrix#appendTransform
         * @param x {number}
         * @param y {number}
         * @param scaleX {number}
         * @param scaleY {number}
         * @param rotation {number}
         * @param skewX {number}
         * @param skewY {number}
         * @param regX {number}
         * @param regY {number}
         * @returns {egret.Matrix}
         */
        public appendTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix {
            if (rotation % 360) {
                var r = rotation * Matrix.DEG_TO_RAD;
                var cos = Math.cos(r);
                var sin = Math.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                // TODO: can this be combined into a single append?
                skewX *= Matrix.DEG_TO_RAD;
                skewY *= Matrix.DEG_TO_RAD;
                this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
            } else {
                this.append(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }

            if (regX || regY) {
                // prepend the registration offset:
                this.tx -= regX * this.a + regY * this.c;
                this.ty -= regX * this.b + regY * this.d;
            }
            return this;
        }

        /**
         * 矩阵旋转，以角度制为单位
         * @method egret.Matrix#rotate
         * @param angle {number}
         * @returns {egret.Matrix}
         */
        public rotate(angle):Matrix {
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);

            var a1 = this.a;
            var c1 = this.c;
            var tx1 = this.tx;

            this.a = a1 * cos - this.b * sin;
            this.b = a1 * sin + this.b * cos;
            this.c = c1 * cos - this.d * sin;
            this.d = c1 * sin + this.d * cos;
            this.tx = tx1 * cos - this.ty * sin;
            this.ty = tx1 * sin + this.ty * cos;
            return this;
        }


        /**
         * 矩阵斜切，以角度值为单位
         * @method egret.Matrix#skew
         * @param skewX {number}
         * @param skewY {number}
         * @returns {egret.Matrix}
         */
        public skew(skewX, skewY):Matrix {
            skewX = skewX * Matrix.DEG_TO_RAD;
            skewY = skewY * Matrix.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        }


        /**
         * 矩阵缩放
         * @method egret.Matrix#scale
         * @param x {number}
         * @param y {number}
         * @returns {egret.Matrix}
         */
        public scale(x, y):Matrix {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;
            return this;
        }


        /**
         * 矩阵唯一
         * @method egret.Matrix#translate
         * @param x {number}
         * @param y {number}
         * @returns {egret.Matrix}
         */
        public translate(x, y):Matrix {
            this.tx += x;
            this.ty += y;
            return this;
        }


        /**
         * 矩阵重置
         * @method egret.Matrix#identity
         * @returns {egret.Matrix}
         */
        public identity():Matrix {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        }

        /**
         * 矩阵重置为目标矩阵
         * @method egret.Matrix#identityMatrix
         * @returns {egret.Matrix}
         */
        public identityMatrix(matrix:Matrix):Matrix {
            this.a = matrix.a;
            this.b = matrix.b;
            this.c = matrix.c;
            this.d = matrix.d;
            this.tx = matrix.tx;
            this.ty = matrix.ty;
            return this;
        }

        /**
         * 矩阵翻转
         * @method egret.Matrix#invert
         * @returns {egret.Matrix}
         */
        public invert():Matrix {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;
            var tx1 = this.tx;
            var n = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;
            return this;
        }


        /**
         * 根据一个矩阵，返回某个点在该矩阵上的坐标
         * @method egret.Matrix.transformCoords
         * @param matrix {egret.Matrix}
         * @param x {number}
         * @param y {number}
         * @returns {numberPoint}
         * @stable C 该方法以后可能删除
         */
        public static transformCoords(matrix:Matrix, x:number, y:number):Point {
            var resultPoint:Point = Point.identity;
            resultPoint.x = matrix.a * x + matrix.c * y + matrix.tx;
            resultPoint.y = matrix.d * y + matrix.b * x + matrix.ty;

//        resultPoint.x = matrix.a * x + matrix.c * y - matrix.tx;
//        resultPoint.y = matrix.d * y + matrix.b * x - matrix.ty;
            return resultPoint;
        }

        private array;

        public toArray(transpose) {
            if (!this.array) {
                this.array = new Float32Array(9);
            }

            if (transpose) {
                this.array[0] = this.a;
                this.array[1] = this.b;
                this.array[2] = 0;
                this.array[3] = this.c;
                this.array[4] = this.d;
                this.array[5] = 0;
                this.array[6] = this.tx;
                this.array[7] = this.ty;
                this.array[8] = 1;
            }
            else {
                this.array[0] = this.a;
                this.array[1] = this.b;
                this.array[2] = this.tx;
                this.array[3] = this.c;
                this.array[4] = this.d;
                this.array[5] = this.ty;
                this.array[6] = 0;
                this.array[7] = 0;
                this.array[8] = 1;
            }

            return this.array;
        }
    }
}