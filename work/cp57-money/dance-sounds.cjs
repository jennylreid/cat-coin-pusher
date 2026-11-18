// CP-57 bug hunt (Jenny: "something else keeping a beat that's no longer there"): every sound triggered during a Dance break,
// with its time against the beat clock (beats from the first dance beat; scheduled sounds use their delay), per build.
// Also every audio node actually started (oscillators / noise / buffers) and which output it goes to.
// Usage: node dance-sounds.cjs name=release.html ...   -> tickets/CP-57-evidence/dance-sounds.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const B=Object.fromEntries(process.argv.slice(2).map(a=>{const [n,f]=a.split('=');return [n,path.resolve(f)];}));
async function run(file){const g=await game({src:file,seed:7,render:false});const st=strictAudio(g);
 {const P=g.c.AudioContext.prototype,cbs=P.createBufferSource;P.createBufferSource=function(){const n=cbs.call(this);let v=1;n.playbackRate={get value(){return v;},set value(x){v=x;}};return n;};}
 g.c.AudioContext.prototype.decodeAudioData=function(ab,ok){const b={duration:.5,len:ab.byteLength};if(ok)ok(b);return Promise.resolve(b);};
 if(typeof g.c.atob!=='function')g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 try{Object.defineProperty(g.c.document,'visibilityState',{value:'visible',configurable:true});}catch(e){}
 for(const a of g.audio){}
 g.run('S.muted=false;S.dev=false');g.ticks(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.ticks(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();}
 g.ticks(300); // let the board run a bit (pusher, coins) before the break
 g.run(`globalThis.__L=[];globalThis.__on=false;const B=(d)=>{const D=WILD.dance;return D?+(((danceNow()+(+d||0))-D.p0)/D.beat).toFixed(3):null;};
  const top=new Set(['danceLoud']);
  for(const m of Object.keys(sfx)){const o=sfx[m];if(typeof o!=='function'||m==='_pgT'||m==='_w2ok'||m==='danceLatency'||m==='_bus'||m==='_dBus'||m==='_dec')continue;
   sfx[m]=function(...a){if(__on&&!globalThis.__inner){const k=typeof a[0]==='string'?a[0]:'';const d=(m==='dance'||m==='danceLoud'||m==='pickup')?a[2]:(m==='bgm'||m==='mus'||m==='fx46')?a[1]:0;__L.push({t:B(d),s:'sfx.'+m+(k?'('+k+')':'')});}
    const was=globalThis.__inner;if(m==='danceLoud')globalThis.__inner=true;try{return o.apply(this,a);}finally{globalThis.__inner=was;}};}
  const rp=recordedSfx.play;recordedSfx.play=function(n,...a){if(__on)__L.push({t:B(0),s:'recording '+n});return rp.call(this,n,...a);};
  if(recordedSfx.playWhy){const pw=recordedSfx.playWhy;recordedSfx.playWhy=function(n,...a){const r=pw.call(this,n,...a);if(__on)__L.push({t:B(0),s:'recording '+n+' '+r});return r;};}
  const ap=Audio.prototype.play;`);
 // count HTMLAudio starts too
 const A=g.audio;const pc0=()=>A.map(a=>[a.src,a.playCount]);
 g.run('danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k++<300)g.tick();
 const n0=st.started.length,a0=pc0();g.run('__on=true');
 const D0=J(g,'{p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n,latency:WILD.dance.latency}');
 for(let b=0;b<D0.n;b++){const target=g.run(`WILD.dance.p0+${b}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target-1/120)g.tick();g.tap();}
 k=0;while(g.run("!!WILD.dance&&WILD.dance.phase!=='finale'&&WILD.dance.stage!=='total'&&WILD.dance.stage!=='perfect'")&&k++<600)g.tick();
 g.run('__on=false');
 const L=J(g,'__L'),started=st.started.slice(n0);
 const rec=A.map((a,i)=>({src:(a.src||'').split('/').pop(),n:a.playCount-(a0[i]?a0[i][1]:0)})).filter(x=>x.n>0);
 // summary per sound kind: count, and how many land on a beat (|frac| < .06) or on an off-beat half
 const sum={};for(const e of L){const s=sum[e.s]=sum[e.s]||{n:0,onBeat:0,half:0,beats:[]};s.n++;if(e.t!=null){const f=e.t-Math.round(e.t),h=e.t*2-Math.round(e.t*2);if(Math.abs(f)<.06)s.onBeat++;else if(Math.abs(h)<.12)s.half++;if(s.beats.length<20)s.beats.push(e.t);}}
 g.close();return {beat:D0,summary:sum,recordings:rec,nodes:started.length,log:L.slice(0,400)};}
(async()=>{const out={};for(const [n,f] of Object.entries(B)){out[n]=await run(f);console.log('=== '+n,'nodes',out[n].nodes,'recordings',JSON.stringify(out[n].recordings));
  for(const [s,v] of Object.entries(out[n].summary).sort())console.log('  '+s.padEnd(34)+String(v.n).padStart(4)+'  onBeat '+v.onBeat+'  half '+v.half);}
 fs.writeFileSync(path.resolve(__dirname,'../../tickets/CP-57-evidence/dance-sounds.json'),JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exit(1)});
