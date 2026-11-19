// UAT 103 checks (CP-83 Board lab; Jenny Nov 18: "5-6 board setups ... in the real game, chosen with a Developer picker. I play
// them and pick the fun ones."). Usage: node checks103.cjs -> tickets/CP-83-evidence/uat103/checks103-on113.json
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {game}=require('../cp43/harness.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(E.base),out=path.resolve(__dirname,'../../tickets/CP-88-evidence/uat113');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const OVER="b.rb.setTranslation({x:200*M,y:b.rb.translation().y,z:(T.FRONT+5)*M},true);fallOff(b,200);";
const BOARDS=['tower','edge','pins','wall','mice','red'];
async function boot(file,seed){const g=await game({src:file,seed,render:false});
 g.run('S.muted=true;S.dev=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
const STATE="bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,b.id||'',Math.round(q.x*1e4),Math.round(q.y*1e4),Math.round(q.z*1e4)]})";
// a normal level round with taps: every body every 30 frames, plus coins, time, goal count
async function levelRun(file,lv,seed,cat){const g=await boot(file,seed);
 g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lv-1});PG.lv.sel=${lv};pgPlay('${cat}');if(WILD.phase!=='card')wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);
 const tr=[];for(let i=0;i<900;i++){if(i%24===0)g.run(`tryDrop({x:${Math.round(200+120*Math.sin(i/37))},y:DROP_Y})`);g.tick();if(i%30===0)tr.push(J(g,`[${STATE},S.coins,Math.round(WILD.left*100),WILD.got]`));}
 const r={trace:JSON.stringify(tr),errs:J(g,'__errs').length,lv:J(g,'PG.lv')};g.close&&g.close();return r;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp112-hug/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='ac8c09cac6321eac24106c68e9740e3d0457484126d92c91ba0a110408b73d6d')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 112 + build name + the CP-88 pulse fix (everything else unchanged)',S===B&&m.length===1);}
 // 1. lab off: normal play identical to UAT 102
 {const runs=[];let ok=true;for(const [lv,cat,seed] of [[3,'tuxedo',1],[5,'orange',2],[9,'ragdoll',1]]){const a=await levelRun(src,lv,seed,cat),b=await levelRun(base,lv,seed,cat);
   const same=a.trace===b.trace&&!a.errs&&!b.errs;runs.push({lv,cat,seed,same});if(!same)ok=false;}
  check('1 Board lab off (the default): Levels 3/5/9 with Tuxedo/Orange/Ragdoll, 900 frames of play with taps, every piece every 0.5 s identical to UAT 102; no frame errors',ok,runs);}
 // 2-5 each board
 {const g=await boot(src,3);const lv0=J(g,'PG.lv'),rec0=J(g,'PG.recipes||{}');const rows=[];let ok2=true,ok3=true,ok4=true;
  for(const k of BOARDS){g.run(`labStart('${k}')`);const inPlay=g.until("WILD.phase==='play'",900);g.ticks(30);
   const s=J(g,`{on:LAB.on(),coins:S.coins,left:Math.round(WILD.left),def:{coins:LAB.def().coins,secs:LAB.def().secs},items:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id),stacks:bodies.filter(b=>!b.dead&&b.kind==='stack').length,goalStacks:bodies.filter(b=>!b.dead&&b.labGoal).length,red:bodies.filter(b=>!b.dead&&b.id==='lab-red').length,msg:wildMessage(),plain:bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length+bodies.filter(b=>!b.dead&&b.kind==='stack').reduce((a,b)=>a+b.n,0)}`);
   // draw the goal row: capture the texts drawn (icons stubbed: this runner has no art loaded)
   g.run("globalThis.__txt=[];{const __wt=wildText,__wi=wildIcon,__cd=cp50Draw;wildText=function(t,...a){__txt.push(t);return __wt.call(this,t,...a);};wildIcon=()=>{};cp50Draw=()=>{};try{cp50DrawRow();}finally{wildText=__wt;wildIcon=__wi;cp50Draw=__cd;}}");const txt=J(g,'__txt');
   const d=J(g,`LAB.def()`);const want={tower:{items:['tuna'],goalStacks:1},edge:{items:['cheese','shrimp','tuna']},pins:{goalStacks:6},wall:{items:['yarn','bell','duck']},mice:{items:Array(7).fill('mouse')},red:{red:14}}[k];
   let good=inPlay&&s.on&&s.coins<=d.coins&&s.left<=d.secs&&s.left>=d.secs-2&&txt[0]==='LAB · '+d.name&&txt.length>=2&&s.plain<=90;
   if(want.items)good=good&&JSON.stringify(s.items.slice().sort())===JSON.stringify(want.items.slice().sort());
   if(want.goalStacks)good=good&&s.goalStacks===want.goalStacks;if(want.red)good=good&&s.red===want.red;
   rows.push({k,...s,txt});if(!good)ok2=false;
   // win: the goal met by the board's own rule, then 2 s of play, then a win; the level save untouched
   const G=d.lab;
   if(G.kind==='collect')g.run(`for(const b of bodies.filter(b=>!b.dead&&b.kind==='item')){${OVER}}`);
   else if(G.kind==='count')g.run(`for(const b of bodies.filter(b=>!b.dead&&b.kind==='item'&&b.id==='${G.id}').slice(0,${G.n})){${OVER}}`);
   else if(G.kind==='topple')g.run(`for(const b of bodies.filter(b=>!b.dead&&b.labGoal))breakStack(b)`);
   else if(G.kind==='red')g.run(`for(const b of bodies.filter(b=>!b.dead&&b.id==='lab-red').slice(0,${G.n})){${OVER}}`);
   const w0=J(g,'{pending:LAB.st.pending,got:LAB.st.got,phase:WILD.phase}');g.ticks(60);const w1=J(g,'WILD.phase');g.ticks(90);const w2=J(g,'{phase:WILD.phase,win:WILD.win}');g.ticks(200);
   const lv=J(g,'PG.lv'),rec=J(g,'PG.recipes||{}');const winOk=w0.pending&&w0.phase==='play'&&w1==='play'&&w2.phase==='end'&&w2.win&&JSON.stringify(lv)===JSON.stringify(lv0)&&JSON.stringify(rec)===JSON.stringify(rec0);
   rows[rows.length-1].win={w0,w1,w2};if(!winOk)ok3=false;}
  notes.boards=rows;
  check('2 each of the 6 lab boards starts in play from the picker with its own layout (prizes, goal towers, red coins), coins and time, at most 90 coins on the board; the goal row reads "LAB · <name>" and the goal',ok2,rows.map(r=>({k:r.k,coins:r.coins,left:r.left,items:r.items.length,goalStacks:r.goalStacks,red:r.red,plain:r.plain,txt:r.txt})));
  check('3 meeting each goal (its own rule: prizes over the front, mice counted, goal towers toppled, red coins over the front) wins after the 2 s wait; the level save and recipes unchanged',ok3,rows.map(r=>({k:r.k,...r.win})));
  // 4. off again: the next round is the normal level
  g.run("labStart(null);if(WILD.on)wildExit();pgPlay('tuxedo');if(WILD.phase!=='card')wildReset();wildStartCountdown();");g.until("WILD.phase==='play'",900);
  const off=J(g,`{on:LAB.on(),name:pglLevel().name,lvl:PGL_LEVELS.indexOf(pglLevel())+1,sel:pglSel(),coins:S.coins,items:bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id).sort(),red:bodies.filter(b=>!b.dead&&b.id==='lab-red').length}`);
  const want=J(g,'(()=>{const L=PGL_LEVELS[pglSel()-1];return {name:L.name,coins:L.coins};})()');
  check('4 picking Off: the next round is the selected level as before (name, coins), no red coins, lab off',!off.on&&off.name===want.name&&off.coins===want.coins&&off.red===0&&off.lvl===off.sel,off);
  check('5 no frame errors during the lab rounds',J(g,'__errs').length===0,J(g,'__errs'));g.close&&g.close();}
 // 6. the frozen pickup: a mouse counted on Mouse hunt goes through queueTreatAward once, with the same arguments as a normal prize
 {const g=await boot(src,5);g.run(`labStart('mice')`);g.until("WILD.phase==='play'",900);g.ticks(10);
  g.run("globalThis.__q=[];var __qa=queueTreatAward;queueTreatAward=function(...a){__q.push([a[0],typeof a[1],!!a[2],a.length]);return __qa.apply(this,a);};");
  g.run("{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='mouse');"+OVER+"}");const q=J(g,'__q'),got=J(g,'LAB.st.got');
  check('6 a counted mouse uses the frozen pickup unchanged: one queueTreatAward(id, x, body) call, counted once',q.length===1&&q[0][0]==='mouse'&&q[0][2]&&got===1,{q,got});g.close&&g.close();}
 check('7 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks103-on113.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
