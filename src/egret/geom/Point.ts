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
         * @method egret.Point#copyForm
         * @param sourcePoint {egret.Point} 要从中复制数据的 Point 对象
         */
        public copyForm(sourcePoint:Point):void {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        }
    }
}