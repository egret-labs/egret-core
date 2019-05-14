//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
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

namespace egret.web {

    /**
     * 创建一个canvas。
     */
    function __createCanvas__(width?:number, height?:number):HTMLCanvasElement {
        let canvas:HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        let context = canvas.getContext("2d");
        if (context["imageSmoothingEnabled"] === undefined) {
            let keys = ["webkitImageSmoothingEnabled", "mozImageSmoothingEnabled", "msImageSmoothingEnabled"];
            let key:string;
            for (let i = keys.length - 1; i >= 0; i--) {
                key = keys[i];
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

    let sharedCanvas:HTMLCanvasElement;

    /**
     * @private
     * Canvas2D渲染缓冲
     */
    export class CanvasRenderBuffer implements sys.RenderBuffer {

        public constructor(width?:number, height?:number, root?:boolean) {
            this.surface = __createCanvas__(width, height);
            this.context = this.surface.getContext("2d");
            if (this.context) {
                this.context.$offsetX = 0;
                this.context.$offsetY = 0;
            }
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
            let surface = this.surface;
            if (useMaxSize) {
                let change = false;
                if (surface.width < width) {
                    surface.width = width;
                    change = true;
                }
                if (surface.height < height) {
                    surface.height = height;
                    change = true;
                }
                //尺寸没有变化时,将绘制属性重置
                if(!change) {
                    this.context.globalCompositeOperation = "source-over";
                    this.context.setTransform(1, 0, 0, 1, 0, 0);
                    this.context.globalAlpha = 1;
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
            this.clear();
        }

        /**
         * 获取指定区域的像素
         */
        public getPixels(x:number, y:number, width:number = 1, height:number = 1):number[] {
            return <number[]><any>this.context.getImageData(x, y, width, height).data;
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
            this.context.setTransform(1, 0, 0, 1, 0, 0);
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
