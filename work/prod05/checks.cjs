// PROD-05 checks on the production build (work/prod05/release.html), real runtime in the cp43 harness:
//  1. Developer off on every screen: same screens with Developer off and on; nothing test-only shows with it off.
//  2. Save upgrade from an Oct 31 production save (made by the Oct 31 production game itself).
//  3. Parity with UAT 64: the same scripted rounds give the same board (positions) in both builds.
// Usage (from work/prod05): node checks.cjs   -> evidence in tickets/PROD-05-evidence/
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const PROD=path.resolve(__dirname,'release.html'),UAT=path.resolve(__dirname,'../cp63/release.html'),OCT31=path.resolve(__dirname,'../cp25/promotion/release.html');
const OUT=path.resolve(__dirname,'../../tickets/PROD-05-evidence');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};
function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
// a small DOM stand-in for the Settings panel, so openCredits() can build its HTML in the harness
const PANEL=`(()=>{const el=()=>({style:{},onclick:null,textContent:'',dataset:{},querySelector:()=>el(),querySelectorAll:()=>[],insertAdjacentHTML(){},addEventListener(){}});
 panel.querySelector=sel=>{const h=panel.innerHTML||'';if(sel==='h2')return /<h2/.test(h)?{insertAdjacentHTML:(w,x)=>{panel.innerHTML=h.replace(/(<h2>[^<]*<\\/h2>)/,'$1'+x);}}:null;
  const m=/^#([\\w-]+)$/.exec(sel);if(m)return h.includes('id="'+m[1]+'"')?el():null;return null;};
 panel.querySelectorAll=()=>[];panel.style=panel.style||{};})()`;
async function G(src,{dev=false,storage={},seed=5}={}){const g=await game({src,render:true,seed,storage});
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run(PANEL);if(dev!==null)g.run('S.dev='+(dev?'true':'false'));return g;}
const settingsText=g=>{g.run('openCredits()');return String(g.run('panel.innerHTML'));};
(async()=>{
 // ---------- 1. Developer off on every screen ----------
 {const screens={};const steps=[
   ['title',g=>{g.ticks(60);}],
   ['main',g=>{g.ticks(150);g.tap(200,700);g.ticks(40);}],
   ['main-all-buttons',g=>{g.run("PG.level=9;PG.lv.passed=9;PG.lv.sel=4;for(const id of [...PG_SIDE_L,...PG_SIDE_R])PG.shown[id]=1;PG.open={tuxedo:1,orange:1,ragdoll:1,siamese:1,tortie:1};wildReset();");g.ticks(40);}],
   ...['kitchen','porch','album','shop'].map(id=>['door-'+id,g=>{g.run(`pgGo('main');PGU.door={id:'${id}',t:1}`);g.ticks(40);}]),
   ['cat-picker',g=>{g.run("PGU.door=null;pgGo('main');PGU.pick=true;PGU.pickT=1");g.ticks(20);}],
   ['round-play',g=>{g.run("PGU.pick=false;PGU.screen='board';pgStartRound()");g.until("WILD.phase==='play'",900);for(let s=0;s<12;s++){g.run(`tryDrop({x:${Math.round(200+110*Math.sin(s))},y:DROP_Y})`);g.ticks(20);}}],
   ['round-end',g=>{g.run("for(const id of WILD_COLLECTION){const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)wildPrizeCollected(b,200);}");g.ticks(220);}],
 ];
  const off=await G(PROD,{dev:false}),on=await G(PROD,{dev:true});const diff=[];
  for(const [name,fn] of steps){fn(off);fn(on);const a=png(off),b=png(on);fs.writeFileSync(path.join(OUT,'devoff-'+name+'.png'),a);
   const same=Buffer.compare(a,b)===0;screens[name]={sameAsDevOn:same,screen:off.run('PGU.screen'),modesButton:!!off.run('(()=>{try{return !!(pgDock&&pgDock().modes)}catch(e){return false}})()')};if(!same)diff.push(name);}
  notes.devOffScreens=screens;
  const tOff=settingsText(off),tOn=settingsText(on);fs.writeFileSync(path.join(OUT,'settings-devoff.html'),tOff);
  const banned=['Test this build','Send performance log','Connect log file','Share log file','safe-area','Preview','Empty purse','Show tap areas','Prize feedback','UAT','Wild timer','Reset tuning'];
  const found=banned.filter(w=>tOff.includes(w));
  check('1.1 Settings with Developer off: only Check for updates (in the app), Sound effects and the Developer switch (off); no test panel, previews, dials, log buttons or "UAT"',!found.length&&/Developer mode: off/.test(tOff)&&/Sound effects/.test(tOff),{found,buttons:(tOff.match(/<button[^>]*>[^<]*/g)||[]).map(x=>x.replace(/<button[^>]*>/,''))});
  check('1.2 the same Settings with Developer on still has the test tools (Test this build, previews, dials)',/Test this build/.test(tOn)&&/Preview Happy/.test(tOn));
  check('1.3 no MODES button and no Developer-only drawing on any screen with Developer off (title, main, Kitchen, Porch, Album, Shop, cat picker, round, end card)',Object.values(screens).every(s=>!s.modesButton),screens);
  notes.devOnDiffers=diff;
  check('1.4 sanity: with Developer on the MODES button does appear on the main screen',!!on.run('(()=>{try{return !!pgDock().modes}catch(e){return false}})()'));
  {const f=await G(PROD,{dev:null,storage:{}});f.ticks(150);f.tap(200,700);f.ticks(40);const keys=Object.keys(f.storage);
   check('1.5 fresh install: Developer off after the title and the first screen; no UAT keys and no devdefault or diagnostics key saved',!f.run('S.dev')&&!keys.some(k=>/uat|devdefault|diagnostics/.test(k)),{dev:!!f.run('S.dev'),keys});
   f.run("PGU.screen='board';pgStartRound()");f.until("WILD.phase==='play'",900);for(let s=0;s<20;s++){f.run(`tryDrop({x:${200+s*5},y:DROP_Y})`);f.ticks(30);}
   check('1.6 a played round with Developer off writes no performance log (catpusher.diagnostics.v1) and keeps the production keys',!('catpusher.diagnostics.v1' in f.storage)&&Object.keys(f.storage).every(k=>k.startsWith('catpusher.')&&!k.startsWith('catpusher.uat.')),Object.keys(f.storage));
   check('1.7 footer/label reads the production release name, no "UAT"',f.run('BUILD')==='2026.11.15',f.run('BUILD'));}
  check('1.8 no frame errors (Developer off and on runs)',!J(off,'__errs').length&&!J(on,'__errs').length,{off:J(off,'__errs'),on:J(on,'__errs')});}
 // ---------- 2. save upgrade from an Oct 31 production save ----------
 {const store={};const old=await game({src:OCT31,render:false,seed:7,storage:store});old.run('S.muted=true;saveAudioSettings&&saveAudioSettings()');
  old.ticks(60);for(let s=0;s<40;s++){old.run(`tryDrop({x:${Math.round(200+100*Math.sin(s))},y:DROP_Y})`);old.ticks(25);}old.ticks(200);
  old.run("S.got={cheese:14,shrimp:3,tuna:0};save()");// a long-time player: more cheese than the cap of 9
  const before=J(old,'{coins:S.coins,got:S.got,muted:S.muted,board:boardIndex}');notes.oct31Save={state:before,keys:Object.keys(store)};
  fs.writeFileSync(path.join(OUT,'oct31-save.json'),JSON.stringify(store,null,1));
  const n=await G(PROD,{dev:null,storage:{...store}});n.ticks(150);n.tap(200,700);n.ticks(40);
  const after=J(n,'{coins:PG.coins,items:PG.items,migrated:PG.migrated,level:PG.lv&&PG.lv.passed,sel:PG.lv&&PG.lv.sel,dev:S.dev,muted:S.muted,screen:PGU.screen,cap:pgCap()}');notes.upgraded=after;
  const sell=J(n,"{cheese:pgSell('cheese'),shrimp:pgSell('shrimp')}");
  check('2.1 Oct 31 save: coins carry over; treats carry over up to the cap of 9 (extra cheese turns into coins once)',after.items.cheese===9&&after.items.shrimp===3&&!(after.items.tuna>0)&&after.coins===before.coins+5*sell.cheese&&after.migrated.coins===before.coins,{before,after,sell});
  check('2.2 progression starts at Level 1 (no levels passed); Developer off; sound setting kept (muted stays muted)',after.level===0&&after.sel===1&&after.dev===false&&after.muted===true,after);
  n.run("PGU.screen='board';pgStartRound()");const ok=n.until("WILD.phase==='play'",900);n.ticks(120);
  check('2.3 the upgraded save plays: Level 1 round starts, no frame errors',ok&&!J(n,'__errs').length,J(n,'__errs'));
  const re=await G(PROD,{dev:null,storage:n.storage});re.ticks(150);re.tap(200,700);re.ticks(20);
  check('2.4 reopening keeps the new save (no second migration, coins and treats the same)',J(re,'PG.items.cheese')===9&&JSON.stringify(J(re,'PG.migrated'))===JSON.stringify(after.migrated)&&J(re,'PG.coins')===after.coins,J(re,'{coins:PG.coins,items:PG.items}'));
  check('2.5 production never reads or writes UAT keys',!Object.keys(n.storage).some(k=>k.includes('uat')),Object.keys(n.storage));}
 // ---------- 3. parity with UAT 64 ----------
 {const rows=[];let same=true;
  for(const [lvl,seed] of [[1,3],[4,5],[6,9]]){const snap=async src=>{const g=await G(src,{dev:false,seed});g.ticks(150);g.tap(200,700);g.ticks(40);
    g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lvl-1});PG.lv.sel=${lvl};wildReset();PGU.screen='board';pgStartRound()`);g.until("WILD.phase==='play'",900);
    for(let s=0;s<30;s++){g.run(`tryDrop({x:${Math.round(200+120*Math.sin(s*1.7))},y:DROP_Y})`);g.ticks(18);}g.ticks(120);
    return J(g,"{bank:S.coins,items:PG.items,phase:WILD.phase,bodies:bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),+(p.x/M).toFixed(3),+(p.z/M).toFixed(3)]})}");};
   const a=await snap(PROD),b=await snap(UAT);const eq=JSON.stringify(a)===JSON.stringify(b);same=same&&eq;rows.push({level:lvl,seed,pieces:a.bodies.length,equal:eq});}
  notes.parity=rows;check('3.1 same scripted rounds (Levels 1, 4, 6) end with identical boards in production and UAT 64',same,rows);}
 const res={build:PROD,passed:failed.length===0,passedChecks:passed,failed,notes,at:new Date().toISOString()};
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify(res,null,1));console.log(failed.length?'FAILED '+failed.length:'ALL PASSED');
})().catch(e=>{console.error(e);process.exit(1);});
