// CP-33 checks on the real game runtime (Rapier physics, shipped script). No phone timing claims.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence');
fs.mkdirSync(OUT,{recursive:true});
const results=[];let el;const pass=(name,data={})=>{results.push({name,...data});console.log('PASS',name,JSON.stringify(data));};
// Real payout: move a prize just past the front edge and below the table; the next physics step runs fallOff.
const payout=(g,id,x=200)=>vm.runInContext(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(!b)return false;
 b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`,g.c);
const secs=(g,s,fn)=>{for(let i=0;i<Math.round(s*60);i++){g.tick();fn&&fn(i);}};
const run=(g,s)=>vm.runInContext(s,g.c);
(async()=>{
 // 1+2. Arc lands on the Inventory tile on all three boards; bounce and chime at arrival; credit/save at payout.
 for(const bi of [0,1,2]){
  const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(${bi});S.coins=200;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id),id=ids[0],before=a.S.got[id]||0;
  run(g,'globalThis.__chimes=0;sfx.itemCollected=()=>{__chimes++;}');const chimes0=()=>run(g,'__chimes');
  assert(payout(g,id,[110,290,200][bi]));g.tick();
  assert.equal(a.treatAwards.length,1);const f=a.treatAwards[0];assert.equal(a.S.got[id],before+1,'credit at payout (saved)');
  const start={x:f.x0,y:f.y0},tg=a.pickupTarget(),end=a.pickupPoint(f,1);
  assert(Math.abs(end.x-tg.x)<1e-9&&Math.abs(end.y-tg.y)<1e-9);
  const tile=a.inventoryButton();assert(tg.x===tile.x+tile.w/2&&tg.y===tile.y+tile.h/2);
  let arrivedAt=null,bouncePeak=1;const t0=f.t;
  let peakY=1e9;for(let k=0;k<=100;k++)peakY=Math.min(peakY,a.pickupPoint(f,k/100).y);peakY=+peakY.toFixed(1);
  secs(g,1,i=>{if(arrivedAt===null&&f.arrived){arrivedAt=+(f.t).toFixed(3);assert.equal(chimes0(),1);}bouncePeak=Math.max(bouncePeak,a.inventoryTileScale());});
  assert(arrivedAt>=.7-1e-6&&arrivedAt<.7+1/60+1e-6,'arrives at ~0.7 s: '+arrivedAt);assert(Math.abs(start.y-peakY-160)<1.5,'arc rise '+(start.y-peakY));assert.equal(a.treatAwards.length,0);
  assert(Math.abs(bouncePeak-1.2)<.02,'bounce peak '+bouncePeak);assert.equal(a.inventoryTileScale(),1);
  pass('arc ends on Inventory tile, board '+(bi+1),{prize:id,start:{x:+start.x.toFixed(1),y:+start.y.toFixed(1)},tileCentre:tg,arrivalSec:arrivedAt,arcPeakY:peakY,arcRisePx:+(start.y-peakY).toFixed(1),bouncePeak:+bouncePeak.toFixed(3),chimesAtArrival:chimes0(),creditedAtPayout:true});
  g.close();
 }
 // 3. A hold keeps dropping through a pickup, at the finger.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=300;`);
  g.pointer('pointerdown',120,520);secs(g,.5);const id=a.BOARD.targets[0].id;assert(payout(g,id));
  const usedBefore=a.board.used,dropsBefore=run(g,'diagSession.drops.length');let sawFlight=false;
  secs(g,1,()=>{if(a.treatAwards.length)sawFlight=true;});
  const drops=run(g,'diagSession.drops').slice(dropsBefore);
  assert(sawFlight&&run(g,'holding'));assert(drops.length>=4,'drops '+drops.length);
  const xs=drops.map(d=>d[1]);assert(xs.every(x=>Math.abs(x-xs[0])<.01));
  pass('hold keeps dropping through a pickup',{dropsDuringOneSecond:drops.length,coinsUsed:a.board.used-usedBefore,inputCanvasX:xs[0],releaseWorldX:drops.map(d=>d[3]),holding:true});
  g.pointer('pointerup',120,520);g.close();}
 // 4. Five prizes in quick succession: each flies on its own; nothing waits; sparkles capped.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.coins=300;board.status='playing';`);
  const ids=['cheese','shrimp','tuna','cheese','shrimp'],t0=run(g,'time');let maxActive=0,maxSpark=0;
  ids.forEach((id,i)=>{a.queueTreatAward(id,100+i*50,null);secs(g,.05);});
  secs(g,1,()=>{maxActive=Math.max(maxActive,a.treatAwards.length);maxSpark=Math.max(maxSpark,a.sparkles.filter(s=>s.on).length);});
  const elapsed=run(g,'time')-t0;assert.equal(a.treatAwards.length,0);assert(maxSpark<=24);
  assert(Math.abs(elapsed-1.25)<.03,'game time advanced normally '+elapsed);
  pass('five prizes in quick succession',{queuedOverSec:.25,allDoneWithinSec:1.25,maxSimultaneousFlights:maxActive,maxSparkles:maxSpark,sparkleCap:24,gameTimeAdvancedSec:+elapsed.toFixed(3)});
  g.close();}
 // 5. Tapping during a pickup drops a coin.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=300;board.status='playing';`);
  secs(g,.3);a.queueTreatAward('cheese',200,null);secs(g,.1);const used=a.board.used,coins=a.S.coins;
  assert(a.treatAwards.length===1);g.pointer('pointerdown',260,520);g.tick();g.pointer('pointerup',260,520);secs(g,.2);
  assert(a.board.used>used||a.S.coins<coins,'tap dropped');pass('tap during a pickup drops a coin',{usedBefore:used,usedAfter:a.board.used});g.close();}
 // 6. Final prize clears the board: flight lands, then BOARD CLEAR!, then Rest, then next board.
 for(const bi of [0,1,2]){const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(${bi});S.coins=200;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id);for(const id of ids.slice(0,-1)){run(g,`board.collected.push('${id}')`);run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(b)removeCoin(b);})()`);}
  assert(payout(g,ids.at(-1)));const ev={};let f=0;
  for(;f<60*8&&a.boardIndex===bi;f++){g.tick();const t=+(f/60).toFixed(3);
   if(ev.won===undefined&&a.board.status==='won')ev.won=t;
   if(ev.landed===undefined&&a.board.status==='won'&&!a.treatAwards.length)ev.landed=t;
   if(ev.clear===undefined&&run(g,"callouts.some(c=>c.word==='BOARD CLEAR!'&&c.started)"))ev.clear=t;
   if(ev.rest===undefined&&a.isRestPose())ev.rest=t;}
  ev.next=+(f/60).toFixed(3);assert(a.boardIndex!==bi);
  assert(ev.won<=ev.landed&&ev.landed<=ev.clear&&ev.clear<ev.rest&&ev.rest<ev.next,JSON.stringify(ev));
  pass('clear order with final prize, board '+(bi+1),ev);g.close();}
 // 8. Lost prize: a target leaving by the side gutter greys, sinks and ripples; the board is lost (existing rule).
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=200;board.status='playing';`);
  const id=a.BOARD.targets[0].id;
  run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:(T.R+30)*M,y:-0.5,z:600*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
  g.tick();assert.equal(a.lostFx.length,1);assert.equal(a.board.status,'lost');const fallingPrize=run(g,"falling.some(f=>f.kind==='item')");assert(!fallingPrize);
  secs(g,.31);assert.equal(a.lostFx.length,0);
  pass('lost prize: grey sink and ripple at the gutter',{prize:id,boardStatus:a.board.status,reason:a.board.endReason,sinkSec:a.pickupFx.sink,oldGutterSpriteDrawn:false});g.close();}
 // 9. Developer controls: hidden when off; persist; in the performance log.
 {const storage={};const g=await make({sourceFile:SRC,storage});const a=g.c.__game;
  const panel=run(g,'panel');el=()=>({onclick:null,querySelector:()=>el(),querySelectorAll:()=>[],textContent:'',style:{}});
  panel.querySelector=sel=>(sel==='#pfx'&&!/id="pfx"/.test(panel.innerHTML))?null:el();panel.querySelectorAll=()=>[];panel.scrollTop=0;
  run(g,'S.dev=false;openCredits()');const off=panel.innerHTML;assert(!/pfx|Pickup style|Prize feedback/.test(off));
  run(g,'S.dev=true;openCredits()');const on=panel.innerHTML;assert(/Preview pickup/.test(on)&&/Preview lost prize/.test(on)&&/Flight time: 0.7 s/.test(on)&&/End size: 0.5x/.test(on)&&/Arc height: 160 px/.test(on)&&/Arc side: straight up/.test(on)&&/Bounce size: 1.2x/.test(on));
  a.stepPickupFx('flight',1);a.stepPickupFx('sparkles',-1);a.stepPickupFx('bounce',1);a.stepPickupFx('arcHeight',1);a.stepPickupFx('arcSide',-1);
  const log=JSON.parse(run(g,'diagPayload()'));assert.equal(log.pickupTuning.flight,.75);assert.equal(log.pickupTuning.sparkles,9);assert.equal(log.pickupTuning.arcHeight,170);assert.equal(log.pickupTuning.arcSide,-.25);
  g.close();const g2=await make({sourceFile:SRC,storage});assert.equal(g2.c.__game.pickupFx.flight,.75);assert.equal(g2.c.__game.pickupFx.arcSide,-.25);assert.equal(g2.c.__game.pickupFx.bounce,1.25);
  {const p2=run(g2,'panel');p2.querySelector=()=>el();p2.querySelectorAll=()=>[];}run(g2,'S.dev=true;openCredits()');assert(/Flight time: 0.75 s/.test(run(g2,'panel').innerHTML)&&/Arc side: left 0.25/.test(run(g2,'panel').innerHTML));
  pass('developer tuning hidden when off, persists, in log',{logPickupTuning:log.pickupTuning,persistedAfterReload:{...g2.c.__game.pickupFx}});g2.close();}
 // 10. Old styles unreachable.
 {const src=fs.readFileSync(SRC,'utf8');for(const s of ['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused','drawPawMedallion(W/2'])assert(!src.includes(s),s);
  pass('Paw, ribbon, bubble and style setting removed',{searched:['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused']});}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({source:'work/cp33/release.html',runtime:'real shipped script + Rapier, desktop node',passed:results},null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
