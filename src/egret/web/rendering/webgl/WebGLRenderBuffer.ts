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
            // TODO 要实现共用context，这里应该获取单例
            // this.renderContext = new WebGLRenderContext(width, height);
            this.renderContext = WebGLRenderContext.getInstance(width, height);
            // 画布
            this.surface = this.renderContext.surface;
            // webGL上下文，未来可替换为WebGLRenderContext暴露给外层？
            this.context = this.renderContext.context;

            // render target 管理相关
            // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
            this.rootRenderTarget = new WebGLRenderTarget(this.context, this.surface.width, this.surface.height);
            if(this.renderContext.$targets.length == 0) {
                this.renderContext.pushTarget(this.rootRenderTarget);
            }
        }

        /**
         * webgl渲染上下文
         */
        public context:WebGLRenderingContext;

        /**
         * 呈现最终绘图结果的画布
         */
        public surface:HTMLCanvasElement;

        /**
         * root render target
         * 根渲染目标，用来执行主渲染
         */
        public rootRenderTarget:WebGLRenderTarget;

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
            this.renderContext.resize(width, height, useMaxSize);

            //this.renderContext.pushTarget(this.rootRenderTarget);
            var target = this.renderContext.getCurrentTarget();
            target.resize(this.surface.width, this.surface.height);
            //this.renderContext.popTarget();
            this.renderContext.bindCurrentRenderTarget();
        }



        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width:number, height:number, offsetX:number, offsetY:number):void {
            var oldSurface = this.surface;
            var oldWidth = oldSurface.width;
            var oldHeight = oldSurface.height;
            this.renderContext.resizeTo(width, height, offsetX, offsetY);
            // renderTexture resize, copy color data
            this.drawFrameBufferToSurface(0, 0, oldWidth, oldHeight, offsetX, offsetY, oldWidth, oldHeight, true);
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
                this.renderContext.bindCurrentRenderTarget();
            } else {
                this.rootRenderTarget.useFrameBuffer = false;
                this.renderContext.bindCurrentRenderTarget();
                this.clear();
            }

            offsetX = +offsetX || 0;
            offsetY = +offsetY || 0;
            this.renderContext.setTransform(1, 0, 0, 1, offsetX, offsetY);
            var length = regions.length;
            //只有一个区域且刚好为舞台大小时,不设置模板
            if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
                regions[0].width == this.surface.width && regions[0].height == this.surface.height) {
                this.maskPushed = false;
                this.rootRenderTarget.useFrameBuffer && this.clear();
                return;
            }
            // 擦除脏矩形区域
            for (var i = 0; i < length; i++) {
                var region = regions[i];
                this.renderContext.clearRect(region.minX, region.minY, region.width, region.height);
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
                this.renderContext.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                this.popMask();
            }
        }

        /**
         * 获取指定坐标的像素
         */
        public getPixel(x:number, y:number):number[] {
            var gl = this.context;
            var pixels = new Uint8Array(4);

            // var useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
            // this.rootRenderTarget.useFrameBuffer = true;
            // this.renderContext.pushTarget(this.rootRenderTarget);
            var target = this.renderContext.getCurrentTarget();
            var useFrameBuffer = target.useFrameBuffer;
            target.useFrameBuffer = true;
            this.renderContext.bindCurrentRenderTarget();

            gl.readPixels(x, y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

            // restore the state of current render target
            target.useFrameBuffer = useFrameBuffer;
            this.renderContext.bindCurrentRenderTarget();
            // this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
            // this.renderContext.popTarget();

            return <number[]><any>pixels;
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
            this.renderContext.clear();
        }

        /**
         * 销毁绘制对象
         */
        public destroy():void {
            this.renderContext.destroy();
        }

        public drawImage(texture:BitmapData,
                         sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                         destX:number, destY:number, destWidth:number, destHeight:number,
                         textureSourceWidth:number, textureSourceHeight:number):void {
            this.renderContext.drawImage(texture,sourceX, sourceY, sourceWidth, sourceHeight,destX, destY, destWidth, destHeight, textureSourceWidth, textureSourceHeight);
        }

        /**
         * @private
         * draw a texture use default shader
         * */
        public drawTexture(texture:WebGLTexture,
                            sourceX:number, sourceY:number, sourceWidth:number, sourceHeight:number,
                            destX:number, destY:number, destWidth:number, destHeight:number, textureWidth:number, textureHeight:number):void {
            this.renderContext.drawTexture(texture,sourceX, sourceY, sourceWidth, sourceHeight,destX, destY, destWidth, destHeight, textureWidth, textureHeight);
        }

        public get $drawCalls():number {
            return this.renderContext.$drawCalls;
        }
        public get $computeDrawCall():boolean {
            return this.renderContext.$computeDrawCall;
        }

        public $drawWebGL():void {
            this.renderContext.$drawWebGL();
        }

        public createWebGLTexture(texture:BitmapData):void {
            return this.renderContext.createWebGLTexture(texture);
        }

        public createTexture(bitmapData:BitmapData):WebGLTexture {
            return this.renderContext.createTexture(bitmapData);
        }

        public onRenderFinish():void {
            this.$drawCalls = 0;

            // if used for render a render target, this is not need
            if(this.renderContext.$targets.length == 1) {
                // dirtyRegionPolicy hack
                if(!this._dirtyRegionPolicy && this.dirtyRegionPolicy) {
                    this.drawSurfaceToFrameBuffer(0, 0, this.surface.width, this.surface.height, 0, 0, this.surface.width, this.surface.height, true);
                }
                if(this._dirtyRegionPolicy) {
                    this.drawFrameBufferToSurface(0, 0, this.surface.width, this.surface.height, 0, 0, this.surface.width, this.surface.height);
                }
                this._dirtyRegionPolicy = this.dirtyRegionPolicy;
            }
        }

        public setTransform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.renderContext.setTransform(a, b, c, d, tx, ty);
        }

        public transform(a:number, b:number, c:number, d:number, tx:number, ty:number):void {
            this.renderContext.transform(a, b, c, d, tx, ty);
        }

        public translate(dx:number, dy:number):void {
            this.renderContext.translate(dx, dy);
        }

        public saveTransform():void {
            this.renderContext.saveTransform();
        }

        public restoreTransform():void {
            this.renderContext.restoreTransform();
        }

        public setGlobalAlpha(value:number) {
            this.renderContext.setGlobalAlpha(value);
        }

        public setGlobalCompositeOperation(value:string) {
            this.renderContext.setGlobalCompositeOperation(value);
        }

        public get $stencilList() {
            return this.renderContext.$stencilList;
        };

        public pushMask(mask):void {
            this.renderContext.pushMask(mask);
        }

        public popMask():void {
            this.renderContext.popMask();
        }

        /**
         * 交换frameBuffer中的图像到surface中
         * @param width 宽度
         * @param height 高度
         */
        private drawFrameBufferToSurface(sourceX:number,
          sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number, clear:boolean = false):void {
            var gl = this.context;

            // this.rootRenderTarget.useFrameBuffer = false;
            // this.renderContext.pushTarget(this.rootRenderTarget);
            // var target = this.rootRenderTarget;
            var target = this.renderContext.getCurrentTarget();
            target.useFrameBuffer = false;
            this.renderContext.bindCurrentRenderTarget();

            gl.disable(gl.STENCIL_TEST);// 切换frameBuffer注意要禁用STENCIL_TEST
            this.setTransform(1, 0, 0, -1, 0, this.surface.height);// 翻转,因为从frameBuffer中读出的图片是正的
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawTexture(target.texture, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            target.useFrameBuffer = true;
            this.renderContext.bindCurrentRenderTarget();
            // this.rootRenderTarget.useFrameBuffer = true;
            // this.renderContext.popTarget();

            if (this.maskPushed) {
                gl.enable(gl.STENCIL_TEST);
            }
        }
        /**
         * 交换surface的图像到frameBuffer中
         * @param width 宽度
         * @param height 高度
         */
        private drawSurfaceToFrameBuffer(sourceX:number,
          sourceY:number, sourceWidth:number, sourceHeight:number, destX:number, destY:number, destWidth:number, destHeight:number, clear:boolean = false):void {
            var gl = this.context;

            var target = this.renderContext.getCurrentTarget();
            target.useFrameBuffer = true;
            this.renderContext.bindCurrentRenderTarget();
            // this.rootRenderTarget.useFrameBuffer = true;
            // this.renderContext.pushTarget(this.rootRenderTarget);

            gl.disable(gl.STENCIL_TEST);// 切换frameBuffer注意要禁用STENCIL_TEST
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.setGlobalAlpha(1);
            this.setGlobalCompositeOperation("source-over");
            clear && this.clear();
            this.drawImage(<BitmapData><any>this.surface, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight, sourceWidth, sourceHeight);
            this.$drawWebGL();

            target.useFrameBuffer = false;
            this.renderContext.bindCurrentRenderTarget();
            // this.rootRenderTarget.useFrameBuffer = false;
            // this.renderContext.popTarget();

            if (this.maskPushed) {
                gl.enable(gl.STENCIL_TEST);
            }
        }

        //Rendering Functions end
    }

    // WebGLRenderBuffer.initBlendMode();

    // var sharedBuffer:WebGLRenderBuffer;
}
