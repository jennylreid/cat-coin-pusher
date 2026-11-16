// CP-33 checks on the real game runtime (Rapier physics, shipped script). No phone timing claims.
const make=require('./runtime.cjs'),vm=require('vm'),fs=require('fs'),path=require('path'),assert=require('assert/strict');
const SRC=path.resolve(__dirname,'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat34');
fs.mkdirSync(OUT,{recursive:true});
const results=[];let el;const pass=(name,data={})=>{results.push({name,...data});console.log('PASS',name,JSON.stringify(data));};
// Real payout: move a prize just past the front edge and below the table; the next physics step runs fallOff.
const payout=(g,id,x=200)=>vm.runInContext(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(!b)return false;
 b.rb.setTranslation({x:${x}*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`,g.c);
const secs=(g,s,fn)=>{for(let i=0;i<Math.round(s*60);i++){g.tick();fn&&fn(i);}};
const run=(g,s)=>vm.runInContext(s,g.c);
(async()=>{
 // 1+2. Rise and grow to ~90% of the screen width, hold still (no flip/tumble/wobble) turned and off-centre, burst +
 // chime on arrival (no glow since UAT 31), then into the Inventory bag, which springs. Credit/save at payout. All three boards.
 for(const bi of [0,1,2]){
  const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(${bi});S.coins=200;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id),id=ids[0],before=a.S.got[id]||0;
  run(g,"globalThis.__snd=[];sfx.pickup=(k,vol,d)=>{__snd.push([k,vol,d||0,+time.toFixed(3)]);}");const chimes0=()=>run(g,"__snd.filter(x=>x[0]==='bell').length");const tPay=run(g,'time');
  assert(payout(g,id,[110,290,200][bi]));g.tick();
  assert.equal(a.treatAwards.length,1);const f=a.treatAwards[0];assert.equal(a.S.got[id],before+1,'credit at payout (saved)');
  const start={x:f.x0,y:f.y0},tg=a.pickupTarget(),total=f.tr+f.tm+f.td,end={...a.pickupPoint(f,total)},c=a.pickupCentre();
  assert(Math.abs(end.x-tg.x)<1e-6&&Math.abs(end.y-tg.y)<1e-6,'ends on tile');
  const tile=a.inventoryButton();assert(tg.x===tile.x+tile.w/2&&tg.y===tile.y+tile.h/2);
  // Held: sample every 1 ms; position, size and angle never change; no flip.
  const h0={...a.pickupPoint(f,f.tr)};let moved=0;for(let t=f.tr;t<f.tr+f.tm;t+=.001){const q=a.pickupPoint(f,t);moved=Math.max(moved,Math.abs(q.x-h0.x),Math.abs(q.y-h0.y),Math.abs(q.s-h0.s),Math.abs(q.rot-h0.rot),Math.abs(q.flip-1));}
  assert.equal(moved,0,'held still');
  // Spin in: one full flip while growing, facing front exactly at full size; spin out: one flip into the bag.
  let inMin=1,outMin=1;for(let t=0;t<f.tr;t+=.001)inMin=Math.min(inMin,a.pickupPoint(f,t).flip);for(let t=f.tr+f.tm;t<total;t+=.001)outMin=Math.min(outMin,a.pickupPoint(f,t).flip);
  const atFull=a.pickupPoint(f,f.tr-1e-9).flip;assert(inMin<-.99&&outMin<-.99&&Math.abs(atFull-1)<1e-6,'spin '+[inMin,outMin,atFull]);
  const width=a.prizeWidth(id,h0.s)/400,turn=Math.abs(h0.rot*180/Math.PI),off={x:h0.x-c.x,y:h0.y-c.y};
  assert(Math.abs(width-.7)<1e-9,'size '+width);assert(turn>=6&&turn<=14,'turn '+turn);assert(Math.abs(off.x)<=16+1e-9&&Math.abs(off.y)<=16+1e-9);
  let arrivedAt=null,bouncePeak=1,centreAt=null,chimeAtCentre=null,burstMax=0,glowMax=0,flipMin=1,bdRise=null,bdHeld=1,bdAfter=null;
  secs(g,1.6,()=>{const t=f.t,bd=a.backdropLevel();if(bdRise===null&&t>=f.tr/2)bdRise=+bd.toFixed(3);if(t>=f.tr&&t<f.tr+f.tm)bdHeld=Math.min(bdHeld,bd);if(bdAfter===null&&t>=f.tr+f.tm+.3)bdAfter=bd;if(!f.arrived){const q=a.pickupPoint(f);flipMin=Math.min(flipMin,q.flip);if(t>=f.tr&&centreAt===null){centreAt=+t.toFixed(3);chimeAtCentre=chimes0();}}
   burstMax=Math.max(burstMax,a.sparkles.filter(s=>s.on&&(s.vx||s.vy)).length);
   if(arrivedAt===null&&f.arrived)arrivedAt=+(f.t).toFixed(3);bouncePeak=Math.max(bouncePeak,a.inventoryTileScale());});
  assert(Math.abs(centreAt-.35)<1/60+1e-6,'full size at 0.35 s: '+centreAt);assert.equal(chimeAtCentre,1);assert.equal(burstMax,0,'sparkles off by default');assert(bdRise>0&&bdRise<1&&bdHeld===1&&bdAfter===0,'backdrop '+[bdRise,bdHeld,bdAfter]);
  assert(Math.abs(arrivedAt-1.35)<1/60+1e-6,'arrives at ~1.35 s: '+arrivedAt);const snd=JSON.parse(JSON.stringify(run(g,'__snd')));
  assert.deepEqual(snd.map(x=>x.slice(0,3)),[['bell',1,0],['thump',1,0]],'sounds '+JSON.stringify(snd));assert(Math.abs(snd[0][3]-tPay)<=1/60+.001,'bell at the ledge moment '+tPay+JSON.stringify(snd));
  assert(Math.abs(snd[1][3]-snd[0][3]-(f.tr+f.tm+f.td))<2/60+1e-6,'thump at landing '+JSON.stringify(snd));assert.equal(a.treatAwards.length,0);
  assert(Math.abs(bouncePeak-1.2)<.02,'bounce peak '+bouncePeak);assert.equal(a.inventoryTileScale(),1);
  pass('prize: grows to 70%, holds still over the backdrop, then Inventory bag, board '+(bi+1),{prize:id,start:{x:+start.x.toFixed(1),y:+start.y.toFixed(1)},fullSizeSec:centreAt,visibleWidthOfScreen:+width.toFixed(3),heldSec:f.tm,heldMovement:0,spin:{turnsIn:f.spinIn,turnsOut:f.turns,deepestFlipIn:+inMin.toFixed(3),deepestFlipOut:+outMin.toFixed(3),facingFrontAtFullSize:true,spinWhileHeld:false},turnDeg:+(h0.rot*180/Math.PI).toFixed(1),offCentrePx:{x:+off.x.toFixed(1),y:+off.y.toFixed(1)},sounds:{ledgeBellAtPayout:true,bellsAtFullSize:0,bagThumpAtSec:arrivedAt,volume:1},sparkles:burstMax,glow:false,backdrop:{halfwayUpRise:bdRise,whileHeld:bdHeld,gone0_3sAfterLeaving:bdAfter===0},tileCentre:tg,arrivalSec:arrivedAt,bouncePeak:+bouncePeak.toFixed(3),creditedAtPayout:true});
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
  const exp=[];{let lv=0;fl.forEach((f,i)=>{const s=lv+f.tr,l=s+f.tm;exp.push([s,l,l+f.td]);lv=l;});}assert(Math.abs(exp[4][2]-3.975)<1e-9,'timeline sum '+exp[4][2]);
  iv.forEach((v,i)=>{assert(Math.abs(v.inMid-exp[i][0])<.04&&Math.abs(v.leaves-exp[i][1])<.04&&Math.abs(v.lands-exp[i][2])<.04,'timeline '+i+JSON.stringify(v));});
  assert.deepEqual(fl.map(f=>f.short),[false,false,true,true,true]);
  assert(Math.abs(elapsed-4.2)<.03,'game time advanced normally '+elapsed);
  pass('five prizes at once take turns in the middle',{queuedSameFrame:5,timelineSec:iv.map(v=>({reachesMiddle:v.inMid,leavesMiddle:v.leaves,landsInBag:v.lands})),shortened:fl.map(f=>f.short),fullSec:{riseAndGrow:.35,held:.7},shortSec:{riseAndGrow:.175,held:.35},allLandedBySec:iv[4].lands,maxSparkles:maxSpark,sparkleCap:36,gameTimeAdvancedSec:+elapsed.toFixed(3)});
  g.close();}
 // 4b. Two prizes collected together (real payouts, same frame): both credited at once; second waits its turn.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.coins=300;board.status='playing';`);
  const ids=a.BOARD.targets.map(t=>t.id).slice(0,2),before=ids.map(id=>a.S.got[id]||0);
  assert(payout(g,ids[0],140)&&payout(g,ids[1],260));g.tick();assert.equal(a.treatAwards.length,2);
  ids.forEach((id,i)=>assert.equal(a.S.got[id],before[i]+(ids[0]===ids[1]?2:1)));
  const [f1,f2]=a.treatAwards;assert(f2.t<0,'second waits');const wait=-f2.t;let both=0,bdMin=1,jump=0,prev=null;
  secs(g,2.8,()=>{const P=a.PANEL;if(prev&&P.on)jump=Math.max(jump,Math.abs(P.x-prev.x),Math.abs(P.y-prev.y),Math.abs(P.w-prev.w),Math.abs(P.h-prev.h));prev=P.on?{...P}:null;if(f1.t>=f1.tr&&f2.t<f2.tr+f2.tm)bdMin=Math.min(bdMin,a.backdropLevel());if(f1.t>=f1.tr&&f1.t<f1.tr+f1.tm+f1.ts&&f2.t>=f2.tr&&f2.t<f2.tr+f2.tm+f2.ts)both++;});
  assert.equal(both,0);assert.equal(a.treatAwards.length,0);assert.equal(bdMin,1,'backdrop stays up between turns');assert(jump<12,'panel eases '+jump);
  pass('two prizes collected together play one after the other',{prizes:ids,creditedAtPayout:true,secondWaitsSec:+wait.toFixed(3),bothInMiddleFrames:0,backdropMinBetweenTurns:bdMin,panelLargestStepPerFramePx:+jump.toFixed(2),turnsDeg:[f1,f2].map(f=>+(f.rot*180/Math.PI).toFixed(1))});g.close();}
 // 4c. Every pickup draws its own turn and off-centre offset (defaults, 40 draws of each prize).
 {const g=await make({sourceFile:SRC});const a=g.c.__game;const T=[],c=a.pickupCentre(),run=(gg,x)=>vm.runInContext(x,gg.c);
  for(const id of ['cheese','shrimp','tuna','quake'])for(let i=0;i<40;i++){const f=a.queueTreatAward(id,200,null,true,id==='quake'?'quake':'item');T.push({id,turn:f.rot*180/Math.PI,dx:f.mx-c.x,dy:f.my-c.y,f:{mx:f.mx,my:f.my,ms:f.ms,rot:f.rot,px:f.px,py:f.py,pw:f.pw,ph:f.phh}});a.treatAwards.length=0;}
  const tn=T.map(x=>Math.abs(x.turn));const tnPrize=T.filter(x=>x.id!=='quake');assert(Math.min(...tn)>=6-1e-9&&Math.max(...tn)<=14+1e-9);
  assert(T.some(x=>x.turn<0)&&T.some(x=>x.turn>0)&&T.some(x=>x.dx<0)&&T.some(x=>x.dx>0)&&T.some(x=>x.dy<0)&&T.some(x=>x.dy>0));
  assert(T.every(x=>Math.abs(x.dx)<=16+1e-9&&Math.abs(x.dy)<=16+1e-9));assert(new Set(T.map(x=>x.turn.toFixed(4)+','+x.dx.toFixed(3))).size===T.length);
  // Pop-up panel: upright box around the turned visible art plus Panel padding (14), never clamped at the defaults, with at
  // least PANEL_MARGIN (12) px of normal game on every side.
  let minMargin=1e9,maxPanelW=0;for(const x of T){const F=x.f,w=a.prizeWidth(x.id,F.ms),ph=a.panelHalf(x.id,w,F.rot,14);
   assert(Math.abs(F.pw/2-ph[0])<1e-9&&Math.abs(F.ph/2-ph[1])<1e-9,'panel not clamped at defaults');assert(Math.abs(F.px-F.mx)<1e-9&&Math.abs(F.py-F.my)<1e-9,'panel centred on the art');
   const m=Math.min(F.px-F.pw/2,400-(F.px+F.pw/2),F.py-F.ph/2,run(g,'H')-(F.py+F.ph/2));assert(m>=12-1e-9,'margin '+m);minMargin=Math.min(minMargin,m);maxPanelW=Math.max(maxPanelW,F.pw);}
  const r=v=>[+Math.min(...v).toFixed(1),+Math.max(...v).toFixed(1)],ax=T.map(x=>Math.abs(x.dx)),ay=T.map(x=>Math.abs(x.dy));
  pass('each pickup draws its own turn and offset; pop-up panel fits with a margin (160 draws)',{turnDegAbs:r(tn),turnedLeft:T.filter(x=>x.turn<0).length,turnedRight:T.filter(x=>x.turn>0).length,offsetXPxAbs:r(ax),offsetYPxAbs:r(ay),draws:{prizes:120,quake:40},panelMinScreenMarginPx:+minMargin.toFixed(1),panelMaxWidthPx:+maxPanelW.toFixed(1),panelPaddingPx:14,allDifferent:true});g.close();}
 // 4d. Turn and Off-centre at 0: straight and centred; Burst size 0: no burst.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;for(const k of ['turn','offCentre','burst'])a.pickupFx[k]=0;const c=a.pickupCentre();
  const f=a.queueTreatAward('cheese',200,null,true);assert(f.rot===0&&f.mx===c.x&&f.my===c.y);secs(g,.5);assert.equal(a.sparkles.filter(s=>s.on&&(s.vx||s.vy)).length,0);
  pass('Turn, Off-centre and Burst size at 0: straight, centred, no burst',{rot:0,offset:0,burstSparkles:0});g.close();}
 // 4e. UAT 33 Spin dial: 0 = no spin in or out (flip stays 1); 2 = two flips each way; the Quake coin keeps its own
 // flight (no spin in, 2 flips out) whatever the dial says. Sound picker and volume reach the sound call.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;const flips=(f,t0,t1)=>{let m=1,n=0,prev=1;for(let t=t0;t<t1;t+=.0005){const x=a.pickupPoint(f,t).flip;m=Math.min(m,x);if(x<0&&prev>=0)n++;prev=x;}return {min:m,crossings:n};};
  a.pickupFx.spin=0;const f0=a.queueTreatAward('tuna',200,null,true);const in0=flips(f0,0,f0.tr),out0=flips(f0,f0.tr+f0.tm,f0.tr+f0.tm+f0.td);a.treatAwards.length=0;
  assert(in0.min===1&&out0.min===1,'spin 0');
  a.pickupFx.spin=2;const f2=a.queueTreatAward('tuna',200,null,true);const in2=flips(f2,0,f2.tr),out2=flips(f2,f2.tr+f2.tm,f2.tr+f2.tm+f2.td);a.treatAwards.length=0;
  assert(in2.crossings===2&&out2.crossings===2,'spin 2 '+JSON.stringify([in2,out2]));
  const q=a.queueTreatAward('quake',200,null,true,'quake');const qi=flips(q,0,q.tr),qo=flips(q,q.tr+q.tm,q.tr+q.tm+q.td);a.treatAwards.length=0;
  assert(qi.min===1&&qo.crossings===2&&q.turns===2,'quake unchanged');a.pickupFx.spin=1;
  run(g,"globalThis.__snd=[];sfx.pickup=(k,vol,d)=>{__snd.push([k,+vol.toFixed(3),d||0]);}");for(let k=0;k<30;k++)g.tick();a.pickupFx.volume=.5;const f=a.queueTreatAward('cheese',200,null,true);while(!f.arrived)g.tick();
  assert.deepEqual(JSON.parse(JSON.stringify(run(g,'__snd'))),[['bell',.5,0],['thump',.5,0]]);a.pickupFx.volume=1;while(a.treatAwards.length)g.tick();for(let k=0;k<30;k++)g.tick();
  // Five prizes over the ledge in the same frame: bells 0.1 s apart at 100%, 70%, 50%; the 4th and 5th are skipped.
  run(g,'__snd=[]');for(const id of ['cheese','shrimp','tuna','cheese','shrimp'])a.queueTreatAward(id,200,null,true);const burst=JSON.parse(JSON.stringify(run(g,'__snd')));
  assert.deepEqual(burst.map(x=>[x[0],x[1],+x[2].toFixed(3)]),[['bell',1,0],['bell',.7,.1],['bell',.5,.2]],JSON.stringify(burst));a.treatAwards.length=0;
  // Two prizes 0.5 s apart: each gets its own full bell at its own ledge moment.
  for(let k=0;k<30;k++)g.tick();run(g,'__snd=[]');a.queueTreatAward('cheese',200,null,true);for(let k=0;k<30;k++)g.tick();a.queueTreatAward('tuna',200,null,true);const apart=JSON.parse(JSON.stringify(run(g,'__snd')));assert.deepEqual(apart,[['bell',1,0],['bell',1,0]]);a.treatAwards.length=0;
  // Game time restarting with a board never silences the bell.
  run(g,'nextLedgeBell=time*1000+5000;__snd=[]');a.queueTreatAward('cheese',200,null,true);assert.deepEqual(JSON.parse(JSON.stringify(run(g,'__snd'))),[['bell',1,0]]);a.treatAwards.length=0;
  const snd=JSON.parse(fs.readFileSync(path.join(OUT,'sounds.json'),'utf8'));assert(snd.volumeZeroPeak===0&&snd.soundOffVoices===0&&snd.at150Peak<1&&snd.threeTogether.peak<1);
  pass('Spin dial (0 off, 2 turns) for prizes only; Quake flight unchanged; ledge bell and thump at Pickup volume, spaced and capped together; volume 0 and sound off are silent',{spin0:{in:in0,out:out0},spin2:{flipsIn:in2.crossings,flipsOut:out2.crossings},quakeWithSpin2:{spinIn:false,flipsOut:qo.crossings},soundCallAtVolume50:[['bell',.5,0],['thump',.5,0]],fivePrizesSameFrame:{bells:3,delaysSec:[0,.1,.2],levels:[1,.7,.5],skipped:2},twoPrizes0_5sApart:'full bell each',volumeZeroPeak:0,soundOffNodes:0,peakAt150Percent:snd.at150Peak,threeTogetherPeak:snd.threeTogether.peak,threeStackedUnspacedPeak:snd.threeTogether.peakIfStackedUnspaced});g.close();}
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
 // CP-34. Quake coin (Board 3): rises and grows to 70% over the backdrop, holds turned and off-centre, then flies into
 // the Quake button; shown count goes up, the button springs and the Quake sound plays on landing; credit is saved at
 // payout; no text banner; a hold keeps dropping meanwhile.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.dev=false;S.coins=300;board.status='playing';`);
  run(g,'globalThis.__special=0;sfx.special=()=>{__special++;};globalThis.__chimes=0;sfx.pickup=()=>{__chimes++;}');
  g.pointer('pointerdown',150,520);secs(g,.3);const dropsBefore=run(g,'diagSession.drops.length');
  assert(run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='quake');if(!b)return false;b.rb.setTranslation({x:250*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`));
  g.tick();const f=a.treatAwards.find(f=>f.kind==='quake');assert(f,'quake flight');
  assert.equal(a.board.earnedQuakes,1,'credited at payout');assert.equal(a.shownPowerCount('quake'),0,'shown count waits for landing');
  assert.equal(run(g,'itemToasts.length'),0,'no text banner');assert.equal(run(g,'__special'),0);
  const tg=a.quakeTarget(),btn=run(g,'powerButtons().quake'),end={...a.pickupPoint(f,f.tr+f.tm+f.td)},c=a.pickupCentre();
  assert(Math.abs(end.x-tg.x)<1e-6&&Math.abs(end.y-tg.y)<1e-6&&tg.x===btn.x+btn.w/2&&tg.y===btn.y+btn.h/2);
  const h0={...a.pickupPoint(f,f.tr)};let moved=0;for(let t=f.tr;t<f.tr+f.tm;t+=.001){const q=a.pickupPoint(f,t);moved=Math.max(moved,Math.abs(q.x-h0.x),Math.abs(q.y-h0.y),Math.abs(q.s-h0.s),Math.abs(q.rot-h0.rot),Math.abs(q.flip-1));}
  const width=a.prizeWidth('quake',h0.s)/400,turn=Math.abs(h0.rot*180/Math.PI);
  assert.equal(moved,0);assert(Math.abs(width-.7)<1e-9);assert(turn>=6&&turn<=14);assert(Math.abs(h0.x-c.x)<=16+1e-9&&Math.abs(h0.y-c.y)<=16+1e-9);
  {a.pickupFx.quakeSize=.45;const q=a.queueTreatAward('quake',200,null,true,'quake'),p=a.queueTreatAward('cheese',200,null,true);assert(Math.abs(a.prizeWidth('quake',q.ms)/400-.45)<1e-9&&Math.abs(a.prizeWidth('cheese',p.ms)/400-.7)<1e-9,'quake size separate');a.treatAwards.splice(a.treatAwards.indexOf(q),1);a.treatAwards.splice(a.treatAwards.indexOf(p),1);a.pickupFx.quakeSize=.7;run(g,'__chimes=0');} // the preview cheese above rang its own bell
  const big=a.bigQuakeSprite(),small=run(g,"sprite('quake')");assert(Math.abs(big.cv.width-4*small.cv.width)<=4,'4x sprite '+big.cv.width);
  let landed=null,shownAtLanding=null,shownBefore=null,peak=1,minFlip=1,bdHeld=1,fullAt=null,specialBeforeLanding=0;
  secs(g,2,()=>{const t=f.t;if(fullAt===null&&t>=f.tr)fullAt=+t.toFixed(3);if(t>=f.tr&&t<f.tr+f.tm)bdHeld=Math.min(bdHeld,a.backdropLevel());
   if(!f.arrived){if(t>=f.tr+f.tm)minFlip=Math.min(minFlip,a.pickupPoint(f).flip);shownBefore=a.shownPowerCount('quake');specialBeforeLanding=run(g,'__special');}
   if(landed===null&&f.arrived){landed=+f.t.toFixed(3);shownAtLanding=a.shownPowerCount('quake');}peak=Math.max(peak,a.quakeButtonScale());});
  const drops=run(g,'diagSession.drops').slice(dropsBefore);
  assert(Math.abs(fullAt-.35)<1/60+1e-6);assert.equal(bdHeld,1);
  let qIn=1;for(let t=0;t<f.tr;t+=.001)qIn=Math.min(qIn,a.pickupPoint(f,t).flip);assert.equal(qIn,1,'quake: no spin in');assert(f.turns===2&&f.spinIn===0);
  assert(Math.abs(landed-1.85)<1/60+1e-6,'lands at 1.85 s '+landed);assert.equal(shownBefore,0);assert.equal(shownAtLanding,1);assert.equal(specialBeforeLanding,0);assert.equal(run(g,'__special'),1);assert.equal(run(g,'__chimes'),0);assert(Math.abs(peak-1.2)<.02);assert(minFlip<-.95);
  assert(run(g,'holding')&&drops.length>=8,'hold continues '+drops.length);
  pass('CP-34 Quake coin: big moment over the backdrop, then into the Quake button',{board:3,start:{x:+f.x0.toFixed(1),y:+f.y0.toFixed(1)},fullSizeSec:fullAt,visibleWidthOfScreen:+width.toFixed(3),heldSec:f.tm,heldMovement:0,turnDeg:+(h0.rot*180/Math.PI).toFixed(1),offCentrePx:{x:+(h0.x-c.x).toFixed(1),y:+(h0.y-c.y).toFixed(1)},backdropWhileHeld:bdHeld,quakeSize45Checked:{quakeWidth:.45,prizeWidthUnchanged:.7},bigSpritePx:big.cv.width,boardSpritePx:small.cv.width,buttonCentre:tg,quakeFlightSec:f.td,landsSec:landed,shownCountBeforeLanding:shownBefore,shownCountAtLanding:shownAtLanding,earnedQuakesAtPayout:1,soundAtLandingOnly:true,chime:false,textBanner:false,buttonBouncePeak:+peak.toFixed(3),flipsOnFinalFlight:2,spinIn:false,dropsDuringPickup:drops.length,holding:true});
  g.pointer('pointerup',150,520);g.close();}
 // CP-34. A prize and the Quake coin collected together take turns (real payouts, same frame); backdrop stays up.
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(2);S.dev=false;S.coins=300;board.status='playing';`);
  const id=a.BOARD.targets[0].id;assert(payout(g,id,140));
  assert(run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='quake');b.rb.setTranslation({x:260*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`));
  g.tick();assert.equal(a.treatAwards.length,2);const [f1,f2]=a.treatAwards;assert(f2.t<0);let both=0,bdMin=1,l1=null,l2=null,t=0;
  secs(g,3.2,()=>{t+=1/60;const m=f=>f.t>=f.tr&&f.t<f.tr+f.tm;if(m(f1)&&m(f2))both++;if(f1.t>=f1.tr&&f2.t<f2.tr+f2.tm)bdMin=Math.min(bdMin,a.backdropLevel());if(l1===null&&f1.arrived)l1=+t.toFixed(3);if(l2===null&&f2.arrived)l2=+t.toFixed(3);});
  assert.equal(both,0);assert.equal(bdMin,1);assert.equal(a.treatAwards.length,0);assert(l1<l2);
  pass('CP-34 prize and Quake coin collected together take turns',{order:[f1.kind+':'+f1.id,f2.kind+':'+f2.id],secondWaitsSec:+(f1.tr+f1.tm).toFixed(3),bothInMiddleFrames:0,backdropMinBetweenTurns:bdMin,landedSec:[l1,l2]});g.close();}
 // 8. Lost prize: a target leaving by the side gutter greys, sinks and ripples; the board is lost (existing rule).
 {const g=await make({sourceFile:SRC});const a=g.c.__game;run(g,`selectBoard(0);S.coins=200;board.status='playing';`);
  const id=a.BOARD.targets[0].id;
  run(g,`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:(T.R+30)*M,y:-0.5,z:600*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);})()`);
  g.tick();assert.equal(a.lostFx.length,1);assert.equal(a.board.status,'lost');const fallingPrize=run(g,"falling.some(f=>f.kind==='item')");assert(!fallingPrize);
  secs(g,.31);assert.equal(a.lostFx.length,0);
  pass('lost prize: grey sink and ripple at the gutter',{prize:id,boardStatus:a.board.status,reason:a.board.endReason,sinkSec:a.pickupFx.sink,oldGutterSpriteDrawn:false});g.close();}
 // 9. Developer controls: hidden when off; new defaults; Fade and Stripes dials; old key ignored; persist; in the log.
 {const storage={'catpusher.uat.pickupfx.v4':JSON.stringify({size:.9,burst:14,sparkles:10})};const g=await make({sourceFile:SRC,storage});const a=g.c.__game;
  assert.equal(a.pickupFx.size,.7,'old key ignored');assert.equal(a.pickupFx.burst,0);
  const panel=run(g,'panel');el=()=>({onclick:null,querySelector:()=>el(),querySelectorAll:()=>[],textContent:'',style:{}});
  panel.querySelector=sel=>(sel==='#pfx'&&!/id="pfx"/.test(panel.innerHTML))?null:el();panel.querySelectorAll=()=>[];panel.scrollTop=0;
  run(g,'S.dev=false;openCredits()');const off=panel.innerHTML;assert(!/pfx|Pickup style|Prize feedback/.test(off));
  run(g,'S.dev=true;openCredits()');const on=panel.innerHTML;
  for(const re of [/Preview pickup/,/Preview lost prize/,/Preview Quake pickup/,/Rise and grow: 0.35 s/,/Size: 70% of screen width/,/Time held: 0.7 s/,/Spin: 1 turn/,/Pickup volume: 100%/,/Turn \(max\): 14°/,/Off-centre \(max\): 4% of screen/,/Fade: 0.35/,/Stripes: 0.5/,/Quake size: 70% of screen width/,/Panel padding: 14 px/,/Burst size: off/,/Into bag: 0.3 s/,/End size: 0.5x/,/Trail sparkles: off/,/Bounce size: 1.2x/,/Bounce time: 0.15 s/,/Quake flight: 0.8 s/,/Lost sink time: 0.3 s/])assert(re.test(on),String(re));
  for(const re of [/Pickup sound/,/Spin speed/,/Tilt/,/Wobble/,/Settle/,/Randomness/])assert(!re.test(on),String(re));
  a.stepPickupFx('size',-1);a.stepPickupFx('fade',1);a.stepPickupFx('stripes',1);a.stepPickupFx('burst',1);a.stepPickupFx('sparkles',1);a.stepPickupFx('quakeFlight',-1);a.stepPickupFx('quakeSize',-1);a.stepPickupFx('panelPad',1);a.stepPickupFx('spin',1);a.stepPickupFx('volume',-1);
  const log=JSON.parse(run(g,'diagPayload()'));const want={size:.65,fade:.4,stripes:.6,burst:2,sparkles:1,quakeFlight:.75,quakeSize:.65,panelPad:16,spin:1.25,volume:.9};for(const k in want)assert.equal(log.pickupTuning[k],want[k],k);
  g.close();const g2=await make({sourceFile:SRC,storage});for(const k in want)assert.equal(g2.c.__game.pickupFx[k],want[k],k);
  {const p2=run(g2,'panel');p2.querySelector=()=>el();p2.querySelectorAll=()=>[];}run(g2,'S.dev=true;openCredits()');const on2=run(g2,'panel').innerHTML;
  for(const re of [/Size: 65% of screen width/,/Fade: 0.4/,/Stripes: 0.6/,/Burst size: 2 sparkles/,/Trail sparkles: 1/,/Quake size: 65% of screen width/,/Panel padding: 16 px/,/Spin: 1.25 turns/,/Pickup volume: 90%/])assert(re.test(on2),String(re));
  // UAT 30-32 tuning (v5 key) carries over once into v6, except Time held, which takes the new 0.7 s default.
  let migrated;{const st={'catpusher.uat.pickupfx.v5':JSON.stringify({size:.6,fade:.5,held:.5,panelPad:20})};const g4=await make({sourceFile:SRC,storage:st});const q=g4.c.__game.pickupFx;
   assert(q.size===.6&&q.fade===.5&&q.panelPad===20&&q.held===.7&&q.spin===1&&q.volume===1&&q.sound===undefined,JSON.stringify(q));const v6=JSON.parse(st['catpusher.uat.pickupfx.v6']);assert(v6.held===.7&&v6.size===.6);
   migrated={from:{size:.6,fade:.5,held:.5,panelPad:20},to:{size:q.size,fade:q.fade,held:q.held,panelPad:q.panelPad}};g4.close();}
  // Fade and Stripes at 0: no backdrop drawn at all (no fill calls).
  const g3=await make({sourceFile:SRC});const a3=g3.c.__game;a3.pickupFx.fade=0;a3.pickupFx.stripes=0;
  pass('developer tuning: Spin and Pickup volume dials (no sound picker), Time held 0.7 s, v5 values migrate, persists, in log',{oldKeyIgnored:'catpusher.uat.pickupfx.v4',migratedFromV5:migrated,defaults:{size:.7,burst:0,sparkles:0,fade:.35,stripes:.5},logPickupTuning:log.pickupTuning,persistedAfterReload:{...g2.c.__game.pickupFx}});g2.close();g3.close();}
 // 9a. UAT 31: the held prize and the held Quake coin sit crisp on the backdrop: no glow (no radial gradient), no shadow,
 // no filter while a pickup is drawn at default settings.
 {const g=await make({sourceFile:SRC,render:true,height:888.889,seed:7});const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
  const a=g.c.__game;for(let i=0;i<20;i++)g.tick();
  run(g,"globalThis.__rg=0;globalThis.__soft=[];const _rg=ctx.createRadialGradient.bind(ctx);ctx.createRadialGradient=(...x)=>{__rg++;return _rg(...x);};const _df=drawFlight;drawFlight=function(f){if(ctx.shadowBlur||ctx.filter!=='none')__soft.push([ctx.shadowBlur,ctx.filter]);return _df(f);}");
  let frames=0;const rg0=run(g,'__rg');for(const [id,k] of [['tuna','item'],['quake','quake']]){const f=a.queueTreatAward(id,180,null,true,k);while(!f.arrived){g.tick();g.c.draw();frames++;}}
  const rg=run(g,'__rg')-rg0,soft=run(g,'__soft').length;assert.equal(rg,0,'no glow drawn');assert.equal(soft,0,'no shadow/filter');
  pass('held prize and Quake coin drawn crisp: no glow, shadow or filter',{framesDrawn:frames,radialGradientsDrawn:rg,shadowOrFilterAtDraw:soft});g.close();}
 // 9b. Backdrop is cheap: the stripe pattern and the glint are built once and reused; Fade/Stripes 0 draws nothing.
 {const g=await make({sourceFile:SRC,render:true,height:888.889,seed:7});const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
  const a=g.c.__game;a.pickupFx.burst=10;a.pickupFx.sparkles=6;
  run(g,"globalThis.__pat=0;globalThis.__cv=0;const _cp=ctx.createPattern.bind(ctx);ctx.createPattern=(...x)=>{__pat++;return _cp(...x);};const _ce=document.createElement.bind(document);document.createElement=(t)=>{if(t==='canvas')__cv++;return _ce(t);}");
  a.queueTreatAward('cheese',200,null,true);for(let i=0;i<30;i++){g.tick();g.c.draw();}const pat0=run(g,'__pat'),cv0=run(g,'__cv');
  a.queueTreatAward('tuna',200,null,true);for(let i=0;i<90;i++){g.tick();g.c.draw();}
  const pat=run(g,'__pat')-pat0,cvs=run(g,'__cv')-cv0;assert(pat0===1&&pat===0&&cvs===0,'cached '+[pat0,cv0,pat,cvs]);
  run(g,"globalThis.__fills=0;globalThis.__pf=0;const _fr=ctx.fillRect.bind(ctx);ctx.fillRect=(...x)=>{if(x[2]>=440)__fills++;return _fr(...x);};const _db=drawBackdrop;drawBackdrop=function(b){const _f=ctx.fill;ctx.fill=function(){__pf++;return _f.apply(this,arguments);};try{return _db(b);}finally{ctx.fill=_f;}}");
  a.queueTreatAward('shrimp',200,null,true);for(let i=0;i<40;i++){g.tick();g.c.draw();}const fillsDefault=run(g,'__pf');assert.equal(run(g,'__fills'),0,'no full-screen backdrop fill');assert(fillsDefault>0);
  while(a.treatAwards.length)g.tick();a.pickupFx.fade=0;a.pickupFx.stripes=0;run(g,'__pf=0');
  a.queueTreatAward('shrimp',200,null,true);for(let i=0;i<40;i++){g.tick();g.c.draw();}assert.equal(run(g,'__pf'),0);
  pass('panel and glints are cached; panel only (no full-screen fill); Fade and Stripes at 0 draw no panel',{stripePatternsCreatedFirstPickup:pat0,newPatternsOrCanvasesOver90LaterFrames:pat+cvs,fullScreenBackdropFills:0,panelFillsWithBothZero:0});g.close();}
 // 10. Old styles unreachable.
 {const src=fs.readFileSync(SRC,'utf8');for(const s of ['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused','drawPawMedallion(W/2'])assert(!src.includes(s),s);
  pass('Paw, ribbon, bubble and style setting removed',{searched:['pickupBlocksPlay','PICKUP_STYLES','Paw reward','Reward ribbon','Satchel bubble','pickup-style','pickup-paused']});}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({source:'work/cp33/release.html',runtime:'real shipped script + Rapier, desktop node',passed:results},null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
