// ---- Dance beat A/B change checks: node checks-beat.cjs [outDir] ----
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const CATS=['tuxedo','orange','ragdoll','siamese','tortie'];
const DRUMS=['kick','snare','clap','hat','crash','chipsnare','shaker','clave','cowbell','conga','tom'];
const TAPNOW="(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat,k=Math.floor(x);if(x-k<.12&&k>=0&&k<D.n&&!D.judged[k]&&!(D.rest&&D.rest[k]))danceTap({timeStamp:performance.now()+D.latency*1000})})()";
async function run(file,cat,mode){const g=await game(file,'level:'+cat,{store:mode?{'catpusher.uat.dancebeat.v1':mode}:{}});
 g.run("globalThis.__vib=[];if(typeof navigator==='undefined')globalThis.navigator={};navigator.vibrate=function(ms){__vib.push(ms);return true;};if(typeof BEATAB!=='undefined')BEATAB.rec=[];");
 g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();g.run("__vib.length=0");
 const D0=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,taps:WILD.dance.taps||WILD.dance.n})'));let j=0;
 while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&j++<6000){g.run(TAPNOW);g.tick();}
 const end=JSON.parse(g.run('JSON.stringify(WILD.dance&&{hits:WILD.dance.hits,misses:WILD.dance.misses})'));
 const r={D0,end,snd:JSON.parse(g.run('JSON.stringify(__snd)')),rec:JSON.parse(g.run("JSON.stringify(typeof BEATAB!=='undefined'?BEATAB.rec:[])")),vib:JSON.parse(g.run('JSON.stringify(__vib)')),errs:g.errs()};g.close();return r;}
(async()=>{
 // A (default, and chosen) = today, all five dances
 {const r={};for(const cat of CATS){const a=await run(base,cat),b=await run(src,cat),c=await run(src,cat,'A');
   r[cat]={same:same(a.D0,b.D0)&&same(a.end,b.end)&&same(a.snd,b.snd)&&same(b.snd,c.snd)&&same(b.end,c.end),vib:[b.vib.length,c.vib.length],snd:a.snd.length,errs:b.errs.length+c.errs.length};}
  check("B1 Beat A (the default, and when picked) is today: all five dances identical to the base (start, judging, every sound) and no buzz on taps",Object.values(r).every(x=>x.same&&!x.vib[0]&&!x.vib[1]&&!x.errs),r);}
 {const a=await run(base140,'orange'),b=await run(src140,'orange');check('B1b on UAT 140 alone (without CP-107) the block runs and A is identical too',same(a.snd,b.snd)&&same(a.end,b.end)&&!b.errs.length,{snd:[a.snd.length,b.snd.length]});}
 // B: only the drum layer fades; count-in and the first bar full; 35% from the end of the second bar
 {const r={};for(const cat of CATS){const a=await run(src,cat,'A'),b=await run(src,cat,'B');
   let ok=a.rec.length===b.rec.length,mel=true,mono=true,first=0,last=null,min=1,prev=1;const per=[];
   for(let i=0;i<Math.min(a.rec.length,b.rec.length);i++){const [ka,va]=a.rec[i],[kb,vb]=b.rec[i];if(ka!==kb){ok=false;break;}
    if(!DRUMS.includes(ka)){if(Math.abs(va-vb)>1e-6)mel=false;continue;}if(!(va>0))continue;const q=vb/va;per.push(+q.toFixed(3));if(q>prev+.02)mono=false;prev=Math.min(prev,q);min=Math.min(min,q);if(Math.abs(q-1)<1e-3)first++;last=q;}
   r[cat]={sameEvents:ok,melodyUntouched:mel,fadesOnlyDown:mono,fullAtStart:first,end:last&&+last.toFixed(3),min:+min.toFixed(3),hits:b.end.hits,taps:b.D0.taps,errs:b.errs.length};}
  check("B2 Beat B: the same notes as A; the melody, bass and voices untouched; the drum layer full through the count-in and first bar, then fades (only down) to 35% and stays there; every tap still scores",
   Object.values(r).every(x=>x.sameEvents&&x.melodyUntouched&&x.fadesOnlyDown&&x.fullAtStart>=1&&Math.abs(x.end-.35)<.01&&Math.abs(x.min-.35)<.01&&x.hits===x.taps&&!x.errs),r);}
 // B: the buzz
 {const r={};for(const cat of CATS){const b=await run(src,cat,'B');r[cat]={hits:b.end.hits,vib:b.vib.length,kinds:[...new Set(b.vib)]};}
  check("B3 Beat B: one buzz per hit, no more (never on beats without a tap); on-the-dot taps get the stronger 28 ms",Object.values(r).every(x=>x.vib===x.hits&&x.kinds.every(k=>k===28||k===12)),r);}
 {const g=await game(src,'level:tuxedo',{store:{'catpusher.uat.dancebeat.v1':'B'}});g.run("globalThis.__vib=[];if(typeof navigator==='undefined')globalThis.navigator={};navigator.vibrate=function(ms){__vib.push(ms);return true;};");
  g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();g.run("__vib.length=0");
  const tapAt=(slot,off)=>{let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<slot&&j++<2000)g.tick();g.run(`danceTap({timeStamp:performance.now()+WILD.dance.latency*1000+${off}*1000})`);return JSON.parse(g.run('JSON.stringify(__vib)'));};
  const onDot=tapAt(1,0).slice(),late=tapAt(2,.11).slice(),off=tapAt(3.5,0).slice();g.close();
  check('B4 Beat B: on the dot = 28 ms, late but inside the window = 12 ms, off the beat = no buzz',same(onDot,[28])&&same(late,[28,12])&&same(off,[28,12]),{onDot,late,off});}
 // the pill
 {const g=await game(src,'level:tuxedo');g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
  let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<1.3&&j++<600){g.run(TAPNOW);g.tick();}
  const before=JSON.parse(g.run('JSON.stringify({m:BEATAB.get(),h:WILD.dance.hits,x:WILD.dance.misses,pill:beatabPill(),build:BUILD})'));
  const sc=+g.run('scale'),R=JSON.parse(g.run('JSON.stringify(beatabRects())')),b=R.b[1],px=(b.x+b.w/2)*sc,py=(b.y+b.h/2)*sc;g.pointer('pointerdown',px,py);g.pointer('pointerup',px,py);g.tick();
  const after=JSON.parse(g.run("JSON.stringify({m:BEATAB.get(),h:WILD.dance.hits,x:WILD.dance.misses,saved:localStorage.getItem('catpusher.uat.dancebeat.v1')})"));
  const fake=n=>g.run("(new Function('BUILD','return ('+beatabPillOn.toString()+')()'))("+JSON.stringify(n)+")");const prod=fake('2026.11.21 CatCoin')===false&&fake('2026.11.21 UAT 141')===true;g.close();
  check('B5 the pill (UAT build): a tap on B switches at once and is remembered; never a dance tap; a production build name (no "UAT") has no pill',
   before.pill&&before.m==='A'&&after.m==='B'&&after.saved==='B'&&after.h===before.h&&after.x===before.x&&prod===true,{before,after,prod});}
 // stills
 for(const [W,H] of [[412,915],[360,640]]){const sz=W+'x'+H,errs={};
  for(const cat of ['tuxedo','siamese']){const g=await game(src,'level:'+cat,{render:true,W,H,store:{'catpusher.uat.dancebeat.v1':'B'}});g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
   let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<(cat==='siamese'?9.1:2.1)&&j++<3000)g.tick();g.png(`beat-${cat}-${sz}.png`);errs[cat]=g.errs().length;g.close();}
  check(`B6 ${sz} stills (Tuxedo; Siamese with CP-107's cue and music pill) render with no errors`,Object.values(errs).every(e=>!e),errs);}
 check('X production and UAT JSON untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks-beat.json'),JSON.stringify({passed,failed,res},null,1));console.log(passed.length+'/'+(passed.length+failed.length)+' pass');
})().catch(e=>{console.error(e);process.exit(1);});
