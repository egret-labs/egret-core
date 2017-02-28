precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform mat4 matrix;
uniform vec4 colorAdd;
uniform sampler2D uSampler;

void main(void) {
    vec4 texColor = texture2D(uSampler, vTextureCoord);
    if(texColor.a > 0.) {
        // 抵消预乘的alpha通道
        texColor = vec4(texColor.rgb / texColor.a, texColor.a);
    }
    vec4 locColor = clamp(texColor * matrix + colorAdd, 0., 1.);
    gl_FragColor = vColor * vec4(locColor.rgb * locColor.a, locColor.a);
}