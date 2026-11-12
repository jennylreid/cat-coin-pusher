let last = performance.now(), acc = 0;
// Rolling wall-clock frame intervals: stalls count, startup has no invented 60.
const frameSamples=[];let frameWindow=0,framePublish=0;
document.addEventListener('visibilitychange',()=>{last=performance.now();acc=0;frameSamples.length=0;frameWindow=framePublish=0;perf.fps=perf.slow=0;});
function recordFrame(ms){
 if(!(ms>0))return;
 frameSamples.push(ms);frameWindow+=ms;framePublish+=ms;
 while(frameSamples.length>1&&frameWindow-frameSamples[0]>=3000)frameWindow-=frameSamples.shift();
 if(framePublish>=500){perf.fps=1000*frameSamples.length/frameWindow;perf.slow=frameSamples.filter(x=>x>25).length;framePublish=0;}
}












function frame(now) {











  const frameElapsed=now-last;const dt = Math.min(0.05, frameElapsed / 1000); last = now;











  recordFrame(frameElapsed);











  acc += dt;











  let n = 0;











  while (acc >= STEP && n++ < 3) { step(); acc -= STEP; }











  if (acc > STEP) acc = 0; // a slow phone drops time rather than falling ever further behind











  update(dt); draw();











  requestAnimationFrame(frame);











}











// Local layout draft: approved paw direction, separate Collections/Inventory,
// power controls above the cat. No layout/physics/artwork changes to the board.
function uiCircle(x,y,r,fill,stroke,lw=1){ctx.beginPath();ctx.arc(x,y,r,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
function uiRound(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
