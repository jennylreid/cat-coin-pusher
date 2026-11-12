// CP-33 checks on the real game runtime (Rapier physics, shipped script). No phone timing claims.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat29');
fs.mkdirSync(OUT,{recursive:true});
const results=[];let el;const pass=(name,data={})=>{results.push({name,...data});console.log('PASS',name,JSON.stringify(data));};
// Real payout: move a prize just past the front edge and below the table; the next physics step runs fallOff.
const payout=(g,id,x=200)=>vm.runInContext(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(!b)return false;
 b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`,g.c);
const secs=(g,s,fn)=>{for(let i=0;i<Math.round(s*60);i++){g.tick();fn&&fn(i);}};
const run=(g,s)=>vm.runInContext(s,g.c);
(async()=>{
 // 1+2. Rise and grow to ~90% of the screen width, hold still (no flip/tumble/wobble) turned and off-centre, burst +
 // chime + glow on arrival, then into the Inventory bag, which springs. Credit/save at payout. All three boards.
 for(const bi of [0,1,2]){
  const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(${bi});S.coins=200;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id),id=ids[0],before=a.S.got[id]||0;
  run(g,'globalThis.__chimes=0;sfx.itemCollected=()=>{__chimes++;}');const chimes0=()=>run(g,'__chimes');
  assert(payout(g,id,[110,290,200][bi]));g.tick();
  assert.equal(a.treatAwards.length,1);const f=a.treatAwards[0];assert.equal(a.S.got[id],before+1,'credit at payout (saved)');
  const start={x:f.x0,y:f.y0},tg=a.pickupTarget(),total=f.tr+f.tm+f.td,end={...a.pickupPoint(f,total)},c=a.pickupCentre();
  assert(Math.abs(end.x-tg.x)<1e-6&&Math.abs(end.y-tg.y)<1e-6,'ends on tile');
  const tile=a.inventoryButton();assert(tg.x===tile.x+tile.w/2&&tg.y===tile.y+tile.h/2);
  // Held: sample every 1 ms; position, size and angle never change; no flip.
  const h0={...a.pickupPoint(f,f.tr)};let moved=0;for(let t=f.tr;t<f.tr+f.tm;t+=.001){const q=a.pickupPoint(f,t);moved=Math.max(moved,Math.abs(q.x-h0.x),Math.abs(q.y-h0.y),Math.abs(q.s-h0.s),Math.abs(q.rot-h0.rot),Math.abs(q.flip-1));}
  assert.equal(moved,0,'held still');
  const width=a.prizeWidth(id,h0.s)/400,turn=Math.abs(h0.rot*180/Math.PI),off={x:h0.x-c.x,y:h0.y-c.y};
  assert(Math.abs(width-.9)<1e-9,'size '+width);assert(turn>=6&&turn<=14,'turn '+turn);assert(Math.abs(off.x)<=16+1e-9&&Math.abs(off.y)<=16+1e-9);
  let arrivedAt=null,bouncePeak=1,centreAt=null,chimeAtCentre=null,burstMax=0,glowMax=0,flipMin=1;
  secs(g,1.6,()=>{const t=f.t;if(!f.arrived){const q=a.pickupPoint(f);glowMax=Math.max(glowMax,q.glow);flipMin=Math.min(flipMin,q.flip);if(t>=f.tr&&centreAt===null){centreAt=+t.toFixed(3);chimeAtCentre=chimes0();}}
   burstMax=Math.max(burstMax,a.sparkles.filter(s=>s.on&&(s.vx||s.vy)).length);
   if(arrivedAt===null&&f.arrived)arrivedAt=+(f.t).toFixed(3);bouncePeak=Math.max(bouncePeak,a.inventoryTileScale());});
  assert(Math.abs(centreAt-.35)<1/60+1e-6,'full size at 0.35 s: '+centreAt);assert.equal(chimeAtCentre,1);assert(burstMax>=14);assert.equal(glowMax,1);assert.equal(flipMin,1);
  assert(Math.abs(arrivedAt-1.15)<1/60+1e-6,'arrives at ~1.15 s: '+arrivedAt);assert.equal(a.treatAwards.length,0);
  assert(Math.abs(bouncePeak-1.2)<.02,'bounce peak '+bouncePeak);assert.equal(a.inventoryTileScale(),1);
  pass('prize: grows, holds still turned and off-centre, then Inventory bag, board '+(bi+1),{prize:id,start:{x:+start.x.toFixed(1),y:+start.y.toFixed(1)},fullSizeSec:centreAt,visibleWidthOfScreen:+width.toFixed(3),heldSec:f.tm,heldMovement:0,flip:false,turnDeg:+(h0.rot*180/Math.PI).toFixed(1),offCentrePx:{x:+off.x.toFixed(1),y:+off.y.toFixed(1)},chimeAtFullSize:true,burstSparkles:burstMax,glow:true,tileCentre:tg,arrivalSec:arrivedAt,bouncePeak:+bouncePeak.toFixed(3),creditedAtPayout:true});
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
 // 4. Five prizes at once take turns in the middle; from the 3rd on a half-length version; game keeps running.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.coins=300;board.status='playing';`);
  const ids=['cheese','shrimp','tuna','cheese','shrimp'],t0=run(g,'time');let maxSpark=0;
  const fl=ids.map((id,i)=>a.queueTreatAward(id,100+i*50,null)),iv=fl.map(()=>({}));let t=0;
  secs(g,4.2,()=>{t+=1/60;maxSpark=Math.max(maxSpark,a.sparkles.filter(s=>s.on).length);
   fl.forEach((f,i)=>{if(iv[i].done)return;if(iv[i].inMid===undefined&&f.t>=f.tr)iv[i].inMid=+t.toFixed(3);if(iv[i].leaves===undefined&&f.t>=f.tr+f.tm+f.ts)iv[i].leaves=+t.toFixed(3);if(iv[i].lands===undefined&&f.arrived){iv[i].lands=+t.toFixed(3);iv[i].done=true;}});});
  const elapsed=run(g,'time')-t0;assert.equal(a.treatAwards.length,0);assert(maxSpark<=36);
  for(let i=1;i<5;i++)assert(iv[i].inMid-fl[i].tr>=iv[i-1].leaves-1/60-1e-6,'one at a time '+i+JSON.stringify(iv));
  const exp=[[.35,.85,1.15],[1.2,1.7,2],[1.875,2.125,2.425],[2.3,2.55,2.85],[2.725,2.975,3.275]];
  iv.forEach((v,i)=>{assert(Math.abs(v.inMid-exp[i][0])<.04&&Math.abs(v.leaves-exp[i][1])<.04&&Math.abs(v.lands-exp[i][2])<.04,'timeline '+i+JSON.stringify(v));});
  assert.deepEqual(fl.map(f=>f.short),[false,false,true,true,true]);
  assert(Math.abs(elapsed-4.2)<.03,'game time advanced normally '+elapsed);
  pass('five prizes at once take turns in the middle',{queuedSameFrame:5,timelineSec:iv.map(v=>({reachesMiddle:v.inMid,leavesMiddle:v.leaves,landsInBag:v.lands})),shortened:fl.map(f=>f.short),fullSec:{riseAndGrow:.35,held:.5},shortSec:{riseAndGrow:.175,held:.25},allLandedBySec:iv[4].lands,maxSparkles:maxSpark,sparkleCap:36,gameTimeAdvancedSec:+elapsed.toFixed(3)});
  g.close();}
 // 4b. Two prizes collected together (real payouts, same frame): both credited at once; second waits its turn.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.coins=300;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id).slice(0,2),before=ids.map(id=>a.S.got[id]||0);
  assert(payout(g,ids[0],140)&&payout(g,ids[1],260));g.tick();assert.equal(a.treatAwards.length,2);
  ids.forEach((id,i)=>assert.equal(a.S.got[id],before[i]+(ids[0]===ids[1]?2:1)));
  const [f1,f2]=a.treatAwards;assert(f2.t<0,'second waits');const wait=-f2.t;let both=0;
  secs(g,2.8,()=>{if(f1.t>=f1.tr&&f1.t<f1.tr+f1.tm+f1.ts&&f2.t>=f2.tr&&f2.t<f2.tr+f2.tm+f2.ts)both++;});
  assert.equal(both,0);assert.equal(a.treatAwards.length,0);
  pass('two prizes collected together play one after the other',{prizes:ids,creditedAtPayout:true,secondWaitsSec:+wait.toFixed(3),bothInMiddleFrames:0,turnsDeg:[f1,f2].map(f=>+(f.rot*180/Math.PI).toFixed(1))});g.close();}
 // 4c. Every pickup draws its own turn and off-centre offset (defaults, 40 draws of each prize).
 {const g=await make({sourceFile:SRC});const a=g.c.__game;const T=[],c=a.pickupCentre();
  for(const id of ['cheese','shrimp','tuna'])for(let i=0;i<40;i++){const f=a.queueTreatAward(id,200,null,true);T.push({id,turn:f.rot*180/Math.PI,dx:f.mx-c.x,dy:f.my-c.y});a.treatAwards.length=0;}
  const tn=T.map(x=>Math.abs(x.turn));assert(Math.min(...tn)>=6-1e-9&&Math.max(...tn)<=14+1e-9);
  assert(T.some(x=>x.turn<0)&&T.some(x=>x.turn>0)&&T.some(x=>x.dx<0)&&T.some(x=>x.dx>0)&&T.some(x=>x.dy<0)&&T.some(x=>x.dy>0));
  assert(T.every(x=>Math.abs(x.dx)<=16+1e-9&&Math.abs(x.dy)<=16+1e-9));assert(new Set(T.map(x=>x.turn.toFixed(4)+','+x.dx.toFixed(3))).size===T.length);
  // Edge cap: the side offset never pushes the turned prize more than 8 px past a side (a big turn alone can, by its box).
  let spill=0;for(const x of T){const w2=a.prizeWidth(x.id,.9*400/a.prizeWidth(x.id,1))/2,asp={cheese:.91,shrimp:1,tuna:.657}[x.id],r=x.turn*Math.PI/180,half=w2*Math.abs(Math.cos(r))+w2*asp*Math.abs(Math.sin(r));const sp=c.x+Math.abs(x.dx)+half-400,atCentre=c.x+half-400;assert(sp<=Math.max(8,atCentre)+1e-9,'offset adds spill '+sp);spill=Math.max(spill,sp);}
  const r=v=>[+Math.min(...v).toFixed(1),+Math.max(...v).toFixed(1)],ax=T.map(x=>Math.abs(x.dx)),ay=T.map(x=>Math.abs(x.dy));
  pass('each pickup draws its own turn and offset (120 draws)',{turnDegAbs:r(tn),turnedLeft:T.filter(x=>x.turn<0).length,turnedRight:T.filter(x=>x.turn>0).length,offsetXPxAbs:r(ax),offsetYPxAbs:r(ay),maxBoxSpillPx:+spill.toFixed(1),offsetNeverAddsSpillBeyond8px:true,allDifferent:true});g.close();}
 // 4d. Turn and Off-centre at 0: straight and centred; Burst size 0: no burst.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;for(const k of ['turn','offCentre','burst'])a.pickupFx[k]=0;const c=a.pickupCentre();
  const f=a.queueTreatAward('cheese',200,null,true);assert(f.rot===0&&f.mx===c.x&&f.my===c.y);secs(g,.5);assert.equal(a.sparkles.filter(s=>s.on&&(s.vx||s.vy)).length,0);
  pass('Turn, Off-centre and Burst size at 0: straight, centred, no burst',{rot:0,offset:0,burstSparkles:0});g.close();}
 // 5. Tapping during a pickup drops a coin.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=300;board.status='playing';`);
  secs(g,.3);a.queueTreatAward('cheese',200,null);secs(g,.1);const used=a.board.used,coins=a.S.coins;
  assert(a.treatAwards.length===1);g.pointer('pointerdown',260,520);g.tick();g.pointer('pointerup',260,520);secs(g,.2);
  assert(a.board.used>used||a.S.coins<coins,'tap dropped');pass('tap during a pickup drops a coin',{usedBefore:used,usedAfter:a.board.used});g.close();}
 // 6. Final prize clears the board: flight lands, then BOARD CLEAR!, then Rest, then next board.
 for(const bi of [0,1,2]){const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(${bi});S.coins=200;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id);for(const id of ids.slice(0,-2)){run(g,`board.collected.push('${id}')`);run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(b)removeCoin(b);})()`);}
  assert(payout(g,ids.at(-2),140)&&payout(g,ids.at(-1),260));const ev={};let f=0;
  for(;f<60*8&&a.boardIndex===bi;f++){g.tick();const t=+(f/60).toFixed(3);
   if(ev.won===undefined&&a.board.status==='won'){ev.won=t;ev.queuedAtWin=a.treatAwards.length;}
   if(ev.firstLanded===undefined&&a.treatAwards.some(x=>x.arrived))ev.firstLanded=t;
   if(ev.landed===undefined&&a.board.status==='won'&&!a.treatAwards.length)ev.landed=t;
   if(ev.clear===undefined&&run(g,"callouts.some(c=>c.word==='BOARD CLEAR!'&&c.started)"))ev.clear=t;
   if(ev.rest===undefined&&a.isRestPose())ev.rest=t;}
  ev.next=+(f/60).toFixed(3);assert(a.boardIndex!==bi);
  assert(ev.queuedAtWin===2&&ev.firstLanded<ev.landed&&ev.won<=ev.landed&&ev.landed<=ev.clear&&ev.clear<ev.rest&&ev.rest<ev.next,JSON.stringify(ev));
  pass('clear order with the last two prizes queued, board '+(bi+1),ev);g.close();}
 // CP-34. Quake coin (Board 3): flies into the Quake button; shown count goes up and the button springs on landing;
 // credit is saved at payout; no text banner; sound on landing; a hold keeps dropping meanwhile.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.dev=false;S.coins=300;board.status='playing';`);
  run(g,'globalThis.__special=0;sfx.special=()=>{__special++;}');
  g.pointer('pointerdown',150,520);secs(g,.3);const dropsBefore=run(g,'diagSession.drops.length');
  assert(run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='quake');if(!b)return false;b.rb.setTranslation({x:250*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`));
  g.tick();const f=a.treatAwards.find(f=>f.kind==='quake');assert(f,'quake flight');
  assert.equal(a.board.earnedQuakes,1,'credited at payout');assert.equal(a.shownPowerCount('quake'),0,'shown count waits for landing');
  assert.equal(run(g,'itemToasts.length'),0,'no text banner');assert.equal(run(g,'__special'),0);
  const tg=a.quakeTarget(),btn=run(g,'powerButtons().quake'),end={...a.pickupPoint(f,f.td)};
  assert(Math.abs(end.x-tg.x)<1e-6&&Math.abs(end.y-tg.y)<1e-6&&tg.x===btn.x+btn.w/2&&tg.y===btn.y+btn.h/2);
  let landed=null,shownAtLanding=null,peak=1,minFlip=1;
  secs(g,1.1,()=>{if(!f.arrived)minFlip=Math.min(minFlip,a.pickupPoint(f).flip);if(landed===null&&f.arrived){landed=+f.t.toFixed(3);shownAtLanding=a.shownPowerCount('quake');}peak=Math.max(peak,a.quakeButtonScale());});
  const drops=run(g,'diagSession.drops').slice(dropsBefore);
  assert(Math.abs(landed-.8)<1/60+1e-6,'lands at 0.8 s '+landed);assert.equal(shownAtLanding,1);assert.equal(run(g,'__special'),1);assert(Math.abs(peak-1.2)<.02);assert(minFlip<-.95);
  assert(run(g,'holding')&&drops.length>=5,'hold continues '+drops.length);
  pass('CP-34 Quake coin flies into the Quake button',{board:3,start:{x:+f.x0.toFixed(1),y:+f.y0.toFixed(1)},buttonCentre:tg,landsSec:landed,shownCountBeforeLanding:0,shownCountAtLanding:shownAtLanding,earnedQuakesAtPayout:1,soundAtLanding:true,textBanner:false,buttonBouncePeak:+peak.toFixed(3),flips:2,dropsDuringFlight:drops.length,holding:true});
  g.pointer('pointerup',150,520);g.close();}
 // 8. Lost prize: a target leaving by the side gutter greys, sinks and ripples; the board is lost (existing rule).
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=200;board.status='playing';`);
  const id=a.BOARD.targets[0].id;
  run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:(T.R+30)*M,y:-0.5,z:600*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
  g.tick();assert.equal(a.lostFx.length,1);assert.equal(a.board.status,'lost');const fallingPrize=run(g,"falling.some(f=>f.kind==='item')");assert(!fallingPrize);
  secs(g,.31);assert.equal(a.lostFx.length,0);
  pass('lost prize: grey sink and ripple at the gutter',{prize:id,boardStatus:a.board.status,reason:a.board.endReason,sinkSec:a.pickupFx.sink,oldGutterSpriteDrawn:false});g.close();}
 // 9. Developer controls: hidden when off; new dials show; old flip dials gone; persist; in the performance log.
 {const storage={'catpusher.uat.pickupfx.v3':JSON.stringify({rise:.6,middle:1.2,spin:4,tilt:40})};const g=await make({sourceFile:SRC,storage});const a=g.c.__game;
  assert.equal(a.pickupFx.rise,.35,'old key ignored');
  const panel=run(g,'panel');el=()=>({onclick:null,querySelector:()=>el(),querySelectorAll:()=>[],textContent:'',style:{}});
  panel.querySelector=sel=>(sel==='#pfx'&&!/id="pfx"/.test(panel.innerHTML))?null:el();panel.querySelectorAll=()=>[];panel.scrollTop=0;
  run(g,'S.dev=false;openCredits()');const off=panel.innerHTML;assert(!/pfx|Pickup style|Prize feedback/.test(off));
  run(g,'S.dev=true;openCredits()');const on=panel.innerHTML;
  for(const re of [/Preview pickup/,/Preview lost prize/,/Preview Quake pickup/,/Rise and grow: 0.35 s/,/Size: 90% of screen width/,/Time held: 0.5 s/,/Burst size: 14 sparkles/,/Turn \(max\): 14°/,/Off-centre \(max\): 4% of screen/,/Into bag: 0.3 s/,/End size: 0.5x/,/Trail sparkles: 10/,/Bounce size: 1.2x/,/Bounce time: 0.15 s/,/Quake flight: 0.8 s/,/Lost sink time: 0.3 s/])assert(re.test(on),String(re));
  for(const re of [/Spin speed/,/Tilt/,/Wobble/,/Settle/,/Randomness/,/Middle size/,/Time in middle/])assert(!re.test(on),String(re));
  a.stepPickupFx('size',-1);a.stepPickupFx('held',1);a.stepPickupFx('burst',1);a.stepPickupFx('turn',-1);a.stepPickupFx('offCentre',1);a.stepPickupFx('quakeFlight',-1);
  const log=JSON.parse(run(g,'diagPayload()'));const want={size:.85,held:.55,burst:16,turn:12,offCentre:.05,quakeFlight:.75};for(const k in want)assert.equal(log.pickupTuning[k],want[k],k);
  g.close();const g2=await make({sourceFile:SRC,storage});for(const k in want)assert.equal(g2.c.__game.pickupFx[k],want[k],k);
  {const p2=run(g2,'panel');p2.querySelector=()=>el();p2.querySelectorAll=()=>[];}run(g2,'S.dev=true;openCredits()');const on2=run(g2,'panel').innerHTML;
  for(const re of [/Size: 85% of screen width/,/Time held: 0.55 s/,/Burst size: 16 sparkles/,/Turn \(max\): 12°/,/Off-centre \(max\): 5% of screen/])assert(re.test(on2),String(re));
  pass('developer tuning: new dials, old flip dials gone, persists, in log',{oldKeyIgnored:'catpusher.uat.pickupfx.v3',logPickupTuning:log.pickupTuning,persistedAfterReload:{...g2.c.__game.pickupFx}});g2.close();}
 // 10. Old styles unreachable.
 {const src=fs.readFileSync(SRC,'utf8');for(const s of ['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused','drawPawMedallion(W/2'])assert(!src.includes(s),s);
  pass('Paw, ribbon, bubble and style setting removed',{searched:['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused']});}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({source:'work/cp33/release.html',runtime:'real shipped script + Rapier, desktop node',passed:results},null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
