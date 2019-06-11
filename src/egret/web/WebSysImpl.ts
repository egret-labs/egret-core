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
    function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        return createCanvas(width, height);
    }
    egret.sys.mainCanvas = mainCanvas;

    function createCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas: HTMLCanvasElement = document.createElement("canvas");
        if (!isNaN(width) && !isNaN(height)) {
            canvas.width = width;
            canvas.height = height;
        }
        return canvas;
    }
    egret.sys.createCanvas = createCanvas;

    /**
     * sys.resizeContext。
     */
    export function resizeContext(renderContext: egret.sys.RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        if (!renderContext) {
            return;
        }
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const surface = webglrendercontext.surface;
        if (useMaxSize) {
            if (surface.width < width) {
                surface.width = width;
            }
            if (surface.height < height) {
                surface.height = height;
            }
        }
        else {
            if (surface.width !== width) {
                surface.width = width;
            }
            if (surface.height !== height) {
                surface.height = height;
            }
        }
        webglrendercontext.onResize();
    }
    egret.sys.resizeContext = resizeContext;


    /**
     * sys.getContextWebGL
     */
    function getContextWebGL(surface: HTMLCanvasElement): WebGLRenderingContext {
        const options = {
            antialias: WebGLRenderContext.antialias,
            stencil: true//设置可以使用模板（用于不规则遮罩）
        };
        let gl: CanvasRenderingContext2D | WebGLRenderingContext = null;
        //todo 是否使用chrome源码names
        //let contextNames = ["moz-webgl", "webkit-3d", "experimental-webgl", "webgl", "3d"];
        const names = ["webgl", "experimental-webgl"];
        for (let i = 0; i < names.length; ++i) {
            try {
                gl = surface.getContext(names[i], options);
            } catch (e) {
            }
            if (gl) {
                break;
            }
        }
        if (!gl) {
            $error(1021);
        }
        return gl as WebGLRenderingContext;
    }
    egret.sys.getContextWebGL = getContextWebGL;
    /**
     * sys.getContext2d
     */
    export function getContext2d(surface: HTMLCanvasElement): CanvasRenderingContext2D {
        return surface ? surface.getContext('2d') : null;
    }
    egret.sys.getContext2d = getContext2d;

    /**
     * 创建一个WebGLTexture
     */
    function createTexture(renderContext: egret.sys.RenderContext, bitmapData: BitmapData): WebGLTexture {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl: any = webglrendercontext.context;
        const texture = gl.createTexture() as WebGLTexture;
        if (!texture) {
            //先创建texture失败,然后lost事件才发出来..
            webglrendercontext.contextLost = true;
            return;
        }
        texture[glContext] = gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    egret.sys.createTexture = createTexture;

    /**
     * 画texture
     **/
    function drawTextureElements(renderContext: egret.sys.RenderContext, data: any, offset: number): number {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl: WebGLRenderingContext = webglrendercontext.context;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, data.texture);
        const size = data.count * 3;
        gl.drawElements(gl.TRIANGLES, size, gl.UNSIGNED_SHORT, offset * 2);
        return size;
    }
    egret.sys.drawTextureElements = drawTextureElements;
}


