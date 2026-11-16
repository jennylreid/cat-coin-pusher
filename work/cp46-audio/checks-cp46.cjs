// CP-46 checks: the new coin sounds in rotation and the warm whoosh pusher, on top of a build (sound on, strict fake Web
// Audio, the real runtime). Usage: node checks-cp46.cjs BUILD_release.html BASE_release.html OUT_DIR
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const E=require('./engine.cjs');
const src=path.resolve(process.argv[2]),base=path.resolve(process.argv[3]),OUT=path.resolve(process.argv[4]);fs.mkdirSync(OUT,{recursive:true});
const AUD=path.resolve(__dirname,'../../tickets/CP-46-evidence/audition');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
function play(g,n,errs){for(let i=0;i<n;i++){try{g.tick();if(i%20===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
async function start(file,seed=3){const g=await game({src:file,seed,render:true});const st=strictAudio(g);g.run('S.muted=false;S.dev=true');const errs=[];
 g.run(`globalThis.__rec=[];const rp=recordedSfx.play;recordedSfx.play=function(n,...a){__rec.push(n);return rp.call(this,n,...a);};
  globalThis.__slides=[];const sl=sfx.slide;sfx.slide=function(...a){__slides.push([time,...a]);return sl.apply(this,a);};`);
 play(g,140,errs);g.tap(200,400);play(g,40,errs);return {g,st,errs};}
// offline render of a note list as sfx.fx46 plays it (master 0.55), in the CP-46 stand-in
function renderEvents(list,len,sc=1,seed=9){const ac=E.makeAC(),master=ac.createGain();master.gain.value=.55;master.connect(ac.destination);
 const nb=ac.createBuffer(1,E.SR/2,E.SR),d=nb.getChannelData(0),r=E.seeded(seed);for(let i=0;i<d.length;i++)d[i]=r()*2-1;
 for(const e of list){const t=e.t,o=e.o,a=o.a||.005,vol=e.vol*sc;let s;
  if(e.k===0){s=ac.createOscillator();s.type=e.type;s.frequency.setValueAtTime(e.f,t);if(o.fEnd)s.frequency.exponentialRampToValueAtTime(o.fEnd,t+(o.glide||e.dur));}else{s=ac.createBufferSource();s.buffer=nb;s.loop=true;}
  const g=ac.createGain();g.gain.setValueAtTime(.0001,t);if(o.lin)g.gain.linearRampToValueAtTime(vol,t+a);else g.gain.exponentialRampToValueAtTime(vol,t+a);
  if(o.hold)g.gain.exponentialRampToValueAtTime(Math.max(1e-4,vol*(o.sus??1)),t+Math.max(a+.001,o.hold));g.gain.exponentialRampToValueAtTime(.0001,t+e.dur);
  let out=s;if(o.lp||o.hp||o.bp){const f=ac.createBiquadFilter();f.type=o.lp?'lowpass':o.hp?'highpass':'bandpass';f.frequency.value=o.lp||o.hp||o.bp;f.Q.value=o.q??(o.bp?1:0);s.connect(f);out=f;}
  out.connect(g);g.connect(master);if(e.k===0){s.start(t);s.stop(t+e.dur+.03);}else{s.start(t,e.off);s.stop(t+e.dur+.02);}}
 return E.render(ac,len);}
function readWav(f){const b=fs.readFileSync(f),n=(b.length-44)/2,a=new Float32Array(n);for(let i=0;i<n;i++)a[i]=b.readInt16LE(44+i*2)/32768;return a;}
const loud100=a=>{const pb=E.phoneBand(a),w=Math.round(E.SR*.1);let m=0;for(let k=0;k+w<=pb.length;k+=Math.round(w/4))m=Math.max(m,E.rms(pb.subarray(k,k+w)));return m;};
const dB=x=>+(20*Math.log10(x)).toFixed(2);
(async()=>{
 // 1. the sound sets and the whoosh: what's in the build
 {const {g,st,errs}=await start(src);
  const sets=J(g,'Object.fromEntries(Object.entries(C46.SETS).map(([k,v])=>[k,v.map(x=>({file:x.file,n:x.ev.length,ok:x.ev.every(e=>[e.t,e.vol,e.dur].every(Number.isFinite)&&e.vol>0)}))]))');
  const sizes=Object.fromEntries(Object.entries(sets).map(([k,v])=>[k,v.length]));
  check('six sound sets with every auditioned variant: clink 4, pile 4, spill 4, cascade 3, gold 2, gold over the edge 1',JSON.stringify(sizes)===JSON.stringify({clink:4,pile:4,spill:4,cascade:3,gold:2,goldEdge:1}),sizes);
  check('every note of every variant has finite times and volumes',Object.values(sets).flat().every(x=>x.ok));
  // the notes: every in-game variant is the audition's own note list times its set's auditioned gain (all but the random noise start)
  const aud=(()=>{const ev0=[];let ev;const K={rand:()=>.5,set stem(s){},tone(f,t,dur,type,vol,o={}){if(vol>0)ev.push({t,k:0,f,dur,type,vol,o});},noise(t,dur,vol,o={}){if(vol>0)ev.push({t,k:1,dur,vol,o});}};
   const hz=m=>440*Math.pow(2,(m-69)/12),seeded=E.seeded;const code=fs.readFileSync(path.join(__dirname,'coins-from-audition.js'),'utf8');
   const {COINS,coinKit}=new Function('hz','seeded',code+';return {COINS,coinKit};')(hz,seeded);const gains=JSON.parse(fs.readFileSync(path.join(AUD,'levels.json'))).coinGroupGains;
   const out={};const CK=coinKit(K);for(const c of COINS){ev=[];c.play(K,CK);const t0=Math.min(...ev.map(e=>e.t));out[c.file]=ev.map(e=>({...e,t:e.t-t0,vol:e.vol*gains[c.group]})).sort((a,b)=>a.t-b.t);}return out;})();
  const close=(a,b)=>Math.abs(a-b)<=1e-9*Math.max(1,Math.abs(b));let same=0,bad=[];
  for(const [k,v] of Object.entries(sets))for(let i=0;i<v.length;i++){const ev=J(g,`C46.SETS.${k}[${i}].ev`),A=aud[v[i].file];
   const ok=A&&A.length===ev.length&&ev.every((e,j)=>e.k===A[j].k&&close(e.t,A[j].t)&&close(e.vol,A[j].vol)&&close(e.dur,A[j].dur)&&(e.k||e.f===A[j].f&&e.type===A[j].type)&&JSON.stringify(e.o)===JSON.stringify(A[j].o));ok?same++:bad.push(v[i].file);}
  check("each coin sound is the audition's note list at its auditioned level (every note's time, pitch, length, volume and envelope)",same===18&&!bad.length,{same,bad});
  // and rendered: each in-game variant against its audition WAV, averaged over 6 random noise draws (short noise bursts vary a little per play)
  const lv={};let worst=0;for(const [k,v] of Object.entries(sets))for(let i=0;i<v.length;i++){const ev=J(g,`C46.SETS.${k}[${i}].ev`),f=v[i].file,b=readWav(path.join(AUD,f));let sum=0;
   for(let n=0;n<6;n++){const r=E.seeded(100+n);const a=renderEvents(ev.map(e=>({...e,off:r()*.4})),ev.reduce((m,e)=>Math.max(m,e.t+e.dur),0)+.2,1,100+n);sum+=loud100(a);}
   const d=dB(sum/6/loud100(b));lv[f]=d;worst=Math.max(worst,Math.abs(d));}
  check('rendered, each coin sound is as loud as its audition WAV (loudest 100 ms above 250 Hz, average of 6 plays, within 1.5 dB: the notes are identical, but each play draws new noise, so a 10 ms click varies a little from the one recording Jenny heard)',worst<=1.5,lv);
  // the whoosh: the round-2 timeline (3 normal strokes, 4 Turbo, 1 normal) at the Pusher dial's 50% default
  const wev=J(g,`(()=>{const ev=[],K={tone(f,t,dur,type,vol,o={}){ev.push({t,k:0,f,dur,type,vol,o});},noise(t,dur,vol,o={}){ev.push({t,k:1,dur,vol:vol*C46.W5_GAIN,o,off:Math.random()*.4});}};
   let t=.05;for(const P of [3.2,3.2,3.2,1.5,1.5,1.5,1.5,3.2]){const tb=P<2;C46.stroke(K,t+.08*P,.45*P,false,tb);C46.stroke(K,t+.61*P,.39*P,true,tb);t+=P;}return ev;})()`);
  check('the pusher whoosh is noise only: no tones, no drum or click (every note fades in over 60 ms or more)',wev.every(e=>e.k===1&&e.o.lin&&e.o.a>=.06),{notes:wev.length});
  const wa=renderEvents(wev,19.15),wb=readWav(path.join(AUD,'pusher-w5-warm-whoosh.wav')),wd=dB(E.rms(E.phoneBand(wa))/E.rms(E.phoneBand(wb)));
  check('the whoosh plays at the auditioned level at Pusher sound 50% (within 0.5 dB of pusher-w5-warm-whoosh.wav, above 250 Hz)',Math.abs(wd)<=.5,{dB:wd});
  check('sets: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 // 2. a round on the Tuxedo's board with a Turbo: the new sounds play, the old pusher sounds don't
 {const {g,st,errs}=await start(src);
  g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)play(g,1,errs);
  for(let s=0;s<40&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};WILD.left=Math.max(WILD.left,60);`);
   if(s===20)g.run('WILD.turbo=8;wildSetPeriod(WILD_TURBO_PERIOD)');play(g,60,errs);}
  g.run('holding=false');play(g,120,errs);
  const r=J(g,'({plays:C46.stats.plays,whooshes:C46.stats.whooshes,dropped:C46.stats.dropped,rec:[...new Set(__rec)],slides:__slides.length,turbo:__slides.filter(x=>x[4]).length,turboDur:__slides.filter(x=>x[4]&&!x[3]).map(x=>+x[2].toFixed(3))[0],normalDur:__slides.filter(x=>!x[4]&&!x[3]).map(x=>+x[2].toFixed(3))[0],queued:C46.queued()})');
  check('in a round: coins dropped on the board play the current landing and the new drops on pile; coins knocking play the current clink and the new clinks',r.plays.pile>5&&r.plays.pileCurrent>0&&r.plays.clink>5&&r.plays.clinkCurrent>0,r);
  check('the pusher: one whoosh per stroke (forward and back), faster in Turbo (0.675 s strokes instead of 1.44 s)',r.whooshes===r.slides&&r.slides>=20&&r.turbo>=4&&r.turboDur===.675&&r.normalDur===1.44,r);
  check('the recorded pusher sound (pusher.mp3) never plays',!r.rec.includes('push'),r.rec);
  check('round: no errors with sound on, nothing dropped from the sound queue',!errs.length&&st.created>0&&r.dropped===0,errs);g.close();}
 // 3. the edge: single coins, a spill, a cascade, gold, and prizes keep the old edge sounds
 {const {g,st,errs}=await start(src);
  const r=J(g,`(()=>{const out={};const p0=()=>({...C46.stats.plays});const c={kind:'coin'};
   const re0=recordedSfx.edge;let oldE=0;recordedSfx.edge=function(){oldE++;return re0.call(this);};time+=5;C46.edge(c);recordedSfx.edge=re0;out.single={plays:p0(),oldEdge:oldE};
   time+=5;C46.edge(c);C46.edge(c);C46.edge(c);out.spill=p0();
   time+=5;for(let i=0;i<12;i++){time+=.05;C46.edge(c);}out.cascade=p0();
   const rp=recordedSfx.edge;let old=0;recordedSfx.edge=function(){old++;return rp.call(this);};time+=5;C46.edge({kind:'item',id:'cheese'});C46.edge({kind:'quake'});recordedSfx.edge=rp;out.prizeOld=old;
   C46.hit({kind:'gold5'},1);out.gold=p0();C46.hit({kind:'coin',rain:true},1);out.rain=p0();
   const gb={kind:'gold5',rb:{translation:()=>({x:0,y:0,z:0})}};wildRainCollected(gb,200);wildRainCollected(gb,200);out.goldEdge=p0();return out;})()`);
  const n=(o,k)=>(o[k]||0)+(o[k+'Current']||0);
  check('one coin over the edge keeps its current sound (the original edge code, coin-off)',r.single.oldEdge===1&&!n(r.single.plays,'spill'),r.single);
  check('three coins over the edge within 0.35 s play the current edge sound or a new spill',n(r.spill,'spill')===1,r.spill);
  check('ten or more within 1 s play the current edge sound or a new big cascade (right after the spill the first three started)',n(r.cascade,'cascade')===1,r.cascade);
  check('prizes and other pieces over the edge keep the old edge sounds',r.prizeOld===2);
  check("a gold coin's first landing plays the current clink or a gold sound, a rain coin's the current clink or a pile sound; gold paid at the front: the shimmer every other time",n(r.gold,'gold')===1&&n(r.rain,'pile')>n(r.gold,'pile')&&r.goldEdge.goldEdge===1,r);
  const rot=J(g,`(()=>{const out={};for(const set of ['pile','clink','spill','cascade','gold']){const c={},seq=[];for(let i=0;i<3000;i++){const k=C46.pick(set,true);seq.push(k);c[k]=(c[k]||0)+1;}
   out[set]={counts:c,repeats:seq.filter((k,i)=>i&&k===seq[i-1]).length};}return out;})()`);
  check('rotation: each pick is the current sound or a new variant, all of them come up about equally, never the same twice in a row',Object.entries(rot).every(([k,o])=>{const v=Object.values(o.counts),m=3000/v.length;return o.counts[-1]>0&&v.every(x=>Math.abs(x-m)<m*.25)&&o.repeats===0;}),rot);
  check('edge: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 // 4. frozen and untouched: the pickup sounds and the music are byte-identical to the base build
 {const a=await game({src,seed:3}),b=await game({src:base,seed:3});
  const names=['String(sfx.land)','String(sfx.clink)','String(recordedSfx.edge)','String(recordedSfx.play)','ledgeBell','pickupLandSound','queueTreatAward','tickTreatAwards','String(sfx.pickup)','String(sfx.bgm)','String(sfx.mus)','String(sfx.bgmBus)','bgmStep','bgmTick','bgmWanted','JSON.stringify(KAWAII.ev.length)','String(sfx.kaching)','String(sfx.drop)','String(sfx.tumble)','pusherSoundTick'];
  const diff=names.filter(n=>a.run('String('+n+')')!==b.run('String('+n+')'));
  check('untouched: the current coin landing, clink and edge sounds, the pickup (ledge bell, landing thump, the Pop), the music, ka-ching, the mouth drop, the stack tumble and the pusher timing are the same code as the base build',!diff.length,diff);
  check('the build label',/CP-46|UAT/.test(a.run('BUILD')),a.run('BUILD'));a.close();b.close();}
 // 5. sound off: nothing plays and nothing breaks
 {const g=await game({src,seed:3,render:true});const st=strictAudio(g);g.run('S.muted=true');const errs=[];play(g,140,errs);g.tap(200,400);play(g,40,errs);g.run('wildStartCountdown()');play(g,60*20,errs);
  check('sound off: no audio nodes and no errors in a round',!errs.length&&st.created===0&&g.run('C46.queued()')===0,{errs,created:st.created});g.close();}
 const res={build:src,base,passed:passed.length,failed:failed.length?failed:0,checks:passed};fs.writeFileSync(path.join(OUT,'checks-cp46.json'),JSON.stringify({...res,passed:!failed.length,failed},null,1));
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2);});
