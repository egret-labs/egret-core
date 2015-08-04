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
     * @class egret.Matrix
     * @classdesc
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。
     * 您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * @extends egret.HashObject
     * @includeExample egret/geom/Matrix.ts
     */
    export class Matrix extends HashObject {
        /**
         * 创建一个 egret.Matrix 对象
         * @method egret.Matrix#constructor
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @param b {number} 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @param c {number} 旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @param tx {number} 沿 x 轴平移每个点的距离。
         * @param ty {number} 沿 y 轴平移每个点的距离。
         */
        constructor(a:number = 1, b:number = 0, c:number = 0, d:number = 1, tx:number = 0, ty:number = 0) {
            super();
            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @member egret.Matrix#a
         */
        public a:number;
        /**
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值
         * @member egret.Matrix#b
         */
        public b:number;
        /**
         * 旋转或倾斜图像时影响像素沿 x 轴定位的值
         * @member egret.Matrix#c
         */
        public c:number;
        /**
         * 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @member egret.Matrix#d
         */
        public d:number;
        /**
         * 沿 x 轴平移每个点的距离
         * @member egret.Matrix#tx
         */
        public tx:number;
        /**
         * 沿 y 轴平移每个点的距离
         * @member egret.Matrix#ty
         */
        public ty:number;

        /**
         * 引擎内部用于函数传递返回值的全局 Matrix 对象，开发者请勿随意修改此对象
         * @member {egret.Matrix} egret.Matrix.identity
         */
        public static identity:Matrix = new Matrix();

        /**
         * @private
         */
        public static DEG_TO_RAD:number = Math.PI / 180;

        /**
         * 前置矩阵
         * @method egret.Matrix#prepend
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx {number} 沿 x 轴平移每个点的距离
         * @param ty {number} 沿 y 轴平移每个点的距离
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
         * @param a {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param b {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param c {number} 缩放或旋转图像时影响像素沿 x 轴定位的值
         * @param d {number} 缩放或旋转图像时影响像素沿 y 轴定位的值
         * @param tx {number} 沿 x 轴平移每个点的距离
         * @param ty {number} 沿 y 轴平移每个点的距离
         * @returns {egret.Matrix}
         */
        public append(a:number, b:number, c:number, d:number, tx:number, ty:number):Matrix {
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
         * @method egret.Matrix#prependTransform
         * @param x {number} x值
         * @param y {number} y值
         * @param scaleX {number} 水平缩放
         * @param scaleY {number} 垂直缩放
         * @param rotation {number} 旋转
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @param regX {number} x值偏移
         * @param regY {number} y值偏移
         * @returns {egret.Matrix}
         */
        public prependTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix {
            if (rotation % 360) {
                var r = rotation;// * Matrix.DEG_TO_RAD;
                var cos = NumberUtils.cos(r);
                var sin = NumberUtils.sin(r);
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
//                skewX *= Matrix.DEG_TO_RAD;
//                skewY *= Matrix.DEG_TO_RAD;
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
                this.prepend(NumberUtils.cos(skewY), NumberUtils.sin(skewY), -NumberUtils.sin(skewX), NumberUtils.cos(skewX), x, y);
            } else {
                this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, x, y);
            }
            return this;
        }


        /**
         * 后置矩阵
         * @method egret.Matrix#appendTransform
         * @param x {number} x值
         * @param y {number} y值
         * @param scaleX {number} 水平缩放
         * @param scaleY {number} 垂直缩放
         * @param rotation {number} 旋转
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @param regX {number} x值偏移
         * @param regY {number} y值偏移
         * @returns {egret.Matrix}
         */
        public appendTransform(x:number, y:number, scaleX:number, scaleY:number, rotation:number, skewX:number, skewY:number, regX:number, regY:number):Matrix {
            if (rotation % 360) {
                var r = rotation;// * Matrix.DEG_TO_RAD;
                var cos = NumberUtils.cos(r);
                var sin = NumberUtils.sin(r);
            } else {
                cos = 1;
                sin = 0;
            }

            if (skewX || skewY) {
                // TODO: can this be combined into a single append?
//                skewX *= Matrix.DEG_TO_RAD;
//                skewY *= Matrix.DEG_TO_RAD;
                this.append(NumberUtils.cos(skewY), NumberUtils.sin(skewY), -NumberUtils.sin(skewX), NumberUtils.cos(skewX), x, y);
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
         * 对 Matrix 对象应用旋转转换。
         * 矩阵旋转，以角度制为单位
         * @method egret.Matrix#rotate
         * @param angle {number} 角度
         * @returns {egret.Matrix}
         */
        public rotate(angle:number):Matrix {
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
         * @param skewX {number} x方向斜切
         * @param skewY {number} y方向斜切
         * @returns {egret.Matrix}
         */
        public skew(skewX:number, skewY:number):Matrix {
//            skewX = skewX * Matrix.DEG_TO_RAD;
//            skewY = skewY * Matrix.DEG_TO_RAD;
            this.append(NumberUtils.cos(skewY), NumberUtils.sin(skewY), -NumberUtils.sin(skewX), NumberUtils.cos(skewX), 0, 0);
            return this;
        }


        /**
         * 矩阵缩放
         * @method egret.Matrix#scale
         * @param x {number} 水平缩放
         * @param y {number} 垂直缩放
         * @returns {egret.Matrix}
         */
        public scale(x:number, y:number):Matrix {
            this.a *= x;
            this.d *= y;
            this.c *= x;
            this.b *= y;
            this.tx *= x;
            this.ty *= y;
            return this;
        }


        /**
         * 沿 x 和 y 轴平移矩阵，由 x 和 y 参数指定。
         * @method egret.Matrix#translate
         * @param x {number} 沿 x 轴向右移动的量（以像素为单位）。
         * @param y {number} 沿 y 轴向下移动的量（以像素为单位）。
         * @returns {egret.Matrix}
         */
        public translate(x:number, y:number):Matrix {
            this.tx += x;
            this.ty += y;
            return this;
        }


        /**
         * 为每个矩阵属性设置一个值，该值将导致 null 转换。
         * 通过应用恒等矩阵转换的对象将与原始对象完全相同。
         * 调用 identity() 方法后，生成的矩阵具有以下属性：a=1、b=0、c=0、d=1、tx=0 和 ty=0。
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
         * @param matrix {egret.Matrix} 重置的目标矩阵
         * @returns {egret.Matrix}
         * @deprecated
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
         * 执行原始矩阵的逆转换。
         * 您可以将一个逆矩阵应用于对象来撤消在应用原始矩阵时执行的转换。
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
         * @deprecated
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

        /**
         * @private
         */
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

        /**
         * 将 Matrix 的成员设置为指定值
         * @method egret.Matrix#setTo
         * @param aa {number} 要将 Matrix 设置为的值
         * @param ba {number} 要将 Matrix 设置为的值
         * @param ca {number} 要将 Matrix 设置为的值
         * @param da {number} 要将 Matrix 设置为的值
         * @param txa {number} 要将 Matrix 设置为的值
         * @param tya {number} 要将 Matrix 设置为的值
         */
        public setTo(aa:number, ba:number, ca:number, da:number, txa:number, tya:number):void {
            this.a = aa;
            this.b = ba;
            this.c = ca;
            this.d = da;
            this.tx = txa;
            this.ty = tya;
        }

        /**
         * 将源 Matrix 对象中的所有矩阵数据复制到调用方 Matrix 对象中。
         * @method egret.Matrix#copyFrom
         * @param sourceMatrix {egret.Matrix} 要从中复制数据的 Matrix 对象
         */
        public copyFrom(sourceMatrix:Matrix):void {
            this.identityMatrix(sourceMatrix);
        }


        /**
         * 返回一个新的 Matrix 对象，它是此矩阵的克隆，带有与所含对象完全相同的副本。
         * @method egret.Matrix#clone
         * @returns {Matrix} 一个 Matrix 对象
         */
        public clone():Matrix {
            return new Matrix(this.a, this.b, this.c, this.d, this.tx, this.ty);
        }

        /**
         * 将某个矩阵与当前矩阵连接，从而将这两个矩阵的几何效果有效地结合在一起。
         * @method egret.Matrix#concat
         * @param m {egret.Matrix} 要连接到源矩阵的矩阵
         */
        public concat(m:Matrix):void {
            var a1:number = this.a;
            var b1:number = this.b;
            var c1:number = this.c;
            var d1:number = this.d;
            var tx1:number = this.tx;
            var ty1:number = this.ty;
            var a2:number = m.a;
            var b2:number = m.b;
            var c2:number = m.c;
            var d2:number = m.d;
            var tx2:number = m.tx;
            var ty2:number = m.ty;
            var a = a1 * a2;
            var b = 0;
            var c = 0;
            var d = d1 * d2;
            var tx = tx1 * a2 + tx2;
            var ty = ty1 * d2 + ty2;

            if (b1 != 0 || c1 != 0 || b2 != 0 || c2 != 0) {
                a += b1 * c2;
                d += c1 * b2;
                b += a1 * b2 + b1 * d2;
                c += c1 * a2 + d1 * c2;
                tx += ty1 * c2;
                ty += tx1 * b2;
            }

            this.a = a;
            this.b = b;
            this.c = c;
            this.d = d;
            this.tx = tx;
            this.ty = ty;
        }

        /**
         * 如果给定预转换坐标空间中的点，则此方法返回发生转换后该点的坐标。
         * 与使用 transformPoint() 方法应用的标准转换不同，deltaTransformPoint() 方法的转换不考虑转换参数 tx 和 ty。
         * @method egret.Matrix#deltaTransformPoint
         * @param point {egret.Point} 想要获得其矩阵转换结果的点
         * @returns {egret.Point} 由应用矩阵转换所产生的点
         */
        public deltaTransformPoint(point:egret.Point):egret.Point {
            var self = this;
            var x = self.a * point.x + self.c * point.y;
            var y = self.b * point.x + self.d * point.y;
            return new egret.Point(x, y);
        }

        /**
         * 返回将 Matrix 对象表示的几何转换应用于指定点所产生的结果。
         * @method egret.Matrix#transformPoint
         * @param point {egret.Point} 想要获得其矩阵转换结果的点
         * @returns {egret.Point} 由应用矩阵转换所产生的点
         */
        public transformPoint(point:egret.Point):egret.Point {
            var self = this;
            var x:number = self.a * point.x + self.c * point.y + self.tx;
            var y:number = self.b * point.x + self.d * point.y + self.ty;
            return new egret.Point(x, y);
        }

        /**
         * 返回列出该 Matrix 对象属性的文本值。
         * @method egret.Matrix#toString
         * @returns {egret.Point} 一个字符串，它包含 Matrix 对象的属性值：a、b、c、d、tx 和 ty。
         */
        public toString():string {
            return "(a=" + this.a + ", b=" + this.b + ", c=" + this.c + ", d=" + this.d + ", tx=" + this.tx + ", ty=" + this.ty + ")";
        }

        /**
         * 包括用于缩放、旋转和转换的参数。当应用于矩阵时，该方法会基于这些参数设置矩阵的值。
         * @method egret.Matrix#createBox
         * @param scaleX {number} 水平缩放所用的系数
         * @param scaleY {number} 垂直缩放所用的系数
         * @param rotation {number} 旋转量（以弧度为单位）
         * @param tx {number} 沿 x 轴向右平移（移动）的像素数
         * @param ty {number} 沿 y 轴向下平移（移动）的像素数
         */
        public createBox(scaleX:number, scaleY:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
            var self = this;
            if (rotation !== 0) {
                rotation = rotation / egret.Matrix.DEG_TO_RAD;
                var u = egret.NumberUtils.cos(rotation);
                var v = egret.NumberUtils.sin(rotation);
                self.a = u * scaleX;
                self.b = v * scaleY;
                self.c = -v * scaleX;
                self.d = u * scaleY;
            } else {
                self.a = scaleX;
                self.b = 0;
                self.c = 0;
                self.d = scaleY;
            }
            self.tx = tx;
            self.ty = ty;
        }

        /**
         * 创建 Graphics 类的 beginGradientFill() 和 lineGradientStyle() 方法所需的矩阵的特定样式。
         * 宽度和高度被缩放为 scaleX/scaleY 对，而 tx/ty 值偏移了宽度和高度的一半。
         * @method egret.Matrix#createGradientBox
         * @param width {number} 渐变框的宽度
         * @param height {number} 渐变框的高度
         * @param rotation {number} 旋转量（以弧度为单位）
         * @param tx {number} 沿 x 轴向右平移的距离（以像素为单位）。此值将偏移 width 参数的一半
         * @param ty {number} 沿 y 轴向下平移的距离（以像素为单位）。此值将偏移 height 参数的一半
         */
        public createGradientBox(width:number, height:number, rotation:number = 0, tx:number = 0, ty:number = 0):void {
            this.createBox(width / 1638.4, height / 1638.4, rotation, tx + width / 2, ty + height / 2);
        }
    }
}