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
     * WebGLRenderTarget
     * 一个WebGL渲染目标，拥有一个frame buffer和texture
     * A webgl render target, has a frame buffer and a texture
     */
    export class WebGLRenderTarget {

        // draw result will store in this texture
        public texture:WebGLTexture;

        private frameBuffer:WebGLFramebuffer;

        private stencilBuffer:WebGLRenderbuffer;

        private gl:WebGLRenderingContext;

        public width:number;
        public height:number;

        // if dont use frame buffer, get frame buffer will return null
        public useFrameBuffer:boolean;

        public constructor(gl:WebGLRenderingContext, width:number, height:number, useFrameBuffer:boolean = true) {
            this.gl = gl;

            // width and height cannot be 0, or webgl will throw a warn
            this.width = width || 1;
            this.height = height || 1;

            this.useFrameBuffer = useFrameBuffer;

            this.texture = this.createTexture();

            // create a frame buffer
            this.frameBuffer = gl.createFramebuffer();
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);

            // bind a texture to frame buffer, store color data
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

            // bind a stencil buffer to frame buffer, store stencil data
            this.stencilBuffer = gl.createRenderbuffer();
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_STENCIL_ATTACHMENT, gl.RENDERBUFFER, this.stencilBuffer);

            gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        }

        /**
         * resize this render target, this will cause render target unbind
         */
        public resize(width:number, height:number):void {
            width = width || 1;
            height = height || 1;
            if(this.width == width && this.height == height) {
                return;
            }
            var gl = this.gl;
            this.width = width;
            this.height = height;
            // resize texture
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.bindTexture(gl.TEXTURE_2D, null);

            // resize renderbuffer
            gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer);
            gl.bindRenderbuffer(gl.RENDERBUFFER, this.stencilBuffer);
            gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_STENCIL, this.width, this.height);
            // cause frame buffer unbind!!!
            gl.bindFramebuffer(gl.FRAMEBUFFER, null);

        }

        // if dont use frame buffer, get frame buffer will return null
        // so gl will bind frame buffer with a null
        public getFrameBuffer():WebGLFramebuffer {
            if(!this.useFrameBuffer) {
                return null;
            }
            return this.frameBuffer;
        }

        /**
         * create a texture
         */
        private createTexture():WebGLTexture {
            var gl = this.gl;

            var texture:WebGLTexture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            // set width and height, cannot be 0
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.width, this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.bindTexture(gl.TEXTURE_2D, null);
            return texture;
        }

    }

}
