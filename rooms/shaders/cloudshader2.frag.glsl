#version 150

//test2

#define M_PI 3.1415926535897932384626433832795

const int OCTAVE_COUNT = 5;
const float WATER_LEVEL = 0.3;

//in vec2      iResolution;           // viewport resolution (in pixels)
uniform vec2 iResolution = vec2(1920.0,1080.0);

uniform float iGlobalTime;           // shader playback time (in seconds)
in vec4      iMouse;                // mouse pixel coords. xy: current (if MLB down), zw: click
in vec3 iPosition; //interpolated vertex position (note: not multiplied with modelview matrix)
in vec3 iPositionWorld; //gl_ModelViewMatrix * gl_Vertex * iViewMatrixInverse

out vec4 FragColor;

// The perlin stuff (except for the multiple octaves) was taken from Ian McEwan.  I've posted
// his copyright stuff below.

// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v)
{
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

// My stuff follows...


float noise(vec3 pos, int octaves) {
  float fResult = 0.0;
	float fPersMax = 0.0;
	for (int g = 0; g < OCTAVE_COUNT; g++) {
		if (g == octaves) break;
	  	float fFreq = pow(2.0, float(g));
	  	float fPers = pow(0.5, float(g));
      	fPersMax += fPers;
      	fResult += fPers * snoise(fFreq*pos);
	}
	return fResult / fPersMax + 0.5;
}

float noise(vec3 pos) {
	return noise(pos, OCTAVE_COUNT);
}



void main(void)
{
	float order = 1000.0;

	float zoom = 1.0; //  + 0.05 * sin(0.5 * iGlobalTime * M_PI);
	float cloudZoom = 3.0 + 0.05 * sin(0.5 * iGlobalTime * M_PI);
	float land_feature = 2.0;
	float water_feature = 80.0;
	float feature_ratio = water_feature / land_feature;

	vec2 uv = gl_FragCoord.xy / iResolution.xy * land_feature / zoom;
	vec2 water_uv = gl_FragCoord.xy / iResolution.xy * water_feature / zoom;
	vec2 cloud_uv = gl_FragCoord.xy / iResolution.xy / zoom;

	uv = floor(uv * order) / order;
	water_uv = floor(water_uv * order) / order;

	vec2 mouseDeflection = vec2(iMouse.x / iResolution.x - 0.5, iMouse.y / iResolution.y - 0.5);

	// Super simple sun calculation.
	// sample a patch to the right of us.  If it's higher, make us darker.  If it's lower, make us lighter.


	//vec3 samplePointA = vec3(uv.x + mouseDeflection.x * iGlobalTime, uv.y + mouseDeflection.y * iGlobalTime, 0.00 * iGlobalTime);
	vec3 samplePointA = iPosition;
	vec3 samplePointB = samplePointA + vec3((gl_FragCoord.x + 1.0) / iResolution.x * land_feature / zoom + mouseDeflection.x * iGlobalTime, 0.0, 0.0);
	float noiseA = noise(samplePointA);
	float noiseB = noise(samplePointB);
	float diff = noiseB - noiseA;

	float water = noise(vec3(water_uv.x + mouseDeflection.x * iGlobalTime * feature_ratio,
						 water_uv.y + mouseDeflection.y * iGlobalTime * feature_ratio,
						 0.2 * iGlobalTime), 2) + 0.7;
	float cloud = noise(vec3(cloud_uv.x + mouseDeflection.x * 1.1 * iGlobalTime,
						 cloud_uv.y + mouseDeflection.y * iGlobalTime,
						 0.05 * iGlobalTime));

	// vec3 landColor = clamp(vec3(0.93, 0.82, 0.65) * (1.0 + 0.2 * diff), vec3(0.0,0.0,0.0), vec3(1.0,1.0,1.0));
	vec3 landColor = vec3(0.73, 0.62, 0.45) * (noiseA * (1.0 + diff));
	// vec3 forestColor = vec3(0.93, 0.82, 0.65);
	// vec3 mountainColor = vec3(0.93, 0.93, 0.93);
	vec3 waterColor = vec3(0.65, 0.94, 0.94);
	vec4 cloudColor = vec4(1, 1, 1, pow(cloud, 6.0));

	// fix for water level



	FragColor = mix(
		noiseA < WATER_LEVEL ?
			vec4(mix(landColor.xyz, water * waterColor.xyz, 0.3), 1.0) :
			vec4(landColor.xyz, 1.0),
		cloudColor,  pow(cloud, 3.0));

}
