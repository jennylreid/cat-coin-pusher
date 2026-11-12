// CP-41 Treat toss checks (desktop, real runtime). Sound ON through a strict fake Web Audio (Chromium-strict connect()
// targets and parameter values), as the UAT 38 freeze taught. Writes tickets/CP-41-evidence/checks.json.
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const {run:play}=require('./play45.cjs');
const OUT=path.resolve(__dirname,'../../tickets/CP-41-evidence');fs.mkdirSync(OUT,{recursive:true});
const v=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8'));
const BASE_SRC={uat44:'../cp44/release.html'}[v.base];
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,BASE_SRC);
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function trace(src,setup,seed=5){const g=await game({src,seed});const a=g.c.__game;g.run(setup);
 let t=0,last=-9;while(t<25){if(t-last>=.2&&g.run("WILD.on?WILD.phase==='play':true")){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
const steps=(g,n,errs)=>{for(let i=0;i<n;i++){try{g.tick();}catch(e){errs.push(String(e.message).slice(0,140));return false;}}return true;};
(async()=>{
 // 1. Everything else unchanged: Boards 1-3 and Wild (1) play exactly as the base build.
 for(const bi of [0,1,2]){const a=await trace(OLD,`selectBoard(${bi});S.coins=300;`),b=await trace(NEW,`selectBoard(${bi});S.coins=300;`);check('board '+(bi+1)+' identical to the base build after 25 s',a===b);}
 {const s="wildEnter();wildStartCountdown();";const a=await trace(OLD,s),b=await trace(NEW,s);check('Wild (1) round identical to the base build after 25 s',a===b);}
 {const s="S.coins=300;wild2Enter();wildStartCountdown();";const a=await trace(OLD,s),b=await trace(NEW,s);check('Wild 2 round identical to the base build after 25 s (no fish coin, Dance break as before)',a===b);}
 // The MODES picker: header button (normal board only) opens it; a mode row starts that mode on its own goal card.
 {const g=await game({seed:4});const B=JSON.parse(g.run('JSON.stringify(modesButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);const open=g.run('MODES_UI.open');
  const R=JSON.parse(g.run('JSON.stringify(modesPickerRects())'));g.tap(R.rows[0].x+60,R.rows[0].y+30);
  const st=JSON.parse(g.run("JSON.stringify({on:WILD.on,v2:WILD.v2,mode:WILD.mode,phase:WILD.phase,name:wildModeName(),lines:wildCardLines()[0][0],toss:wildFeature('toss'),dance:wildFeature('dance')})"));
  g.run('wildExit();wild2Enter()');const w2=JSON.parse(g.run("JSON.stringify({mode:WILD.mode,name:wildModeName(),lines:wildCardLines()[0][0],toss:wildFeature('toss'),dance:wildFeature('dance')})"));g.close();
  check('MODES button opens the picker; TREAT TOSS starts its own mode on its goal card (Treat toss on, Dance break off)',open&&st.on&&st.v2&&st.mode==='treats'&&st.phase==='card'&&st.name==='TREAT TOSS'&&st.lines==='fish'&&st.toss&&!st.dance,st);
  check('Wild 2 itself keeps its name, card lines and Dance break, without Treat toss',w2.mode===null&&w2.name==='WILD 2'&&w2.lines==='meter'&&!w2.toss&&w2.dance,w2);}
 // 2. The fish coin: about one a Wild 2 round, as a bonus drop, never the music note's drop.
 {let fish=0,rounds=0,notes=0;const at=[];for(const seed of [21,22,23,24,25,26]){const g=await game({seed});g.run("S.coins=400;wildModeEnter('treats');wildStartCountdown();");let k=0,seen=false,note=false;
   while(g.run("WILD.phase!=='end'")&&k<60*58){g.tick();k++;g.run('WILD.left=Math.max(WILD.left,5);S.coins=Math.max(S.coins,50);WILD.happy=0;');
    if(!seen&&g.run("WILD.incoming.some(o=>o.kind==='fish')||bodies.some(b=>!b.dead&&b.kind==='fish')")){seen=true;fish++;at.push(g.run('WILD.bonusN'));}
    if(g.run("WILD.incoming.some(o=>o.kind==='note')||bodies.some(b=>!b.dead&&b.kind==='note')"))note=true;}rounds++;if(note)notes++;g.close();}
  check('Treat toss mode: a fish coin arrives as a bonus drop in each round (3rd to 7th drop)',fish===rounds&&at.every(n=>n>=3&&n<=7),{fish,rounds,atBonus:at});
  check('Treat toss mode: no music-note coin and no happy meter (the Dance break stays in Wild 2)',notes===0,{roundsWithNote:notes});}
 {let w2fish=0;for(const seed of [21,22,23]){const g=await game({seed});g.run('S.coins=400;wild2Enter();wildStartCountdown();');let k=0;
   while(g.run("WILD.phase!=='end'")&&k<60*58){g.tick();k++;g.run('WILD.left=Math.max(WILD.left,5);S.coins=Math.max(S.coins,50);WILD.happy=0;');if(g.run("WILD.incoming.some(o=>o.kind==='fish')||bodies.some(b=>!b.dead&&b.kind==='fish')")){w2fish++;break;}}g.close();}
  check('Wild 2: never a fish coin',w2fish===0,{roundsWithFish:w2fish});}
 {const g=await game({seed:30});g.run("S.coins=400;wildModeEnter('treats');wildStartCountdown();");g.ticks(60*4);g.run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");g.ticks(60);
  check('Treat toss mode: collecting a prize does not fill a happy meter',g.run('WILD.got')>=1&&g.run('WILD.happy')===0&&!g.run('WILD.dancePending'));g.close();}
 // 3. Pushing the fish coin off starts the toss; the timer pauses; every catch, whiff and drop is logged; it ends with +N.
 {const g=await game({seed:8,render:true});const st=strictAudio(g),errs=[];g.run("S.muted=false;wildModeEnter('treats');wildStartCountdown();");steps(g,60*4,errs);
  g.run("(()=>{const b=addCoin('fish',null,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");
  let k=0;while(!g.run('!!WILD.toss')&&k<180&&steps(g,1,errs))k++;
  check('pushing the fish coin off starts Treat toss within 1.2 s (after its pickup pop)',g.run('!!WILD.toss')&&k/60<=1.25,{afterSec:+(k/60).toFixed(2)});
  const left0=g.run('WILD.left');steps(g,60,errs);g.tap(30,250);g.tap(380,300);steps(g,60*3,errs);
  check('the round timer is paused during the toss',Math.abs(g.run('WILD.left')-left0)<1e-9,{left0,left:g.run('WILD.left')});
  {const used=g.run('board.used');g.tap(200,700);check('taps during the toss are catches, not coin drops',g.run('board.used')===used);}
  // catch one on purpose
  steps(g,20,errs);const tgt=JSON.parse(g.run("JSON.stringify((()=>{const o=WILD.toss.air.find(o=>o.state==='air'&&o.t>.2);if(!o)return null;const q=tossPos(o);return [q.x,q.y];})())"));
  const c0=g.run('WILD.toss.caught');if(tgt)g.tap(tgt[0],tgt[1]);check('a tap on a treat catches it (counter, streak, it flies to the bag)',tgt&&g.run('WILD.toss.caught')===c0+1&&g.run("WILD.toss.air.some(o=>o.state==='caught')"));
  k=0;while(g.run('!!WILD.toss')&&k<60*20&&steps(g,1,errs))k++;
  const log=JSON.parse(g.run('JSON.stringify(TOSS_LOG[TOSS_LOG.length-1])')),ev=log.events,kinds=new Set(ev.map(e=>e[1]));
  check('the toss lasts about 8-11 s and ends on its own',k/60<12,{sec:+(k/60+5.3).toFixed(1)});
  check('every flip, catch, whiff and drop is logged with its time',kinds.has('flip')&&kinds.has('catch')&&kinds.has('whiff')&&kinds.has('drop')&&kinds.has('end')&&ev.every(e=>Number.isFinite(e[0])),{events:ev.length});
  check('the timer runs again after the toss',(()=>{const l=g.run('WILD.left');steps(g,60,errs);return g.run('WILD.left')<l-.9;})());
  const exp=JSON.parse(g.run('diagPayload()'));check('the performance log carries the Treat toss dials, the last tosses and the pantry',!!(exp.tossTuning&&exp.tossLog&&exp.tossLog.length&&exp.pantry),{keys:Object.keys(exp).filter(k=>/toss|pantry/.test(k))});
  check('no audio or frame errors with sound on; sounds were made',!errs.length&&st.created>500,{errs,nodes:st.created});g.close();}
 // 4. Goal and pantry: at most 2 new goal prizes a toss; spares go to the pantry (saved).
 {const r=await play({seed:31,skill:1,err:6,gap:.25,lag:.12,label:'sharp'});const p=JSON.parse(r.pantry),pant=Object.values(p).reduce((a,b)=>a+b,0);
  check('a perfect toss ticks off at most 2 needed prizes, the rest go to the pantry',r.caught===16&&r.got===2&&pant===14,{caught:r.caught,got:r.got,pantry:pant});
  check('catching every treat is PERFECT (logged) and drops a RAIN 10',r.end&&r.end[7]===1);}
 // 5. Rules: a win waits until the toss is finished; no dance break during a toss; EXIT ends it cleanly.
 {const g=await game({seed:9});const errs=[];g.run('S.muted=false;');strictAudio(g);g.run('tossStartNow()');let k=0;while(!g.run('!!WILD.toss')&&k<600&&steps(g,1,errs))k++;
  g.run("for(const id of WILD_COLLECTION.slice(1)){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;}}delete WILD.have.cheese;WILD.got=WILD_GOAL-1;");
  g.run("(()=>{const b=addCoin('item','cheese',200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");steps(g,30,errs);
  check('the last goal prize during a toss does not end the round yet',g.run("WILD.phase==='play'&&!!WILD.toss&&WILD.got>=WILD_GOAL&&WILD.toss.winWaiting"));
  g.run('WILD.happy=DANCE.notches;WILD.dancePending={f:null,wait:9}');steps(g,30,errs);check('a dance break does not start during a toss',g.run('!WILD.dance&&!!WILD.toss'));
  k=0;while(g.run('!!WILD.toss')&&k<60*20&&steps(g,1,errs))k++;steps(g,5,errs);
  check('when the toss finishes, the waiting win happens',g.run("WILD.phase==='end'&&WILD.win"));g.close();}
 {const g=await game({seed:10});const errs=[];g.run('tossStartNow()');let k=0;while(!g.run('!!WILD.toss')&&k<600&&steps(g,1,errs))k++;steps(g,120,errs);
  const w=g.c.__game.wildButton();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);steps(g,30,errs);
  check('EXIT mid-toss goes straight back to the normal board',!g.run('WILD.on')&&!g.run('WILD.toss')&&!errs.length);g.close();}
 // 6. Sound off and Pickup volume 0: the toss makes no sound.
 {const g=await game({seed:12});const st=strictAudio(g),errs=[];g.run('S.muted=true;tossStartNow()');steps(g,60*8,errs);const a=st.created;g.run('pickupFx.volume=0;S.muted=false;');const b0=st.created;
  g.run("sfx.toss('catch',1,3);sfx.toss('whiff',1);sfx.toss('start',1)");check('Treat toss sounds are silent with sound off or Pickup volume 0',a===0&&!errs.length&&st.created===b0,{nodesMuted:a,nodesVol0:st.created-b0});g.close();}
 // 7. Developer dials: step, saved across a restart, reset.
 {const storage={};const g=await game({seed:2,storage});g.run("stepTossDial('len',1);stepTossDial('count',-1);stepTossDial('speed',1);stepTossDial('tapR',1)");const html=g.run('tossDevHtml()');g.close();
  const g2=await game({seed:2,storage});const kept=JSON.parse(g2.run('JSON.stringify(TOSS)'));g2.close();
  check('Developer: Start treat toss now and 4 dials (length, treats, speed, tap radius), saved on the phone',/Start treat toss now/.test(html)&&/Toss length: 9 s/.test(html)&&kept.len===9&&kept.count===15&&kept.speed===1.1&&kept.tapR===46,kept);}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({build:v.displayName,base:v.base,passed,failed},null,1));
 console.log(passed.length,'passed',failed.length,'failed');if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
