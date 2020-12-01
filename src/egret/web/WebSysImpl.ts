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
     */
    export const enum WEBGL_ATTRIBUTE_TYPE {
        FLOAT_VEC2 = 0x8B50,
        FLOAT_VEC3 = 0x8B51,
        FLOAT_VEC4 = 0x8B52,
        FLOAT = 0x1406,
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        UNSIGNED_SHORT = 0x1403
    }
    /**
     * @private  
     */
    export const enum WEBGL_UNIFORM_TYPE {
        FLOAT_VEC2 = 0x8B50,
        FLOAT_VEC3 = 0x8B51,
        FLOAT_VEC4 = 0x8B52,
        INT_VEC2 = 0x8B53,
        INT_VEC3 = 0x8B54,
        INT_VEC4 = 0x8B55,
        BOOL = 0x8B56,
        BOOL_VEC2 = 0x8B57,
        BOOL_VEC3 = 0x8B58,
        BOOL_VEC4 = 0x8B59,
        FLOAT_MAT2 = 0x8B5A,
        FLOAT_MAT3 = 0x8B5B,
        FLOAT_MAT4 = 0x8B5C,
        SAMPLER_2D = 0x8B5E,
        SAMPLER_CUBE = 0x8B60,
        BYTE = 0x1400,
        UNSIGNED_BYTE = 0x1401,
        SHORT = 0x1402,
        UNSIGNED_SHORT = 0x1403,
        INT = 0x1404,
        UNSIGNED_INT = 0x1405,
        FLOAT = 0x1406
    }
    /**
     * 创建一个canvas。
     */
    function mainCanvas(width?: number, height?: number): HTMLCanvasElement {
        let canvas = createCanvas(width, height);
        if (egret.pro.egret2dDriveMode) {
            egret.pro.mainCanvas = canvas;
        }
        return canvas;
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
        texture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmapData);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    egret.sys.createTexture = createTexture;

    /**
     * 创建一个WebGLTexture
     */
    function _createTexture(renderContext: egret.sys.RenderContext, width: number, height: number, data: any): WebGLTexture {
        const webglrendercontext = <WebGLRenderContext>renderContext;
        const gl = webglrendercontext.context as WebGLRenderingContext;
        const texture: WebGLTexture = gl.createTexture() as WebGLTexture;
        if (!texture) {
            //先创建texture失败,然后lost事件才发出来..
            webglrendercontext.contextLost = true;
            return null;
        }
        //
        texture[glContext] = gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 1);
        texture[UNPACK_PREMULTIPLY_ALPHA_WEBGL] = true;
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        return texture;
    }
    egret.sys._createTexture = _createTexture;

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

    /**
     * 测量文本的宽度
     * @param context 
     * @param text 
     */
    function measureTextWith(context: CanvasRenderingContext2D, text: string): number {
        return context.measureText(text).width;
    }
    egret.sys.measureTextWith = measureTextWith;

    /**
     * 为CanvasRenderBuffer创建一个HTMLCanvasElement
     * @param defaultFunc 
     * @param width 
     * @param height 
     * @param root 
     */
    function createCanvasRenderBufferSurface(defaultFunc: (width?: number, height?: number) => HTMLCanvasElement, width?: number, height?: number, root?: boolean): HTMLCanvasElement {
        return defaultFunc(width, height);
    }
    egret.sys.createCanvasRenderBufferSurface = createCanvasRenderBufferSurface;

    /**
     * 改变渲染缓冲的大小并清空缓冲区
     * @param renderContext 
     * @param width 
     * @param height 
     * @param useMaxSize 
     */
    function resizeCanvasRenderBuffer(renderContext: egret.sys.RenderContext, width: number, height: number, useMaxSize?: boolean): void {
        let canvasRenderBuffer = <CanvasRenderBuffer>renderContext;
        let surface = canvasRenderBuffer.surface;
        if (useMaxSize) {
            let change = false;
            if (surface.width < width) {
                surface.width = width;
                change = true;
            }
            if (surface.height < height) {
                surface.height = height;
                change = true;
            }
            //尺寸没有变化时,将绘制属性重置
            if (!change) {
                canvasRenderBuffer.context.globalCompositeOperation = "source-over";
                canvasRenderBuffer.context.setTransform(1, 0, 0, 1, 0, 0);
                canvasRenderBuffer.context.globalAlpha = 1;
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
        canvasRenderBuffer.clear();
    }
    egret.sys.resizeCanvasRenderBuffer = resizeCanvasRenderBuffer;

    egret.Geolocation = egret.web.WebGeolocation;
    egret.Motion = egret.web.WebMotion;

    /**
     * 
     * @param name 
     * @param path 
     */
    function registerFontMapping(name: string, path: string): void {
        if ((window as any).FontFace) {
            return loadFontByFontFace(name, path);
        } else {
            return loadFontByWebStyle(name, path);
        }
    }
    egret.sys.registerFontMapping = registerFontMapping;

    function loadFontByFontFace(name: string, path: string): void {
        const fontResCache = egret.sys.fontResourceCache;
        if (!fontResCache || !fontResCache[path]) {
            console.warn(`registerFontMapping_WARN: Can not find TTF file:${path}, please load file first.`);
            return;
        }
        const resCache = fontResCache[path];
        const fontFace = new (window as any).FontFace(name, resCache);
        (document as any).fonts.add(fontFace);
        fontFace.load().catch((err) => {
            console.error(`loadFontError:`, err);
        })
    };

    function loadFontByWebStyle(name: string, path: string): void {
        const styleElement = document.createElement("style");
        styleElement.type = "text/css";
        styleElement.textContent = `
            @font-face
            {
                font-family:"${name}";
                src:url("${path}");
            }`;
        styleElement.onerror = (err) => {
            console.error(`loadFontError:`, err);
        }
        document.body.appendChild(styleElement);
    }


    isIOS14Device = function () {
        return egret.Capabilities.runtimeType == egret.RuntimeType.WEB
            && egret.Capabilities.os == "iOS"
            && egret.Capabilities.isMobile
            && /iPhone OS 14/.test(window.navigator.userAgent);
    };
}


