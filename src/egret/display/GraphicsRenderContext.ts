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

    var PI = Math.PI;
    var HalfPI = PI / 2;
    var PacPI = PI + HalfPI;
    var TwoPI = PI * 2;
    var vector = {x: 0, y: 0};
    var vector1 = {x: 0, y: 0};
    var vector3 = {x: 0, y: 0};

    /**
     * @private
     * 格式化弧线角度的值
     */
    function clampAngle(value):number {
        value %= PI * 2;
        if (value < 0) {
            value += PI * 2;
        }
        return value;
    }

    /**
     * @private
     * 两个点距离
     */
    function distance(x1:number, y1:number, x2:number, y2:number):number {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }

    /**
     * @private
     * 取两点之间的向量
     */
    function getVector(x1:number, y1:number, x2:number, y2:number, v:Vector):void {
        var l = distance(x1, y1, x2, y2);
        v.x = (x2 - x1) / l;
        v.y = (y2 - y1) / l;
    }

    /**
     * @private
     */
    interface Vector {
        x: number;
        y: number;
    }

    /**
     * @private
     * @language en_US
     * The Graphics class contains a set of methods that you can use to create a vector shape. the Shape object that support
     * drawing includes a graphics property that is a Graphics object. The following are among those helper functions provided
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    /**
     * @private
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。Shape是支持矢量绘制的显示对象。它含有一个 graphics 属性，该属性是一个 Graphics 对象。
     * @see egret.Shape
     * @version Egret 2.4
     * @platform Web,Native
     */
    export class GraphicsRenderContext extends HashObject {

        /**
         * @language en_US
         * creates a radial gradient given by the coordinates of the two circles represented by the parameters.
         * This method returns a radial GraphicsGradient.
         * @param x0 The x axis of the coordinate of the start circle.
         * @param y0 The y axis of the coordinate of the start circle.
         * @param r0 The radius of the start circle.
         * @param x1 The x axis of the coordinate of the end circle.
         * @param y1 The y axis of the coordinate of the end circle.
         * @param r1 The radius of the end circle.
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据参数确定的两个圆的坐标，创建一个放射性渐变。该方法返回一个放射性的 GraphicsGradient。
         * @param x0 开始圆形的 x 轴坐标。
         * @param y0 开始圆形的 y 轴坐标。
         * @param r0 开始圆形的半径。
         * @param x1 结束圆形的 x 轴坐标。
         * @param y1 结束圆形的 y 轴坐标。
         * @param r1 结束圆形的半径。
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static createRadialGradient(x0:number, y0:number, r0:number, x1:number, y1:number, r1:number):GraphicsGradient {
            return sys.sharedRenderContext.createRadialGradient(x0, y0, r0, x1, y1, r1);
        }

        /**
         * @language en_US
         * reates a gradient along the line given by the coordinates represented by the parameters.This method returns a linear GraphicsGradient.
         * @see egret.GraphicsGradient
         * @param x0 The x axis of the coordinate of the start point.
         * @param y0 The y axis of the coordinate of the start point.
         * @param x1 The x axis of the coordinate of the end point.
         * @param y1 The y axis of the coordinate of the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一个沿参数坐标指定的直线的渐变。该方法返回一个线性的 GraphicsGradient 对象。
         * @param x0 起点的 x 轴坐标。
         * @param y0 起点的 y 轴坐标。
         * @param x1 终点的 x 轴坐标。
         * @param y1 终点的 y 轴坐标。
         * @see egret.GraphicsGradient
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static createLinearGradient(x0:number, y0:number, x1:number, y1:number):GraphicsGradient {
            return sys.sharedRenderContext.createLinearGradient(x0, y0, x1, y1);
        }

        /**
         * @language en_US
         * creates a pattern using the specified image (BitmapData). It repeats the source in the directions specified by
         * the repetition argument. This method returns a GraphicsPattern.
         * @param bitmapData A BitmapData instance to be used as image to repeat.
         * @param repetition  indicating how to repeat the image. Possible values are:
         * "repeat" (both directions),
         * "repeat-x" (horizontal only),
         * "repeat-y" (vertical only), or
         * "no-repeat" (neither).
         * @see egret.GraphicsPattern
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 基于指定的源图象(BitmapData)创建一个模板，通过repetition参数指定源图像在什么方向上进行重复，返回一个GraphicsPattern对象。
         * @param bitmapData 做为重复图像源的 BitmapData 对象。
         * @param repetition 指定如何重复图像。
         * 可能的值有："repeat" (两个方向重复),"repeat-x" (仅水平方向重复),"repeat-y" (仅垂直方向重复),"no-repeat" (不重复).
         * @see egret.GraphicsPattern
         * @version Egret 2.4
         * @platform Web,Native
         */
        public static createPattern(bitmapData:BitmapData, repetition:string):GraphicsPattern {
            return sys.sharedRenderContext.createPattern(bitmapData, repetition);
        }

        /**
         * @private
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.reset();
        }

        /**
         * @private
         */
        private _fillStyle:any;

        /**
         * @language en_US
         * specifies the color or style to use inside shapes.
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置要在图形内部填充的颜色或样式
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get fillStyle():any {
            return this._fillStyle;
        }

        public set fillStyle(value:any) {
            if (typeof value == "number") {
                value = toColorString(value);
            }
            this._fillStyle = value;
            this.pushCommand(sys.GraphicsCommandType.fillStyle, arguments);
        }

        /**
         * @private
         */
        private _lineWidth:number;

        /**
         * @language en_US
         * sets the thickness of lines in pixels.
         * setting zero, negative, Infinity and NaN values are ignored
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置线条粗细，以像素为单位。设置为0，负数，Infinity 或 NaN 将会被忽略。
         * @default 1
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get lineWidth():number {
            return this._lineWidth;
        }

        public set lineWidth(value:number) {
            this._lineWidth = value;
            this.pushCommand(sys.GraphicsCommandType.lineWidth, arguments);
        }

        /**
         * @private
         */
        private _lineCap:string;

        /**
         * @language en_US
         * determines how the end points of every line are drawn. There are three possible values for this property and those are:<br/>
         * <ul>
         * <li>"butt": The ends of lines are squared off at the endpoints.</li>
         * <li>"round": The ends of lines are rounded.</li>
         * <li>"square": The ends of lines are squared off by adding a box with an equal width and half the height of the line's thickness.</li>
         * </ul>
         * @default "butt"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定如何绘制每一条线段末端的属性。有3个可能的值，分别是：<br/>
         * <ul>
         * <li>"butt": 线段末端以方形结束。</li>
         * <li>"round": 线段末端以圆形结束。</li>
         * <li>"square": 线段末端以方形结束，但是增加了一个宽度和线段相同，高度是线段厚度一半的矩形区域。</li>
         * </ul>
         * @default "butt"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get lineCap():string {
            return this._lineCap;
        }

        public set lineCap(value:string) {
            this._lineCap = value;
            this.pushCommand(sys.GraphicsCommandType.lineCap, arguments);
        }

        /**
         * @private
         */
        private _strokeStyle:any;

        /**
         * @language en_US
         * specifies the color or style to use for the lines around shapes.
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 设置要在图形边线填充的颜色或样式
         * @default "#000000"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get strokeStyle():any {
            return this._strokeStyle;
        }

        public set strokeStyle(value:any) {
            var tmpValue = value;
            if (typeof tmpValue == "number") {
                tmpValue = toColorString(tmpValue);
            }
            this._strokeStyle = tmpValue;
            this.pushCommand(sys.GraphicsCommandType.strokeStyle, arguments);
        }

        /**
         * @private
         */
        private _lineJoin:string;

        /**
         * @language en_US
         * specifies the type of joint appearance used at angles.There are three possible values for this property and those are:<br/>
         * <ul>
         * <li>"round": Rounds off the corners of a shape by filling an additional sector of disc centered at the common endpoint
         * of connected segments. The radius for these rounded corners is equal to the line width.</li>
         * <li>"bevel": Fills an additional triangular area between the common endpoint of connected segments, and the separate
         * outside rectangular corners of each segment.</li>
         * <li>"miter": Connected segments are joined by extending their outside edges to connect at a single point, with the
         * effect of filling an additional lozenge-shaped area. This setting is effected by the miterLimit property.</li>
         * </ul>
         * @default "miter"
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定用于拐角的连接外观的类型,有3个可能的值，分别是：<br/>
         * <ul>
         * <li>"round": 圆角连接</li>
         * <li>"bevel": 斜角连接。</li>
         * <li>"miter": 尖角连接。当使用尖角模式时，还可以同时使用 miterLimit 参数限制尖角的长度。</li>
         * </ul>
         * @default "miter"
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get lineJoin():string {
            return this._lineJoin;
        }

        public set lineJoin(value:string) {
            this._lineJoin = value;
            this.pushCommand(sys.GraphicsCommandType.lineJoin, arguments);
        }

        /**
         * @private
         */
        private _miterLimit:number;

        /**
         * @language en_US
         * A number that indicates the limit at which a miter is cut off.
         * @default 10
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 用于表示剪切斜接的极限值的数字。
         * @default 10
         * @version Egret 2.4
         * @platform Web,Native
         */
        public get miterLimit():number {
            return this._miterLimit;
        }

        public set miterLimit(value:number) {
            this._miterLimit = value;
            this.pushCommand(sys.GraphicsCommandType.miterLimit, arguments);
        }


        /**
         *
         * @param x0
         * @param y0
         * @version Egret 2.4
         * @platform Web,Native
         */
        public scale(x0:number, y0:number):void {
            this.pushCommand(sys.GraphicsCommandType.scale, arguments);
        }

        /**
         * @language en_US
         * adds an arc to the path which is centered at (x, y) position with radius r starting at startAngle and ending
         * at endAngle going in the given direction by anticlockwise (defaulting to clockwise).
         * @param x The x coordinate of the arc's center.
         * @param y The y coordinate of the arc's center.
         * @param radius The arc's radius.
         * @param startAngle The angle at which the arc starts, measured clockwise from the positive x axis and expressed in radians.
         * @param endAngle The angle at which the arc ends, measured clockwise from the positive x axis and expressed in radians.
         * @param anticlockwise if true, causes the arc to be drawn counter-clockwise between the two angles. By default it is drawn clockwise.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的重点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean):void {
            this.pushCommand(sys.GraphicsCommandType.arc, arguments);
            if (radius < 0) {
                return;
            }
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
        }

        /**
         * @private
         * 测量圆弧的矩形大小
         */
        private arcBounds(x:number, y:number, radius:number, startAngle:number, endAngle:number):void {
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendByPoint(x - radius, y - radius);
                this.extendByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += TwoPI;
            }
            var startX = Math.cos(startAngle) * radius;
            var endX = Math.cos(endAngle) * radius;
            var xMin = Math.min(startX, endX);
            var xMax = Math.max(startX, endX);

            var startY = Math.sin(startAngle) * radius;
            var endY = Math.sin(endAngle) * radius;
            var yMin = Math.min(startY, endY);
            var yMax = Math.max(startY, endY);

            if (startAngle <= PI && endAngle >= PI) {
                xMin = -radius;
            }
            if (startAngle <= TwoPI && endAngle >= TwoPI) {
                xMax = radius;
            }
            if (startAngle <=PacPI && endAngle >= PacPI) {
                yMin = -radius;
            }
            if (startAngle <= HalfPI && endAngle >= HalfPI) {
                yMax = radius;
            }
            this.extendByPoint(xMin + x, yMin + y);
            this.extendByPoint(xMax + x, yMax + y);
        }

        /**
         * @language en_US
         * adds a quadratic Bézier curve to the path. It requires two points. The first point is a control point and the
         * second one is the end point. The starting point is the last point in the current path, which can be changed using
         * moveTo() before creating the quadratic Bézier curve.
         * @param cpx The x axis of the coordinate for the control point.
         * @param cpy The y axis of the coordinate for the control point.
         * @param x The x axis of the coordinate for the end point.
         * @param y The y axis of the coordinate for the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段二次贝塞尔曲线路径。它需要2个点。 第一个点是控制点，第二个点是终点。 起始点是当前路径最新的点，当创建二次贝赛尔曲线之前，可以使用 moveTo() 方法进行改变。
         * @param cpx 控制点的 x 轴坐标。
         * @param cpy 控制点的 y 轴坐标。
         * @param x 终点的 x 轴坐标。
         * @param y 终点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public quadraticCurveTo(cpx:number, cpy:number, x:number, y:number):void {
            this.pushCommand(sys.GraphicsCommandType.quadraticCurveTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(cpx, cpy);
            this.extendByPoint(x, y);
        }

        /**
         * @language en_US
         * adds a cubic Bézier curve to the path. It requires three points. The first two points are control points and
         * the third one is the end point. The starting point is the last point in the current path, which can be changed
         * using moveTo() before creating the Bézier curve.
         * @param cp1x The x axis of the coordinate for the first control point.
         * @param cp1y The y axis of the coordinate for first control point.
         * @param cp2x The x axis of the coordinate for the second control point.
         * @param cp2y The y axis of the coordinate for the second control point.
         * @param x The x axis of the coordinate for the end point.
         * @param y The y axis of the coordinate for the end point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一段三次贝赛尔曲线路径。该方法需要三个点。 第一、第二个点是控制点，第三个点是结束点。起始点是当前路径的最后一个点，
         * 绘制贝赛尔曲线前，可以通过调用 moveTo() 进行修改。
         * @param cp1x 第一个控制点的 x 轴坐标。
         * @param cp1y 第一个控制点的 y 轴坐标。
         * @param cp2x 第二个控制点的 x 轴坐标。
         * @param cp2y 第二个控制点的 y 轴坐标。
         * @param x 结束点的 x 轴坐标。
         * @param y 结束点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public bezierCurveTo(cp1x:number, cp1y:number, cp2x:number, cp2y:number, x:number, y:number):void {
            this.pushCommand(sys.GraphicsCommandType.bezierCurveTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(cp1x, cp1y);
            this.extendByPoint(cp2x, cp2y);
            this.extendByPoint(x, y);
        }


        /**
         * @language en_US
         * connects the last point in the sub-path to the x, y coordinates with a straight line
         * @param x The x axis of the coordinate for the end of the line.
         * @param y The y axis of the coordinate for the end of the line.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用直线连接子路径的终点到x，y坐标。
         * @param x 直线终点的 x 轴坐标。
         * @param y 直线终点的 y 轴坐标。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineTo(x:number, y:number):void {
            this.pushCommand(sys.GraphicsCommandType.lineTo, arguments);
            this.checkMoveTo();
            this.extendByPoint(x, y);
        }

        /**
         * @language en_US
         * fills the current or given path with the current fill style using the non-zero or even-odd winding rule.
         * @param fillRule The algorithm by which to determine if a point is inside a path or outside a path. Possible values:
         * "nonzero": The non-zero winding rule, which is the default rule.
         * "evenodd": The even-odd winding rule.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环绕规则。
         * @param fillRule 一种算法，决定点是在路径内还是在路径外。允许的值：
         * "nonzero": 非零环绕规则， 默认的规则。
         * "evenodd": 奇偶环绕规则。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public fill(fillRule?:string):void {
            this.pushCommand(sys.GraphicsCommandType.fill, arguments);
            this.hasFill = true;
        }

        /**
         * @language en_US
         * causes the point of the pen to move back to the start of the current sub-path. It tries to add a straight line
         * (but does not actually draw it) from the current point to the start. If the shape has already been closed or
         * has only one point, this function does nothing.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使笔点返回到当前子路径的起始点。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public closePath():void {
            this.pushCommand(sys.GraphicsCommandType.closePath, arguments);
        }

        /**
         * @language en_US
         * creates a path for a rectangle at position (x, y) with a size that is determined by width and height. Those
         * four points are connected by straight lines and the sub-path is marked as closed, so that you can fill or stroke this rectangle.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 创建一段矩形路径，矩形的起点位置是 (x, y) ，尺寸为 width 和 height。矩形的4个点通过直线连接，子路径做为闭合的标记，所以你可以填充或者描边矩形。
         * @param x 矩形起点的 x 轴坐标。
         * @param y 矩形起点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public rect(x:number, y:number, width:number, height:number):void {
            this.pushCommand(sys.GraphicsCommandType.rect, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
        }

        /**
         * @language en_US
         * moves the starting point of a new sub-path to the (x, y) coordinates.
         * @param x The x axis of the point.
         * @param y The y axis of the point.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将一个新的子路径的起始点移动到(x，y)坐标
         * @param x 点的 x 轴
         * @param y 点的 y 轴
         * @version Egret 2.4
         * @platform Web,Native
         */
        public moveTo(x:number, y:number):void {
            this.pushCommand(sys.GraphicsCommandType.moveTo, arguments);
            this.moveToX = x;
            this.moveToY = y;
            this.hasMoved = true;
        }

        /**
         * @language en_US
         * draws a filled rectangle at (x, y) position whose size is determined by width and height and whose style is
         * determined by the fillStyle attribute.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个填充矩形。矩形的起点在 (x, y) 位置，矩形的尺寸是 width 和 height ，fillStyle 属性决定矩形的样式。
         * @param x 矩形起始点的 x 轴坐标。
         * @param y 矩形起始点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public fillRect(x:number, y:number, width:number, height:number):void {
            this.pushCommand(sys.GraphicsCommandType.fillRect, arguments);
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
            this.hasFill = true;
        }

        /**
         * @language en_US
         * strokes the current or given path with the current stroke style.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据当前的画线样式，绘制当前或已经存在的路径的方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public stroke():void {
            this.pushCommand(sys.GraphicsCommandType.stroke, arguments);
            this.hasStroke = true;
        }

        /**
         * @language en_US
         * paints a rectangle which has a starting point at (x, y) and has a w width and an h height onto the surface,
         * using the current stroke style.
         * @param x The x axis of the coordinate for the rectangle starting point.
         * @param y The y axis of the coordinate for the rectangle starting point.
         * @param w The rectangle's width.
         * @param h The rectangle's height.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前的绘画样式，描绘一个起点在 (x, y) 、宽度为 w 、高度为 h 的矩形的方法。
         * @param x 矩形起点的 x 轴坐标。
         * @param y 矩形起点的 y 轴坐标。
         * @param width 矩形的宽度。
         * @param height 矩形的高度。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public strokeRect(x:number, y:number, width:number, height:number):void {
            this.pushCommand(sys.GraphicsCommandType.strokeRect, arguments);
            this.hasStroke = true;
            this.extendByPoint(x, y);
            this.extendByPoint(x + width, y + height);
        }

        /**
         * @language en_US
         * starts a new path by emptying the list of sub-paths. Call this method when you want to create a new path.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清空子路径列表开始一个新路径。 当你想创建一个新的路径时，调用此方法。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public beginPath():void {
            this.pushCommand(sys.GraphicsCommandType.beginPath, arguments);
            this.hasMoved = false;
            this.moveToX = NaN;
            this.moveToY = NaN;
        }

        /**
         * @language en_US
         * adds an arc to the path with the given control points and radius, connected to the previous point by a straight line.
         * @param x1 The x axis of the coordinate for the first control point.
         * @param y1 The y axis of the coordinate for the first control point.
         * @param x2 The x axis of the coordinate for the second control point.
         * @param y2 The y axis of the coordinate for the second control point.
         * @param radius The arc's radius.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 根据控制点和半径绘制一段圆弧路径，使用直线连接前一个点。
         * @param x1 第一个控制点的 x 轴坐标。
         * @param y1 第一个控制点的 y 轴坐标。
         * @param x2 第二个控制点的 x 轴坐标。
         * @param y2 第二个控制点的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public arcTo(x1:number, y1:number, x2:number, y2:number, radius:number):void {
            this.pushCommand(sys.GraphicsCommandType.arcTo, arguments);
            if (isNaN(this.moveToX)) {//没有调用过moveTo()方法
                return;
            }
            this.checkMoveTo();

            getVector(this.moveToX, this.moveToY, x1, y1, vector1);
            getVector(x2, y2, x1, y1, vector3);
            //角平分线
            vector.x = vector1.x + vector3.x;
            vector.y = vector1.y + vector3.y;
            //角平分向量归1
            getVector(vector.x, vector.y, 0, 0, vector);
            //向量夹角
            var cross = vector1.x * vector.x + vector1.y * vector.y;
            var l1 = distance(vector1.x, vector1.y, 0, 0);
            var l2 = distance(vector.x, vector.y, 0, 0);
            var cos = cross / (l1 * l2);
            var a = Math.acos(cos);

            var l = radius / Math.sin(a);
            //圆心
            var centerX = x1 + vector.x * l;
            var centerY = y1 + vector.y * l;
            var L10 = radius / Math.tan(a);
            var x10 = x1 + vector1.x * L10;
            var y10 = y1 + vector1.y * L10;
            var x12 = x1 + vector3.x * L10;
            var y12 = y1 + vector3.y * L10;

            getVector(centerX, centerY, x10, y10, vector);
            var startAngle = Math.atan2(vector.y, vector.x);
            getVector(centerX, centerY, x12, y12, vector);
            var endAngle = Math.atan2(vector.y, vector.x);
            var offset = endAngle - startAngle;
            offset = clampAngle(offset);
            if (offset > PI) {
                var temp = endAngle;
                endAngle = startAngle;
                startAngle = temp;
            }
            this.arcBounds(centerX, centerY, radius, startAngle, endAngle);
        }

        /**
         * @language en_US
         * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public clear():void {
            this.reset();
            this.$commands.length = 0;
            this.$targetDisplay.$invalidateContentBounds();
        }

        /**
         * @private
         */
        private isFirst:boolean;
        /**
         * @private
         */
        private minX:number;
        /**
         * @private
         */
        private minY:number;
        /**
         * @private
         */
        private maxX:number;
        /**
         * @private
         */
        private maxY:number;
        /**
         * @private
         */
        private hasMoved:boolean;
        /**
         * @private
         */
        private moveToX:number;
        /**
         * @private
         */
        private moveToY:number;
        /**
         * @private
         */
        private hasStroke:boolean;
        /**
         * @private
         */
        private hasFill:boolean;


        /**
         * @private
         *
         */
        private reset():void {
            this._fillStyle = null;
            this._lineCap = "butt";
            this._lineJoin = "miter";
            this._lineWidth = 1;
            this._miterLimit = 10;
            this._strokeStyle = null;
            this.hasMoved = false;
            this.minX = 0;
            this.minY = 0;
            this.maxX = 0;
            this.maxY = 0;
            this.isFirst = true;
            this.moveToX = NaN;
            this.moveToY = NaN;
            this.hasStroke = false;
            this.hasFill = false;
        }

        /**
         * @private
         * 目标显示对象
         */
        $targetDisplay:DisplayObject;
        /**
         * @private
         * 绘图命令列表
         */
        $commands:sys.GraphicsCommand[] = [];

        /**
         * @private
         */
        private pushCommand(graphicsType:number, args:any):void {
            this.$commands.push({type: graphicsType, arguments: args});
            this.$targetDisplay.$invalidateContentBounds();
        }

        /**
         * @private
         */
        private checkMoveTo():void {
            if (this.hasMoved) {
                this.hasMoved = false;
                this.extendByPoint(this.moveToX, this.moveToY);
            }
        }

        /**
         * @private
         */
        private extendByPoint(x:number, y:number):void {
            if (this.isFirst) {
                this.isFirst = false;
                this.maxX = this.minX = x;
                this.maxY = this.minY = y;
            }
            else {
                this.minX = Math.min(this.minX, x);
                this.minY = Math.min(this.minY, y);
                this.maxX = Math.max(this.maxX, x);
                this.maxY = Math.max(this.maxY, y);
            }
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            if ((!this.hasFill && this._fillStyle == null) && (!this.hasStroke && this._strokeStyle == null)) {
                bounds.setEmpty();
                return;
            }
            if (this.hasStroke || this._strokeStyle) {
                var lineWidth = this._lineWidth;
                var half = lineWidth * 0.5;
            }
            else {
                half = lineWidth = 0;
            }
            bounds.setTo(this.minX - half, this.minY - half, this.maxX - this.minX + lineWidth, this.maxY - this.minY + lineWidth);
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext, forHitTest?:boolean):void {
            context.save();
            context.fillStyle = "#000000";
            context.lineCap = "butt";
            context.lineJoin = "miter";
            context.lineWidth = 1;
            context.miterLimit = 10;
            context.strokeStyle = "#000000";
            context.beginPath();//清理之前的缓存的路径
            var map = context["graphicsMap"];
            if (!map) {
                map = mapGraphicsFunction(context);
            }
            var commands = this.$commands;
            var length = commands.length;
            if (forHitTest) {
                for (var i = 0; i < length; i++) {
                    var command = commands[i];
                    if (command.type == sys.GraphicsCommandType.fillStyle || command.type == sys.GraphicsCommandType.strokeStyle) {
                        map[command.type].apply(context, ["rgba(1,1,1,1)"]);
                    }
                    else {
                        map[command.type].apply(context, command.arguments);
                    }
                }
            }
            else {
                for (var i = 0; i < length; i++) {
                    var command = commands[i];
                    map[command.type].apply(context, command.arguments);
                }
            }

            if (this._strokeStyle) {
                map[sys.GraphicsCommandType.stroke].apply(context, []);
                map[sys.GraphicsCommandType.closePath].apply(context, []);
            }

            if (this._fillStyle) {
                map[sys.GraphicsCommandType.fill].apply(context, []);
                map[sys.GraphicsCommandType.closePath].apply(context, []);
            }

            context.restore();
        }
    }

    /**
     * @private
     *
     * @param context
     * @returns
     */
    function mapGraphicsFunction(context:sys.RenderContext):any {
        var map = context["graphicsMap"] = {};
        map[sys.GraphicsCommandType.arc] = context.arc;
        map[sys.GraphicsCommandType.arcTo] = context.arcTo;
        map[sys.GraphicsCommandType.beginPath] = context.beginPath;
        map[sys.GraphicsCommandType.bezierCurveTo] = context.bezierCurveTo;
        map[sys.GraphicsCommandType.closePath] = context.closePath;
        map[sys.GraphicsCommandType.fill] = context.fill;
        map[sys.GraphicsCommandType.fillRect] = context.fillRect;
        map[sys.GraphicsCommandType.lineTo] = context.lineTo;
        map[sys.GraphicsCommandType.moveTo] = context.moveTo;
        map[sys.GraphicsCommandType.quadraticCurveTo] = context.quadraticCurveTo;
        map[sys.GraphicsCommandType.rect] = context.rect;
        map[sys.GraphicsCommandType.stroke] = context.stroke;
        map[sys.GraphicsCommandType.strokeRect] = context.strokeRect;
        map[sys.GraphicsCommandType.scale] = context.scale;

        map[sys.GraphicsCommandType.lineWidth] = function (value) {
            context.lineWidth = value
        };
        map[sys.GraphicsCommandType.miterLimit] = function (value) {
            context.miterLimit = value
        };
        map[sys.GraphicsCommandType.fillStyle] = function (value) {
            context.fillStyle = value
        };
        map[sys.GraphicsCommandType.lineCap] = function (value) {
            context.lineCap = value
        };
        map[sys.GraphicsCommandType.lineJoin] = function (value) {
            context.lineJoin = value
        };
        map[sys.GraphicsCommandType.strokeStyle] = function (value) {
            context.strokeStyle = value
        };
        return map;
    }

}

module egret.sys {
    /**
     * @private
     */
    export interface GraphicsCommand {
        /**
         * @private
         */
            type:number;
        /**
         * @private
         */
        arguments:any[];
    }

    /**
     * @private
     */
    export const enum GraphicsCommandType {
        /**
         * @private
         */
        miterLimit,
        /**
         * @private
         */
        lineCap,
        /**
         * @private
         */
        lineJoin,
        /**
         * @private
         */
        lineWidth,
        /**
         * @private
         */
        strokeStyle,
        /**
         * @private
         */
        fillStyle,
        /**
         * @private
         */
        arc,
        /**
         * @private
         */
        quadraticCurveTo,
        /**
         * @private
         */
        lineTo,
        /**
         * @private
         */
        fill,
        /**
         * @private
         */
        closePath,
        /**
         * @private
         */
        rect,
        /**
         * @private
         */
        moveTo,
        /**
         * @private
         */
        fillRect,
        /**
         * @private
         */
        bezierCurveTo,
        /**
         * @private
         */
        stroke,
        /**
         * @private
         */
        strokeRect,
        /**
         * @private
         */
        beginPath,
        /**
         * @private
         */
        arcTo,
        /**
         * @private
         */
        scale
    }
}