// UAT 36 checks (real runtime, desktop): the CP-35 suite re-run on UAT 36 (Boards 1-3 against UAT 35), plus Pop and the
// new end card. Writes tickets/CP-36-evidence/uat36-suite/checks.json.
const make=require('../cp33/runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm');
const OUT=path.resolve(__dirname,'../../tickets/CP-36-evidence/uat36-suite');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const NEW=path.resolve(__dirname,'../cp37/release.html'),OLD=path.resolve(__dirname,'../cp35/release.html');
async function boardTrace(src,bi,seed,pre='',untilWon=false){
 const g=await make({sourceFile:src,seed});const a=g.c.__game,run=s=>vm.runInContext(s,g.c);run(pre+`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;const sounds=[];while(t<25&&!(untilWon&&run('board.status')!=='playing'&&t>1)){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,earned:board.earnedQuakes,bodies:bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)])})");g.close();return r;
}
(async()=>{
 // 1. Boards 1-3 play exactly as UAT 34 (same seed, same 25 s of hold-sweep drops): identical bodies, prizes and purse.
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5,'pickupFx.popStyle=0;');check('board '+(bi+1)+' (Pickup style Current) identical to UAT 35 after 25 s of play',a===b,{chars:a.length});}
 // With Pop the boards play the same; the only difference is that a won board moves on sooner, because the game waits for pickups to finish.
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5,'',true),b=await boardTrace(NEW,bi,5,'',true);check('board '+(bi+1)+' (Pop) identical to UAT 35 until the board is won',a===b,{chars:a.length});}
 // 2. Wild round leaves the normal save and purse alone, and Exit restores the board exactly.
 {const storage={};const g=await make({sourceFile:NEW,seed:3,storage});const a=g.c.__game,run=s=>vm.runInContext(s,g.c);
  run('DANCE.notches=99;selectBoard(1);S.coins=137;');for(let i=0;i<120;i++)g.tick();run('save()');
  const key='catpusher.uat.loop.v1',before=storage[key],bodiesBefore=run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id]))"),coinsBefore=run('S.coins');
  check('WILD button enters the Wild board and shows the goal card',(()=>{const w=a.wildButton();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);return a.WILD.on&&a.WILD.phase==='card'&&a.BOARD.id==='wild';})());
  check('Wild bank is separate from the purse',run('S.coins')===110,{wildCoins:run('S.coins'),purse:coinsBefore});
  check('board shows rain coins, 7 prizes, a Quake coin and 2 towers',run("bodies.filter(b=>RAIN[b.kind]).length===2&&bodies.filter(b=>b.kind==='item').length===7&&bodies.filter(b=>b.kind==='quake').length===1&&bodies.filter(b=>b.kind==='stack').length===2"));
  {const tapsBefore=run('board.used');g.pointer('pointerdown',200,700);check('taps on the board do not drop coins while the goal card is up',run('board.used')===tapsBefore&&a.WILD.phase==='card');}
  {const R=a.wildCardRects();g.pointer('pointerdown',R.go.x+R.go.w/2,R.go.y+R.go.h/2);check('GO starts a 3-2-1 countdown',a.WILD.phase==='count');}
  for(let i=0;i<60*3.2;i++)g.tick();check('after the countdown the board is playing with 60 s on the timer',a.WILD.phase==='play'&&a.board.status==='playing'&&a.WILD.left>59,{left:a.WILD.left});
  let t=0,last=-9,maxRain=0;while(t<20){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.3),y:run('DROP_Y')});last=t;}g.tick();t+=1/60;}
  check('normal save is not written during the Wild round',storage[key]===before);
  check('timer counts down in play',Math.abs(a.WILD.left-40)<.2,{left:+a.WILD.left.toFixed(2)});
  check('bonus drops arrive (first at 5 s, then every 6-9 s)',a.WILD.bonusN>=2,{bonus:a.WILD.bonusN});
  // Rain: collect a rain coin over the front edge and count the coins that fall in from above.
  {const n0=run('bodies.filter(b=>b.rain).length+WILD.rained');run("(()=>{let b=bodies.find(b=>!b.dead&&b.kind==='rain10');if(!b)b=addCoin('rain10',null,200,30,500,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");
   const r0=a.WILD.rained;let k=0,startAt=-1;while(k<60*5){g.tick();k++;if(startAt<0&&a.WILD.rained>r0)startAt=k/60;}
   const f=a.treatAwards[a.treatAwards.length-1];
   check('rain coin gets the pickup moment, then 10 coins rain in',a.WILD.rained-r0>=10&&startAt>0.2&&startAt<2.6,{rained:a.WILD.rained-r0,startedAfterSec:startAt});}
  // Prize: count.
  {const g0=a.WILD.got;run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");g.tick();g.tick();
   check('a collection prize off the front is ticked off and plays the pickup',a.WILD.got===g0+1&&a.treatAwards.some(f=>!f.arrived&&f.kind==='item'),{got:a.WILD.got,have:Object.keys(a.WILD.have)});
   const id=Object.keys(a.WILD.have)[0],c0=run('S.coins');run(`(()=>{const b=addCoin('item','${id}',200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);g.tick();g.tick();
   check('a repeat of a collected prize does not count twice and pays 5 coins',a.WILD.got===g0+1&&run('S.coins')>=c0+5,{got:a.WILD.got});
   const lost=run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&!WILD.have[b.id]);const id=b.id;removeCoin(b);return id;})()");let k=0;while(k<60*4&&!a.WILD.incoming.some(o=>o.id===lost)&&!run(`bodies.some(b=>!b.dead&&b.kind==='item'&&b.id==='${lost}')`)){g.tick();k++;}
   check('a needed prize lost off the board comes back by bonus drop within 2 s',k<60*2.2,{prize:lost,afterSec:+(k/60).toFixed(2)});
   check('Wild prizes do not change the inventory',run("JSON.stringify(S.got)")===run("JSON.stringify(JSON.parse(localStorage.getItem('catpusher.uat.loop.v1')).got)"));}
  // Turbo at 30 s left.
  run('WILD.left=25.05');for(let i=0;i<10;i++)g.tick();check('Turbo pusher starts at 0:25 and keeps the pusher in place',a.WILD.turbo>0&&run('PUSH_PERIOD')===1.5);
  for(let i=0;i<60*8.5;i++)g.tick();check('Turbo ends after 8 s',a.WILD.turbo===0&&run('PUSH_PERIOD')===3.2);
  // Lose.
  run('WILD.left=0.5');for(let i=0;i<60;i++)g.tick();check("time running out ends the round: Time's up",a.WILD.phase==='end'&&!a.WILD.win&&a.board.status==='lost'&&a.WILD.reason==='time');
  {const used=run('board.used');a.tryDrop({x:200,y:run('DROP_Y')});check('no drops after the end',run('board.used')===used);}
  for(let i=0;i<60;i++)g.tick();
  {const R=a.wildEndRects();g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);check('Play again restarts the Wild board with a countdown and a full bank',a.WILD.phase==='count'&&a.WILD.left===60&&run('S.coins')===110&&a.WILD.got===0);}
  for(let i=0;i<60*3.2;i++)g.tick();
  {run('S.coins=0;board.earnedQuakes=0;WILD.rainLeft=0;WILD.rains=[];WILD.incoming=[];WILD.nextBonus=99');let k=0;while(a.WILD.phase==='play'&&k<60*20){g.tick();k++;run('WILD.nextBonus=99');}
   check('empty bank and nothing paying out for 6 s ends the round: Out of coins',a.WILD.phase==='end'&&a.WILD.reason==='coins'&&k>=60*6,{afterSec:+(k/60).toFixed(1)});}
  {const R=a.wildEndRects();for(let i=0;i<60;i++)g.tick();g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);for(let i=0;i<60*3.2;i++)g.tick();check('Play again after Out of coins restarts with a full bank',a.WILD.phase==='play'&&run('S.coins')===110);}
  // Win.
  run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese");run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese')||addCoin('item','cheese',200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");for(let i=0;i<60;i++)g.tick();
  check('the last prize of the collection wins: win screen and the cat dances',a.WILD.phase==='end'&&a.WILD.win&&a.board.status==='won'&&!!run('pawDance'));
  {const R=a.wildEndRects(),inC=(b)=>b.x>=R.card.x&&b.x+b.w<=R.card.x+R.card.w&&b.y>=R.card.y&&b.y+b.h<=R.card.y+R.card.h;
   check('end card sits below the cat (top at 446, lowest dancing claw ~432) with Play again and Back inside it',R.card.y>=440&&inC(R.again)&&inC(R.back)&&R.card.y+R.card.h<=run('H'),{card:R.card});}
  for(let i=0;i<60;i++)g.tick();
  {const R=a.wildEndRects();g.pointer('pointerdown',R.back.x+R.back.w/2,R.back.y+R.back.h/2);}
  check('Back to the game restores the normal board, purse and save',!a.WILD.on&&a.BOARD.id==='twin-towers'&&run('S.coins')>=coinsBefore&&run('S.coins')<=coinsBefore+3&&run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id]))")===bodiesBefore&&!run('pawDance'),{coins:run('S.coins'),board:a.BOARD.id});
  check('PUSH_PERIOD back to normal after exit',run('PUSH_PERIOD')===3.2);
  // Exit mid-round from the header button.
  {const w=a.wildButton();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);const R=a.wildCardRects();g.pointer('pointerdown',R.go.x+R.go.w/2,R.go.y+R.go.h/2);for(let i=0;i<60*5;i++)g.tick();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);
   check('EXIT mid-round goes straight back to the normal board',!a.WILD.on&&a.BOARD.id==='twin-towers'&&run('S.coins')>=coinsBefore&&run('S.coins')<=coinsBefore+3,{coins:run('S.coins')});}
  // App closed mid-round: what's on disk is the normal board.
  {const w=a.wildButton();g.pointer('pointerdown',w.x+w.w/2,w.y+w.h/2);const st={...storage};g.close();const g2=await make({sourceFile:NEW,seed:3,storage:st});
   check('reopening after closing mid-round loads the normal board and purse',g2.c.__game.BOARD.id==='twin-towers'&&vm.runInContext('S.coins',g2.c)>=coinsBefore&&vm.runInContext('S.coins',g2.c)<=coinsBefore+3&&!g2.c.__game.WILD.on);g2.close();}
 }
 // 3. Sound setting and Pickup volume reach the Wild sounds.
 {const g=await make({sourceFile:NEW,seed:2});const run=s=>vm.runInContext(s,g.c);
  const calls=run(`(()=>{let n=0;const real=window.AudioContext;window.AudioContext=function(){return {state:'running',currentTime:0,sampleRate:8000,destination:{},createGain(){return {gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}},createOscillator(){n++;return {type:'',frequency:{setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},start(){},stop(){}}},createBuffer(){return {getChannelData(){return new Float32Array(10)}}},createBufferSource(){n++;return {connect(){},start(){},stop(){}}},createBiquadFilter(){return {frequency:{value:0},Q:{value:0},connect(){}}},resume(){}}};
   document.hidden=false;S.muted=false;const r={};sfx.wild('win');r.on=n;n=0;S.muted=true;sfx.wild('win');r.muted=n;S.muted=false;pickupFx.volume=0;sfx.wild('win');r.vol0=n;pickupFx.volume=1;return r;})()`);
  check('Wild sounds play with sound on, are silent with sound off or Pickup volume 0',calls.on>10&&calls.muted===0&&calls.vol0===0,calls);g.close();}

 // 4. Pickup style Pop (default) against Current (UAT 35's flight).
 {const storage={};const g=await make({sourceFile:NEW,seed:6,storage});const a=g.c.__game,run=s=>vm.runInContext(s,g.c);
  check('Pickup style defaults to Pop with Pop peak 100%, time at peak 0.25 s, shrink 0.45 s',run('pickupFx.popStyle')===1&&run('pickupFx.popPeak')===1&&run('pickupFx.popHold')===.25&&run('pickupFx.popShrink')===.45);
  const probe=(id,kind='item')=>{for(let i=0;i<15;i++)g.tick();return JSON.parse(run(`(()=>{treatAwards.length=0;const snd=[],real=sfx.pickup;sfx.pickup=(k,v)=>snd.push(k);const f=queueTreatAward('${id}',200,null,true,'${kind}');
   const cp=q=>({x:q.x,y:q.y,s:q.s,rot:q.rot}),pk=cp(pickupPoint(f,f.tr)),w=prizeWidth(f.id,pk.s),early=pickupPoint(f,f.tr*.5).s,lv=f.tr+f.tm,mid=cp(pickupPoint(f,lv+f.td*.5)),end=cp(pickupPoint(f,lv+f.td)),tg=f.kind==='quake'?quakeTarget():pickupTarget();
   let bounce=-1;const T0=tileBounceT;for(let i=0;i<Math.ceil((lv+f.td)*60)+2;i++)tickTreatAwards(1/60);bounce=tileBounceT;sfx.pickup=real;
   return JSON.stringify({pop:!!f.pop,tr:f.tr,tm:f.tm,td:f.td,peakW:w,peakX:pk.x,earlyFrac:early/f.ms,midRot:mid.rot,midS:mid.s/f.ms,endAtBag:Math.hypot(end.x-tg.x,end.y-tg.y),endS:end.s,es:f.es,snd,bounced:bounce>=0||${'f.kind'}==='quake'});})()`));};
  for(const id of ['cheese','shrimp','tuna','rain5','rain10','rain25','yarn']){const q=probe(id);
   check('Pop '+id+': rises in 0.2 s, visible art fills the screen width at the peak, holds, shrinks and spins into the bag',q.pop&&Math.abs(q.tr-.2)<1e-9&&Math.abs(q.tm-.25)<1e-9&&Math.abs(q.td-.45)<1e-9&&Math.abs(q.peakW-400)<2&&Math.abs(q.peakX-200)<1&&q.midS<.4&&Math.abs(q.midRot)>1&&q.endAtBag<1&&Math.abs(q.endS-q.es)<1e-6&&q.snd.includes('bell'),q);
   if(id==='cheese')check('Pop keeps the ledge bell, landing thump and bag bounce',q.snd.includes('bell')&&q.snd.includes('thump')&&q.bounced,{sounds:q.snd});}
  {const q=probe('quake','quake');check('Quake coin keeps its own flight (not Pop)',!q.pop&&Math.abs(q.td-run('pickupFx.quakeFlight'))<1e-9,q);}
  {const r=JSON.parse(run("(()=>{treatAwards.length=0;const f1=queueTreatAward('cheese',200,null,true),f2=queueTreatAward('tuna',260,null,true),f3=queueTreatAward('shrimp',140,null,true);return JSON.stringify({w2:-f2.t,w3:-f3.t,first:f1.tr+f1.tm,tm3:f3.tm});})()"));
   check('Pop pickups take turns (the next rises as the one ahead leaves the middle; 3rd onwards holds half as long)',Math.abs(r.w2-r.first)<1e-9&&r.w3>r.w2&&Math.abs(r.tm3-.125)<1e-9,r);}
  {const html=run("S.dev=true;(()=>{const stub=()=>({onclick:null,style:{},querySelector:stub,querySelectorAll:()=>[]});panel.querySelector=stub;panel.querySelectorAll=()=>[];openCredits();const h=panel.innerHTML;panel.style.display='none';return h;})()");
   check('Developer > Prize feedback shows the Pickup style toggle and the three Pop dials',/Pickup style: Pop \(tap to switch\)/.test(html)&&/Pop peak size: 100% of screen width/.test(html)&&/Pop time at peak: 0.25 s/.test(html)&&/Pop shrink time: 0.45 s/.test(html));}
  run("stepPickupFx('popPeak',-1);stepPickupFx('popHold',1);stepPickupFx('popShrink',-1);pickupFx.popStyle=0;savePickupFx();");g.close();
  const g2=await make({sourceFile:NEW,seed:6,storage}),run2=s=>vm.runInContext(s,g2.c);const kept=JSON.parse(run2("JSON.stringify([pickupFx.popStyle,pickupFx.popPeak,pickupFx.popHold,pickupFx.popShrink])"));
  check('Pop dials and the style choice are saved on the phone',kept[0]===0&&kept[1]===.95&&kept[2]===.3&&kept[3]===.4,kept);
  // Current: the same flight as UAT 35 (same seed, same calls).
  const trace=async(src,pre)=>{const h=await make({sourceFile:src,seed:8});const r=vm.runInContext(pre+"(()=>{const out=[];for(const id of ['cheese','tuna','shrimp']){treatAwards.length=0;const f=queueTreatAward(id,180,null,true);for(let t=0;t<=f.tr+f.tm+f.td+.01;t+=.05){const q=pickupPoint(f,t);out.push([q.x,q.y,q.s,q.rot,q.flip].map(v=>+v.toFixed(5)));}}return JSON.stringify(out);})()",h.c);h.close();return r;};
  const cur=await trace(NEW,'pickupFx.popStyle=0;'),old=await trace(OLD,'');check('Pickup style Current is the UAT 34/35 flight, unchanged',cur===old,{chars:cur.length});
  run2("resetPickupFx()");check('Reset tuning returns to Pop',run2('pickupFx.popStyle')===1&&run2('pickupFx.popPeak')===1);g2.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({build:'2026.11.12 UAT 36',passed,failed},null,1));
 console.log(passed.length,'passed',failed.length,'failed');if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exitCode=1;});
