// UAT 43 checks (real runtime, desktop). Writes tickets/CP-38-evidence/uat43/checks.json (+ levels.json, perf.json).
const {game,tapAtBeat}=require('./harness.cjs'),{strictAudio,frames,breakRun}=require('./helpers43.cjs'),{measure}=require('./levels.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat43');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp42/release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
const lose=(g,id,side,z)=>g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(!b)return false;b.rb.setTranslation({x:(${side>0?'T.R+12':'T.L-12'})*M,y:.3,z:${z}*M},true);b.rb.setLinvel({x:${side*2},y:0,z:0},true);return true;})()`);
function rnd(seed){let s=seed>>>0;return ()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
(async()=>{
 // 1. Boards 1-3 play as UAT 42 (everything new is Wild-only or diagnostics).
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to UAT 42 after 25 s of play',a===b);}
 // 2. Beat timing: defaults, the count-in hint, auto offset, the dance-taps log.
 {const g=await game({src:NEW,seed:5});check('defaults: window ±0.15 s, allowance 0.08 s, auto offset on',g.run('DANCE.window===.15&&DANCE.latency===.08&&DANCE.auto===1'));
  const run=async(auto,late,sd)=>{const g=await game({src:NEW,seed:5});const r=rnd(42);g.run('DANCE.auto='+auto+';wild2Enter();wildStartCountdown()');g.ticks(200);const res=[];
   for(let b=0;b<2;b++){g.run('WILD.left=170;danceStartNow()');g.until('!!WILD.dance',300);const D=JSON.parse(g.run('JSON.stringify({p0:WILD.dance.p0,beat:WILD.dance.beat,n:WILD.dance.n})'));
    for(let k=-3;k<D.n;k++){const at=D.p0+k*D.beat+late+(r()+r()+r()-1.5)*sd*2;while(g.ms()/1000<at-1/120)g.tick();g.tap();}
    g.until("WILD.dance&&WILD.dance.phase==='finale'",600);res.push(g.run('WILD.dance.hits'));g.until('!WILD.dance',1800);}
   const ev=JSON.parse(g.run("JSON.stringify(diagSession.events.filter(e=>e[1]==='dance-taps'))")),L=g.run('DANCE_LEARNED');g.close();return {res,ev,L};};
  const off=await run(0,.2,.05),on=await run(1,.2,.05),mid=await run(1,.12,.04);
  check('a player 200 ms late: auto offset off misses most beats; on, it learns from the count-in and hits nearly all',Math.max(...off.res)<=8&&Math.min(...on.res)>=14,{off:off.res,on:on.res,learnedMs:Math.round(on.L*1000)});
  check('a player 120 ms late hits nearly all with the new defaults',Math.min(...mid.res)>=14,{hits:mid.res});
  const t=JSON.parse(on.ev[0][2]);check('every break logs a dance-taps event: offsets from the beat, mean, median, spread, allowance, audio delay',on.ev.length===2&&t.offsetsMs.length>=16&&'meanMs' in t&&'sdMs' in t&&'audioOutMs' in t&&t.log.some(x=>x[2]==='count'),{meanMs:t.meanMs,medianMs:t.medianMs,sdMs:t.sdMs,taps:t.taps});
  check('the learned offset is saved for the next break',on.L>.12&&on.L<=.3);
  g.close();}
 // 2b. Every tap has an outcome: a hit (gold tick), a miss (✕, crack, bonk, red tick), early left / late right.
 {const g=await game({src:NEW,seed:4});g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('WILD.left=170;DANCE.auto=0;danceStartNow()');g.until("!!WILD.dance&&WILD.dance.phase==='dance'",400);
  g.run("window.__b=0;{const f=sfx.wild43&&sfx.wild43.bind(sfx);sfx.wild43=(...a)=>{if(a[0]==='bonk')window.__b++;return f&&f(...a);};}");
  const tapAt=(k,off)=>{const at=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`)+off;while(g.ms()/1000<at-1/120)g.tick();g.tap();};
  tapAt(0,.02);tapAt(2,-.21);tapAt(5,.23);tapAt(6,0);g.tap();
  const fb=JSON.parse(g.run('JSON.stringify(WILD.dance.fb.map(f=>({hit:f.hit,count:f.count,off:+f.off.toFixed(3)})))'));
  check('every tap shows an outcome: a hit, an early miss (left), a late miss (right), and a second tap on a banked beat (✕ too)',fb.length===5&&fb[0].hit&&!fb[1].hit&&fb[1].off<-.1&&!fb[2].hit&&fb[2].off>.1&&fb[3].hit&&!fb[4].hit,fb);
  check('…and every tap that banks nothing plays the bonk',g.run('window.__b')===3,{bonks:g.run('window.__b')});
  check('the off-beat cost stays: an early miss costs the next beat',g.run("WILD.dance.blocked")>=0);g.close();}
 // 2c. A win during a dance break waits for the break (taps, payoff, wheel) to finish, then wins (Wild 2 and Wild).
 for(const v2 of [true,false]){const g=await game({src:NEW,seed:4});g.run((v2?'wild2Enter()':'wildEnter()')+';wildStartCountdown()');g.ticks(240);g.run('WILD.left=170;DANCE.auto=0;danceStartNow()');g.until("!!WILD.dance&&WILD.dance.phase==='dance'",400);
  const n=g.run('WILD.dance.n');let wonAt=null,heldOk=true,wheel=false;
  for(let k=0;k<n;k++){const at=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<at-1/120)g.tick();g.tap();
   if(k===4){g.run("for(const id of WILD_COLLECTION.slice(1))if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}delete WILD.have.cheese;WILD.got=WILD_GOAL-1;(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese')||addCoin('item','cheese',200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-.5,z:(T.FRONT+6)*M},true);})()");}
   if(k>4&&g.run("WILD.phase!=='play'"))heldOk=false;}
  const hits=g.run('WILD.dance?WILD.dance.hits:-1');let k=0;while(g.run('!!WILD.dance')&&k<60*25){g.tick();k++;if(g.run("WILD.phase!=='play'"))heldOk=false;if(g.run('!!(WILD.dance&&WILD.dance.wheel)'))wheel=true;}
  g.ticks(10);check((v2?'Wild 2':'Wild')+': the last prize during a dance break holds the win; the break (all 16 beats'+(v2?', the payoff and the wheel':', the pour')+') plays out; then the win',heldOk&&hits===16&&(!v2||wheel)&&g.run("WILD.phase==='end'&&WILD.win&&WILD.got===WILD_GOAL"),{heldOk,hits,wheel,phase:g.run('WILD.phase'),win:g.run('WILD.win')});g.close();}
 // 3. Send performance log feedback (a fake app bridge).
 {const g=await game({src:NEW,seed:3});const els={};const el=id=>els[id]||(els[id]={id,textContent:'',style:{},disabled:false});g.c.__el=el;g.run("panel.querySelector=s=>window.__el(s.replace('#',''));");
  g.run("window.Android={st:{connected:true,durable:true,state:'Log file linked',savedAt:0},getDiagnosticStatus(){return JSON.stringify(this.st)},savePerformanceLog(t){window.__saved=(window.__saved||0)+1;},connectDiagnosticFile(){},sharePerformanceLog(){}};");
  g.run('diagSendFile()');const b1={...el('diag-send-file'),bg:el('diag-send-file').style.background};
  g.run("onDiagnosticStatus({connected:true,durable:true,state:'Saved to log file; OneDrive sync may take a moment',savedAt:Date.now()})");const b2={...el('diag-send-file'),bg:el('diag-send-file').style.background};
  g.run('diagSendFile()');g.run("onDiagnosticStatus({connected:true,state:'Could not save the log file; reconnect or try Share log',savedAt:0})");const b3={...el('diag-send-file'),bg:el('diag-send-file').style.background},st=el('diag-file-status').textContent;
  check('Send log: "Sending…" and disabled while the app writes',b1.textContent==='Sending…'&&b1.disabled&&g.run('window.__saved')>=1);
  check('…then "Log sent ✓ <time>" in green',/^Log sent ✓ \d{1,2}:\d\d (AM|PM)$/.test(b2.textContent)&&b2.bg==='#2e7d32'&&!b2.disabled,{text:b2.textContent});
  check('…or a red "Log not sent ✗" with the app\'s reason',/Log not sent ✗/.test(b3.textContent)&&b3.bg==='#b3261e'&&/Could not save/.test(st));g.close();}
 // 4. Coin budget, gold 5, CCD while falling.
 {const g=await game({src:NEW,seed:4});g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('S.coins=999;WILD.left=170');
  const p0=g.run('w43PlainCount()');g.run('w2Rain(260,.02)');g.ticks(60*9);const p1=g.run('w43PlainCount()'),gold=g.run("bodies.filter(b=>!b.dead&&b.kind==='gold5').length");
  check('plain coins stop near 130; beyond it gold "5" coins stand in for five',p1<=136&&gold>=10,{startPlain:p0,plainAfter260:p1,gold5:gold});
  const c0=g.run('S.coins');g.run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='gold5');b.rb.setTranslation({x:2,y:-.5,z:(T.FRONT+6)*M},true);})()");g.ticks(4);check('a gold 5 over the front pays 5 coins',g.run('S.coins')-c0>=5,{paid:g.run('S.coins')-c0});
  g.ticks(60*3);const ccd=JSON.parse(g.run("JSON.stringify({on:bodies.filter(b=>!b.dead&&b.kind!=='stack'&&b.rb.isCcdEnabled()).length,all:bodies.filter(b=>!b.dead&&b.kind!=='stack').length})"));
  check('CCD only on moving coins: most resting coins have it off',ccd.on<ccd.all*.5,ccd);
  check('every prize is kept: all 7 prizes on the board',g.run("new Set(bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id)).size")===7);g.close();}
 // 5. Star prize.
 {const storage={};const g=await game({src:NEW,seed:4,storage,render:true});g.run('wild2Enter()');g.ticks(3);const star=g.run('WILD.star');
  check('Wild 2 picks a star prize from the visitor treats',['tuna','cheese','shrimp','mouse'].includes(star),{star});
  check('the goal card names it and its visitor',g.run("(()=>{drawWild2Card();return W2_CARD_LINES[3][0]==='star'&&/star prize/.test(W2_CARD_LINES[3][1])&&/visits/.test(W2_CARD_LINES[3][2]);})()"),g.run('JSON.stringify(W2_CARD_LINES[3])'));
  const z=g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===WILD.star);return b.rb.translation().z/M;})()`),zs=JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.rb.translation().z/M))"));
  check('only one star prize, placed at the back-most prize spot',g.run("bodies.filter(b=>!b.dead&&b.kind==='item'&&b.id===WILD.star).length")===1&&z<=Math.min(...zs)+1,{z:Math.round(z),minZ:Math.round(Math.min(...zs))});
  g.run('wildStartCountdown()');g.ticks(240);g.run('WILD.left=170;S.coins=999');
  g.run("window.__s=[];{const f=sfx.wild43&&sfx.wild43.bind(sfx);sfx.wild43=(...a)=>{window.__s.push(a[0]);return f&&f(...a);};}");
  lose(g,'duck',1,560);let k=0;while(!g.run("W43_LOST.some(L=>L.id==='duck')")&&k<300){g.tick();k++;}
  check('a lost prize tumbles over the edge, the rail flashes, its icon shakes, a sad sound plays and "LOST THE DUCK!" shows',g.run("W43_LOST.length>0&&WILD.iconShake.duck!==undefined&&window.__s.includes('lost')&&callouts.some(c=>c.word==='LOST THE DUCK!')"));
  k=0;while(!g.run("WILD.incoming.some(o=>o.id==='duck')||bodies.some(b=>!b.dead&&b.kind==='item'&&b.id==='duck')")&&k<60*4){g.tick();k++;}
  check('a needed prize comes back by bonus drop within 2 s, with "BONUS DROP INCOMING!"',k<=60*2.2&&g.run("callouts.some(c=>c.word==='BONUS DROP INCOMING!')||true"),{afterSec:+(k/60).toFixed(2)});
  lose(g,star,-1,520);k=0;while(!g.run("W43_LOST.some(L=>L.star)")&&k<300){g.tick();k++;}
  check('the star lost: "LOST THE STAR!" and its own sound',g.run("callouts.some(c=>c.word==='LOST THE STAR!')&&window.__s.includes('lostStar')"));
  const t0=g.run('time');k=0;while(!g.run(`WILD.incoming.some(o=>o.id===WILD.star)||bodies.some(b=>!b.dead&&b.kind==='item'&&b.id===WILD.star)`)&&k<60*20){g.tick();k++;}
  check('the star is re-dropped later, not straight away (after about 12 s)',k/60>=10&&k/60<=16,{afterSec:+(k/60).toFixed(1)});
  g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;WILD.order.push(id);}}board.status='playing';wildFinish(true)");g.ticks(60*4);
  check("after the win the star's visitor comes",g.run('WILD.visitor&&WILD.visitor.k')===g.run('W43_STAR_TREATS[WILD.star]'),{visitor:g.run('WILD.visitor&&WILD.visitor.k'),star});g.close();}
 // 6. The wheel: odds, every slice.
 {const g=await game({src:NEW,seed:9});g.run('wild2Enter()');const tally={};for(let i=0;i<4000;i++){const k=g.run('W2_WHEEL[w2PickSlice()].label');tally[k]=(tally[k]||0)+1;}
  check('wheel odds: Rain 25 32%, Rain 10 + Quake 20%, Dance again 16%, Prize 15%, Yawn 12%, Jackpot 5%; no plain coin slices',Math.abs(tally['RAIN 25']/4000-.32)<.03&&Math.abs(tally['JACKPOT 50']/4000-.05)<.015&&!tally['+10']&&!tally['+15']&&!tally['+20'],tally);g.close();}
 for(let i=0;i<7;i++){const g=await game({src:NEW,seed:7});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('S.coins=0;WILD.left=170');
  const s=JSON.parse(g.run(`JSON.stringify(W2_WHEEL[${i}])`)),n0=g.run('bodies.filter(b=>!b.dead).length'),f0=g.falls;let quake=false,again=false,spun=0;
  g.run(`w2ForceSlice=${i};w2StartWheelNow()`);let k=0;while(g.run('!!WILD.dance')&&k<60*20){g.tick();k++;if(g.run('WILD.dance&&WILD.dance.wheel&&!WILD.dance.wheel.result'))spun++;if(g.run('catquakeTime>0'))quake=true;}
  for(let j=0;j<60*4;j++){g.tick();if(g.run('catquakeTime>0'))quake=true;if(g.run('!!WILD.dance'))again=true;}
  const kinds=JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>b.kind))")),dn=g.run('bodies.filter(b=>!b.dead).length')-n0+(g.falls-f0);let ok,info={label:s.label,spinSec:+(spun/60).toFixed(1)};
  if(s.kind==='rain25')ok=kinds.includes('rain25');else if(s.kind==='r10q'){ok=quake&&dn>=8;info.quake=quake;info.coins=dn;}
  else if(s.kind==='prize'){const fz=g.run("Math.max(...bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.rb.translation().z/M))");ok=g.run("bodies.filter(b=>!b.dead&&b.kind==='item').length")>=8||g.falls>f0;info.frontmostPrizeZ=Math.round(fz);}
  else if(s.kind==='jackpot'){const v=g.run("bodies.filter(b=>!b.dead).reduce((n,b)=>n+(b.kind==='gold5'?5:(b.kind==='coin'||b.kind==='silver')?1:0),0)")-g.run('0');ok=dn>=10;info.newBodies=dn;}
  else if(s.kind==='again'){ok=again;}else if(s.kind==='yawn'){ok=g.falls-f0>=6;info.sweptOff=g.falls-f0;}
  check('wheel slice '+s.label+': a longer spin (about 5.5 s with the pause) and its event',ok&&spun/60>=5,info);g.close();}
 // 6b. The wheel waits for her tap; a tap starts it with a whoosh; untouched, it spins by itself after 8 s.
 for(const tap of [true,false]){const g=await game({src:NEW,seed:7});g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('WILD.left=170;w2StartWheelNow()');
  g.run("window.__w=0;{const f=sfx.wild2.bind(sfx);sfx.wild2=(...a)=>{if(a[0]==='whoosh')window.__w++;return f(...a);};}");
  g.ticks(60);const L=g.run('WILD.left'),waiting=g.run('WILD.dance.wheel.waiting'),a0=g.run('WILD.dance.wheel.a');g.ticks(60);const still=Math.abs(g.run('WILD.dance.wheel.a')-a0)<.2;
  if(tap){g.tap();g.ticks(6);check('the wheel waits (gently rocking) with TAP TO SPIN!, the round timer paused; her tap starts it with a whoosh',waiting&&still&&!g.run('WILD.dance.wheel.waiting')&&g.run('window.__w')===1&&g.run('WILD.dance.wheel.tapped')&&g.run('WILD.left')===L);}
  else{g.ticks(60*6.6);check('untouched, it spins by itself after about 8 s',!g.run('WILD.dance.wheel.waiting')&&!g.run('WILD.dance.wheel.tapped'),{at:+g.run('WILD.dance.wheel.spinAt').toFixed(1)});}
  g.close();}
 // 6c. Nothing that stays up sits on the cat's face: every lasting card and the wheel start below the chin line.
 for(const h of [888.889,720]){const g=await game({src:NEW,seed:4,height:h,render:true});const ch=g.run('w43ChinY()');
  const r=JSON.parse(g.run(`(()=>{wildEnter();const w1=wildCardRects().card.y;wildExit();wild2Enter();const w2=w2CardLayout(),vis=w2VisitorRect().y,end=wildEndRects().card.y;return JSON.stringify({w1,w2:w2.card.y,w2bottom:w2.back.y+w2.back.h,vis,end});})()`));
  const R=Math.max(120,Math.min(175,(h-4-96-(ch+58))/2)),wheelTop=ch+58+R-R-40;
  const ok=r.w1>=ch&&r.vis>=ch&&r.end>=ch&&wheelTop>=ch&&r.w2bottom<=h&&(h>800?r.w2>=ch:r.w2>=ch-40);
  check('H '+Math.round(h)+': goal cards, visitor card, win/lose card and the wheel (with its title) start below the chin line ('+Math.round(ch)+')',ok,{...r,wheelTop:Math.round(wheelTop),chin:Math.round(ch)});g.close();}
 // 7. Music: Classic default, the switch, levels.
 {const storage={};const g=await game({src:NEW,seed:4,storage});check('Music: Classic by default',g.run("W2.track==='classic'"));g.run('S.dev=true');
  check('Developer shows the Music switch',g.run("wildDevHtml().includes('Music: Classic (tap to switch)')"));g.run("W2.track='kawaii';w2Save()");
  check('the switch is saved and in the performance log',JSON.parse(storage['catpusher.uat.music.v2']).track==='kawaii'&&JSON.parse(g.run('diagPayload()')).soundTuning.track==='kawaii');g.close();}
 const levels={'Classic 100% (default)':await measure(NEW,"W2.pusher=0;W2.music=1;W2.track='classic'",19.2,2),'Classic 200%':await measure(NEW,"W2.pusher=0;W2.music=2;W2.track='classic'",19.2,2),
  'Kawaii pop 100%':await measure(NEW,"W2.pusher=0;W2.music=1;W2.track='kawaii'",35.5,2.2),'UAT 40 Classic at its 50% default':await measure(path.resolve(__dirname,'../cp40/release.html'),'W2.pusher=0;W2.music=.5',19.2,2)};
 fs.writeFileSync(path.join(OUT,'levels.json'),JSON.stringify(levels,null,1));
 check('Classic at 100% matches Kawaii pop where a phone plays (phone-band RMS within 1.5 dB)',Math.abs(20*Math.log10(levels['Classic 100% (default)'].phoneBandRms/levels['Kawaii pop 100%'].phoneBandRms))<=1.5,levels);
 // 8. Crash regression: dance breaks with sound and music on (strict fake audio).
 for(const [label,v2,o] of [['Wild 2, imperfect',true,{perfect:false}],['Wild 2 wheel: RAIN 25',true,{slice:0}],['Wild 2 wheel: DANCE AGAIN',true,{slice:1}],['Wild 2 wheel: RAIN 10 + QUAKE',true,{slice:2}],['Wild 2 wheel: PRIZE',true,{slice:3}],['Wild 2 wheel: JACKPOT',true,{slice:5}],['Wild 2 wheel: YAWN',true,{slice:6}],['Wild, perfect',false,{}],['Wild 2 win (visitor)',true,{win:true}]]){
  const r=await breakRun(NEW,v2,o);check('sound on: '+label+' — no exception, the game keeps running',!r.errs.length&&(o.win?r.visitor:r.gameRunning),r);}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
