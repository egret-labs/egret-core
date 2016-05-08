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
     * draw类型，所有的绘图操作都会缓存在drawData中，每个drawData都是一个drawable对象
     * $renderWebGL方法依据drawable对象的类型，调用不同的绘制方法
     * TODO 提供drawable类型接口并且创建对象池？
     */
     const enum DRAWABLE_TYPE {
         TEXTURE,
         RECT,
         PUSH_MASK,
         POP_MASK,
         BLEND
     }

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
     * WebGL渲染器
     */
    export class WebGLRenderBuffer implements sys.RenderBuffer {

        /**
         * 渲染上下文
         */
        public renderContext:WebGLRenderContext;

        public constructor(width?:number, height?:number) {
            // 获取webglRenderContext
            this.renderContext = WebGLRenderContext.getInstance(width, height);
            // webGL上下文，未来可替换为WebGLRenderContext暴露给外层？
            this.context = this.renderContext.context;
            // buffer 对应的 render target
            this.rootRenderTarget = this.renderContext.createRenderTarget(width, height);

            // TODO 抽像WebGLState类用于管理webgl状态，包括stencil，blend，colorMask等等
            this.stencilState = false;

            this.initVertexArrayObjects();

            this.setGlobalCompositeOperation("source-over");

            // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
            if(this.renderContext.$bufferStack.length == 0) {
                this.renderContext.pushBuffer(this);
                // 画布
                this.surface = this.renderContext.surface;
            } else {
                this.surface = this.rootRenderTarget;
            }
        }

        private filters = [];
        public pushFilters(filters) {
            this.filters.push(filters);
        }
        public popFilters() {
            this.filters.pop();
        }
        public clearFilters() {
            this.filters.length = 0;
        }

        /**
         * webgl渲染上下文
         */
        public context:WebGLRenderingContext;

        /**
         * 如果是舞台缓存，为canvas
         * 如果是普通缓存，为renderTarget
         */
        public surface:any;

        /**
         * root render target
         * 根渲染目标，用来执行主渲染
         */
        public rootRenderTarget:WebGLRenderTarget;

        /**
         * 初始化顶点数组和缓存
         */
        private size:number = 2000;
        public vertices:Float32Array = null;
        private vertSize:number = 5;
        public indices:Uint16Array = null;
        public vertexBuffer;
        public indexBuffer;
        public initVertexArrayObjects() {
            var numVerts = this.size * 4 * this.vertSize;
            var numIndices = this.size * 6;

            this.vertices = new Float32Array(numVerts);
            this.indices = new Uint16Array(numIndices);

            for (var i = 0, j = 0; i < numIndices; i += 6, j += 4) {
                this.indices[i + 0] = j + 0;
                this.indices[i + 1] = j + 1;
                this.indices[i + 2] = j + 2;
                this.indices[i + 3] = j + 0;
                this.indices[i + 4] = j + 2;
                this.indices[i + 5] = j + 3;
            }

            var gl = this.context;
            this.vertexBuffer = gl.createBuffer();
            this.indexBuffer = gl.createBuffer();
        }

        /**
         * stencil state
         * 模版开关状态
         */
        private stencilState:boolean;

        public $stencilList = [];
        public stencilHandleCount:number = 0;

        public enableStencil():void {
            if(!this.stencilState) {
                var gl = this.context;
                gl.enable(gl.STENCIL_TEST);
                this.stencilState = true;
            }
        }

        public disableStencil():void {
            if(this.stencilState) {
                var gl = this.context;
                gl.disable(gl.STENCIL_TEST);
                this.stencilState = false;
            }
        }

        public restoreStencil():void {
            var gl = this.context;
            if(this.stencilState) {
                gl.enable(gl.STENCIL_TEST);
            } else {
                gl.disable(gl.STENCIL_TEST);
            }
        }

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        public get width():number {
            return this.rootRenderTarget.width;
        }

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        public get height():number {
            return this.rootRenderTarget.height;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, useMaxSize?:boolean):void {
            // render target 尺寸重置
            this.rootRenderTarget.resize(width, height);

            this.renderContext.pushBuffer(this);

            // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
            if(this.renderContext.$bufferStack[0] == this) {
                this.renderContext.resize(width, height, useMaxSize);
                this.clear();
            }

            this.renderContext.popBuffer();
        }



        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            // TODO 这里用于cacheAsBitmap的实现

            // var oldSurface = this.surface;
            // var oldWidth = oldSurface.width;
            // var oldHeight = oldSurface.height;
            // this.renderContext.resizeTo(width, height, offsetX, offsetY);
            // renderTexture resize, copy color data
            // this.drawFrameBufferToSurface(0, 0, oldWidth, oldHeight, offsetX, offsetY, oldWidth, oldHeight, true);

        }

        // dirtyRegionPolicy hack
        private dirtyRegionPolicy:boolean = true;
        private _dirtyRegionPolicy:boolean = true;// 默认设置为true，保证第一帧绘制在frameBuffer上
        public setDirtyRegionPolicy(state:string):void {
            this.dirtyRegionPolicy = (state == "on");
        }

        /**
         * 清空并设置裁切
         * @param regions 矩形列表
         * @param offsetX 矩形要加上的偏移量x
         * @param offsetY 矩形要加上的偏移量y
         */
        public beginClip(regions:sys.Region[], offsetX?:number, offsetY?:number):void {

            // dirtyRegionPolicy hack
            if(this._dirtyRegionPolicy) {
                this.rootRenderTarget.useFrameBuffer = true;
                this.renderContext.bindBufferTarget(this);
            } else {
                this.rootRenderTarget.useFrameBuffer = false;
                this.renderContext.bindBufferTarget(this);
                this.clear();
            }

            offsetX = +offsetX || 0;
            offsetY = +offsetY || 0;
            this.setTransform(1, 0, 0, 1, offsetX, offsetY);
            var length = regions.length;
            //只有一个区域且刚好为舞台大小时,不设置模板
            if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                regions[0].width == this.rootRenderTarget.width && regions[0].height == this.rootRenderTarget.height) {
                this.maskPushed = false;
                this.rootRenderTarget.useFrameBuffer && this.clear();
                return;
            }
            // 擦除脏矩形区域
            for (var i = 0; i < length; i++) {
                var region = regions[i];
                this.clearRect(region.minX, region.minY, region.width, region.height);
            }
            // 设置模版
            if (length > 0) {
                this.pushMask(regions);
                this.maskPushed = true;
                this.offsetX = offsetX;
                this.offsetY = offsetY;
            }
            else {
                this.maskPushed = false;
            }
        }

        private maskPushed:boolean;
        private offsetX:number;
        private offsetY:number;

        /**
         * 取消上一次设置的clip。
         */
        public endClip():void {
            if (this.maskPushed) {
                this.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                this.popMask();
            }
        }

        /**
         * 获取指定坐标的像素
         */
        public getPixel(x:number, y:number):number[] {
            var gl = this.context;
            var pixels = new Uint8Array(4);

            var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
            this.rootRenderTarget.useFrameBuffer = true;
            this.renderContext.pushBuffer(this);

            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
            this.renderContext.popBuffer();

            return <number[]><any>pixels;
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?:string, encoderOptions?:number):string {
            return this.renderContext.surface.toDataURL(type, encoderOptions);
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.renderContext.destroy();
        }

        public onRenderFinish():void {
            this.$drawCalls = 0;

            // 如果是舞台渲染buffer，判断脏矩形策略
            if(this.renderContext.$bufferStack.length == 1) {
                // dirtyRegionPolicy hack
                if(!this._dirtyRegionPolicy && this.dirtyRegionPolicy) {
                    this.drawSurfaceToFrameBuffer(0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, 0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, true);
                }
                if(this._dirtyRegionPolicy) {
                    this.drawFrameBufferToSurface(0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, 0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height);
                }
                this._dirtyRegionPolicy = this.dirtyRegionPolicy;
            }
        }

        /**
         * 交换frameBuffer中的图像到surface中
         * @param width 宽度
         * @param height 高度
         */
        private drawFrameBufferToSurface(sourceX:number,
          sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number, clear:boolean = false):void {
            var gl = this.context;

            this.rootRenderTarget.useFrameBuffer = false;
            this.renderContext.pushBuffer(this);
            var target = this.rootRenderTarget;

            gl.disable(gl.STENCIL_TEST);// 切换frameBuffer注意要禁用STENCIL_TEST
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawImage(<BitmapData><any>target, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = true;
            this.renderContext.popBuffer();
        }
        /**
         * 交换surface的图像到frameBuffer中
         * @param width 宽度
         * @param height 高度
         */
        private drawSurfaceToFrameBuffer(sourceX:number,
          sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number, clear:boolean = false):void {
            var gl = this.context;

            this.rootRenderTarget.useFrameBuffer = true;
            this.renderContext.pushBuffer(this);

            gl.disable(gl.STENCIL_TEST);// 切换frameBuffer注意要禁用STENCIL_TEST
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawImage(<BitmapData><any>this.renderContext.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = false;
            this.renderContext.popBuffer();
        }

        /**
         * 清空缓冲区数据
         */
        public clear():void {
            if(this.rootRenderTarget.width != 0 && this.rootRenderTarget.height != 0) {
                var gl:any = this.context;
                gl.colorMask(true, true, true, true);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }
        }

        /**
         * @private
         */
        public clearRect(x:number, y:number, width:number, height:number):void {
            this.setGlobalCompositeOperation("destination-out");
            this.drawRect(x, y, width, height);
            this.setGlobalCompositeOperation("source-over");
        }

        //Rendering Functions begin
        public drawImage(texture:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         textureSourceWidth:number, textureSourceHeight:number):void {
            if (this.renderContext.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }
            //if (this.filters) {
            //    for (var i = 0; i < 1; i++) {
            //        var filter:Filter = this.filters[0];
            //        if (filter.type == "glow") {
            //            this.useGlow(image, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
            //            return;
            //        }
            //    }
            //}
            var webGLTexture:WebGLTexture;
            if(texture["texture"]) {
                // 如果是render target
                webGLTexture = texture["texture"];
                this.saveTransform();
                this.transform(1, 0, 0, -1, 0, destHeight);// 翻转
            } else {
                this.createWebGLTexture(texture);
                webGLTexture = texture["webGLTexture"][this.renderContext.glID];
            }

            if (!webGLTexture) {
                return;
            }
            this.drawTexture(webGLTexture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                textureSourceWidth, textureSourceHeight);
            if(texture["texture"]) {
                this.restoreTransform();
            }
        }

        private currentBaseTexture:Texture = null;
        private currentBatchSize:number = 0;

        private colorMatrixFilter = null;
        private blurFilter = null;
        /**
         * @private
         * draw a texture use default shader
         * */
        public drawTexture(texture:WebGLTexture,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number):void {
            if (this.renderContext.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }
            var webGLTexture = <Texture>texture;
            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
            }


            if(this.filters.length > 0) {// 应用滤镜
                var resultTexture:WebGLTexture;

                // 构建filters列表
                var filters = [];
                for(var i = 0; i < this.filters.length; i++) {
                    filters = filters.concat(this.filters[i]);
                }
                var len = filters.length;

                var tempBuffer = null;
                if(len > 1) {
                    var lastTexture = webGLTexture;
                    for(var i = 0; i < len - 1; i++) {
                        var filter = filters[i];
                        var lastTempBuffer = tempBuffer;
                        tempBuffer = this.createRenderBuffer(sourceWidth, sourceHeight);

                        //最后把结果绘制到tempBuffer上
                        this.applyFilter(filter, lastTexture, tempBuffer, sourceWidth, sourceHeight, textureWidth, textureHeight);

                        lastTexture = tempBuffer.rootRenderTarget.texture;

                        if(lastTempBuffer) {
                            lastTempBuffer.clearFilters();
                            lastTempBuffer.filterType = "";
                            renderBufferPool.push(lastTempBuffer);
                        }
                    }

                    resultTexture = lastTexture;

                } else {
                    resultTexture = webGLTexture;
                }

                // 直接在舞台上绘制
                this.$drawWebGL();

                this.currentBaseTexture = null;

                // 应用最后的滤镜
                this.filterType = filters[len - 1].type;
                var filter = this.filter = filters[len - 1];

                if(filter.type == "glow") {
                    if(!this.colorMatrixFilter) {
                        this.colorMatrixFilter = new ColorMatrixFilter();
                    }
                    if(!this.blurFilter) {
                        this.blurFilter = new BlurFilter(2, 2);
                    }

                    //绘制纯色图
                    var tempBuffer1 = this.createRenderBuffer(sourceWidth, sourceHeight);
                    this.colorMatrixFilter.matrix = [
                        0, 0, 0, 0, filter.$red,
                        0, 0, 0, 0, filter.$green,
                        0, 0, 0, 0, filter.$blue,
                        0, 0, 0, 0, filter.alpha,
                    ];
                    this.applyFilter(this.colorMatrixFilter, resultTexture, tempBuffer1, sourceWidth, sourceHeight, textureWidth, textureHeight);

                    // 应用blur
                    var tempBuffer2 = this.createRenderBuffer(sourceWidth, sourceHeight);
                    this.blurFilter.blurX = filter.blurX;
                    this.blurFilter.blurY = filter.blurY;
                    this.applyFilter(this.blurFilter, tempBuffer1.rootRenderTarget.texture, tempBuffer2, sourceWidth, sourceHeight, textureWidth, textureHeight);
                    tempBuffer1.clearFilters();
                    tempBuffer1.filterType = "";
                    renderBufferPool.push(tempBuffer1);

                    // 应用n次
                    var tempBuffer3 = this.createRenderBuffer(sourceWidth, sourceHeight);
                    this.blurFilter.blurX = filter.blurX;
                    this.blurFilter.blurY = filter.blurY;
                    for(var j = 0; j < filter.quality; j++) {
                        this.applyFilter(this.blurFilter, tempBuffer2.rootRenderTarget.texture, tempBuffer3, sourceWidth, sourceHeight, textureWidth, textureHeight);
                    }
                    tempBuffer2.clearFilters();
                    tempBuffer2.filterType = "";
                    renderBufferPool.push(tempBuffer2);

                    // 绘制原画
                    this.setGlobalCompositeOperation("lighter");

                    this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
                    this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: resultTexture, count: 0});
                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;

                    this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
                    this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: tempBuffer3.rootRenderTarget.texture, count: 0});
                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;

                    this.setGlobalCompositeOperation("source-over");

                    this.$drawWebGL();
                } else {
                    // 绘制
                    this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
                    this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: resultTexture, count: 0});

                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;

                    this.$drawWebGL();
                }

                if(tempBuffer) {
                    tempBuffer.clearFilters();
                    tempBuffer.filterType = "";
                    renderBufferPool.push(tempBuffer);
                }

            } else {
                this.filterType = "";
                this.filter = null;

                if (webGLTexture !== this.currentBaseTexture) {
                    this.currentBaseTexture = webGLTexture;
                    this.drawData.push({type: DRAWABLE_TYPE.TEXTURE, texture: this.currentBaseTexture, count: 0});
                }

                this.drawUvRect(sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
                this.currentBatchSize++;
                this.drawData[this.drawData.length - 1].count++;
            }


        }

        /**
         * 应用滤镜绘制
         * */
        private applyFilter(filter, texture, buffer, width, height, textureWidth, textureHeight) {
            this.renderContext.pushBuffer(buffer);

            buffer.setTransform(1, 0, 0, -1, 0, height);
            buffer.setGlobalAlpha(1);
            buffer.pushFilters([filter]);
            // 轮换
            buffer.drawTexture(texture, 0, 0, width, height, 0, 0, width, height, textureWidth, textureHeight);
            buffer.popFilters();
            buffer.$drawWebGL();

            this.renderContext.popBuffer();
        }

        /**
         * @private
         * draw a rect use default shader
         * */
        private drawRect(x:number, y:number, width:number, height:number):void {
            if (this.renderContext.contextLost) {
                return;
            }

            // TODO if needed, this rect can set a color
            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.RECT, rect: 1, count: 0});
            } else if(this.drawData.length > 1 && this.drawData[this.drawData.length - 2].rect) {
                // merge to one draw
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.RECT, rect: 1, count: 0});
            }

            this.drawUvRect(0, 0, width, height, x, y, width, height, width, height);

            this.currentBatchSize++;
            this.drawData[this.drawData.length - 1].count++;
            this.currentBaseTexture = null;
        }

        /**
         * @private
         * draw a rect with uv attribute, just push vertices datas to array
         * */
        private drawUvRect(sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                                destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number) {

            var textureSourceWidth = textureWidth;
            var textureSourceHeight = textureHeight;

            //计算出绘制矩阵，之后把矩阵还原回之前的
            var locWorldTransform = this.globalMatrix;
            var originalA:number = locWorldTransform.a;
            var originalB:number = locWorldTransform.b;
            var originalC:number = locWorldTransform.c;
            var originalD:number = locWorldTransform.d;
            var originalTx:number = locWorldTransform.tx;
            var originalTy:number = locWorldTransform.ty;
            if (destX != 0 || destY != 0) {
                locWorldTransform.append(1, 0, 0, 1, destX, destY);
            }
            if (sourceWidth / destWidth != 1 || sourceHeight / destHeight != 1) {
                locWorldTransform.append(destWidth / sourceWidth, 0, 0, destHeight / sourceHeight, 0, 0);
            }
            var a:number = locWorldTransform.a;
            var b:number = locWorldTransform.b;
            var c:number = locWorldTransform.c;
            var d:number = locWorldTransform.d;
            var tx:number = locWorldTransform.tx;
            var ty:number = locWorldTransform.ty;

            locWorldTransform.a = originalA;
            locWorldTransform.b = originalB;
            locWorldTransform.c = originalC;
            locWorldTransform.d = originalD;
            locWorldTransform.tx = originalTx;
            locWorldTransform.ty = originalTy;

            var width:number = textureSourceWidth;
            var height:number = textureSourceHeight;

            var w:number = sourceWidth;
            var h:number = sourceHeight;

            sourceX = sourceX / width;
            sourceY = sourceY / height;
            sourceWidth = sourceWidth / width;
            sourceHeight = sourceHeight / height;

            var vertices:Float32Array = this.vertices;
            var index:number = this.currentBatchSize * 4 * this.vertSize;
            var alpha:number = this._globalAlpha;

            // xy
            vertices[index++] = tx;
            vertices[index++] = ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = a * w + tx;
            vertices[index++] = b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = a * w + c * h + tx;
            vertices[index++] = d * h + b * w + ty;
            // uv
            vertices[index++] = sourceWidth + sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // alpha
            vertices[index++] = alpha;

            // xy
            vertices[index++] = c * h + tx;
            vertices[index++] = d * h + ty;
            // uv
            vertices[index++] = sourceX;
            vertices[index++] = sourceHeight + sourceY;
            // alpha
            vertices[index++] = alpha;
        }

        private drawData = [];
        public $drawCalls:number = 0;
        public $computeDrawCall:boolean = false;

        public $drawWebGL():void {
            if ((this.currentBatchSize == 0 && this.drawData.length == 0) || this.renderContext.contextLost) {
                return;
            }

            this.start();

            // update the vertices data
            var gl:any = this.context;
            var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);

            var length = this.drawData.length;
            var offset = 0;
            for (var i = 0; i < length; i++) {
                var data = this.drawData[i];
                switch(data.type) {
                    case DRAWABLE_TYPE.TEXTURE:
                        offset += this.drawTextureElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.RECT:
                        offset += this.drawRectElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.PUSH_MASK:
                        offset += this.drawPushMaskElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.POP_MASK:
                        offset += this.drawPopMaskElements(data, offset);
                        break;
                    case DRAWABLE_TYPE.BLEND:
                        var blendModeWebGL = WebGLRenderBuffer.blendModesForGL[data.value];
                        if (blendModeWebGL) {
                            this.context.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
                        }
                        break;
                    default:
                        break;
                }

                // add drawCall except blend type
                if(data.type != DRAWABLE_TYPE.BLEND) {
                    if (this.$computeDrawCall) {
                        this.$drawCalls++;
                    }
                }
            }

            // flush draw data
            this.drawData.length = 0;
            this.currentBatchSize = 0;
            this.currentBaseTexture = null;
        }

        private filterType;
        private filter;

        private start():void {
            if (this.renderContext.contextLost) {
                return;
            }
            var gl:any = this.context;
            gl.activeTexture(gl.TEXTURE0);

            // gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
            // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

            var shader;
            if (this.filterType == "colorTransform") {
                shader = this.renderContext.shaderManager.colorTransformShader;
                shader.uniforms.matrix.value = [
                    this.filter.matrix[0],this.filter.matrix[1],this.filter.matrix[2],this.filter.matrix[3],
                    this.filter.matrix[5],this.filter.matrix[6],this.filter.matrix[7],this.filter.matrix[8],
                    this.filter.matrix[10],this.filter.matrix[11],this.filter.matrix[12],this.filter.matrix[13],
                    this.filter.matrix[15],this.filter.matrix[16],this.filter.matrix[17],this.filter.matrix[18]
                ];
                shader.uniforms.colorAdd.value.x = this.filter.matrix[4];
                shader.uniforms.colorAdd.value.y = this.filter.matrix[9];
                shader.uniforms.colorAdd.value.z = this.filter.matrix[14];
                shader.uniforms.colorAdd.value.w = this.filter.matrix[19];
            }
            else if (this.filterType == "blur") {
                shader = this.renderContext.shaderManager.blurShader;
                shader.uniforms.blur.value = {x: this.filter.blurX, y: this.filter.blurY};
            }
            else {
                shader = this.renderContext.shaderManager.defaultShader;
            }
            this.renderContext.shaderManager.activateShader(shader);
            shader.syncUniforms();

            gl.uniform2f(shader.projectionVector, this.renderContext.projectionX, this.renderContext.projectionY);

            // set the default shader to draw texture model
            this.renderContext.switchDrawingTextureState(true);

            var stride = this.vertSize * 4;
            gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);
        }

        public createWebGLTexture(texture:BitmapData):void {
            var bitmapData:any = texture;
            if (!bitmapData.webGLTexture) {
                bitmapData.webGLTexture = {};
            }
            if (!bitmapData.webGLTexture[this.renderContext.glID]) {
                var glTexture = this.createTexture(bitmapData);
                bitmapData.webGLTexture[this.renderContext.glID] = glTexture;
            }
        }

        // 创建一个材质，并返回，只供外部引用，内部无引用
        public createTexture(bitmapData:BitmapData):WebGLTexture {
            var gl:any = this.context;
            var glTexture = gl.createTexture();
            if (!glTexture) {
                //先创建texture失败,然后lost事件才发出来..
                this.renderContext.contextLost = true;
                return;
            }
            glTexture.glContext = gl;
            gl.bindTexture(gl.TEXTURE_2D, glTexture);
            gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

            gl.bindTexture(gl.TEXTURE_2D, null);

            return glTexture;
        }

        private globalMatrix:Matrix = new Matrix();
        private savedGlobalMatrix:Matrix = new Matrix();

        public setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.globalMatrix.setTo(a, b, c, d, tx, ty);
        }

        public transform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.globalMatrix.append(a, b, c, d, tx, ty);
        }

        public translate(dx:number, dy:number):void {
            this.globalMatrix.translate(dx, dy);
        }

        public saveTransform():void {
            this.savedGlobalMatrix.copyFrom(this.globalMatrix);
        }

        public restoreTransform():void {
            this.globalMatrix.copyFrom(this.savedGlobalMatrix);
        }

        private _globalAlpha:number = 1;

        public setGlobalAlpha(value:number) {
            this._globalAlpha = value;
        }

        private currentBlendMode:string;

        public setGlobalCompositeOperation(value:string) {
            if (this.currentBlendMode != value) {
                this.drawData.push({type:DRAWABLE_TYPE.BLEND, value: value});
                this.currentBlendMode = value;
                this.currentBaseTexture = null;
            }
        }

        public pushMask(mask):void {

            // TODO mask count
            this.$stencilList.push(mask);

            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.PUSH_MASK, pushMask: mask, count: 0});
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.PUSH_MASK, pushMask: mask, count: 0});
            }

            this.drawMask(mask);
            this.currentBaseTexture = null;
        }

        public popMask():void {

            // TODO mask count
            var mask = this.$stencilList.pop();

            if (this.currentBatchSize >= this.size - 1) {
                this.$drawWebGL();
                this.drawData.push({type: DRAWABLE_TYPE.POP_MASK, popMask: mask, count: 0});
            } else {
                this.drawData.push({type: DRAWABLE_TYPE.POP_MASK, popMask: mask, count: 0});
            }

            this.drawMask(mask);
            this.currentBaseTexture = null;
        }

        /**
         * @private
         * draw masks with default shader
         **/
        private drawMask(mask) {
            if (this.renderContext.contextLost) {
                return;
            }

            var length = mask.length;
            if (length) {
                for (var i = 0; i < length; i++) {
                    var item:sys.Region = mask[i];
                    this.drawUvRect(0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                    this.currentBatchSize++;
                    this.drawData[this.drawData.length - 1].count++;
                }
            }
            else {
                this.drawUvRect(0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                this.currentBatchSize++;
                this.drawData[this.drawData.length - 1].count++;
            }
        }

        /**
         * @private
         * draw texture elements
         **/
        private drawTextureElements(data:any, offset:number):number {
            this.renderContext.switchDrawingTextureState(true);

            var gl = this.context;
            gl.bindTexture(gl.TEXTURE_2D, data.texture);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * @private
         * draw rect elements
         **/
        private drawRectElements(data:any, offset:number):number {
            this.renderContext.switchDrawingTextureState(false);

            var gl = this.context;
            gl.bindTexture(gl.TEXTURE_2D, null);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
            return size;
        }

        /**
         * @private
         * draw push mask elements
         **/
        private drawPushMaskElements(data:any, offset:number):number {
            this.renderContext.switchDrawingTextureState(false);

            var gl = this.context;
            if(this.stencilHandleCount == 0) {
                this.enableStencil();
                gl.clear(gl.STENCIL_BUFFER_BIT);
            }
            var level = this.stencilHandleCount;
            this.stencilHandleCount++;
            gl.colorMask(false, false, false, false);
            gl.stencilFunc(gl.EQUAL, level, 0xFF);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);

            gl.bindTexture(gl.TEXTURE_2D, null);
            var size = data.count * 6;
            gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

            gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
            gl.colorMask(true, true, true, true);
            gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

            return size;
        }

        /**
         * @private
         * draw pop mask elements
         **/
        private drawPopMaskElements(data:any, offset:number) {
            this.renderContext.switchDrawingTextureState(false);

            var gl = this.context;
            this.stencilHandleCount--;
            if(this.stencilHandleCount == 0) {
                this.disableStencil();
                // skip this draw
                var size = data.count * 6;
                return size;
            } else {
                var level = this.stencilHandleCount;
                gl.colorMask(false, false, false, false);
                gl.stencilFunc(gl.EQUAL, level + 1, 0xFF);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);

                gl.bindTexture(gl.TEXTURE_2D, null);
                var size = data.count * 6;
                gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);

                gl.stencilFunc(gl.EQUAL, level, 0xFF);
                gl.colorMask(true, true, true, true);
                gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

                return size;
            }
        }

        public static blendModesForGL:any = null;

        public static initBlendMode():void {
            WebGLRenderBuffer.blendModesForGL = {};
            WebGLRenderBuffer.blendModesForGL["source-over"] = [1, 771];
            WebGLRenderBuffer.blendModesForGL["lighter"] = [770, 1];
            WebGLRenderBuffer.blendModesForGL["destination-out"] = [0, 771];
            WebGLRenderBuffer.blendModesForGL["destination-in"] = [0, 770];
        }

        /**
         * @private
         */
        private createRenderBuffer(width:number, height:number):WebGLRenderBuffer {
            var buffer = renderBufferPool.pop();
            if (buffer) {
                buffer.resize(width, height);
            }
            else {
                buffer = new WebGLRenderBuffer(width, height);
                buffer.$computeDrawCall = false;
            }
            return buffer;
        }

    }

    var renderBufferPool:WebGLRenderBuffer[] = [];//渲染缓冲区对象池

    WebGLRenderBuffer.initBlendMode();
}
