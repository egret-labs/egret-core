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

    ///
    interface SupportedCompressedTextureInfo {
        extensionName: string,
        supportedFormats: Array<[string, number]>,
    }

    //TO DO
    const debugLogCompressedTextureNotSupported = {};

    /**
     * @private
     * WebGL上下文对象，提供简单的绘图接口
     * 抽象出此类，以实现共用一个context
     */
    export class WebGLRenderContext implements egret.sys.RenderContext {

        public static antialias: boolean;

        //
        public _defaultEmptyTexture: WebGLTexture = null;

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
        public static getInstance(width: number, height: number): WebGLRenderContext {
            if (this.instance) {
                return this.instance;
            }
            this.instance = new WebGLRenderContext(width, height);
            return this.instance;
        }

        public $maxTextureSize: number;

        /**
         * 顶点数组管理器
         */
        private vao: WebGLVertexArrayObject;

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

        private bindIndices: boolean;
        /**
         * 启用RenderBuffer
         */
        private activateBuffer(buffer: WebGLRenderBuffer, width: number, height: number): void {

            buffer.rootRenderTarget.activate();

            if (!this.bindIndices) {
                this.uploadIndicesArray(this.vao.getIndices());
            }

            buffer.restoreStencil();

            buffer.restoreScissor();

            this.onResize(width, height);
        }

        /**
         * 上传顶点数据
         */
        private uploadVerticesArray(array: any): void {
            let gl: any = this.context;

            gl.bufferData(gl.ARRAY_BUFFER, array, gl.STREAM_DRAW);
            // gl.bufferSubData(gl.ARRAY_BUFFER, 0, array);
        }

        /**
         * 上传索引数据
         */
        private uploadIndicesArray(array: any): void {
            let gl: any = this.context;
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, array, gl.STATIC_DRAW);
            this.bindIndices = true;
        }

        private vertexBuffer;
        private indexBuffer;

        public constructor(width?: number, height?: number) {

            this.surface = egret.sys.mainCanvas(width, height);

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

            this.setGlobalCompositeOperation("source-over");
        }

        /**
         * 销毁绘制对象
         */
        public destroy(): void {
            this.surface.width = this.surface.height = 0;
        }

        public onResize(width?: number, height?: number): void {
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
            egret.sys.resizeContext(this, width, height, useMaxSize);
            /*
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
            */
        }

        public static glContextId: number = 0;
        public glID: number = null;

        public projectionX: number = NaN;
        public projectionY: number = NaN;

        public contextLost: boolean = false;

        //refactor
        private _supportedCompressedTextureInfo: SupportedCompressedTextureInfo[] = [];
        public pvrtc: any; 
        public etc1: any;
        private _buildSupportedCompressedTextureInfo(/*gl: WebGLRenderingContext, compressedTextureExNames: string[],*/ extensions: any[]): SupportedCompressedTextureInfo[] {
            // if (compressedTextureExNames.length === 0) {
            //     return [];
            // }
            const returnValue: SupportedCompressedTextureInfo[] = [];
            // for (const exName of compressedTextureExNames) {
            //     const extension = gl.getExtension(exName);
            for (const extension of extensions) {
                if (!extension) {
                    continue;
                }

                const info = {
                    extensionName: extension.name,
                    supportedFormats: []
                } as SupportedCompressedTextureInfo;

                //
                for (const key in extension) {
                    info.supportedFormats.push([key, extension[key]]);
                }
                //
                if (DEBUG) {
                    if (info.supportedFormats.length === 0) {
                        console.error('buildSupportedCompressedTextureInfo failed = ' + extension.name);
                    }
                    else {
                        egret.log('support: ' + extension.name);
                        for (const key in extension) {
                            egret.log(key, extension[key], '0x' + extension[key].toString(16));
                        }
                    }
                }
                returnValue.push(info);
            }
            return returnValue;
        }

        private initWebGL(): void {
            this.onResize();

            this.surface.addEventListener("webglcontextlost", this.handleContextLost.bind(this), false);
            this.surface.addEventListener("webglcontextrestored", this.handleContextRestored.bind(this), false);

            this.getWebGLContext();

            let gl = this.context;
            this.$maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);

            //refactor
            // this._caps.astc = this._gl.getExtension('WEBGL_compressed_texture_astc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_astc');
            // this._caps.s3tc = this._gl.getExtension('WEBGL_compressed_texture_s3tc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_s3tc');
            // this._caps.pvrtc = this._gl.getExtension('WEBGL_compressed_texture_pvrtc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
            // this._caps.etc1 = this._gl.getExtension('WEBGL_compressed_texture_etc1') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
            // this._caps.etc2 = this._gl.getExtension('WEBGL_compressed_texture_etc') || this._gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc') ||
            //     this._gl.getExtension('WEBGL_compressed_texture_es3_0'); // also a requirement of OpenGL ES 3
            // const compressedTextureExNames = [
            //     'WEBGL_compressed_texture_pvrtc', 'WEBKIT_WEBGL_compressed_texture_pvrtc',
            //     'WEBGL_compressed_texture_etc1', 'WEBKIT_WEBGL_compressed_texture_etc1',
            //     'WEBGL_compressed_texture_etc', 'WEBKIT_WEBGL_compressed_texture_etc',
            //     'WEBGL_compressed_texture_astc', 'WEBKIT_WEBGL_compressed_texture_astc',
            //     'WEBGL_compressed_texture_s3tc', 'WEBKIT_WEBGL_compressed_texture_s3tc',
            //     'WEBGL_compressed_texture_es3_0'];
            //
            this.pvrtc = gl.getExtension('WEBGL_compressed_texture_pvrtc') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_pvrtc');
            if (this.pvrtc) {
                this.pvrtc.name = 'WEBGL_compressed_texture_pvrtc';                
            }
            //
            this.etc1 = gl.getExtension('WEBGL_compressed_texture_etc1') || gl.getExtension('WEBKIT_WEBGL_compressed_texture_etc1');
            if (this.etc1) {
                this.etc1.name = 'WEBGL_compressed_texture_etc1';                
            }
            //
            egret.Capabilities.supportedCompressedTexture = egret.Capabilities.supportedCompressedTexture || {} as SupportedCompressedTexture;
            egret.Capabilities.supportedCompressedTexture.pvrtc = !!this.pvrtc;
            egret.Capabilities.supportedCompressedTexture.etc1 = !!this.etc1;
            //
            this._supportedCompressedTextureInfo = this._buildSupportedCompressedTextureInfo(/*this.context, compressedTextureExNames,*/ [this.etc1, this.pvrtc]);
        }

        private handleContextLost() {
            this.contextLost = true;
        }

        private handleContextRestored() {
            this.initWebGL();
            this.contextLost = false;
        }

        private getWebGLContext() {
            /*
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
            */
            const gl = egret.sys.getContextWebGL(this.surface);
            this.setContext(gl);
        }

        private setContext(gl: any) {
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
        public createTexture(bitmapData: BitmapData | HTMLCanvasElement): WebGLTexture {
            return egret.sys.createTexture(this, bitmapData);
            /*
            let gl: any = this.context;

            let texture = gl.createTexture();

            if (!texture) {
                //先创建texture失败,然后lost事件才发出来..
                this.contextLost = true;
                return;
            }
            texture[glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData as any);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
            */
        }

        /*
        * TO DO
        */
        private checkCompressedTextureInternalFormat(supportedCompressedTextureInfo: SupportedCompressedTextureInfo[], internalFormat: number): boolean {
            //width: number, height: number max ?
            for (let i = 0, length = supportedCompressedTextureInfo.length; i < length; ++i) {
                const ss = supportedCompressedTextureInfo[i];
                // const formats = ss._COMPRESSED_TEXTURE_FORMATS_;
                // for (let j = 0, length = formats.length; j < length; ++j) {
                //     if (formats[j] === internalFormat) {
                //         return true;
                //     }
                // }
                const supportedFormats = ss.supportedFormats;
                for (let j = 0, length = supportedFormats.length; j < length; ++j) {
                    if (supportedFormats[j][1] === internalFormat) {
                        return true;
                    }
                }
            }
            return false;
        }

        /*
        * TO DO
        */
        private $debugLogCompressedTextureNotSupported(supportedCompressedTextureInfo: SupportedCompressedTextureInfo[], internalFormat: number): void {
            if (!debugLogCompressedTextureNotSupported[internalFormat]) {
                debugLogCompressedTextureNotSupported[internalFormat] = true;
                egret.log('internalFormat = ' + internalFormat + ':' + ('0x' + internalFormat.toString(16)) + ', the current hardware does not support the corresponding compression format.');
                for (let i = 0, length = supportedCompressedTextureInfo.length; i < length; ++i) {
                    const ss = supportedCompressedTextureInfo[i];
                    if (ss.supportedFormats.length > 0) {
                        egret.log('support = ' + ss.extensionName);
                        for (let j = 0, length = ss.supportedFormats.length; j < length; ++j) {
                            const tp = ss.supportedFormats[j];
                            egret.log(tp[0] + ' : ' + tp[1] + ' : ' + ('0x' + tp[1].toString(16)));
                        }
                    }
                }
            }
        }

        //
        private createCompressedTexture(data: Uint8Array, width: number, height: number, levels: number, internalFormat: number): WebGLTexture {
            const checkSupported = this.checkCompressedTextureInternalFormat(this._supportedCompressedTextureInfo, internalFormat);
            if (!checkSupported) {
                this.$debugLogCompressedTextureNotSupported(this._supportedCompressedTextureInfo, internalFormat);
                return this.defaultEmptyTexture;
            }
            ///
            const gl: any = this.context;
            const texture = gl.createTexture() as WebGLTexture;
            if (!texture) {
                this.contextLost = true;
                return;
            }
            texture[glContext] = gl;
            texture[is_compressed_texture] = true;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
            gl.compressedTexImage2D(gl.TEXTURE_2D, levels, internalFormat, width, height, 0, data);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        }

        /**
         * 更新材质的bitmapData
         */
        public updateTexture(texture: WebGLTexture, bitmapData: BitmapData): void {
            let gl: any = this.context;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        }

        public get defaultEmptyTexture(): WebGLTexture {
            if (!this._defaultEmptyTexture) {
                const size = 16;
                const canvas = egret.sys.createCanvas(size, size);
                const context = egret.sys.getContext2d(canvas);//canvas.getContext('2d');
                context.fillStyle = 'white';
                context.fillRect(0, 0, size, size);
                this._defaultEmptyTexture = this.createTexture(canvas);
                this._defaultEmptyTexture[engine_default_empty_texture] = true;
            }
            return this._defaultEmptyTexture;
        }

        public getWebGLTexture(bitmapData: BitmapData): WebGLTexture {
            if (!bitmapData.webGLTexture) {
                if (bitmapData.format == "image" && !bitmapData.hasCompressed2d()) {
                    bitmapData.webGLTexture = this.createTexture(bitmapData.source);
                }
                else if (bitmapData.hasCompressed2d()) {
                    const compressedData = bitmapData.getCompressed2dTextureData();
                    bitmapData.webGLTexture = this.createCompressedTexture(
                        compressedData!.byteArray,
                        compressedData!.width,
                        compressedData!.height,
                        compressedData!.level,
                        compressedData!.glInternalFormat
                    );
                    ///
                    const etcAlphaMask = bitmapData.etcAlphaMask;
                    if (etcAlphaMask) {
                        const maskTexture = this.getWebGLTexture(etcAlphaMask);
                        if (maskTexture) {
                            bitmapData.webGLTexture[etc_alpha_mask] = maskTexture;
                        }
                    }
                }
                if (bitmapData.$deleteSource && bitmapData.webGLTexture) {
                    bitmapData.source = null;
                    bitmapData.clearCompressedTextureData();
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
        public clearRect(x: number, y: number, width: number, height: number): void {
            if (x != 0 || y != 0 || width != this.surface.width || height != this.surface.height) {
                let buffer = this.currentBuffer;
                if (buffer.$hasScissor) {
                    this.setGlobalCompositeOperation("destination-out");
                    this.drawRect(x, y, width, height);
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
                        this.drawRect(x, y, width, height);
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

            if (meshVertices && meshIndices) {
                if (this.vao.reachMaxSize(meshVertices.length / 2, meshIndices.length)) {
                    this.$drawWebGL();
                }
            } else {
                if (this.vao.reachMaxSize()) {
                    this.$drawWebGL();
                }
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

        /**
         * 绘制矩形（仅用于遮罩擦除等）
         */
        public drawRect(x: number, y: number, width: number, height: number): void {
            let buffer = this.currentBuffer;
            if (this.contextLost || !buffer) {
                return;
            }

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.drawCmdManager.pushDrawRect();

            this.vao.cacheArrays(buffer, 0, 0, width, height, x, y, width, height, width, height);
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
            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }
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

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }
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
                offset = this.drawData(data, offset);
                // 计算draw call
                if (data.type == DRAWABLE_TYPE.ACT_BUFFER) {
                    this.activatedBuffer = data.buffer;
                }
                if (data.type == DRAWABLE_TYPE.TEXTURE || data.type == DRAWABLE_TYPE.RECT || data.type == DRAWABLE_TYPE.PUSH_MASK || data.type == DRAWABLE_TYPE.POP_MASK) {
                    if (this.activatedBuffer && this.activatedBuffer.$computeDrawCall) {
                        this.activatedBuffer.$drawCalls++;
                    }
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

            let gl = this.context;
            let program: EgretWebGLProgram;
            let filter = data.filter;

            switch (data.type) {
                case DRAWABLE_TYPE.TEXTURE:
                    //这段的切换可以优化
                    if (filter) {
                        if (filter.type === "custom") {
                            program = EgretWebGLProgram.getProgram(gl, filter.$vertexSrc, filter.$fragmentSrc, filter.$shaderKey);
                        } else if (filter.type === "colorTransform") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.colorTransform_frag, "colorTransform");
                        } else if (filter.type === "blurX") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.blur_frag, "blur");
                        } else if (filter.type === "blurY") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.blur_frag, "blur");
                        } else if (filter.type === "glow") {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.glow_frag, "glow");
                        }
                    } else {
                        if (data.texture[etc_alpha_mask]) {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.texture_etc_alphamask_frag, etc_alpha_mask);
                            ///need refactor
                            gl.activeTexture(gl.TEXTURE1);
                            gl.bindTexture(gl.TEXTURE_2D, data.texture[etc_alpha_mask]);
                        }
                        else {
                            program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.texture_frag, "texture");
                        }
                    }

                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);

                    offset += this.drawTextureElements(data, offset);
                    break;
                case DRAWABLE_TYPE.RECT:

                    program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);

                    offset += this.drawRectElements(data, offset);
                    break;
                case DRAWABLE_TYPE.PUSH_MASK:

                    program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);

                    offset += this.drawPushMaskElements(data, offset);
                    break;
                case DRAWABLE_TYPE.POP_MASK:

                    program = EgretWebGLProgram.getProgram(gl, EgretShaderLib.default_vert, EgretShaderLib.primitive_frag, "primitive");
                    this.activeProgram(gl, program);
                    this.syncUniforms(program, filter, data.textureWidth, data.textureHeight);

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
                        gl.vertexAttribPointer(attribute["aVertexPosition"].location, 2, gl.FLOAT, false, 5 * 4, 0);
                        gl.enableVertexAttribArray(attribute["aVertexPosition"].location);
                    } else if (key === "aTextureCoord") {
                        gl.vertexAttribPointer(attribute["aTextureCoord"].location, 2, gl.FLOAT, false, 5 * 4, 2 * 4);
                        gl.enableVertexAttribArray(attribute["aTextureCoord"].location);
                    } else if (key === "aColor") {
                        gl.vertexAttribPointer(attribute["aColor"].location, 1, gl.FLOAT, false, 5 * 4, 4 * 4);
                        gl.enableVertexAttribArray(attribute["aColor"].location);
                    }
                }

                this.currentProgram = program;
            }
        }

        private syncUniforms(program: EgretWebGLProgram, filter: Filter, textureWidth: number, textureHeight: number): void {
            let uniforms = program.uniforms;
            let isCustomFilter: boolean = filter && filter.type === "custom";
            for (let key in uniforms) {
                if (key === "projectionVector") {
                    uniforms[key].setValue({ x: this.projectionX, y: this.projectionY });
                } else if (key === "uTextureSize") {
                    uniforms[key].setValue({ x: textureWidth, y: textureHeight });
                } else if (key === "uSampler") {
                    uniforms[key].setValue(0);
                }
                else if (key === "uSamplerAlphaMask") {
                    uniforms[key].setValue(1);
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
            return egret.sys.drawTextureElements(this, data, offset);
            /*
            let gl: any = this.context;
            gl.activeTexture(gl.TEXTURE0); ///refactor
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            let size = data.count * 3;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
            */
        }

        /**
         * @private
         * 画rect
         **/
        private drawRectElements(data: any, offset: number): number {
            let gl: any = this.context;
            // gl.bindTexture(gl.TEXTURE_2D, null);
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

        private vertSize: number = 5;

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

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
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
