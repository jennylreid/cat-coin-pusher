// CP-93 Giant tower board checks (UAT build folder; reads release-version.json and edits.json).
// Usage: node checks93.cjs -> tickets/CP-100-evidence/uat<NNN>/checks93g-on127.json
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {game}=require('../cp43/harness.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))),U=V.displayName.split(' ').pop();
const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(E.base),out=path.resolve(__dirname,'../../tickets/CP-100-evidence/uat'+U);fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);notes[n]=info;console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function boot(seed){const g=await game({src,seed,render:false,storage:{}});
 g.run('S.muted=true;S.dev=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
function drop(g,state){if(!g.run("WILD.phase==='play'"))return;const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<state.last)state.n=0;state.last=ph;
 if(state.n<2&&state.t>=state.ok){const r0=+g.run('board.released');g.run(`tryDrop({x:${[150,250,200,120,280][state.d%5]},y:DROP_Y})`);if(+g.run('board.released')>r0){state.d++;state.n++;state.ok=state.t+17;}}}
const TW="(CP93.tw||[]).map(t=>({why:t.why||null,slide:+(t.slide||0).toFixed(1)}))";
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp126/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='323479547f66871733177edb3049678c0481c5999c502b65e2e5e2609f6f6ad7')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 126 + build name + the CP-100 edits + cp100-play.js (everything else unchanged)',S===B&&m.length===1);}
 // 1-4: the board itself (no drops for 25 s, then drops)
 {const g=await boot(3);const before=J(g,'[PUSH_MIN,PUSH_MAX]');
  const list=J(g,"{rounds:LABH_ROUNDS,order:labhOrder(),name:LAB.B.giant.name}");
  check('1 Home > Board lab lists "Giant towers" under "CP-93" (list data; the page itself in a real browser), normal deck before',list.rounds.some(r=>r[0]==='CP-93'&&r[1].includes('giant'))&&list.order[list.order.length-1]==='giant'&&list.name==='Giant towers'&&before[0]===190&&before[1]===260,{before,list});
  g.run("CP93.seed=3*7919;labhPlay('giant');");g.until("WILD.phase==='play'",900);
  const st=J(g,`{deck:[PUSH_MIN,PUSH_MAX],segs:bodies.filter(b=>!b.dead&&b.cp93!=null).length,towers:new Set(bodies.filter(b=>!b.dead&&b.cp93!=null).map(b=>b.cp93)).size,tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).map(b=>Math.round(b.rb.translation().y/M)),limits:bodies.filter(b=>!b.dead&&b.cp93!=null).every(b=>b.limit===1e9),coins:S.coins,goal:LAB.def().lab.text}`);
  check('2 the board: deck 350/420, 3 towers of segments on the deck, a prize on each top, goal "Spill all 3 giant towers"',st.deck[0]===350&&st.deck[1]===420&&st.towers===3&&st.segs>=15&&st.tops.length===3&&st.tops.every(y=>y>180)&&st.limits&&st.goal==='Spill all 3 giant towers',st);
  g.ticks(25*60);const a=J(g,`{tw:${TW},broke:CP93.stats.broke,tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).length}`);
  check('3 with nothing dropped the towers stand 25 s (none let go, no segment broken, prizes still on top)',a.broke===0&&a.tw.every(t=>!t.why)&&a.tops===3,a);
  const s={last:0,n:0,ok:0,d:0,t:0};let first=-1;for(s.t=0;s.t<90*60;s.t++){drop(g,s);g.tick();if(first<0&&+g.run('CP93.stats.spilled')>0)first=s.t/60;}
  const b=J(g,`{tw:${TW},broke:CP93.stats.broke,spilled:CP93.stats.spilled,got:LAB.st.got,bodies:bodies.length,errs:__errs.length}`);b.first=first;b.drops=s.d;
  check('4 dropping 2 coins a stroke: towers are pushed along the deck and spill (at least 1 in 90 s, counted on the goal row), no frame errors',b.spilled>=1&&b.got>=1&&b.broke>=3&&!b.errs,b);
  g.run("labhHome();");g.ticks(30);const h=J(g,'{deck:[PUSH_MIN,PUSH_MAX],sel:LAB.st.sel,cp:!!cp93L(),screen:PGU.screen}');
  g.run("PG.lv.passed=Math.max(PG.lv.passed,5);PG.lv.sel=6;pgPlay('tuxedo');wildReset();wildStartCountdown();");g.until("WILD.phase==='play'",900);
  const lv=J(g,'{deck:[PUSH_MIN,PUSH_MAX],stacks:bodies.filter(b=>!b.dead&&b.kind==="stack").map(b=>[b.cp93??null,b.limit<1e9,b.rb.collider(0).friction()]),pusher:Math.round(pusherY),errs:__errs.length}');
  check('5 leaving the lab (Home) and playing Level 6: deck back to 190/260, normal towers (own tip rule, coin friction), no CP-93 parts',h.deck[0]===190&&h.deck[1]===260&&!h.sel&&!h.cp&&lv.deck[0]===190&&lv.deck[1]===260&&lv.stacks.length>0&&lv.stacks.every(x=>x[0]===null&&x[1]&&Math.abs(x[2]-0.45)<1e-6)&&lv.pusher>=190&&lv.pusher<=260&&!lv.errs,{h,lv});
  g.run("CP93.seed=11;labhPlay('giant');");g.until("WILD.phase==='play'",900);g.ticks(60);const mid=J(g,'[PUSH_MIN,PUSH_MAX]');g.run("wildExit();");g.ticks(30);
  const ex=J(g,'{deck:[PUSH_MIN,PUSH_MAX],wild:WILD.on,pusher:Math.round(pusherY)}');
  check('6 wildExit() from the giant board gives the deck back 190/260 (in the cat levels the Wild board stays on; that path is unchanged)',mid[0]===350&&ex.deck[0]===190&&ex.deck[1]===260&&ex.pusher>=190&&ex.pusher<=260,{mid,ex});
  g.close&&g.close();}
 // 7: another lab board (Tall tower) doesn't get the CP-93 rules
 {const g=await boot(5);g.run("labhPlay('tower');");g.until("WILD.phase==='play'",900);g.ticks(120);
  const t=J(g,'{deck:[PUSH_MIN,PUSH_MAX],cp:!!cp93L(),stacks:bodies.filter(b=>!b.dead&&b.kind==="stack").map(b=>[b.cp93??null,b.limit<1e9])}');
  check('7 other lab boards (Tall tower) keep the normal deck and towers',t.deck[0]===190&&t.deck[1]===260&&!t.cp&&t.stacks.length>0&&t.stacks.every(x=>x[0]===null&&x[1]),t);g.close&&g.close();}
 check('8 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks93g-on127.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
