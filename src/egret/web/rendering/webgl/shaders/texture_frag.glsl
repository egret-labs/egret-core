precision lowp float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;

void main(void) {
    gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor;
}