// UAT 141 regression copy of work/cp140-bundle/checks101r-reg140.cjs (make-reg.py).
// UAT 140 regression copy of work/cp138-bundle/checks101r-reg138.cjs (make-reg.py).
// UAT 138 regression copy of work/cp137-bundle/checks101r-reg137.cjs (make-reg.py).
// UAT 137 regression copy of work/cp136-towers/checks101r-reg136.cjs (make-reg.py).
// UAT 136 regression copy of work/cp135-bundle/checks101r-reg135.cjs (make-reg.py).
const __SELF=__dirname,__D130=require('path').resolve(__dirname,'../cp130');const __ok131=(()=>{const fs=require('fs'),c=require('crypto'),p=require('path');const m=JSON.parse(fs.readFileSync(p.join(__SELF,'publication-manifest.json'),'utf8'));return c.createHash('sha256').update(fs.readFileSync(p.join(__SELF,'release.html'))).digest('hex')===m.releaseHTMLSHA256&&m.displayName==='2026.11.21 UAT 141';})(); /* UAT 141: the published build */
// CP-101 Ragdoll dance change checks (on the build in release.html; base = release-version.json's base).
// 1 Ragdoll board: the Dance break is on; a forced start gives the waltz (18 beats, 11 taps, 96 BPM, 3/4) with track A
// 2 a perfect waltz (60 and 30 fps) is perfect and reaches the wheel
// 3 forgiving: every tap 0.12 s late or early still hits; 0.24 s off misses
// 4 tapping every beat (rests too) doesn't pay
// 5 Pet the cat and the Dance break never overlap (each waits for the other)
// 6 the Hug and the Dance break never overlap: no Hug during the dance; a dance due during the Hug waits, then starts
// 7 each music choice (A B C) schedules its own voices, a stop at the end, no errors
// 8 the Tuxedo's and the Orange's dances are unchanged (slots, judging, sounds, motion, tap for tap, against the base)
// 9 the Siamese and the Tortie still have no Dance break
// 10 production and the UAT channel untouched
// 11 the flop: both mitts float up then drop past the lift (the coin jolt); the Ragdoll's closed eyes on each flop, open while
//    it drifts back up
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs');
const D=path.resolve(__D130,'../cp129'); /* UAT 130 regression: everything else from work/cp129 */
const V=JSON.parse(fs.readFileSync(path.join(__D130,'release-version.json'))); /* UAT 130: base = UAT 129 */
const src=path.resolve(__SELF,'release.html'),base=path.resolve(D,'..',V.base,'release.html');
const root=path.resolve(D,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[];function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
async function game(file,{seed=7,cat='ragdoll',fps=60,store={}}={}){
 const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.cp137newprizes.v1':'0',...store}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=fps===60?()=>{ms+=1000/60;t();}:()=>{ms+=1000/30;g.run('step();step();update(1/30);');};g.ms=()=>ms;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)t();tap(200,700);for(let i=0;i<30;i++)t();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<240;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;globalThis.__snd=[];for(const f of ['danceLoud','cp94Loud','dance']){const o=sfx[f];if(o)sfx[f]=function(k,v,d,a){__snd.push([f,k,+(+v).toFixed(3),+(+a||0).toFixed(2)]);return o.apply(this,arguments);};}");
 return g;}
const tapAt="(off)=>{const D=WILD.dance;danceTap({timeStamp:performance.now()+(D.latency-off)*1000});}";
// run a dance; plan(k) -> offset in s to tap slot k at (null: no tap); also records motion and judgements
async function runDance(g,plan,{rec=false}={}){g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
 const D0=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,beat:WILD.dance.beat,per:WILD.dance.per||1,taps:WILD.dance.taps||WILD.dance.n,orange:!!WILD.dance.orange,music:WILD.dance.music||null,rest:Object.keys(WILD.dance.rest||{}).map(Number).filter(k=>k>=0)})'));
 const todo=[];for(let k=-3*D0.per;k<D0.n+1;k++){const o=plan(k,D0);if(o!=null)todo.push([k,o]);}
 const mot=[];let guard=0;
 while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&guard++<3000){
  const x=+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat'),beat=D0.beat;
  while(todo.length&&x*beat>=todo[0][0]*beat+todo[0][1]){const [k,o]=todo.shift();const late=x*beat-k*beat;g.run(`(${tapAt})(${(late-o).toFixed(4)})`);}
  if(rec)mot.push(g.run('JSON.stringify([+((danceNow()-WILD.dance.p0)/WILD.dance.beat).toFixed(3),pawMotion(-1),pawMotion(0),pawMotion(1),typeof cp94Grin==="function"?cp94Grin():false])'));
  g.tick();}
 const end=JSON.parse(g.run('JSON.stringify(WILD.dance?{hits:WILD.dance.hits,misses:WILD.dance.misses,perfect:!!WILD.dance.perfect,stage:WILD.dance.stage||null,judged:WILD.dance.judged,bank:WILD.dance.bank}:null)'));
 let stages=[];for(let i=0;i<900&&g.run('!!WILD.dance');i++){const s=g.run('WILD.dance&&WILD.dance.stage||""');if(s&&stages[stages.length-1]!==s)stages.push(s);g.tick();}
 return {D0,end,stages,mot,snd:JSON.parse(g.run('JSON.stringify(__snd)')),errs:JSON.parse(g.run('JSON.stringify(__errs)'))};}
const onTap=(off=0)=>(k,D)=>k>=0&&k<D.n&&!D.rest.includes(k)?off:null;
const ERRS=g=>JSON.parse(g.run('JSON.stringify(__errs)'));
(async()=>{
 {const g=await game(src);const f=JSON.parse(g.run("JSON.stringify({dance:wildFeature('dance'),board:cp101Board(),mode:WILD.mode,noteAt:WILD.noteAt})"));
  g.run("WILD.happy=DANCE.notches-1;danceFill(1,200);");const pend=g.run('!!WILD.dancePending');
  const r=await runDance(g,onTap(0));
  check('1 Ragdoll board: Dance break on, the waltz (18 beats, 11 taps, 96 BPM) with track A',f.dance&&f.board&&pend&&r.D0.n===18&&r.D0.taps===11&&Math.abs(r.D0.beat-60/96)<1e-9&&r.D0.music==='A'&&r.D0.rest.length===7&&!r.D0.orange&&!r.errs.length,{f,pend,D0:r.D0,errs:r.errs});g.close();}
 for(const fps of [60,30]){const g=await game(src,{fps});const r=await runDance(g,onTap(0));
  check('2 perfect waltz -> wheel ('+fps+' fps)',r.end&&r.end.hits===11&&r.end.misses===0&&r.end.perfect&&r.stages.includes('wheel'),{end:r.end&&{hits:r.end.hits,misses:r.end.misses,perfect:r.end.perfect},stages:r.stages,errs:r.errs});g.close();}
 {const res={};for(const off of [.12,-.12,.24]){const g=await game(src);const r=await runDance(g,onTap(off));res[off]={hits:r.end.hits,misses:r.end.misses};g.close();}
  check('3 forgiving: +-0.12 s all hit; 0.24 s off misses',res["0.12"].hits===11&&res["-0.12"].hits===11&&res["0.24"].hits<11,res);}
 {const g=await game(src);const r=await runDance(g,(k,D)=>k>=0&&k<D.n?0:null);check('4 tapping every beat does not pay',!r.end.perfect&&r.end.misses>0,{hits:r.end.hits,misses:r.end.misses});g.close();}
 {const g=await game(src);g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
  g.run("WILD.petPending={f:null,wait:9};");for(let i=0;i<60;i++)g.tick();const a=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,pet:!!WILD.petGame})"));
  let i=0;while(g.run('!!WILD.dance')&&i++<3000)g.tick();for(let j=0;j<300&&!g.run('!!WILD.petGame');j++)g.tick();const b=g.run('!!WILD.petGame');
  g.run("WILD.dancePending={f:null,wait:9};");for(let j=0;j<60;j++)g.tick();const c=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,pet:!!WILD.petGame})"));
  check('5 Pet the cat and the Dance break wait for each other',a.dance&&!a.pet&&b&&c.pet&&!c.dance,{a,b,c,errs:ERRS(g)});g.close();}
 {const g=await game(src);g.run("PG.powers=PG.powers||{};PG.powers.ragdoll=2;WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
  const a=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,ready:pgpReady()})"));let i=0;while(g.run('!!WILD.dance')&&i++<3000)g.tick();for(let j=0;j<400&&!g.run('pgpReady()');j++)g.tick();
  g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");for(let j=0;j<5;j++)g.tick();const hug=g.run("PGPX?PGPX.id:null");
  g.run("WILD.dancePending={f:null,wait:9};");for(let j=0;j<30;j++)g.tick();const during=g.run('!!WILD.dance');
  let k=0;while(g.run('!!PGPX')&&k++<3000)g.tick();for(let j=0;j<120&&!g.run('!!WILD.dance');j++)g.tick();const after=g.run('!!WILD.dance');
  check('6 the Hug and the Dance break never overlap (no Hug during the dance; a dance due during the Hug waits, then starts)',a.dance&&!a.ready&&!!hug&&!during&&after,{a,hug,during,after,errs:ERRS(g)});g.close();}
 {const res={};for(const m of ['A','B','C']){const g=await game(src,{store:{'catpusher.uat.cp101music.v1':m}});const r=await runDance(g,onTap(0));
  const kinds=[...new Set(r.snd.filter(s=>s[0]==='cp94Loud').map(s=>s[1]))].sort();res[m]={music:r.D0.music,kinds,stop:r.snd.some(s=>s[1]==='stopF'),tux:r.snd.filter(s=>s[0]==='danceLoud').length,errs:r.errs.length,hits:r.end.hits};g.close();}
  check('7 (UAT 133, Jenny) the Ragdoll plays A (Music box) whatever was saved (A, B or C): same voices, a stop, no errors',['A','B','C'].every(m=>res[m].music==='A'&&res[m].stop&&!res[m].tux&&!res[m].errs&&res[m].hits===11)&&res.A.kinds.join()===res.B.kinds.join()&&res.B.kinds.join()===res.C.kinds.join(),res);}
 {const out={};for(const cat of ['tuxedo','orange']){const plan=(k,D)=>k>=-3*D.per&&k<D.n?[0,.05,-.04,.1,.2,null,.13,-.09][((k%8)+8)%8]:null,o={};
   for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,{cat,store:(n==='base'&&cat==='orange')?{'catpusher.uat.cp94music.v1':'B'}:{}}); /* UAT 133: the Orange's pick is B; the base plays B too */o[n]=await runDance(g,plan,{rec:true});g.close();}
   out[cat]={same:JSON.stringify(o.base.D0)===JSON.stringify(o.new.D0)&&JSON.stringify(o.base.end)===JSON.stringify(o.new.end)&&JSON.stringify(o.base.snd)===JSON.stringify(o.new.snd)&&JSON.stringify(o.base.mot)===JSON.stringify(o.new.mot),hits:[o.base.end.hits,o.new.end.hits],snd:[o.base.snd.length,o.new.snd.length],frames:[o.base.mot.length,o.new.mot.length]};}
  check('8 the Tuxedo and Orange dances are identical to the base (Orange: UAT 132 playing B, the pick) (slots, judging, sounds, motion)',out.tuxedo.same&&out.orange.same,out);}
 {const res={};for(const c of ['siamese','tortie']){const g=await game(src,{cat:c});res[c]=g.run("wildFeature('dance')");g.close();}
  check('9 the Siamese and the Tortie have their Dance breaks (UAT 141: CP-107)',res.siamese&&res.tortie,res);}
 {const g=await game(src);g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
  const tr=[];let guard=0;while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&guard++<3000){tr.push(JSON.parse(g.run('JSON.stringify([+((danceNow()-WILD.dance.p0)/WILD.dance.beat).toFixed(3),pawMotion(-1).y,pawMotion(1).y,petSquint()])')));g.tick();}
  const at=x=>tr.reduce((b,r)=>Math.abs(r[0]-x)<Math.abs(b[0]-x)?r:b,tr[0]);
  const flops=[3,6,9,12,15].map(k=>({k,before:at(k-.3),on:at(k+.1),later:at(k+1.6)}));
  const ok=flops.every(f=>f.before[1]<-20&&f.on[1]>20&&f.on[3]===1&&f.later[3]===0)&&tr.every(r=>r[3]===0||r[3]===1);
  check('11 each flop after the first (which comes straight out of the count-in): mitts up (lift > 20) then limp past the drop (the coin jolt); closed eyes on the flop, open while drifting up (no in-between)',ok,flops.map(f=>[f.k,+f.before[1].toFixed(0),+f.on[1].toFixed(0),f.on[3],f.later[3]]));g.close();}
 check('10 production and the UAT channel untouched by this run (no file writes; a change means another publish ran meanwhile)',sha(prodJ)===prod0&&sha(uatJ)===uat0,{prodChanged:sha(prodJ)!==prod0,uatChanged:sha(uatJ)!==uat0});
 {const out=path.resolve(D,'../../tickets/CP-96-evidence/uat'+V.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'checks101r-reg141.json'),JSON.stringify({build:src,passed:failed.length===0,passedChecks:passed,failed},null,1));}
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
