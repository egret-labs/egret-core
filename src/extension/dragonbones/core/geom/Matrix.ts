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


module dragonBones {
    /**
     * @class dragonBones.Matrix
     * @classdesc
     * Matrix 类表示一个转换矩阵，它确定如何将点从一个坐标空间映射到另一个坐标空间。您可以对一个显示对象执行不同的图形转换，方法是设置 Matrix 对象的属性，将该 Matrix 对象应用于 Transform 对象的 matrix 属性，然后应用该 Transform 对象作为显示对象的 transform 属性。这些转换函数包括平移（x 和 y 重新定位）、旋转、缩放和倾斜。
     * 这些转换类型统称为仿射转换。仿射转换在转换时保持线条笔直，因此平行线保持平行。
     * 转换矩阵对象为具有如下内容的 3 x 3 的矩阵：
     *  a  c  tx
     *  b  d  ty
     *  u  v  w
     * 在传统的转换矩阵中，u、v 和 w 属性具有其他功能。Matrix 类只能在二维空间中操作，因此始终假定属性值 u 和 v 为 0.0，属性值 w 为 1.0。矩阵的有效值如下：
     *  a  c  tx
     *  b  d  ty
     *  0  0  1
     * 您可以获取和设置 Matrix 对象的全部六个其他属性的值：a、b、c、d、tx 和 ty。
     * Matrix 类支持四种主要类型的转换：平移、缩放、旋转和倾斜。您可以使用特定的方法来设置这些转换的其中三个，如下表中所述：
     * 转换	              矩阵值                      说明
     * 平移（置换）	                            将图像 tx 像素向右移动，将 ty 像素向下移动。
     *                   1  0  tx
     *                   0  1  ty
     *                   0  0  1
     * 缩放                                     将每个像素的位置乘以 x 轴的 sx 和 y 轴的 sy，从而调整图像的大小。
     *                   Sx  0  0
     *                   0  Sy  0
     *                   0  0   1
     * 旋转                                     将图像旋转一个以弧度为单位的角度 q。
     *                   cos(q)  -sin(q)  0
     *                   sin(q)  cos(q)   0
     *                   0         0      1
     * 倾斜或剪切                               以平行于 x 轴或 y 轴的方向逐渐滑动图像。Matrix 对象的 b 属性表示斜角沿 y 轴的正切；Matrix 对象的 c 属性表示斜角沿 x 轴的正切。
     *                  0        tan(skewX) 0
     *                  tan(skewY)  0       0
     *                   0          0       1
     * 每个转换函数都将更改当前矩阵的属性，所以您可以有效地合并多个转换。为此，请先调用多个转换函数，再将矩阵应用于其显示对象目标（通过使用该显示对象的 transform 属性）。
     */
    export class Matrix {
        /**
         * 缩放或旋转图像时影响像素沿 x 轴定位的值。
         * @member {number} dragonBones.Matrix#a
         */
        public a:number;
        /**
         * 旋转或倾斜图像时影响像素沿 y 轴定位的值。
         * @member {number} dragonBones.Matrix#b
         */
        public b:number;
        /**
         *旋转或倾斜图像时影响像素沿 x 轴定位的值。
         * @member {number} dragonBones.Matrix#c
         */
        public c:number;
        /**
         *缩放或旋转图像时影响像素沿 y 轴定位的值。
         * @member {number} dragonBones.Matrix#d
         */
        public d:number;
        /**
         *沿 x 轴平移每个点的距离。
         * @member {number} dragonBones.Matrix#tx
         */
        public tx:number;
        /**
         *沿 y 轴平移每个点的距离。
         * @member {number} dragonBones.Matrix#ty
         */
        public ty:number;

        /**
         *构造函数，实例化一个Matrix，默认为是一个单位矩阵
         */
        constructor() {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.tx = 0;
            this.ty = 0;
        }

        /**
         *执行原始矩阵的逆转换。逆矩阵和单位矩阵相乘会得到的单位矩阵
         */
        public invert():void {
            var a1:number = this.a;
            var b1:number = this.b;
            var c1:number = this.c;
            var d1:number = this.d;
            var tx1:number = this.tx;
            var n:number = a1 * d1 - b1 * c1;

            this.a = d1 / n;
            this.b = -b1 / n;
            this.c = -c1 / n;
            this.d = a1 / n;
            this.tx = (c1 * this.ty - d1 * tx1) / n;
            this.ty = -(a1 * this.ty - b1 * tx1) / n;
        }

        /**
         *将某个矩阵与当前矩阵相乘，从而将这两个矩阵的几何效果有效地结合在一起。
         * 右乘，其几何意义是将两次几何变换变成一次
         * @param m
         */
        public concat(m:Matrix):void
        {
            var ma = m.a;
            var mb = m.b;
            var mc = m.c;
            var md = m.d;
            var tx1 = this.tx;
            var ty1 = this.ty;

            if (ma != 1 || mb != 0 || mc != 0 || md != 1) {
                var a1 = this.a;
                var b1 = this.b;
                var c1 = this.c;
                var d1 = this.d;

                this.a = a1 * ma + b1 * mc;
                this.b = a1 * mb + b1 * md;
                this.c = c1 * ma + d1 * mc;
                this.d = c1 * mb + d1 * md;
            }
            this.tx = tx1 * ma + ty1 * mc + m.tx;
            this.ty = tx1 * mb + ty1 * md + m.ty;
        }

        public copyFrom(m:Matrix):void
        {
            this.tx = m.tx;
            this.ty = m.ty;
            this.a = m.a;
            this.b = m.b;
            this.c = m.c;
            this.d = m.d;
        }
    }
}
