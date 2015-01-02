uniform float iGlobalTime;

varying vec3 iPosition;

varying vec3 iNormal;

vec3 colour = vec3(5,0,5);

float alpha = 0.7;

float grid2(vec2 p) {

    p = fract(p);
    return 1.-((1.-exp(-8.*(1.-p.x)))*(1.-exp(-8.*p.x))*(1.-exp(-8.*(1.-p.y)))*(1.-exp(-8.*p.y)));

}

float bump(float value) {

    value = abs(value);
    value = .1*exp(-value*1.8)+5e-3/value;

    //float loc = fract(value*NUMBER_OF_LINES.+iGlobalTime*SPEED)/NUMBER_OF_LINES.;

    //float loc = fract(value*20.+iGlobalTime*0.8)/20.;

    float loc = fract(value*20.+iGlobalTime*0.8)/20.;


    //value += max((value-.02)*(smoothstep(0.,5e-8,loc)-smoothstep(5e-8,SMOOTHING_BETWEEN_LINES_CELL_SHADING,loc)),0.);

    value += max((value-.02)*(smoothstep(0.,5e-8,loc)-smoothstep(5e-8,.09,loc)),0.);
    return value;

}

void main(void) {

    vec2 p;

    if(abs(dot(iNormal,vec3(1,0,0))) > .907) p = iPosition.yz;

    else if(abs(dot(iNormal,vec3(0,1,0))) > .907) p = iPosition.xz;

    else p = iPosition.xy;

    gl_FragColor = vec4(colour*min(bump(1.-grid2(p)),1.),alpha);

}