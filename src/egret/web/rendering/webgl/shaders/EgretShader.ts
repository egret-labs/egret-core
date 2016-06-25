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
     * 抽象shader类，所有shader的基类
     */
    export class EgretShader {

        // 着色器源码
        private defaultVertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +
            // "uniform vec2 offsetVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n" +
            "}";
        public fragmentSrc:string = "";

        private gl:WebGLRenderingContext = null;

        public program:WebGLProgram = null;

        public attributes:Array<number>;

        public uniforms = {
            projectionVector: {type: '2f', value: {x: 0, y: 0}, dirty: true}
        };

        // 有关顶点信息的通用属性
        public aVertexPosition:number;
        public aTextureCoord:number;
        public colorAttribute:number;

        constructor(gl:WebGLRenderingContext) {
            this.gl = gl;
        }

        public init():void {
            var gl:WebGLRenderingContext = this.gl;

            var program:WebGLProgram = WebGLUtils.compileProgram(gl, this.defaultVertexSrc, this.fragmentSrc);
            gl.useProgram(program);

            this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
            this.colorAttribute = gl.getAttribLocation(program, "aColor");

            if (this.colorAttribute === -1) {
                this.colorAttribute = 2;
            }
            this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];

            for (var key in this.uniforms) {
                this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
            }
            this.initUniforms();

            this.program = program;
        }

        public initUniforms():void {
            if (!this.uniforms) {
                return;
            }
            var gl:WebGLRenderingContext = this.gl;
            var uniform;

            for (var key in this.uniforms) {
                uniform = this.uniforms[key];
                uniform.dirty = true;
                var type = uniform.type;
                if (type === 'mat2' || type === 'mat3' || type === 'mat4') {
                    uniform.glMatrix = true;
                    uniform.glValueLength = 1;

                    if (type === 'mat2') {
                        uniform.glFunc = gl.uniformMatrix2fv;
                    }
                    else if (type === 'mat3') {
                        uniform.glFunc = gl.uniformMatrix3fv;
                    }
                    else if (type === 'mat4') {
                        uniform.glFunc = gl.uniformMatrix4fv;
                    }
                }
                else {
                    uniform.glFunc = gl['uniform' + type];

                    if (type === '2f' || type === '2i') {
                        uniform.glValueLength = 2;
                    }
                    else if (type === '3f' || type === '3i') {
                        uniform.glValueLength = 3;
                    }
                    else if (type === '4f' || type === '4i') {
                        uniform.glValueLength = 4;
                    }
                    else {
                        uniform.glValueLength = 1;
                    }
                }
            }
        }

        public syncUniforms():void {
            if (!this.uniforms) {
                return;
            }
            var uniform;
            var gl:WebGLRenderingContext = this.gl;

            for (var key in this.uniforms) {
                uniform = this.uniforms[key];

                if(uniform.dirty) {
                    if (uniform.glValueLength === 1) {
                        if (uniform.glMatrix === true) {
                            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
                        }
                        else {
                            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
                        }
                    }
                    else if (uniform.glValueLength === 2) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
                    }
                    else if (uniform.glValueLength === 3) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
                    }
                    else if (uniform.glValueLength === 4) {
                        uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
                    }

                    uniform.dirty = false;
                }

            }
        }

        /**
         * 同步视角坐标
         */
        public setProjection(projectionX:number, projectionY:number):void {
            var uniform = this.uniforms.projectionVector;

            if(uniform.value.x != projectionX || uniform.value.y != projectionY) {
                uniform.value.x = projectionX;
                uniform.value.y = projectionY;

                uniform.dirty = true;
            }
        }

        /**
         * 设置attribute pointer
         */
        public setAttribPointer(stride:number):void {
            var gl:WebGLRenderingContext = this.gl;
            gl.vertexAttribPointer(this.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
            gl.vertexAttribPointer(this.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
            gl.vertexAttribPointer(this.colorAttribute, 1, gl.FLOAT, false, stride, 4 * 4);
        }
    }
}
