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

namespace egret.web.MultiTextureShader {

    export const vertexSrc = "attribute vec2 aVertexPosition;" +
        "attribute vec2 aTextureCoord;" +
        "attribute float aColor;" +
        "attribute float aTextureId;" +

        "uniform vec2 projectionVector;" +

        "varying vec2 vTextureCoord;" +
        "varying vec4 vColor;" +
        "varying float vTextureId;" +

        "const vec2 center = vec2(-1.0, 1.0);" +

        "void main(void) {" +
        "   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);" +
        "   vTextureCoord = aTextureCoord;" +
        "   vTextureId = aTextureId;" +
        "   vColor = vec4(aColor, aColor, aColor, aColor);" +
        "}";

    const frag = "precision lowp float;" +
        "varying vec2 vTextureCoord;" +
        "varying vec4 vColor;" +
        "varying float vTextureId;" +
        "uniform sampler2D uSamplers[%numTextures%];" +

        "void main(void) {" +
        "    vec4 color;" +
        "    float textureId = vTextureId;" +
        "    %loop%" +
        "    gl_FragColor = color * vColor;" +
        "}"

    export let fragmentSrc: string;
    export let sampleValues: number[];

    export const init = function (numTextures: number): void {
        fragmentSrc = frag.replace(/%numTextures%/gi, numTextures + "");
        let loop = "";
        for (let i = 0; i < numTextures; ++i) {
            if (i > 0) {
                loop += "else ";
            }
            if (i < numTextures - 1) {
                loop += `if(textureId == ${i}.0)`;
            }
            loop += " {";
            loop += `color = texture2D(uSamplers[${i}], vTextureCoord);`;
            loop += "}";
        }
        fragmentSrc = fragmentSrc.replace(/%loop%/gi, loop);

        sampleValues = [];

        for (let i = 0; i < numTextures; i++) {
            sampleValues.push(i);
        }
    }
}