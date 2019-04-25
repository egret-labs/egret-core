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
namespace egret {
    /**
     * @private
     */
    export class WebGLUtils {
        public static compileProgram(gl: WebGLRenderingContext, vertexSrc: string, fragmentSrc: string): WebGLProgram {
            let fragmentShader: WebGLShader = WebGLUtils.compileFragmentShader(gl, fragmentSrc);
            let vertexShader: WebGLShader = WebGLUtils.compileVertexShader(gl, vertexSrc);

            let shaderProgram: WebGLProgram = gl.createProgram();
            gl.attachShader(shaderProgram, vertexShader);
            gl.attachShader(shaderProgram, fragmentShader);
            gl.linkProgram(shaderProgram);

            if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
                $warn(1020);
            }
            return shaderProgram;
        }

        public static compileFragmentShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
        }

        public static compileVertexShader(gl: WebGLRenderingContext, shaderSrc: string): WebGLShader {
            return WebGLUtils._compileShader(gl, shaderSrc, gl.VERTEX_SHADER);
        }

        private static _compileShader(gl: WebGLRenderingContext, shaderSrc: string, shaderType: number): WebGLShader {
            let shader: WebGLShader = gl.createShader(shaderType);
            gl.shaderSource(shader, shaderSrc);
            gl.compileShader(shader);

            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                //egret.info(gl.getShaderInfoLog(shader));
                return null;
            }
            return shader;
        }

        private static canUseWebGL: boolean;

        public static checkCanUseWebGL(): boolean {
            if (WebGLUtils.canUseWebGL == undefined) {
                try {
                    let canvas = document.createElement("canvas");
                    WebGLUtils.canUseWebGL = !!window["WebGLRenderingContext"]
                        && !!(canvas.getContext("webgl") || canvas.getContext("experimental-webgl"));
                }
                catch (e) {
                    WebGLUtils.canUseWebGL = false;
                }
            }
            return WebGLUtils.canUseWebGL;
        }

        public static deleteWebGLTexture(webglTexture: WebGLTexture): void {
            if (!webglTexture) {
                return;
            }
            if (webglTexture[engine_default_empty_texture]) {
                if (DEBUG) {
                    //引擎默认的空白纹理，不允许删除
                    console.warn('deleteWebGLTexture:' + engine_default_empty_texture);
                }
                return;
            }
            const gl = webglTexture[glContext] as WebGLRenderingContext;
            if (gl) {
                gl.deleteTexture(webglTexture);
            }
            else {
                if (DEBUG) {
                    console.error('deleteWebGLTexture gl = ' + gl);
                }
            }
            /*old
            if (webglTexture && !webglTexture['engine_default_empty_texture']) {
                const gl = webglTexture['glContext'] as WebGLRenderingContext;//bitmapData.glContext;
                if (gl) {
                    gl.deleteTexture(webglTexture);
                }
                else {
                    console.error('deleteWebGLTexture gl = ' + gl);
                }
            }
            */
        }
    }
}