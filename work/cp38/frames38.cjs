// CP-38 evidence frames (desktop, real runtime, @napi-rs/canvas at DPR 1.35, H 888.9). Not phone evidence.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-38-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const push=(g,id)=>g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
const enter2=g=>{const b=g.run('wild2Button()');g.tap(b.x+b.w/2,b.y+b.h/2);};
const mode=process.argv[2]||'all';
(async()=>{
 if(mode==='all'||mode==='dance'){const g=await game({render:true,seed:4}),a=g.c.__game;g.ticks(30);shot(g,'buttons-wild-and-wild2');
  enter2(g);g.ticks(20);shot(g,'wild2-goal-card');a.wildStartCountdown();g.ticks(240);
  g.run('WILD.happy=3');push(g,'cheese');g.until('!!WILD.dance');g.until("WILD.dance.phase==='dance'");
  for(let k=0;k<7;k++)tapAtBeat(g,k,0);g.ticks(3);shot(g,'dance-1-bank-counter-7');
  for(let k=7;k<16;k++)tapAtBeat(g,k,0);g.ticks(3);shot(g,'dance-2-bank-counter-16');
  g.until("WILD.dance.phase==='finale'");g.ticks(30);shot(g,'payoff-1-perfect');
  g.until("WILD.dance.stage==='total'");g.ticks(20);shot(g,'payoff-2-total');
  g.until("WILD.dance.stage==='pour'");g.ticks(22);shot(g,'payoff-3-pour-past-cat');g.ticks(16);shot(g,'payoff-4-pour');
  g.until("WILD.dance.stage==='wheel'");g.ticks(60);shot(g,'wheel-1-spinning');g.until('WILD.dance.wheel&&WILD.dance.wheel.result');g.ticks(20);shot(g,'wheel-2-result');
  g.until('!WILD.dance',900);g.ticks(30);shot(g,'after-payoff');
  g.close();}
 if(mode==='all'||mode==='yawn'){const g=await game({render:true,seed:4});g.ticks(30);enter2(g);g.c.__game.wildStartCountdown();g.ticks(240);
  g.run('w2ForceSlice=7;w2StartWheelNow()');g.until("WILD.dance.wheel&&WILD.dance.wheel.result");g.ticks(30);shot(g,'yawn-0-wheel-yawn');g.until("WILD.dance.stage==='yawn'");
  for(const [n,tag] of [[20,'1-stretch'],[40,'2-paws-forward'],[30,'3-sweep'],[25,'4-sweep-out'],[60,'5-back']]){g.ticks(n);shot(g,'yawn-'+tag);}g.close();}
 if(mode==='all'||mode==='rain'){const g=await game({render:true,seed:4});g.ticks(30);enter2(g);g.c.__game.wildStartCountdown();g.ticks(240);
  g.run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='rain10');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");g.until('WILD.rainLeft>0||SKY.length>0',300);g.ticks(30);shot(g,'rain10-falling-from-above');g.ticks(30);shot(g,'rain10-falling-2');g.close();}
 if(mode==='all'||mode==='visitor'){const g=await game({render:true,seed:4});g.ticks(30);enter2(g);g.c.__game.wildStartCountdown();g.ticks(240);
  g.run("for(const id of WILD_COLLECTION.slice(1)){WILD.have[id]=true;WILD.order.push(id);}WILD.got=WILD_GOAL-1;delete WILD.have.cheese;WILD.order=['tuna','shrimp','yarn','duck','mouse','bell'];");push(g,'cheese');
  g.until("WILD.phase==='end'");g.ticks(100);shot(g,'win-1-dance');g.until('!!WILD.visitor');g.ticks(25);shot(g,'visitor-card');
  g.tap(200,300);g.ticks(10);shot(g,'visitor-closed-end-card');g.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
