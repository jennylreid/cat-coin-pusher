let last=performance.now(),acc=0;
const frameSamples=[];let frameWindow=0,framePublish=0;
document.addEventListener('visibilitychange',()=>{last=performance.now();acc=0;frameSamples.length=0;frameWindow=framePublish=0;perf.fps=perf.slow=perf.physics=perf.draw=0;});
function recordFrame(ms,physics=0,drawing=0,steps=0){
 if(!(ms>0))return;
 frameSamples.push({ms,physics,drawing,steps});frameWindow+=ms;framePublish+=ms;
 while(frameSamples.length>1&&frameWindow-frameSamples[0].ms>=3000)frameWindow-=frameSamples.shift().ms;
 if(framePublish>=500){const n=frameSamples.length;perf.fps=1000*n/frameWindow;perf.slow=frameSamples.filter(x=>x.ms>25).length;perf.physics=frameSamples.reduce((s,x)=>s+x.physics,0)/n;perf.draw=frameSamples.reduce((s,x)=>s+x.drawing,0)/n;perf.frameSteps=frameSamples.reduce((s,x)=>s+x.steps,0)/n;perf.coins=bodies.length;framePublish=0;}
}
function frame(now){
 const frameElapsed=now-last,dt=Math.min(.05,frameElapsed/1000);last=now;acc+=dt;
 let n=0;const physicsStart=performance.now();
 while(acc>=STEP&&n<3){n++;step();acc-=STEP;}
 if(acc>STEP)acc=0;
 const physics=performance.now()-physicsStart;
 update(dt);const drawStart=performance.now();draw();const drawing=performance.now()-drawStart;
 recordFrame(frameElapsed,physics,drawing,n);
 requestAnimationFrame(frame);
}
