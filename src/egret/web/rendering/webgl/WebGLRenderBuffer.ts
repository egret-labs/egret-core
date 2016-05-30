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
     * WebGL渲染缓存
     */
    export class WebGLRenderBuffer implements sys.RenderBuffer {

        /**
         * 渲染上下文
         */
        public context:WebGLRenderContext;

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
         * 是否为舞台buffer
         */
        private root:boolean;

        public constructor(width?:number, height?:number) {
            // 获取webglRenderContext
            this.context = WebGLRenderContext.getInstance(width, height);
            // buffer 对应的 render target
            this.rootRenderTarget = new WebGLRenderTarget(this.context.context, width, height);

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

        public _globalAlpha:number = 1;
        /**
         * stencil state
         * 模版开关状态
         */
        private stencilState:boolean = false;
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

            this.context.pushBuffer(this);

            // dirtyRegionPolicy hack
            if(this._dirtyRegionPolicy) {
                this.rootRenderTarget.useFrameBuffer = true;
                this.rootRenderTarget.activate();
            } else {
                this.rootRenderTarget.useFrameBuffer = false;
                this.rootRenderTarget.activate();
                this.context.clear();
            }

            offsetX = +offsetX || 0;
            offsetY = +offsetY || 0;
            this.setTransform(1, 0, 0, 1, offsetX, offsetY);
            var length = regions.length;
            //只有一个区域且刚好为舞台大小时,不设置模板
            if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                regions[0].width == this.rootRenderTarget.width && regions[0].height == this.rootRenderTarget.height) {
                this.maskPushed = false;
                this.rootRenderTarget.useFrameBuffer && this.context.clear();
                this.context.popBuffer();
                return;
            }
            // 擦除脏矩形区域
            for (var i = 0; i < length; i++) {
                var region = regions[i];
                this.context.clearRect(region.minX, region.minY, region.width, region.height);
            }
            // 设置模版
            if (length > 0) {
                this.context.pushMask(regions);
                this.maskPushed = true;
                this.offsetX = offsetX;
                this.offsetY = offsetY;
            }
            else {
                this.maskPushed = false;
            }

            this.context.popBuffer();
        }

        private maskPushed:boolean;
        private offsetX:number;
        private offsetY:number;

        /**
         * 取消上一次设置的clip。
         */
        public endClip():void {
            if (this.maskPushed) {
                this.context.pushBuffer(this);

                this.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                this.context.popMask();

                this.context.popBuffer();
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
            this.context.setGlobalAlpha(1);
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.context.$drawWebGL();

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
            this.context.setGlobalAlpha(1);
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.context.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.restoreStencil();
        }

        /**
         * 清空缓冲区数据
         */
        public clear():void {
            this.context.clear();
        }

        public $drawCalls:number = 0;
        public $computeDrawCall:boolean = false;

        public globalMatrix:Matrix = new Matrix();
        public savedGlobalMatrix:Matrix = new Matrix();

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

        /**
         * 创建一个buffer实例
         */
        public static create(width:number, height:number):WebGLRenderBuffer {
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

        /**
         * 回收一个buffer实例
         */
        public static release(buffer:WebGLRenderBuffer):void {
            renderBufferPool.push(buffer);
        }

    }

    var renderBufferPool:WebGLRenderBuffer[] = [];//渲染缓冲区对象池
}
