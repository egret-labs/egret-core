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
    function createCanvas(width?:number, height?:number):HTMLCanvasElement {
        var canvas:HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        $toBitmapData(canvas);
        return canvas;
    }

    // render target 对象池
    var renderTargetPool = [];

    /**
     * @private
     * WebGL上下文对象，提供简单的绘图接口
     * 抽象出此类，以实现共用一个context
     */
    export class WebGLRenderContext {

        /**
         * 渲染上下文
         */
        public context:WebGLRenderingContext;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface:HTMLCanvasElement;

        /**
         * WebGLRenderContext单例
         */
        private static instance:WebGLRenderContext;
        public static getInstance(width:number, height:number):WebGLRenderContext {
            if(this.instance) {
                return this.instance;
            }
            this.instance = new WebGLRenderContext(width, height);
            return this.instance;
        }

        /**
         * render buffer 堆栈
         */
        public $bufferStack:WebGLRenderBuffer[];

        /**
         * 当前绑定的render buffer
         */
        public currentBuffer:WebGLRenderBuffer;

        /**
         * buffer 管理
         */
        public pushBuffer(buffer:WebGLRenderBuffer):void {
            this.$bufferStack.push(buffer);

            this.bindBuffer(buffer);
            this.currentBuffer = buffer;
        }

        public popBuffer():void {
            this.$bufferStack.pop();

            var buffer = this.$bufferStack[this.$bufferStack.length - 1];
            if(buffer) {
                this.bindBuffer(buffer);
                this.currentBuffer = buffer;
            } else {
                this.currentBuffer = null;
            }
        }

        public bindBufferTarget(buffer:WebGLRenderBuffer) {
            this.activateRenderTarget(buffer.rootRenderTarget);
        }

        // 是否绑定了indices，如果绑定了，则不再切换！
        private bindIndices:boolean;
        private bindBufferData(buffer:WebGLRenderBuffer) {
            var gl = this.context;

            if(!this.bindIndices) {
                gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, buffer.indices, gl.STATIC_DRAW);
                this.bindIndices = true;
            }

            buffer.bindBuffer = false;
        }

        private bindBuffer(buffer:WebGLRenderBuffer):void {

            this.bindBufferTarget(buffer);

            this.bindBufferData(buffer);

            buffer.restoreStencil();

            this.onResize(buffer.width, buffer.height);
        }

        // 当前启用的render target
        public currentRenderTarget:WebGLRenderTarget;

        /**
         * 启用render target
         */
        public activateRenderTarget(renderTarget:WebGLRenderTarget) {
            renderTarget.activate();
            this.currentRenderTarget = renderTarget;
        }

        /**
         * 从对象池中取出或创建一个新的render target对象。
         */
        public createRenderTarget(width:number, height:number, activate?:boolean):WebGLRenderTarget {
            var gl = this.context;

            var renderTarget = renderTargetPool.pop();
            if (!renderTarget) {
                renderTarget = new WebGLRenderTarget(gl, width, height);
            } else {
                if(width != renderTarget.width || height != renderTarget.height) {
                    renderTarget.resize(width, height);
                } else {
                    renderTarget.clear(true);
                }
            }

            if(!activate && this.currentRenderTarget) {
                this.activateRenderTarget(this.currentRenderTarget);
            } else {
                this.activateRenderTarget(renderTarget);
            }

            return renderTarget;
        }

        /**
         * 释放一个render target实例到对象池
         */
        public release(renderTarget:WebGLRenderTarget):void {
            if(!renderTarget){
                return;
            }
            // 是否需要resize以节省内存？
            renderTargetPool.push(renderTarget);
        }

        public constructor(width?:number, height?:number) {

            this.surface = createCanvas(width, height);

            this.initWebGL();

            this.$bufferStack = [];
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.surface.width = this.surface.height = 0;
        }

        private onResize(width?:number, height?:number):void {
            var width = width || this.surface.width;
            var height = height || this.surface.height;
            this.projectionX = width / 2;
            this.projectionY = -height / 2;
            if (this.context) {
                this.context.viewport(0, 0, width, height);
            }
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, useMaxSize?:boolean):void {
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

            this.onResize();
        }

        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            this.surface.width = width;
            this.surface.height = height;
        }

        public static glContextId:number = 0;
        public glID:number = null;

        public projectionX:number = NaN;
        public projectionY:number = NaN;
        public shaderManager:WebGLShaderManager = null;
        public contextLost:boolean = false;

        private initWebGL():void {
            this.onResize();

            this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

            this.getWebGLContext();

            this.shaderManager = new WebGLShaderManager(this.context);
        }

        private handleContextLost() {
            this.contextLost = true;
        }

        private handleContextRestored() {
            this.initWebGL();
            //this.shaderManager.setContext(this.context);
            this.contextLost = false;
        }

        private getWebGLContext() {
            var options = {
                stencil: true//设置可以使用模板（用于不规则遮罩）
            };
            var gl:any;
            //todo 是否使用chrome源码names
            //var contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
            var names = ["webgl", "experimental-webgl"];
            for (var i = 0; i < names.length; i++) {
                try {
                    gl = this.surface.getContext(names[i], options);
                } catch (e) {
                }
                if (gl) {
                    break;
                }
            }
            if (!gl) {
                $error(1021);
            }
            this.setContext(gl);
        }

        private setContext(gl:any) {
            this.context = gl;
            gl.id = WebGLRenderContext.glContextId++;
            this.glID = gl.id;

            gl.disable(gl.DEPTH_TEST);
            gl.disable(gl.CULL_FACE);
            gl.enable(gl.BLEND);
            gl.colorMask(true, true, true, true);
        }
    }

}
