// PROD-09 checks on the production build (work/prod09/release.html = UAT 105 + the production adaptations), real runtime in the
// cp43 harness (adapted from work/prod08/checks.cjs):
//  1. Developer off on every screen (Home, round with the goal row and Pause, end card, Album, Kitchen, ...).
//  2. Save carry-over from a production 2026.11.17 save (made by the published game, work/prod08/release.html);
//     plus the Oct 31 save path still works.
//  3. Parity with UAT 105 (work/cp89/release.html): the same scripted rounds give the same board in both builds.
// Usage (from work/prod09): node checks.cjs   -> evidence in tickets/PROD-09-evidence/
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const PROD=path.resolve(__dirname,'release.html'),UAT=path.resolve(__dirname,'../cp105/release.html'),OCT31=path.resolve(__dirname,'../cp25/promotion/release.html'),NOV15=path.resolve(__dirname,'../prod08/release.html');
const OUT=path.resolve(__dirname,'../../tickets/PROD-09-evidence');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};
function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const png=g=>{g.c.draw();return g.c.document.getElementById('cv').toBuffer('image/png');};
// a small DOM stand-in for the Settings panel, so openCredits() can build its HTML in the harness
const PANEL=`(()=>{const el=()=>({style:{},onclick:null,textContent:'',dataset:{},querySelector:()=>el(),querySelectorAll:()=>[],insertAdjacentHTML(){},addEventListener(){}});
 panel.querySelector=sel=>{const h=panel.innerHTML||'';if(sel==='h2')return /<h2/.test(h)?{insertAdjacentHTML:(w,x)=>{panel.innerHTML=h.replace(/(<h2>[^<]*<\\/h2>)/,'$1'+x);}}:null;
  const m=/^#([\\w-]+)$/.exec(sel);if(m)return h.includes('id="'+m[1]+'"')?el():null;return null;};
 panel.querySelectorAll=()=>[];panel.style=panel.style||{};
 // PROD-09: CP-70's Developer-on panel moves DOM nodes; give it inert element methods (it only runs with Developer on)
 const mk=()=>({...el(),appendChild(){},children:[]});try{const ce=document.createElement.bind(document);document.createElement=t=>String(t).toLowerCase()==='canvas'?ce(t):mk();}catch(e){}panel.children=panel.children||[];panel.appendChild=panel.appendChild||(()=>{});})()`;
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
   ['round-pause',g=>{g.ticks(30);const b=J(g,'cp51Btn()'),sc=g.run('scale');g.pointer('pointerdown',(b.x+b.w/2)*sc,(b.y+b.h/2)*sc);g.pointer('pointerup',(b.x+b.w/2)*sc,(b.y+b.h/2)*sc);g.ticks(3);}],
   ['round-resumed',g=>{g.run("cp51Resume('test')");g.ticks(20);}],
   ['round-end',g=>{g.run("for(const id of WILD_COLLECTION){const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)wildPrizeCollected(b,200);}");g.ticks(220);}],
 ];
  const off=await G(PROD,{dev:false}),on=await G(PROD,{dev:true});const diff=[];
  for(const [name,fn] of steps){fn(off);fn(on);if(name==='round-pause')notes.pauseOk=!!off.run('cp51Paused');if(name==='round-resumed')notes.pauseOk=notes.pauseOk&&!off.run('cp51Paused')&&off.run("WILD.phase")==='play';const a=png(off),b=png(on);fs.writeFileSync(path.join(OUT,'devoff-'+name+'.png'),a);
   const same=Buffer.compare(a,b)===0;screens[name]={sameAsDevOn:same,screen:off.run('PGU.screen'),modesButton:!!off.run('(()=>{try{return !!(pgDock&&pgDock().modes)}catch(e){return false}})()')};if(!same)diff.push(name);}
  notes.devOffScreens=screens;
  check('1.0 the Pause button opens the pop-up with Developer off (RESUME / END ROUND), and the round resumes',screens['round-pause']&&notes.pauseOk===true,notes.pauseOk);
  const tOff=settingsText(off),tOn=settingsText(on);fs.writeFileSync(path.join(OUT,'settings-devoff.html'),tOff);
  const banned=['Test this build','Send performance log','Connect log file','Share log file','safe-area','Preview','Empty purse','Show tap areas','Prize feedback','UAT','Wild timer','Reset tuning'];
  const found=banned.filter(w=>tOff.includes(w));
  check('1.1 Settings with Developer off: only Check for updates (in the app), Sound effects and the Developer switch (off); no test panel, previews, dials, log buttons or "UAT"',!found.length&&/Developer mode: off/.test(tOff)&&/Sound effects/.test(tOff),{found,buttons:(tOff.match(/<button[^>]*>[^<]*/g)||[]).map(x=>x.replace(/<button[^>]*>/,''))});
  check('1.2 the same Settings with Developer on still has the test tools (Test this build, previews, dials)',/Test this build/.test(tOn)&&/Preview Happy/.test(tOn));
  check('1.3 no MODES button on any screen with Developer off (title, Home, Kitchen, Porch, Album, Shop, cat picker, round, Pause, end card)',Object.values(screens).every(s=>!s.modesButton),screens);
  notes.devOnDiffers=diff;
  check('1.4 sanity: with Developer on the MODES button does appear on the main screen',!!on.run('(()=>{try{return !!pgDock().modes}catch(e){return false}})()'));
  {const f=await G(PROD,{dev:null,storage:{}});f.ticks(150);f.tap(200,700);f.ticks(40);const keys=Object.keys(f.storage);
   check('1.5 fresh install: Developer off after the title and the first screen; no UAT keys and no devdefault or diagnostics key saved',!f.run('S.dev')&&!keys.some(k=>/uat|devdefault|diagnostics/.test(k)),{dev:!!f.run('S.dev'),keys});
   f.run("PGU.screen='board';pgStartRound()");f.until("WILD.phase==='play'",900);for(let s=0;s<20;s++){f.run(`tryDrop({x:${200+s*5},y:DROP_Y})`);f.ticks(30);}
   check('1.6 a played round with Developer off writes no performance log (catpusher.diagnostics.v1) and keeps the production keys',!('catpusher.diagnostics.v1' in f.storage)&&Object.keys(f.storage).every(k=>k.startsWith('catpusher.')&&!k.startsWith('catpusher.uat.')),Object.keys(f.storage));
   check('1.7 footer/label reads the production release name, no "UAT"',f.run('BUILD')==='2026.11.18',f.run('BUILD'));}
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
 // ---------- 2b. save carry-over from a production 2026.11.17 save ----------
 {const store={};const o=await G(NOV15,{dev:null,storage:store});o.run('S.muted=true;saveAudioSettings&&saveAudioSettings()');o.ticks(150);o.tap(200,700);o.ticks(40);
  o.run("PGU.screen='board';pgStartRound()");o.until("WILD.phase==='play'",900);for(let s=0;s<25;s++){o.run(`tryDrop({x:${Math.round(200+100*Math.sin(s))},y:DROP_Y})`);o.ticks(20);}o.ticks(200);
  // a player some way in: Levels 1-4 passed with stars, coins, Catnip, treats in the pantry, a cooked dish, Album photos and stamps
  o.run("pglLv().passed=4;pglLv().sel=5;pglLv().stars={1:3,2:2,3:1,4:2};PG.coins=1234;PG.catnip=7;PG.items={cheese:4,shrimp:2,tuna:1};PG.ever={cheese:1,shrimp:1,tuna:1};PG.recipes={r1:1};PG.dishes={d1:2};PG.photos={tuxedo:1,orange:1};PG.stamped={tuxedo:1};PG.open={tuxedo:1,orange:1};PG.openOrder=['tuxedo','orange'];PG.rounds=9;pgSave();save&&save()");
  const pick="{coins:PG.coins,catnip:PG.catnip,lv:pglLv(),items:PG.items,ever:PG.ever,recipes:PG.recipes,dishes:PG.dishes,photos:PG.photos,stamped:PG.stamped,open:PG.open,openOrder:PG.openOrder,rounds:PG.rounds,migrated:PG.migrated||null}";
  const before=J(o,pick);const raw={...o.storage};fs.writeFileSync(path.join(OUT,'prod-2026.11.17-save.json'),JSON.stringify(raw,null,1));notes.nov15Save={state:before,keys:Object.keys(raw)};
  const n=await G(PROD,{dev:null,storage:{...raw}});n.ticks(150);n.tap(200,700);n.ticks(40);const after=J(n,pick);notes.nov15Upgraded=after;
  check('2.6 2026.11.17 save: level progress and stars, coins, Catnip, pantry (treats, recipes, dishes), Album (photos, stamps), cats and rounds carry over unchanged; no re-migration',JSON.stringify(before)===JSON.stringify(after),{before,after});
  // catpusher.loop.v1 is the old-board snapshot; the game rewrites its piece positions and clock on every save, so compare its player fields
  const lp=x=>{const o=JSON.parse(x||'{}');return JSON.stringify({coins:o.coins,lastRegen:o.lastRegen,got:o.got,boardIndex:o.boardIndex,placements:o.placements,collectionPaid:o.collectionPaid});};
  const same27=Object.fromEntries(['catpusher.audio.v1','catpusher.pantry.v1','catpusher.music.v2'].map(k=>[k,n.storage[k]===raw[k]]));const o2=await G(NOV15,{dev:null,storage:{...raw}});o2.ticks(150);o2.tap(200,700);o2.ticks(40);// the 2026.11.16 game reopening its own save fills empty treat counts with 0; the new build must do the same, no more
  same27['catpusher.loop.v1 (player fields, as the 2026.11.17 game reopens it)']=lp(n.storage['catpusher.loop.v1'])===lp(o2.storage['catpusher.loop.v1'])&&JSON.parse(n.storage['catpusher.loop.v1']).coins===JSON.parse(raw['catpusher.loop.v1']).coins;
  check('2.7 other saved settings carry over (sound, pantry key, music byte for byte; old-board coins/treats), Developer off, sound stays muted',
    Object.values(same27).every(Boolean)&&!n.run('S.dev')&&n.run('S.muted')===true,same27);
  n.run("PGU.screen='board';pgStartRound()");const ok=n.until("WILD.phase==='play'",900);n.ticks(120);
  check('2.8 the 2026.11.17 save plays Level 5, no frame errors, no UAT keys',ok&&J(n,'pglSel()')===5&&!J(n,'__errs').length&&!Object.keys(n.storage).some(k=>k.includes('uat')),{sel:J(n,'pglSel()'),errs:J(n,'__errs')});}
 // ---------- 3. parity with UAT 105 ----------
 {const rows=[];let same=true;
  for(const [lvl,seed] of [[1,3],[4,5],[6,9]]){const snap=async src=>{const g=await G(src,{dev:false,seed});g.ticks(150);g.tap(200,700);g.ticks(40);
    g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lvl-1});PG.lv.sel=${lvl};wildReset();PGU.screen='board';pgStartRound()`);g.until("WILD.phase==='play'",900);
    for(let s=0;s<30;s++){g.run(`tryDrop({x:${Math.round(200+120*Math.sin(s*1.7))},y:DROP_Y})`);g.ticks(18);}g.ticks(120);
    return J(g,"{bank:S.coins,items:PG.items,phase:WILD.phase,bodies:bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),+(p.x/M).toFixed(3),+(p.z/M).toFixed(3)]})}");};
   const a=await snap(PROD),b=await snap(UAT);const eq=JSON.stringify(a)===JSON.stringify(b);same=same&&eq;rows.push({level:lvl,seed,pieces:a.bodies.length,equal:eq});}
  notes.parity=rows;check('3.1 same scripted rounds (Levels 1, 4, 6) end with identical boards in this build and UAT 105',same,rows);}
 const res={build:PROD,passed:failed.length===0,passedChecks:passed,failed,notes,at:new Date().toISOString()};
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify(res,null,1));console.log(failed.length?'FAILED '+failed.length:'ALL PASSED');
})().catch(e=>{console.error(e);process.exit(1);});
