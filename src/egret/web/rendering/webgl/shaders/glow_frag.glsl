precision mediump float;
varying vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform float dist;
uniform float angle;
uniform vec4 color;
uniform float alpha;
uniform float blurX;
uniform float blurY;
// uniform vec4 quality;
uniform float strength;
uniform float inner;
uniform float knockout;
uniform float hideObject;

uniform vec2 uTextureSize;

float random(vec3 scale, float seed)
{
    return fract(sin(dot(gl_FragCoord.xyz + seed, scale)) * 43758.5453 + seed);
}

void main(void) {
    vec2 px = vec2(1.0 / uTextureSize.x, 1.0 / uTextureSize.y);
    // TODO 自动调节采样次数？
    const float linearSamplingTimes = 7.0;
    const float circleSamplingTimes = 12.0;
    vec4 ownColor = texture2D(uSampler, vTextureCoord);
    vec4 curColor;
    float totalAlpha = 0.0;
    float maxTotalAlpha = 0.0;
    float curDistanceX = 0.0;
    float curDistanceY = 0.0;
    float offsetX = dist * cos(angle) * px.x;
    float offsetY = dist * sin(angle) * px.y;

    const float PI = 3.14159265358979323846264;
    float cosAngle;
    float sinAngle;
    float offset = PI * 2.0 / circleSamplingTimes * random(vec3(12.9898, 78.233, 151.7182), 0.0);
    float stepX = blurX * px.x / linearSamplingTimes;
    float stepY = blurY * px.y / linearSamplingTimes;
    for (float a = 0.0; a <= PI * 2.0; a += PI * 2.0 / circleSamplingTimes) {
        cosAngle = cos(a + offset);
        sinAngle = sin(a + offset);
        for (float i = 1.0; i <= linearSamplingTimes; i++) {
            curDistanceX = i * stepX * cosAngle;
            curDistanceY = i * stepY * sinAngle;
            
            curColor = texture2D(uSampler, vec2(vTextureCoord.x + curDistanceX - offsetX, vTextureCoord.y + curDistanceY + offsetY));

            totalAlpha += (linearSamplingTimes - i) * curColor.a;
            maxTotalAlpha += (linearSamplingTimes - i);
        }
    }

    ownColor.a = max(ownColor.a, 0.0001);
    ownColor.rgb = ownColor.rgb / ownColor.a;

    float outerGlowAlpha = (totalAlpha / maxTotalAlpha) * strength * alpha * (1. - inner) * max(min(hideObject, knockout), 1. - ownColor.a);
    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * strength * alpha * inner * ownColor.a;

    ownColor.a = max(ownColor.a * knockout * (1. - hideObject), 0.0001);
    vec3 mix1 = mix(ownColor.rgb, color.rgb, innerGlowAlpha / (innerGlowAlpha + ownColor.a));
    vec3 mix2 = mix(mix1, color.rgb, outerGlowAlpha / (innerGlowAlpha + ownColor.a + outerGlowAlpha));
    float resultAlpha = min(ownColor.a + outerGlowAlpha + innerGlowAlpha, 1.);
    gl_FragColor = vec4(mix2 * resultAlpha, resultAlpha);
}