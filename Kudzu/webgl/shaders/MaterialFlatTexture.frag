#version 300 es

precision mediump float;

in vec4 vColor;
in vec2 vUV;
  
uniform sampler2D uTexture;

out vec4 fragmentColor;
  
vec3 gammaCorrect(vec3 color){
    return pow(color, vec3(1.0/2.2));
}
  
void main() {
    vec4 color = texture(uTexture, vUV);
    vec3 rgb = gammaCorrect(vColor.rgb * color.rgb);
    float a = vColor.a * color.a;
    fragmentColor = vec4(rgb, a);    
}