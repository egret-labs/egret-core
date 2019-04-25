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
     * WebGLRenderTarget 
     * A WebGL render target with a frame buffer and texture
     */
    export class WebGLRenderTarget extends HashObject {

        private gl: WebGLRenderingContext;

        // stores the texture of the rendering results
        public texture: WebGLTexture;

        private frameBuffer: WebGLFramebuffer;

        private stencilBuffer: WebGLRenderbuffer;

        // The size of the render target, same as the texture and stencil buffer
        public width: number;
        public height: number;

        public clearColor = [0, 0, 0, 0];
        /**
         * If frame buffer is enabled, the default is true
         */
        public useFrameBuffer: boolean = true;

        public constructor(gl: WebGLRenderingContext, width: number, height: number) {
            super();
            this.gl = gl;
            this._resize(width, height);
        }

        private _resize(width: number, height: number): void {
            // Chrome alerts if the size is 0
            width = width || 1;
            height = height || 1;
            if (width < 1) {
                if (DEBUG) {
                    egret.warn('WebGLRenderTarget _resize width = ' + width);
                }
                width = 1;
            }
            if (height < 1) {
                if (DEBUG) {
                    egret.warn('WebGLRenderTarget _resize height = ' + height);
                }
                height = 1;
            }
            this.width = width;
            this.height = height;
        }

        public resize(width: number, height: number): void {
            this._resize(width, height);
            let gl = this.gl;
            if (this.frameBuffer) {
                gl.bindTexture(gl.TEXTURE_2D, this.texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
                // gl.bindTexture(gl.TEXTURE_2D, null);
            }
            if (this.stencilBuffer) {
                gl.deleteRenderbuffer(this.stencilBuffer);
                this.stencilBuffer = null;
            }
        }

        public activate(): void {
            let gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.getFrameBuffer());
        }

        private getFrameBuffer(): WebGLFramebuffer {
            if (!this.useFrameBuffer) {
                return null;
            }
            return this.frameBuffer;
        }

        public initFrameBuffer(): void {
            if (!this.frameBuffer) {
                let gl = this.gl;
                this.texture = this.createTexture();
                this.frameBuffer = gl.createFramebuffer();
                gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
                gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
            }
        }

        private createTexture(): WebGLTexture {
            const gl = this.gl;
            const texture: WebGLTexture = gl.createTexture();
            texture[glContext] = gl;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            return texture;
        }

        public clear(bind?: boolean) {
            let gl = this.gl;
            if (bind) {
                this.activate();
            }
            gl.colorMask(true, true, true, true);
            gl.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        public enabledStencil(): void {
            if (!this.frameBuffer || this.stencilBuffer) {
                return;
            }
            let gl = this.gl;
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            this.stencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);

            // Is unbundling a bug here?
            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        public dispose(): void {
            WebGLUtils.deleteWebGLTexture(this.texture);
        }
    }
}
