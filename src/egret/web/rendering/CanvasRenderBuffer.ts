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

module egret.web {

    /**
     * @private
     * Canvas2D渲染器
     */
    export class CanvasRenderBuffer implements sys.RenderBuffer {

        public constructor(width:number, height:number) {
            this.createCanvas();
            this.resize(width, height);
        }

        public context:CanvasRenderingContext2D = null;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface:sys.Surface = null;

        /**
         * 改变渲染目标的大小
         * @param width 要改变的宽
         * @param height 要改变的高
         * @param keepMax 若传入true，则将要改变的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, keepMax?:boolean):void {
            var surface = this.surface;
            if (surface) {
                if (keepMax) {
                    if (surface.width < width) {
                        surface.width = width;
                    }
                    if (surface.height < height) {
                        surface.height = height;
                    }
                }
                else {
                    if (surface.width != width) {
                        surface.width = width;
                    }
                    if (surface.height != height) {
                        surface.height = height;
                    }
                }

            }
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            if (this.surface) {
                this.surface.width = this.surface.height = 0;
                this.surface = null;
                this.context = null;
            }
        }

        /**
         * 创建一个canvas。
         */
        private createCanvas():void {
            var canvas:HTMLCanvasElement = document.createElement("canvas");
            $toBitmapData(canvas);
            var context = canvas.getContext("2d");
            if (context["imageSmoothingEnabled"] === undefined) {
                var keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
                for (var i = keys.length - 1; i >= 0; i--) {
                    var key = keys[i];
                    if (context[key] !== void 0) {
                        break;
                    }
                }
                try {
                    Object.defineProperty(context, "imageSmoothingEnabled", {
                        get: function () {
                            return this[key];
                        },
                        set: function (value) {
                            this[key] = value;
                        }
                    });
                }
                catch (e) {
                    context["imageSmoothingEnabled"] = context[key];
                }
            }
            this.surface = <sys.Surface><any>canvas;
            this.context = context;
        }
    }
}