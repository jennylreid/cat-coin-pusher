// CP-94 Orange dance change checks (on the build in release.html; base = release-version.json's base).
// 1 Orange board: the Dance break is on (meter, music-note coin); a forced start gives the Orange's dance (32 half-beat slots,
//   18 taps, rests, 100 BPM) with the chosen track
// 2 a perfect Orange dance (every tap slot on time, 60 and 30 fps) is perfect and reaches the wheel
// 3 forgiving: every tap 0.12 s late or early still hits; a tap 0.22 s off is a miss
// 4 tapping every half beat (rests too) doesn't pay: not perfect, misses counted, hits < 18
// 5 Treat toss and the Dance break never overlap (each waits for the other); the CP-88 slot refuses during the dance
// 6 the meter sits right of the Treat toss slot (no overlap) on the Orange's board; unchanged on the Tuxedo's
// 7 each music choice (A B C) schedules its own voices, a stop at the end, no errors
// 8 the Tuxedo's Dance break is unchanged: same slots, judging, sound calls and motion as the base, tap for tap
// 9 the other cats' boards still have no Dance break
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'..',V.base,'release.html');
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[];function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
async function game(file,{seed=7,cat='orange',fps=60,store={}}={}){
 const g=await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1',...store}});
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
(async()=>{
 // 1
 {const g=await game(src);const f=JSON.parse(g.run("JSON.stringify({dance:wildFeature('dance'),toss:wildFeature('toss'),board:cp94Board(),noteAt:WILD.noteAt})"));
  g.run("WILD.happy=DANCE.notches-1;danceFill(1,200);");const pend=g.run('!!WILD.dancePending');
  const r=await runDance(g,onTap(0));check('1 Orange board: Dance break on, the Orange dance (32 slots, 19 taps, 108 BPM) with track A',f.dance&&f.toss&&f.board&&pend&&r.D0.orange&&r.D0.n===32&&r.D0.taps===19&&Math.abs(r.D0.beat-60/108/2)<1e-9&&r.D0.music==='A'&&r.D0.rest.length===13&&!r.errs.length,{f,pend,D0:r.D0,errs:r.errs});g.close();}
 // 2
 for(const fps of [60,30]){const g=await game(src,{fps});const r=await runDance(g,onTap(0));
  check('2 perfect Orange dance -> wheel ('+fps+' fps)',r.end&&r.end.hits===19&&r.end.misses===0&&r.end.perfect&&r.stages.includes('wheel'),{end:r.end&&{hits:r.end.hits,misses:r.end.misses,perfect:r.end.perfect},stages:r.stages,errs:r.errs});g.close();}
 // 3
 {const res={};for(const off of [.12,-.12,.22]){const g=await game(src);const r=await runDance(g,onTap(off));res[off]={hits:r.end.hits,misses:r.end.misses};g.close();}
  check('3 forgiving: ±0.12 s all hit; 0.22 s off misses',res["0.12"].hits===19&&res["-0.12"].hits===19&&res["0.22"].hits<12,res);}
 // 4
 {const g=await game(src);const r=await runDance(g,(k,D)=>k>=0&&k<D.n?0:null);check('4 tapping every half beat does not pay',!r.end.perfect&&r.end.misses>0&&r.end.hits<19,{hits:r.end.hits,misses:r.end.misses});g.close();}
 // 5
 {const g=await game(src);g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
  g.run("WILD.tossPending={f:null,wait:9};CP88.bank.fish=1;");for(let i=0;i<60;i++)g.tick();const a=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,toss:!!WILD.toss,ready:cp88Ready()})"));
  let i=0;while(g.run('!!WILD.dance')&&i++<2000)g.tick();for(let j=0;j<200&&!g.run('!!WILD.toss');j++)g.tick();const b=g.run('!!WILD.toss');
  g.run("WILD.dancePending={f:null,wait:9};");for(let j=0;j<60;j++)g.tick();const c=JSON.parse(g.run("JSON.stringify({dance:!!WILD.dance,toss:!!WILD.toss})"));
  check('5 Treat toss and the Dance break wait for each other; the slot refuses during the dance',a.dance&&!a.toss&&!a.ready&&b&&c.toss&&!c.dance,{a,b,c,errs:JSON.parse(g.run('JSON.stringify(__errs)'))});g.close();}
 // 6
 {const g=await game(src);const o=JSON.parse(g.run("(()=>{const hud=hudLayout(),x0=W-Math.max(8,hud.right+10)-124,s=cp88Btn(),sh=danceMeterShift();return JSON.stringify({x0,shift:sh,meterL:x0+sh,slotR:s.x+s.w,shown:cp88Shown()})})()"));g.close();
  const t=await game(src,{cat:'tuxedo'});const tx=+t.run("danceMeterShift()");t.close();
  check('6 the meter is right of the Treat toss slot (Orange), unmoved (Tuxedo)',o.meterL>=o.slotR+4&&tx===0,{o,tx});}
 // 7
 {const res={};for(const m of ['A','B','C']){const g=await game(src,{store:{'catpusher.uat.cp94music.v1':m}});const r=await runDance(g,onTap(0));
  const kinds=[...new Set(r.snd.filter(s=>s[0]==='cp94Loud').map(s=>s[1]))].sort();res[m]={music:r.D0.music,kinds,stop:r.snd.some(s=>s[1]==='stopF'),tux:r.snd.filter(s=>s[0]==='danceLoud').length,errs:r.errs.length,hits:r.end.hits};g.close();}
  check('7 music choices A B C each play their own voices and a stop',['A','B','C'].every(m=>res[m].music===m&&res[m].stop&&!res[m].tux&&!res[m].errs&&res[m].hits===19)&&res.A.kinds.join()!==res.B.kinds.join()&&res.B.kinds.join()!==res.C.kinds.join(),res);}
 // 8
 {const plan=(k,D)=>k>=-3&&k<D.n?[0,.05,-.04,.1,.2,null,.13,-.09][((k%8)+8)%8]:null,out={};
  for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,{cat:'tuxedo'});out[n]=await runDance(g,plan,{rec:true});g.close();}
  const same=JSON.stringify(out.base.D0)===JSON.stringify(out.new.D0)&&JSON.stringify(out.base.end)===JSON.stringify(out.new.end)&&JSON.stringify(out.base.snd)===JSON.stringify(out.new.snd)&&JSON.stringify(out.base.mot.map(m=>JSON.parse(m).slice(0,4)))===JSON.stringify(out.new.mot.map(m=>JSON.parse(m).slice(0,4)));
  check('8 the Tuxedo dance is identical to the base (slots, judging, sounds, motion)',same&&!out.new.D0.orange,{D0:out.new.D0,hits:[out.base.end.hits,out.new.end.hits],snd:[out.base.snd.length,out.new.snd.length],frames:[out.base.mot.length,out.new.mot.length]});}
 // 9
 {const res={};for(const c of ['ragdoll','siamese','tortie']){const g=await game(src,{cat:c});res[c]=g.run("wildFeature('dance')");g.close();}
  const resB={};for(const c of ['ragdoll','siamese','tortie']){const g=await game(base,{cat:c});resB[c]=g.run("wildFeature('dance')");g.close();}
  check('9 other cats unchanged (Dance break as on the base)',JSON.stringify(res)===JSON.stringify(resB),{res,resB});}
 // 11 CP-98: each cat's happy face (Treat toss) uses its own CP-75 closed eyes; the Tuxedo as before
 {const probe=`(()=>{const A=CP75_ART[CP75_CAT];if(A&&!A.eyes)A.eyes={cp98:CP75_CAT};if(!ART.happyMouth)ART.happyMouth={mouth:1};const out=[],d=ctx.drawImage,e=ctx.ellipse;
   ctx.drawImage=function(im){out.push(A&&im===A.eyes?CP75_CAT+'Eyes':im===ART.happyMouth?'mouth':'other');return d.apply(this,arguments);};
   let ell=0;ctx.ellipse=function(){ell++;return e.apply(this,arguments);};try{drawHappyFeatures();}finally{ctx.drawImage=d;ctx.ellipse=e;}return JSON.stringify({cat:CP75_CAT,out,ell});})()`;
  const res={},cats=['orange','ragdoll','siamese','tortie'];for(const c of [...cats,'tuxedo']){const g=await game(src,{cat:c});for(let i=0;i<30;i++)g.tick();res[c]=JSON.parse(g.run(probe));g.close();}
  {const g=await game(base,{cat:'tuxedo'});for(let i=0;i<30;i++)g.tick();res.tuxedoBase=JSON.parse(g.run(probe));g.close();}
  check("11 CP-98 each cat's happy face draws its own closed eyes (no black patches); the Tuxedo unchanged",
   cats.every(c=>res[c].cat===c&&res[c].out.join()===c+'Eyes,mouth'&&res[c].ell===0)&&JSON.stringify(res.tuxedo)===JSON.stringify(res.tuxedoBase)&&res.tuxedo.ell===2,res);}
 check('10 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 {const out=path.resolve(__dirname,'../../tickets/CP-94-evidence/uat'+V.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
  fs.writeFileSync(path.join(out,'checks94o.json'),JSON.stringify({build:src,passed:failed.length===0,passedChecks:passed,failed},null,1));}
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
