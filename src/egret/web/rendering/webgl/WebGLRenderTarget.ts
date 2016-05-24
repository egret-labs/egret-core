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
     * WebGLRenderTarget类
     * 一个WebGL渲染目标，拥有一个frame buffer和texture
     */
    export class WebGLRenderTarget {

        private gl:WebGLRenderingContext;

        // 存储着绘制结果的texture
        // 某些场景下是否需要一个切换方法？
        public texture:WebGLTexture;

        private frameBuffer:WebGLFramebuffer;

        private stencilBuffer:WebGLRenderbuffer;

        // render target 的尺寸，与texture和stencil buffer的尺寸一致
        public width:number;
        public height:number;

        // 清除色
        public clearColor = [0, 0, 0, 0];

        public constructor(gl:WebGLRenderingContext, width:number, height:number) {
            this.gl = gl;

            // 如果尺寸为 0 chrome会报警
            this.width = width || 1;
            this.height = height || 1;

            // 创建材质
            this.texture = this.createTexture();

            // 创建frame buffer
            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            // 绑定材质
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

            // 绑定stencil buffer
            this.stencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);

        }

        /**
         * 重置render target的尺寸
         */
        public resize(width:number, height:number):void {
            var gl = this.gl;

            // 设置texture尺寸
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            // gl.bindTexture(gl.TEXTURE_2D, null);

            // 设置render buffer的尺寸
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);// 是否需要强制绑定？
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);// 是否需要强制绑定？
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, width, height);

            this.width = width;
            this.height = height;

            // 此处不解绑是否会造成bug？
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        /**
         * 激活此render target
         */
        public activate():void {
            var gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
        }

        // 是否启用frame buffer, 默认为true
        public useFrameBuffer:boolean = true;
        /**
         * 获取frame buffer
         */
        private getFrameBuffer():WebGLFramebuffer {
            if(!this.useFrameBuffer) {
                return null;
            }
            return this.frameBuffer;
        }

        /**
         * 创建材质
         * TODO 创建材质的方法可以合并
         */
        private createTexture():WebGLTexture {
            var gl = this.gl;

            var texture:WebGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }

        /**
         * 清除render target颜色缓存
         */
        public clear(bind?:boolean) {
            var gl = this.gl;

            if(bind) {
                this.activate();
            }

            gl.colorMask(true, true, true, true);
            gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }
    }

}
