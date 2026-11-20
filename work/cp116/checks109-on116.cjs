// CP-83 checks for UAT 109: round 2 + round 3 (Pusher chains, direction A) + Home > Board lab (copied into the UAT build folder as checks<NNN>.cjs; reads that folder's release-version.json and
// edits.json). Usage: node checks<NNN>.cjs -> tickets/CP-83-evidence/uat<NNN>/checks<NNN>.json
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {game}=require('../cp43/harness.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))),U=V.displayName.split(' ').pop();
const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(E.base),out=path.resolve(__dirname,'../../tickets/CP-86-evidence/uat'+U);fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const OVER="b.rb.setTranslation({x:200*M,y:b.rb.translation().y,z:(T.FRONT+5)*M},true);fallOff(b,200);";
async function boot(file,seed,store={}){const g=await game({src:file,seed,render:false,storage:store});
 g.run('S.muted=true;S.dev=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
const STATE="bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,b.id||'',Math.round(q.x*1e4),Math.round(q.y*1e4),Math.round(q.z*1e4)]})";
async function levelRun(file,lv,seed,cat,store){const g=await boot(file,seed,store);
 g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lv-1});PG.lv.sel=${lv};pgPlay('${cat}');wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);
 const tr=[];for(let i=0;i<900;i++){if(i%24===0)g.run(`tryDrop({x:${Math.round(200+84*Math.sin(i/37))},y:DROP_Y})`);g.tick();if(i%30===0)tr.push(J(g,`[${STATE},S.coins,Math.round(WILD.left*100),WILD.got]`));}
 const r={trace:JSON.stringify(tr),errs:J(g,'__errs').length,stacks:J(g,'bodies.filter(b=>!b.dead&&b.kind==="stack").length'),name:J(g,'pglOn()&&pglOn().name')};g.close&&g.close();return r;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp115/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='299a5f1440762d81e8b0a088a4c5bea289fa1cdb160c9b86b799cd5ddb718861')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 115 + build name + 4 CP-86 mitts final edits + cp86-final.js (everything else unchanged)',S===B&&m.length===1);}
 // 1. lab off and Tower fall "Today" (the defaults): normal play identical to the base on levels with towers
 {const runs=[];let ok=true;for(const [lv,cat,seed] of [[3,'tuxedo',1],[6,'orange',2],[8,'ragdoll',1]]){const a=await levelRun(src,lv,seed,cat,{}),b=await levelRun(base,lv,seed,cat,{});
   const same=a.trace===b.trace&&!a.errs&&!b.errs;runs.push({lv,cat,seed,name:a.name,same});if(!same)ok=false;}
  check('1 defaults (Board lab off, Tower fall Today): Levels 3/6/8 with Tuxedo/Orange/Ragdoll, 900 frames of play with taps, every piece every 0.5 s identical to the base; no frame errors',ok,runs);}
 // 2. Tower fall Topple on Level 6: the towers come down on the board; Today: they mostly stand
 {const r={};for(const m of ['today','topple']){const g=await boot(src,2,{'catpusher.uat.cp83tower.v1':m});
   g.run(`PG.lv.passed=5;PG.lv.sel=6;pgPlay('tuxedo');wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);g.run('wildFinish=function(){};S.coins=9999;WILD.left=9999;');
   const n0=J(g,'bodies.filter(b=>!b.dead&&b.kind==="stack").length');for(let s=0;s<60;s++){g.run(`tryDrop({x:${Math.round(200+84*Math.sin(s*.77+2))},y:DROP_Y})`);g.ticks(24);}g.ticks(300);
   r[m]={towers:n0,standing:J(g,'bodies.filter(b=>!b.dead&&b.kind==="stack").length'),stats:J(g,'LABT.stats'),errs:J(g,'__errs').length,mode:J(g,'LABT.get()')};g.close&&g.close();}
  notes.tower=r;check('2 Tower fall: Topple brings Level 6\'s towers down on the board (Today '+(r.today.towers-r.today.standing)+' of '+r.today.towers+', Topple '+(r.topple.towers-r.topple.standing)+' of '+r.topple.towers+', '+r.topple.stats.bursts+' burst on the board); saved choice read back; no frame errors',
   r.topple.mode==='topple'&&r.today.mode==='today'&&r.topple.towers-r.topple.standing>=4&&r.topple.stats.bursts>=3&&!r.today.stats.tips&&!r.topple.errs&&!r.today.errs,r);}
 // 3-6. round-2 boards: start, pieces, budget, goals; pieces gone after Off
 {const g=await boot(src,3);const lv0=J(g,'PG.lv');const rows=[];let ok3=true,ok4=true,ok5=true;
  for(const k of ['lanes','cup','bumper','gate']){g.run(`labStart('${k}')`);const inPlay=g.until("WILD.phase==='play'",900);g.ticks(20);
   const s=J(g,`{on:LAB.on(),left:LAB.st.left,budget:LAB.def().budget,cols:LAB2.cols.length,clock:wildClock(),extras:!cp50Lv1(),timer:WILD.left>500}`);
   const want={lanes:2,cup:0,bumper:1,gate:1}[k];if(!(inPlay&&s.on&&s.left===s.budget&&s.cols===want&&s.clock===s.budget+' drops'&&s.extras&&s.timer))ok3=false;
   const G=J(g,'LAB.def().lab');
   if(G.kind==='collect')g.run(`for(const b of bodies.filter(b=>!b.dead&&b.kind==='item'&&WILD_COLLECTION.includes(b.id))){${OVER}}`);
   else if(G.kind==='cup')for(let i=0;i<G.n;i++){g.run(`{const C=LAB.def().cup,b=bodies.find(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')&&b.rb.translation().y/M<COIN_HALF*2);b.rb.setTranslation({x:C.x*M,y:(COIN_HALF+.2)*M,z:C.z*M},true);}`);g.ticks(3);}
   else if(G.kind==='bump')for(let i=0;i<G.n;i++){g.run(`{const B=LAB.def().bumpers[0],b=bodies.find(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')&&!b.lab2Bumped&&b.rb.translation().z/M>500);b.rb.setTranslation({x:(B.x+B.r+COIN_R)*M,y:(COIN_HALF+.2)*M,z:B.z*M},true);}`);g.ticks(3);}
   g.ticks(2);const w0=J(g,'{pending:LAB.st.pending,got:LAB.st.got,phase:WILD.phase}');g.ticks(150);const w2=J(g,'{phase:WILD.phase,win:WILD.win}');
   if(!(w0.pending&&w0.phase==='play'&&w2.phase==='end'&&w2.win))ok4=false;rows.push({k,...s,w0,w2});}
  // budget runs out: a round that uses all its drops without the goal ends as out of coins
  g.run(`labStart('cup')`);g.until("WILD.phase==='play'",900);let n=0;for(let i=0;i<40;i++){g.run('tryDrop({x:280,y:DROP_Y})');g.ticks(20);}
  const bud=J(g,'{left:LAB.st.left,released:board.released,phase:WILD.phase,why:WILD.reason,got:LAB.st.got}');g.ticks(400);const bud2=J(g,'{phase:WILD.phase,why:WILD.reason,win:WILD.win,got:LAB.st.got}');
  if(!(bud.left===0&&bud.released===18&&((bud2.phase==='end'&&bud2.why==='coins'&&!bud2.win)||bud2.win)))ok5=false;
  // Off: pieces gone, normal level
  g.run("labStart(null);wildExit();pgPlay('tuxedo');wildReset();wildStartCountdown();");g.until("WILD.phase==='play'",900);
  const off=J(g,'{on:LAB.on(),cols:LAB2.cols.length,clock:wildClock(),name:pglOn()&&pglOn().name,lv:PG.lv}');
  notes.boards={rows,bud,bud2,off};
  check('3 each round-2 board starts from the picker with its pieces, the normal extras, no timer and its drop budget where the clock was ("N drops")',ok3,rows.map(r=>({k:r.k,left:r.left,cols:r.cols,clock:r.clock,extras:r.extras})));
  check('4 each round-2 goal (tuna / cheese over the front, 6 coins in the cup, 12 coins bumped) wins after the 2 s wait',ok4,rows.map(r=>({k:r.k,...r.w0,...r.w2})));
  check('5 the budget: 18 drops on Cup shot and no more (taps refused); with the goal unmet the round ends as out of coins',ok5,{bud,bud2});
  check('6 Off: no lab pieces left in the world, the clock is the timer again, the selected level plays; level save unchanged',!off.on&&off.cols===0&&/^\d+:\d\d$/.test(off.clock)&&JSON.stringify(off.lv)===JSON.stringify(lv0),off);
  check('7 no frame errors during the lab rounds',J(g,'__errs').length===0,J(g,'__errs'));g.close&&g.close();}
 // 9. round 3: Pusher chains starts plain with 3 hint coins, a 3-coin preview, and a pair-built chain bursts from one coin
 {const g=await boot(src,4);g.run(`labStart('chain')`);g.until("WILD.phase==='play'",900);g.ticks(20);
  const st=J(g,`{on:LAB.on(),coloured:bodies.filter(b=>!b.dead&&LAB3.tint[b.id]).map(b=>b.id).sort(),ahead:LAB3.ahead.length,clock:wildClock(),text:LAB.def().lab.text,budget:LAB.def().budget}`);
  // lay a red pair and a green pair beside it in the second row, then land a red coin on the reds
  g.run(`{const c=bodies.filter(b=>!b.dead&&b.kind==='coin'&&!LAB3.tint[b.id]).map(b=>({b,q:b.rb.translation()})).filter(o=>o.q.z/M<420).sort((a,b)=>a.q.x-b.q.x||a.q.z-b.q.z);
   const at=(x,z)=>c.map(o=>o.b).filter(b=>!b.lab3T).sort((a,b)=>Math.hypot(a.rb.translation().x/M-x,a.rb.translation().z/M-z)-Math.hypot(b.rb.translation().x/M-x,b.rb.translation().z/M-z))[0];
   const r1=at(147,341),r2=at(200,341),g1=at(253,341),g2=at(306,341);r1.id=r2.id='lab-red';g1.id=g2.id='lab-green';r1.lab3T=r2.lab3T=g1.lab3T=g2.lab3T=1;
   const t=bodies.find(b=>!b.dead&&b.kind==='coin'&&!LAB3.tint[b.id]&&b.rb.translation().z/M>600);const p=r1.rb.translation();t.rb.setTranslation({x:p.x+0*M,y:p.y+COIN_HALF*2.2*M,z:p.z-(COIN_R*1.2)*M},true);t.id='lab-red';t.lab3Wait=true;t.fresh=false;t.lab3T=null;}`);
  g.ticks(40);const r=J(g,'{tap:LAB3.stats.tapBest,chains:LAB3.stats.chains,got:LAB.st.got,errs:__errs.length}');
  const off=await boot(src,4);const btn=J(off,"(()=>{S.dev=false;const a=labhBtn();S.dev=true;PGU.screen='main';const b=labhBtn();return {off:a,on:!!b};})()");off.close&&off.close();
  notes.round3={st,r,btn};
  check('9 round 3 Pusher chains: starts plain gold with one hint coin of each colour, a 3-coin preview and "'+st.budget+' drops"; a red coin landing on a red pair bursts it and the touching green pair chains (one tap '+r.tap+', chain x'+r.chains+'); no Home "Board lab" button with Developer off (its look and list are checked in the real browser); no frame errors',
   st.on&&JSON.stringify(st.coloured)===JSON.stringify(['lab-blue','lab-green','lab-red'])&&st.ahead===3&&st.clock===st.budget+' drops'&&r.tap>=5&&r.chains>=2&&!r.errs&&btn.off===null,{st,r,btn});g.close&&g.close();}
 // 10. leaving the lab always returns to normal play; PLAY never starts a lab board; nothing lab-related on a level
 {const g=await boot(src,6);const lv0=J(g,'PG.lv');const ways={};
  const level=()=>J(g,"{lab:LAB.on(),sel:LAB.st.sel,name:pglOn()&&pglOn().name,want:PGL_LEVELS[pglSel()-1].name,cols:LAB2.cols.length,clock:wildClock(),coloured:bodies.filter(b=>!b.dead&&b.id&&/^lab-/.test(b.id)).length,row:(()=>{const t=[];const w=wildText;wildText=function(x,...a){t.push(x);};const wi=wildIcon,cd=cp50Draw;wildIcon=()=>{};cp50Draw=()=>{};try{cp50DrawRow();}finally{wildText=w;wildIcon=wi;cp50Draw=cd;}return t;})()}");
  const normal=r=>!r.lab&&!r.sel&&r.name===r.want&&r.cols===0&&r.coloured===0&&/^\d+:\d\d$/.test(r.clock)&&!r.row.some(x=>/LAB/.test(x));
  // a: mid-round, the round's own top Home button (cp51Home presses it) -> the guard puts normal play back
  g.run("labhPlay('lanes')");g.until("WILD.phase==='play'",900);g.ticks(30);ways.midRoundIn=J(g,'{lab:LAB.on(),cols:LAB2.cols.length}');g.run("cp51Home();");g.ticks(5);ways.afterHome=level();
  // b: PLAY from Home afterwards starts the normal level
  g.run("pgStartRound();");g.until("WILD.phase==='play'",900);g.ticks(20);ways.play=level();
  // c: a lab round to its end, then the list's Home
  g.run("labhPlay('chain')");g.until("WILD.phase==='play'",900);g.ticks(20);g.run("wildFinish(false,'coins')");g.ticks(150);ways.listBack=J(g,'{shown:LABH.shownEnd,result:LABH.result}');g.run('labhHome()');g.ticks(5);ways.listHome=level();
  g.run("pgStartRound();");g.until("WILD.phase==='play'",900);g.ticks(20);ways.play2=level();
  // d: nothing is saved: a fresh start is normal play
  const g2=await boot(src,6);ways.fresh=J(g2,'{sel:LAB.st.sel,lab:LAB.on()}');g2.close&&g2.close();
  ways.lv=JSON.stringify(J(g,'PG.lv'))===JSON.stringify(lv0);ways.errs=J(g,'__errs').length;notes.leave=ways;
  check('10 leaving the lab always returns to normal play: the round’s own Home mid-round, PLAY afterwards, the end of a round then the list’s Home, and a fresh start all give the selected level with no lab pieces, coloured coins, drop budget or "LAB" goal row; no Engineer tools picker; level save unchanged; no frame errors',
   ways.midRoundIn.lab&&ways.midRoundIn.cols===2&&normal(ways.afterHome)&&normal(ways.play)&&ways.listBack.shown&&normal(ways.listHome)&&normal(ways.play2)&&!ways.fresh.sel&&!ways.fresh.lab&&ways.lv&&!ways.errs&&!/__labCredits/.test(fs.readFileSync(src,'utf8')),ways);g.close&&g.close();}
 check('8 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks'+U+'.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
