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
         * 推入一个RenderBuffer并绑定
         */
        public pushBuffer(buffer:WebGLRenderBuffer):void {

            this.$bufferStack.push(buffer);

            if(buffer != this.currentBuffer) {

                if(this.currentBuffer) {
                    this.currentBuffer.$drawWebGL();
                }

                this.activateBuffer(buffer);
            }

            this.currentBuffer = buffer;

        }

        /**
         * 推出一个RenderBuffer并绑定上一个RenderBuffer
         */
        public popBuffer():void {
            // 如果只剩下一个buffer，则不执行pop操作
            // 保证舞台buffer永远在最开始
            if(this.$bufferStack.length <= 1) {
                return;
            }

            var buffer = this.$bufferStack.pop();

            var lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];

            // 重新绑定
            if(buffer != lastBuffer) {
                buffer.$drawWebGL();

                this.activateBuffer(lastBuffer);
            }

            this.currentBuffer = lastBuffer;
        }

        private bindIndices:boolean;
        /**
         * 启用RenderBuffer
         */
        private activateBuffer(buffer:WebGLRenderBuffer):void {

            buffer.rootRenderTarget.activate();

            if(!this.bindIndices) {
                this.uploadIndicesArray(buffer.vao.getIndices());
                this.bindIndices = true;
            }

            buffer.restoreStencil();

            this.onResize(buffer.width, buffer.height);
        }

        /**
         * 上传顶点数据
         */
        public uploadVerticesArray(array:any):void {
            var gl:any =this.context;

            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
            // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
        }

        /**
         * 上传索引数据
         */
        public uploadIndicesArray(array:any):void {
            var gl:any =this.context;

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
        }

        // 当前启用的render target
        // public currentRenderTarget:WebGLRenderTarget;

        /**
         * 启用render target
         */
        // public activateRenderTarget(renderTarget:WebGLRenderTarget) {
        //     renderTarget.activate();
        //     this.currentRenderTarget = renderTarget;
        // }

        /**
         * 从对象池中取出或创建一个新的render target对象。
         */
        // public createRenderTarget(width:number, height:number, activate?:boolean):WebGLRenderTarget {
        //     var gl:any =this.context;
        //
        //     var renderTarget = renderTargetPool.pop();
        //     if (!renderTarget) {
        //         renderTarget = new WebGLRenderTarget(gl, width, height);
        //     } else {
        //         if(width != renderTarget.width || height != renderTarget.height) {
        //             renderTarget.resize(width, height);
        //         } else {
        //             renderTarget.clear(true);
        //         }
        //     }
        //
        //     if(!activate && this.currentRenderTarget) {
        //         this.activateRenderTarget(this.currentRenderTarget);
        //     } else {
        //         this.activateRenderTarget(renderTarget);
        //     }
        //
        //     return renderTarget;
        // }

        /**
         * 释放一个render target实例到对象池
         */
        // public releaseRenderTarget(renderTarget:WebGLRenderTarget):void {
        //     if(!renderTarget){
        //         return;
        //     }
        //     // 是否需要resize以节省内存？
        //     renderTargetPool.push(renderTarget);
        // }

        public vertexBuffer;
        public indexBuffer;

        public constructor(width?:number, height?:number) {

            this.surface = createCanvas(width, height);

            this.initWebGL();

            this.$bufferStack = [];

            var gl = this.context;
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
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
        // public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
        //     this.surface.width = width;
        //     this.surface.height = height;
        // }

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

            // 目前只使用0号材质单元，默认开启
            gl.activeTexture(gl.TEXTURE0);
        }

        /**
         * 开启模版检测
         */
        public enableStencilTest():void {
            var gl:any =this.context;
            gl.enable(gl.STENCIL_TEST);
        }

        /**
         * 关闭模版检测
         */
        public disableStencilTest():void {
            var gl:any =this.context;
            gl.disable(gl.STENCIL_TEST);
        }

        /**
         * 获取像素信息
         */
        public getPixels(x, y, width, height, pixels):void {
            var gl:any =this.context;
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }

        /**
         * 创建一个WebGLTexture
         */
        public createTexture(bitmapData:BitmapData):WebGLTexture {
            var gl:any = this.context;

            var texture = gl.createTexture();

            if (!texture) {
                //先创建texture失败,然后lost事件才发出来..
                this.contextLost = true;
                return;
            }

            texture.glContext = gl;

            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            return texture;
        }

        /**
         * 更新材质的bitmapData
         */
        public updateTexture(texture:WebGLTexture, bitmapData:BitmapData):void {
            var gl:any =this.context;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        }

        /**
         * 获取一个WebGLTexture
         * 如果有缓存的texture返回缓存的texture，如果没有则创建并缓存texture
         */
        public getWebGLTexture(bitmapData:BitmapData):WebGLTexture {
            var _bitmapData:any = bitmapData;
            if (!_bitmapData.webGLTexture) {
                _bitmapData.webGLTexture = {};
            }
            if (!_bitmapData.webGLTexture[this.glID]) {
                var texture = this.createTexture(_bitmapData);
                _bitmapData.webGLTexture[this.glID] = texture;
            }
            return _bitmapData.webGLTexture[this.glID];
        }

        /**
         * 清除颜色缓存
         */
        public clear():void {
            var gl:any = this.context;
            gl.colorMask(true, true, true, true);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        /**
         * 执行绘制命令
         */
        public drawData(data:any, offset:number) {
            if(!data) {
                return;
            }

            switch(data.type) {
                case DRAWABLE_TYPE.TEXTURE:

                    var filter = data.filter;
                    var shader;
                    if (filter && filter.type == "colorTransform") {
                        shader = this.shaderManager.colorTransformShader;
                        shader.setMatrix(filter.matrix);
                    }
                    else if (filter && filter.type == "blur") {
                        shader = this.shaderManager.blurShader;
                        shader.setBlur(filter.blurX, filter.blurY);
                        shader.setUv(data.uv);
                    } else {
                        shader = this.shaderManager.defaultShader;
                    }
                    shader.setProjection(this.projectionX, this.projectionY);
                    this.shaderManager.activateShader(shader, this.vertSize * 4);
                    shader.syncUniforms();

                    offset += this.drawTextureElements(data, offset);
                    break;
                case DRAWABLE_TYPE.RECT:

                    shader = this.shaderManager.primitiveShader;
                    shader.setProjection(this.projectionX, this.projectionY);
                    this.shaderManager.activateShader(shader, this.vertSize * 4);
                    shader.syncUniforms();

                    offset += this.drawRectElements(data, offset);
                    break;
                case DRAWABLE_TYPE.PUSH_MASK:

                    shader = this.shaderManager.primitiveShader;
                    shader.setProjection(this.projectionX, this.projectionY);
                    this.shaderManager.activateShader(shader, this.vertSize * 4);
                    shader.syncUniforms();

                    offset += this.drawPushMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.POP_MASK:

                    shader = this.shaderManager.primitiveShader;
                    shader.setProjection(this.projectionX, this.projectionY);
                    this.shaderManager.activateShader(shader, this.vertSize * 4);
                    shader.syncUniforms();

                    offset += this.drawPopMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.BLEND:
                    this.setBlendMode(data.value);
                    break;
                default:
                    break;
            }

            return offset;
        }

        /**
         * 画texture
         **/
        private drawTextureElements(data:any, offset:number):number {
            var gl:any = this.context;
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            var size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * @private
         * 画rect
         **/
        private drawRectElements(data:any, offset:number):number {
            var gl:any = this.context;
            // gl.bindTexture(gl.TEXTURE_2D, null);
            var size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * 画push mask
         **/
        private drawPushMaskElements(data:any, offset:number):number {
            var gl:any = this.context;

            var size = data.count * 3;

            var buffer = this.currentBuffer;
            if(buffer) {
                if(buffer.stencilHandleCount == 0) {
                    buffer.enableStencil();
                    gl.clear(gl.STENCIL_BUFFER_BIT);// clear
                }

                var level = buffer.stencilHandleCount;
                buffer.stencilHandleCount++;

                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

                // gl.bindTexture(gl.TEXTURE_2D, null);
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
            }

            return size;
        }

        /**
         * 画pop mask
         **/
        private drawPopMaskElements(data:any, offset:number) {
            var gl:any = this.context;

            var size = data.count * 3;

            var buffer = this.currentBuffer;
            if(buffer) {
                buffer.stencilHandleCount--;

                if(buffer.stencilHandleCount == 0) {
                    buffer.disableStencil();// skip this draw
                } else {
                    var level = buffer.stencilHandleCount;
                    gl.colorMask(false, false, false, false);
                    gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                    // gl.bindTexture(gl.TEXTURE_2D, null);
                    gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                    gl.stencilFunc(gl.EQUAL, level, 0xFF);
                    gl.colorMask(true, true, true, true);
                    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);
                }
            }

            return size;
        }

        private vertSize:number = 5;

        /**
         * 设置混色
         */
        public setBlendMode(value:string):void {
            var gl:any =this.context;
            var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
            if (blendModeWebGL) {
                gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
        }

        public static blendModesForGL:any = null;

        public static initBlendMode():void {
            WebGLRenderContext.blendModesForGL = {};
            WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
            WebGLRenderContext.blendModesForGL["lighter"] = [770, 1];
            WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
            WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
            WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
        }
    }

    WebGLRenderContext.initBlendMode();

}
