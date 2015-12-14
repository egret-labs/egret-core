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

module egret.sys {

    /**
     * 路径类型
     */
    export const enum PathType {
        /**
         * 纯色填充路径
         */
        Fill = 1,
        /**
         * 渐变填充路径
         */
        GradientFill,
        /**
         * 线条路径
         */
        Stroke,
    }
    /**
     * @private
     * 2D路径命令
     */
    export const enum PathCommand{
        MoveTo = 1,
        LineTo,
        CurveTo,
        CubicCurveTo,
        //以下所有图形实际上都可以用以上的直线和贝塞尔曲线表示，渲染时可以自行转换。
        //定义这些命令主要为了：1.减小记录的数据量。2.降低常用图形在碰撞检测时的复杂度。
        Arc,
        Rect,
        Circle,
        Ellipse
    }

    /**
     * @private
     * 2D路径
     */
    export class Path2D {

        /**
         * 路径类型
         */
        public type:number = 0;

        $commands:number[] = [];
        $data:number[] = [];

        private commandPosition:number = 0;
        private dataPosition:number = 0;
        /**
         * 将当前绘图位置移动到 (x, y)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        public moveTo(x:number, y:number) {
            this.$commands[this.commandPosition++] = PathCommand.MoveTo;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = x;
            this.dataPosition = pos + 2;
        }
        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         */
        public lineTo(x:number, y:number) {
            this.$commands[this.commandPosition++] = PathCommand.LineTo;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = x;
            this.dataPosition = pos + 2;
        }
        /**
         * 使用当前线条样式和由 (controlX, controlY) 指定的控制点绘制一条从当前绘图位置开始到 (anchorX, anchorY) 结束的二次贝塞尔曲线。当前绘图位置随后设置为 (anchorX, anchorY)。
         * 如果在调用 moveTo() 方法之前调用了 curveTo() 方法，则当前绘图位置的默认值为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * 绘制的曲线是二次贝塞尔曲线。二次贝塞尔曲线包含两个锚点和一个控制点。该曲线内插这两个锚点，并向控制点弯曲。
         * @param controlX 一个数字，指定控制点相对于父显示对象注册点的水平位置。
         * @param controlY 一个数字，指定控制点相对于父显示对象注册点的垂直位置。
         * @param anchorX 一个数字，指定下一个锚点相对于父显示对象注册点的水平位置。
         * @param anchorY 一个数字，指定下一个锚点相对于父显示对象注册点的垂直位置。
         */
        public curveTo(controlX:number, controlY:number, anchorX:number, anchorY:number) {
            this.$commands[this.commandPosition++] = PathCommand.CurveTo;
            var pos = this.dataPosition;
            this.$data[pos] = controlX;
            this.$data[pos + 1] = controlY;
            this.$data[pos + 2] = anchorX;
            this.$data[pos + 3] = anchorY;
            this.dataPosition = pos + 4;
        }
        /**
         * 从当前绘图位置到指定的锚点绘制一条三次贝塞尔曲线。三次贝塞尔曲线由两个锚点和两个控制点组成。该曲线内插这两个锚点，并向两个控制点弯曲。
         * @param controlX1 指定首个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY1 指定首个控制点相对于父显示对象的注册点的垂直位置。
         * @param controlX2 指定第二个控制点相对于父显示对象的注册点的水平位置。
         * @param controlY2 指定第二个控制点相对于父显示对象的注册点的垂直位置。
         * @param anchorX 指定锚点相对于父显示对象的注册点的水平位置。
         * @param anchorY 指定锚点相对于父显示对象的注册点的垂直位置。
         */
        public cubicCurveTo(controlX1:number, controlY1:number, controlX2:number,
                            controlY2:number, anchorX:number, anchorY:number) {
            this.$commands[this.commandPosition++] = PathCommand.CubicCurveTo;
            var pos = this.dataPosition;
            this.$data[pos] = controlX1;
            this.$data[pos + 1] = controlY1;
            this.$data[pos + 2] = controlX2;
            this.$data[pos + 3] = controlY2;
            this.$data[pos + 4] = anchorX;
            this.$data[pos + 5] = anchorY;
            this.dataPosition = pos + 6;
        }

        /**
         * 绘制一段圆弧路径。圆弧路径的圆心在 (x, y) 位置，半径为 r ，根据anticlockwise （默认为顺时针）指定的方向从 startAngle 开始绘制，到 endAngle 结束。
         * @param x 圆弧中心（圆心）的 x 轴坐标。
         * @param y 圆弧中心（圆心）的 y 轴坐标。
         * @param radius 圆弧的半径。
         * @param startAngle 圆弧的起始点， x轴方向开始计算，单位以弧度表示。
         * @param endAngle 圆弧的终点， 单位以弧度表示。
         * @param anticlockwise 如果为 true，逆时针绘制圆弧，反之，顺时针绘制。
         */
        public arc(x:number, y:number, radius:number, startAngle:number, endAngle:number, anticlockwise:boolean) {
            this.$commands[this.commandPosition++] = PathCommand.Arc;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = y;
            this.$data[pos + 2] = radius;
            this.$data[pos + 3] = startAngle;
            this.$data[pos + 4] = endAngle;
            this.$data[pos + 5] = anticlockwise ? 1 : 0;
            this.dataPosition = pos + 6;
        }

        /**
         * 绘制一个矩形
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        public rect(x:number, y:number, width:number, height:number) {
            this.$commands[this.commandPosition++] = PathCommand.Rect;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = y;
            this.$data[pos + 2] = width;
            this.$data[pos + 3] = height;
            this.dataPosition = pos + 4;
        }
        /**
         * 绘制一个圆。
         * @param x 圆心相对于父显示对象注册点的 x 位置（以像素为单位）。
         * @param y 相对于父显示对象注册点的圆心的 y 位置（以像素为单位）。
         * @param radius 圆的半径（以像素为单位）。
         */
        public circle(x:number, y:number, radius:number):void {
            this.$commands[this.commandPosition++] = PathCommand.Circle;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = y;
            this.$data[pos + 2] = radius;
            this.dataPosition = pos + 3;
        }

        /**
         * 绘制一个椭圆。
         * @param x 一个表示相对于父显示对象注册点的水平位置的数字（以像素为单位）。
         * @param y 一个表示相对于父显示对象注册点的垂直位置的数字（以像素为单位）。
         * @param width 矩形的宽度（以像素为单位）。
         * @param height 矩形的高度（以像素为单位）。
         */
        public ellipse(x:number, y:number, width:number, height:number):void {
            this.$commands[this.commandPosition++] = PathCommand.Ellipse;
            var pos = this.dataPosition;
            this.$data[pos] = x;
            this.$data[pos + 1] = y;
            this.$data[pos + 2] = width;
            this.$data[pos + 3] = height;
            this.dataPosition = pos + 4;
        }
    }
}