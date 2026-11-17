// CP-57 follow-up: plain coins (coin/silver) going over the front edge in a busy 60 s (coins held down the whole time,
// a coin rain of 10 at 20 s and 40 s, a quake at 30 s; a new round when one ends), and what each one sounded like.
// Audio as on the phone: the fake Audio is made "ready" and stopped at the game's own cut-off, so the 6-recording cap and the
// cooldowns act (as CP-46 bell-coverage.cjs). Usage: node measure-edge.cjs [old] [new]  -> tickets/CP-57-evidence/edge-coins-60s.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OLD=path.resolve(process.argv[2]||path.join(__dirname,'../cp74/release.html')),NEW=path.resolve(process.argv[3]||path.join(__dirname,'release-edge.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const LIMIT={'coin-drop.mp3':1.1,'coin-land.mp3':.84,'pusher.mp3':.84,'coin-roll.mp3':1.2,'coin-spill.mp3':1.8,'coin-off.mp3':.85};
async function run(file,seed=3){
 const g=await game({src:file,seed});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:.5,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 const A=g.audio,startAt=new Map();
 const audioTick=()=>{const now=g.ms()/1000;for(const a of A){a.readyState=4;a._ready=true;if(!a.paused){if(!startAt.has(a)||startAt.get(a).n!==a.playCount)startAt.set(a,{n:a.playCount,t:now});if(now-startAt.get(a).t>=(LIMIT[(a.src||'').split('/').pop()]||1))a.paused=true;}}};
 const step=n=>{for(let i=0;i<n;i++){g.tick();audioTick();}};
 g.c.__plays=re=>A.filter(a=>re.test(a.src||'')).reduce((s,a)=>s+a.playCount,0);
 g.c.__takes=()=>st.started.filter(n=>n.buffer&&n.buffer.len).length;
 g.run('S.muted=false;S.dev=false');step(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');step(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)step(1);}
 g.run(`{globalThis.__E={coins:0,take:0,offRecording:0,spillRecording:0,codeGroup:0,coveredByGroup:0,silent:0};const M=__E;
  const isC=typeof CP57E!=='undefined';
  const ce=C46.edge;C46.edge=function(b){if(!b||!(b.kind==='coin'||b.kind==='silver'))return ce.call(this,b);M.coins++;
   const off0=__plays(/coin-off/),sp0=__plays(/coin-spill/),t0=__takes(),g0=(C46.stats.plays.spill||0)+(C46.stats.plays.cascade||0),th0=isC?CP57E.stats.thinned:0;
   ce.call(this,b);
   if(__takes()>t0)M.take++;else if(__plays(/coin-spill/)>sp0)M.spillRecording++;else if((C46.stats.plays.spill||0)+(C46.stats.plays.cascade||0)>g0)M.codeGroup++;
   else if(__plays(/coin-off/)>off0)M.offRecording++;else if(isC&&CP57E.stats.thinned>th0)M.coveredByGroup++;else M.silent++;};}`);
 let rounds=1;for(let s=0;s<60;s++){
  if(g.run("WILD.phase!=='play'")){g.run('holding=false;try{wildReset()}catch(e){}');g.run('wildStartCountdown()');let k=0;while(g.run("WILD.phase!=='play'")&&k++<900)step(1);if(k>=900)break;rounds++;}
  g.run(`S.coins=Math.max(S.coins,60);WILD.left=Math.max(WILD.left,30);holding=true;holdPos={x:200+120*Math.sin(${s}*0.9+1),y:DROP_Y}`);
  if(s===20||s===40)g.run('try{w2Rain(10)}catch(e){}');if(s===30)g.run('try{shake=1.2;shakeKind="catquake"}catch(e){}');step(60);}
 const r={rounds,...J(g,'__E'),cp57e:J(g,"typeof CP57E!=='undefined'?CP57E.stats:null")};g.close();return r;}
(async()=>{const out={old:OLD,new:NEW,uat74:await run(OLD),new_:await run(NEW)};
 fs.writeFileSync(path.join(OUT,'edge-coins-60s.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exit(1)});
