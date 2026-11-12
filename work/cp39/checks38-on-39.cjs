// CP-38's Wild 2 checks re-run on UAT 39 (CP-37 regression). Was: CP-38 Wild 2 checks (real runtime, desktop). Writes tickets/CP-38-evidence/checks.json.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const OUT=path.resolve(__dirname,'../../tickets/CP-37-evidence/cp38-checks-on-uat39');fs.mkdirSync(OUT,{recursive:true});
const NEW=path.resolve(__dirname,'release.html'),OLD=path.resolve(__dirname,'../cp37/release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
const push=(g,id,kind='item')=>g.run(`(()=>{let b=bodies.find(b=>!b.dead&&b.kind==='${kind}'&&(${kind==='item'}?b.id==='${id}':true));if(!b)b=addCoin('${kind}',${kind==='item'?`'${id}'`:'null'},200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
const bodiesJSON="JSON.stringify(bodies.filter(b=>!b.dead).map(b=>[b.kind,b.id,+(b.rb.translation().x/M).toFixed(3),+(b.rb.translation().z/M).toFixed(3)]))";
async function boardTrace(src,bi,seed){const g=await game({src,seed});const a=g.c.__game;g.run(`selectBoard(${bi});S.coins=300;`);
 let t=0,last=-9;while(t<25){if(t-last>=.2){a.tryDrop({x:200+60*Math.sin(t*1.7),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 const r=g.run("JSON.stringify({status:board.status,collected:board.collected,coins:S.coins,b:"+bodiesJSON+"})");g.close();return r;}
async function wildTrace(src,seed){ // a Wild (1) round with drops, a rain coin, prizes and a dance break, same taps
 const g=await game({src,seed});const a=g.c.__game,w=g.run('wildButton()');g.tap(w.x+w.w/2,w.y+w.h/2);a.wildStartCountdown();g.ticks(200);
 let t=0,last=-9;while(t<14){if(t-last>=.25){a.tryDrop({x:200+60*Math.sin(t*1.3),y:g.run('DROP_Y')});last=t;}g.tick();t+=1/60;}
 push(g,null,'rain10');g.ticks(120);for(const id of ['cheese','shrimp','yarn','duck']){push(g,id);g.ticks(50);}
 g.until('!!WILD.dance');for(let k=0;k<16;k++)tapAtBeat(g,k,0);g.until('!WILD.dance');g.ticks(120);
 const r=g.run("JSON.stringify({left:+WILD.left.toFixed(3),coins:S.coins,got:WILD.got,rained:WILD.rained,b:"+bodiesJSON+"})");g.close();return r;}
function spy(g,name){g.run(`window.__n_${name}=0;{const f=sfx.${name}.bind(sfx);sfx.${name}=(...a)=>{window.__n_${name}++;return f(...a);};}`);return ()=>g.run('window.__n_'+name);}
(async()=>{
 // 1. Boards 1-3 and the Wild board play exactly as UAT 37.
 for(const bi of [0,1,2]){const a=await boardTrace(OLD,bi,5),b=await boardTrace(NEW,bi,5);check('board '+(bi+1)+' identical to UAT 37 after 25 s of play',a===b,{chars:a.length});}
 {const a=await wildTrace(OLD,6),b=await wildTrace(NEW,6);check('Wild (1) round identical to UAT 37: drops, rain coin, prizes and a dance break',a===b,{chars:a.length});}
 // 2. Wild 2: button, payoff, perfect, wheel.
 {const g=await game({seed:4}),a=g.c.__game;g.ticks(30);
  const b2=g.run('wild2Button()'),b1=g.run('wildButton()');check('a WILD 2 button sits beside WILD!, not over the mute button',b2.x>=b1.x+b1.w&&b2.x+b2.w<=g.run('W-hudLayout().right-52'));
  g.tap(b2.x+b2.w/2,b2.y+b2.h/2);check('WILD 2 opens the Wild board in Wild 2 mode with the goal card',g.run("WILD.on&&WILD.v2&&WILD.phase==='card'&&BOARD.id==='wild'"));
  a.wildStartCountdown();g.ticks(240);g.run('WILD.happy=3');push(g,'cheese');g.until('!!WILD.dance');g.until("WILD.dance.phase==='dance'");
  for(let k=0;k<16;k++)tapAtBeat(g,k,0);const bank=g.run('WILD.dance.bank.coin'),rc=g.run('WILD.dance.bank.rain5+WILD.dance.bank.rain10');
  g.until("WILD.dance.phase==='finale'");check('every beat hit: PERFECT! first',g.run("WILD.dance.perfect&&WILD.dance.stage==='perfect'"));
  g.until("WILD.dance.stage==='total'");check('then the total, "+N COINS!", before anything falls',g.run('SKY.length')===0);
  const n0=g.run('bodies.filter(b=>!b.dead).length');g.until("WILD.dance.stage==='pour'");g.ticks(2);
  check('the pour: every banked coin starts above the screen (falling past the cat), none in physics yet',g.run('SKY.length')===bank+rc&&g.run('bodies.filter(b=>!b.dead).length')===n0,{sky:g.run('SKY.length'),bank,rc});
  check('no confetti burst on Wild 2',g.run('WILD.confetti.length')===0);
  g.until("WILD.dance.stage==='wheel'");check('all banked coins land on the board',g.run('bodies.filter(b=>!b.dead).length')-n0>=bank+rc-2,{landed:g.run('bodies.filter(b=>!b.dead).length')-n0});
  g.until('WILD.dance.wheel&&WILD.dance.wheel.result');check('a perfect dance spins the prize wheel; it stops on its chosen slice',g.run("(()=>{const w=WILD.dance.wheel,seg=Math.PI*2/W2_WHEEL.length,u=((((-Math.PI/2-w.a)%(Math.PI*2))+Math.PI*4)%(Math.PI*2))/seg;return Math.floor(u)===w.i;})()"));
  const L=g.run('WILD.left');g.until('!WILD.dance',900);check('the round timer stays paused until the wheel is done, then runs',L===g.run('WILD.left')+0||(g.ticks(60),g.run('WILD.left')<L));
  // not perfect: no wheel
  g.run('WILD.happy=3');push(g,'shrimp');g.until('!!WILD.dance');g.until("WILD.dance.phase==='dance'");for(let k=0;k<15;k++)tapAtBeat(g,k,0);
  g.until("WILD.dance.phase==='finale'");check('one beat missed: no PERFECT!, straight to the total',g.run("!WILD.dance.perfect&&WILD.dance.stage==='total'"));
  g.until('!WILD.dance',900);check('…and no wheel',true);
  // EXIT and the WILD button still give Wild (1)
  {const w=g.run('wildButton()');g.tap(w.x+w.w/2,w.y+w.h/2);g.ticks(2);check('EXIT leaves Wild 2',!g.run('WILD.on')&&!g.run('WILD.v2'));g.tap(w.x+w.w/2,w.y+w.h/2);check('WILD! still opens the original Wild board',g.run('WILD.on&&!WILD.v2'));}
  g.close();}
 // 3. Each wheel slice.
 for(let i=0;i<8;i++){const g=await game({seed:7});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);g.run('S.coins=0');
  const n0=g.run('bodies.filter(b=>!b.dead).length'),f0=g.falls,label=g.run(`W2_WHEEL[${i}].label`);
  g.run(`w2ForceSlice=${i};w2StartWheelNow()`);g.until('!WILD.dance',1500);g.ticks(90);
  const kinds=g.run("JSON.stringify(bodies.filter(b=>!b.dead).map(b=>b.kind+':'+(b.id||'')))"),n1=g.run('bodies.filter(b=>!b.dead).length');
  const s=g.run(`JSON.stringify(W2_WHEEL[${i}])`),S_=JSON.parse(s);let ok,info={label};
  if(S_.n){ok=n1+(g.falls-f0)-n0>=S_.n-1;info.added=n1+(g.falls-f0)-n0;}
  else if(S_.kind==='yawn'){ok=g.falls-f0>=6;info.sweptOff=g.falls-f0;}
  else if(S_.kind==='prize'){ok=JSON.parse(kinds).filter(k=>k.startsWith('item')).length>g.run('7-WILD.got')-1||g.falls>f0;info.items=JSON.parse(kinds).filter(k=>k.startsWith('item')).length;}
  else{ok=JSON.parse(kinds).some(k=>k.startsWith(S_.kind))||g.falls>f0;}
  check('wheel slice '+label+' pays out',ok,info);g.close();}
 {const g=await game({seed:9});let tally={};g.run('wild2Enter()');for(let i=0;i<2000;i++){const k=g.run('W2_WHEEL[w2PickSlice()].label');tally[k]=(tally[k]||0)+1;}
  check('wheel odds: mostly small coin slices; RAIN 25, QUAKE and PRIZE are rare; YAWN about 1 in 12',tally['YAWN']>100&&tally['YAWN']<230&&tally['PRIZE']<120&&(tally['+10']+tally['+15']+tally['+20'])>1300,tally);g.close();}
 // 4. Coin rain from above on Wild 2 (and unchanged on Wild).
 {const g=await game({seed:4});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);push(g,null,'rain10');g.until('SKY.length>0',300);
  check('Wild 2 rain coins: the rain falls from above the screen',g.run('SKY.every(s=>s.h<=40)')&&g.run('skyScreen(SKY[0].x,SKY[0].y,0).y')>0);
  const r0=g.run('bodies.filter(b=>b.rain&&!b.dead).length');g.ticks(60*2.5);check('…and lands on the table as real coins',g.run('bodies.filter(b=>b.rain&&!b.dead).length')-r0>=8,{landed:g.run('bodies.filter(b=>b.rain&&!b.dead).length')-r0});g.close();}
 // 5. Visitor after a win.
 {const storage={};const g=await game({seed:4,storage});g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);
  g.run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese;WILD.order=['shrimp','tuna','yarn','duck','mouse','bell'];");push(g,'cheese');
  g.until("WILD.phase==='end'");g.until('!!WILD.visitor',400);
  check('after a Wild 2 win a visitor comes: the cat whose treat came first (shrimp → Siamese)',g.run("WILD.visitor.k")==='siamese'&&JSON.parse(storage['catpusher.uat.visitors.v1']).siamese===1);
  g.tap(200,300);check('tapping closes the visitor card; the end card works after',!g.run('WILD.visitor.open'));
  {const R=g.c.__game.wildEndRects();g.tap(R.again.x+R.again.w/2,R.again.y+R.again.h/2);g.ticks(240);}
  g.run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese;WILD.order=['shrimp','tuna','yarn','duck','mouse','bell'];");push(g,'cheese');g.until('!!WILD.visitor',600);
  check('the next win brings a cat not seen yet (tuna → Orange cat)',g.run('WILD.visitor.k')==='orange');
  check('the visitors-seen list is kept on the phone',Object.keys(JSON.parse(storage['catpusher.uat.visitors.v1'])).length===2);g.close();
  const g2=await game({seed:4,storage});check('…and reloads',g2.run('Object.keys(W2_SEEN).length')===2);
  g2.run('wildEnter()');g2.c.__game.wildStartCountdown();g2.ticks(240);g2.run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;delete WILD.have.cheese");push(g2,'cheese');g2.until("WILD.phase==='end'");g2.ticks(300);
  check('no visitor on the original Wild board',!g2.run('WILD.visitor'));g2.close();}
 // 6. Music and pusher sound (sound on), every board.
 {const g=await game({seed:4});g.run('S.muted=false');const bgm=spy(g,'bgm'),slide=spy(g,'slide');g.ticks(60*6.4);
  const b1=bgm(),s1=slide();check('Board 1: the background music plays (eighth notes, 112 BPM)',b1>40,{notes:b1});
  check('Board 1: the pusher slide sounds twice a stroke (forward, quieter back)',s1>=3&&s1<=5,{slides:s1,seconds:6.4});
  g.run('S.muted=true');const b2=bgm(),s2=slide();g.ticks(120);check('sound off: no music, no pusher sound',bgm()===b2&&slide()===s2);
  g.run('S.muted=false;W2.music=0;W2.pusher=0');const b3=bgm(),s3=slide();g.ticks(240);check('Music volume and Pusher sound at 0: silent',bgm()===b3&&slide()===s3);
  g.run('W2.music=.5;W2.pusher=.5;wild2Enter();wildStartCountdown()');g.ticks(240);const b4=bgm();g.ticks(60);check('Wild 2: music plays',bgm()>b4);
  g.run('WILD.happy=3');push(g,'cheese');g.until('!!WILD.dance');g.ticks(5);const b5=bgm();g.until("WILD.dance.phase==='finale'");
  check('the dance music takes over: no background notes during the dance break',bgm()===b5);g.until('!WILD.dance',900);g.ticks(60);check('…and the background music comes back after',bgm()>b5);g.close();}
 // 7. Dials, Developer buttons, performance log.
 {const storage={};const g=await game({seed:4,storage});g.run('S.dev=true');
  check('Developer mode shows Music volume, Pusher sound and the wheel buttons',g.run("(()=>{const h=wildDevHtml();return ['Music volume','Pusher sound','spin the wheel now','Wheel lands on YAWN','Wheel lands on RAIN 25','show a visitor now','Start dance break now'].every(t=>h.includes(t));})()"));
  g.run('W2.music=.3;w2Save()');check('dial values are saved and in the performance log',JSON.parse(storage['catpusher.uat.wild2.v1']).music===.3&&JSON.parse(g.run('diagPayload()')).soundTuning.music===.3);
  g.run('w2ForceWheel(7)');g.until('!!WILD.dance',600);check('"Wheel lands on YAWN" opens Wild 2 and spins straight away',g.run("WILD.v2&&WILD.dance.stage==='wheel'"));
  g.until('WILD.dance.wheel&&WILD.dance.wheel.result',600);check('…and lands on YAWN',g.run("W2_WHEEL[WILD.dance.wheel.i].kind==='yawn'"));g.close();}
 // 8. Frame cost (desktop CPU render): Wild 2 pour and wheel vs normal play and an existing rain 25.
 {const g=await game({seed:4,render:true}),rt=g.realNow;g.ticks(30);g.run('wild2Enter();wildStartCountdown()');g.ticks(240);
  const frame=()=>{const t0=rt();g.tick();g.c.draw();return rt()-t0;};const stat=xs=>{xs=[...xs].sort((a,b)=>a-b);return {avg:+(xs.reduce((s,x)=>s+x,0)/xs.length).toFixed(2),p95:+xs[Math.floor(xs.length*.95)].toFixed(2),max:+xs[xs.length-1].toFixed(2)};};
  const base=[];for(let i=0;i<180;i++)base.push(frame());
  g.run('WILD.happy=3;DANCE.rainChance=0');push(g,'cheese');g.until('!!WILD.dance');for(let k=0;k<16;k++){const target=g.run(`WILD.dance.p0+${k}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target)frame();g.tap();}
  g.until("WILD.dance.stage==='pour'");const pour=[];while(g.run("WILD.dance&&WILD.dance.stage==='pour'"))pour.push(frame());const wheel=[];while(g.run('!!WILD.dance'))wheel.push(frame());
  g.ticks(240);g.run("(()=>{const b=addCoin('rain25',null,200,30,600,yawTurn(0));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");const ref=[];for(let i=0;i<240;i++)ref.push(frame());
  const r={normal:stat(base),pour16:stat(pour),wheelAndPrize:stat(wheel),rain25WildTwo:stat(ref)};
  check('frame cost: the pour costs no more than a rain 25 (desktop ms per frame, physics and drawing)',r.pour16.p95<=r.rain25WildTwo.p95*1.15,r);fs.writeFileSync(path.join(OUT,'frame-cost.json'),JSON.stringify(r,null,1));g.close();}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
