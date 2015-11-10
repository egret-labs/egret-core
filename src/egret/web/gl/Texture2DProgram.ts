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

    var VERTEX_SIZE = 11;

    function enableAttribute(gl:WebGLRenderingContext, program:WebGLProgram, name:string, size:number,
                             length:number, offset:number):void {
        var location = gl.getAttribLocation(program, name);
        gl.vertexAttribPointer(location, size, gl.FLOAT, false, length, offset);
        gl.enableVertexAttribArray(location);
    }

    export class Texture2DProgram {

        public constructor(gl:WebGLRenderingContext, screenWidth:number, screenHeight:number) {
            this.screenWidth = screenWidth;
            this.screenHeight = screenHeight;
            this.reset(gl);
        }

        private gl:WebGLRenderingContext;
        private program:WebGLProgram;
        private vertexBuffer:WebGLBuffer;
        private screenWidth:number;
        private screenHeight:number;

        public resize(screenWidth:number, screenHeight:number):void {
            this.screenWidth = screenWidth;
            this.screenHeight = screenHeight;
            var gl = this.gl;
            var program = this.program;
            gl.useProgram(program);
            gl.viewport(0,0,screenWidth,screenHeight);
            var u_ScreenSize = gl.getUniformLocation(program, "u_ScreenSize");
            gl.uniform2f(u_ScreenSize, screenWidth, screenHeight);
        }

        public reset(gl:WebGLRenderingContext):void {
            this.gl = gl;
            var vertexShader = this.createShader(gl, gl.VERTEX_SHADER, vertexSource);
            var fragmentShader = this.createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
            var program = gl.createProgram();
            this.program = program;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                log("Unable to initialize the shader program.");
            }
            gl.useProgram(program);
            var u_Sampler = gl.getUniformLocation(program, "u_Sampler");
            gl.uniform1i(u_Sampler, 0);
            this.initAttribLocation(gl, program);
            this.resize(this.screenWidth, this.screenHeight);
        }

        private initAttribLocation(gl:WebGLRenderingContext, program:WebGLProgram):void {

            var vertexBuffer = gl.createBuffer();
            this.vertexBuffer = vertexBuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            var size = Float32Array.BYTES_PER_ELEMENT;
            var length = size * VERTEX_SIZE;
            enableAttribute(gl, program, "a_TexCoord", 2, length, 0);
            enableAttribute(gl, program, "a_Position", 2, length, size * 2);
            enableAttribute(gl, program, "a_Alpha", 1, length, size * 4);
            enableAttribute(gl, program, "a", 1, length, size * 5);
            enableAttribute(gl, program, "b", 1, length, size * 6);
            enableAttribute(gl, program, "c", 1, length, size * 7);
            enableAttribute(gl, program, "d", 1, length, size * 8);
            enableAttribute(gl, program, "tx", 1, length, size * 9);
            enableAttribute(gl, program, "ty", 1, length, size * 10);
        }

        private createShader(gl:WebGLRenderingContext, type:number, source:string):WebGLShader {
            var shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                log("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader) + "\n" + source);
                return null;
            }
            return shader;
        }

        public drawTexture(texture:WebGLTexture, width:number, height:number, vertices:Float32Array):void {
            var gl = this.gl;
            var program = this.program;
            gl.useProgram(program);
            var u_TextureSize = gl.getUniformLocation(program, "u_TextureSize");
            gl.uniform2f(u_TextureSize, width, height);
            var vertexBuffer = this.vertexBuffer;
            gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length / VERTEX_SIZE);
        }

    }


    var vertexSource = `
    //屏幕尺寸
    uniform vec2 u_ScreenSize;
    //纹理尺寸
    uniform vec2 u_TextureSize;
    attribute vec2 a_Position;
    attribute vec2 a_TexCoord;
    attribute float a_Alpha;
    attribute float a;
    attribute float b;
    attribute float c;
    attribute float d;
    attribute float tx;
    attribute float ty;
    varying vec2 v_TexCoord;
    varying float v_Alpha;
    void main(){
        float x = a * a_Position.x + c * a_Position.y + tx;
        float y = b * a_Position.x + d * a_Position.y + ty;
        vec2 clipSpace = vec2(x,y);
        //转换坐标到（-1，1）
        clipSpace = (clipSpace / u_ScreenSize) * 2.0 - 1.0;
        //反转Y轴
        clipSpace = clipSpace * vec2(1, -1);

        gl_Position = vec4(clipSpace, 0, 1);
        v_TexCoord = a_TexCoord / u_TextureSize;
        v_Alpha = a_Alpha;
    }`;

    var fragmentSource = `
    precision mediump float;
    uniform sampler2D u_Sampler;
    varying vec2 v_TexCoord;
    varying float v_Alpha;
    void main() {
        gl_FragColor = texture2D(u_Sampler,v_TexCoord)*v_Alpha;
    }`;
}