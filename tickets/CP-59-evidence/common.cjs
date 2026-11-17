const W='C:/Users/jenny/OneDrive/work/CoinPusher/work';
const make=require(W+'/cp33/runtime.cjs'),vm=require('vm');
const SRC=W+'/cp70/release.html';
async function game(seed=5,src=SRC){const g=await make({sourceFile:src,render:true,seed,width:400,height:889,pixelRatio:1,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.J=x=>JSON.parse(g.run('JSON.stringify('+x+')'));g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return fe(e);}");
 g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);return g;}
function level(g,passed,sel){g.run(`pglLv().passed=${passed};pglLv().sel=${sel};pgSave();if(WILD.phase==='card')wildReset();`);g.ticks(10);try{g.c.draw();}catch(e){console.log("draw",e.message)}}
function play(g){const pl=g.J('PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);return g.until("WILD.phase==='play'",900);}
module.exports={game,level,play,SRC};
