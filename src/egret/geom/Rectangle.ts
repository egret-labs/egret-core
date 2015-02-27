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
     * @class egret.Rectangle
     * @classdesc 矩形类
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @extends egret.HashObject
     * @link http://docs.egret-labs.org/post/manual/graphics/drawrect.html 绘制矩形
     */
    export class Rectangle extends HashObject {

        constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
            super();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * 矩形左上角的 x 坐标。
         * @constant {number} egret.Rectangle#x
         */
        public x:number;
        /**
         * 矩形左上角的 y 坐标。
         * @constant {number} egret.Rectangle#y
         */
        public y:number;
        /**
         * 矩形的宽度（以像素为单位）。
         * @member {number} egret.Rectangle#width
         */
        public width:number;
        /**
         * 矩形的高度（以像素为单位）。
         * @member {number} egret.Rectangle#height
         */
        public height:number;

        /**
         * x 和 width 属性的和。
         * @member {number} egret.Rectangle#right
         */
        public get right():number {
            return this.x + this.width;
        }

        public set right(value:number) {
            this.width = value - this.x;
        }

        /**
         * y 和 height 属性的和。
         * @member {number} egret.Rectangle#bottom
         */
        public get bottom():number {
            return this.y + this.height;
        }

        public set bottom(value:number) {
            this.height = value - this.y;
        }

        /**
         * 举行类初始化赋值，开发者尽量调用此方法复用Rectangle对象，而不是每次需要的时候都重新创建
         * @method egret.Rectangle#initialize
         * @param x {number} 矩形的x轴
         * @param y {number} 矩形的y轴
         * @param width {number} 矩形的宽度
         * @param height {number} 矩形的高度
         * @returns {egret.Rectangle}
         */
        public initialize(x:number, y:number, width:number, height:number):Rectangle {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        }

        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @method egret.Rectangle#contains
         * @param x {number} 检测点的x轴
         * @param y {number} 检测点的y轴
         * @returns {boolean} 如果检测点位于矩形内，返回true，否则，返回false
         */
        public contains(x:number, y:number):boolean {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        }

        /**
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @method egret.Rectangle#intersects
         * @param toIntersect {egret.Rectangle} 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns {boolean} 如果两个矩形相交，返回true，否则返回false
         */
        public intersects(toIntersect:Rectangle):boolean {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        }

        public setEmpty(): void {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }

        /**
         * 克隆矩形对象
         * @method egret.Rectangle#clone
         * @returns {egret.Rectangle} 返回克隆后的矩形
         */
        public clone():Rectangle {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * 引擎内部用于函数传递返回值的全局矩形对象，开发者请勿随意修改此对象
         * @member {egret.Rectangle} egret.Rectangle.identity
         */
        public static identity:Rectangle = new Rectangle(0, 0, 0, 0);

        /**
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#containsPoint
         * @param point {egret.Point} 包含点对象
         * @returns {boolean} 如果包含，返回true，否则返回false
         */
        public containsPoint(point:Point):boolean {
            if (this.x < point.x
                && this.x + this.width > point.x
                && this.y < point.y
                && this.y + this.height > point.y) {
                return true;
            }
            return false;
        }
    }
}