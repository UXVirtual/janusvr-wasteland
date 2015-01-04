#version 150

// see here for information on version 150 glsl shaders:
// http://en.wikipedia.org/wiki/OpenGL_Shading_Language#A_sample_trivial_GLSL_fragment_shader
// https://github.com/mattdesl/lwjgl-basics/wiki/GLSL-Versions
// https://www.opengl.org/wiki/GLSL_:_common_mistakes

uniform int MAX_RAY_STEPS = 64;
uniform float RAY_STOP_TRESHOLD = 0.0001;
uniform int MENGER_ITERATIONS = 5;

// in glsl 150+ input variables are defined as below
//in vec2 iResolution;
uniform vec2 iResolution = vec2(1920.0,1080.0); // viewport resolution (in pixels) - note vertex shader does not pass this to fragment shader in JanusVR for some reason!
uniform float iGlobalTime;           // shader playback time (in seconds)

// in glsl 150+ gl_FragColor is no longer accesible globally and you must instead set your own output for fragment
// shaders (see end of main())
// name of the output variable in the shader program, which is associated with the given buffer.

out vec4 FragColor;

float maxcomp(vec2 v) {
    return max(v.x, v.y);
}

float sdCross(vec3 p) {
    p = abs(p);
    vec3 d = vec3(max(p.x, p.y),
        max(p.y, p.z),
        max(p.z, p.x));
    return min(d.x, min(d.y, d.z)) - (1.0 / 3.0);
}

float sdCrossRep(vec3 p) {
    vec3 q = mod(p + 1.0, 2.0) - 1.0;
    return sdCross(q);
}

float sdCrossRepScale(vec3 p, float s) {
    return sdCrossRep(p * s) / s;
}

float scene(vec3 p) {
    float scale = 1.0;
    float dist = 0.0;
    for (int i = 0; i < MENGER_ITERATIONS; i++) {
        dist = max(dist, -sdCrossRepScale(p, scale));
        scale *= 3.0;
    }
    return dist;
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 colorize(float c) {

    float hue = mix(0.6, 1.15, min(c * 1.2 - 0.05, 1.0));
    float sat = 1.0 - pow(c, 4.0);
    float lum = c;
    vec3 hsv = vec3(hue, sat, lum);
    vec3 rgb = hsv2rgb(hsv);
    return vec4(rgb, 1.0);
}


void main(void)
{

    vec2 screenPos = gl_FragCoord.xy / iResolution.xy * 2.0 - 1.0;
    //vec2 mousePos = iMouse.xy / iResolution.xy * 2.0 - 1.0;

    vec3 cameraPos = vec3(0.16 * sin(iGlobalTime), 0.16 * cos(iGlobalTime), iGlobalTime);
    //vec3 cameraPos = vec3(0.0);
    vec3 cameraDir = vec3(0.0, 0.0, 1.0);
    vec3 cameraPlaneU = vec3(1.0, 0.0, 0.0);
    vec3 cameraPlaneV = vec3(0.0, 1.0, 0.0) * (iResolution.y / iResolution.x);

    vec3 rayPos = cameraPos;
    vec3 rayDir = cameraDir + screenPos.x * cameraPlaneU + screenPos.y * cameraPlaneV;

    rayDir = normalize(rayDir);

    float dist = scene(rayPos);
    int stepsTaken;
    for (int i = 0; i < MAX_RAY_STEPS; i++) {
        if (dist < RAY_STOP_TRESHOLD) {
            continue;
        }
        rayPos += rayDir * dist;
        dist = scene(rayPos);
        stepsTaken = i;
    }

    vec4 color = colorize(pow(float(stepsTaken) / float(MAX_RAY_STEPS), 0.9));

    FragColor = color;
}