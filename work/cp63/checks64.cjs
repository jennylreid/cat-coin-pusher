// UAT 64 (CP-48) checks: the own-coin limit and "Board full", the main screen after a flood, the new logging, Level 1 on 9 rows.
// Real runtime, sound ON through the strict fake Web Audio, desktop canvas. Usage: node checks63.cjs [BUILD] [BASE (UAT 62)] [OUT]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp47-levels','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-48-evidence','uat64'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const snap=g=>J(g,"bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),+(p.x/M).toFixed(2),+(p.y/M).toFixed(2),+(p.z/M).toFixed(2)]})");
async function G(o={}){const g=await game({src:o.src||src,render:o.render!==false,seed:o.seed||5,storage:o.storage||{}});g.c.__rn=g.realNow;const st=strictAudio(g);g.st=st;g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);return g;}
const errs=g=>J(g,'__errs');
function level(g,n,cat){g.run(`${cat?`if(PGU.boardCat!=='${cat}'){PG.open['${cat}']=1;pgSwitchBoard('${cat}');}`:''}PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();`);}
function startRound(g){g.run("PGU.screen='board';pgStartRound();");return g.until("WILD.phase==='play'",900);}
const plain=g=>+g.run('w43PlainCount()');
const Y=g=>+g.run('Math.round(hudLayout().headerBottom+60)');
// hold-flood like Jenny: long holds across the board; returns the peak plain count and when the hint showed
function flood(g,sec=30){let pieces=0,peak=0,full=0,msg=0,floatSeen=0,ms=0,n=0;const xs=[276,213,256,268,230,237,200,180,220,150,250];
 for(let k=0;k<xs.length&&n<sec*60&&g.run("WILD.phase==='play'");k++){g.pointer('pointerdown',xs[k],Y(g));
  for(let i=0;i<150;i++){const a=g.realNow();g.tick();ms+=g.realNow()-a;n++;const c=plain(g);peak=Math.max(peak,c);
   pieces=Math.max(pieces,+g.run("typeof cp48Own==='function'?cp48Own():0"));if(g.run("typeof cp48Full==='function'&&cp48Full()")){full++;if(g.run('wildMessage()')==='Board full!')msg++;if(g.run("floats.some(f=>f.text==='Board full')"))floatSeen++;}}
  g.pointer('pointerup',xs[k],Y(g));}
 return {peak,own:pieces,full,msg,floatSeen,merged:+g.run('WILD.merged||0'),msPerTick:+(ms/n).toFixed(1),bank:+g.run('S.coins')};}
(async()=>{
 // ---------- 1. every level: the full 9-row grid, towers standing on it, about 80 coins or fewer; Level 1 has no towers ----------
 {const g=await G(),b=await G({src:base});const rowsJ="(()=>{const r={};for(const b of bodies)if(!b.dead&&(b.kind==='coin'||b.kind==='silver')&&b.rb.translation().y/M<COIN_HALF*2){const z=Math.round(b.rb.translation().z/M/10)*10;r[z]=(r[z]||0)+1;}return Object.keys(r).sort((a,b)=>a-b).map(k=>r[k]).join(',');})()";
  const lvJ="(()=>{const l=pglLevel();return {name:l.name,tag:l.tag,goal:l.goal,coins:l.coins,secs:l.secs,star:l.star}})()";
  const stJ="bodies.filter(b=>!b.dead&&b.kind==='stack').map(t=>{const p=t.rb.translation();return {n:t.n,x:Math.round(p.x/M),z:Math.round(p.z/M),bottom:+(p.y/M-t.half).toFixed(1)}})";
  const pzJ="bodies.filter(b=>!b.dead&&b.kind!=='stack'&&b.kind!=='coin'&&b.kind!=='silver').map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),Math.round(p.x/M),Math.round(p.z/M)]}).sort()";
  const rows=[],bad={grid:[],start:[],stand:[],same:[],pos:[],pieces:[],replay:[]};const table=[];
  for(let n=1;n<=10;n++){level(g,n);level(b,n);g.ticks(2);b.ticks(2);
   const r=g.run(rowsJ),st=J(g,stJ),sb=J(b,stJ),start=+g.run('w43PlainCount()')+st.reduce((s,t)=>s+t.n,0);
   table.push({level:n,name:g.run('pglLevel().name'),start,towersBefore:sb.map(t=>t.n),towersAfter:st.map(t=>t.n)});
   if(r!=='5,6,6,6,6,6,6,6,6'||+g.run('w43PlainCount()')!==53)bad.grid.push(n);if(start>80)bad.start.push(n);
   if(st.some(t=>Math.abs(t.bottom-(+g.run('COIN_HALF*2')))>.6))bad.stand.push([n,st.map(t=>t.bottom)]);
   if(JSON.stringify(J(g,lvJ))!==JSON.stringify(J(b,lvJ)))bad.same.push(n);
   if(n>1&&(st.length!==sb.length||st.some((t,i)=>Math.hypot(t.x-sb[i].x,t.z-sb[i].z)>3)))bad.pos.push(n);
   // every prize, rain coin and Quake of the level's definition sits at its designed spot (within 8 units)
   const miss=J(g,`(()=>{const L=pglLevel(),want=[...L.p.map(([id,x,y])=>['item',id,x,y]),...(L.rain||[]).map(([k,x,y])=>[k,null,x,y]),...(L.quake?[['quake',null,L.quake[0],L.quake[1]]]:[])],used=new Set(),out=[];
     for(const [k,id,x,y] of want){const b=bodies.find(b=>!b.dead&&!used.has(b)&&b.kind===k&&(id==null||b.id===id)&&Math.hypot(b.rb.translation().x/M-x,b.rb.translation().z/M-y)<8);if(b)used.add(b);else out.push([k,id,x,y]);}return out;})()`);
   if(miss.length)bad.pieces.push([n,miss]);
   const s1=J(g,pzJ);level(g,n);g.ticks(2);const s2=J(g,pzJ);if(s1.length!==s2.length||s1.some((x,i)=>x[0]!==s2[i][0]||Math.hypot(x[1]-s2[i][1],x[2]-s2[i][2])>2)||g.run(rowsJ)!==r)bad.replay.push(n);}
  notes.levels=table;console.log(JSON.stringify(table));
  check('1.1 every level opens on the full grid: 9 rows (5, then 8 x 6) = 53 coins, no gaps',!bad.grid.length,bad.grid);
  check('1.2 every level starts at 80 coins or fewer (grid + tower coins); Level 1 and 3 have no towers',!bad.start.length&&table[0].towersAfter.length===0,table.map(t=>t.start));
  check('1.3 towers stand on the grid coins (their base at the grid top), not on the table',!bad.stand.length,bad.stand);
  check('1.4 each level keeps its name, goal, tag, coins, time and star prize',!bad.same.length,bad.same);
  check('1.5 towers keep their positions (only shorter); prizes, rain coins and Quake sit at their designed spots',!bad.pos.length&&!bad.pieces.length,{pos:bad.pos,pieces:bad.pieces});
  check('1.6 every replay starts the same',!bad.replay.length,bad.replay);
  // still standing, grid intact, prizes on top one second after GO
  const after=[];for(let n=1;n<=10;n++){level(g,n);startRound(g);g.ticks(60);after.push([n,g.run(rowsJ),J(g,stJ).length,+g.run("bodies.filter(b=>!b.dead&&b.kind==='item'&&(b.twTop||b.pglOn)&&b.rb.translation().y/M>20).length")]);}
  const ok=after.every(([n,r,k])=>r==='5,6,6,6,6,6,6,6,6'&&k===table[n-1].towersAfter.length)&&after[4][3]===5&&after[5][3]===1&&after[7][3]===5&&after[9][3]===5;
  check('1.7 one second after GO: grid intact, every tower standing, tower-top prizes still on top',ok,after);
  check('1.8 no frame errors',!errs(g).length,errs(g));}
 // ---------- 2. the cap: Level 1, then Level 6 as the Ragdoll with Hug (Jenny's freeze path) ----------
 for(const [n,cat,hug] of [[1,null,false],[6,'ragdoll',true]]){const g=await G({render:false});level(g,n,cat);if(hug)g.run("PG.powers={ragdoll:2};");startRound(g);
  if(hug){const B=J(g,'pgpButton()');g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(2);}
  const f=flood(g);notes['flood-L'+n]=f;
  check(`2.${n===1?1:2} Level ${n}${cat?' as the '+cat+(hug?' with Hug':''):''}: a hold-flood reaches the 45 own-coin limit, then drops slow to about 1 a second; "Board full" shows (front hint and message line); the rest stay in the bank`,f.own>=45&&f.own<=45+30&&f.full>0&&f.msg>0&&f.floatSeen>0&&f.bank>0&&f.peak<=120,f);
  // at the limit: a 5 s hold drops about 5 coins (not 25)
  g.run("if(!globalThis.__dropN){globalThis.__dropN=0;const td=tryDrop;tryDrop=function(a){const r=td(a);if(r)__dropN++;return r;};}");
  if(g.run("WILD.phase==='play'")&&g.run('cp48Full()')){const scr=g.run('cp48Screen()'),d0=+g.run('__dropN');g.pointer('pointerdown',200,Y(g));g.tick();const hold0=J(g,`({holding,tap:diagSession.taps.at(-1),wild:Object.entries(WILD).filter(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)).map(([k])=>k),arr:Object.entries(WILD).filter(([k,v])=>Array.isArray(v)&&v.length).map(([k,v])=>k+':'+v.length),pgu:Object.entries(PGU).filter(([k,v])=>v&&typeof v==='object'&&!Array.isArray(v)).map(([k])=>k),pending:pendingDrops.length})`);for(let k=0;k<3&&!g.run('holding');k++){g.pointer('pointerup',200,Y(g));g.ticks(40);g.pointer('pointerdown',200,Y(g));g.tick();} // a tap taken by a short board event (e.g. the Paw save glow): press again
   g.ticks(299);g.pointer('pointerup',200,Y(g));const d=+g.run('__dropN')-d0;
   check(`2.${n===1?3:4} Level ${n}: at the limit a 5 s hold drops about 5 coins (one a second)`,(d>=4&&d<=6)||(d===0&&/\+(pet|petgame|dance|toss|laser|pounce)/.test(scr)),{dropped:d,own:+g.run('cp48Own()'),screen:scr,hold0});}
  else check(`2.${n===1?3:4} Level ${n}: at the limit a 5 s hold drops about 5 coins (one a second)`,false,{phase:g.run('WILD.phase'),own:+g.run('cp48Own()')});
  // under the limit again: normal speed
  g.run("{let m=cp48Own()-40;for(const b of bodies.filter(b=>!b.dead&&b.input&&(b.kind==='coin'||b.kind==='silver')))if(m-->0)removeCoin(b);}S.coins=Math.max(S.coins,20);board.remaining=S.coins;");
  {const d0=+g.run('__dropN');g.pointer('pointerdown',200,Y(g));g.ticks(60);g.pointer('pointerup',200,Y(g));const d=+g.run('__dropN')-d0;
   check(`2.${n===1?'3b':'4b'} Level ${n}: under the limit again, a 1 s hold drops at the normal speed`,d>=3,{dropped:d});}
  check(`2.${n===1?5:6} Level ${n}: no frame errors; sound on`,!errs(g).length&&g.st.created>100,{errs:errs(g),nodes:g.st.created});}
 // frame cost after the same flood vs UAT 62
 {const r={};for(const [k,s] of [['uat64',src],['uat62',base]]){const g=await G({src:s,render:false,seed:7});level(g,6,'ragdoll');startRound(g);const f=flood(g);let ms=0;for(let i=0;i<120;i++){const a=g.realNow();g.tick();ms+=g.realNow()-a;}r[k]={peak:f.peak,bodies:+g.run('bodies.length'),msPerTickWhileFlooding:f.msPerTick,msPerTickAfter:+(ms/120).toFixed(1)};}
  notes.frameCost=r;check('2.7 after the same flood the board holds fewer coins than UAT 62 and costs less (desktop ms per tick)',r.uat64.peak<r.uat62.peak&&r.uat64.msPerTickAfter<r.uat62.msPerTickAfter,r);}
 // rain past the cap: the gold 5 budget starts at 100
 {const g=await G({render:false});level(g,1);startRound(g);flood(g,20);g.run("{let k=0;while(w43PlainCount()<100&&k<60){addCoin('coin',null,120+(k%5)*40,30+(k/5|0)*4,340,yawTurn(0));k++;}}");g.ticks(30);const p0=plain(g);g.run('w2Rain(40,.02)');g.ticks(120);
  check('2.8 a coin rain past 100 plain coins lands as gold 5s (1 in 5), not 40 more plain coins',plain(g)<=p0+3&&+g.run('WILD.gold5||0')>=1,{before:p0,after:plain(g),gold5:+g.run('WILD.gold5||0')});}
 // ---------- 3. the main screen after a flood, both ways out ----------
 for(const way of ['end card "Main screen"','in-round "Board" button']){const g=await G({render:true,seed:7});level(g,6,'ragdoll');g.run("PG.powers={ragdoll:2};");startRound(g);flood(g);
  let t0;
  if(way.includes('Board')){const b=J(g,'wildButton()');t0=g.realNow();g.tap(b.x+b.w/2,b.y+b.h/2);}else{g.until("WILD.phase==='end'",60*90);g.ticks(90);const R=J(g,'wildEndRects()');t0=g.realNow();g.tap(R.back.x+R.back.w/2,R.back.y+R.back.h/2);}
  g.ticks(12);const ms=g.realNow()-t0;g.c.draw();
  const scr=g.run('PGU.screen');const res=[];
  const R=J(g,'(()=>{const R=pgMainRects();return {side:(R.side||[]).map(b=>({id:b.id,hit:b.hit})),play:(PGA.L&&PGA.L.play)||R.play}})()');
  for(const s of R.side){g.tap(s.hit.x+s.hit.w/2,s.hit.y+s.hit.h/2);g.ticks(30);const got=J(g,'{screen:PGU.screen,pick:!!PGU.pick}');res.push([s.id,got.screen+(got.pick?'+cats':'')]);
   g.run("PGU.pick=false;PGU.door=null;if(PGU.screen!=='main')pgGo('board');");g.ticks(20);}
  g.tap(R.play.x+R.play.w/2,R.play.y+R.play.h/2);const go=g.until("WILD.phase==='play'",900);
  const taps=J(g,'diagSession.taps.map(t=>t[3])');
  check(`3.${way.includes('Board')?2:1} after a flood, ${way} reaches the PLAY screen and every side button and PLAY respond`,scr==='main'&&res.every(r=>r[1]!=='main')&&go&&!errs(g).length,{screen:scr,ms:Math.round(ms),buttons:res,play:go,taps});
  notes['exit-'+(way.includes('Board')?'board':'main')]={ms:Math.round(ms),buttons:res};
  if(!way.includes('Board'))shot(g,'after-flood-play');}
 // ---------- 4. logging ----------
 {const storage={};const g=await G({storage});level(g,1);startRound(g);
  for(let i=0;i<250;i++)g.run(`diagEvent('t',${i})`);
  check('4.1 the event ring keeps the last 200',+g.run('diagSession.events.length')===200&&g.run('diagSession.events[199][2]')==249);
  // a long frame (the real frame body with 150 ms since the last frame)
  g.run('last=performance.now()-150;frameBody(performance.now())');
  const lf=J(g,"diagSession.events.filter(e=>e[1]==='long-frame').map(e=>e[2])");
  check('4.2 a frame over 100 ms is logged with its screen and coin count',lf.length===1&&lf[0].screen==='board:play'&&lf[0].coins>=50&&lf[0].ms>=150,lf);
  g.run('last=performance.now()-16;frameBody(performance.now())');
  // taps with their target
  const b=J(g,'pgpButton?pgpButton():null');g.tap(200,Y(g));g.ticks(2);
  const tp=J(g,'diagSession.taps');check('4.3 the last taps are kept (at most 10) with what took them and the screen',tp.length>=1&&tp.length<=10&&tp.at(-1)[3]==='board'&&tp.at(-1)[4]==='board:play',tp.slice(-2));
  // screen changes and round end with its peak
  g.run('last=performance.now()-16;frameBody(performance.now())');g.run("WILD.left=.05");for(let i=0;i<20;i++){g.tick();}g.run('last=performance.now()-16;frameBody(performance.now())');
  const ev=J(g,"diagSession.events.filter(e=>e[1]==='screen'||e[1]==='round-end').map(e=>[e[1],e[2]])");
  check('4.4 screen changes are logged, and the round end with its peak coins',ev.some(e=>e[0]==='screen'&&/board:end/.test(e[1]))&&ev.some(e=>e[0]==='round-end'&&e[1].peakCoins>=50),ev.slice(-3));
  check('4.5 peak coins for the session',+g.run('diagSession.peakCoins')>=53,{peak:+g.run('diagSession.peakCoins')});
  // saved every 5 s during a round, even while holding
  level(g,1);startRound(g);g.pointer('pointerdown',200,Y(g));delete storage['catpusher.uat.diagnostics.v1'];
  for(let i=0;i<6*60;i++){g.tick();g.run('last=performance.now()-16.7;frameBody(performance.now())');}
  const held=!!storage['catpusher.uat.diagnostics.v1'];g.pointer('pointerup',200,Y(g));
  check('4.6 the log is saved every 5 s during a round, even while holding',held&&g.run('holding')===false);
  // the first error saves the log at once
  delete storage['catpusher.uat.diagnostics.v1'];g.run("frameError(new Error('cp48 test'))");
  const saved=storage['catpusher.uat.diagnostics.v1']||'';
  check('4.7 the first error saves the log at once, with the state and last taps',/first-error/.test(saved)&&/cp48 test/.test(saved)&&/first-error-state/.test(saved));
  // the next session keeps all of it as "previous"
  const g2=await game({src,render:false,storage});const prev=J(g2,'{events:diagPrevious.events.length,taps:diagPrevious.taps.length,peak:diagPrevious.peakCoins,inPayload:/first-error/.test(diagPayload())}');
  check('4.8 the next launch keeps that session (200 events, taps, peak) in the log',prev.events>40&&prev.taps>=1&&prev.peak>=53&&prev.inPayload,prev);}
 // ---------- 5. scope ----------
 {const a=fs.readFileSync(base,'utf8'),b=fs.readFileSync(src,'utf8');const mod=fs.readFileSync(path.join(__dirname,'cp48.js'),'utf8').replace(/\r\n/g,'\n');
  let c=b.replace(/\r\n/g,'\n').replace(mod+'\n','');const swaps=[["const BUILD = '2026.11.15 UAT 64';","const BUILD = '2026.11.14 UAT 62';"],["towers:[],rain:[['rain10',200,705]","towers:'default',rain:[['rain10',200,705]"],
   ["wall:[4,5,7,5,4],rain:[['rain10',200,650],['rain5',200,718]]","wall:[13,18,23,18,13],rain:[['rain10',200,650],['rain5',200,718]]"],["wall:[4,5,7,5,4],rain:[['rain10',200,650]],quake:[110,640]","wall:[13,18,23,18,13],rain:[['rain10',200,650]],quake:[110,640]"],["wall:[4,6,7,6,4]","wall:[16,21,23,21,16]"],
   ["blocks:[[[200,417,5],[147,470,5],[200,470,7],[253,470,5],[200,523,5]]]","blocks:[[[200,417,10],[147,470,10],[200,470,13],[253,470,10],[200,523,10]]]"],["blocks:[[[173,415,5],[227,415,5],[173,468,5],[227,468,5],[200,370,7]]]","blocks:[[[173,415,9],[227,415,9],[173,468,9],[227,468,9],[200,370,12]]]"],["],200)","],40)"],["events:s.events.slice(-200),taps:Array.isArray(s.taps)?s.taps.slice(-10):[]","events:s.events.slice(-40)"],["raw.length<400000","raw.length<150000"]];
  for(const [x,y] of swaps)c=c.replace(x,y);
  check('5.1 the source differs from UAT 62 only by the CP-48 module and its listed swaps (build label, Level 1 towers, 5 tower heights, log size) (pickup, art, sounds untouched)',c===a.replace(/\r\n/g,'\n'));}
 const res={build:src,base,passed:failed.length===0,count:passed.length+failed.length,failed,names:passed,notes,at:new Date().toISOString()};
 fs.writeFileSync(path.join(OUT,'checks64.json'),JSON.stringify(res,null,1));console.log(passed.length+'/'+(passed.length+failed.length)+' passed');console.log(JSON.stringify(notes));
})();
