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
     * @class egret.Point
     * @classdesc
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @extends egret.HashObject
     */
    export class Point extends HashObject {

        public static identity:Point = new Point(0, 0);

        /**
         * 创建一个 egret.Point 对象
         * @method egret.Point#constructor
         * @param x {number} 该对象的x属性值，默认为0
         * @param y {number} 该对象的y属性值，默认为0
         */
        public constructor(x:number = 0, y:number = 0) {
            super();
            this.x = x;
            this.y = y;
        }

        /**
         * 该点的水平坐标。默认值为 0。
         * @constant {number} egret.Point#x
         */
        public x:number;
        /**
         * 该点的垂直坐标。默认值为 0。
         * @constant {number} egret.Point#y
         */
        public y:number;

        /**
         * 克隆点对象
         * @method egret.Point#clone
         * @returns {egret.Point}
         */
        public clone():Point {
            return new Point(this.x, this.y);
        }


        /**
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @method egret.Point#equals
         * @param {egret.Point} toCompare 要比较的点。
         * @returns {boolean} 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         */
        public equals(toCompare:Point):boolean {
            return this.x == toCompare.x && this.y == toCompare.y;
        }

        /**
         * 返回 pt1 和 pt2 之间的距离。
         * @method egret.Point#distance
         * @param p1 {egret.Point} 第一个点
         * @param p2 {egret.Point} 第二个点
         * @returns {number} 第一个点和第二个点之间的距离。
         */
        public static distance(p1:egret.Point, p2:egret.Point):number {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y))
        }

        /**
         * 将 Point 的成员设置为指定值
         * @method egret.Point#setTo
         * @param xa {number} 要将 Point 设置为的值
         * @param ya {number} 要将 Point 设置为的值
         */
        public setTo(xa:number, ya:number):void {
            this.x = xa;
            this.y = ya;
        }

        /**
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @method egret.Point#copyFrom
         * @param sourcePoint {egret.Point} 要从中复制数据的 Point 对象
         */
        public copyFrom(sourcePoint:Point):void {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        }

        /**
         * 从 (0,0) 到此点的线段长度。
         * @method egret.Point#length
         */
        public get length():number {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }

        /**
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @method egret.Point#add
         * @param v {egret.Point} 要添加的点。
         * @returns {egret.Point} 新点。
         */
        public add(v:Point):Point {
            return new Point(this.x + v.x, this.y + v.y);
        }

        /**
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @method egret.Point.interpolate
         * @param pt1 {egret.Point} 第一个点。
         * @param pt2 {egret.Point} 第二个点。
         * @param f {number} 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns {egret.Point} 新的内插点。
         */
        public static interpolate(pt1:Point, pt2:Point, f:number):Point {
            var f1:number = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        }

        /**
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @method egret.Point#normalize
         * @param thickness {number} 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         */
        public normalize(thickness:number):void {
            if (this.x != 0 || this.y != 0) {
                var relativeThickness:number = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        }

        /**
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @method egret.Point#offset
         * @param dx {number} 水平坐标 x 的偏移量。
         * @param dy {number} 水平坐标 y 的偏移量。
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * 将一对极坐标转换为笛卡尔点坐标。
         * @method egret.Point.polar
         * @param len {number} 极坐标对的长度。
         * @param angle {number} 极坐标对的角度（以弧度表示）。
         */
        public static polar(len:number, angle:number):Point {
            return new Point(len * NumberUtils.cos(angle / Matrix.DEG_TO_RAD), len * NumberUtils.sin(angle / Matrix.DEG_TO_RAD));
        }

        /**
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @method egret.Point#subtract
         * @param v {egret.Point} 要减去的点。
         * @returns {egret.Point} 新点。
         */
        public subtract(v:Point):Point {
            return new Point(this.x - v.x, this.y - v.y);
        }

        /**
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @method egret.Point#toString
         * @returns {string} 坐标的字符串表示形式。
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ")";
        }
    }
}