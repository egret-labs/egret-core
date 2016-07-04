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
    export class GlowShader extends TextureShader {
        // public fragmentSrc =
        //     "precision mediump float;"+

        //     "uniform sampler2D uSampler;"+

        //     "varying vec2 vTextureCoord;"+

        //     "uniform vec2 uTextureSize;"+
        //     "uniform vec4 u_color;"+
        //     "uniform float u_strength;"+
        //     "uniform float blur;"+
        //     "uniform float offset;"+

        //     "void main()"+
        //     "{"+
        //         "float u_textW = uTextureSize.x;"+
        //         "float u_textH = uTextureSize.y;"+
        //         "float u_blurX = blur.x;"+
        //         "float u_blurY = blur.y;"+
        //         "float u_offsetX = offset.x;"+
        //         "float u_offsetY = offset.y;"+
        //         "const float c_IterationTime = 10.0;"+
        //         "float floatIterationTotalTime = c_IterationTime * c_IterationTime;"+
        //         "vec4 vec4Color = vec4(0.0,0.0,0.0,0.0);"+
        //         "vec2 vec2FilterDir = vec2(-(u_offsetX)/u_textW,-(u_offsetY)/u_textH);"+
        //         "vec2 vec2FilterOff = vec2(u_blurX/u_textW/c_IterationTime * 2.0,u_blurY/u_textH/c_IterationTime * 2.0);"+
        //         "float maxNum = u_blurX * u_blurY;"+
        //         "vec2 vec2Off = vec2(0.0,0.0);"+
        //         "float floatOff = c_IterationTime/2.0;"+
        //         "for(float i = 0.0;i<=c_IterationTime; ++i){"+
        //             "for(float j = 0.0;j<=c_IterationTime; ++j){"+
        //                 "vec2Off = vec2(vec2FilterOff.x * (i - floatOff),vec2FilterOff.y * (j - floatOff));"+
        //                 "vec4Color += texture2D(uSampler, vTextureCoord + vec2FilterDir + vec2Off)/floatIterationTotalTime;"+
        //             "}"+
        //         "}"+
        //         "gl_FragColor = vec4(u_color.rgb,vec4Color.a * u_strength);"+
        //     "}";

        public fragmentSrc = [
            'precision mediump float;',
            // 'varying vec2 v_TexCoord;',
            'varying vec2 vTextureCoord;',
            // 'varying vec4 vColor;',

            'uniform sampler2D uSampler;',

            'uniform float distance;',
            'uniform float outerStrength;',
            'uniform float innerStrength;',
            'uniform vec4 glowColor;',
            'uniform vec2 uTextureSize;',

            'vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);',

            'void main(void) {',
                'vec2 v_TexCoord = vTextureCoord;',
                'const float quality = 8.0;',
                'const float PI = 3.14159265358979323846264;',
                'vec4 ownColor = texture2D(uSampler, v_TexCoord);',
                'vec4 curColor;',
                'float totalAlpha = 0.0;',
                'float maxTotalAlpha = 0.0;',
                'float cosAngle;',
                'float sinAngle;',
                'float curDistance = 0.0;',
                'for (float angle = 0.0; angle <= PI * 2.0; angle += PI * 2.0 / quality) {',
                'cosAngle = cos(angle);',
                'sinAngle = sin(angle);',
                'for (float d = 1.0; d <= quality; d++) {',
                    'curDistance = float(d) * distance / 10.0;',
                    'curColor = texture2D(uSampler, vec2(v_TexCoord.x + cosAngle * curDistance * px.x, v_TexCoord.y + sinAngle * curDistance * px.y));',
                    'totalAlpha += (distance - curDistance) * curColor.a;',
                    'maxTotalAlpha += (distance - curDistance);',
                '}',
                '}',
                'maxTotalAlpha = max(maxTotalAlpha, 0.0001);',

                'ownColor.a = max(ownColor.a, 0.0001);',
                'ownColor.rgb = ownColor.rgb / ownColor.a;',
                'float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);',
                'float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;',
                'float resultAlpha = (ownColor.a + outerGlowAlpha);',
                'gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);',
            '}',
        ].join("\n");

        public uniforms = {
            projectionVector: {type: '2f', value: {x: 0, y: 0}, dirty: true},
            distance: {type: '1f', value: 15, dirty: true},
            outerStrength: {type: '1f', value: 1, dirty: true},
            innerStrength: {type: '1f', value: 1, dirty: true},
            glowColor: {type: '4f', value: {x: 1, y: 0, z: 0, w: 0}, dirty: true},
            uTextureSize: {type: '2f', value: {x: 100, y: 100}, dirty: true}
        };

        public setBlur(blurX:number, blurY:number):void {
            // var uniform = this.uniforms.blur;

            // if(uniform.value.x != blurX || uniform.value.y != blurY) {
            //     uniform.value.x = blurX;
            //     uniform.value.y = blurY;

            //     uniform.dirty = true;
            // }
        }

        public setOffset(offsetX:number, offsetY:number):void {
            // var uniform = this.uniforms.offset;

            // if(uniform.value.x != offsetX || uniform.value.y != offsetY) {
            //     uniform.value.x = offsetX;
            //     uniform.value.y = offsetY;

            //     uniform.dirty = true;
            // }
        }

        public setStrength(strength:number):void {
            // var uniform = this.uniforms.u_strength;

            // if(uniform.value != strength) {
            //     uniform.value = strength;

            //     uniform.dirty = true;
            // }
        }

        public setColor(red:number, green:number, blue:number):void {
            // var uniform = this.uniforms.u_color;

            // if(uniform.value.x != red || uniform.value.y != green || uniform.value.z != blue) {
            //     uniform.value.x = red;
            //     uniform.value.y = green;
            //     uniform.value.z = blue;

            //     uniform.dirty = true;
            // }
        }

        /**
         * 设置采样材质的尺寸
         */
        public setTextureSize(width:number, height:number):void {
            var uniform = this.uniforms.uTextureSize;

            if(width != uniform.value.x || height != uniform.value.y) {
                uniform.value.x = width;
                uniform.value.y = height;

                uniform.dirty = true;
            }
        }
    }
}