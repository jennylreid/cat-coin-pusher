// ---- CP-107 change checks: node checks107.cjs [outDir] ----
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const TAPNOW="(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat,k=Math.floor(x);if(x-k<.12&&k>=0&&k<D.n&&!D.judged[k]&&!(D.rest&&D.rest[k]))danceTap({timeStamp:performance.now()+D.latency*1000})})()";
// a whole dance; extra(g,x) may tap at other moments; returns the start, the judging, sounds and the music events
async function dance(g,extra){g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();if(!g.run('!!WILD.dance'))return {started:false};
 const D0=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,taps:WILD.dance.taps||null,per:WILD.dance.per||1,siamese:!!WILD.dance.siamese,tortie:!!WILD.dance.tortie,quiet:WILD.dance.quiet||null,music:WILD.dance.music||null})'));
 g.run("if(typeof CP107!=='undefined')CP107.rec=[]");const faces={},seen=[];let j=0,prevF=null,switches=0;
 while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&j++<6000){g.run(TAPNOW);if(extra)extra(g,+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat'));g.tick();
  const f=g.run("String(typeof cp107Face==='function'?cp107Face():null)");faces[f]=(faces[f]||0)+1;if(f!==prevF){switches++;prevF=f;}}
 for(let i=0;i<400&&g.run('!!WILD.dance&&!WILD.dance.stage');i++)g.tick();
 const end=JSON.parse(g.run('JSON.stringify(WILD.dance&&{hits:WILD.dance.hits,misses:WILD.dance.misses,perfect:!!WILD.dance.perfect,stage:WILD.dance.stage||null})'));
 return {started:true,D0,end,faces,switches,rec:JSON.parse(g.run("JSON.stringify(typeof CP107!=='undefined'?CP107.rec:[])")),snd:JSON.parse(g.run('JSON.stringify(__snd)')),quiet:+g.run("typeof CP107!=='undefined'?CP107.stats.quiet:0"),errs:g.errs()};}
(async()=>{
 // --- Siamese ---
 {const g=await game(src,'level:siamese');const a=JSON.parse(g.run("JSON.stringify({dance:wildFeature('dance'),noteAt:WILD.noteAt,fishAt:WILD.fishAt,laser:!!WILD.laser})"));
  g.run('laserTweaks()');const b=JSON.parse(g.run("JSON.stringify({noteAt:WILD.noteAt,fishAt:WILD.fishAt,happy:WILD.happy})"));
  g.run('WILD.happy=0;danceFill(1,200);');const h1=+g.run('WILD.happy');g.run('danceFill(9,200);');for(let i=0;i<200&&!g.run('!!WILD.dance');i++)g.tick();
  const st=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,siamese:!!(WILD.dance&&WILD.dance.siamese)})"));g.close();
  check("S1 the Siamese's board has the Dance break: meter fills, music note scheduled (not switched off by Laser mode), fish stays off; a full meter starts the Siamese's dance",
   a.dance&&a.laser&&b.noteAt<900&&b.fishAt===999&&h1===1&&st.siamese,{a,b,h1,st});}
 {const g=await game(src,'level:siamese');const r=await dance(g);g.close();
  const yowls=r.rec.filter(e=>e[0]==='yowl').length,calls=JSON.parse(JSON.stringify([[0,4],[0,2,4],[0,2,4,5],[0,2,4,5,6]]));
  check("S2 Siamese structure: 4 rounds, the cat sings 2, 3, 4, 5 notes (14 yowls) and the player taps each phrase back in the next bar (14 taps); 112 BPM, half-beat grid",
   r.D0.siamese&&r.D0.n===64&&r.D0.taps===14&&r.D0.per===2&&yowls===14+1&&same(r.D0.quiet,[[0,7],[16,23],[32,39],[48,55]]),{D0:r.D0,yowls,note:'15 = 14 + the closing yowl'});
  check('S3 Siamese: every tap on time = a perfect dance and the wheel; faces switch only between Sharp/none and the singing face',r.end.perfect&&r.end.stage!==null&&r.faces.sing>0&&!r.errs.length,{end:r.end,faces:r.faces,errs:r.errs.length});}
 {const g=await game(src,'level:siamese');let sang=0;const done={};const r=await dance(g,(g,x)=>{const k=Math.floor(x);if((k===0||k===16)&&x-k<.12&&!done[k]){done[k]=1;sang++;g.run('danceTap({timeStamp:performance.now()+WILD.dance.latency*1000})');}});g.close();
  check('S4 Siamese: tapping along while the cat sings counts as off the beat ("Listen!") and costs the next tap: no perfect dance',sang===2&&r.quiet>=2&&!r.end.perfect&&r.end.misses>=2,{sang,quiet:r.quiet,end:r.end});}
 {const g=await game(src,'level:siamese');g.run("WILD.chasePending={f:null,wait:9};");let k=0;for(;k<300&&!g.run('!!WILD.chase');k++)g.tick();
  g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60;i++)g.tick();const during=JSON.parse(g.run("JSON.stringify({chase:!!WILD.chase,dance:!!WILD.dance,pending:!!WILD.dancePending})"));
  for(let i=0;i<2000&&g.run('!!WILD.chase');i++)g.tick();for(let i=0;i<200&&!g.run('!!WILD.dance');i++)g.tick();const after=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,siamese:!!(WILD.dance&&WILD.dance.siamese)})"));
  g.run("WILD.chasePending={f:null,wait:9};");for(let i=0;i<120;i++)g.tick();const chaseDuring=!!g.run('!!WILD.chase');g.close();
  const p=await game(src,'level:siamese');p.run("PG.powers.siamese=2;");for(let i=0;i<400&&!p.run('pgpReady()');i++)p.tick();p.run('pgpUse()');p.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30;i++)p.tick();
  const pw={px:p.run('PGPX&&(PGPX.power||PGPX.id)'),dance:!!p.run('!!WILD.dance')};for(let i=0;i<1500&&p.run('!!PGPX');i++)p.tick();for(let i=0;i<200&&!p.run('!!WILD.dance');i++)p.tick();pw.after=!!p.run('!!(WILD.dance&&WILD.dance.siamese)');pw.readyInDance=!!p.run('pgpReady()');p.close();
  check("S5 Siamese overlaps: the dance waits for Laser chase and for Sonic meow, then starts; Laser chase and the power wait for the dance",during.chase&&!during.dance&&during.pending&&after.siamese&&!chaseDuring&&String(pw.px).startsWith('sonic')&&!pw.dance&&pw.after&&!pw.readyInDance,{during,after,chaseDuring,pw});}
 // --- Tortie ---
 {const g=await game(src,'level:tortie');const a=JSON.parse(g.run("JSON.stringify({dance:wildFeature('dance'),noteAt:WILD.noteAt})"));g.run('WILD.happy=0;danceFill(1,200);');const h1=+g.run('WILD.happy');g.run('danceFill(9,200);');
  for(let i=0;i<200&&!g.run('!!WILD.dance');i++)g.tick();const st=!!g.run('!!(WILD.dance&&WILD.dance.tortie)');g.close();
  check("T1 the Tortie's board has the Dance break: meter fills, music note scheduled; a full meter starts the Tortie's dance",a.dance&&a.noteAt<900&&h1===1&&st,{a,h1,st});}
 {const g=await game(src,'level:tortie');g.run("globalThis.__ev={};const __L=cp107L;cp107L=function(k,v,d,a,dur){const D=WILD.dance;if(D){const s=Math.round((danceNow()+d+sfx.danceLatency()-D.p0)/D.beat);(__ev[s]||(__ev[s]=[])).push(k);}return __L.apply(this,arguments);}");
  const r=await dance(g);const perSlot=JSON.parse(g.run('JSON.stringify(__ev)'));g.close();
  const stops=r.D0.quiet||[];let inStop=[];for(const [a,b] of stops)for(let k=a;k<=b;k++)inStop.push([k,(perSlot[k]||[]).join('+')]);
  const silent=stops.every(([a,b])=>{for(let k=a;k<=b;k++){const ev=perSlot[k]||[];if(k===a?!(ev.includes('swish')&&ev.every(e=>e==='swish'||e==='tom')):ev.length)return false;}return true;});
  check("T2 Tortie structure: 8 bars, 26 taps, 4 stops; the band goes silent in every stop (only the swish at its start); 104 BPM, half-beat grid",r.D0.tortie&&r.D0.n===64&&r.D0.taps===26&&r.D0.per===2&&same(stops,[[12,15],[28,31],[42,47],[59,61]])&&silent,{D0:r.D0,silent,sample:inStop.slice(0,6)});
  check("T3 Tortie: every tap on time = a perfect dance and the wheel; Sharp Grin while she struts, Sweet while she looks away",r.end.perfect&&r.faces.strut>0&&r.faces.away>0&&!r.errs.length,{end:r.end,faces:r.faces,errs:r.errs.length});}
 {const r={};for(const [n,at] of [['onBeat',0],['between',.5]]){const g=await game(src,'level:tortie');const done={};
   r[n]=await dance(g,(g,x)=>{const k=Math.floor(x-at);if(k===13&&x-at-k<.12&&!done[k]){done[k]=1;g.run('danceTap({timeStamp:performance.now()+WILD.dance.latency*1000})');}});g.close();}
  check('T4 Tortie: a tap during a stop (on its silent beat, or between) counts as off the beat ("Not now!") and costs her next tap: no perfect dance',
   Object.values(r).every(x=>x.quiet>=1&&!x.end.perfect&&x.end.hits===25),Object.fromEntries(Object.entries(r).map(([n,x])=>[n,{quiet:x.quiet,end:x.end}])));}
 {const g=await game(src,'level:tortie');g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
  g.run("WILD.pouncePending={f:null,wait:9};");for(let i=0;i<120;i++)g.tick();const during={pounce:!!g.run('!!WILD.pounce'),pending:!!g.run('!!WILD.pouncePending')};
  for(let i=0;i<3000&&g.run('!!WILD.dance');i++)g.tick();for(let i=0;i<200&&!g.run('!!WILD.pounce');i++)g.tick();const after=!!g.run('!!WILD.pounce');
  g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60;i++)g.tick();const dDuring=!!g.run('!!WILD.dance');g.close();
  const p=await game(src,'level:tortie');p.run("PG.powers.tortie=2;");for(let i=0;i<400&&!p.run('pgpReady()');i++)p.tick();p.run('pgpUse()');p.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30;i++)p.tick();
  const pw={px:p.run('PGPX&&(PGPX.power||PGPX.id)'),dance:!!p.run('!!WILD.dance')};for(let i=0;i<2500&&p.run('!!PGPX');i++)p.tick();for(let i=0;i<200&&!p.run('!!WILD.dance');i++)p.tick();pw.after=!!p.run('!!(WILD.dance&&WILD.dance.tortie)');p.close();
  check("T5 Tortie overlaps: Mouse pounce waits for the dance (then starts); the dance waits for Mouse pounce and for Tortitude",!during.pounce&&during.pending&&after&&!dDuring&&pw.px&&!pw.dance&&pw.after,{during,after,dDuring,pw});}
 // --- music candidates and the pill ---
 {const r={};const ev=(g)=>g.run("globalThis.__ev={};const __L=cp107L;cp107L=function(k,v,d,a,dur){const D=WILD.dance;if(D){const s=Math.round((danceNow()+d+sfx.danceLatency()-D.p0)/D.beat);(__ev[s]||(__ev[s]=[])).push(k);}return __L.apply(this,arguments);}");
  for(const [cat,key] of [['siamese','catpusher.uat.cp107siam.v1'],['tortie','catpusher.uat.cp107tort.v1']])for(const m of ['A','B','C']){const g=await game(src,'level:'+cat,{store:{[key]:m}});ev(g);const x=await dance(g);const per=JSON.parse(g.run('JSON.stringify(__ev)'));g.close();
   let ok=true,bad=[];if(cat==='tortie'){for(const [a,b] of x.D0.quiet)for(let k=a;k<=b;k++){const e=per[k]||[];if(k===a?!(e.length&&e.every(z=>z==='swish'||z==='tom')):e.length){ok=false;bad.push([k,e.join('+')]);}}}
   else{for(let k=0;k<64;k++)if((k&15)<8){const e=per[k]||[];if(e.some(z=>['sq','pluck','marimba','blip'].includes(z))){ok=false;bad.push([k,e.join('+')]);}}}
   r[cat+' '+m]={music:x.D0.music,perfect:x.end.perfect,events:Object.values(per).reduce((n,e)=>n+e.length,0),ok,bad:bad.slice(0,4),errs:x.errs.length};}
  const distinct=['siamese','tortie'].every(c=>new Set(['A','B','C'].map(m=>r[c+' '+m].events)).size===3);
  check("M1 three music candidates per cat: each plays a full perfect dance; every Tortie track is silent in every stop (only the swish); the Siamese's tracks leave the cat's bar free of melody (room for the mews)",
   Object.entries(r).every(([n,x])=>x.music===n.split(' ')[1]&&x.perfect&&x.ok&&!x.errs)&&distinct,r);}
 {const g=await game(src,'level:tortie');g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
  let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<3.3&&j++<600){g.run(TAPNOW);g.tick();}
  const before=JSON.parse(g.run('JSON.stringify({m:WILD.dance.music,h:WILD.dance.hits,x:WILD.dance.misses,pill:!!cp107Pill(),build:BUILD})'));
  const sc=+g.run('scale'),Y=+g.run('DANCE_LANE_Y+52'),bx=+g.run('cp107PillRects()[1].x+17');g.pointer('pointerdown',bx*sc,Y*sc);g.pointer('pointerup',bx*sc,Y*sc);g.tick();
  const after=JSON.parse(g.run("JSON.stringify({m:WILD.dance.music,h:WILD.dance.hits,x:WILD.dance.misses,saved:localStorage.getItem('catpusher.uat.cp107tort.v1')})"));
  const prod=g.run("/\bUAT\b/.test('2026.11.21 CatCoin')");g.close();
  check('M2 the pill (UAT build): a tap on B switches the music at once and remembers it; it is never a dance tap; a production build name (no "UAT") has no pill',
   before.pill&&/\bUAT\b/.test(before.build)&&after.m==='B'&&after.saved==='B'&&after.h===before.h&&after.x===before.x&&prod===false,{before,after,prod});}
 // --- the other cats ---
 {const r={};for(const cat of ['tuxedo','orange','ragdoll']){const a=await game(base,'level:'+cat),b=await game(src,'level:'+cat);
   const x=await dance(a),y=await dance(b);a.close();b.close();r[cat]={same:same(x.D0,y.D0)&&same(x.end,y.end)&&same(x.snd,y.snd),snd:[x.snd.length,y.snd.length],end:[x.end,y.end]};}
  check("X1 the Tuxedo's, Orange's and Ragdoll's dances are identical to UAT 138 (start, judging, every sound)",Object.values(r).every(v=>v.same),r);}
 // --- stills ---
 for(const [W,H] of [[412,915],[360,640]]){const sz=W+'x'+H,errs={};
  for(const [cat,ats] of [['siamese',[4.3,9.1,52.3]],['tortie',[2.1,13.5,51]]]){const g=await game(src,'level:'+cat,{render:true,W,H});g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
   for(const x of ats){let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<x&&j++<3000)g.tick();g.png(`${cat}-x${x}-${sz}.png`);}errs[cat]=g.errs().length;g.close();}
  check(`X2 ${sz} stills of both dances render with no errors`,Object.values(errs).every(e=>!e),errs);}
 check('X production and UAT JSON untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks107.json'),JSON.stringify({passed,failed,res},null,1));console.log(passed.length+'/'+(passed.length+failed.length)+' pass');
})().catch(e=>{console.error(e);process.exit(1);});
