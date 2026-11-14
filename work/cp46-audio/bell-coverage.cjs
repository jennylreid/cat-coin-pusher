// CP-46 measurements for the PM (Jenny, Nov 14; measure only): (1) the ledge bell: its code, how often it rings in a busy
// 60 s round (same seed) and its loudness against the music and the pusher, on UAT 58, 59 and 60; (2) whether every coin drop,
// coin landing and coin over the front edge makes a sound (none skipped or throttled) on UAT 59 vs UAT 60.
// The harness's fake Audio never ends, so here each recording is "ready" and stops at its cut-off (the game's own limit),
// which makes the 6-recordings-at-once cap and the cooldowns behave as on the phone.
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const E=require('./engine.cjs');
const B={uat58:'../cp58/release.html',uat59:'../cp59/release.html',uat60:'../cp60/release.html'};
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const LIMIT={'coin-drop.mp3':1.1,'coin-land.mp3':.84,'pusher.mp3':.84,'coin-roll.mp3':1.2,'coin-spill.mp3':1.8,'coin-off.mp3':.85};
async function round(file,seed){
 const g=await game({src:path.resolve(__dirname,file),seed});strictAudio(g);g.run('S.muted=false;S.dev=true');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){g.c.document.visibilityState='visible';}
 const A=g.audio;const startAt=new Map();
 const audioTick=()=>{const now=g.run('time');for(const a of A){a.readyState=4;a._ready=true;
   if(!a.paused){if(!startAt.has(a)||startAt.get(a).n!==a.playCount)startAt.set(a,{n:a.playCount,t:now});const lim=LIMIT[(a.src||'').split('/').pop()]||1;if(now-startAt.get(a).t>=lim)a.paused=true;}}};
 g.run(`{globalThis.__m={bell:0,bellCalls:0,thump:0,drops:0,dropSound:0,dropSkip:0,lands:0,landSound:0,landSkip:0,landQueued:0,edgeCoins:0,edgeSound:0,edgeSkip:0,edgeGroup:0,rec:{}};
  globalThis.__plays=()=>0;}`);
 // count actual recording starts: total playCount over all Audio before/after each recordedSfx.play
 g.c.__playCount=()=>A.reduce((s,a)=>s+a.playCount,0);
 g.run(`{const Mx=__m,PC=()=>globalThis.__playCount();
  const lb=ledgeBell;ledgeBell=function(...a){Mx.bellCalls++;return lb.apply(this,a);};
  const sp=sfx.pickup;sfx.pickup=function(k,...a){if(k==='bell')Mx.bell++;else Mx.thump++;return sp.call(this,k,...a);};
  const rp=recordedSfx.play;recordedSfx.play=function(n,...a){const p0=PC();const r=rp.call(this,n,...a);const started=PC()>p0;(Mx.rec[n]=Mx.rec[n]||{calls:0,started:0,fallback:0,skipped:0}).calls++;
   if(started)Mx.rec[n].started++;else if(r===false)Mx.rec[n].fallback++;else Mx.rec[n].skipped++;Mx.__last={n,started,fb:r===false};return r;};
  const sd=sfx.drop;sfx.drop=function(...a){Mx.drops++;Mx.__last=null;const r=sd.apply(this,a);const L=Mx.__last;if(L&&(L.started||L.fb))Mx.dropSound++;else Mx.dropSkip++;return r;};
  const isC46=typeof C46!=='undefined';
  if(isC46){const ld=C46.land;C46.land=function(){Mx.lands++;Mx.__last=null;const q0=C46.queued(),p0=C46.stats.plays.pile||0;ld.call(this);const L=Mx.__last;
    if((C46.stats.plays.pile||0)>p0){Mx.landSound++;Mx.landQueued++;}else if(L&&(L.started||L.fb))Mx.landSound++;else Mx.landSkip++;};}
  else{const sl=sfx.land;sfx.land=function(...a){Mx.lands++;Mx.__last=null;const r=sl.apply(this,a);const L=Mx.__last;if(L&&(L.started||L.fb))Mx.landSound++;else Mx.landSkip++;return r;};}
  const re=recordedSfx.edge;recordedSfx.edge=function(){Mx.__edgeOld=1;return re.call(this);};
  if(isC46){const ce=C46.edge;C46.edge=function(b){if(!b||!(b.kind==='coin'||b.kind==='silver'))return ce.call(this,b);Mx.edgeCoins++;Mx.__last=null;const pc0=PC(),s0=(C46.stats.plays.spill||0)+(C46.stats.plays.cascade||0);ce.call(this,b);
    const s1=(C46.stats.plays.spill||0)+(C46.stats.plays.cascade||0);if(s1>s0){Mx.edgeSound++;Mx.edgeGroup++;}else if(PC()>pc0)Mx.edgeSound++;else Mx.edgeSkip++;};}
  else{const fo=fallOff;globalThis.__fo=1;}
 }`);
 if(!g.run("typeof C46!=='undefined'"))g.run(`{const Mx=__m;const re2=recordedSfx.edge;recordedSfx.edge=function(){Mx.__last=null;const r=re2.call(this);const L=Mx.__last;Mx.__edgeCall=(Mx.__edgeCall||0)+1;Mx.__edgeStarted=(Mx.__edgeStarted||0)+(L&&L.started?1:0);return r;};
  const fo=fallOff;fallOff=function(b,x){const coin=b&&!b.dead&&(b.kind==='coin'||b.kind==='silver')&&!b.boardTarget;const c0=Mx.__edgeCall||0,p0=globalThis.__playCount();const r=fo.call(this,b,x);
   if(coin&&(Mx.__edgeCall||0)>c0){Mx.edgeCoins++;if(globalThis.__playCount()>p0)Mx.edgeSound++;else Mx.edgeSkip++;}return r;};}`);
 else g.run(`{const Mx=__m;}`);
 const tick=n=>{for(let i=0;i<n;i++){g.tick();audioTick();}};
 tick(140);g.tap(200,400);tick(40);g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)tick(1);
 g.run('for(const k of Object.keys(__m))if(typeof __m[k]==="number")__m[k]=0;__m.rec={};');
 for(let s=0;s<60&&g.run("WILD.phase==='play'");s++){g.run(`{S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+120*Math.sin(${s}*0.9+1),y:DROP_Y};WILD.left=Math.max(WILD.left,30);}`);
  if(s===20||s===40)g.run('try{w2Rain(10)}catch(e){}');if(s===30)g.run('try{shake=1.2;shakeKind="catquake"}catch(e){}');tick(60);}
 const m=J(g,'__m');delete m.__last;g.close();return m;}
// offline loudness of the bell, the music and the pusher, from each build's own code (the bell and the music are the
// same code in all three); loudest 100 ms above 250 Hz, and the share in the bell's band (1.2-3.5 kHz)
function sfxOf(file,seed=5){const src=fs.readFileSync(path.resolve(__dirname,file),'utf8');const i=src.indexOf('const sfx = (() => {'),j=src.indexOf('})();',i)+5;
 const ac=E.makeAC(),c={S:{muted:false},inBackground:false,document:{hidden:false},Math:Object.create(Math),pickupFx:{volume:1},console};c.Math.random=E.seeded(seed);c.window={AudioContext:function(){return ac;}};
 vm.createContext(c);vm.runInContext(src.slice(i,j)+';globalThis.sfx=sfx;',c);c.sfx.unlock();return {sfx:c.sfx,ac};}
function bandRms(a,lo,hi){let x=a;for(const [type,f] of [['highpass',lo],['highpass',lo],['lowpass',hi],['lowpass',hi]]){const w=2*Math.PI*f/E.SR,cw=Math.cos(w),sw=Math.sin(w),al=sw/(2*Math.SQRT1_2),a0=1+al;
  const b=type==='lowpass'?[(1-cw)/2,1-cw,(1-cw)/2]:[(1+cw)/2,-(1+cw),(1+cw)/2];const y=new Float32Array(x.length);let x1=0,x2=0,y1=0,y2=0;
  for(let s=0;s<x.length;s++){const z=(b[0]*x[s]+b[1]*x1+b[2]*x2-(-2*cw)*y1-(1-al)*y2)/a0;x2=x1;x1=x[s];y2=y1;y1=z;y[s]=z;}x=y;}return x;}
const loud100=a=>{const pb=E.phoneBand(a),w=Math.round(E.SR*.1);let m=0;for(let k=0;k+w<=pb.length;k+=Math.round(w/4))m=Math.max(m,E.rms(pb.subarray(k,k+w)));return m;};
const dB=x=>+(20*Math.log10(x)).toFixed(1);
function levels(file,isC46,pickupVol){
 const {sfx:s1,ac:a1}=sfxOf(file);a1.currentTime=.02;s1.pickup('bell',pickupVol);const bell=E.render(a1,1.6);
 const {sfx:s2,ac:a2}=sfxOf(file,11);s2.bgmBus(1.72,.001);const STEP=60/112/2,L=64*STEP;const BASS=[87.31,73.42,116.54,130.81,87.31,110,116.54,130.81],PAD=[[349.23,440,523.25],[293.66,349.23,440],[293.66,349.23,466.16],[329.63,392,523.25],[349.23,440,523.25],[329.63,440,523.25],[293.66,349.23,466.16],[329.63,392,466.16]],SC=[349.23,392,440,523.25,587.33,698.46,783.99],MEL=[[5,-1,4,-1,3,4,-1,2,3,-1,-1,1,2,-1,-1,-1],[2,-1,3,-1,4,-1,5,4,3,-1,2,-1,1,-1,-1,-1],[5,-1,4,-1,3,4,5,-1,4,-1,3,-1,2,-1,-1,-1],[0,1,2,-1,3,-1,4,-1,5,-1,6,-1,5,-1,-1,-1]];
 for(let k=0;k<64;k++){const i=k,d=.02+k*STEP,bar=i>>3,s=i&7;if(s===0||s===4)s2.bgm('kick',d);if(s===2||s===6)s2.bgm('rim',d);if(s&1)s2.bgm('shaker',d);if(s===0)s2.bgm('pad',d,PAD[bar]);const r=BASS[bar];if(s===0)s2.bgm('bass',d,r);else if(s===3)s2.bgm('bass',d,r*1.5);else if(s===4)s2.bgm('bass',d,r*2);else if(s===6)s2.bgm('bass',d,r*1.5);const m=MEL[bar>>1][(bar&1)*8+s];if(m>=0)s2.bgm('mar',d,SC[m]);}
 const music=E.render(a2,L+.5).slice(0,Math.round(L*E.SR));
 let push;if(!isC46){const {sfx:s3,ac:a3}=sfxOf(file,5);a3.currentTime=.02;s3.slide(.5,.45*3.2,false,false);push=E.render(a3,1.8);}
 else{const ev=[];const K={noise(t,dur,vol,o={}){ev.push({t,dur,vol,o});}};const W=(K,t,dur,vol,bp,q,attack,peakAt=.5)=>K.noise(t,dur,vol,{bp,q,a:Math.max(.06,dur*attack),lin:true,hold:Math.max(.07,dur*attack)+dur*Math.max(.05,peakAt-attack),sus:.7});
  const dur=.45*3.2;W(K,.02,dur,.075,420,.8,.45);W(K,.02,dur,.035,900,.7,.45);const g5=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../../tickets/CP-46-evidence/audition/levels-round2.json'))).options.find(o=>/w5/.test(o.file)).gain;
  const ac=E.makeAC(),mst=ac.createGain();mst.gain.value=.55;mst.connect(ac.destination);const nb=ac.createBuffer(1,E.SR/2,E.SR),d=nb.getChannelData(0),r=E.seeded(3);for(let i=0;i<d.length;i++)d[i]=r()*2-1;
  for(const e of ev){const s=ac.createBufferSource();s.buffer=nb;s.loop=true;const gg=ac.createGain(),o=e.o,v=e.vol*g5;gg.gain.setValueAtTime(.0001,e.t);gg.gain.linearRampToValueAtTime(v,e.t+o.a);gg.gain.exponentialRampToValueAtTime(v*o.sus,e.t+Math.max(o.a+.001,o.hold));gg.gain.exponentialRampToValueAtTime(.0001,e.t+e.dur);const f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=o.bp;f.Q.value=o.q;s.connect(f);f.connect(gg);gg.connect(mst);s.start(e.t,r()*.4);s.stop(e.t+e.dur+.02);}
  push=E.render(ac,1.8);}
 const bb=x=>E.rms(bandRms(x,1200,3500));
 return {bellLoudest100ms:dB(loud100(bell)),musicRms:dB(E.rms(E.phoneBand(music))),musicLoudest100ms:dB(loud100(music)),pusherStrokeLoudest100ms:dB(loud100(push)),
  bellOverMusicDb:+(dB(loud100(bell))-dB(E.rms(E.phoneBand(music)))).toFixed(1),bellOverPusherDb:+(dB(loud100(bell))-dB(loud100(push))).toFixed(1),
  bellBand_bell:dB(bb(bell.slice(0,Math.round(E.SR*.3)))),bellBand_music:dB(bb(music)),bellBand_pusherStroke:dB(bb(push))};}
(async()=>{const out={code:{},rounds:{},levels:{}};
 // code identity
 {const gs={};for(const [k,f] of Object.entries(B))gs[k]=await game({src:path.resolve(__dirname,f),seed:3});
  for(const n of ['ledgeBell','pickupLandSound','String(sfx.pickup)','JSON.stringify(pickupFx.volume)','String(sfx.bgm)']){const v=Object.fromEntries(Object.entries(gs).map(([k,g])=>[k,g.run('String('+n+')')]));out.code[n]={same58_59:v.uat58===v.uat59,same59_60:v.uat59===v.uat60};}
  out.code.pickupVolume=gs.uat60.run('pickupFx.volume');out.code.ledgeBellSource=gs.uat60.run('String(ledgeBell)').slice(0,400);for(const g of Object.values(gs))g.close();}
 console.log(JSON.stringify(out.code,null,1));
 for(const [k,f] of Object.entries(B)){out.rounds[k]=await round(f,3);console.log(k,JSON.stringify(out.rounds[k]));}
 for(const [k,f] of Object.entries(B)){out.levels[k]=levels(f,k==='uat60',out.code.pickupVolume);console.log(k,JSON.stringify(out.levels[k]));}
 fs.writeFileSync(path.join(__dirname,'bell-coverage.json'),JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exit(1);});
