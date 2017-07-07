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
     * @private
     * WebGL渲染缓存
     */
    export class WebGLRenderBuffer extends HashObject implements sys.RenderBuffer {

        public static autoClear: boolean = true;

        /**
         * 渲染上下文
         */
        public context: WebGLRenderContext;

        /**
         * 如果是舞台缓存，为canvas
         * 如果是普通缓存，为renderTarget
         */
        public surface: any;

        /**
         * root render target
         * 根渲染目标，用来执行主渲染
         */
        public rootRenderTarget: WebGLRenderTarget;

        /**
         * 是否为舞台buffer
         */
        private root: boolean;

        public constructor(width?: number, height?: number, root?: boolean) {
            super();
            // 获取webglRenderContext
            this.context = WebGLRenderContext.getInstance(width, height);
            // buffer 对应的 render target
            this.rootRenderTarget = new WebGLRenderTarget(this.context.context, 3, 3);
            if (width && height) {
                this.resize(width, height);
            }

            // 如果是第一个加入的buffer，说明是舞台buffer
            this.root = root;

            // 如果是用于舞台渲染的renderBuffer，则默认添加renderTarget到renderContext中，而且是第一个
            if (this.root) {
                this.context.pushBuffer(this);
                // 画布
                this.surface = this.context.surface;
            } else {
                // 由于创建renderTarget造成的frameBuffer绑定，这里重置绑定
                let lastBuffer = this.context.activatedBuffer;
                if (lastBuffer) {
                    lastBuffer.rootRenderTarget.activate();
                }
                this.rootRenderTarget.initFrameBuffer();
                this.surface = this.rootRenderTarget;
            }
        }

        public globalAlpha: number = 1;
        /**
         * stencil state
         * 模版开关状态
         */
        private stencilState: boolean = false;
        public $stencilList = [];
        public stencilHandleCount: number = 0;

        public enableStencil(): void {
            if (!this.stencilState) {
                this.context.enableStencilTest();
                this.stencilState = true;
            }
        }

        public disableStencil(): void {
            if (this.stencilState) {
                this.context.disableStencilTest();
                this.stencilState = false;
            }
        }

        public restoreStencil(): void {
            if (this.stencilState) {
                this.context.enableStencilTest();
            } else {
                this.context.disableStencilTest();
            }
        }

        /**
         * scissor state
         * scissor 开关状态  
         */
        public $scissorState: boolean = false;
        private scissorRect: Rectangle = new egret.Rectangle();
        public $hasScissor: boolean = false;

        public enableScissor(x: number, y: number, width: number, height: number): void {
            if (!this.$scissorState) {
                this.$scissorState = true;
                this.scissorRect.setTo(x, y, width, height);
                this.context.enableScissorTest(this.scissorRect);
            }
        }

        public disableScissor(): void {
            if (this.$scissorState) {
                this.$scissorState = false;
                this.scissorRect.setEmpty();
                this.context.disableScissorTest();
            }
        }

        public restoreScissor(): void {
            if (this.$scissorState) {
                this.context.enableScissorTest(this.scissorRect);
            } else {
                this.context.disableScissorTest();
            }
        }

        /**
         * 渲染缓冲的宽度，以像素为单位。
         * @readOnly
         */
        public get width(): number {
            return this.rootRenderTarget.width;
        }

        /**
         * 渲染缓冲的高度，以像素为单位。
         * @readOnly
         */
        public get height(): number {
            return this.rootRenderTarget.height;
        }

        /**
         * 改变渲染缓冲的大小并清空缓冲区
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param useMaxSize 若传入true，则将改变后的尺寸与已有尺寸对比，保留较大的尺寸。
         */
        public resize(width: number, height: number, useMaxSize?: boolean): void {
            this.context.pushBuffer(this);

            width = width || 1;
            height = height || 1;

            // render target 尺寸重置
            if (width != this.rootRenderTarget.width || height != this.rootRenderTarget.height) {
                this.context.drawCmdManager.pushResize(this, width, height);
                // 同步更改宽高
                this.rootRenderTarget.width = width;
                this.rootRenderTarget.height = height;
            }

            // 如果是舞台的渲染缓冲，执行resize，否则surface大小不随之改变
            if (this.root) {
                this.context.resize(width, height, useMaxSize);
            }

            this.context.clear();

            this.context.popBuffer();
        }



        /**
         * 改变渲染缓冲为指定大小，但保留原始图像数据
         * @param width 改变后的宽
         * @param height 改变后的高
         * @param offsetX 原始图像数据在改变后缓冲区的绘制起始位置x
         * @param offsetY 原始图像数据在改变后缓冲区的绘制起始位置y
         */
        public resizeTo(width: number, height: number, offsetX: number, offsetY: number): void {
            this.context.pushBuffer(this);

            let oldWidth = this.rootRenderTarget.width;
            let oldHeight = this.rootRenderTarget.height;
            let tempBuffer: WebGLRenderBuffer = WebGLRenderBuffer.create(oldWidth, oldHeight);
            this.context.pushBuffer(tempBuffer);
            this.context.drawImage(<BitmapData><any>this.rootRenderTarget, 0, 0, oldWidth, oldHeight,
                0, 0, oldWidth, oldHeight, oldWidth, oldHeight, false);
            this.context.popBuffer();

            this.resize(width, height);

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.context.drawImage(<BitmapData><any>tempBuffer.rootRenderTarget, 0, 0, oldWidth, oldHeight,
                offsetX, offsetY, oldWidth, oldHeight, oldWidth, oldHeight, false);
            WebGLRenderBuffer.release(tempBuffer);
            this.context.popBuffer();
        }

        // dirtyRegionPolicy hack
        private dirtyRegionPolicy: boolean = true;
        private _dirtyRegionPolicy: boolean = true;// 默认设置为true，保证第一帧绘制在frameBuffer上
        public setDirtyRegionPolicy(state: string): void {
            this.dirtyRegionPolicy = (state == "on");
        }

        /**
         * 清空并设置裁切
         * @param regions 矩形列表
         * @param offsetX 矩形要加上的偏移量x
         * @param offsetY 矩形要加上的偏移量y
         */
        public beginClip(regions: sys.Region[], offsetX?: number, offsetY?: number): void {

            this.context.pushBuffer(this);

            if (this.root) {
                // dirtyRegionPolicy hack
                if (this._dirtyRegionPolicy) {
                    this.rootRenderTarget.useFrameBuffer = true;
                    this.rootRenderTarget.activate();
                } else {
                    this.rootRenderTarget.useFrameBuffer = false;
                    this.rootRenderTarget.activate();
                    WebGLRenderBuffer.autoClear && this.context.clear();
                }
            }

            offsetX = +offsetX || 0;
            offsetY = +offsetY || 0;
            this.setTransform(1, 0, 0, 1, offsetX, offsetY);
            let length = regions.length;
            //只有一个区域且刚好为舞台大小时,不设置模板
            // if (length == 1 && regions[0].minX == 0 && regions[0].minY == 0 &&
            //     regions[0].width == this.rootRenderTarget.width && regions[0].height == this.rootRenderTarget.height) {
            this.maskPushed = false;
            this.rootRenderTarget.useFrameBuffer && this.context.clear();
            this.context.popBuffer();
            return;
            // }
            // 擦除脏矩形区域
            // for (let i = 0; i < length; i++) {
            //     let region = regions[i];
            //     this.context.clearRect(region.minX, region.minY, region.width, region.height);
            // }
            // // 设置模版
            // if (length > 0) {

            //     // 对第一个且只有一个mask用scissor处理
            //     if(!this.$hasScissor && length == 1) {
            //         let region = regions[0];
            //         regions = regions.slice(1);
            //         let x = region.minX + offsetX;
            //         let y = region.minY + offsetY;
            //         let width = region.width;
            //         let height = region.height;
            //         this.context.enableScissor(x, - y - height + this.height, width, height);
            //         this.scissorEnabled = true;
            //     } else {
            //         this.scissorEnabled = false;
            //     }

            //     if(regions.length > 0) {
            //         this.context.pushMask(regions);
            //         this.maskPushed = true;
            //     } else {
            //         this.maskPushed = false;
            //     }

            //     this.offsetX = offsetX;
            //     this.offsetY = offsetY;
            // }
            // else {
            //     this.maskPushed = false;
            // }

            // this.context.popBuffer();
        }

        private maskPushed: boolean;
        private scissorEnabled: boolean;
        private offsetX: number;
        private offsetY: number;

        /**
         * 取消上一次设置的clip。
         */
        public endClip(): void {
            if (this.maskPushed || this.scissorEnabled) {
                this.context.pushBuffer(this);

                if (this.maskPushed) {
                    this.setTransform(1, 0, 0, 1, this.offsetX, this.offsetY);
                    this.context.popMask();
                }

                if (this.scissorEnabled) {
                    this.context.disableScissor();
                }

                this.context.popBuffer();
            }
        }

        /**
         * 获取指定区域的像素
         */
        public getPixels(x: number, y: number, width: number = 1, height: number = 1): number[] {
            let pixels = new Uint8Array(4 * width * height);

            let useFrameBuffer = this.rootRenderTarget.useFrameBuffer;
            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.context.getPixels(x, y, width, height, pixels);

            this.rootRenderTarget.useFrameBuffer = useFrameBuffer;
            this.rootRenderTarget.activate();

            //图像反转
            let result = new Uint8Array(4 * width * height);
            for (let i = 0; i < height; i++) {
                for (let j = 0; j < width; j++) {
                    result[(width * (height - i - 1) + j) * 4] = pixels[(width * i + j) * 4];
                    result[(width * (height - i - 1) + j) * 4 + 1] = pixels[(width * i + j) * 4 + 1];
                    result[(width * (height - i - 1) + j) * 4 + 2] = pixels[(width * i + j) * 4 + 2];
                    result[(width * (height - i - 1) + j) * 4 + 3] = pixels[(width * i + j) * 4 + 3];
                }
            }

            return <number[]><any>result;
        }

        /**
         * 转换成base64字符串，如果图片（或者包含的图片）跨域，则返回null
         * @param type 转换的类型，如: "image/png","image/jpeg"
         */
        public toDataURL(type?: string, encoderOptions?: number): string {
            return this.context.surface.toDataURL(type, encoderOptions);
        }

        /**
         * 销毁绘制对象
         */
        public destroy(): void {
            this.context.destroy();
        }

        public onRenderFinish(): void {
            this.$drawCalls = 0;

            // 如果是舞台渲染buffer，判断脏矩形策略
            if (this.root) {
                // dirtyRegionPolicy hack
                if (!this._dirtyRegionPolicy && this.dirtyRegionPolicy) {
                    this.drawSurfaceToFrameBuffer(0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, 0, 0, this.rootRenderTarget.width, this.rootRenderTarget.height, true);
                }
                if (this._dirtyRegionPolicy) {
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
        private drawFrameBufferToSurface(sourceX: number,
            sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest();// 切换frameBuffer注意要禁用STENCIL_TEST
            this.context.disableScissorTest();

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.globalAlpha = 1;
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.rootRenderTarget, sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
            this.context.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.restoreStencil();
            this.restoreScissor();
        }

        /**
         * 交换surface的图像到frameBuffer中
         * @param width 宽度
         * @param height 高度
         */
        private drawSurfaceToFrameBuffer(sourceX: number,
            sourceY: number, sourceWidth: number, sourceHeight: number, destX: number, destY: number, destWidth: number, destHeight: number, clear: boolean = false): void {
            this.rootRenderTarget.useFrameBuffer = true;
            this.rootRenderTarget.activate();

            this.context.disableStencilTest();// 切换frameBuffer注意要禁用STENCIL_TEST
            this.context.disableScissorTest();

            this.setTransform(1, 0, 0, 1, 0, 0);
            this.globalAlpha = 1;
            this.context.setGlobalCompositeOperation("source-over");
            clear && this.context.clear();
            this.context.drawImage(<BitmapData><any>this.context.surface, sourceX, sourceY, sourceWidth, sourceHeight,
                destX, destY, destWidth, destHeight, sourceWidth, sourceHeight, false);
            this.context.$drawWebGL();

            this.rootRenderTarget.useFrameBuffer = false;
            this.rootRenderTarget.activate();

            this.restoreStencil();
            this.restoreScissor();
        }

        /**
         * 清空缓冲区数据
         */
        public clear(): void {
            this.context.clear();
        }

        public $drawCalls: number = 0;
        public $computeDrawCall: boolean = false;

        public globalMatrix: Matrix = new Matrix();
        public savedGlobalMatrix: Matrix = new Matrix();

        public setTransform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            // this.globalMatrix.setTo(a, b, c, d, tx, ty);
            let matrix = this.globalMatrix;
            matrix.a = a;
            matrix.b = b;
            matrix.c = c;
            matrix.d = d;
            matrix.tx = tx;
            matrix.ty = ty;
        }

        public transform(a: number, b: number, c: number, d: number, tx: number, ty: number): void {
            // this.globalMatrix.append(a, b, c, d, tx, ty);
            let matrix = this.globalMatrix;
            let a1 = matrix.a;
            let b1 = matrix.b;
            let c1 = matrix.c;
            let d1 = matrix.d;
            if (a != 1 || b != 0 || c != 0 || d != 1) {
                matrix.a = a * a1 + b * c1;
                matrix.b = a * b1 + b * d1;
                matrix.c = c * a1 + d * c1;
                matrix.d = c * b1 + d * d1;
            }
            matrix.tx = tx * a1 + ty * c1 + matrix.tx;
            matrix.ty = tx * b1 + ty * d1 + matrix.ty;
        }

        public translate(dx: number, dy: number): void {
            // this.globalMatrix.translate(dx, dy);
            let matrix = this.globalMatrix;
            matrix.tx += dx;
            matrix.ty += dy;
        }

        public saveTransform(): void {
            // this.savedGlobalMatrix.copyFrom(this.globalMatrix);
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            sMatrix.a = matrix.a;
            sMatrix.b = matrix.b;
            sMatrix.c = matrix.c;
            sMatrix.d = matrix.d;
            sMatrix.tx = matrix.tx;
            sMatrix.ty = matrix.ty;
        }

        public restoreTransform(): void {
            // this.globalMatrix.copyFrom(this.savedGlobalMatrix);
            let matrix = this.globalMatrix;
            let sMatrix = this.savedGlobalMatrix;
            matrix.a = sMatrix.a;
            matrix.b = sMatrix.b;
            matrix.c = sMatrix.c;
            matrix.d = sMatrix.d;
            matrix.tx = sMatrix.tx;
            matrix.ty = sMatrix.ty;
        }

        /**
         * 创建一个buffer实例
         */
        public static create(width: number, height: number): WebGLRenderBuffer {
            let buffer = renderBufferPool.pop();
            // width = Math.min(width, 1024);
            // height = Math.min(height, 1024);
            if (buffer) {
                buffer.resize(width, height);
                var matrix = buffer.globalMatrix;
                matrix.a = 1;
                matrix.b = 0;
                matrix.c = 0;
                matrix.d = 1;
                matrix.tx = 0;
                matrix.ty = 0;
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
        public static release(buffer: WebGLRenderBuffer): void {
            renderBufferPool.push(buffer);
        }

    }

    let renderBufferPool: WebGLRenderBuffer[] = [];//渲染缓冲区对象池
}
