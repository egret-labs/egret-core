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
     * @language en_US
     * The Graphics class contains a set of methods for creating vector shape. Display objects that support drawing include Sprite and Shape objects. Each class in these classes includes the graphics attribute that is a Graphics object.
     * The following auxiliary functions are provided for ease of use: drawRect(), drawRoundRect(), drawCircle(), and drawEllipse().
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  Draw Rectangle
     * @version Egret 2.0
     * @platform Web,Native
     */
    /**
     * @language zh_CN
     * Graphics 类包含一组可用来创建矢量形状的方法。支持绘制的显示对象包括 Sprite 和 Shape 对象。这些类中的每一个类都包括 graphics 属性，该属性是一个 Graphics 对象。
     * 以下是为便于使用而提供的一些辅助函数：drawRect()、drawRoundRect()、drawCircle() 和 drawEllipse()。
     * @see http://docs.egret-labs.org/post/manual/graphics/drawrect.html  绘制矩形
     * @version Egret 2.0
     * @platform Web,Native
     */
    export class Graphics extends HashObject {

        /**
         * @private
         */
        public $renderContext:GraphicsRenderContext = null;
        /**
         * @private
         */
        private strokeStyleColor:string = null;
        /**
         * @private
         */
        private fillStyleColor:string = null;
        /**
         * @private
         */
        public _dirty:boolean = false;
        /**
         * @private
         */
        private lineX:number = 0;
        /**
         * @private
         */
        private lineY:number = 0;

        /**
         * @version Egret 2.0
         * @platform Web,Native
         */
        constructor() {
            super();

            this.$renderContext = new GraphicsRenderContext();
        }

        /**
         * @private
         */
        $hitTest(stageX:number, stageY:number):DisplayObject {
            var target = this.$renderContext.$targetDisplay;
            var m = target.$getInvertedConcatenatedMatrix();
            var localX = m.a * stageX + m.c * stageY + m.tx;
            var localY = m.b * stageX + m.d * stageY + m.ty;
            var context = sys.sharedRenderContext;
            context.surface.width = context.surface.height = 3;
            context.translate(1 - localX, 1 - localY);
            this.$renderContext.$render(context, true);
            var data:Uint8Array = context.getImageData(1, 1, 1, 1).data;
            if (data[3] === 0) {
                return null;
            }
            return target;
        }

        /**
         * @private
         */
        $measureContentBounds(bounds:Rectangle):void {
            this.$renderContext.$measureContentBounds(bounds);
        }

        /**
         * @private
         */
        $render(context:sys.RenderContext):void {
            this.$renderContext.$render(context);
        }

        /**
         * @language en_US
         * Specify a simple single color fill that will be used for subsequent calls to other Graphics methods (for example, lineTo() and drawCircle()) when drawing.
         * Calling the clear() method will clear the fill.
         * @param color {number} Filled color
         * @param alpha {number} Filled Alpha value
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种简单的单一颜色填充，在绘制时该填充将在随后对其他 Graphics 方法（如 lineTo() 或 drawCircle()）的调用中使用。
         * 调用 clear() 方法会清除填充。
         * @param color {number} 填充的颜色
         * @param alpha {number} 填充的 Alpha 值
         * @version Egret 2.0
         * @platform Web,Native
         */
        public beginFill(color:number, alpha:number = 1):void {
            this.fillStyleColor = this._parseColor(color, alpha);

            this._setStyle(this.fillStyleColor);
        }

        /**
         * @private
         * 
         * @param color 
         * @param alpha 
         * @returns 
         */
        public _parseColor(color:number, alpha:number):string {
            var _colorBlue = color & 0x0000FF;
            var _colorGreen = (color & 0x00ff00) >> 8;
            var _colorRed = color >> 16;
            return "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
        }

        /**
         * @private
         * 
         * @param colorStr 
         */
        private _setStyle(colorStr:string):void {
            this.$renderContext.fillStyle = colorStr;
            this.$renderContext.beginPath();
        }

        /**
         * @language en_US
         * Draw a rectangle
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个矩形
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public drawRect(x:number, y:number, width:number, height:number):void {
            this.$renderContext.beginPath();
            this.$renderContext.rect(x, y, width, height);
            this.$renderContext.closePath();
        }

        /**
         * @language en_US
         * Draw a circle.
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param r {number} Radius of the circle (in pixels).
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆。
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param r {number} 圆的半径（以像素为单位）。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public drawCircle(x:number, y:number, r:number):void {
            this.$renderContext.beginPath();
            this.$renderContext.arc(x, y, r, 0, Math.PI * 2);
            this.$renderContext.closePath();
        }

        /**
         * @language en_US
         * Draw a rectangle with rounded corners.
         * @param x {number} x position of the center, relative to the registration point of the parent display object (in pixels).
         * @param y {number} y position of the center, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @param ellipseWidth {number} Width used to draw an ellipse with rounded corners (in pixels).
         * @param ellipseHeight {number} Height used to draw an ellipse with rounded corners (in pixels). (Optional) If no value is specified, the default value matches the value of the ellipseWidth parameter.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个圆角矩形。
         * @param x {number} 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y {number} 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @param ellipseWidth {number} 用于绘制圆角的椭圆的宽度（以像素为单位）。
         * @param ellipseHeight {number} 用于绘制圆角的椭圆的高度（以像素为单位）。 （可选）如果未指定值，则默认值与为 ellipseWidth 参数提供的值相匹配。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public drawRoundRect(x:number, y:number, width:number, height:number, ellipseWidth:number, ellipseHeight?:number):void {
            var _x:number = x;//控制X偏移
            var _y:number = y;//控制Y偏移
            var _w:number = width;
            var _h:number = height;
            var _ew:number = ellipseWidth / 2;
            var _eh:number = ellipseHeight ? ellipseHeight / 2 : _ew;
            var right:number = _x + _w;
            var bottom:number = _y + _h;
            var ax:number = right;
            var ay:number = bottom - _eh;

            this.$renderContext.beginPath();
            this.$renderContext.moveTo(ax, ay);
            this.$renderContext.quadraticCurveTo(right, bottom, right - _ew, bottom);
            this.$renderContext.lineTo(_x + _ew, bottom);
            this.$renderContext.quadraticCurveTo(_x, bottom, _x, bottom - _eh);
            this.$renderContext.lineTo(_x, _y + _eh);
            this.$renderContext.quadraticCurveTo(_x, _y, _x + _ew, _y);
            this.$renderContext.lineTo(right - _ew, _y);
            this.$renderContext.quadraticCurveTo(right, _y, right, _y + _eh);
            this.$renderContext.lineTo(ax, ay);
            this.$renderContext.closePath();
        }

        /**
         * @language en_US
         * Draw an ellipse.
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @param width {number} Width of the rectangle (in pixels).
         * @param height {number} Height of the rectangle (in pixels).
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 绘制一个椭圆。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width {number} 矩形的宽度（以像素为单位）。
         * @param height {number} 矩形的高度（以像素为单位）。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public drawEllipse(x:number, y:number, width:number, height:number):void {
            var _x:number = x + width / 2;//控制X偏移
            var _y:number = y + height / 2;//控制Y偏移
            var r:number = (width > height) ? width : height;//选宽高较大者做为arc半径参数
            var ratioX:number = width / r;//横轴缩放比率
            var ratioY:number = height / r;//纵轴缩放比率
            r /= 2;
            this.$renderContext.scale(ratioX, ratioY);//进行缩放(均匀压缩)
            this.$renderContext.beginPath();
            this.$renderContext.arc(_x / ratioX, _y / ratioY, r, 0, 2 * Math.PI);
            this.$renderContext.closePath();
            this.$renderContext.scale(1 / ratioX, 1 / ratioY);//缩放回去
        }

        /**
         * @language en_US
         * Specify a line style that will be used for subsequent calls to Graphics methods such as lineTo() and drawCircle().
         * @param thickness {number} An integer, indicating the thickness of the line in points. Valid values are 0 to 255. If a number is not specified, or if the parameter is undefined, a line is not drawn. If a value less than 0 is passed, the default value is 0. Value 0 indicates hairline thickness; the maximum thickness is 255. If a value greater than 255 is passed, the default value is 255.
         * @param color {number} A hexadecimal color value of the line (for example, red is 0xFF0000, and blue is 0x0000FF, etc.). If no value is specified, the default value is 0x000000 (black). Optional.
         * @param alpha {number} Indicates Alpha value of the line's color. Valid values are 0 to 1. If no value is specified, the default value is 1 (solid). If the value is less than 0, the default value is 0. If the value is greater than 1, the default value is 1.
         * @param pixelHinting {boolean} A boolean value that specifies whether to hint strokes to full pixels. This affects both the position of anchors of a curve and the line stroke size itself. With pixelHinting set to true, the line width is adjusted to full pixel width. With pixelHinting set to false, disjoints can appear for curves and straight lines.
         * @param scaleMode {string} Specifies the scale mode to be used
         * @param caps {string} Specifies the value of the CapsStyle class of the endpoint type at the end of the line.
         * @param joints {string} Specifies the type of joint appearance of corner.
         * @param miterLimit {number} Indicates the limit number of cut miter.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 指定一种线条样式以用于随后对 lineTo() 或 drawCircle() 等 Graphics 方法的调用。
         * @param thickness {number} 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color {number} 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha {number} 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting {boolean} 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode {string} 用于指定要使用的比例模式
         * @param caps {string} 用于指定线条末端处端点类型的 CapsStyle 类的值。
         * @param joints {string} 指定用于拐角的连接外观的类型。
         * @param miterLimit {number} 用于表示剪切斜接的极限值的数字。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {
            if (this.strokeStyleColor) {
                this._createEndLineCommand();
            }

            this.strokeStyleColor = this._parseColor(color, alpha);

            this.moveTo(this.lineX, this.lineY);

            this.$renderContext.lineWidth = thickness;
            this.$renderContext.strokeStyle = this.strokeStyleColor;
            this.$renderContext.beginPath();

        }

        /**
         * @language en_US
         * Draw a straight line from the current drawing position to (x, y) using the current line style; the current drawing position is then set to (x, y).
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public lineTo(x:number, y:number):void {
            this.lineX = x;
            this.lineY = y;

            this.$renderContext.lineTo(x, y);
        }

        /**
         * @language en_US
         * Draw a quadratic Bezier curve from the current drawing position to (anchorX, anchorY) using the current line style according to the control points specified by (controlX, controlY). The current drawing position is then set to (anchorX, anchorY).
         * If the curveTo() method is called before the moveTo() method, the default value of the current drawing position is (0, 0). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * The drawn curve is a quadratic Bezier curve. A quadratic Bezier curve contains two anchor points and one control point. The curve interpolates the two anchor points and bends to the control point.
         * @param controlX {number} A number indicating the horizontal position of the control point, relative to the registration point of the parent display object.
         * @param controlY {number} A number indicating the vertical position of the control point, relative to the registration point of the parent display object.
         * @param anchorX {number} A number indicating the horizontal position of the next anchor point, relative to the registration point of the parent display object.
         * @param anchorY {number} A number indicating the vertical position of the next anchor point, relative to the registration point of the parent display object.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX {number} 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY {number} 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX {number} 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY {number} 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number):void {
            this.lineX = anchorX;
            this.lineY = anchorY;

            this.$renderContext.quadraticCurveTo(controlX, controlY, anchorX, anchorY);
        }

        /**
         * @language en_US
         * Draws a cubic Bezier curve from the current drawing position to the specified anchor. Cubic Bezier curves consist of two anchor points and two control points. The curve interpolates the two anchor points and two control points to the curve.
         * @param controlX1 {number} Specifies the first control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY1 {number} Specifies the first control point relative to the registration point of the parent display the vertical position of the object.
         * @param controlX2 {number} Specify the second control point relative to the registration point of the parent display the horizontal position of the object.
         * @param controlY2 {number} Specify the second control point relative to the registration point of the parent display the vertical position of the object.
         * @param anchorX {number} Specifies the anchor point relative to the registration point of the parent display the horizontal position of the object.
         * @param anchorY {number} Specifies the anchor point relative to the registration point of the parent display the vertical position of the object.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 {number} 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 {number} 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 {number} 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 {number} 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX {number} 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY {number} 指定锚点相对于父显示对象的注册点的垂直位置。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public cubicCurveTo(controlX1:number, controlY1:number, controlX2:number, controlY2:number, anchorX:number, anchorY:number):void {
            this.lineX = anchorX;
            this.lineY = anchorY;

            this.$renderContext.bezierCurveTo(controlX1, controlY1, controlX2, controlY2, anchorX, anchorY);
        }

        /**
         * @language en_US
         * Move the current drawing position to (x, y). If any of these parameters is missed, calling this method will fail and the current drawing position keeps unchanged.
         * @param x {number} A number indicating the horizontal position, relative to the registration point of the parent display object (in pixels).
         * @param y {number} A number indicating the vertical position, relative to the registration point of the parent display object (in pixels).
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x {number} 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y {number} 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public moveTo(x:number, y:number):void {
            this.lineX = x;
            this.lineY = y;
            this.$renderContext.moveTo(x, y);
        }

        /**
         * @language en_US
         * Clear graphics that are drawn to this Graphics object, and reset fill and line style settings.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 清除绘制到此 Graphics 对象的图形，并重置填充和线条样式设置。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public clear():void {
            this.lineX = 0;
            this.lineY = 0;
            this.strokeStyleColor = null;
            this.fillStyleColor = null;
            this._minX = 0;
            this._minY = 0;
            this._maxX = 0;
            this._maxY = 0;
            this._firstCheck = true;
            this._dirty = true;
        }

        /**
         * @language en_US
         * Apply fill to the lines and curves added after the previous calling to the beginFill() method.
         * @version Egret 2.0
         * @platform Web,Native
         */
        /**
         * @language zh_CN
         * 对从上一次调用 beginFill()方法之后添加的直线和曲线应用填充。
         * @version Egret 2.0
         * @platform Web,Native
         */
        public endFill():void {
            if (this.fillStyleColor != null || this.strokeStyleColor != null) {
                this._fill();
                this.fillStyleColor = null;
            }
        }

        /**
         * @private
         * 
         */
        private _createEndFillCommand():void {
            this.$renderContext.fill();
            this.$renderContext.closePath();
        }

        /**
         * @private
         * 
         */
        private _fill():void {
            if (this.fillStyleColor) {
                this._createEndFillCommand();
            }
            if (this.strokeStyleColor) {
                this._createEndLineCommand();
            }
        }

        /**
         * @private
         * 
         */
        private _createEndLineCommand():void {
            this.$renderContext.stroke();
            this.$renderContext.closePath();
        }

        /**
         * @private
         */
        private _firstCheck:boolean = true;
        /**
         * @private
         */
        private _minX:number = 0;
        /**
         * @private
         */
        private _minY:number = 0;
        /**
         * @private
         */
        private _maxX:number = 0;
        /**
         * @private
         */
        private _maxY:number = 0;

    }
}