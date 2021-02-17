#version 300 es

precision highp float;

uniform sampler2D uTexture;
uniform float uGamma;

in vec3 vDir;
out vec4 fragmentColor;

const float pi = radians(180.0);
const float tau = radians(360.0);

vec3 gammaCorrect(vec3 color) {
    return pow(color, vec3(uGamma));
}

vec2 equirectUV(vec3 dir) {
    float x = dir.x;
    float y = dir.y;
    float z = -dir.z;

    float r = sqrt(x * x + y * y + z * z);
    float lat = asin(y / r);
    float lon = atan(z, x);

    x = lon / tau;
    y = lat / pi;
    return vec2(x + 0.5, 0.5 - y);

}

void main() {
    vec2 vUV = equirectUV(vDir);
    vec3 color = texture(uTexture, vUV).rgb;
    vec3 rgb = gammaCorrect(color);
    fragmentColor = vec4(rgb, 1.0);
}