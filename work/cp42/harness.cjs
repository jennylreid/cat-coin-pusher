// Shared test helpers for UAT 37: the real runtime with a simulated performance clock that advances with each tick,
// so the dance's beat clock (performance.now) and the game clock move together in desktop runs.
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
async function game({seed=4,render=false,height=888.889,src=path.resolve(__dirname,'release.html'),storage={}}={}){
 const g=await make({sourceFile:src,render,height,seed,storage});
 if(render){g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();}
 let ms=100000;const realNow=g.c.performance.now.bind(g.c.performance);
 g.c.performance={now:()=>ms,timeOrigin:0};
 const tick=g.tick.bind(g);g.tick=()=>{ms+=1000/60;tick();};
 g.ms=()=>ms;g.realNow=realNow;
 g.run=s=>vm.runInContext(s,g.c);
 g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 g.until=(cond,max=1200)=>{let k=0;while(!g.run(cond)&&k<max){g.tick();k++;}return k<max;};
 // a tap at a point; the event carries no timeStamp, so the dance judges it at the simulated now
 g.tap=(x=200,y=560)=>{g.pointer('pointerdown',x,y);g.pointer('pointerup',x,y);};
 return g;
}
// Ticks until the next beat k is at the given offset (s) from now, then taps.
function tapAtBeat(g,k,offset=0){const target=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`)+offset;while(g.ms()/1000<target-1/120)g.tick();g.tap();}
module.exports={game,tapAtBeat};
