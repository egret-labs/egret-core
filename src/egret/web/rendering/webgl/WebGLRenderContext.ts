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
         * 顶点数组管理器
         */
        private vao:WebGLVertexArrayObject;

        /**
         * 绘制命令管理器
         */
        public drawCmdManager:WebGLDrawCmdManager;

        /**
         * render buffer 堆栈
         */
        public $bufferStack:WebGLRenderBuffer[];

        /**
         * 当前绑定的render buffer
         */
        private currentBuffer:WebGLRenderBuffer;

        /**
         * 推入一个RenderBuffer并绑定
         */
        public pushBuffer(buffer:WebGLRenderBuffer):void {

            this.$bufferStack.push(buffer);

            if(buffer != this.currentBuffer) {

                if(this.currentBuffer) {
                    // this.$drawWebGL();
                }

                this.drawCmdManager.pushActivateBuffer(buffer);
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
                // this.$drawWebGL();

                this.drawCmdManager.pushActivateBuffer(lastBuffer);
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
                this.uploadIndicesArray(this.vao.getIndices());
                this.bindIndices = true;
            }

            buffer.restoreStencil();

            this.onResize(buffer.width, buffer.height);
        }

        /**
         * 上传顶点数据
         */
        private uploadVerticesArray(array:any):void {
            var gl:any =this.context;

            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
            // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
        }

        /**
         * 上传索引数据
         */
        private uploadIndicesArray(array:any):void {
            var gl:any =this.context;

            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
        }

        private vertexBuffer;
        private indexBuffer;

        public constructor(width?:number, height?:number) {

            this.surface = createCanvas(width, height);

            this.initWebGL();

            this.$bufferStack = [];

            var gl = this.context;
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            this.drawCmdManager = new WebGLDrawCmdManager();

            this.vao = new WebGLVertexArrayObject();

            this.setGlobalCompositeOperation("source-over");
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
         * 清除矩形区域
         */
        public clearRect(x:number, y:number, width:number, height:number):void {
            if(x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                this.setGlobalCompositeOperation("destination-out");
                this.drawRect(x, y, width, height);
                this.setGlobalCompositeOperation("source-over");
            } else {
                this.clear();
            }
        }

        /**
         * 设置混色
         */
        public setGlobalCompositeOperation(value:string) {
            this.drawCmdManager.pushSetBlend(value);
        }

        /**
         * 绘制图片，image参数可以是BitmapData或者renderTarget
         */
        public drawImage(image:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         imageSourceWidth:number, imageSourceHeight:number):void {
            var buffer = this.currentBuffer;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            var texture:WebGLTexture;
            if(image["texture"]) {
                // 如果是render target
                texture = image["texture"];
                buffer.saveTransform();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);// 翻转
            } else {
                texture = this.getWebGLTexture(image);
            }

            if (!texture) {
                return;
            }

            this.drawTexture(texture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight);

            if(image["texture"]) {
                buffer.restoreTransform();
            }
        }

        /**
         * 绘制Mesh
         */
        public drawMesh(image:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         imageSourceWidth:number, imageSourceHeight:number,
                         meshUVs:number[], meshVertices:number[], meshIndices:number[], bounds:Rectangle
                         ):void {
            if (this.contextLost || !image) {
                return;
            }

            var texture = this.getWebGLTexture(image);
            if (!texture) {
                return;
            }

            this.drawTexture(texture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds);
        }

        /**
         * 绘制材质
         */
        public drawTexture(texture:WebGLTexture,
                             sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                             destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number,
                             meshUVs?:number[], meshVertices?:number[], meshIndices?:number[], bounds?:Rectangle):void {
            var buffer = this.currentBuffer;
            if (this.contextLost || !texture || !buffer) {
                return;
            }

            if(meshVertices && meshIndices) {
                if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                    this.$drawWebGL();
                }
            } else {
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
            }

            if(meshUVs) {
                this.vao.changeToMeshIndices();
            }

            var transform = buffer.globalMatrix;
            var alpha = buffer.globalAlpha;

            var count = meshIndices ? meshIndices.length / 3 : 2;
            this.drawCmdManager.pushDrawTexture(texture, count);

            this.vao.cacheArrays(transform, alpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight,
                meshUVs, meshVertices, meshIndices);
        }

        /**
         * 绘制矩形（仅用于遮罩擦除等）
         */
        public drawRect(x:number, y:number, width:number, height:number):void {
            var buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.drawCmdManager.pushDrawRect();

            this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, width, height, x, y, width, height, width, height);
        }

        /**
         * 绘制遮罩
         */
        public pushMask(mask):void {
            var buffer = this.currentBuffer;
            if(this.contextLost || !buffer) {
                return;
            }

            buffer.$stencilList.push(mask);

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            var length = mask.length;
            if (length) {
                this.drawCmdManager.pushPushMask(length);
                for (var i = 0; i < length; i++) {
                    var item:sys.Region = mask[i];
                    this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                }
            }
            else {
                this.drawCmdManager.pushPushMask();
                this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            }
        }

        /**
         * 恢复遮罩
         */
        public popMask():void {
            var buffer = this.currentBuffer;
            if(this.contextLost || !buffer) {
                return;
            }

            var mask = buffer.$stencilList.pop();

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            var length = mask.length;
            if (length) {
                this.drawCmdManager.pushPopMask(length);
                for (var i = 0; i < length; i++) {
                    var item:sys.Region = mask[i];
                    this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                }
            }
            else {
                this.drawCmdManager.pushPopMask();
                this.vao.cacheArrays(buffer.globalMatrix, buffer.globalAlpha, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
            }
        }

        /**
         * 清除颜色缓存
         */
        public clear():void {
            this.drawCmdManager.pushClearColor();
        }

        /**
         * 执行目前缓存在命令列表里的命令并清空
         */
        public activatedBuffer:WebGLRenderBuffer;
        public $drawWebGL() {
            if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                return;
            }

            this.uploadVerticesArray(this.vao.getVertices());

            // 有mesh，则使用indicesForMesh
            if (this.vao.isMesh()){
                this.uploadIndicesArray(this.vao.getMeshIndices());
            }

            var length = this.drawCmdManager.drawDataLen;
            var offset = 0;
            for (var i = 0; i < length; i++) {
                var data = this.drawCmdManager.drawData[i];
                offset = this.drawData(data, offset);
                // 计算draw call
                if(data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    this.activatedBuffer = data.buffer;
                }
                if(data.type == DRAWABLE_TYPE.TEXTURE || data.type == DRAWABLE_TYPE.RECT || data.type == DRAWABLE_TYPE.PUSH_MASK || data.type == DRAWABLE_TYPE.POP_MASK) {
                    if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                        this.activatedBuffer.$drawCalls++;
                    }
                }
            }

            // 切换回默认indices
            if (this.vao.isMesh()){
                this.uploadIndicesArray(this.vao.getIndices());
            }

            // 清空数据
            this.drawCmdManager.clear();
            this.vao.clear();
        }

        /**
         * 执行绘制命令
         */
        private drawData(data:any, offset:number) {
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
                        shader.setTextureSize(filter.textureWidth, filter.textureHeight);
                    }
                    else if (filter && filter.type == "glow") {
                        shader = this.shaderManager.glowShader;
                        shader.setDistance(filter.distance);
                        shader.setAngle(filter.angle);
                        shader.setColor(filter.$red, filter.$green, filter.$blue);
                        shader.setAlpha(filter.alpha);
                        shader.setBlurX(filter.blurX);
                        shader.setBlurY(filter.blurY);
                        shader.setStrength(filter.strength);
                        shader.setInner(filter.inner);
                        shader.setKnockout(filter.knockout);
                        shader.setTextureSize(filter.textureWidth, filter.textureHeight);
                    }
                    else {
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
                case DRAWABLE_TYPE.RESIZE_TARGET:
                    data.buffer.rootRenderTarget.resize(data.width, data.height);
                    this.onResize(data.width, data.height);
                    break;
                case DRAWABLE_TYPE.CLEAR_COLOR:
                    if(this.activatedBuffer) {
                        var target = this.activatedBuffer.rootRenderTarget;
                        if(target.width != 0 || target.height != 0) {
                            target.clear();
                        }
                    }
                    break;
                case DRAWABLE_TYPE.ACT_BUFFER:
                    this.activateBuffer(data.buffer);
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

            var buffer = this.activatedBuffer;
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

            var buffer = this.activatedBuffer;
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
        private setBlendMode(value:string):void {
            var gl:any =this.context;
            var blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
            if (blendModeWebGL) {
                gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
        }

        /**
         * 应用滤镜绘制给定的render target
         * 此方法不会导致input被释放，所以如果需要释放input，需要调用此方法后手动调用release
         */
        public drawTargetWidthFilters(filters:Filter[], input:WebGLRenderBuffer):void {
            var originInput = input,
            filtersLen:number = filters.length,
            output:WebGLRenderBuffer;

            // 应用前面的滤镜
            if(filtersLen > 1) {
                for(var i = 0; i < filtersLen - 1; i++) {
                    var filter = filters[i];
                    var width:number = input.rootRenderTarget.width;
                    var height:number = input.rootRenderTarget.height;
                    output = WebGLRenderBuffer.create(width, height);
                    output.setTransform(1, 0, 0, 1, 0, 0);
                    output.globalAlpha = 1;
                    this.drawToRenderTarget(filter, input, output);
                    if(input != originInput) {
                        WebGLRenderBuffer.release(input);
                    }
                    input = output;
                }
            }

            // 应用最后一个滤镜并绘制到当前场景中
            var filter = filters[filtersLen - 1];
            this.drawToRenderTarget(filter, input, this.currentBuffer);

            // 释放掉用于交换的buffer
            if(input != originInput) {
                WebGLRenderBuffer.release(input);
            }
        }

        private getUv(sourceX, sourceY, sourceWidth, sourceHeight, textureSourceWidth, textureSourceHeight) {
            var uv = [
                0, 0,
                1, 1
            ];
            for (var i = 0, l = uv.length; i < l; i += 2) {
                var u = uv[i];
                var v = uv[i + 1];
                // uv
                uv[i] = (sourceX + u * sourceWidth) / textureSourceWidth;
                uv[i + 1] = (sourceY + v * sourceHeight) / textureSourceHeight;
            }
            return uv;
        }

        /**
         * 向一个renderTarget中绘制
         * */
        private drawToRenderTarget(filter:Filter, input:WebGLRenderBuffer, output:WebGLRenderBuffer):void {
            if (this.contextLost) {
                return;
            }

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.pushBuffer(output);

            var originInput = input,
            temp:WebGLRenderBuffer;

            // 模糊滤镜实现为blurX与blurY的叠加
            if (filter.type == "blur") {
                if((<BlurFilter>filter).blurX != 0 && (<BlurFilter>filter).blurY != 0) {
                    if (!this.blurFilter) {
                        this.blurFilter = new egret.BlurFilter(2, 2);
                    }
                    this.blurFilter.blurX = (<BlurFilter>filter).blurX;
                    this.blurFilter.blurY = 0;
                    var width:number = input.rootRenderTarget.width;
                    var height:number = input.rootRenderTarget.height;
                    temp = WebGLRenderBuffer.create(width, height);
                    temp.setTransform(1, 0, 0, 1, 0, 0);
                    temp.globalAlpha = 1;
                    this.drawToRenderTarget(this.blurFilter, input, temp);
                    if(input != originInput) {
                        WebGLRenderBuffer.release(input);
                    }
                    input = temp;
                }
            }

            // 绘制input结果到舞台
            var width:number = input.rootRenderTarget.width;
            var height:number = input.rootRenderTarget.height;
            if (filter.type == "blur"){
                if (!this.blurFilter) {
                    this.blurFilter = new egret.BlurFilter(2, 2);
                }
                if((<BlurFilter>filter).blurX == 0 || (<BlurFilter>filter).blurY == 0) {
                    this.blurFilter.blurX = (<BlurFilter>filter).blurX;
                    this.blurFilter.blurY = (<BlurFilter>filter).blurY;
                } else {
                    this.blurFilter.blurX = 0;
                    this.blurFilter.blurY = (<BlurFilter>filter).blurY;
                }
                filter = this.blurFilter;
            }
            output.saveTransform();
            output.transform(1, 0, 0, -1, 0, height);
            this.vao.cacheArrays(output.globalMatrix, output.globalAlpha, 0, 0, width, height, 0, 0, width, height, width, height);
            output.restoreTransform();

            var filterData = {type: "", distance: 0, angle: 0, alpha: 0, strength: 0, $red: 0, $green: 0, $blue: 0, matrix: null, blurX: 0, blurY: 0, inner: 0, knockout: 0, textureWidth: 0, textureHeight: 0};
            if(filter.type == "colorTransform") {
                filterData.type = "colorTransform";
                filterData.matrix = (<ColorMatrixFilter>filter).matrix;
            } else if(filter.type == "blur") {
                filterData.type = "blur";
                filterData.blurX = (<BlurFilter>filter).blurX;
                filterData.blurY = (<BlurFilter>filter).blurY;
                filterData.textureWidth = width;
                filterData.textureHeight = height;
            } else if(filter.type == "glow") {
                filterData.type = "glow";
                filterData.distance = (<DropShadowFilter>filter).distance || 0;
                filterData.angle = (<DropShadowFilter>filter).angle ? (<DropShadowFilter>filter).angle / 180 * Math.PI : 0;
                filterData.$red = (<GlowFilter>filter).$red / 255;
                filterData.$green = (<GlowFilter>filter).$green / 255;
                filterData.$blue = (<GlowFilter>filter).$blue / 255;
                filterData.alpha = (<GlowFilter>filter).alpha;
                filterData.blurX = (<GlowFilter>filter).blurX;
                filterData.blurY = (<GlowFilter>filter).blurY;
                filterData.strength = (<GlowFilter>filter).strength;
                filterData.inner = (<GlowFilter>filter).inner ? 1 : 0;
                filterData.knockout = (<GlowFilter>filter).knockout ? 0 : 1;
                
                filterData.textureWidth = width;
                filterData.textureHeight = height;
            }
            this.drawCmdManager.pushDrawTexture(input["rootRenderTarget"].texture, 2, filterData);

            // 释放掉input
            if(input != originInput) {
                WebGLRenderBuffer.release(input);
            }

            this.popBuffer();
        }

        private colorMatrixFilter = null;
        private blurFilter = null;

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
