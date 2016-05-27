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
     * WebGL渲染器
     */
    export class WebGLRenderBuffer implements sys.RenderBuffer {

        /**
         * 渲染上下文
         */
        public context:WebGLRenderContext;

        /**
         * 是否为舞台buffer
         */
        private root:boolean;

        public constructor(width?:number, height?:number) {
            // 获取webglRenderContext
            this.context = WebGLRenderContext.getInstance(width, height);
            // buffer 对应的 render target
            this.rootRenderTarget = new WebGLRenderTarget(this.context.context, width, height);

            // TODO 抽像WebGLState类用于管理webgl状态，包括stencil，blend，colorMask等等
            this.stencilState = false;

            this.drawCmdManager = new WebGLDrawCmdManager();

            this.vao = new WebGLVertexArrayObject();

            this.setGlobalCompositeOperation("source-over");

            // 如果是第一个加入的buffer，说明是舞台buffer
            this.root = this.context.$bufferStack.length == 0;

            // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
            if(this.root) {
                this.context.pushBuffer(this);
                // 画布
                this.surface = this.context.surface;
            } else {
                // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                var lastBuffer = this.context.currentBuffer;
                if(lastBuffer) {
                    lastBuffer.rootRenderTarget.activate();
                }

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
        public getFilters() {
            var filters = [];
            for(var i = 0; i < this.filters.length; i++) {
                var _filters = this.filters[i];
                if(_filters) {
                    for(var j = 0; j < _filters.length; j++) {
                        var filter = _filters[j];
                        if(filter && filter.type != "glow") {// 暂时屏蔽掉发光滤镜
                            filters.push(filter);
                        }
                    }
                }
            }
            return filters;
        }

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

        public vao:WebGLVertexArrayObject;

        /**
         * stencil state
         * 模版开关状态
         */
        private stencilState:boolean;

        public $stencilList = [];
        public stencilHandleCount:number = 0;

        public enableStencil():void {
            if(!this.stencilState) {
                this.context.enableStencilTest();
                this.stencilState = true;
            }
        }

        public disableStencil():void {
            if(this.stencilState) {
                this.context.disableStencilTest();
                this.stencilState = false;
            }
        }

        public restoreStencil():void {
            if(this.stencilState) {
                this.context.enableStencilTest();
            } else {
                this.context.disableStencilTest();
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
         * @private
         **/
        public $getWidth():number {
            return this.rootRenderTarget.width;
        }

        /**
         * @private
         **/
        public $getHeight():number {
            return this.rootRenderTarget.height;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width:number, height:number, useMaxSize?:boolean):void {

            width = width || 1;
            height = height || 1;

            // render target 尺寸重置
            if(width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                this.rootRenderTarget.resize(width, height);
            }

            // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
            if(this.root) {
                this.context.resize(width, height, useMaxSize);
            }

            this.rootRenderTarget.clear(true);

            // 由于resize与clear造成的frameBuffer绑定，这里重置绑定
            var lastBuffer = this.context.currentBuffer;
            if(lastBuffer) {
                lastBuffer.rootRenderTarget.activate();
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
            // TODO 这里用于cacheAsBitmap的实现

            // var oldSurface = this.surface;
            // var oldWidth = oldSurface.width;
            // var oldHeight = oldSurface.height;
            // this.context.resizeTo(width, height, offsetX, offsetY);
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
                this.rootRenderTarget.activate();
            } else {
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
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
            var pixels = new Uint8Array(4);

            var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.context.getPixels(x, y, 1, 1, pixels);

            this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
            this.rootRenderTarget.activate();

            return <number[]><any>pixels;
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?:string, encoderOptions?:number):string {
            return this.context.surface.toDataURL(type, encoderOptions);
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.context.destroy();
        }

        public onRenderFinish():void {
            this.$drawCalls = 0;

            // 如果是舞台渲染buffer，判断脏矩形策略
            if(this.root) {
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
            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest();// 切换frameBuffer注意要禁用STENCIL_TEST

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawImage(<BitmapData><any>this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.restoreStencil();
        }
        /**
         * 交换surface的图像到frameBuffer中
         * @param width 宽度
         * @param height 高度
         */
        private drawSurfaceToFrameBuffer(sourceX:number,
          sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number, clear:boolean = false):void {
            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest();// 切换frameBuffer注意要禁用STENCIL_TEST

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawImage(<BitmapData><any>this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.restoreStencil();
        }

        /**
         * 清空缓冲区数据
         */
        public clear():void {
            if(this.rootRenderTarget.width != 0 && this.rootRenderTarget.height != 0) {
                this.context.clear();
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
            if (this.context.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }

            var webGLTexture:WebGLTexture;
            if(texture["texture"]) {
                // 如果是render target
                webGLTexture = texture["texture"];
                this.saveTransform();
                this.transform(1, 0, 0, -1, 0, destHeight + destY * 2);// 翻转
            } else {
                webGLTexture = this.context.getWebGLTexture(texture);
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

        public drawMesh(texture:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         textureSourceWidth:number, textureSourceHeight:number,
                         meshUVs:number[], meshVertices:number[], meshIndices:number[], bounds:Rectangle
                         ):void {
            if (this.context.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }

            var webGLTexture = this.context.getWebGLTexture(texture);
            if (!webGLTexture) {
                return;
            }

            this.drawTexture(webGLTexture,
                sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight,
                textureSourceWidth, textureSourceHeight, meshUVs, meshVertices, meshIndices, bounds);

        }

        /**
         * @private
         * draw a texture use default shader
         * */
        public drawTexture(texture:WebGLTexture,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number,
                            meshUVs?:number[], meshVertices?:number[], meshIndices?:number[], bounds?:Rectangle):void {
            if (this.context.contextLost) {
                return;
            }
            if (!texture) {
                return;
            }
            var webGLTexture = <Texture>texture;

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            if(meshUVs) {
                this.vao.changeToMeshIndices();
            }

            var filters = this.getFilters();
            if(filters.length > 0) {
                var width = destWidth;
                var height = destHeight;
                var offsetX = 0;
                var offsetY = 0;
                if(bounds) {
                    width = bounds.width;
                    height = bounds.height;
                    offsetX = -bounds.x;
                    offsetY = -bounds.y;
                }
                this.drawTextureWidthFilter(filters, webGLTexture,
                    sourceX, sourceY, sourceWidth, sourceHeight,
                    destX, destY, destWidth, destHeight, textureWidth, textureHeight,
                    width, height, offsetX, offsetY, meshUVs, meshVertices, meshIndices);// 后参数用于draw mesh
            } else {

                var count = meshIndices ? meshIndices.length / 3 : 2;
                this.drawCmdManager.pushDrawTexture(webGLTexture, count);

                this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight,
                    meshUVs, meshVertices, meshIndices);
            }

        }

        /**
         * 绘制材质并应用滤镜
         * 这里为drawMesh新增四个参数：realWidth, realHeight, offsetX, offsetY
         * realWidth与realHeight为实际mesh宽高
         * offsetX与offsetY为绘制mesh时的偏移量，向左为正值
         */
        private drawTextureWidthFilter(filters:any, webGLTexture:WebGLTexture,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number,
                            realWidth:number, realHeight:number, _offsetX:number, _offsetY:number,
                            meshUVs?:number[], meshVertices?:number[], meshIndices?:number[]) {

            var len = filters.length;

            // destWidth = realWidth;
            // destHeight = realHeight;
            // var gOffsetX = _offsetX;
            // var gOffsetY = _offsetY;
            var gOffsetX = 0;
            var gOffsetY = 0;

            // 递归执行滤镜
            var input = null;
            var output = null;
            if(len > 1) {
                // TODO 可省略
                input = this.createRenderBuffer(realWidth, realHeight);
                gOffsetX += _offsetX;
                gOffsetY += _offsetY;
                this.drawToRenderTarget(null, webGLTexture, input, sourceX, sourceY, sourceWidth, sourceHeight, _offsetX, _offsetY, destWidth, destHeight, textureWidth, textureHeight, true,
                    meshUVs, meshVertices, meshIndices);

                for(var i = 0; i < len - 1; i++) {
                    var filter = filters[i];
                    // 要为模糊发光等改变尺寸的滤镜创建一个大一些的画布
                    var offsetX = 0;
                    var offsetY = 0;
                    var distanceX:number = 0;
                    var distanceY:number = 0;
                    if(filter.type == "blur") {
                        offsetX = filter.blurX * 0.028 * input.$getWidth();
                        offsetY = filter.blurY * 0.028 * input.$getHeight();
                    }
                    if(filter.type == "glow") {
                        offsetX = filter.blurX * 0.028 * input.$getWidth();
                        offsetY = filter.blurY * 0.028 * input.$getHeight();
                        // 计算glow滤镜需要的尺寸还需要加上偏移量，此处把glow放置在滤镜队列前面会造成影子被剪切
                        var distance:number = filter.distance || 0;
                        var angle:number = filter.angle || 0;
                        if (distance != 0 && angle != 0) {
                            distanceX = Math.ceil(distance * egret.NumberUtils.cos(angle));
                            distanceY = Math.ceil(distance * egret.NumberUtils.sin(angle));
                        }
                        offsetX += Math.abs(distanceX);
                        offsetY += Math.abs(distanceY);
                    }
                    output = this.createRenderBuffer(input.$getWidth() + offsetX * 2, input.$getHeight() + offsetY * 2);
                    this.drawToRenderTarget(filter, input, output, 0, 0, input.$getWidth(), input.$getHeight(), (output.$getWidth() - input.$getWidth()) / 2, (output.$getHeight() - input.$getHeight()) / 2, input.$getWidth(), input.$getHeight(), input.$getWidth(), input.$getHeight());
                    input = output;

                    gOffsetX += offsetX;
                    gOffsetY += offsetY;
                }
            }

            // 应用最后的滤镜
            var filter = filters[len - 1];

            // 实现为blurX与blurY的叠加
            if (filter.type == "blur" && filter.blurX != 0 && filter.blurY != 0) {
                if (!this.blurFilter) {
                    this.blurFilter = new egret.BlurFilter(2, 2);
                }
                this.blurFilter.blurX = filter.blurX;
                this.blurFilter.blurY = 0;
                var offsetX = 0;
                var offsetY = 0;
                if(output) {
                    input = output;
                    offsetX = this.blurFilter.blurX * 0.028 * input.$getWidth();
                    offsetY = this.blurFilter.blurY * 0.028 * input.$getHeight();
                    output = this.createRenderBuffer(input.$getWidth() + offsetX * 2, input.$getHeight() + offsetY * 2);
                    this.drawToRenderTarget(this.blurFilter, input, output, 0, 0, input.$getWidth(), input.$getHeight(), (output.$getWidth() - input.$getWidth()) / 2, (output.$getHeight() - input.$getHeight()) / 2, input.$getWidth(), input.$getHeight(), input.$getWidth(), input.$getHeight());
                } else {
                    offsetX = this.blurFilter.blurX * 0.028 * realWidth;
                    offsetY = this.blurFilter.blurY * 0.028 * realHeight;
                    gOffsetX += _offsetX;
                    gOffsetY += _offsetY;
                    output = this.createRenderBuffer(realWidth + offsetX * 2, realHeight + offsetY * 2);
                    this.drawToRenderTarget(this.blurFilter, webGLTexture, output, sourceX, sourceY, sourceWidth, sourceHeight, offsetX + _offsetX, offsetY + _offsetY, destWidth, destHeight, textureWidth, textureHeight, true, meshUVs, meshVertices, meshIndices);
                }
                gOffsetX += offsetX;
                gOffsetY += offsetY;
            }

            // 如果是发光滤镜，绘制光晕
            if(filter.type == "glow") {
                if(!output) {
                    gOffsetX += _offsetX;
                    gOffsetY += _offsetY;
                    output = this.createRenderBuffer(realWidth, realHeight);
                    this.drawToRenderTarget(null, webGLTexture, output, sourceX, sourceY, sourceWidth, sourceHeight, _offsetX, _offsetY, destWidth, destHeight, textureWidth, textureHeight, true, meshUVs, meshVertices, meshIndices);
                }
                // 会调用$drawWebGL
                this.drawGlow(filter, output, destX - gOffsetX, destY - gOffsetY);
            }

            // 绘制output结果到舞台
            var offsetX = 0;
            var offsetY = 0;
            if(output) {
                if (filter.type == "blur"){
                    if (!this.blurFilter) {
                        this.blurFilter = new egret.BlurFilter(2, 2);
                    }
                    if(filter.blurX == 0 || filter.blurY == 0) {
                        this.blurFilter.blurX = filter.blurX;
                        this.blurFilter.blurY = filter.blurY;
                    } else {
                        this.blurFilter.blurX = 0;
                        this.blurFilter.blurY = filter.blurY;
                    }
                    filter = this.blurFilter;

                    offsetX = this.blurFilter.blurX * 0.028 * output.$getWidth();
                    offsetY = this.blurFilter.blurY * 0.028 * output.$getHeight();
                }
                this.saveTransform();
                this.transform(1, 0, 0, -1, 0, output.$getHeight() + 2 * offsetY + (destY - offsetY - gOffsetY) * 2);
                this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, -offsetX, -offsetY, output.$getWidth() + 2 * offsetX, output.$getHeight() + 2 * offsetY, destX - offsetX - gOffsetX, destY - offsetY - gOffsetY, output.$getWidth() + 2 * offsetX, output.$getHeight() + 2 * offsetY, output.$getWidth(), output.$getHeight());
                this.restoreTransform();
                this.drawCmdManager.pushDrawTexture(output["rootRenderTarget"].texture, 2, filter);
            } else {
                if (filter.type == "blur") {
                    offsetX = filter.blurX * 0.028 * realWidth;
                    offsetY = filter.blurY * 0.028 * realHeight;
                }
                this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, sourceX - offsetX, sourceY - offsetY, sourceWidth + 2 * offsetX, sourceHeight + 2 * offsetY, destX - offsetX - gOffsetX, destY - offsetY - gOffsetY, destWidth + 2 * offsetX, destHeight + 2 * offsetY, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices);
                var uv = this.getUv(sourceX, sourceY, sourceWidth, sourceHeight, textureWidth, textureHeight);
                this.drawCmdManager.pushDrawTexture(webGLTexture, meshIndices ? meshIndices.length / 3 : 2, filter, uv);
            }

            if(output) {
                // 确保完全绘制完成后才能释放output
                this.$drawWebGL();

                output.clearFilters();
                output.filter = null;
                renderBufferPool.push(output);
            }
        }

        /**
         * 向一个renderTarget中绘制
         * */
        private drawToRenderTarget(filter:Filter, input:any, output:WebGLRenderBuffer,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number, release:boolean = true,
                            meshUVs?:number[], meshVertices?:number[], meshIndices?:number[]) {
            this.context.pushBuffer(output);
            output.setGlobalAlpha(1);
            output.setTransform(1, 0, 0, 1, 0, 0);
            if(filter) {
                output.pushFilters([filter]);
            }
            if(input["rootRenderTarget"]) {
                output.drawImage(<BitmapData><any>input.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight);
            } else {
                output.drawTexture(<WebGLTexture><any>input, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, textureWidth, textureHeight, meshUVs, meshVertices, meshIndices);
            }
            if(filter) {
                output.popFilters();
            }
            output.$drawWebGL();
            this.context.popBuffer();
            if(input["rootRenderTarget"] && release) { // 如果输入的是buffer,回收
                input.clearFilters();
                input.filter = null;
                renderBufferPool.push(input);
            }
        }

        private colorMatrixFilter = null;
        private blurFilter = null;
        private drawGlow(filter, input:WebGLRenderBuffer, destX, destY) {
            if(!this.colorMatrixFilter) {
                this.colorMatrixFilter = new ColorMatrixFilter();
            }
            if(!this.blurFilter) {
                this.blurFilter = new BlurFilter(2, 2);
            }

            var output = null;
            var offsetX = 0;
            var offsetY = 0;
            var distance:number = filter.distance || 0;
            var angle:number = filter.angle || 0;
            var distanceX:number = 0;
            var distanceY:number = 0;
            if (distance != 0 && angle != 0) {
                distanceX = Math.ceil(distance * egret.NumberUtils.cos(angle));
                distanceY = Math.ceil(distance * egret.NumberUtils.sin(angle));
            }

            //绘制纯色图
            this.colorMatrixFilter.matrix = [
                0, 0, 0, 0, filter.$red,
                0, 0, 0, 0, filter.$green,
                0, 0, 0, 0, filter.$blue,
                0, 0, 0, 0, filter.alpha,
            ];
            output = this.createRenderBuffer(input.$getWidth(), input.$getHeight());
            this.drawToRenderTarget(this.colorMatrixFilter, input, output, 0, 0, input.$getWidth(), input.$getHeight(), 0, 0, output.$getWidth(), output.$getHeight(), input.$getWidth(), input.$getHeight(), false);
            draw.call(this, output, distanceX - offsetX, distanceY - offsetY);
            this.$drawWebGL();

            // 应用blurX
            this.blurFilter.blurX = filter.blurX;
            this.blurFilter.blurY = 0;
            input = output;
            offsetX += filter.blurX * 0.028 * input.$getWidth();
            output = this.createRenderBuffer(input.$getWidth() + offsetX * 2, input.$getHeight());
            this.drawToRenderTarget(this.blurFilter, input, output, 0, 0, input.$getWidth(), input.$getHeight(), offsetX, 0, input.$getWidth(), input.$getHeight(), input.$getWidth(), input.$getHeight());
            draw.call(this, output, distanceX - offsetX, distanceY - offsetY);
            this.$drawWebGL();

            // 应用blurY
            this.blurFilter.blurX = 0;
            this.blurFilter.blurY = filter.blurY;
            input = output;
            offsetY += filter.blurY * 0.028 * input.$getHeight();
            output = this.createRenderBuffer(input.$getWidth(), input.$getHeight() + offsetY * 2);
            this.drawToRenderTarget(this.blurFilter, input, output, 0, 0, input.$getWidth(), input.$getHeight(), 0, offsetY, input.$getWidth(), input.$getHeight(), input.$getWidth(), input.$getHeight());
            draw.call(this, output, distanceX - offsetX, distanceY - offsetY);
            this.$drawWebGL();

            // 根据光强绘制光
            this.setGlobalCompositeOperation("lighter-in");
            for(var j = 0; j < filter.quality; j++) {
                draw.call(this, output, distanceX - offsetX, distanceY - offsetY);
            }
            this.setGlobalCompositeOperation("source-over");
            this.$drawWebGL();

            function draw(result, offsetX, offsetY) {
                this.saveTransform();
                this.transform(1, 0, 0, -1, 0, result.$getHeight() + (destY + offsetY) * 2);
                this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, 0, 0, result.$getWidth(), result.$getHeight(), destX + offsetX, destY + offsetY, result.$getWidth(), result.$getHeight(), result.$getWidth(), result.$getHeight());
                this.restoreTransform();
                this.drawCmdManager.pushDrawTexture(result.rootRenderTarget.texture);
            }

            output.clearFilters();
            output.filter = null;
            renderBufferPool.push(output);
        }

        /**
         * @private
         * draw a rect use default shader
         * */
        private drawRect(x:number, y:number, width:number, height:number):void {
            if (this.context.contextLost) {
                return;
            }

            // TODO if needed, this rect can set a color
            // if (this.currentBatchSize >= this.size - 1) {
            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.drawCmdManager.pushDrawRect();

            this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, 0, 0, width, height, x, y, width, height, width, height);
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

        private drawCmdManager:WebGLDrawCmdManager;
        public $drawCalls:number = 0;
        public $computeDrawCall:boolean = false;

        public $drawWebGL():void {
            if (this.drawCmdManager.drawData.length == 0 || this.context.contextLost) {
                return;
            }

            this.context.uploadVerticesArray(this.vao.getVertices());

            // 有mesh，则使用indicesForMesh
            if (this.vao.isMesh()){
                this.context.uploadIndicesArray(this.vao.getMeshIndices());
            }

            var length = this.drawCmdManager.drawData.length;
            var offset = 0;
            // this.shaderStarted = false;
            for (var i = 0; i < length; i++) {
                var data = this.drawCmdManager.drawData[i];

                offset = this.context.drawData(data, offset);

                // 计算draw call
                if(data.type != DRAWABLE_TYPE.BLEND) {
                    if (this.$computeDrawCall) {
                        this.$drawCalls++;
                    }
                }
            }

            // 切换回默认indices
            if (this.vao.isMesh()){
                this.context.uploadIndicesArray(this.vao.getIndices());
            }

            // 清空数据
            this.drawCmdManager.clear();
            this.vao.clear();
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

        public setGlobalCompositeOperation(value:string) {
            this.drawCmdManager.pushSetBlend(value);
        }

        public pushMask(mask):void {

            // TODO mask count
            this.$stencilList.push(mask);

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.drawMask(mask, true);
        }

        public popMask():void {

            // TODO mask count
            var mask = this.$stencilList.pop();

            if (this.vao.reachMaxSize()) {
                this.$drawWebGL();
            }

            this.drawMask(mask);
        }

        /**
         * @private
         * draw masks with default shader
         **/
        private drawMask(mask, push?:boolean) {
            if (this.context.contextLost) {
                return;
            }

            var length = mask.length;
            if (length) {
                for (var i = 0; i < length; i++) {
                    var item:sys.Region = mask[i];
                    this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, 0, 0, item.width, item.height, item.minX, item.minY, item.width, item.height, item.width, item.height);
                    push ? this.drawCmdManager.pushPushMask() : this.drawCmdManager.pushPopMask();
                }
            }
            else {
                this.vao.cacheArrays(this.globalMatrix, this._globalAlpha, 0, 0, mask.width, mask.height, mask.x, mask.y, mask.width, mask.height, mask.width, mask.height);
                push ? this.drawCmdManager.pushPushMask() : this.drawCmdManager.pushPopMask();
            }
        }

        /**
         * @private
         */
        private createRenderBuffer(width:number, height:number):WebGLRenderBuffer {
            var buffer = renderBufferPool.pop();
            width = Math.min(width, 1024);
            height = Math.min(height, 1024);
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
}
