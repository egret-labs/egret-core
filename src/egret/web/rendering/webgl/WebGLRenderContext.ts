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
    function createCanvas(): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        return canvas;
    }

    /**
     * @private
     * WebGL上下文对象，提供简单的绘图接口
     * 抽象出此类，以实现共用一个context
     */
    export class WebGLRenderContext {

        public static antialias: boolean;

        /**
         * 第一次上传顶点数组标记量
         */
        public firstTimeUploadVertices: boolean;

        /**
         * 当前program key值
         */
        public currentProgramKey: string;

        /**
         * 渲染上下文
         */
        public context: WebGLRenderingContext;
        /**
         * 呈现最终绘图结果的画布
         */
        public surface: HTMLCanvasElement;

        /**
         * WebGLRenderContext单例
         */
        private static instance: WebGLRenderContext;
        public static getInstance(): WebGLRenderContext {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new WebGLRenderContext();
            return this.instance;
        }

        public $maxTextureSize: number;

        /**
         * 顶点数组管理器
         */
        public vao: WebGLVertexArrayObject;

        /**
         * 绘制命令管理器
         */
        public drawCmdManager: WebGLDrawCmdManager;

        /**
         * render buffer 堆栈
         */
        public $bufferStack: WebGLRenderBuffer[];

        /**
         * 当前绑定的render buffer
         */
        private currentBuffer: WebGLRenderBuffer;

        /**
         * 推入一个RenderBuffer并绑定
         */
        public pushBuffer(buffer: WebGLRenderBuffer): void {

            this.$bufferStack.push(buffer);

            if (buffer != this.currentBuffer) {

                if (this.currentBuffer) {
                    // this.$drawWebGL();
                }

                this.drawCmdManager.pushActivateBuffer(buffer);
            }

            this.currentBuffer = buffer;

        }

        /**
         * 推出一个RenderBuffer并绑定上一个RenderBuffer
         */
        public popBuffer(): void {
            // 如果只剩下一个buffer，则不执行pop操作
            // 保证舞台buffer永远在最开始
            if (this.$bufferStack.length <= 1) {
                return;
            }

            let buffer = this.$bufferStack.pop();

            let lastBuffer = this.$bufferStack[this.$bufferStack.length - 1];

            // 重新绑定
            if (buffer != lastBuffer) {
                // this.$drawWebGL();

                this.drawCmdManager.pushActivateBuffer(lastBuffer);
            }

            this.currentBuffer = lastBuffer;
        }
        /**
         * 启用RenderBuffer
         */
        private activateBuffer(buffer: WebGLRenderBuffer, width: number, height: number): void {

            buffer.rootRenderTarget.activate();

            buffer.restoreStencil();

            buffer.restoreScissor();

            this.onResize(width, height);
        }

        /**
         * 上传顶点数据
         */
        private uploadVerticesArray(array: any): void {
            let gl: any = this.context;

            if (this.firstTimeUploadVertices) {
                gl.bufferData(gl.ARRAY_BUFFER, array, gl.DYNAMIC_DRAW);
                this.firstTimeUploadVertices = false;
            }
            else {
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
            }
        }

        /**
         * 上传索引数据
         */
        private uploadIndicesArray(array: any): void {
            let gl: any = this.context;
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
        }

        private vertexBuffer;
        private indexBuffer;

        public constructor() {

            this.surface = createCanvas();

            if (egret.nativeRender) {
                return;
            }

            this.initWebGL();

            this.$bufferStack = [];

            let gl = this.context;
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            this.drawCmdManager = new WebGLDrawCmdManager();

            this.vao = new WebGLVertexArrayObject();
            this.setBatchSize(2000);

            this.setGlobalCompositeOperation("source-over");

            this.firstTimeUploadVertices = true;

        }

        public setBatchSize(size: number): void {
            const result = this.vao.setBatchSize(size);
            if (result) {
                this.uploadIndicesArray(this.vao.getIndices());
            }
        }

        /**
         * 销毁绘制对象
         */
        public destroy(): void {
            this.surface.width = this.surface.height = 0;
        }

        private onResize(width?: number, height?: number): void {
            width = width || this.surface.width;
            height = height || this.surface.height;
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
        public resize(width: number, height: number, useMaxSize?: boolean): void {
            let surface = this.surface;
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

        public static glContextId: number = 0;
        public glID: number = null;

        public projectionX: number = NaN;
        public projectionY: number = NaN;

        public contextLost: boolean = false;

        private initWebGL(): void {
            this.onResize();

            this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

            this.getWebGLContext();

            let gl = this.context;
            this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        }

        private handleContextLost() {
            this.contextLost = true;
        }

        private handleContextRestored() {
            this.initWebGL();
            this.contextLost = false;
        }

        private getWebGLContext() {
            let options = {
                antialias: WebGLRenderContext.antialias,
                stencil: true//设置可以使用模板（用于不规则遮罩）
            };
            let gl: any;
            //todo 是否使用chrome源码names
            //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
            let names = ["webgl", "experimental-webgl"];
            for (let i = 0; i < names.length; i++) {
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

        public setContext(gl: any) {
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
        public enableStencilTest(): void {
            let gl: any = this.context;
            gl.enable(gl.STENCIL_TEST);
        }

        /**
         * 关闭模版检测
         */
        public disableStencilTest(): void {
            let gl: any = this.context;
            gl.disable(gl.STENCIL_TEST);
        }

        /**
         * 开启scissor检测
         */
        public enableScissorTest(rect: egret.Rectangle): void {
            let gl: any = this.context;
            gl.enable(gl.SCISSOR_TEST);
            gl.scissor(rect.x, rect.y, rect.width, rect.height);
        }

        /**
         * 关闭scissor检测
         */
        public disableScissorTest(): void {
            let gl: any = this.context;
            gl.disable(gl.SCISSOR_TEST);
        }

        /**
         * 获取像素信息
         */
        public getPixels(x, y, width, height, pixels): void {
            let gl: any = this.context;
            gl.readPixels(x, y, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
        }

        /**
         * 创建一个WebGLTexture
         */
        public createTexture(bitmapData: BitmapData): WebGLTexture {
            let gl: any = this.context;

            let texture = gl.createTexture();

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

        private createTextureFromCompressedData(data, width, height, levels, internalFormat): WebGLTexture {
            return null;
        }

        /**
         * 更新材质的bitmapData
         */
        public updateTexture(texture: WebGLTexture, bitmapData: BitmapData): void {
            let gl: any = this.context;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        }

        /**
         * 获取一个WebGLTexture
         * 如果有缓存的texture返回缓存的texture，如果没有则创建并缓存texture
         */
        public getWebGLTexture(bitmapData: BitmapData): WebGLTexture {
            if (!bitmapData.webGLTexture) {
                if (bitmapData.format == "image") {
                    bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                }
                else if (bitmapData.format == "pvr") {//todo 需要支持其他格式
                    bitmapData.webGLTexture = this.createTextureFromCompressedData(bitmapData.source.pvrtcData, bitmapData.width, bitmapData.height, bitmapData.source.mipmapsCount, bitmapData.source.format);
                }
                if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                    bitmapData.source = null;
                }
                if (bitmapData.webGLTexture) {
                    //todo 默认值
                    bitmapData.webGLTexture["smoothing"] = true;
                }
            }
            return bitmapData.webGLTexture;
        }

        /**
         * 清除矩形区域
         */
        //目前没有引用
        public clearRect(x: number, y: number, width: number, height: number): void {
            if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                let buffer = this.currentBuffer;
                if (buffer.$hasScissor) {
                    this.setGlobalCompositeOperation("destination-out");
                    this.setGlobalCompositeOperation("source-over");
                } else {
                    let m = buffer.globalMatrix;
                    if (m.b == 0 && m.c == 0) {
                        x = x * m.a + m.tx;
                        y = y * m.d + m.ty;
                        width = width * m.a;
                        height = height * m.d;
                        this.enableScissor(x, - y - height + buffer.height, width, height);
                        this.clear();
                        this.disableScissor();
                    } else {
                        this.setGlobalCompositeOperation("destination-out");
                        // this.drawRect(x, y, width, height);
                        this.setGlobalCompositeOperation("source-over");
                    }
                }
            } else {
                this.clear();
            }
        }

        /**
         * 设置混色
         */
        public setGlobalCompositeOperation(value: string) {
            this.drawCmdManager.pushSetBlend(value);
        }

        /**
         * 绘制图片，image参数可以是BitmapData或者renderTarget
         */
        public drawImage(image: BitmapData,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number,
            imageSourceWidth: number, imageSourceHeight: number, rotated: boolean, smoothing?: boolean): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let texture: WebGLTexture;
            let offsetX;
            let offsetY;
            if (image["texture"] || (image.source && image.source["texture"])) {
                // 如果是render target
                texture = image["texture"] || image.source["texture"];
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);// 翻转
            } else if (!image.source && !image.webGLTexture) {
                return;
            } else {
                texture = this.getWebGLTexture(image);
            }

            if (!texture) {
                return;
            }

            this.drawTexture(texture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight,
                undefined, undefined, undefined, undefined, rotated, smoothing);

            if (image.source && image.source["texture"]) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }
        }

        /**
         * 绘制图片，image参数可以是BitmapData或者renderTarget
         * 同样的功能，单参数，整合drawTexture部分
         */
        public drawImageByRenderNode(node: sys.NormalBitmapNode) {
            let buffer = this.currentBuffer;
            let image = node.image;
            let destHeight = node.drawH;
            let destWidth = node.drawW;
            let destX = node.drawX;
            let destY = node.drawY;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let texture: WebGLTexture;
            let buffer_offsetX;
            let buffer_offsetY;
            if (image["texture"] || (image.source && image.source["texture"])) {
                // 如果是render target
                texture = image["texture"] || image.source["texture"];
                buffer.saveTransform();
                buffer_offsetX = buffer.$offsetX;
                buffer_offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);// 翻转
            } else if (!image.source && !image.webGLTexture) {
                return;
            } else {
                texture = this.getWebGLTexture(image);
            }

            if (!texture) {
                return;
            }

            let smoothing = node.smoothing;
            if (smoothing != undefined && texture["smoothing"] != smoothing) {
                this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
            }

            let count = 2;
            let width = node.imageWidth;
            let height = node.imageHeight;

            // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
            this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, width, height);

            //cacheArray
            let locWorldTransform = buffer.globalMatrix;
            let a = locWorldTransform.a;
            let b = locWorldTransform.b;
            let c = locWorldTransform.c;
            let d = locWorldTransform.d;
            let tx = locWorldTransform.tx;
            let ty = locWorldTransform.ty;
            let offsetX = buffer.$offsetX;
            let offsetY = buffer.$offsetY;
            if (offsetX != 0 || offsetY != 0) {
                tx = offsetX * a + offsetY * c + tx;
                ty = offsetX * b + offsetY * d + ty;
            }

            if (destX != 0 || destY != 0) {
                tx = destX * a + destY * c + tx;
                ty = destX * b + destY * d + ty;
            }

            let sourceWidth = node.sourceW;
            let sourceHeight = node.sourceH;
            let rotated = node.rotated;

            let a1 = destWidth / sourceWidth;
            if (a1 != 1) {
                a = a1 * a;
                b = a1 * b;
            }
            let d1 = destHeight / sourceHeight;
            if (d1 != 1) {
                c = d1 * c;
                d = d1 * d;
            }

            let float32Array = this.vao.float32Array;
            let uint32Array = this.vao.uint32Array;
            let index = this.vao.vertexIndex * this.vao.vertSize;
            let alpha = buffer.globalAlpha;
            let a_w = a * sourceWidth;
            let b_w = b * sourceWidth;
            let c_h = c * sourceHeight;
            let d_h = d * sourceHeight;

            // xy
            float32Array[index++] = tx;
            float32Array[index++] = ty;
            // uv
            uint32Array[index++] = node.uvs[0];
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = a_w + tx;
            float32Array[index++] = b_w + ty;
            // uv
            uint32Array[index++] = node.uvs[1];
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = a_w + c_h + tx;
            float32Array[index++] = d_h + b_w + ty;
            // uv
            uint32Array[index++] = node.uvs[2];
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = c_h + tx;
            float32Array[index++] = d_h + ty;
            // uv
            uint32Array[index++] = node.uvs[3];
            // alpha
            float32Array[index++] = alpha;

            this.vao.vertexIndex += 4;
            this.vao.indexIndex += 6;

            if (image.source && image.source["texture"]) {
                buffer.$offsetX = buffer_offsetX;
                buffer.$offsetY = buffer_offsetY;
                buffer.restoreTransform();
            }
        }

        /**
         * 绘制Mesh
         */
        public drawMesh(image: BitmapData,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number,
            imageSourceWidth: number, imageSourceHeight: number,
            meshUVs: number[], meshVertices: number[], meshIndices: number[], bounds: Rectangle, rotated: boolean, smoothing: boolean
        ): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let texture: WebGLTexture;
            let offsetX;
            let offsetY;
            if (image["texture"] || (image.source && image.source["texture"])) {
                // 如果是render target
                texture = image["texture"] || image.source["texture"];
                buffer.saveTransform();
                offsetX = buffer.$offsetX;
                offsetY = buffer.$offsetY;
                buffer.useOffset();
                buffer.transform(1, 0, 0, -1, 0, destHeight + destY * 2);// 翻转
            } else if (!image.source && !image.webGLTexture) {
                return;
            } else {
                texture = this.getWebGLTexture(image);
            }

            if (!texture) {
                return;
            }

            this.drawTexture(texture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                imageSourceWidth, imageSourceHeight, meshUVs, meshVertices, meshIndices, bounds, rotated, smoothing);

            if (image["texture"] || (image.source && image.source["texture"])) {
                buffer.$offsetX = offsetX;
                buffer.$offsetY = offsetY;
                buffer.restoreTransform();
            }
        }

        /**
         * 绘制材质
         */
        public drawTexture(texture: WebGLTexture,
            sourceX: number, sourceY: number, sourceWidth: number, sourceHeight: number,
            destX: number, destY: number, destWidth: number, destHeight: number, textureWidth: number, textureHeight: number,
            meshUVs?: number[], meshVertices?: number[], meshIndices?: number[], bounds?: Rectangle, rotated?: boolean, smoothing?: boolean): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !texture || !buffer) {
                return;
            }

            if (smoothing != undefined && texture["smoothing"] != smoothing) {
                this.drawCmdManager.pushChangeSmoothing(texture, smoothing);
            }

            if (meshUVs) {
                this.vao.changeToMeshIndices();
            }

            let count = meshIndices ? meshIndices.length / 3 : 2;
            // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
            this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, textureWidth, textureHeight);

            this.vao.cacheArrays(buffer, sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight, textureWidth, textureHeight,
                meshUVs, meshVertices, meshIndices, rotated);
        }

        public drawTextureByRenderNode(node: sys.TextNode | sys.GraphicsNode): void {
            let texture = node.$texture;
            let sourceWidth = node.$textureWidth;
            let sourceHeight = node.$textureHeight;
            let canvasScaleX = sys.DisplayList.$canvasScaleX;
            let canvasScaleY = sys.DisplayList.$canvasScaleY;
            let destWidth = node.$textureWidth / canvasScaleX;
            let destHeight = node.$textureHeight / canvasScaleY;


            let buffer = this.currentBuffer;
            if (this.contextLost || !texture || !buffer) {
                return;
            }

            let count = 2;
            // 应用$filter，因为只可能是colorMatrixFilter，最后两个参数可不传
            this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, sourceWidth, sourceHeight);

            //cacheArray
            let locWorldTransform = buffer.globalMatrix;
            let a = locWorldTransform.a;
            let b = locWorldTransform.b;
            let c = locWorldTransform.c;
            let d = locWorldTransform.d;
            let tx = locWorldTransform.tx;
            let ty = locWorldTransform.ty;
            let offsetX = buffer.$offsetX;
            let offsetY = buffer.$offsetY;
            if (offsetX != 0 || offsetY != 0) {
                tx = offsetX * a + offsetY * c + tx;
                ty = offsetX * b + offsetY * d + ty;
            }

            let a1 = destWidth / sourceWidth;
            if (a1 != 1) {
                a = a1 * a;
                b = a1 * b;
            }
            let d1 = destHeight / sourceHeight;
            if (d1 != 1) {
                c = d1 * c;
                d = d1 * d;
            }

            let float32Array = this.vao.float32Array;
            let uint32Array = this.vao.uint32Array;
            let index = this.vao.vertexIndex * this.vao.vertSize;
            let alpha = buffer.globalAlpha;
            let a_w = a * sourceWidth;
            let b_w = b * sourceWidth;
            let c_h = c * sourceHeight;
            let d_h = d * sourceHeight;

            // xy
            float32Array[index++] = tx;
            float32Array[index++] = ty;
            // uv
            uint32Array[index++] = 0;
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = a_w + tx;
            float32Array[index++] = b_w + ty;
            // uv
            uint32Array[index++] = 65535;
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = a_w + c_h + tx;
            float32Array[index++] = d_h + b_w + ty;
            // uv
            uint32Array[index++] = 65535 << 16 | 65535;
            // alpha
            float32Array[index++] = alpha;
            // xy
            float32Array[index++] = c_h + tx;
            float32Array[index++] = d_h + ty;
            // uv
            uint32Array[index++] = 65535 << 16;
            // alpha
            float32Array[index++] = alpha;

            this.vao.vertexIndex += 4;
            this.vao.indexIndex += 6;
        }

        /**
         * 绘制粒子
         */
        public drawParticle(node: sys.ParticleNode) {
            let buffer = this.currentBuffer;
            let image = node.image;
            if (this.contextLost || !image || !buffer) {
                return;
            }

            let texture: WebGLTexture = this.getWebGLTexture(image);
            if (!texture) {
                return;
            }

            let count = node.numParticles * 2;
            this.drawCmdManager.pushDrawTexture(texture, count, this.$filter, image.width, image.height);


            let float32Array = this.vao.float32Array;
            let index = this.vao.vertexIndex * this.vao.vertSize;
            float32Array.set(node.vertices, index);

            this.vao.vertexIndex += node.numProperties * node.numParticles;
            this.vao.indexIndex += 6 * node.numParticles;
        }

        /**
         * 绘制遮罩
         */
        public pushMask(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }
            buffer.$stencilList.push({ x, y, width, height });
            this.drawCmdManager.pushPushMask();
            this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
        }

        /**
         * 恢复遮罩
         */
        public popMask(): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }

            let mask = buffer.$stencilList.pop();

            this.drawCmdManager.pushPopMask();
            this.vao.cacheArrays(buffer, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
        }

        /**
         * 清除颜色缓存
         */
        public clear(): void {
            this.drawCmdManager.pushClearColor();
        }

        public $scissorState: boolean = false;
        /**
         * 开启scissor test
         */
        public enableScissor(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            this.drawCmdManager.pushEnableScissor(x, y, width, height);
            buffer.$hasScissor = true;
        }

        /**
         * 关闭scissor test
         */
        public disableScissor(): void {
            let buffer = this.currentBuffer;
            this.drawCmdManager.pushDisableScissor();
            buffer.$hasScissor = false;
        }

        /**
         * 执行目前缓存在命令列表里的命令并清空
         */
        public activatedBuffer: WebGLRenderBuffer;
        public $drawWebGL() {

            //for 3D&2D
            // (this as any).drawFunc();

            //for only2D
            if (this.drawCmdManager.drawDataLen == 0 || this.contextLost) {
                return;
            }

            this.uploadVerticesArray(this.vao.getVertices());

            // 有mesh，则使用indicesForMesh
            if (this.vao.isMesh()) {
                this.uploadIndicesArray(this.vao.getMeshIndices());
            }

            let length = this.drawCmdManager.drawDataLen;
            let offset = 0;
            for (let i = 0; i < length; i++) {
                let data = this.drawCmdManager.drawData[i];
                if (!data) {
                    continue;
                }
                offset = this.drawData(data, offset);
                // 计算draw call
                if (data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    this.activatedBuffer = data.buffer;
                }
                if (data.type != DRAWABLE_TYPE.TEXTURE && data.type != DRAWABLE_TYPE.PUSH_MASK && data.type != DRAWABLE_TYPE.POP_MASK) {
                    continue;
                }
                if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                    this.activatedBuffer.$drawCalls++;
                }
            }

            // 切换回默认indices
            if (this.vao.isMesh()) {
                this.uploadIndicesArray(this.vao.getIndices());
            }

            // 清空数据
            this.drawCmdManager.clear();
            this.vao.clear();
        }

        /**
         * 执行绘制命令
         */
        private drawData(data: any, offset: number) {
            if (!data) {
                return;
            }

            const gl = this.context;
            let program: EgretWebGLProgram;
            const filter = data.filter;

            switch (data.type) {
                case DRAWABLE_TYPE.CHANGE_PROGRAM:
                    program = EgretWebGLProgram.getProgram(gl, data.vertSource, data.fragSource, data.key);
                    this.activeProgram(gl, program);
                    break;
                case DRAWABLE_TYPE.TEXTURE:
                    this.syncUniforms(this.currentProgram, filter, data);
                    offset += this.drawTextureElements(data, offset);
                    break;

                case DRAWABLE_TYPE.PUSH_MASK:
                    this.syncUniforms(this.currentProgram, filter, data);
                    offset += this.drawPushMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.POP_MASK:
                    this.syncUniforms(this.currentProgram, filter, data);
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
                    if (this.activatedBuffer) {
                        let target = this.activatedBuffer.rootRenderTarget;
                        if (target.width != 0 || target.height != 0) {
                            target.clear(true);
                        }
                    }
                    break;
                case DRAWABLE_TYPE.ACT_BUFFER:
                    this.activateBuffer(data.buffer, data.width, data.height);
                    break;
                case DRAWABLE_TYPE.ENABLE_SCISSOR:
                    let buffer = this.activatedBuffer;
                    if (buffer) {
                        if (buffer.rootRenderTarget) {
                            buffer.rootRenderTarget.enabledStencil();
                        }
                        buffer.enableScissor(data.x, data.y, data.width, data.height);
                    }
                    break;
                case DRAWABLE_TYPE.DISABLE_SCISSOR:
                    buffer = this.activatedBuffer;
                    if (buffer) {
                        buffer.disableScissor();
                    }
                    break;
                case DRAWABLE_TYPE.SMOOTHING:
                    gl.bindTexture(gl.TEXTURE_2D, data.texture);
                    if (data.smoothing) {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                    }
                    else {
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
                        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
                    }
                    break;
                default:
                    break;
            }

            return offset;
        }

        public currentProgram: EgretWebGLProgram;
        private activeProgram(gl: WebGLRenderingContext, program: EgretWebGLProgram): void {
            if (program != this.currentProgram) {
                gl.useProgram(program.id);

                // 目前所有attribute buffer的绑定方法都是一致的
                let attribute = program.attributes;

                for (let key in attribute) {
                    if (key === "aVertexPosition") {
                        gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 4 * 4, 0);
                        gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                    }
                    else if (key === "aTextureCoord") {
                        gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.UNSIGNED_SHORT, true, 4 * 4, 2 * 4);
                        gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                    }
                    else if (key === "aColor") {
                        gl.vertexAttribPointer(attribute["aColor"].location, 1, gl.FLOAT, false, 4 * 4, 3 * 4);
                        gl.enableVertexAttribArray(attribute["aColor"].location);
                    }
                    //===== particle begin =====
                    else if (key === "aParticlePosition") {
                        gl.vertexAttribPointer(attribute["aParticlePosition"].location, 2, gl.FLOAT, false, 22 * 4, 0);
                        gl.enableVertexAttribArray(attribute["aParticlePosition"].location);
                    }
                    else if (key === "aParticleTextureCoord") {
                        gl.vertexAttribPointer(attribute["aParticleTextureCoord"].location, 2, gl.FLOAT, false, 22 * 4, 2 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleTextureCoord"].location);
                    }
                    else if (key === "aParticleScale") {
                        gl.vertexAttribPointer(attribute["aParticleScale"].location, 2, gl.FLOAT, false, 22 * 4, 4 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleScale"].location);
                    }
                    else if (key === "aParticleRotation") {
                        gl.vertexAttribPointer(attribute["aParticleRotation"].location, 2, gl.FLOAT, false, 22 * 4, 6 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleRotation"].location);
                    }
                    else if (key === "aParticleRed") {
                        gl.vertexAttribPointer(attribute["aParticleRed"].location, 2, gl.FLOAT, false, 22 * 4, 8 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleRed"].location);
                    }
                    else if (key === "aParticleGreen") {
                        gl.vertexAttribPointer(attribute["aParticleGreen"].location, 2, gl.FLOAT, false, 22 * 4, 10 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleGreen"].location);
                    }
                    else if (key === "aParticleBlue") {
                        gl.vertexAttribPointer(attribute["aParticleBlue"].location, 2, gl.FLOAT, false, 22 * 4, 12 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleBlue"].location);
                    }
                    else if (key === "aParticleAlpha") {
                        gl.vertexAttribPointer(attribute["aParticleAlpha"].location, 2, gl.FLOAT, false, 22 * 4, 14 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleAlpha"].location);
                    }
                    else if (key === "aParticleEmitRotation") {
                        gl.vertexAttribPointer(attribute["aParticleEmitRotation"].location, 2, gl.FLOAT, false, 22 * 4, 16 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleEmitRotation"].location);
                    }
                    else if (key === "aParticleEmitRadius") {
                        gl.vertexAttribPointer(attribute["aParticleEmitRadius"].location, 2, gl.FLOAT, false, 22 * 4, 18 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleEmitRadius"].location);
                    }
                    else if (key === "aParticleTime") {
                        gl.vertexAttribPointer(attribute["aParticleTime"].location, 2, gl.FLOAT, false, 22 * 4, 20 * 4);
                        gl.enableVertexAttribArray(attribute["aParticleTime"].location);
                    }
                    //===== particle end =====
                }

                this.currentProgram = program;
            }
        }

        private syncUniforms(program: EgretWebGLProgram, filter: Filter, data): void {
            let uniforms = program.uniforms;
            for (let key in uniforms) {
                if (key === "projectionVector") {
                    uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                }
                else if (key === "uTextureSize") {
                    uniforms[key].setValue({ x: data.textureWidth, y: data.textureHeight });
                }
                else if (key === "uSampler") {

                }
                else if (key === "uGlobalMatrix") {
                    uniforms[key].setValue([data.a, data.c, data.tx, data.b, data.d, data.ty, 0, 0, 1]);
                }
                else if (key === "uGlobalAlpha") {
                    uniforms[key].setValue(data.alpha);
                }
                else {
                    let value = filter.$uniforms[key];
                    if (value !== undefined) {
                        uniforms[key].setValue(value);
                    } else {
                        // egret.warn("filter custom: uniform " + key + " not defined!");
                    }
                }
            }
        }

        /**
         * 画texture
         **/
        private drawTextureElements(data: any, offset: number): number {
            let gl: any = this.context;
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            let size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * 画push mask
         **/
        private drawPushMaskElements(data: any, offset: number): number {
            let gl: any = this.context;

            let size = data.count * 3;

            let buffer = this.activatedBuffer;
            if (buffer) {
                if (buffer.rootRenderTarget) {
                    buffer.rootRenderTarget.enabledStencil();
                }
                if (buffer.stencilHandleCount == 0) {
                    buffer.enableStencil();
                    gl.clear(gl.STENCIL_BUFFER_BIT);// clear
                }

                let level = buffer.stencilHandleCount;
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
        private drawPopMaskElements(data: any, offset: number) {
            let gl: any = this.context;

            let size = data.count * 3;

            let buffer = this.activatedBuffer;
            if (buffer) {
                buffer.stencilHandleCount--;

                if (buffer.stencilHandleCount == 0) {
                    buffer.disableStencil();// skip this draw
                } else {
                    let level = buffer.stencilHandleCount;
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

        /**
         * 设置混色
         */
        private setBlendMode(value: string): void {
            let gl: any = this.context;
            let blendModeWebGL = WebGLRenderContext.blendModesForGL[value];
            if (blendModeWebGL) {
                gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
            }
        }

        // 记录一个colorTransformFilter
        // 这是一个优化，实现物体在只有一个变色滤镜的情况下，以最简单方式渲染
        // 在$filter有值的情况下，drawImage要注意应用此filter
        public $filter: ColorMatrixFilter;

        /**
         * 应用滤镜绘制给定的render target
         * 此方法不会导致input被释放，所以如果需要释放input，需要调用此方法后手动调用release
         */
        public drawTargetWidthFilters(filters: Filter[], input: WebGLRenderBuffer): void {
            let originInput = input,
                filtersLen: number = filters.length,
                output: WebGLRenderBuffer;

            // 应用前面的滤镜
            if (filtersLen > 1) {
                for (let i = 0; i < filtersLen - 1; i++) {
                    let filter = filters[i];
                    let width: number = input.rootRenderTarget.width;
                    let height: number = input.rootRenderTarget.height;
                    output = WebGLRenderBuffer.create(width, height);
                    output.setTransform(1, 0, 0, 1, 0, 0);
                    output.globalAlpha = 1;
                    this.drawToRenderTarget(filter, input, output);
                    if (input != originInput) {
                        WebGLRenderBuffer.release(input);
                    }
                    input = output;
                }
            }

            // 应用最后一个滤镜并绘制到当前场景中
            let filter = filters[filtersLen - 1];
            this.drawToRenderTarget(filter, input, this.currentBuffer);

            // 释放掉用于交换的buffer
            if (input != originInput) {
                WebGLRenderBuffer.release(input);
            }
        }

        /**
         * 向一个renderTarget中绘制
         * */
        private drawToRenderTarget(filter: Filter, input: WebGLRenderBuffer, output: WebGLRenderBuffer): void {
            if (this.contextLost) {
                return;
            }

            this.pushBuffer(output);

            let originInput = input,
                temp: WebGLRenderBuffer,
                width: number = input.rootRenderTarget.width,
                height: number = input.rootRenderTarget.height;

            // 模糊滤镜分别处理blurX与blurY
            if (filter.type == "blur") {
                let blurXFilter = (<BlurFilter>filter).blurXFilter;
                let blurYFilter = (<BlurFilter>filter).blurYFilter;

                if (blurXFilter.blurX != 0 && blurYFilter.blurY != 0) {
                    temp = WebGLRenderBuffer.create(width, height);
                    temp.setTransform(1, 0, 0, 1, 0, 0);
                    temp.globalAlpha = 1;
                    this.drawToRenderTarget((<BlurFilter>filter).blurXFilter, input, temp);
                    if (input != originInput) {
                        WebGLRenderBuffer.release(input);
                    }
                    input = temp;

                    filter = blurYFilter;
                } else {
                    filter = blurXFilter.blurX === 0 ? blurYFilter : blurXFilter;
                }
            }

            // 绘制input结果到舞台
            output.saveTransform();
            output.transform(1, 0, 0, -1, 0, height);
            this.vao.cacheArrays(output, 0, 0, width, height, 0, 0, width, height, width, height);
            output.restoreTransform();

            this.drawCmdManager.pushDrawTexture(input.rootRenderTarget.texture, 2, filter, width, height);

            // 释放掉input
            if (input != originInput) {
                WebGLRenderBuffer.release(input);
            }

            this.popBuffer();
        }

        public static blendModesForGL: any = null;

        public static initBlendMode(): void {
            WebGLRenderContext.blendModesForGL = {};
            WebGLRenderContext.blendModesForGL["source-over"] = [1, 771];
            WebGLRenderContext.blendModesForGL["lighter"] = [1, 1];
            WebGLRenderContext.blendModesForGL["lighter-in"] = [770, 771];
            WebGLRenderContext.blendModesForGL["destination-out"] = [0, 771];
            WebGLRenderContext.blendModesForGL["destination-in"] = [0, 770];
        }
    }

    WebGLRenderContext.initBlendMode();

}
