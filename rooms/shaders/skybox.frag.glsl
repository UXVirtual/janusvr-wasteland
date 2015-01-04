#version 150

// converted to version 150 by HAZARDU5 (michael@uxvirtual.com)

const int MAX_RAY_STEPS = 64;
const float RAY_STOP_TRESHOLD = 0.001;
const int MENGER_ITERATIONS = 3;

uniform int iLeftEye; //rendering left eye (0 - no, 1 - yes)?
uniform float iGlobalTime; //number of seconds that passed since shader was compiled
uniform int iUseClipPlane; //use clip plane (0 - no, 1 - yes)?  (i.e. is the room viewed through a portal)
uniform vec4 iClipPlane; //equation of clip plane (xyz are normal, w is the offset, room is on side facing normal)

in vec3 iPosition; //interpolated vertex position (note: not multiplied with modelview matrix)
in vec3 iPositionWorld; //gl_ModelViewMatrix * gl_Vertex * iViewMatrixInverse

out vec4 FragColor;

float maxcomp(vec2 v) { return max(v.x, v.y); }

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
    // Portal clip, causes a strange interaction with the default skybox, I'm thinking of a way around this .
    if (iUseClipPlane == 1 && dot(iPositionWorld, iClipPlane.xyz) < iClipPlane.w) {
        discard;
    }

    // Create a spiral effect by adjusting camera position over time, to slow the movement down multiply the iGLobalTime variable by a value between 0 and 1, eg. 0.5 to half the speed.
    vec3 cameraPos = vec3(0.16 * sin(0.5 * iGlobalTime), 0.16 * cos(0.5 * iGlobalTime), 0.5 * iGlobalTime);

    // Hard-coded IPD effect, will have to test various values in the Rift to see what level of stereoscopy feels the best.
    if (iLeftEye == 1) cameraPos.x = cameraPos.x - 0.0033;
    else cameraPos.x = cameraPos.x + 0.0033;

    // Hard-coded screen resolution, needs to be changed to take current framebuffer size so that it's correct for any display
    vec2 iResolution = vec2(1920.0,1080.0);

    // Screen-space UV converted to be between [-1,-1] and [1,1] with the center of the screen being [0,0]
    vec2 screenPos = gl_FragCoord.xy / iResolution * 2.0 - 1.0;

    // Interpolated vertex position of a unit cube used as camera direction, ideally the surface used to draw this effect on should be forced to the farclip inside of the vertex shader to avoid distortion as you approach the seams.
    vec3 cameraDir = iPosition;
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

    // Colour of output pixel dependant on the number of iterations needed to resolve the raymarch
    vec4 PathTraceColor = colorize(pow(float(stepsTaken) / float(MAX_RAY_STEPS), 1.0));

    FragColor = PathTraceColor;
}