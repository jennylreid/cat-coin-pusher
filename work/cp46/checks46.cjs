// UAT 46 checks (real runtime, desktop, sound ON through a strict fake Web Audio): CP-42 Laser mode and Laser chase.
// Writes tickets/CP-42-evidence/checks.json and frames. Usage: node checks46.cjs <baseline release.html> [new release.html]
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const OUT=process.env.OUT||path.resolve(__dirname,'../../tickets/CP-42-evidence');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,process.argv[3]||'release.html'),OLD=path.resolve(process.argv[2]);
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const shot=(g,n)=>{g.rendered=true;g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
function frames(g,n,errs){for(let i=0;i<n;i++){try{g.tick();if(g.rendered&&(g.nd=(g.nd||0)+1)%20===0)g.c.draw();}catch(e){errs.push(String(e.stack||e.message||e).slice(0,200));return false;}}return true;}
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
async function wildTrace(src,seed,v2){const g=await game({src,seed});const a=g.c.__game;g.run(v2?'wild2Enter()':'wildEnter()');a.wildStartCountdown();g.ticks(200);
 let t=0,last=-9;while(t<40){if(t-last>=.25){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({left:+WILD.left.toFixed(3),coins:S.coins,got:WILD.got,rained:WILD.rained,turbo:WILD.turboDone,happy:WILD.happy,dances:WILD.dances,b:"+bodiesJSON+"})");g.close();return r;}
// a player: drops a coin every 0.25 s; during a chase, drags the dot onto the front-most prize (or coin)
const TARGET=`(()=>{let best=null,bs=-1e9;for(const b of bodies){if(b.dead||!b.rb)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;if(z<480||z>T.FRONT-20||Math.abs(x-200)>tableHalfAt(z)-10)continue;const sc=(b.kind==='item'?200:0)+z*.3-Math.abs(x-200)*.1;if(sc>bs){bs=sc;best={x,z};}}const q=best?laserScreen(best.x,best.z-14,0):{x:200,y:650};return JSON.stringify(q);})()`;
function player(g,errs,{seconds=90,drag=true,shots=null}={}){
 const a=g.c.__game;let t=0,last=-9,down=false,tgt=null,re=0;const R={chaseLeft:[],chases:0};
 while(t<seconds&&g.run("WILD.phase==='play'||WILD.phase==='count'")){
  const ch=g.run('WILD.chase?WILD.chase.phase:null');
  if(shots&&!shots.incoming&&g.run("WILD.incoming.some(o=>o.kind==='laser')")){shots.incoming=1;shot(g,'b1-laser-coin-incoming');}
  if(shots&&shots.incoming&&!shots.board&&!ch&&g.run("bodies.some(b=>!b.dead&&b.kind==='laser')")){frames(g,40,errs);shots.board=1;shot(g,'b2-laser-coin-on-board');}
  if(ch){if(!R.inChase){R.inChase=true;R.chases++;R.left0=g.run('WILD.left');if(shots)shot(g,'b3-pushed-off-chase-starts');}
   if(ch==='play'&&drag){re-=1/60;if(!tgt||re<=0){tgt=JSON.parse(g.run(TARGET));re=1;}if(!down){g.pointer('pointerdown',tgt.x,tgt.y);down=true;}else g.pointer('pointermove',tgt.x,tgt.y);}
   if(ch==='end'&&down){g.pointer('pointerup',0,0);down=false;}}
  else{if(R.inChase){R.inChase=false;R.chaseLeft.push(+(R.left0-g.run('WILD.left')).toFixed(3));}
   if(down){g.pointer('pointerup',0,0);down=false;}
   if(t-last>=.25&&g.run("WILD.phase==='play'")){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}}
  if(!frames(g,1,errs))break;t+=1/60;}
 if(R.inChase)R.chaseLeft.push(+(R.left0-g.run('WILD.left')).toFixed(3)); // the round was won as the chase ended
 return R;}
(async()=>{
 // 1. Nothing else changes: Boards 1-3, Wild and Wild 2 identical to the base build.
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to the base build after 25 s of play',a===b);}
 for(const v2 of [false,true]){const a=await wildTrace(OLD,6,v2),b=await wildTrace(NEW,6,v2);check((v2?'Wild 2':'Wild')+' round (40 s, through Turbo) identical to the base build',a===b);}
 // 2. The MODES picker and the Laser goal card.
 {const g=await game({src:NEW,render:true,seed:4});g.ticks(30);shot(g,'a1-modes-button');
  const REG=g.run("typeof registerWildMode==='function'");
  const B=JSON.parse(g.run(REG?'JSON.stringify(modesButton())':'JSON.stringify(laserModesButton())')),w=JSON.parse(g.run('JSON.stringify(wildButton())')),w2=JSON.parse(g.run('JSON.stringify(wild2Button())'));
  check('MODES '+(REG?'(the shared CP-41 picker)':'')+' sits under WILD! and WILD 2 without overlapping them',B.y>=w.y+w.h&&B.y>=w2.y+w2.h&&B.y+B.h<=g.run('hudLayout().headerBottom'),B);
  g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(20);check('tapping MODES opens the picker',g.run(REG?'MODES_UI.open':'LASER_MODES.open'));shot(g,'a2-modes-picker');
  const L=JSON.parse(g.run(REG?'JSON.stringify(modesPickerRects())':'JSON.stringify(laserModesLayout())'));
  if(REG)check('Laser chase is listed in the shared picker',L.rows.some(r=>r.id==='laser'),L.rows.map(r=>r.id));
  else check("the picker sits below the cat's chin",L.card.y>=g.run('CHIN_Y'),{cardY:L.card.y,chin:g.run('CHIN_Y')});
  g.tap(200,REG?L.card.y+L.card.h+30:150);check('a tap outside closes the picker (nothing else happens)',!g.run(REG?'MODES_UI.open':'LASER_MODES.open')&&!g.run('WILD.on'));
  g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(5);const r=REG?L.rows.find(r=>r.id==='laser'):L.rows[0];g.tap(r.x+r.w-40,r.y+r.h/2);g.ticks(30);
  check('LASER CHASE in the picker opens Laser mode at its goal card',g.run("WILD.on&&WILD.laser&&WILD.v2&&WILD.phase==='card'"));shot(g,'a3-laser-goal-card');
  const left=g.run('WILD.left');g.ticks(120);check('the timer does not run while the card is up',g.run('WILD.left')===left&&g.run("WILD.phase==='card'"));
  g.run('danceFill(2,200)');check('no happy meter or music-note coin in Laser mode',g.run("WILD.happy===0&&(typeof wildFeature==='function'?!wildFeature('dance')&&!wildFeature('toss')&&wildFeature('laser'):WILD.noteAt===999)"));
  g.tap(200,500);check('a tap on the card starts 3-2-1',g.run("WILD.phase==='count'"));g.ticks(200);check('the timer runs after GO',g.run("WILD.phase==='play'")&&g.run('WILD.left')<left);
  shot(g,'a4-laser-board-banner');
  g.tap(w.x+w.w/2,w.y+w.h/2);check('EXIT leaves Laser mode',!g.run('WILD.on')&&!g.run('WILD.laser'));
  g.tap(w2.x+w2.w/2,w2.y+w2.h/2);g.ticks(5);check('WILD 2 after Laser mode is plain Wild 2 (meter and note coin back)',g.run('WILD.v2&&!WILD.laser&&WILD.noteAt!==999'));g.close();}
 {const g=await game({src:NEW,render:true,seed:4,height:720});g.ticks(30);g.run('laserEnter()');g.ticks(30);shot(g,'a3-laser-goal-card-720');
  const L=JSON.parse(g.run('JSON.stringify(w2CardLayout())'));check('the Laser card fits a 720-high screen',L.card.y>=0&&L.card.y+L.card.h<=720,L.card);g.close();}
 // 3. Real rounds: the laser coin arrives as a bonus drop, Laser chase starts, the timer pauses, the paw knocks things off.
 const rounds=[];
 for(const seed of [21,22,23,24]){const g=await game({src:NEW,seed,render:seed===21});g.rendered=seed===21;const st=strictAudio(g),errs=[];g.run('S.muted=false');g.run('laserEnter()');g.c.__game.wildStartCountdown();
  const R=player(g,errs,{seconds:80,shots:seed===21?{}:null});
  const logs=JSON.parse(g.run('JSON.stringify(LASER_LOG)')),last=logs.length?logs[logs.length-1].events:[];const end=last.find(e=>e[1]==='end');
  rounds.push({seed,errs:errs.slice(0,2),laserCoins:g.run('WILD.laserN'),chases:R.chases,timerDuringChase:R.chaseLeft,end,phase:g.run('WILD.phase'),win:g.run('WILD.win'),got:g.run('WILD.got'),liveAudio:st.live()});
  g.close();}
 console.log(JSON.stringify(rounds));
 check('no exceptions in 4 Laser rounds with sound on (strict fake audio)',rounds.every(r=>!r.errs.length),rounds.map(r=>r.errs));
 check('a laser coin arrives in every round and starts a chase',rounds.every(r=>r.laserCoins>=1&&r.chases>=1),rounds.map(r=>[r.laserCoins,r.chases]));
 check('the round timer does not move during a chase',rounds.every(r=>r.timerDuringChase.length&&r.timerDuringChase.every(x=>Math.abs(x)<1e-6)),rounds.map(r=>r.timerDuringChase));
 check('the chase knocks things off the front for a player who drags onto prizes',rounds.every(r=>r.end&&r.end[2]>=1),rounds.map(r=>r.end&&r.end.slice(2,6)));
 // 4. In a chase: no coin drops; the dot follows the finger; a win waits; EXIT; sound off is silent.
 {const g=await game({src:NEW,seed:9});const st=strictAudio(g),errs=[];g.run('S.muted=false');g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase&&WILD.chase.phase==="play"')&&k<900){frames(g,1,errs);k++;}
  const c0=g.run('S.coins');for(let i=0;i<8;i++){g.tap(120+i*20,600);frames(g,6,errs);}
  check('taps during the chase move the dot and drop no coins',g.run('S.coins')===c0&&g.run('pendingDrops.length')===0,{c0,c1:g.run('S.coins')});
  const d=JSON.parse(g.run('JSON.stringify(WILD.chase.dot)')),want=JSON.parse(g.run('JSON.stringify(laserClamp(laserWorld(260,600)))'));check('the dot goes where the finger is',Math.hypot(d.x-want.x,d.y-want.y)<1.5,{d,want});
  g.pointer('pointerdown',150,640);g.pointer('pointermove',250,700);const d2=JSON.parse(g.run('JSON.stringify(WILD.chase.dot)')),w2=JSON.parse(g.run('JSON.stringify(laserClamp(laserWorld(250,700)))'));g.pointer('pointerup',250,700);
  check('dragging moves the dot with the finger',Math.hypot(d2.x-w2.x,d2.y-w2.y)<1.5,{d2,w2});
  g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;}}wildFinish(true)");
  check('a win during the chase waits (the chase keeps going)',g.run("!!WILD.chase&&WILD.phase==='play'&&WILD.chase.winWaiting"));
  k=0;while(g.run('!!WILD.chase')&&k<60*20){frames(g,1,errs);k++;}frames(g,30,errs);
  check('the round is won once the chase has finished',g.run("WILD.phase==='end'&&WILD.win"));
  frames(g,60*4,errs);check('the visitor still comes after a Laser win',g.run('!!WILD.visitor'));
  check('no exceptions (sound on)',!errs.length,errs.slice(0,2));g.close();}
 {const g=await game({src:NEW,seed:9});const errs=[];g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase&&WILD.chase.phase==="play"')&&k<900){frames(g,1,errs);k++;}
  const w=JSON.parse(g.run('JSON.stringify(wildButton())'));g.tap(w.x+w.w/2,w.y+w.h/2);frames(g,30,errs);
  check('EXIT during a chase ends it and leaves cleanly',!g.run('WILD.on')&&!g.run('WILD.chase')&&!errs.length);
  check('both mitts are back at rest after EXIT',g.run('mittRest(1).x>0&&mittRest(-1).x>0'));g.close();}
 {const g=await game({src:NEW,seed:9});const st=strictAudio(g),errs=[];g.run('S.muted=true');g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase')&&k<900){frames(g,1,errs);k++;}
  const n0=st.created;for(let i=0;i<60*8;i++){if(i%30===0)g.tap(150+i%200,620);frames(g,1,errs);}check('sound off: the chase makes no sound',st.created===n0,{nodes:st.created-n0});g.close();}
 // 5. About one laser coin a round (rounds with no coins dropped: bonus drops only).
 {let coins=0,n=0;const per=[];for(const seed of [31,32,33,34,35,36]){const g=await game({src:NEW,seed});const errs=[];g.run('laserEnter()');g.c.__game.wildStartCountdown();g.run('S.coins=999');
   let k=0;while(g.run("WILD.phase!=='end'")&&k<60*75){if(g.run('!!WILD.chasePending'))g.run('WILD.chasePending=null');frames(g,1,errs);k++;}coins+=g.run('WILD.laserN');per.push(g.run('WILD.laserN'));n++;g.close();}
  check('one laser coin a round, a second only when the first is never pushed off ('+coins+' in '+n+' rounds where no coins are dropped)',per.every(c=>c>=1&&c<=2),per);}
 // 6. Developer: Start laser chase now, dials saved and loaded, performance log.
 {const storage={};const g=await game({src:NEW,seed:4,storage});g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase')&&k<600){g.tick();k++;}check('Start laser chase now opens Laser mode and starts a chase after GO',g.run('WILD.laser&&!!WILD.chase'));
  g.run("stepLaserDial('len',1);stepLaserDial('paw',1);stepLaserDial('swat',-1)");g.close();
  const g2=await game({src:NEW,seed:4,storage});check('dials are saved and load on the next start',g2.run('LASER.len===9.5&&Math.abs(LASER.paw-1.1)<1e-9&&Math.abs(LASER.swat-.9)<1e-9'),g2.run('JSON.stringify(LASER)'));
  g2.run('laserStartNow()');k=0;while(!g2.run('!!WILD.chase&&WILD.chase.phase==="end"')&&k<60*20){g2.tick();k++;}g2.ticks(200);
  const log=JSON.parse(g2.run('diagPayload()'));check('the performance log has laserTuning, its defaults and the last chase log',!!(log.laserTuning&&log.laserTuning.len===9.5&&log.laserTuningDefaults&&log.laserLog&&log.laserLog.length>=1),{t:log.laserTuning,n:log.laserLog&&log.laserLog.length});
  const stop=g2.run('LASER_LOG[LASER_LOG.length-1].events.find(e=>e[1]==="stop")[0]');check('a 9.5 s dial makes a 9.5 s chase (0.9 s intro + play)',Math.abs(stop-(9.5-0.9))<.25,{stop});
  const html=g2.run('wildDevHtml()');check('Developer panel shows the Laser chase dials and Start laser chase now',/Start laser chase now/.test(html)&&/Chase length/.test(html)&&/Paw speed/.test(html)&&/Swat strength/.test(html));g2.close();}
 // 7. Desktop step cost during a chase (ms per tick, physics + update; not phone evidence).
 {const g=await game({src:NEW,seed:7});g.run('laserEnter()');g.c.__game.wildStartCountdown();g.ticks(200);const a=g.c.__game;let t0=g.realNow();for(let i=0;i<300;i++){if(i%15===0)a.tryDrop({x:150+i/3,y:g.run('DROP_Y')});g.tick();}const base=(g.realNow()-t0)/300;
  g.run('laserStartNow()');let k=0;while(!g.run('!!WILD.chase&&WILD.chase.phase==="play"')&&k<600){g.tick();k++;}t0=g.realNow();for(let i=0;i<300;i++){if(i%20===0)g.pointer(i?'pointermove':'pointerdown',150+i/2,650);g.tick();}const ch=(g.realNow()-t0)/300;
  check('desktop step cost during a chase is close to normal play with coin drops',ch<base*1.6+2,{normalMs:+base.toFixed(2),chaseMs:+ch.toFixed(2)});g.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed,rounds},null,1));
 console.log('passed',passed.length,'failed',failed.length);
})().catch(e=>{console.error(e);process.exitCode=1;});
