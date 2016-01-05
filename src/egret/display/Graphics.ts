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
     * @private
     */
    function quadraticBezier(from:number, cp:number, to:number, t:number):number {
        var inverseT = 1 - t;
        return from * inverseT * inverseT + 2 * cp * inverseT * t + to * t * t;
    }

    /**
     * @private
     */
    function quadraticBezierExtreme(from:number, cp:number, to:number):number {
        var t = (from - cp) / (from - 2 * cp + to);
        if (t < 0) {
            return from;
        }
        if (t > 1) {
            return to;
        }
        return quadraticBezier(from, cp, to, t);
    }

    /**
     * @private
     */
    function cubicBezier(from:number, cp:number, cp2:number, to:number, t):number {
        var tSq = t * t;
        var inverseT = 1 - t;
        var inverseTSq = inverseT * inverseT;
        return from * inverseT * inverseTSq + 3 * cp * t * inverseTSq +
            3 * cp2 * inverseT * tSq + to * t * tSq;
    }

    /**
     * @private
     */
    function cubicBezierExtremes(from:number, cp:number, cp2:number, to):number[] {
        var d1 = cp - from;
        var d2 = cp2 - cp;
        // We only ever need d2 * 2
        d2 *= 2;
        var d3 = to - cp2;
        // Prevent division by zero by very slightly changing d3 if that would happen
        if (d1 + d3 === d2) {
            d3 *= 1.0001;
        }
        var fHead = 2 * d1 - d2;
        var part1 = d2 - 2 * d1;
        var fCenter = Math.sqrt(part1 * part1 - 4 * d1 * (d1 - d2 + d3));
        var fTail = 2 * (d1 - d2 + d3);
        var t1 = (fHead + fCenter) / fTail;
        var t2 = (fHead - fCenter ) / fTail;
        var result = [];
        if (t1 >= 0 && t1 <= 1) {
            result.push(Math.round(cubicBezier(from, cp, cp2, to, t1)));
        }
        if (t2 >= 0 && t2 <= 1) {
            result.push(Math.round(cubicBezier(from, cp, cp2, to, t2)));
        }
        return result;
    }

    /**
     * @private
     * 格式化弧线角度的值
     */
    function clampAngle(value):number {
        value %= Math.PI * 2;
        if (value < 0) {
            value += Math.PI * 2;
        }
        return value;
    }

    /**
     * @language en_US
     * The Graphics class contains a set of methods for creating vector shape. Display objects that support drawing include Sprite and Shape objects. Each class in these classes includes the graphics attribute that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  Draw Rectangle
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    /**
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     * 以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  绘制矩形
     * @version Egret 2.4
     * @platform Web,Native
     * @includeExample egret/display/Graphics.ts
     */
    export class Graphics extends HashObject {

        /**
         * @version Egret 2.4
         * @platform Web,Native
         */
        public constructor() {
            super();
            this.$renderNode = new sys.GraphicsNode();
        }

        /**
         * @private
         */
        $renderNode:sys.GraphicsNode;
        /**
         * 绑定到的目标显示对象
         */
        private targetDisplay:DisplayObject;

        /**
         * @private
         * 设置绑定到的目标显示对象
         */
        $setTarget(target:DisplayObject):void {
            if (this.targetDisplay) {
                this.targetDisplay.$renderNode = null;
            }
            target.$renderNode = this.$renderNode;
            this.targetDisplay = target;
        }

        /**
         * 当前移动到的坐标X
         */
        private lastX:number = 0;
        /**
         * 当前移动到的坐标Y
         */
        private lastY:number = 0;
        /**
         * 当前正在绘制的填充
         */
        private fillPath:sys.Path2D = null;
        /**
         * 当前正在绘制的线条
         */
        private strokePath:sys.Path2D = null;
        /**
         * 线条的左上方宽度
         */
        private topLeftStrokeWidth = 0;
        /**
         * 线条的右下方宽度
         */
        private bottomRightStrokeWidth = 0;

        /**
         * 对1像素和3像素特殊处理，向右下角偏移0.5像素，以显示清晰锐利的线条。
         */
        private setStrokeWidth(width:number) {
            switch (width) {
                case 1:
                    this.topLeftStrokeWidth = 0;
                    this.bottomRightStrokeWidth = 1;
                    break;
                case 3:
                    this.topLeftStrokeWidth = 1;
                    this.bottomRightStrokeWidth = 2;
                    break;
                default:
                    var half = Math.ceil(width * 0.5) | 0;
                    this.topLeftStrokeWidth = half;
                    this.bottomRightStrokeWidth = half;
                    break;
            }
        }

        /**
         * @language en_US
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color Filled color
         * @param alpha Filled Alpha value
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color 填充的颜色
         * @param alpha 填充的 Alpha 值
         * @version Egret 2.4
         * @platform Web,Native
         */
        public beginFill(color:number, alpha:number = 1):void {
            this.fillPath = this.$renderNode.beginFill(color, alpha, this.strokePath);
            this.fillPath.moveTo(this.lastX, this.lastY);
        }


        /**
         * @language en_US
         * Specifies a gradient fill used by subsequent calls to other Graphics methods (such as lineTo() or drawCircle()) for the object.
         * Calling the clear() method clears the fill.
         * Note: Only support on Canvas
         * @param type A value from the GradientType class that specifies which gradient type to use: GradientType.LINEAR or GradientType.RADIAL.
         * @param colors An array of RGB hexadecimal color values used in the gradient; for example, red is 0xFF0000, blue is 0x0000FF, and so on. You can specify up to 15 colors. For each color, specify a corresponding value in the alphas and ratios parameters.
         * @param alphas An array of alpha values for the corresponding colors in the colors array;
         * @param ratios An array of color distribution ratios; valid values are 0-255.
         * @param matrix A transformation matrix as defined by the egret.Matrix class. The egret.Matrix class includes a createGradientBox() method, which lets you conveniently set up the matrix for use with the beginGradientFill() method.
         * @platform Web
         * @version Egret 2.4
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * 注：该方法目前仅支持H5 Canvas
         * @param type 用于指定要使用哪种渐变类型的 GradientType 类的值：GradientType.LINEAR 或 GradientType.RADIAL。
         * @param colors 渐变中使用的 RGB 十六进制颜色值的数组（例如，红色为 0xFF0000，蓝色为 0x0000FF，等等）。对于每种颜色，请在 alphas 和 ratios 参数中指定对应值。
         * @param alphas colors 数组中对应颜色的 alpha 值数组。
         * @param ratios 颜色分布比率的数组。有效值为 0 到 255。
         * @param matrix 一个由 egret.Matrix 类定义的转换矩阵。egret.Matrix 类包括 createGradientBox() 方法，通过该方法可以方便地设置矩阵，以便与 beginGradientFill() 方法一起使用
         * @platform Web
         * @version Egret 2.4
         */
        public beginGradientFill(type:string, colors:number[], alphas:number[], ratios:number[], matrix:egret.Matrix = null):void {
            var m = new egret.Matrix();
            if (matrix) {
                m.a = matrix.a * 819.2;
                m.b = matrix.b * 819.2;
                m.c = matrix.c * 819.2;
                m.d = matrix.d * 819.2;
                m.tx = matrix.tx;
                m.ty = matrix.ty;
            }
            else {
                //默认值
                m.a = 100;
                m.d = 100;
            }
            this.fillPath = this.$renderNode.beginGradientFill(type, colors, alphas, ratios, m, this.strokePath);
            this.fillPath.moveTo(this.lastX, this.lastY);
        }

        /**
         * @language en_US
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public endFill():void {
            this.fillPath = null;
        }

        /**
         * @language en_US
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode Specifies the scale mode to be used
         * @param caps Specifies the value of the CapsStyle class of the endpoint type at the end of the line. (default = CapsStyle.ROUND)
         * @param joints Specifies the type of joint appearance of corner.  (default = JointStyle.ROUND)
         * @param miterLimit Indicates the limit number of cut miter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode 用于指定要使用的比例模式
         * @param caps 用于指定线条末端处端点类型的 CapsStyle 类的值。默认值：CapsStyle.ROUND
         * @param joints 指定用于拐角的连接外观的类型。默认值：JointStyle.ROUND
         * @param miterLimit 用于表示剪切斜接的极限值的数字。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {
            thickness = +thickness || 0;
            if (thickness <= 0) {
                this.strokePath = null;
                this.setStrokeWidth(0);
            }
            else {
                this.setStrokeWidth(thickness);
                this.strokePath = this.$renderNode.lineStyle(thickness, color, alpha, caps, joints, miterLimit);
                this.strokePath.moveTo(this.lastX, this.lastY);
            }
        }

        /**
         * @language en_US
         * Draw a rectangle
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawRect(x:number, y:number, width:number, height:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.rect(x, y, width, height);
            strokePath && strokePath.rect(x, y, width, height);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(x, y);
        }

        /**
         * @language en_US
         * Draw a rectangle with rounded corners.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @param ellipseWidth Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆角矩形。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @param ellipseWidth 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {
            x = +x || 0;
            y = +y || 0;
            width = +width || 0;
            height = +height || 0;
            ellipseWidth = +ellipseWidth || 0;
            ellipseHeight = +ellipseHeight || 0;

            var radiusX = (ellipseWidth * 0.5) | 0;
            var radiusY = ellipseHeight ? (ellipseHeight * 0.5) | 0 : radiusX;

            if (!radiusX || !radiusY) {
                this.drawRect(x, y, width, height);
                return;
            }

            var hw = width * 0.5;
            var hh = height * 0.5;
            if (radiusX > hw) {
                radiusX = hw;
            }
            if (radiusY > hh) {
                radiusY = hh;
            }
            if (hw === radiusX && hh === radiusY) {
                if (radiusX === radiusY) {
                    this.drawCircle(x + radiusX, y + radiusY, radiusX);
                } else {
                    this.drawEllipse(x, y, radiusX * 2, radiusY * 2);
                }
                return;
            }

            //    A-----B
            //  H         C
            //  G         D
            //    F-----E
            //
            var right = x + width;
            var bottom = y + height;
            var xlw = x + radiusX;
            var xrw = right - radiusX;
            var ytw = y + radiusY;
            var ybw = bottom - radiusY;
            if (this.fillPath) {
                this.drawRoundRectToPath(this.fillPath, x, y, right, bottom, xlw, xrw, ytw, ybw);
            }
            if (this.strokePath) {
                this.drawRoundRectToPath(this.strokePath, x, y, right, bottom, xlw, xrw, ytw, ybw);
            }
            this.extendBoundsByPoint(x, y);
            this.extendBoundsByPoint(x + width, y + height);
            this.updatePosition(right, ybw);
        }

        /**
         * @private
         */
        private drawRoundRectToPath(path:sys.Path2D, x:number, y:number, right:number, bottom:number,
                                    xlw:number, xrw:number, ytw:number, ybw:number):void {
            path.moveTo(right, ybw);
            path.curveTo(right, bottom, xrw, bottom);
            path.lineTo(xlw, bottom);
            path.curveTo(x, bottom, x, ybw);
            path.lineTo(x, ytw);
            path.curveTo(x, y, xlw, y);
            path.lineTo(xrw, y);
            path.curveTo(right, y, right, ytw);
            path.lineTo(right, ybw);
        }

        /**
         * @language en_US
         * Draw a circle.
         * @param x x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r Radius of the circle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawCircle(x:number, y:number, radius:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.circle(x, y, radius);
            strokePath && strokePath.circle(x, y, radius);
            this.extendBoundsByPoint(x - radius, y - radius);
            this.extendBoundsByPoint(x + radius, y + radius);
            this.updatePosition(x + radius, y);
        }


        /**
         * @language en_US
         * Draw an ellipse.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width Width of the rectangle (in pixels).
         * @param height Height of the rectangle (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawEllipse(x:number, y:number, width:number, height:number):void {

            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.ellipse(x, y, width, height);
            strokePath && strokePath.ellipse(x, y, width, height);

            var radiusX = width * 0.5;
            var radiusY = height * 0.5;
            this.extendBoundsByPoint(x - radiusX, y - radiusY);
            this.extendBoundsByPoint(x + radiusX, y + radiusY);
            this.updatePosition(x + width * 0.5, y);
        }

        /**
         * @language en_US
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public moveTo(x:number, y:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.moveTo(x, y);
            strokePath && strokePath.moveTo(x, y);
            this.includeLastPosition = false;
            this.lastX = x;
            this.lastY = y;
        }

        /**
         * @language en_US
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public lineTo(x:number, y:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.lineTo(x, y);
            strokePath && strokePath.lineTo(x, y);
            this.updatePosition(x, y);
        }

        /**
         * @language en_US
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.curveTo(controlX, controlY, anchorX, anchorY);
            strokePath && strokePath.curveTo(controlX, controlY, anchorX, anchorY);
            if (controlX < this.lastX || controlX > anchorX) {
                this.extendBoundsByX(quadraticBezierExtreme(this.lastX, controlX, anchorX) | 0);
            }
            if (controlY < this.lastY || controlY > anchorY) {
                this.extendBoundsByY(quadraticBezierExtreme(this.lastY, controlY, anchorY) | 0);
            }
            this.updatePosition(anchorX, anchorY);
        }

        /**
         * @language en_US
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.4
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public cubicCurveTo(controlX1:number, controlY1:number, controlX2:number,
                            controlY2:number, anchorX:number, anchorY:number):void {
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            strokePath && strokePath.cubicCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
            var extremes:number[];
            var i:number;
            var fromX = this.lastX;
            var fromY = this.lastY;
            if (controlX1 < fromX || controlX2 < fromX || controlX1 > anchorX || controlX2 > anchorX) {
                extremes = cubicBezierExtremes(fromX, controlX1, controlX2, anchorX);
                for (i = extremes.length; i--;) {
                    this.extendBoundsByX(extremes[i] | 0);
                }
            }
            if (controlY1 < fromY || controlY2 < fromY || controlY1 > anchorY || controlY2 > anchorY) {
                extremes = cubicBezierExtremes(fromY, controlY1, controlY2, anchorY);
                for (i = extremes.length; i--;) {
                    this.extendBoundsByY(extremes[i] | 0);
                }
            }
            this.updatePosition(anchorX, anchorY);
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
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         * @version Egret 2.4
         * @platform Web,Native
         */
        public drawArc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise?:boolean):void {
            if (radius < 0) {
                return;
            }
            var fillPath = this.fillPath;
            var strokePath = this.strokePath;
            fillPath && fillPath.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            strokePath && strokePath.arc(x, y, radius, startAngle, endAngle, anticlockwise);
            if (anticlockwise) {
                this.arcBounds(x, y, radius, endAngle, startAngle);
            }
            else {
                this.arcBounds(x, y, radius, startAngle, endAngle);
            }
            var endX = x + egret.$cos(endAngle) * radius;
            var endY = y + egret.$sin(endAngle) * radius;
            this.updatePosition(endX, endY);
        }

        /**
         * @private
         * 测量圆弧的矩形大小
         */
        private arcBounds(x:number, y:number, radius:number, startAngle:number, endAngle:number):void {
            startAngle = clampAngle(startAngle);
            endAngle = clampAngle(endAngle);
            var PI = Math.PI;
            if (Math.abs(startAngle - endAngle) < 0.01) {
                this.extendBoundsByPoint(x - radius, y - radius);
                this.extendBoundsByPoint(x + radius, y + radius);
                return;
            }
            if (startAngle > endAngle) {
                endAngle += PI * 2;
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
            if (startAngle <= PI * 2 && endAngle >= PI * 2) {
                xMax = radius;
            }
            if (startAngle <= PI * 1.5 && endAngle >= PI * 1.5) {
                yMin = -radius;
            }
            if (startAngle <= PI * 0.5 && endAngle >= PI * 0.5) {
                yMax = radius;
            }
            this.extendBoundsByPoint(xMin + x, yMin + y);
            this.extendBoundsByPoint(xMax + x, yMax + y);
        }

        /**
         * @language en_US
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
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
            this.$renderNode.clear();
            this.updatePosition(0, 0);
            this.minX = Infinity;
            this.minY = Infinity;
            this.maxX = -Infinity;
            this.maxY = -Infinity;
        }

        /**
         * @private
         */
        private minX:number = Infinity;
        /**
         * @private
         */
        private minY:number = Infinity;
        /**
         * @private
         */
        private maxX:number = -Infinity;
        /**
         * @private
         */
        private maxY:number = -Infinity;

        private extendBoundsByPoint(x:number, y:number):void {
            this.extendBoundsByX(x);
            this.extendBoundsByY(y);
        }

        /**
         * @private
         */
        private extendBoundsByX(x:number):void {
            this.minX = Math.min(this.minX, x - this.topLeftStrokeWidth);
            this.maxX = Math.max(this.maxX, x + this.bottomRightStrokeWidth);
        }

        /**
         * @private
         */
        private extendBoundsByY(y:number):void {
            this.minY = Math.min(this.minY, y - this.topLeftStrokeWidth);
            this.maxY = Math.max(this.maxY, y + this.bottomRightStrokeWidth);
        }

        /**
         * 是否已经包含上一次moveTo的坐标点
         */
        private includeLastPosition:boolean = true;

        /**
         * 更新当前的lineX和lineY值，并标记尺寸失效。
         */
        private updatePosition(x:number, y:number):void {
            if (!this.includeLastPosition) {
                this.extendBoundsByPoint(this.lastX, this.lastY);
                this.includeLastPosition = true;
            }
            this.lastX = x;
            this.lastY = y;
            this.extendBoundsByPoint(x, y);
            this.targetDisplay.$invalidateContentBounds();
        }


        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            if (this.minX === Infinity) {
                bounds.setEmpty();
            }
            else {
                bounds.setTo(this.minX, this.minY, this.maxX - this.minX, this.maxY - this.minY);
            }
        }

        /**
         * @private
         *
         */
        $hitTest(stageX:number, stageY:number):DisplayObject {
            var target = this.targetDisplay;
            var bounds = target.$getContentBounds();
            var m = target.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            if (bounds.contains(localX, localY)) {
                return target;
            }
            return null;
        }
    }
}