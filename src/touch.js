// Each finger owns its input. Releasing an attack never releases the swim stick.
export function installTouchControls(root, {attack, resumeAudio}) {
 const stick=root.querySelector('.swim-stick'),knob=stick.querySelector('.stick-knob');
 const axes={x:0,y:0};let stickId=null;const held=new Map();let repeatIn=0;
 function move(e){const r=stick.getBoundingClientRect(),radius=r.width*.32;let x=(e.clientX-r.left-r.width/2)/radius,y=(e.clientY-r.top-r.height/2)/radius;const length=Math.hypot(x,y);if(length>1){x/=length;y/=length}axes.x=Math.abs(x)<.14?0:x;axes.y=Math.abs(y)<.14?0:y;knob.style.transform=`translate(${x*radius}px,${y*radius}px)`;}
 stick.addEventListener('pointerdown',e=>{if(stickId!==null)return;e.preventDefault();resumeAudio();stickId=e.pointerId;stick.setPointerCapture(e.pointerId);move(e);});
 stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId){e.preventDefault();move(e)}});
 function releaseStick(e){if(e.pointerId!==stickId)return;stickId=null;axes.x=axes.y=0;knob.style.transform='';}
 for(const event of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(event,releaseStick);
 root.querySelectorAll('[data-touch-action]').forEach(button=>{
  button.addEventListener('pointerdown',e=>{e.preventDefault();resumeAudio();button.setPointerCapture(e.pointerId);held.set(e.pointerId,button);button.classList.add('held');attack(button.dataset.touchAction);repeatIn=.18;});
  function release(e){held.delete(e.pointerId);if(![...held.values()].includes(button))button.classList.remove('held')}
  for(const event of ['pointerup','pointercancel','lostpointercapture'])button.addEventListener(event,release);
  button.addEventListener('click',e=>{e.preventDefault();if(e.detail===0)attack(button.dataset.touchAction)});
 });
 root.addEventListener('contextmenu',e=>e.preventDefault());
 return {axes,tick(dt){repeatIn-=dt;if(repeatIn<=0&&held.size){for(const button of new Set(held.values()))attack(button.dataset.touchAction);repeatIn=.18}},reset(){stickId=null;axes.x=axes.y=0;knob.style.transform='';held.clear();root.querySelectorAll('.held').forEach(b=>b.classList.remove('held'));}};
}
