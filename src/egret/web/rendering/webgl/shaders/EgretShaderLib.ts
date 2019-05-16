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
	export class EgretShaderLib {
		public static readonly blur_frag: string = "precision mediump float;\r\nuniform vec2 blur;\r\nuniform sampler2D uSampler;\r\nvarying vec2 vTextureCoord;\r\nuniform vec2 uTextureSize;\r\nvoid main()\r\n{\r\n    const int sampleRadius = 5;\r\n    const int samples = sampleRadius * 2 + 1;\r\n    vec2 blurUv = blur / uTextureSize;\r\n    vec4 color = vec4(0, 0, 0, 0);\r\n    vec2 uv = vec2(0.0, 0.0);\r\n    blurUv /= float(sampleRadius);\r\n\r\n    for (int i = -sampleRadius; i <= sampleRadius; i++) {\r\n        uv.x = vTextureCoord.x + float(i) * blurUv.x;\r\n        uv.y = vTextureCoord.y + float(i) * blurUv.y;\r\n        color += texture2D(uSampler, uv);\r\n    }\r\n\r\n    color /= float(samples);\r\n    gl_FragColor = color;\r\n}";
		public static readonly colorTransform_frag: string = "precision mediump float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform mat4 matrix;\r\nuniform vec4 colorAdd;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    vec4 texColor = texture2D(uSampler, vTextureCoord);\r\n    if(texColor.a > 0.) {\r\n        // 抵消预乘的alpha通道\r\n        texColor = vec4(texColor.rgb / texColor.a, texColor.a);\r\n    }\r\n    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);\r\n    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);\r\n}";
		public static readonly default_vert: string = "attribute vec2 aVertexPosition;\r\nattribute vec2 aTextureCoord;\r\nattribute vec2 aColor;\r\n\r\nuniform vec2 projectionVector;\r\n// uniform vec2 offsetVector;\r\n\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nconst vec2 center = vec2(-1.0, 1.0);\r\n\r\nvoid main(void) {\r\n   gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\r\n   vTextureCoord = aTextureCoord;\r\n   vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\r\n}";
		public static readonly glow_frag: string = "precision highp float;\r\nvarying vec2 vTextureCoord;\r\n\r\nuniform sampler2D uSampler;\r\n\r\nuniform float dist;\r\nuniform float angle;\r\nuniform vec4 color;\r\nuniform float alpha;\r\nuniform float blurX;\r\nuniform float blurY;\r\n// uniform vec4 quality;\r\nuniform float strength;\r\nuniform float inner;\r\nuniform float knockout;\r\nuniform float hideObject;\r\n\r\nuniform vec2 uTextureSize;\r\n\r\nfloat random(vec2 scale)\r\n{\r\n    return fract(sin(dot(gl_FragCoord.xy, scale)) * 43758.5453);\r\n}\r\n\r\nvoid main(void) {\r\n    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);\r\n    // TODO 自动调节采样次数？\r\n    const float linearSamplingTimes = 7.0;\r\n    const float circleSamplingTimes = 12.0;\r\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\r\n    vec4 curColor;\r\n    float totalAlpha = 0.0;\r\n    float maxTotalAlpha = 0.0;\r\n    float curDistanceX = 0.0;\r\n    float curDistanceY = 0.0;\r\n    float offsetX = dist * cos(angle) * px.x;\r\n    float offsetY = dist * sin(angle) * px.y;\r\n\r\n    const float PI = 3.14159265358979323846264;\r\n    float cosAngle;\r\n    float sinAngle;\r\n    float offset = PI * 2.0 / circleSamplingTimes * random(vec2(12.9898, 78.233));\r\n    float stepX = blurX * px.x / linearSamplingTimes;\r\n    float stepY = blurY * px.y / linearSamplingTimes;\r\n    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {\r\n        cosAngle = cos(a + offset);\r\n        sinAngle = sin(a + offset);\r\n        for (float i = 1.0; i <= linearSamplingTimes; i++) {\r\n            curDistanceX = i * stepX * cosAngle;\r\n            curDistanceY = i * stepY * sinAngle;\r\n            if (vTextureCoord.x + curDistanceX - offsetX >= 0.0 && vTextureCoord.y + curDistanceY + offsetY <= 1.0){\r\n                curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));\r\n                totalAlpha += (linearSamplingTimes - i) * curColor.a;\r\n            }\r\n            maxTotalAlpha += (linearSamplingTimes - i);\r\n        }\r\n    }\r\n\r\n    ownColor.a = max(ownColor.a, 0.0001);\r\n    ownColor.rgb = ownColor.rgb / ownColor.a;\r\n\r\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);\r\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;\r\n\r\n    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);\r\n    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));\r\n    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));\r\n    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);\r\n    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);\r\n}";
		public static readonly primitive_frag: string = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = vColor;\r\n}";
		public static readonly texture_frag: string = "precision lowp float;\r\nvarying vec2 vTextureCoord;\r\nvarying vec4 vColor;\r\nuniform sampler2D uSampler;\r\n\r\nvoid main(void) {\r\n    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;\r\n}";
		public static readonly texture_etc_alphamask_frag: string = "precision lowp float; \r\n varying vec2 vTextureCoord; \r\n varying vec4 vColor;\r\n uniform sampler2D uSampler;\r\n  uniform sampler2D uSamplerAlphaMask; \r\n void main(void) { \r\n  vec4 v4Color = texture2D(uSampler, vTextureCoord); \r\n  vec4 vec4Alpha = texture2D(uSamplerAlphaMask, vTextureCoord);\r\n v4Color = v4Color * vec4Alpha; v4Color.a = vec4Alpha.r; gl_FragColor = v4Color * vColor;\r\n}";
	}
};