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
    export class GlowShader extends TextureShader {

        public fragmentSrc = [
            'precision mediump float;',
            'varying vec2 vTextureCoord;',

            'uniform sampler2D uSampler;',

            'uniform float distance;',
            'uniform float angle;',
            'uniform vec4 color;',
            'uniform float alpha;',
            'uniform float blurX;',
            'uniform float blurY;',
            // 'uniform vec4 quality;',
            'uniform float strength;',
            'uniform float inner;',
            'uniform float knockout;',
            'uniform float hideObject;',

            "uniform vec2 uTextureSize;"+
            'vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);',

            'float random(vec3 scale, float seed)',
            '{',
                'return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);',
            '}',

            'void main(void) {',
                // TODO 自动调节采样次数？
                'const float linearSamplingTimes = 7.0;',
                'const float circleSamplingTimes = 12.0;',
                'vec4 ownColor = texture2D(uSampler, vTextureCoord);',
                'vec4 curColor;',
                'float totalAlpha = 0.0;',
                'float maxTotalAlpha = 0.0;',
                'float curDistanceX = 0.0;',
                'float curDistanceY = 0.0;',
                'float offsetX = distance * cos(angle) * px.x;',
                'float offsetY = distance * sin(angle) * px.y;',

                'const float PI = 3.14159265358979323846264;',
                'float cosAngle;',
                'float sinAngle;',
                'float offset = PI * 2.0 / circleSamplingTimes * random(vec3(12.9898, 78.233, 151.7182), 0.0);',
                'float stepX = blurX * px.x / linearSamplingTimes;',
                'float stepY = blurY * px.y / linearSamplingTimes;',
                'for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {',
                    'cosAngle = cos(a + offset);',
                    'sinAngle = sin(a + offset);',
                    'for (float i = 1.0; i <= linearSamplingTimes; i++) {',
                        'curDistanceX = i * stepX * cosAngle;',
                        'curDistanceY = i * stepY * sinAngle;',
                        
                        'curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));',

                        'totalAlpha += (linearSamplingTimes - i) * curColor.a;',
                        'maxTotalAlpha += (linearSamplingTimes - i);',
                    '}',
                '}',

                'ownColor.a = max(ownColor.a, 0.0001);',
                'ownColor.rgb = ownColor.rgb / ownColor.a;',

                'float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);',
                'float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;',

                'ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);',
                'vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));',
                'vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));',
                'float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);',
                'gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);',
            '}',
        ].join("\n");

        public uniforms = {
            projectionVector: {type: '2f', value: {x: 0, y: 0}, dirty: true},

            distance: {type: '1f', value: 15, dirty: true},
            angle: {type: '1f', value: 1, dirty: true},
            color: {type: '4f', value: {x: 1, y: 0, z: 0, w: 0}, dirty: true},
            alpha: {type: '1f', value: 1, dirty: true},
            blurX: {type: '1f', value: 1, dirty: true},
            blurY: {type: '1f', value: 1, dirty: true},
            strength: {type: '1f', value: 1, dirty: true},
            inner: {type: '1f', value: 1, dirty: true},
            knockout: {type: '1f', value: 1, dirty: true},
            hideObject: {type: '1f', value: 0, dirty: true},
            
            uTextureSize: {type: '2f', value: {x: 100, y: 100}, dirty: true}
        };

        public setDistance(distance:number):void {
            let uniform = this.uniforms.distance;

            if(uniform.value != distance) {
                uniform.value = distance;

                uniform.dirty = true;
            }
        }

        public setAngle(angle:number):void {
            let uniform = this.uniforms.angle;

            if(uniform.value != angle) {
                uniform.value = angle;

                uniform.dirty = true;
            }
        }

        public setColor(red:number, green:number, blue:number):void {
            let uniform = this.uniforms.color;

            if(uniform.value.x != red || uniform.value.y != green || uniform.value.z != blue) {
                uniform.value.x = red;
                uniform.value.y = green;
                uniform.value.z = blue;

                uniform.dirty = true;
            }
        }

        public setAlpha(alpha:number):void {
            let uniform = this.uniforms.alpha;

            if(uniform.value != alpha) {
                uniform.value = alpha;

                uniform.dirty = true;
            }
        }

        public setBlurX(blurX:number):void {
            let uniform = this.uniforms.blurX;

            if(uniform.value != blurX) {
                uniform.value = blurX;

                uniform.dirty = true;
            }
        }

        public setBlurY(blurY:number):void {
            let uniform = this.uniforms.blurY;

            if(uniform.value != blurY) {
                uniform.value = blurY;

                uniform.dirty = true;
            }
        }

        public setStrength(strength:number):void {
            let uniform = this.uniforms.strength;

            if(uniform.value != strength) {
                uniform.value = strength;

                uniform.dirty = true;
            }
        }

        public setInner(inner:number):void {
            let uniform = this.uniforms.inner;

            if(uniform.value != inner) {
                uniform.value = inner;

                uniform.dirty = true;
            }
        }

        public setKnockout(knockout:number):void {
            let uniform = this.uniforms.knockout;

            if(uniform.value != knockout) {
                uniform.value = knockout;

                uniform.dirty = true;
            }
        }

        public setHideObject(hideObject:number):void {
            let uniform = this.uniforms.hideObject;

            if(uniform.value != hideObject) {
                uniform.value = hideObject;

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