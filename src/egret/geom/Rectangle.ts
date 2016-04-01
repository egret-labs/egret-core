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

    var rectanglePool:Rectangle[] = [];
    /**
     * @language en_US
     * A Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its
     * width and its height.<br/>
     * The x, y, width, and height properties of the Rectangle class are independent of each other; changing the value of
     * one property has no effect on the others. However, the right and bottom properties are integrally related to those
     * four properties. For example, if you change the value of the right property, the value of the width property changes;
     * if you change the bottom property, the value of the height property changes.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    /**
     * @language zh_CN
     * Rectangle 对象是按其位置（由它左上角的点 (x, y) 确定）以及宽度和高度定义的区域。<br/>
     * Rectangle 类的 x、y、width 和 height 属性相互独立；更改一个属性的值不会影响其他属性。
     * 但是，right 和 bottom 属性与这四个属性是整体相关的。例如，如果更改 right 属性的值，则 width
     * 属性的值将发生变化；如果更改 bottom 属性，则 height 属性的值将发生变化。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Rectangle.ts
     */
    export class Rectangle extends HashObject {

        /**
         * @language en_US
         * Releases a rectangle instance to the object pool.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Rectangle实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(rect:Rectangle):void {
            if (!rect) {
                return;
            }
            rectanglePool.push(rect);
        }

        /**
         * @language en_US
         * get a rectangle instance from the object pool or create a new one.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Rectangle对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create():Rectangle {
            var rect = rectanglePool.pop();
            if (!rect) {
                rect = new Rectangle();
            }
            return rect;
        }

        /**
         * @language en_US
         * Creates a new Rectangle object with the top-left corner specified by the x and y parameters and with the specified
         * width and height parameters.
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个新 Rectangle 对象，其左上角由 x 和 y 参数指定，并具有指定的 width 和 height 参数。
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(x:number = 0, y:number = 0, width:number = 0, height:number = 0) {
            super();
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        /**
         * @language en_US
         * The x coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 x 坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public x:number;
        /**
         * @language en_US
         * The y coordinate of the top-left corner of the rectangle.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 y 坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public y:number;
        /**
         * @language en_US
         * The width of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形的宽度（以像素为单位）。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public width:number;
        /**
         * @language en_US
         * 矩形的高度（以像素为单位）。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * The height of the rectangle, in pixels.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public height:number;

        /**
         * @language en_US
         * The sum of the x and width properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * x 和 width 属性的和。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get right():number {
            return this.x + this.width;
        }

        public set right(value:number) {
            this.width = value - this.x;
        }

        /**
         * @language en_US
         * The sum of the y and height properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * y 和 height 属性的和。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bottom():number {
            return this.y + this.height;
        }

        public set bottom(value:number) {
            this.height = value - this.y;
        }

        /**
         * @language en_US
         * The x coordinate of the top-left corner of the rectangle. Changing the left property of a Rectangle object has
         * no effect on the y and height properties. However it does affect the width property, whereas changing the x value
         * does not affect the width property.
         * The value of the left property is equal to the value of the x property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 x 坐标。更改 Rectangle 对象的 left 属性对 y 和 height 属性没有影响。但是，它会影响 width 属性，而更改 x 值不会影响 width 属性。
         * left 属性的值等于 x 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get left():number {
            return this.x;
        }

        public set left(value:number) {
            this.width += this.x - value;
            this.x = value;
        }

        /**
         * @language en_US
         * The y coordinate of the top-left corner of the rectangle. Changing the top property of a Rectangle object has
         * no effect on the x and width properties. However it does affect the height property, whereas changing the y
         * value does not affect the height property.<br/>
         * The value of the top property is equal to the value of the y property.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 矩形左上角的 y 坐标。更改 Rectangle 对象的 top 属性对 x 和 width 属性没有影响。但是，它会影响 height 属性，而更改 y 值不会影响 height 属性。<br/>
         * top 属性的值等于 y 属性的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get top():number {
            return this.y;
        }

        public set top(value:number) {
            this.height += this.y - value;
            this.y = value;
        }

        /**
         * @language en_US
         * The location of the Rectangle object's top-left corner, determined by the x and y coordinates of the point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由该点的 x 和 y 坐标确定的 Rectangle 对象左上角的位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get topLeft():Point {
            return new Point(this.left, this.top);
        }

        public set topLeft(value:Point) {
            this.top = value.y;
            this.left = value.x;
        }

        /**
         * @language en_US
         * The location of the Rectangle object's bottom-right corner, determined by the values of the right and bottom properties.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 由 right 和 bottom 属性的值确定的 Rectangle 对象的右下角的位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get bottomRight():Point {
            return new Point(this.right, this.bottom);
        }

        public set bottomRight(value:Point) {
            this.bottom = value.y;
            this.right = value.x;
        }

        /**
         * @language en_US
         * Copies all of rectangle data from the source Rectangle object into the calling Rectangle object.
         * @param sourceRect The Rectangle object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Rectangle 对象中的所有矩形数据复制到调用方 Rectangle 对象中。
         * @param sourceRect 要从中复制数据的 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public copyFrom(sourceRect:Rectangle):Rectangle {
            this.x = sourceRect.x;
            this.y = sourceRect.y;
            this.width = sourceRect.width;
            this.height = sourceRect.height;
            return this;
        }

        /**
         * @language en_US
         * Sets the members of Rectangle to the specified values
         * @param x The x coordinate of the top-left corner of the rectangle.
         * @param y The y coordinate of the top-left corner of the rectangle.
         * @param width The width of the rectangle, in pixels.
         * @param height The height of the rectangle, in pixels.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 的成员设置为指定值
         * @param x 矩形左上角的 x 坐标。
         * @param y 矩形左上角的 y 坐标。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setTo(x:number, y:number, width:number, height:number):Rectangle {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            return this;
        }

        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * @param x The x coordinate (horizontal position) of the point.
         * @param y The y coordinate (vertical position) of the point.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * @param x 检测点的x轴
         * @param y 检测点的y轴
         * @returns 如果检测点位于矩形内，返回true，否则，返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public contains(x:number, y:number):boolean {
            return this.x <= x &&
                this.x + this.width >= x &&
                this.y <= y &&
                this.y + this.height >= y;
        }

        /**
         * @language en_US
         * If the Rectangle object specified in the toIntersect parameter intersects with this Rectangle object, returns
         * the area of intersection as a Rectangle object. If the rectangles do not intersect, this method returns an empty
         * Rectangle object with its properties set to 0.
         * @param toIntersect The Rectangle object to compare against to see if it intersects with this Rectangle object.
         * @returns A Rectangle object that equals the area of intersection. If the rectangles do not intersect, this method
         * returns an empty Rectangle object; that is, a rectangle with its x, y, width, and height properties set to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 如果在 toIntersect 参数中指定的 Rectangle 对象与此 Rectangle 对象相交，则返回交集区域作为 Rectangle 对象。如果矩形不相交，
         * 则此方法返回一个空的 Rectangle 对象，其属性设置为 0。
         * @param toIntersect 要对照比较以查看其是否与此 Rectangle 对象相交的 Rectangle 对象。
         * @returns 等于交集区域的 Rectangle 对象。如果该矩形不相交，则此方法返回一个空的 Rectangle 对象；即，其 x、y、width 和
         * height 属性均设置为 0 的矩形。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public intersection(toIntersect: Rectangle): Rectangle {
            return this.clone().$intersectInPlace(toIntersect);
        }

        /**
         * @language en_US
         * Increases the size of the Rectangle object by the specified amounts, in pixels.
         * The center point of the Rectangle object stays the same, and its size increases to the left and right by the dx value, and to the top and the bottom by the dy value.
         * @param dx The value to be added to the left and the right of the Rectangle object.
         * @param dy The value to be added to the top and the bottom of the Rectangle.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量增加 Rectangle 对象的大小（以像素为单位）
         * 保持 Rectangle 对象的中心点不变，使用 dx 值横向增加它的大小，使用 dy 值纵向增加它的大小。
         * @param dx Rectangle 对象横向增加的值。
         * @param dy Rectangle 对象纵向增加的值。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public inflate(dx:number, dy:number):void {
            this.x -= dx;
            this.width += 2 * dx;
            this.y -= dy;
            this.height += 2 * dy;
        }

        /**
         * @private
         */
        $intersectInPlace(clipRect: Rectangle): Rectangle {
            var x0 = this.x;
            var y0 = this.y;
            var x1 = clipRect.x;
            var y1 = clipRect.y;
            var l = Math.max(x0, x1);
            var r = Math.min(x0 + this.width, x1 + clipRect.width);
            if (l <= r) {
                var t = Math.max(y0, y1);
                var b = Math.min(y0 + this.height, y1 + clipRect.height);
                if (t <= b) {
                    this.setTo(l, t, r - l, b - t);
                    return this;
                }
            }
            this.setEmpty();
            return this;
        }

        /**
         * @language en_US
         * Determines whether the object specified in the toIntersect parameter intersects with this Rectangle object.
         * This method checks the x, y, width, and height properties of the specified Rectangle object to see if it
         * intersects with this Rectangle object.
         * @param toIntersect The Rectangle object to compare against this Rectangle object.
         * @returns A value of true if the specified object intersects with this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toIntersect 参数中指定的对象是否与此 Rectangle 对象相交。此方法检查指定的 Rectangle
         * 对象的 x、y、width 和 height 属性，以查看它是否与此 Rectangle 对象相交。
         * @param toIntersect 要与此 Rectangle 对象比较的 Rectangle 对象。
         * @returns 如果两个矩形相交，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
         */
        public intersects(toIntersect:Rectangle):boolean {
            return Math.max(this.x, toIntersect.x) <= Math.min(this.right, toIntersect.right)
                && Math.max(this.y, toIntersect.y) <= Math.min(this.bottom, toIntersect.bottom);
        }

        /**
         * @language en_US
         * Determines whether or not this Rectangle object is empty.
         * @returns A value of true if the Rectangle object's width or height is less than or equal to 0; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象是否为空。
         * @returns 如果 Rectangle 对象的宽度或高度小于等于 0，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public isEmpty():boolean {
            return this.width <= 0 || this.height <= 0;
        }

        /**
         * @language en_US
         * Sets all of the Rectangle object's properties to 0. A Rectangle object is empty if its width or height is less than or equal to 0.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Rectangle 对象的所有属性设置为 0。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setEmpty():void {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }

        /**
         * @language en_US
         * Returns a new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @returns A new Rectangle object with the same values for the x, y, width, and height properties as the original Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回一个新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @returns 新的 Rectangle 对象，其 x、y、width 和 height 属性的值与原始 Rectangle 对象的对应值相同。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone():Rectangle {
            return new Rectangle(this.x, this.y, this.width, this.height);
        }

        /**
         * @language en_US
         * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
         * This method is similar to the Rectangle.contains() method, except that it takes a Point object as a parameter.
         * @param point The point, as represented by its x and y coordinates.
         * @returns A value of true if the Rectangle object contains the specified point; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定由此 Rectangle 对象定义的矩形区域内是否包含指定的点。
         * 此方法与 Rectangle.contains() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 包含点对象
         * @returns 如果包含，返回true，否则返回false
         * @version Egret 2.4
         * @platform Web,Native
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
         * @language en_US
         * Determines whether the Rectangle object specified by the rect parameter is contained within this Rectangle object.
         * A Rectangle object is said to contain another if the second Rectangle object falls entirely within the boundaries of the first.
         * @param rect The Rectangle object being checked.
         * @returns A value of true if the Rectangle object that you specify is contained by this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定此 Rectangle 对象内是否包含由 rect 参数指定的 Rectangle 对象。
         * 如果一个 Rectangle 对象完全在另一个 Rectangle 的边界内，我们说第二个 Rectangle 包含第一个 Rectangle。
         * @param rect 所检查的 Rectangle 对象
         * @returns 如果此 Rectangle 对象包含您指定的 Rectangle 对象，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public containsRect(rect:egret.Rectangle):boolean {
            var r1 = rect.x + rect.width;
            var b1 = rect.y + rect.height;
            var r2 = this.x + this.width;
            var b2 = this.y + this.height;
            return (rect.x >= this.x) && (rect.x < r2) && (rect.y >= this.y) && (rect.y < b2) && (r1 > this.x) && (r1 <= r2) && (b1 > this.y) && (b1 <= b2);
        }

        /**
         * @language en_US
         * Determines whether the object specified in the toCompare parameter is equal to this Rectangle object.
         * This method compares the x, y, width, and height properties of an object against the same properties of this Rectangle object.
         * @param The rectangle to compare to this Rectangle object.
         * @returns A value of true if the object has exactly the same values for the x, y, width, and height properties as this Rectangle object; otherwise false.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定在 toCompare 参数中指定的对象是否等于此 Rectangle 对象。
         * 此方法将某个对象的 x、y、width 和 height 属性与此 Rectangle 对象所对应的相同属性进行比较。
         * @param toCompare 要与此 Rectangle 对象进行比较的矩形。
         * @returns 如果对象具有与此 Rectangle 对象完全相同的 x、y、width 和 height 属性值，则返回 true 值，否则返回 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public equals(toCompare:Rectangle):boolean {
            if (this === toCompare) {
                return true;
            }
            return this.x === toCompare.x && this.y === toCompare.y
                && this.width === toCompare.width && this.height === toCompare.height;
        }

        /**
         * @language en_US
         * Increases the size of the Rectangle object. This method is similar to the Rectangle.inflate() method except it takes a Point object as a parameter.
         * @param point 此 Point 对象的 x 属性用于增加 Rectangle 对象的水平尺寸。y 属性用于增加 Rectangle 对象的垂直尺寸。
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 增加 Rectangle 对象的大小。此方法与 Rectangle.inflate() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point The x property of this Point object is used to increase the horizontal dimension of the Rectangle object. The y property is used to increase the vertical dimension of the Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        public inflatePoint(point:Point):void {
            this.inflate(point.x, point.y);
        }

        /**
         * @language en_US
         * Adjusts the location of the Rectangle object, as determined by its top-left corner, by the specified amounts.
         * @param dx Moves the x value of the Rectangle object by this amount.
         * @param dy Moves the y value of the Rectangle object by this amount.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量调整 Rectangle 对象的位置（由其左上角确定）。
         * @param dx 将 Rectangle 对象的 x 值移动此数量。
         * @param dy 将 Rectangle 对象的 t 值移动此数量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * @language en_US
         * Adjusts the location of the Rectangle object using a Point object as a parameter. This method is similar to the Rectangle.offset() method, except that it takes a Point object as a parameter.
         * @param point A Point object to use to offset this Rectangle object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 对象用作参数来调整 Rectangle 对象的位置。此方法与 Rectangle.offset() 方法类似，只不过它采用 Point 对象作为参数。
         * @param point 要用于偏移此 Rectangle 对象的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offsetPoint(point:Point):void {
            this.offset(point.x, point.y);
        }

        /**
         * @language en_US
         * Builds and returns a string that lists the horizontal and vertical positions and the width and height of the Rectangle object.
         * @returns A string listing the value of each of the following properties of the Rectangle object: x, y, width, and height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 生成并返回一个字符串，该字符串列出 Rectangle 对象的水平位置和垂直位置以及高度和宽度。
         * @returns 一个字符串，它列出了 Rectangle 对象的下列各个属性的值：x、y、width 和 height。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ", width=" + this.width + ", height=" + this.height + ")";
        }

        /**
         * @language en_US
         * Adds two rectangles together to create a new Rectangle object, by filling in the horizontal and vertical space between the two rectangles.
         * @param toUnion A Rectangle object to add to this Rectangle object.
         * @returns A new Rectangle object that is the union of the two rectangles.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 通过填充两个矩形之间的水平和垂直空间，将这两个矩形组合在一起以创建一个新的 Rectangle 对象。
         * @param toUnion 要添加到此 Rectangle 对象的 Rectangle 对象。
         * @returns 充当两个矩形的联合的新 Rectangle 对象。
         * @version Egret 2.4
         * @platform Web,Native
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

        /**
         * @private
         */
        $getBaseWidth(angle:number):number {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return u * this.width + v * this.height;
        }

        /**
         * @private
         */
        $getBaseHeight(angle:number):number {
            var u = Math.abs(Math.cos(angle));
            var v = Math.abs(Math.sin(angle));
            return v * this.width + u * this.height;
        }
    }

    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    export var $TempRectangle = new Rectangle();
}