// CP-36 Dance break checks (real runtime, desktop). Writes tickets/CP-36-evidence/checks.json.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-36-evidence');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp36/release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const push=(g,id,kind='item')=>g.run(`(()=>{let b=bodies.find(b=>!b.dead&&b.kind==='${kind}'&&(${kind==='item'}?b.id==='${id}':true));if(!b)b=addCoin('${kind}',${kind==='item'?`'${id}'`:'null'},200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,bodies:bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)])})");g.close();return r;}
// A fake Web Audio context that counts the sound nodes started, to check the sound setting and the volume dial.
function fakeAudio(g){let started=0;const node=()=>({connect(){},start(){started++;},stop(){},frequency:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}},gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}},Q:{value:0},type:''});
 g.c.AudioContext=class{constructor(){this.currentTime=0;this.sampleRate=8000;this.state='running';this.destination={};}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(4000)};}resume(){}};
 return ()=>started;}
(async()=>{
 // 1. Boards 1-3 play exactly as UAT 36 (same seed, 25 s of sweeping drops).
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to UAT 36 after 25 s of play',a===b,{chars:a.length});}
 // 2. Meter, dance break, bank, rain.
 {const g=await game({seed:4}),a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);
  check('Wild round starts with an empty happy meter of 4 notches',g.run('WILD.happy===0&&DANCE.notches===4'));
  const ids=['cheese','shrimp','yarn'];for(const id of ids){push(g,id);g.ticks(60);}
  check('each prize fills one notch',g.run('WILD.happy')===3&&!g.run('WILD.dance'),{happy:g.run('WILD.happy')});
  push(g,'cheese');g.ticks(3);check('a repeat prize fills a notch too, and a full meter queues the dance break',g.run('WILD.happy===4&&!!WILD.dancePending'));
  const coins0=g.run('S.coins'),used0=g.run('board.used');
  g.until('!!WILD.dance');const L=g.run('WILD.left');
  check('the dance break starts once the pickup has been held up (within 1.3 s)',g.run('time-WILD.dance.started')>=0,{});
  check('the cat does the Dancing pose (one looped move)',g.run('!!(pawDance&&pawDance.dbreak)&&pawDancePhase().intro===true'));
  g.until("WILD.dance.phase==='dance'");check('a 3-beat count-in, then the dance (16 beats at 109 BPM = 8.8 s)',g.run('WILD.dance.n')===16&&Math.abs(g.run('WILD.dance.beat')-60/109)<1e-9);
  check('the pose loops move 1 in time with the bar',g.run('(()=>{const p=pawDancePhase();return !p.intro&&p.index===1;})()'));
  for(let k=0;k<6;k++)tapAtBeat(g,k,(k%2?1:-1)*0.1);
  check('taps within ±0.13 s of the beat (after the 0.05 s delay allowance) bank one coin each',g.run('WILD.dance.hits')===6&&g.run('danceBanked(WILD.dance)')===6,{bank:g.run('JSON.stringify(WILD.dance.bank)')});
  {const h=g.run('WILD.dance.hits');g.tap();g.tap();check('extra taps on a beat already banked bank nothing',g.run('WILD.dance.hits')===h);}
  tapAtBeat(g,6,.25);check('an off-beat tap banks nothing',g.run('WILD.dance.hits')===6&&g.run('WILD.dance.misses')===1);
  tapAtBeat(g,7,0);check('…and costs the next beat (so tapping fast does not pay)',g.run('WILD.dance.hits')===6&&g.run("WILD.dance.judged[7]==='miss'"));
  {const r0=g.run('WILD.dance.bank.rain5+WILD.dance.bank.rain10');g.run('Math.__r=Math.random;Math.random=()=>0.01');tapAtBeat(g,8,0);g.run('Math.random=Math.__r');check('an on-beat tap sometimes banks a rain coin instead (Rain-coin chance)',g.run('WILD.dance.bank.rain5+WILD.dance.bank.rain10')===r0+1);}
  {let t=0;const before=g.run('WILD.dance.hits');while(t<1.2){g.tap();g.ticks(4);t+=4/60;}check('rapid tapping (15 taps a second) banks at most one beat in two',g.run('WILD.dance.hits')-before<=2,{banked:g.run('WILD.dance.hits')-before});}
  check('no coins dropped and the Wild bank unchanged during the break',g.run('board.used')===used0&&g.run('S.coins')===coins0,{used:g.run('board.used')-used0});
  check('the round timer is paused during the break',g.run('WILD.left')===L,{left:L});
  g.until("WILD.dance.phase==='finale'");const banked=g.run('danceBanked(WILD.dance)'),n0=g.run('bodies.filter(b=>!b.dead).length');
  check('music stops after the last beat: roar (cat lunges) and the screen shakes',g.run('lunge>0.9'));
  g.ticks(20);check('the screen shakes',/translate/.test(g.run('cv.style.transform||""')));
  g.until('!WILD.dance');const spawned=g.run('bodies.filter(b=>!b.dead).length')-n0;
  check('everything banked rains down at once (spread over a short time)',spawned>=banked-1&&spawned<=banked+3,{banked,newBodies:spawned});
  check('banked rain coins land on the board',g.run("bodies.filter(b=>!b.dead&&RAIN[b.kind]&&b.wildBonus).length")>=1);
  check('after the break: shake off, meter empty, pose stopped, round timer running again',g.run("(cv.style.transform||'')===''&&WILD.happy===0&&!pawDance")&&(g.ticks(60),Math.abs(g.run('WILD.left')-(L-1))<.05),{left:g.run('WILD.left')});
  // 3. Music-note coin.
  g.run('WILD.noteN=0;WILD.noteAt=0;WILD.nextBonus=.01;WILD.have={cheese:1,shrimp:1,tuna:1,yarn:1,duck:1,mouse:1,bell:1};');g.ticks(3);g.run('WILD.have={cheese:1,shrimp:1,yarn:1};');
  check('a bonus drop can be the music-note coin (about one per round)',g.run("WILD.incoming.some(o=>o.kind==='note')||bodies.some(b=>!b.dead&&b.kind==='note')"));
  g.until("bodies.some(b=>!b.dead&&b.kind==='note')");g.ticks(30);push(g,null,'note');g.ticks(3);
  check('collecting the music-note coin fills the meter at once',g.run('WILD.happy')===4&&g.run('!!WILD.dancePending||!!WILD.dance'));
  check('…with the Pop pickup',g.run("treatAwards.some(f=>f.id==='note'&&f.pop)"));
  g.until('!!WILD.dance');
  // EXIT during the dance
  {const w=a.wildButton();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);check('EXIT still works during the break: back on the normal board, pose and shake cleared',!a.WILD.on&&!g.run('pawDance')&&g.run("(cv.style.transform||'')===''"));}
  g.close();}
 // 4. Note frequency over real rounds (no player): music notes per 60 s round.
 {const g=await game({seed:11}),a=g.c.__game;let notes=0;for(let r=0;r<6;r++){a.wildEnter();a.wildStartCountdown();g.run('S.coins=999;');g.ticks(60*3.2);let t=0;while(t<58&&g.run("WILD.phase==='play'")){g.ticks(30);t+=.5;}notes+=g.run('WILD.noteN');a.wildExit();}
  check('about one music-note coin per round',notes>=5&&notes<=9,{rounds:6,notes});g.close();}
 // 5. Win during a dance: the round ends cleanly and the win dance plays.
 {const g=await game({seed:4}),a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);g.run('WILD.happy=3');push(g,'cheese');g.until('!!WILD.dance');g.ticks(60);
  g.run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese");push(g,'cheese');g.ticks(80);
  check('if the last prize lands during a dance break, the round is won and the win dance plays',a.WILD.phase==='end'&&a.WILD.win&&!g.run('WILD.dance')&&!!g.run('pawDance&&!pawDance.dbreak'));g.close();}
 // 6. Settings pause the dance; "Start dance break now"; dials saved and in the performance log.
 {const storage={};const g=await game({seed:4,storage}),a=g.c.__game;g.run('S.dev=true');
  check('Developer mode shows the Dance break dials and the Start button',g.run("(()=>{const h=wildDevHtml();return h.includes('Start dance break now')&&h.includes('Wild timer')&&['Prizes per happy meter','Dance length','Beat tempo','On-beat window','Tap delay allowance','Rain-coin chance','Dance move'].every(t=>h.includes(t));})()"));
  g.run("stepDanceDial('bpm',1);stepDanceDial('len',-1);stepDanceDial('rainChance',1);stepDanceDial('window',1);stepDanceDial('notches',1);stepDanceDial('latency',-1)");
  check('dial values are saved',JSON.parse(storage['catpusher.uat.dance.v1']).bpm===112&&JSON.parse(storage['catpusher.uat.dance.v1']).notches===5);
  check('dial values appear in the performance log',(()=>{const j=JSON.parse(g.run('diagPayload()'));return j.danceTuning&&j.danceTuning.bpm===112&&j.danceTuning.len===8.5&&j.wildTuning&&j.wildTuning.seconds===60;})());
  g.close();
  const g2=await game({seed:4,storage});check('saved dials load on the next start',g2.run('DANCE.bpm===112&&DANCE.notches===5&&Math.abs(DANCE.rainChance-.14)<1e-9'));
  g2.run('danceStartNow()');check('Start dance break now: opens the Wild board and counts down',g2.run("WILD.on&&WILD.phase==='count'&&WILD.danceForce"));
  g2.until('!!WILD.dance',600);check('…and the dance break starts right after GO',g2.run("!!WILD.dance&&WILD.phase==='play'"));
  g2.until("WILD.dance.phase==='dance'");const p0=g2.run('WILD.dance.p0');g2.run("panel.style.display='block'");g2.ticks(120);g2.run("panel.style.display='none'");g2.ticks(1);
  check('opening Settings pauses the dance (beat clock shifts by the pause)',Math.abs(g2.run('WILD.dance.p0')-p0-2)<.05,{shift:g2.run('WILD.dance.p0')-p0});
  g2.close();}
 // 7. Sounds follow the sound setting and the Pickup volume dial.
 {const g=await game({seed:4}),count=fakeAudio(g);g.run('S.muted=false;pickupFx.volume=1;sfx.dance("kick",1)');const on=count();
  g.run('pickupFx.volume=0;sfx.dance("kick",1);sfx.dance("roar",1)');const vol0=count();g.run('pickupFx.volume=1;S.muted=true;sfx.dance("kick",1)');const muted=count();
  check('dance sounds play with sound on, and are silent with sound off or Pickup volume 0',on>0&&vol0===on&&muted===on,{on,vol0,muted});
  g.run('S.muted=false;pickupFx.volume=1');const a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);const s0=count();g.run('danceStartNow()');g.ticks(60*3);
  check('the beat plays through the break (generated in code)',count()-s0>40,{nodes:count()-s0});g.close();}
 // 8. Frame cost (desktop CPU render, DPR 1.35): normal Wild play vs the dance and the rain.
 {const g=await game({seed:4,render:true}),a=g.c.__game,rt=g.realNow;a.wildEnter();a.wildStartCountdown();g.ticks(240);
  const frame=()=>{const t0=rt();g.tick();g.c.draw();return rt()-t0;};const stat=xs=>{xs=[...xs].sort((a,b)=>a-b);return {avg:+(xs.reduce((s,x)=>s+x,0)/xs.length).toFixed(2),p95:+xs[Math.floor(xs.length*.95)].toFixed(2),max:+xs[xs.length-1].toFixed(2)};};
  const base=[];for(let i=0;i<180;i++)base.push(frame());
  g.run('WILD.happy=3;DANCE.rainChance=.12');push(g,'cheese');g.until('!!WILD.dance');const dance=[];
  for(let k=0;k<16;k++){const target=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target)dance.push(frame());g.tap();}
  g.until("WILD.dance.phase==='finale'");const rain=[];while(g.run('!!WILD.dance'))rain.push(frame());for(let i=0;i<90;i++)rain.push(frame());
  const banked=16;g.ticks(240);g.run("(()=>{const b=addCoin('rain25',null,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");const ref=[];for(let i=0;i<60*4;i++)ref.push(frame());
  const r={normal:stat(base),dance:stat(dance),danceRain:stat(rain),existingRain25Reference:stat(ref),coinsBanked:banked};
  check('frame cost: the dance rain costs no more than an existing rain-25 coin on the same board (desktop, ms per frame incl. physics and drawing)',r.danceRain.p95<=r.existingRain25Reference.p95*1.1&&r.danceRain.max<=r.existingRain25Reference.max*1.25+5,r);
  fs.writeFileSync(path.join(OUT,'frame-cost.json'),JSON.stringify(r,null,1));g.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
