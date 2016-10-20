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
    export class BlurShader extends TextureShader {
        public fragmentSrc =
            "precision mediump float;"+
            "uniform vec2 blur;"+
            "uniform sampler2D uSampler;"+
            "varying vec2 vTextureCoord;"+
            "uniform vec2 uTextureSize;"+
            "void main()"+
            "{"+
                "const int sampleRadius = 5;"+
                "const int samples = sampleRadius * 2 + 1;"+
                "vec2 blurUv = blur / uTextureSize;"+
                "vec4 color = vec4(0, 0, 0, 0);"+
                "vec2 uv = vec2(0.0, 0.0);"+
                "blurUv /= float(sampleRadius);"+

                "for (int i = -sampleRadius; i <= sampleRadius; i++) {"+
                    "uv.x = vTextureCoord.x + float(i) * blurUv.x;"+
                    "uv.y = vTextureCoord.y + float(i) * blurUv.y;"+
                    "color += texture2D(uSampler, uv);"+
                '}'+

                "color /= float(samples);"+
                "gl_FragColor = color;"+
            "}";

        public uniforms = {
            projectionVector: {type: '2f', value: {x: 0, y: 0}, dirty: true},
            blur: {type: '2f', value: {x: 2, y: 2}, dirty: true},
            uTextureSize: {type: '2f', value: {x: 100, y: 100}, dirty: true}
        };

        public setBlur(blurX:number, blurY:number):void {
            let uniform = this.uniforms.blur;

            if(uniform.value.x != blurX || uniform.value.y != blurY) {
                uniform.value.x = blurX;
                uniform.value.y = blurY;

                uniform.dirty = true;
            }
        }

        /**
         * 设置采样材质的尺寸
         */
        public setTextureSize(width:number, height:number):void {
            let uniform = this.uniforms.uTextureSize;

            if(width != uniform.value.x || height != uniform.value.y) {
                uniform.value.x = width;
                uniform.value.y = height;

                uniform.dirty = true;
            }
        }
    }
}