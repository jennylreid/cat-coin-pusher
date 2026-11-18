// UAT 71 (CP-54 phase B) checks: the coin landing is coin-land.mp3 every time (as UAT 59), real A takes as filler, the
// title plays the same; only those lines differ from UAT 70. Also counts landings with no sound in a 60 s hold and 60 s of
// fast taps, UAT 70 against UAT 71. Audio: the harness's fake Audio, made "ready" and stopped at the game's own cut-off
// (as CP-46 bell-coverage.cjs), so the 6-recording cap and the cooldowns act as on the phone; Web Audio is the strict fake.
// Usage: node checks71.cjs   -> tickets/CP-54-evidence/uat71/checks71.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp70/release.html');
const OUT=path.resolve(__dirname,'../../tickets/CP-54-evidence/uat71');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const LIMIT={'coin-drop.mp3':1.1,'coin-land.mp3':.84,'pusher.mp3':.84,'coin-roll.mp3':1.2,'coin-spill.mp3':1.8,'coin-off.mp3':.85};
async function boot(file,seed){
 const g=await game({src:file,seed});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){if(!Number.isFinite(x)||x<=0)throw new TypeError('rate '+x);v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:.45,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 const A=g.audio,startAt=new Map();
 g.audioTick=()=>{const now=g.ms()/1000;for(const a of A){a.readyState=4;a._ready=true;
  if(!a.paused){if(!startAt.has(a)||startAt.get(a).n!==a.playCount)startAt.set(a,{n:a.playCount,t:now});if(now-startAt.get(a).t>=(LIMIT[(a.src||'').split('/').pop()]||1))a.paused=true;}}};
 g.step=n=>{for(let i=0;i<n;i++){g.tick();g.audioTick();}};
 g.c.__landPlays=()=>A.filter(a=>/coin-land/.test(a.src||'')).reduce((s,a)=>s+a.playCount,0);
 g.c.__bufStarts=()=>st.started.filter(n=>n.buffer&&n.buffer.len).length;   // filler takes started (decoded buffers)
 g.st=st;g.run('S.muted=false;S.dev=false;globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e);}');
 return g;}
function toBoard(g){g.step(140);g.run('if(typeof pgTitleDone==="function"&&PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.step(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.step(1);}return g.run('WILD.phase')==='play';}
function countLandings(g){g.run(`{globalThis.__L={drops:0,boardFull:0,lands:0,rec:0,pile:0,filler:0,silent:0};const M=__L;const sd=sfx.drop;sfx.drop=function(...x){M.drops++;if(typeof cp48Full==='function'&&cp48Full())M.boardFull++;return sd.apply(this,x);};const ld=C46.land;
  C46.land=function(){M.lands++;const r0=__landPlays(),p0=C46.stats.plays.pile||0,b0=__bufStarts();ld.call(this);
   if(__landPlays()>r0)M.rec++;else if((C46.stats.plays.pile||0)>p0)M.pile++;else if(__bufStarts()>b0)M.filler++;else M.silent++;};}`);}
async function play60(file,mode,seed=3){
 const g=await boot(file,seed);const ok=toBoard(g);countLandings(g);
 let rounds=1;for(let s=0;s<60;s++){ // 60 s of dropping; a new round starts when one ends (a round lasts ~30 s)
  if(g.run("WILD.phase!=='play'")){g.run('holding=false;try{wildReset()}catch(e){}');g.run('wildStartCountdown()');let k=0;while(g.run("WILD.phase!=='play'")&&k++<900)g.step(1);if(k>=900)break;rounds++;}
  g.run(`S.coins=Math.max(S.coins,60);WILD.left=Math.max(WILD.left,30);holdPos={x:200+120*Math.sin(${s}*0.9+1),y:DROP_Y};holding=${mode==='hold'}`);
  if(mode==='hold')g.step(60);else for(let f=0;f<60;f++){if(f%15===0)g.run(`tryDrop({x:200+120*Math.sin(${s}*0.9+${f}/20),y:DROP_Y})`);g.step(1);} // a tap every 0.25 s
 }
 const r={reached:ok,rounds,...J(g,'__L'),cp54:J(g,"typeof CP54!=='undefined'?CP54.stats:null"),errs:J(g,'__errs')};g.close();return r;}
(async()=>{
 const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 // 0. only the CP-54 lines differ from UAT 70
 const text=fs.readFileSync(src,'utf8'),before=fs.readFileSync(base,'utf8');
 let r=text.replace("const BUILD = '2026.11.16 UAT 71';","const BUILD = '2026.11.16 UAT 70';");
 r=r.replace(/_dec\(ab,cb\)\{.*?return true;\},_playBuf\(b,v,r\)\{.*?return true;\},/s,'');
 r=r.replace(/ \/\/ CP-54: like play\(\).*?\n \}\n(?= function edge\(\))/s,'');
 r=r.replace(' return {play,playWhy,edge,reset,stopAll,duck};',' return {play,edge,reset,stopAll,duck};');
 r=r.replace("CP54.coin(1,false);","play('pile',1,()=>sfx.land());");
 r=r.replace("else if(kind==='coin'){CP54.coin(.35*v/.8,true);}","else if(kind==='coin'){this._pgSteel(t,.35*v,1+Math.random()*.4,false);}");
 r=r.replace(/\n\/\/ ---------- CP-54 \(UAT 71.*?return \{coin,filler,stats,bufs,load\};\}\)\(\);\n/s,'');
 check('0 only the build name, the landing, the title clink and the CP-54 helpers differ from UAT 70 (everything else identical)',r===before);
 // 1. skipped landings, UAT 70 vs UAT 71
 notes.landings={};
 for(const [nm,f] of [['UAT 70',base],['UAT 71',src]])for(const mode of ['hold','taps'])notes.landings[nm+' '+mode]=await play60(f,mode);
 for(const mode of ['hold','taps']){const a=notes.landings['UAT 70 '+mode],b=notes.landings['UAT 71 '+mode];
  check(`1 ${mode}: UAT 71 landings never silent, and none use a code-made drop`,b.reached&&b.lands>120&&b.silent===0&&b.pile===0,b);
  check(`1 ${mode}: UAT 71 plays the recording on at least as many landings as UAT 70 (UAT 70 used it ~1 in 5)`,b.rec>=a.rec,{uat70:a.rec,uat71:b.rec});}
 // 2. the title: the word drop-in and the pile-up play the recording (A as filler), never the steel clink
 {const g=await boot(src,4);g.run(`globalThis.__T={steel:0,pg:0};const ps=sfx._pgSteel;sfx._pgSteel=function(...a){__T.steel++;return ps.apply(this,a);};
   const pg=sfx.pg;sfx.pg=function(k,...a){if(k==='coin')__T.pg++;return pg.call(this,k,...a);};PGU.screen='title';PGU.title={t:0,coins:[],snd:0};`);
  const r0=g.c.__landPlays(),b0=g.c.__bufStarts();g.step(150);const r1=g.c.__landPlays(),b1=g.c.__bufStarts(),T1=J(g,'__T');
  const vols=g.audio.filter(a=>/coin-land/.test(a.src||'')&&a.playCount).map(a=>+a.volume.toFixed(4));
  check('2a title word drop-in: 7 coin sounds, every one the recording or an A take, no steel clink',T1.pg===7&&(r1-r0)+(b1-b0)===7&&T1.steel===0,{pg:T1.pg,rec:r1-r0,filler:b1-b0,steel:T1.steel});
  check('2b title recording at the title\'s relative volume (0.25 x 0.35 = 0.0875)',vols.length&&vols.every(v=>Math.abs(v-.0875)<1e-3),vols);
  g.run('PGU.title={t:3,coins:[],snd:99,mode:4}');const r2=g.c.__landPlays(),b2=g.c.__bufStarts();g.step(360);const T2=J(g,'__T');
  const n=T2.pg-T1.pg,heard=(g.c.__landPlays()-r2)+(g.c.__bufStarts()-b2);
  check('2c title pile-up (6 s): every coin sound is the recording or an A take, no steel clink',n>10&&heard===n&&T2.steel===0,{pg:n,heard,rec:g.c.__landPlays()-r2,steel:T2.steel});
  notes.title={wordDrop:{rec:r1-r0,filler:b1-b0},pileUp:{coins:n,rec:g.c.__landPlays()-r2,filler:heard-(g.c.__landPlays()-r2)},stats:J(g,'CP54.stats')};
  // muted: nothing at all
  g.run('S.muted=true');const r3=g.c.__landPlays(),b3=g.c.__bufStarts();g.run('CP54.coin(1,false);CP54.coin(.35,true)');
  check('3 muted: no recording and no filler',g.c.__landPlays()===r3&&g.c.__bufStarts()===b3);
  notes.titleErrs=J(g,'__errs');g.close();}
 // 4. filler level: A takes through the effects master at A_GAIN
 {const g=await boot(src,6);toBoard(g);g.run('CP54.load()');const n0=g.st.started.length;g.run('CP54.filler(1)');const s=g.st.started.slice(n0).find(x=>x.buffer&&x.buffer.len);
  check('4 filler: an A take plays with gain 1.385 and pitch within +-6%',!!s&&J(g,'CP54.bufs.length')===3,{started:!!s});g.close();}
 const errs=Object.values(notes.landings).flatMap(x=>x.errs).concat(notes.titleErrs);
 check('5 no frame errors',!errs.length,errs.slice(0,3));
 check('6 production untouched',sha(prod)===prod0);
 fs.writeFileSync(path.join(OUT,'checks71.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
