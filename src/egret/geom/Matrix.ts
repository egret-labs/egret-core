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

/// <reference path="../core/HashObject.ts"/>
/// <reference path="../display/DisplayObject.ts"/>
/// <reference path="Point.ts"/>

module ns_egret {
    /**
     * 2D矩阵类，包括常见矩阵算法
     */
    export class Matrix extends HashObject{
        constructor(public a = 1, public b = 0, public c = 0, public d = 1, public tx = 0, public ty = 0) {
            super();
        }

// static public properties:

        static identity = new Matrix();

        static DEG_TO_RAD = Math.PI / 180;

// public methods:

        /**
         * 前置矩阵
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         * @returns {ns_egret.Matrix}
         */
        prepend(a, b, c, d, tx, ty) {
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
         * @param a
         * @param b
         * @param c
         * @param d
         * @param tx
         * @param ty
         * @returns {ns_egret.Matrix}
         */
        append(a, b, c, d, tx, ty) {
            var a1 = this.a;
            var b1 = this.b;
            var c1 = this.c;
            var d1 = this.d;

            this.a = a * a1 + b * c1;
            this.b = a * b1 + b * d1;
            this.c = c * a1 + d * c1;
            this.d = c * b1 + d * d1;
            this.tx = tx * a1 + ty * c1 + this.tx;
            this.ty = tx * b1 + ty * d1 + this.ty;
            return this;
        }


        /**
         * 前置矩阵
         * @param matrix
         * @returns {ns_egret.Matrix}
         */
        prependMatrix(matrix) {
            this.prepend(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
//        this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
            return this;
        }


        /**
         * 后置矩阵
         * @param matrix
         * @returns {ns_egret.Matrix}
         */
        appendMatrix(matrix) {
            this.append(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty);
//        this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
            return this;
        }


        /**
         * 前置矩阵
         * @param matrix
         * @returns {ns_egret.Matrix}
         */
        prependTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
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
         * @param matrix
         * @returns {ns_egret.Matrix}
         */
        appendTransform(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
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

        public appendTransformFromDisplay(target:ns_egret.DisplayObject) {
            var o = target;
            var anchorX,anchorY;
            if(o.anchorX != 0 || o.anchorY != 0)
            {
                var bounds = o.getBounds();
                anchorX = bounds.width * o.anchorX;
                anchorY = bounds.height * o.anchorY;
            }
            else
            {
                anchorX = o.pivotOffsetX;
                anchorY = o.pivotOffsetY;
            }
            this.identity();
            this.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation,
                o.skewX, o.skewY, anchorX, anchorY);
            return this;
        }


        /**
         * 矩阵旋转，以角度制为单位
         * @param angle
         * @returns {ns_egret.Matrix}
         */
        rotate(angle) {
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
         * @param skewX
         * @param skewY
         * @returns {ns_egret.Matrix}
         */
        skew(skewX, skewY) {
            skewX = skewX * Matrix.DEG_TO_RAD;
            skewY = skewY * Matrix.DEG_TO_RAD;
            this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
            return this;
        }


        /**
         * 矩阵缩放
         * @param x
         * @param y
         * @returns {ns_egret.Matrix}
         */
        scale(x, y) {
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
         * @param x
         * @param y
         * @returns {ns_egret.Matrix}
         */
        translate(x, y) {
            this.tx += x;
            this.ty += y;
            return this;
        }


        /**
         * 矩阵重置
         * @returns {ns_egret.Matrix}
         */
        identity() {
            this.a = this.d = 1;
            this.b = this.c = this.tx = this.ty = 0;
            return this;
        }


        /**
         * 矩阵翻转
         */
        invert = function () {
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
        };


        isIdentity() {
            return this.tx == 0 && this.ty == 0 && this.a == 1 && this.b == 0 && this.c == 0 && this.d == 1;
        }


        transformPoint(x, y, pt) {
            pt = pt || {};
            pt.x = x * this.a + y * this.c + this.tx;
            pt.y = x * this.b + y * this.d + this.ty;
            return pt;
        }


        decompose(target) {
            // TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
            // even when scale is negative
            if (target == null) {
                target = {};
            }
            target.x = this.tx;
            target.y = this.ty;
            target.scaleX = Math.sqrt(this.a * this.a + this.b * this.b);
            target.scaleY = Math.sqrt(this.c * this.c + this.d * this.d);

            var skewX = Math.atan2(-this.c, this.d);
            var skewY = Math.atan2(this.b, this.a);

            if (skewX == skewY) {
                target.rotation = skewY / Matrix.DEG_TO_RAD;
                if (this.a < 0 && this.d >= 0) {
                    target.rotation += (target.rotation <= 0) ? 180 : -180;
                }
                target.skewX = target.skewY = 0;
            } else {
                target.skewX = skewX / Matrix.DEG_TO_RAD;
                target.skewY = skewY / Matrix.DEG_TO_RAD;
            }
            return target;
        }


//        copy(matrix) {
//            return null;
//        return this.initialize(matrix.a, matrix.b, matrix.c, matrix.d, matrix.tx, matrix.ty, matrix.alpha, matrix.shadow, matrix.compositeOperation);
//        }


//    appendProperties = function(alpha, shadow, compositeOperation) {
//        this.alpha *= alpha;
//        this.shadow = shadow || this.shadow;
//        this.compositeOperation = compositeOperation || this.compositeOperation;
//        return this;
//    };
//
//
//    prependProperties (alpha, shadow, compositeOperation) {
//        this.alpha *= alpha;
//        this.shadow = this.shadow || shadow;
//        this.compositeOperation = this.compositeOperation || compositeOperation;
//        return this;
//    };


//    p.clone = function() {
//        return (new Matrix()).copy(this);
//    };
//
//
//    p.toString = function() {
//        return "[Matrix (a="+this.a+" b="+this.b+" c="+this.c+" d="+this.d+" tx="+this.tx+" ty="+this.ty+")]";
//    };

        // this has to be populated after the class is defined:


        /**
         * 根据一个矩阵，返回某个点在该矩阵上的坐标
         * @param matrix
         * @param x
         * @param y
         * @returns {Point}
         * @stable C 该方法以后可能删除
         */
        static transformCoords(matrix:Matrix, x:number, y:number) {
            var resultPoint:Point = new Point(0, 0);//todo;
            resultPoint.x = matrix.a * x + matrix.c * y + matrix.tx;
            resultPoint.y = matrix.d * y + matrix.b * x + matrix.ty;

//        resultPoint.x = matrix.a * x + matrix.c * y - matrix.tx;
//        resultPoint.y = matrix.d * y + matrix.b * x - matrix.ty;
            return resultPoint;
        }
    }
}