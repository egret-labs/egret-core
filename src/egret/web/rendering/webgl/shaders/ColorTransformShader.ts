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
     */
    export class ColorTransformShader extends TextureShader {
        public fragmentSrc =
            "precision mediump float;\n" +
            "varying vec2 vTextureCoord;\n" +
            "varying vec4 vColor;\n" +
            "uniform float invert;\n" +
            "uniform mat4 matrix;\n" +
            "uniform vec4 colorAdd;\n" +
            "uniform sampler2D uSampler;\n" +

            "void main(void) {\n" +
                "vec4 texColor = texture2D(uSampler, vTextureCoord);\n" +
                "vec4 locColor = texColor * matrix;\n" +
                "vec4 transformColor = vec4(1.0, 1.0, 1.0, 1.0) * matrix;\n" +
                "locColor += colorAdd;\n" +
                "transformColor += colorAdd;\n" +
                "if(locColor.a <= 0.0){\n" +
                    "discard;\n" +
                "}\n" +
                "if(transformColor.a > 1.0){\n" +
                    "transformColor.a = 1.0;\n" +
                "}\n" +
                "gl_FragColor = vColor*vec4(locColor.rgb*transformColor.a,locColor.a);\n" +
            "}";

        public uniforms = {
            projectionVector: {type: '2f', value: {x: 0, y: 0}, dirty: true},
            matrix: {type: 'mat4', value: [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1], dirty: true},
            colorAdd: {type: '4f', value: {x: 0, y: 0, z: 0, w: 0}, dirty: true}
        };

        public setMatrix(matrix:any):void {
            var uniform = this.uniforms.matrix;

            if(uniform.value[0] != matrix[0] ||
                uniform.value[0] != matrix[0] ||
                uniform.value[1] != matrix[1] ||
                uniform.value[2] != matrix[2] ||
                uniform.value[3] != matrix[3] ||

                uniform.value[4] != matrix[5] ||
                uniform.value[5] != matrix[6] ||
                uniform.value[6] != matrix[7] ||
                uniform.value[7] != matrix[8] ||

                uniform.value[8] != matrix[10] ||
                uniform.value[9] != matrix[11] ||
                uniform.value[10] != matrix[12] ||
                uniform.value[11] != matrix[13] ||

                uniform.value[12] != matrix[15] ||
                uniform.value[13] != matrix[16] ||
                uniform.value[14] != matrix[17] ||
                uniform.value[15] != matrix[18]) {

                uniform.value[0] = matrix[0];
                uniform.value[1] = matrix[1];
                uniform.value[2] = matrix[2];
                uniform.value[3] = matrix[3];

                uniform.value[4] = matrix[5];
                uniform.value[5] = matrix[6];
                uniform.value[6] = matrix[7];
                uniform.value[7] = matrix[8];

                uniform.value[8] = matrix[10];
                uniform.value[9] = matrix[11];
                uniform.value[10] = matrix[12];
                uniform.value[11] = matrix[13];

                uniform.value[12] = matrix[15];
                uniform.value[13] = matrix[16];
                uniform.value[14] = matrix[17];
                uniform.value[15] = matrix[18];

                uniform.dirty = true;
            }

            var uniform2 = this.uniforms.colorAdd;

            if(uniform2.value.x != matrix[4] / 255.0 ||
                uniform2.value.y != matrix[9] / 255.0 ||
                uniform2.value.z != matrix[14] / 255.0 ||
                uniform2.value.w != matrix[19] / 255.0) {

                uniform2.value.x = matrix[4] / 255.0;
                uniform2.value.y = matrix[9] / 255.0;
                uniform2.value.z = matrix[14] / 255.0;
                uniform2.value.w = matrix[19] / 255.0;

                uniform2.dirty = true;
            }
        }
    }
}