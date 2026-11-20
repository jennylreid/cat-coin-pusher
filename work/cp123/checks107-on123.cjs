// UAT 107 checks (CP-87 Daily puzzles button, UAT only). Usage: node checks107.cjs   (DEV=1: the scratch build on UAT 105)
// -> tickets/CP-87-evidence/uat107/checks107-on123.json (dev: .../dev/checks107-on123.json). The menu itself is checked in real Chrome (homecheck.cjs).
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {game}=require('../cp43/harness.cjs');
const DEV=process.env.DEV==='1';
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const V=DEV?{baseSHA256:'d08597d1a6e355071a67742cd070a687156b7dd40ea791d3d71b1f57b4e6db39',displayName:'dev'}:JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=path.resolve(E.base);
const out=path.resolve(__dirname,'../../tickets/CP-97-evidence/uat123');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[];function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,800):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function boot(file,seed,render=false){const g=await game({src:file,seed,render});
 g.run('S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
const STATE="bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,b.id||'',Math.round(q.x*1e4),Math.round(q.y*1e4),Math.round(q.z*1e4)]})";
async function levelRun(file,lv,seed,cat){const g=await boot(file,seed);
 g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lv-1});PG.lv.sel=${lv};pgPlay('${cat}');if(WILD.phase!=='card')wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);
 const tr=[];for(let i=0;i<900;i++){if(i%24===0)g.run(`tryDrop({x:${Math.round(200+120*Math.sin(i/37))},y:DROP_Y})`);g.tick();if(i%30===0)tr.push(J(g,`[${STATE},S.coins,Math.round(WILD.left*100),WILD.got]`));}
 const keys=J(g,'Object.keys(localStorage.__store||{}).length');const r={trace:JSON.stringify(tr),errs:J(g,'__errs').length,keys};g.close&&g.close();return r;}
(async()=>{
 // 0. the build is the base + the build name + the block, nothing else
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp122-giant/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='392fd2a0841a2b88fa0e8172cbfb9461841d63abb86323612a5b12e99e641745')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 122 + build name + cp92-sweep2.js + cp97-switch.js (everything else unchanged)',S===B&&m.length===1);}
 // 1. the five pages are in the block byte for byte; the block writes no game storage
 {const blk=fs.readFileSync(path.join(__dirname,'../cp107/cp87-puzzles.js'),'utf8');const i=blk.indexOf('const CP87_PAGES=')+17,j=blk.indexOf('const CP87_LIST');const P=JSON.parse(blk.slice(i,j).trim().replace(/;$/,''));
  const pj=JSON.parse(fs.readFileSync(path.join(__dirname,'../cp107/pages.json'),'utf8'));
  const same=Object.keys(pj).every(k=>crypto.createHash('sha256').update(Buffer.from(P[k],'utf8')).digest('hex')===pj[k].sha256&&pj[k].sha256===sha(path.join(root,'work',pj[k].file)));
  check('1 all five puzzle pages are embedded byte for byte',Object.keys(P).length===5&&same,Object.keys(P));
  const shell=fs.readFileSync(path.join(__dirname,'../cp107/cp87-shell.js'),'utf8');
  const keys=Object.values(P).flatMap(s=>[...s.matchAll(/(?:store|localStorage\.(?:get|set)Item)\(\s*['"`]([^'"`]+)/g)].map(m=>m[1]));
  check('1b the button code touches no storage; the puzzles only use their own cp84-/cp85- keys',!/localStorage|sessionStorage|indexedDB|[^.]save\(/.test(shell)&&keys.every(k=>/^cp8[45]-/.test(k)),keys);}
 // 2. the pusher plays identically: 3 rounds (levels, cats, seeds), every piece every 0.5 s, coins, clock, prizes
 for(const [lv,seed,cat] of [[1,4,'tuxedo'],[3,11,'orange'],[5,7,'siamese']]){
  const a=await levelRun(base,lv,seed,cat),b=await levelRun(src,lv,seed,cat);
  check(`2 level ${lv} ${cat} seed ${seed}: the round plays identically to the base`,a.trace===b.trace&&a.errs===0&&b.errs===0,{len:a.trace.length,errs:[a.errs,b.errs]});}
 // 3. Home: the button is drawn under PLAY; a tap on it opens the puzzles (the menu's DOM is stubbed here) and pauses the game;
 //    closing resumes; other Home taps still work
 {const g=await boot(src,4);g.ticks(30);g.run("PGA.L=Object.assign(PGA.L||{},{play:(()=>{const R=pgMainRects(),k=PG_MAIN_PLAY,cy=R.play+39;return {x:200-244*k/2,y:cy-78*k/2,w:244*k,h:78*k}})()})"); // the harness doesn't draw Home; PLAY's rect as pgMainPlay makes it (drawn button: real-Chrome homecheck)
  const scr=g.run('PGU.screen');const btn=J(g,'(()=>{const b=cp87Btn(),L=PGA.L.play;return {b,playBot:L.y+L.h,bot:pgMainRects().bot}})()');
  check('3 Home shows the Daily puzzles button under PLAY, inside the screen',scr==='main'&&btn.b&&btn.b.y>btn.playBot&&btn.b.y+btn.b.h<=btn.bot,btn);
  g.run('globalThis.__opened=0;cp87Build=()=>({style:{},querySelector:()=>({style:{},textContent:""})});cp87Menu=()=>{};const __o=cp87OpenMenu;cp87OpenMenu=function(){__opened++;return __o();}');
  g.tap(btn.b.x+btn.b.w/2,btn.b.y+btn.b.h/2);g.ticks(5);
  const FB="{const __d=draw;draw=()=>{};try{for(let i=1;i<=30;i++)frameBody(performance.now()+i*16.7)}finally{draw=__d}}"; // no drawing in the harness (no images) // the phone's frame loop (the harness's tick bypasses it)
  const t1=g.run('PGU.T');g.run(FB);const t2=g.run('PGU.T');
  g.run('void 0');check('3b a tap on it opens the puzzles and the game pauses (no frames run)',g.run('__opened')===1&&g.run('CP87.open')===true&&t2===t1&&g.run("PGU.screen")==='main',{t1,t2});
  g.run('cp87Close()');g.run(FB);const t3=g.run('PGU.T');
  check('3c closing returns to a running Home',g.run('CP87.open')===false&&t3>t2&&g.run("PGU.screen")==='main',{t3});
  // PLAY still starts a round
  g.run("PGA.L=Object.assign(PGA.L||{},{play:(()=>{const R=pgMainRects(),k=PG_MAIN_PLAY,cy=R.play+39;return {x:200-244*k/2,y:cy-78*k/2,w:244*k,h:78*k}})()})");const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);g.ticks(60);
  check('3d PLAY still starts a round',g.run("PGU.screen")==='board',g.run('PGU.screen'));
  check('3e no frame errors',J(g,'__errs').length===0,J(g,'__errs'));g.close&&g.close();}
 check('4 production untouched',sha(prodJ)===prod0);
 const res={build:src,passed:failed.length===0,failed,passedList:passed};fs.writeFileSync(path.join(out,'checks107-on123.json'),JSON.stringify(res,null,1));
 console.log(failed.length?'FAILED '+failed.length:'ALL PASS');process.exitCode=failed.length?1:0;
})().catch(e=>{console.error(e);process.exit(1);});
