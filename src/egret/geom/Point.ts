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

    var pointPool:Point[] = [];
    var DEG_TO_RAD:number = Math.PI / 180;

    /**
     * @language en_US
     * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal
     * axis and y represents the vertical axis.
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    /**
     * @language zh_CN
     * Point 对象表示二维坐标系统中的某个位置，其中 x 表示水平轴，y 表示垂直轴。
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/geom/Point.ts
     */
    export class Point extends HashObject {

        /**
         * @language en_US
         * Releases a point instance to the object pool
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 释放一个Point实例到对象池
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static release(point:Point):void {
            if(!point){
                return;
            }
            pointPool.push(point);
        }

        /**
         * @language en_US
         * get a point instance from the object pool or create a new one.
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从对象池中取出或创建一个新的Point对象。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static create(x:number,y:number):Point {
            var point = pointPool.pop();
            if (!point) {
                point = new Point();
            }
            return point.setTo(x,y);
        }
        /**
         * @language en_US
         * Creates a new point. If you pass no parameters to this method, a point is created at (0,0).
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个 egret.Point 对象.若不传入任何参数，将会创建一个位于（0，0）位置的点。
         * @param x 该对象的x属性值，默认为0
         * @param y 该对象的y属性值，默认为0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor(x:number = 0, y:number = 0) {
            super();
            this.x = x;
            this.y = y;
        }

        /**
         * @language en_US
         * The horizontal coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该点的水平坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public x:number;
        /**
         * @language en_US
         * The vertical coordinate.
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 该点的垂直坐标。
         * @default 0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public y:number;

        /**
         * @language en_US
         * The length of the line segment from (0,0) to this point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从 (0,0) 到此点的线段长度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get length():number{
            return Math.sqrt(this.x*this.x+this.y*this.y);
        }
        /**
         * @language en_US
         * Sets the members of Point to the specified values
         * @param x The horizontal coordinate.
         * @param y The vertical coordinate.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 Point 的成员设置为指定值
         * @param x 该对象的x属性值
         * @param y 该对象的y属性值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public setTo(x:number, y:number):Point {
            this.x = x;
            this.y = y;
            return this;
        }

        /**
         * @language en_US
         * Creates a copy of this Point object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 克隆点对象
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clone():Point {
            return new Point(this.x, this.y);
        }


        /**
         * @language en_US
         * Determines whether two points are equal. Two points are equal if they have the same x and y values.
         * @param toCompare The point to be compared.
         * @returns A value of true if the object is equal to this Point object; false if it is not equal.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个点是否相同。如果两个点具有相同的 x 和 y 值，则它们是相同的点。
         * @param toCompare 要比较的点。
         * @returns 如果该对象与此 Point 对象相同，则为 true 值，如果不相同，则为 false。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public equals(toCompare:Point):boolean {
            return this.x == toCompare.x && this.y == toCompare.y;
        }

        /**
         * @language en_US
         * Returns the distance between pt1 and pt2.
         * @param p1 The first point.
         * @param p2 The second point.
         * @returns The distance between the first and second points.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回 pt1 和 pt2 之间的距离。
         * @param p1 第一个点
         * @param p2 第二个点
         * @returns 第一个点和第二个点之间的距离。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static distance(p1:Point, p2:Point):number {
            return Math.sqrt((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
        }

        /**
         * @language en_US
         * Copies all of the point data from the source Point object into the calling Point object.
         * @param sourcePoint The Point object from which to copy the data.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将源 Point 对象中的所有点数据复制到调用方 Point 对象中。
         * @param sourcePoint 要从中复制数据的 Point 对象。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public copyFrom(sourcePoint:Point):void {
            this.x = sourcePoint.x;
            this.y = sourcePoint.y;
        }

        /**
         * @language en_US
         * Adds the coordinates of another point to the coordinates of this point to create a new point.
         * @param v The point to be added.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将另一个点的坐标添加到此点的坐标以创建一个新点。
         * @param v 要添加的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public add(v:Point):Point {
            return new Point(this.x + v.x, this.y + v.y);
        }

        /**
         * @language en_US
         * Determines a point between two specified points.
         * The parameter f determines where the new interpolated point is located relative to the two end points specified by parameters pt1 and pt2. The closer the value of the parameter f is to 1.0, the closer the interpolated point is to the first point (parameter pt1). The closer the value of the parameter f is to 0, the closer the interpolated point is to the second point (parameter pt2).
         * @param pt1 The first point.
         * @param pt2 The second point.
         * @param f The level of interpolation between the two points. Indicates where the new point will be, along the line between pt1 and pt2. If f=1, pt1 is returned; if f=0, pt2 is returned.
         * @returns The new interpolated point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 确定两个指定点之间的点。
         * 参数 f 确定新的内插点相对于参数 pt1 和 pt2 指定的两个端点所处的位置。参数 f 的值越接近 1.0，则内插点就越接近第一个点（参数 pt1）。参数 f 的值越接近 0，则内插点就越接近第二个点（参数 pt2）。
         * @param pt1 第一个点。
         * @param pt2 第二个点。
         * @param f 两个点之间的内插级别。表示新点将位于 pt1 和 pt2 连成的直线上的什么位置。如果 f=1，则返回 pt1；如果 f=0，则返回 pt2。
         * @returns 新的内插点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static interpolate(pt1:Point, pt2:Point, f:number):Point {
            var f1:number = 1 - f;
            return new Point(pt1.x * f + pt2.x * f1, pt1.y * f + pt2.y * f1);
        }

        /**
         * @language en_US
         * Scales the line segment between (0,0) and the current point to a set length.
         * @param thickness The scaling value. For example, if the current point is (0,5), and you normalize it to 1, the point returned is at (0,1).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将 (0,0) 和当前点之间的线段缩放为设定的长度。
         * @param thickness 缩放值。例如，如果当前点为 (0,5) 并且您将它规范化为 1，则返回的点位于 (0,1) 处。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public normalize(thickness:number):void {
            if (this.x != 0 || this.y != 0) {
                var relativeThickness:number = thickness / this.length;
                this.x *= relativeThickness;
                this.y *= relativeThickness;
            }
        }

        /**
         * @language en_US
         * Offsets the Point object by the specified amount. The value of dx is added to the original value of x to create the new x value. The value of dy is added to the original value of y to create the new y value.
         * @param dx The amount by which to offset the horizontal coordinate, x.
         * @param dy The amount by which to offset the vertical coordinate, y.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 按指定量偏移 Point 对象。dx 的值将添加到 x 的原始值中以创建新的 x 值。dy 的值将添加到 y 的原始值中以创建新的 y 值。
         * @param dx 水平坐标 x 的偏移量。
         * @param dy 水平坐标 y 的偏移量。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public offset(dx:number, dy:number):void {
            this.x += dx;
            this.y += dy;
        }

        /**
         * @language en_US
         * Converts a pair of polar coordinates to a Cartesian point coordinate.
         * @param len The length coordinate of the polar pair.
         * @param angle The angle, in radians, of the polar pair.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一对极坐标转换为笛卡尔点坐标。
         * @param len 极坐标对的长度。
         * @param angle 极坐标对的角度（以弧度表示）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static polar(len:number, angle:number):Point {
            return new Point(len * NumberUtils.cos(angle / DEG_TO_RAD), len * NumberUtils.sin(angle / DEG_TO_RAD));
        }

        /**
         * @language en_US
         * Subtracts the coordinates of another point from the coordinates of this point to create a new point.
         * @param v The point to be subtracted.
         * @returns The new point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从此点的坐标中减去另一个点的坐标以创建一个新点。
         * @param v 要减去的点。
         * @returns 新点。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public subtract(v:Point):Point {
            return new Point(this.x - v.x, this.y - v.y);
        }

        /**
         * @language en_US
         * Returns a string that contains the values of the x and y coordinates. The string has the form "(x=x, y=y)", so calling the toString() method for a point at 23,17 would return "(x=23, y=17)".
         * @returns The string representation of the coordinates.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 返回包含 x 和 y 坐标的值的字符串。该字符串的格式为 "(x=x, y=y)"，因此为点 23,17 调用 toString() 方法将返回 "(x=23, y=17)"。
         * @returns 坐标的字符串表示形式。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public toString():string {
            return "(x=" + this.x + ", y=" + this.y + ")";
        }
    }

    if(DEBUG){
        $markReadOnly(Point,"length")
    }
    /**
     * @private
     * 仅供框架内复用，要防止暴露引用到外部。
     */
    export var $TempPoint = new Point();

}