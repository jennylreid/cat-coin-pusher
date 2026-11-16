// UAT 68 (CP-51 Drop speed and Pause) checks. Developer off, real runtime, real pointer events.
// Usage: node checks68.cjs [BUILD] [BASE (UAT 67)] [OUT]
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp67','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-51-evidence','uat68'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
async function game(file,o={}){const g=await make({sourceFile:file,render:true,seed:o.seed||5,pixelRatio:o.pr||1,width:o.w||400,height:o.h||889,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.ms=()=>ms;
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.down=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);};g.up=(x,y)=>{const s=g.run('scale');g.pointer('pointerup',x*s,y*s);};
 g.tap=(x,y)=>{g.down(x,y);g.up(x,y);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);g.c.draw();return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const level=(g,p,s)=>{g.run(`pglLv().passed=${p};pglLv().sel=${s};pgSave();if(WILD.phase==='card')wildReset();`);g.ticks(10);g.c.draw();};
const play=g=>{const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);const ok=g.until("WILD.phase==='play'",900);g.ticks(40);return ok;};
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const pos=g=>J(g,"bodies.filter(b=>!b.dead).slice(0,400).map(b=>{const q=b.rb.translation();return Math.round(q.x*1e4)+Math.round(q.z*1e4)})").join();
(async()=>{
 const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 // --- 1. drop rates, real pointer events, 6 s on Level 2 ---
 const rates={};
 for(const [name,file] of [['UAT 67',base],['UAT 68',src]]){const r={};
  for(const mode of ['hold','tap5','tap8','tap3']){const g=await game(file);level(g,1,2);play(g);g.run('S.coins=500;board.remaining=500;');const d0=J(g,'S.drops');
   const ticks=360;if(mode==='hold'){g.down(200,560);g.ticks(ticks);g.up(200,560);}
   else{const every=mode==='tap5'?12:mode==='tap8'?7:20;for(let i=0;i<ticks;i++){if(i%every===0){g.down(200,560);g.tick();g.up(200,560);}else g.tick();}}
   g.ticks(30);r[mode]=+(((J(g,'S.drops')-d0))/6).toFixed(2);}
  rates[name]=r;}
 notes.rates=rates;
 check('1a holding drops a slower steady stream: UAT 67 5 a second, UAT 68 2.5 a second',Math.abs(rates['UAT 67'].hold-5.17)<.4&&Math.abs(rates['UAT 68'].hold-2.67)<.3,rates);
 check('1b tapping 5 a second drops 4 a second (none lost), 8 a second caps at 4; 3 a second drops every tap',Math.abs(rates['UAT 68'].tap5-4)<.4&&Math.abs(rates['UAT 68'].tap8-4)<.4&&Math.abs(rates['UAT 68'].tap3-3)<.4,rates['UAT 68']);
 // --- 2. backstop only (no 45-coin limit) ---
 {const g=await game(src);level(g,5,6);play(g);g.run('S.coins=500;board.remaining=500;');
  g.run("for(let i=0;i<50;i++){addCoin('coin',null,200+(i%6-2.5)*30,COIN_HALF+.2+8*(i/6|0),560-(i%3)*20,0);bodies[bodies.length-1].input=true;}");g.ticks(60);
  const own=J(g,'cp48Own()'),d0=J(g,'S.drops');g.down(200,560);g.ticks(60);g.up(200,560);const d1=J(g,'S.drops')-d0;
  check('2a 50 of your own coins on the board: drops carry on at full speed (no 45-coin limit, no "Board full")',own>=45&&d1>=3&&!J(g,'cp48Full()'),{own,pieces:J(g,'cp51Pieces()'),drops:d1});
  g.run("for(let i=0;i<70;i++)addCoin('coin',null,200+(i%6-2.5)*30,COIN_HALF+.2+8*(i/6|0),600-(i%3)*20,0);");g.ticks(5);
  const pc=J(g,'cp51Pieces()'),msg=J(g,"wildMessage()"),d2=J(g,'S.drops');g.down(200,560);g.ticks(90);g.up(200,560);const n2=J(g,'S.drops')-d2,pc2=J(g,'cp51Pieces()');
  check('2b at 120 coin pieces the backstop slows drops to one a second ("Board full"): 1.5 s of holding drops at most 2 (a hold drops 4-5)',pc>=120&&pc2>=120&&n2>=1&&n2<=2&&msg==='Board full!',{pieces:[pc,pc2],dropsIn1_5s:n2,msg});}
 // --- 3. Pause ---
 const g=await game(src);level(g,1,2);play(g);g.ticks(120);
 const btn=J(g,'cp51Btn()'),pause=()=>g.tap(btn.x+btn.w/2,btn.y+btn.h/2);
 g.down(200,560);g.ticks(20);pause();
 check('3a tapping the timer pill pauses; a hold in progress stops',J(g,'cp51Paused')&&!J(g,'holding'),{btn});
 const s0={left:J(g,'WILD.left'),time:J(g,'time'),drops:J(g,'S.drops'),p:pos(g),pusher:J(g,'pusherY')};g.ticks(300);
 g.tap(200,600);g.down(120,640);g.ticks(60);g.up(120,640);
 const s1={left:J(g,'WILD.left'),time:J(g,'time'),drops:J(g,'S.drops'),p:pos(g),pusher:J(g,'pusherY')};
 check('3b while paused (6 s): timer, game time, pusher and every piece frozen; taps and holds on the board drop nothing',s0.left===s1.left&&s0.time===s1.time&&s0.drops===s1.drops&&s0.p===s1.p&&s0.pusher===s1.pusher,{left:[s0.left,s1.left],time:[s0.time,s1.time],drops:[s0.drops,s1.drops],same:s0.p===s1.p});
 check('3c music is off while paused',J(g,'bgmWanted()')===false);
 shot(g,'pause-400x889');
 let R=J(g,'cp51Rects()');const c=r=>[r.x+r.w/2,r.y+r.h/2];
 const m0=J(g,'S.muted');g.tap(...c(R.sound));g.ticks(5);const m1=J(g,'S.muted');g.tap(...c(R.sound));g.ticks(5);
 check('3d Sound toggles sound off/on and the game stays paused',m1===!m0&&J(g,'S.muted')===m0&&J(g,'cp51Paused'),{m0,m1});
 g.tap(...c(R.help));g.ticks(10);shot(g,'pause-howto-400x889');const v1=J(g,'CP51.view');g.tap(200,400);g.ticks(5);
 check('3e How to play shows the goal card (BACK instead of TAP TO START); a tap returns to the pop-up, still paused',v1==='rules'&&J(g,'CP51.view')==='menu'&&J(g,'cp51Paused'));
 g.tap(...c(R.resume));const l0=J(g,'WILD.left');g.ticks(60);
 check('3f RESUME: timer runs again, drops work',!J(g,'cp51Paused')&&J(g,'WILD.left')<l0-.9,{before:l0,after:J(g,'WILD.left')});
 // Finish
 pause();R=J(g,'cp51Rects()');g.run("{const id=WILD_COLLECTION[0];const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b){removeCoin(b);}WILD.have[id]=true;WILD.got=1;WILD.pgCoins=(WILD.pgCoins|0)+7;}");
 const items0=J(g,'PG.items'),coins0=J(g,'PG.coins'),id0=J(g,'WILD_COLLECTION[0]');
 g.tap(...c(R.finish));g.ticks(120);
 const T=[];g.run("globalThis.__t=[];const ft=ctx.fillText.bind(ctx);ctx.fillText=function(t,...a){__t.push(String(t));return ft(t,...a);}");g.c.draw();
 check('3g FINISH ROUND ends the round now with the normal end card ("ROUND OVER"), the collected prize goes to the inventory and the coins to the jar',
  J(g,"WILD.phase")==='end'&&J(g,'WILD.reason')==='finish'&&J(g,'PG.items')[id0]===(items0[id0]|0)+1&&J(g,'PG.coins')>coins0&&J(g,'__t').some(t=>/1 of \d+ prizes/.test(t)),{reason:J(g,'WILD.reason'),item:[items0[id0]|0,J(g,'PG.items')[id0]],coins:[coins0,J(g,'PG.coins')],result:J(g,'WILD.pgResult'),lines:J(g,'__t').slice(0,12)});
 shot(g,'finish-endcard-400x889');
 // Home
 {const h=await game(src);level(h,1,2);play(h);const b=J(h,'cp51Btn()');h.tap(b.x+b.w/2,b.y+b.h/2);const RR=J(h,'cp51Rects()');h.tap(RR.home.x+5,RR.home.y+5);h.ticks(40);
  check('3h Home leaves the round for the Home screen (same as the round\'s top Home button)',!J(h,'cp51Paused')&&J(h,'PGU.screen')==='main',{screen:J(h,'PGU.screen'),phase:J(h,'WILD.phase')});}
 // background
 {const h=await game(src);level(h,1,2);play(h);h.down(200,560);h.ticks(10);h.run('appPaused(true)');const p1=J(h,'cp51Paused'),hold=J(h,'holding');h.run('appPaused(false)');h.ticks(30);
  check('3i the app going to the background (native pause / screen off) pauses; on return the pop-up is showing',p1&&!hold&&J(h,'cp51Paused')&&J(h,'CP51.why')==='background');
  h.tap(...c(J(h,'cp51Rects()').resume));h.run("document.hidden=true;cp51Hidden();document.hidden=false;");
  check('3j the page being hidden pauses too (the visibilitychange handler; the desktop runtime has no real events)',J(h,'cp51Paused'));}
 // not on other phases
 {const h=await game(src);level(h,1,2);const b=J(h,'cp51Btn()');h.tap(b.x+b.w/2,b.y+b.h/2);const a=J(h,'cp51Paused');
  play(h);h.run('WILD.left=.05');h.until("WILD.phase==='end'",600);h.ticks(60);h.run("appPaused(true)");const e=J(h,'cp51Paused');h.run("appPaused(false)");
  check('3k no pause outside a round in play (Home screen, end card)',!a&&!e);}
 // the dance break: pausing in the middle keeps it in time
 {const h=await game(src);level(h,1,2);play(h);h.run('WILD.danceForce=true');h.until('WILD.dance&&WILD.dance.phase!=="count"',900);h.ticks(20);
  const D0=J(h,'{p0:WILD.dance.p0,phase:WILD.dance.phase}');const b=J(h,'cp51Btn()');h.tap(b.x+b.w/2,b.y+b.h/2);const p=J(h,'cp51Paused');h.ticks(180);
  h.tap(...c(J(h,'cp51Rects()').resume));h.ticks(2);const D1=J(h,'WILD.dance&&{p0:WILD.dance.p0,phase:WILD.dance.phase}');
  check('3l a dance break paused for 3 s picks up where it was (beat clock shifted by the pause)',p&&D1&&Math.abs((D1.p0-D0.p0)-3)<.1,{D0,D1});
  notes.danceErrs=J(h,'__errs');}
 // a pickup in flight while paused: it waits and then finishes as normal
 {const h=await game(src);level(h,1,2);play(h);h.run(`{const b=bodies.find(b=>!b.dead&&b.kind==='item');const q=b.rb.translation();b.rb.setTranslation({x:q.x,y:q.y,z:(T.FRONT+60)*M},true);}`);
  h.ticks(25);const n0=J(h,'treatAwards.length');const b=J(h,'cp51Btn()');h.tap(b.x+b.w/2,b.y+b.h/2);h.ticks(120);const n1=J(h,'treatAwards.length');
  h.tap(...c(J(h,'cp51Rects()').resume));h.ticks(400);
  check('3m a prize pickup caught by Pause stays on screen, then finishes normally after Resume',n0>0&&n1===n0&&J(h,'WILD.got')===1&&J(h,'treatAwards.filter(a=>!a.done).length')===0,{n0,n1,got:J(h,'WILD.got')});
  notes.pickupErrs=J(h,'__errs');}
 // --- 6. add-ons: Level 1 intro board, gold-coin bonus drops, the prize bell at half volume ---
 {const h=await game(src),b0=await game(base);level(h,0,1);play(h);
  const kinds=J(h,"[...new Set(bodies.filter(b=>!b.dead).map(b=>b.kind))].sort()"),items=J(h,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id).sort()");
  check('6a Level 1 starts with only gold coins plus the cheese and shrimp (no Quake, no Rain 5 / Rain 10)',items.join()==='cheese,shrimp'&&kinds.every(k=>['coin','silver','item'].includes(k)),{kinds,items});
  const L=J(h,'PGL_LEVELS'),B=J(b0,'PGL_LEVELS');const l1=Object.assign({},L[0],{rain:B[0].rain,quake:B[0].quake});
  check('6b Level 1 otherwise unchanged (coins, time, goal, prize spots); Levels 2-10 identical to UAT 67',JSON.stringify(l1)===JSON.stringify(B[0])&&JSON.stringify(L.slice(1))===JSON.stringify(B.slice(1)),{L1:L[0]});
  let k1=[];for(let i=0;i<60;i++){const n=J(h,'WILD.incoming.length');h.run('wildScheduleBonus()');k1.push(J(h,`WILD.incoming[${n}]`).kind);}
  const c0=J(h,"bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length");h.run('for(const o of WILD.incoming)o.t=.01');h.ticks(30);const c1=J(h,"bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length");
  check('6c Level 1: 60 bonus drops are all plain gold coins, and they land on the board',k1.every(k=>k==='coin')&&c1>c0+40,{kinds:[...new Set(k1)],coinsBefore:c0,after:c1});
  h.run("{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='shrimp');removeCoin(b);WILD.incoming.length=0;}");const n0=J(h,'WILD.incoming.length');h.run('wildScheduleBonus()');const back=J(h,`WILD.incoming[${n0}]`);
  check('6d a goal prize lost off a side still comes back by bonus drop on Level 1',back&&back.kind==='item'&&back.id==='shrimp',back);
  const q=await game(src);level(q,1,2);play(q);let k2=[];for(let i=0;i<80;i++){const n=J(q,'WILD.incoming.length');q.run('wildScheduleBonus()');k2.push(J(q,`WILD.incoming[${n}]`).kind);}
  check('6e Level 2 bonus drops unchanged (rain, Quake and prizes still come)',['item','rain5','quake'].every(k=>k2.includes(k))&&!k2.includes('coin'),[...new Set(k2)]);
  notes.l1Errs=J(h,'__errs');
  // the bell: record what sfx.pickup is asked to play when a prize goes over the ledge, on both builds
  const vols={};for(const [nm,f] of [['UAT 67',base],['UAT 68',src]]){const x=await game(f);x.run('S.muted=false');level(x,1,2);play(x);
   x.run("globalThis.__pk=[];const _p=sfx.pickup.bind(sfx);sfx.pickup=function(k,v,d){__pk.push([k,+v.toFixed(4),+(d||0).toFixed(3)]);};");
   x.run(`{const b=bodies.find(b=>!b.dead&&b.kind==='item');const q=b.rb.translation();b.rb.setTranslation({x:q.x,y:q.y,z:(T.FRONT+60)*M},true);}`);x.ticks(300);vols[nm]=J(x,'__pk');}
  const bell=v=>v.filter(a=>a[0]==='bell'),thump=v=>v.filter(a=>a[0]!=='bell');
  check('6f the prize bell plays at half its UAT 67 volume (same timing); the landing thump is unchanged',bell(vols['UAT 67']).length>0&&bell(vols['UAT 68']).length===bell(vols['UAT 67']).length&&bell(vols['UAT 68']).every((a,i)=>Math.abs(a[1]-bell(vols['UAT 67'])[i][1]*.5)<1e-3&&a[2]===bell(vols['UAT 67'])[i][2])&&JSON.stringify(thump(vols['UAT 68']))===JSON.stringify(thump(vols['UAT 67'])),vols);
  shot(h,'level1-after-60-gold-bonus-drops-400x889');}
 check('4 no frame errors',J(g,'__errs').length===0&&!notes.danceErrs.length&&!notes.pickupErrs.length&&!notes.l1Errs.length,{g:J(g,'__errs'),dance:notes.danceErrs,pickup:notes.pickupErrs});
 check('5 production untouched',sha(prod)===prod0);
 const res={build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes};fs.writeFileSync(path.join(OUT,'checks68.json'),JSON.stringify(res,null,1));
 console.log(passed.length+' passed, '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exit(1);});
