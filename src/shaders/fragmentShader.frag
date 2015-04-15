precision highp float;

uniform sampler2D topSampler;
uniform sampler2D bottomSampler;
uniform float sparkThreshold;
uniform vec2 textureSize;
uniform float time;

float rand(vec2 seed){
    return fract(sin(dot(seed.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main(void) {
    vec2 coords = vec2(gl_FragCoord.x / textureSize.x, gl_FragCoord.y / textureSize.y);
    vec4 topFrag = texture2D(topSampler, coords);
    vec4 bottomFrag = texture2D(bottomSampler, coords);
    vec4 sub = topFrag - bottomFrag;

    if (sub.r > 0.5 && sub.g > 0.5 && sub.b > 0.5) {
        gl_FragColor = topFrag;
    } else {
        float spark = rand(vec2(time) * coords);
        if (spark > sparkThreshold) {
            gl_FragColor = topFrag;
        } else {
            gl_FragColor = bottomFrag;
        }
    }
}
