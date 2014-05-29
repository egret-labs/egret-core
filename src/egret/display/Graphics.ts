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

/// <reference path="../context/renderer/HTML5CanvasRenderer.ts"/>
/// <reference path="../context/renderer/RendererContext.ts"/>

module egret {
    export class Graphics {

        private canvasContext:CanvasRenderingContext2D;
        private commandQueue:Array<Command>;
        private renderContext:RendererContext;

        constructor() {
            this.renderContext = MainContext.instance.rendererContext;
            this.canvasContext = (<HTML5CanvasRenderer>this.renderContext).canvasContext;
            this.commandQueue = [];

        }

        public beginFill(color:number, alpha:number = 1):void {
            var _colorBlue = color & 0x0000FF;
            var _colorGreen = (color & 0x00ff00) >> 8;
            var _colorRed = color >> 16;
            var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";

            this.commandQueue.push(new Command(this._setStyle, this, [_colorStr]))

        }

        private _setStyle(colorStr:string):void {
            this.canvasContext.fillStyle = colorStr;
        }

        public drawRect(x:number, y:number, width:number, height:number):void {
            this.canvasContext.fill()
            var rendererContext = <HTML5CanvasRenderer>this.renderContext;
            this.commandQueue.push(new Command(

                function (x, y, width, height) {
                    this.canvasContext.fillRect(rendererContext._transformTx + x,
                        rendererContext._transformTy + y,
                        width,
                        height);
                },
                this,
                [ x, y, width, height]

            )
            );
        }

        /**
         * @param thickness {number} 一个整数，以点为单位表示线条的粗细，有效值为 0 到 255。如果未指定数字，或者未定义该参数，则不绘制线条。如果传递的值小于 0，则默认值为 0。值 0 表示极细的粗细；最大粗细为 255。如果传递的值大于 255，则默认值为 255。
         * @param color {number} 线条的十六进制颜色值（例如，红色为 0xFF0000，蓝色为 0x0000FF 等）。如果未指明值，则默认值为 0x000000（黑色）。可选。
         * @param alpha 表示线条颜色的 Alpha 值的数字；有效值为 0 到 1。如果未指明值，则默认值为 1（纯色）。如果值小于 0，则默认值为 0。如果值大于 1，则默认值为 1。
         * @param pixelHinting 布尔型值，指定是否提示笔触采用完整像素。它同时影响曲线锚点的位置以及线条笔触大小本身。在 pixelHinting 设置为 true 的情况下，线条宽度会调整到完整像素宽度。在 pixelHinting 设置为 false 的情况下，对于曲线和直线可能会出现脱节。
         * @param scaleMode
         * @param caps
         * @param joints
         * @param miterLimit
         */
        public lineStyle(thickness:number = NaN, color:number = 0, alpha:number = 1.0, pixelHinting:boolean = false, scaleMode:string = "normal", caps:string = null, joints:string = null, miterLimit:number = 3):void {


            this.commandQueue.push(new Command(

                function (thinkness, color) {
                    var _colorBlue = color & 0x0000FF;
                    var _colorGreen = (color & 0x00ff00) >> 8;
                    var _colorRed = color >> 16;
                    var _colorStr = "rgba(" + _colorRed + "," + _colorGreen + "," + _colorBlue + "," + alpha + ")";
                    this.canvasContext.lineWidth = thickness;
                    this.canvasContext.strokeStyle = _colorStr;
//                    this.canvasContext.stroke = color;
                },
                this,
                [thickness, color]

            ))
        }

        /**
         * 使用当前线条样式绘制一条从当前绘图位置开始到 (x, y) 结束的直线；当前绘图位置随后会设置为 (x, y)。如果正在其中绘制的显示对象包含用 Flash 绘图工具创建的内容，则调用 lineTo() 方法将在该内容下面进行绘制。如果在对 moveTo() 方法进行任何调用之前调用了 lineTo()，则当前绘图的默认位置为 (0, 0)。如果缺少任何一个参数，则此方法将失败，并且当前绘图位置不改变。
         * @param x
         * @param y
         */
        public lineTo(x:number, y:number):void {
            var rendererContext = <HTML5CanvasRenderer>this.renderContext;
            this.commandQueue.push(new Command(
                function (x, y) {
                    var canvasContext:CanvasRenderingContext2D = this.canvasContext;

                    canvasContext.beginPath();
                    canvasContext.moveTo(rendererContext._transformTx, rendererContext._transformTx)
                    canvasContext.lineTo(rendererContext._transformTx + x, rendererContext._transformTx + y)
                    canvasContext.stroke();

                },
                this,
                [x, y]

            ))
        }

        public clear():void {
            this.commandQueue.length = 0;
        }

        public endFill():void {
        }

        public _draw():void {
            for (var i = 0 , length = this.commandQueue.length; i < length; i++) {
                var command:Command = this.commandQueue[i];
                command.method.apply(command.thisObject, command.args);
            }
        }
    }

    class Command {

        constructor(public method:Function, public thisObject:any, public args:Array<any>) {

        }


    }
}