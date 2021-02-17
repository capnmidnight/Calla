#version 300 es

in vec4 aPosition;
in vec4 aColor;
in vec2 aUV;

uniform mat4 uProjection;
uniform mat4 uView;
uniform mat4 uModel;

out vec4 vColor;
out vec2 vUV;

void main() {
    vColor = aColor;
    vUV = aUV;
    gl_Position = uProjection * uView * uModel * aPosition;
}