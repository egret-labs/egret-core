/**
 * Copyright (c) 2014,Egret-Labs.org
 * All rights reserved.
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of the Egret-Labs.org nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY EGRET-LABS.ORG AND CONTRIBUTORS "AS IS" AND ANY
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL EGRET-LABS.ORG AND CONTRIBUTORS BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
module egret {
    export class WebGLShaderManager {
        private gl:any;
        private maxAttibs:number = 10;
        private attribState:Array<any> = [];
        private tempAttribState:Array<any> = [];

        constructor(gl:any) {
            for (var i = 0; i < this.maxAttibs; i++) {
                this.attribState[i] = false;
            }
            this.setContext(gl);
        }

        public defaultShader:EgretShader;
        public primitiveShader:PrimitiveShader;

        public setContext(gl:any) {
            this.gl = gl;
            this.primitiveShader = new PrimitiveShader(gl);
            this.defaultShader = new EgretShader(gl);
            this.activateShader(this.defaultShader);
        }

        public activateShader(shader) {
            this.gl.useProgram(shader.program);
            this.setAttribs(shader.attributes);
        }

        private setAttribs(attribs) {
            var i:number;
            var l:number;

            l = this.tempAttribState.length;
            for (i = 0; i < l; i++) {
                this.tempAttribState[i] = false;
            }

            l = attribs.length;
            for (i = 0; i < l; i++) {
                var attribId = attribs[i];
                this.tempAttribState[attribId] = true;
            }

            var gl = this.gl;
            l = this.attribState.length;
            for (i = 0; i < l; i++) {
                if (this.attribState[i] !== this.tempAttribState[i]) {
                    this.attribState[i] = this.tempAttribState[i];

                    if (this.tempAttribState[i]) {
                        gl.enableVertexAttribArray(i);
                    }
                    else {
                        gl.disableVertexAttribArray(i);
                    }
                }
            }
        }
    }

    export class EgretShader {
        private defaultVertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec2 aTextureCoord;\n" +
            "attribute vec2 aColor;\n" +

            "uniform vec2 projectionVector;\n" +
            "uniform vec2 offsetVector;\n" +

            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +

            "const vec2 center = vec2(-1.0, 1.0);\n" +

            "void main(void) {\n" +
            "   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);\n" +
            "   vTextureCoord = aTextureCoord;\n" +
            "   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;\n" +
            "   vColor = vec4(color * aColor.x, aColor.x);\n" +
            "}";

        private gl:any;
        public program = null;
        private fragmentSrc:string =
            "precision lowp float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform sampler2D uSampler;\n" +
            "void main(void) {\n" +
            "   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;\n" +
            "}";
        private uSampler;
        public projectionVector;
        private offsetVector;
        private dimensions;
        public aVertexPosition;
        public aTextureCoord;
        public colorAttribute;
        public attributes:Array<any>;

        constructor(gl:any) {
            this.gl = gl;
            this.init();
        }

        private init():void {
            var gl = this.gl;

            var program = WebGLUtils.compileProgram(gl, this.defaultVertexSrc, this.fragmentSrc);
            gl.useProgram(program);

            this.uSampler = gl.getUniformLocation(program, "uSampler");
            this.projectionVector = gl.getUniformLocation(program, "projectionVector");
            this.offsetVector = gl.getUniformLocation(program, "offsetVector");
            this.dimensions = gl.getUniformLocation(program, "dimensions");

            this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            this.aTextureCoord = gl.getAttribLocation(program, "aTextureCoord");
            this.colorAttribute = gl.getAttribLocation(program, "aColor");

            if (this.colorAttribute === -1) {
                this.colorAttribute = 2;
            }
            this.attributes = [this.aVertexPosition, this.aTextureCoord, this.colorAttribute];
            this.program = program;
        }
    }

    export class PrimitiveShader {

        private gl:any;
        public program = null;
        public projectionVector = null;
        public offsetVector = null;
        public tintColor = null;
        public aVertexPosition = null;
        public colorAttribute = null;
        public attributes:Array<any> = null;
        public translationMatrix = null;
        public alpha = null;

        public fragmentSrc:string =
            "precision mediump float;\n" +
            "varying vec4 vColor;\n" +

            "void main(void) {\n" +
            "   gl_FragColor = vColor;\n" +
            "}";

        public vertexSrc =
            "attribute vec2 aVertexPosition;\n" +
            "attribute vec4 aColor;\n" +
            "uniform mat3 translationMatrix;\n" +
            "uniform vec2 projectionVector;\n" +
            "uniform vec2 offsetVector;\n" +
            "uniform float alpha;\n" +
            "uniform vec3 tint;\n" +
            "varying vec4 vColor;\n" +

            "void main(void) {\n" +
            "   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);\n" +
            "   v -= offsetVector.xyx;\n" +
            "   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);\n" +
            "   vColor = aColor * vec4(tint * alpha, alpha);\n" +
            "}";

        constructor(gl:any) {
            this.gl = gl;
            this.init();
        }

        private init() {
            var gl:any = this.gl;

            var program = WebGLUtils.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
            gl.useProgram(program);

            this.projectionVector = gl.getUniformLocation(program, "projectionVector");
            this.offsetVector = gl.getUniformLocation(program, "offsetVector");
            this.tintColor = gl.getUniformLocation(program, "tint");


            this.aVertexPosition = gl.getAttribLocation(program, "aVertexPosition");
            this.colorAttribute = gl.getAttribLocation(program, "aColor");

            this.attributes = [this.aVertexPosition, this.colorAttribute];

            this.translationMatrix = gl.getUniformLocation(program, "translationMatrix");
            this.alpha = gl.getUniformLocation(program, "alpha");

            this.program = program;
        }
    }
}
