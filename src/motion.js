import {clamp} from './model.js';
export const ease=(a,b,rate,dt)=>a+(b-a)*(1-Math.exp(-rate*dt));
export const JUMP_DURATION=1.55;
export function breachPose(elapsed,startY,surface){
 const t=clamp(elapsed,0,JUMP_DURATION);
 if(t<.12){const p=t/.12;return {y:startY+Math.sin(p*Math.PI/2)*10,angle:.09*p,splash:false}}
 if(t<.35){const p=(t-.12)/.23,s=p*p*(3-2*p);return {y:(startY+10)*(1-s)+(surface+28)*s,angle:-.55*Math.sin(p*Math.PI/2),splash:false}}
 const p=(t-.35)/1.2;
 return {y:surface+28-Math.sin(p*Math.PI)*126,angle:-.55*Math.cos(p*Math.PI),splash:p>=1};
}
export function sheetFrame(animation,elapsed){return animation==='swim'?Math.floor(elapsed*15)%36:Math.min(35,Math.floor(elapsed*60))}

// A tail strike is a complete breach: coil, rise, ballistic flight, re-entry.
export function tailBreachTiming(startY,surface){
 const launch=.18+clamp((startY-surface)/460,.25,.9);
 return {launch,land:launch+1.5,duration:launch+1.85,strike:launch+.86};
}
export function tailBreachPose(elapsed,startY,surface,startAngle=0){
 const timing=tailBreachTiming(startY,surface),t=clamp(elapsed,0,timing.duration);
 const smooth=p=>p*p*(3-2*p);
 if(t<.18){const p=smooth(t/.18);return {y:startY+10*p,angle:startAngle*(1-p)+.12*p,drift:0,phase:'coil',clip:0,striking:false};}
 if(t<timing.launch){const rise=timing.launch-.18,p=(t-.18)/rise,q=smooth(p);return {y:(startY+10)*(1-q)+(surface+24)*q-310*rise*(p*p*p-p*p),angle:.12-1.17*q,drift:18*q,phase:'rise',clip:0,striking:false};}
 if(t<timing.land){const flight=t-timing.launch,p=flight/1.5;return {y:surface+24-310*flight+(310/1.5)*flight*flight,angle:-1.05+2.05*smooth(p),drift:18+100*p,phase:'air',clip:clamp(t-timing.strike,0,.6),striking:t>=timing.strike};}
 const p=(t-timing.land)/.35;
 return {y:surface+24+30*Math.sin(p*Math.PI/2),angle:1-smooth(p),drift:118+12*smooth(p),phase:p>=1?'done':'land',clip:.6,striking:false};
}
export function tailContact(x,y,angle,facing,size,clip){
 const values=[0,25,-48,13,0],body=[0,-7,9,-3,0];
 const f=clamp(clip/.6*4,0,4),i=Math.min(3,Math.floor(f)),p=(1-Math.cos((f-i)*Math.PI))/2;
 const swing=(values[i]*(1-p)+values[i+1]*p)*Math.PI/180;
 const turn=angle+(body[i]*(1-p)+body[i+1]*p)*Math.PI/180;
 const lx=(84-160-52*Math.cos(swing))*size/320,ly=(111-100-52*Math.sin(swing))*size/320;
 return {x:x+facing*(lx*Math.cos(turn)-ly*Math.sin(turn)),y:y+lx*Math.sin(turn)+ly*Math.cos(turn)};
}
