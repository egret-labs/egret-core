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
     * 创建一个canvas。
     */
    function createCanvas(width:number, height:number):HTMLCanvasElement {
        var canvas:HTMLCanvasElement = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
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
        return canvas;
    }

    var sharedCanvas:HTMLCanvasElement = createCanvas(1, 1);

    /**
     * @private
     * Canvas2D渲染器
     */
    export class CanvasRenderBuffer implements sys.RenderBuffer {

        public constructor(width:number, height:number) {
            this.surface = createCanvas(width, height);
            this.context = this.surface.getContext("2d");
        }

        /**
         * 渲染上下文
         */
        public context:CanvasRenderingContext2D;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface:HTMLCanvasElement;

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        public get width():number {
            return this.surface.width;
        }

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        public get height():number {
            return this.surface.height;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, useMaxSize?:boolean):void {
            //在chrome里，小等于256*256的canvas会不启用GPU加速。
            width = Math.max(257, width);
            height = Math.max(257, height);
            var surface = this.surface;
            if (useMaxSize) {
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

        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            var oldContext = this.context;
            var oldSurface = this.surface;
            var newSurface = sharedCanvas;
            var newContext = newSurface.getContext("2d");
            sharedCanvas = oldSurface;
            this.context = newContext;
            this.surface = newSurface;
            newSurface.width = Math.max(width, 257);
            newSurface.height = Math.max(height, 257);
            newContext.setTransform(1, 0, 0, 1, 0, 0);
            newContext.drawImage(oldSurface, offsetX, offsetY);
            oldSurface.height = 1;
            oldSurface.width = 1;
        }

        /**
         * 清空并设置裁切
         * @param regions 矩形列表
         * @param offsetX 矩形偏移量x
         * @param offsetY 矩形偏移量y
         */
        public beginClip(regions:sys.Region[], offsetX?:number, offsetY?:number):void {
            offsetX = +offsetX || 0;
            offsetY = +offsetY || 0;
            var context = this.context;
            context.save();
            context.beginPath();
            context.setTransform(1, 0, 0, 1, offsetX, offsetY);
            var length = regions.length;
            for (var i = 0; i < length; i++) {
                var region = regions[i];
                context.clearRect(region.minX, region.minY, region.width, region.height);
                context.rect(region.minX, region.minY, region.width, region.height);
            }
            context.clip();
        }

        /**
         * 取消上一次设置的clip。
         */
        public endClip():void {
            this.context.restore();
        }

        /**
         * 获取指定坐标的像素
         */
        public getPixel(x:number, y:number):number[] {
            return this.context.getImageData(x, y, 1, 1).data;
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?:string, encoderOptions?:number):string {
            return this.surface.toDataURL(type, encoderOptions);
        }

        /**
         * 清空缓冲区数据
         */
        public clear():void {
            this.context.clearRect(0, 0, this.surface.width, this.surface.height);
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.surface.width = this.surface.height = 0;
        }
    }
}