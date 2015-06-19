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
         * 矩形左上角的 x 坐标。
         * @member {number} egret.Rectangle#left
         */
        public get left(): number {
            return this.x;
        }

        public set left(value: number) {
            this.width += this.x - value;
            this.x = value;
        }

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
         * 矩形左上角的 y 坐标。
         * @member {number} egret.Rectangle#top
         */
        public get top(): number {
            return this.y;
        }

        public set top(value: number) {
            this.height += this.y - value;
            this.y = value;
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
         * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
         * @member {number} egret.Rectangle#topLeft
         */
        public get topLeft():Point {
            return new Point(this.left, this.top);
        }

        public set topLeft(value:Point) {
            this.top = value.y;
            this.left = value.x;
        }

        /**
         * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
         * @member {number} egret.Rectangle#bottomRight
         */
        public get bottomRight():Point {
            return new Point(this.right, this.bottom);
        }

        public set bottomRight(value:Point) {
            this.bottom = value.y;
            this.right = value.x;
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

        public setEmpty():void {
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

        /**
         * 将 Rectangle 的成员设置为指定值
         * @method egret.Rectangle#setTo
         * @param xa {number} 要将 Rectangle 设置为的值
         * @param ya {number} 要将 Rectangle 设置为的值
         * @param widtha {number} 要将 Rectangle 设置为的值
         * @param heighta {number} 要将 Rectangle 设置为的值
         */
        public setTo(xa:number, ya:number, widtha:number, heighta:number):void {
            this.initialize(xa, ya, widtha, heighta);
        }

        /**
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中
         * @method egret.Rectangle#copyFrom
         * @param sourceRect {egret.Rectangle} 要从中复制数据的 Rectangle 对象
         */
        public copyFrom(sourceRect:Rectangle):void {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
        }

        /**
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @method egret.Rectangle#inflate
         * @param dx {number} Rectangle 对象横向增加的值。
         * @param dy {number} Rectangle 对象纵向增加的值。
         */
        public inflate(dx:number, dy:number):void {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        }

        /**
         * 确定此 Rectangle 对象是否为空
         * @method egret.Rectangle#isEmpty
         * @returns {boolean} 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false
         */
        public isEmpty():boolean {
            return this.width == 0 || this.height == 0;
        }

        /**
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @method egret.Rectangle#containsRect
         * @param rect {egret.Rectangle} 所检查的 Rectangle 对象
         * @returns {boolean} 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         */
        public containsRect(rect:egret.Rectangle):boolean {
            var r1 = rect.x + rect.width;
            var b1 = rect.y + rect.height;
            var r2 = this.x + this.width;
            var b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        }

        /**
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @method egret.Rectangle#equals
         * @param toCompare {egret.Rectangle} 要与此 Rectangle 对象进行比较的矩形
         * @returns {boolean} 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         */
        public equals(toCompare:Rectangle):boolean {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        }

        /**
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#inflatePoint
         * @param point {egret.Point} 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
         */
        public inflatePoint(point:Point):void {
            this.inflate(point.x, point.y);
        }

        /**
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。
         * 如果矩形不相交，则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @method egret.Rectangle#intersection
         * @param toIntersect {egret.Rectangle} 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns {egret.Rectangle} 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和 height 属性均设置为 0 的矩形。
         */
        public intersection(toIntersect:Rectangle):Rectangle {
            var result:Rectangle = this.clone();
            var x0:number = result.x;
            var y0:number = result.y;
            var x1:number = toIntersect.x;
            var y1:number = toIntersect.y;
            var l:number = Math.max(x0, x1);
            var r:number = Math.min(x0 + result.width, x1 + toIntersect.width);
            if (l <= r) {
                var t:number = Math.max(y0, y1);
                var b:number = Math.min(y0 + result.height, y1 + toIntersect.height);
                if (t <= b) {
                    result.setTo(l, t, r - l, b - t);
                    return result;
                }
            }
            result.setEmpty();
            return result;
        }

        /**
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @method egret.Rectangle#offset
         * @param dx {number} 将 Rectangle 对象的 x 值移动此数量。
         * @param dy {number} 将 Rectangle 对象的 t 值移动此数量。
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @method egret.Rectangle#offsetPoint
         * @param point {egret.Point} 要用于偏移此 Rectangle 对象的 Point 对象。
         */
        public offsetPoint(point:Point):void {
            this.offset(point.x, point.y);
        }

        /**
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @method egret.Rectangle#toString
         * @returns {string} 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        }

        /**
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @method egret.Rectangle#union
         * @param toUnion {egret.Rectangle} 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns {egret.Rectangle} 充当两个矩形的联合的新 Rectangle 对象。
         */
        public union(toUnion:Rectangle):Rectangle {
            var result = this.clone();
            if (toUnion.isEmpty()) {
                return result;
            }
            if (result.isEmpty()) {
                result.copyFrom(toUnion);
                return result;
            }
            var l: number = Math.min(result.x, toUnion.x);
            var t: number = Math.min(result.y, toUnion.y);
            result.setTo(l, t,
                Math.max(result.right, toUnion.right) - l,
                Math.max(result.bottom, toUnion.bottom) - t);
            return result;
        }
    }
}