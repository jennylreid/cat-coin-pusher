// Frames for the "nothing on the cat's face" rule: every lasting overlay, plus the chin line.
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-38-evidence/uat43');
(async()=>{for(const h of [888.889,720]){const tag=h<800?'-720':'';const g=await game({render:true,seed:4,height:h});const shot=n=>{g.c.draw();fs.writeFileSync(path.join(O,n+tag+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
 console.log(h,'chin',g.run('w43ChinY()'));
 g.ticks(30);g.run('wildEnter()');g.ticks(30);shot('face-wild1-goal-card');g.run('wildExit();wild2Enter()');g.ticks(30);shot('face-wild2-goal-card');
 g.run('wildStartCountdown()');g.ticks(30);shot('face-countdown');g.ticks(210);
 g.run('WILD.left=170;w2ForceSlice=6;w2StartWheelNow()');g.ticks(20);shot('face-perfect');g.until("WILD.dance.stage==='wheel'",400);g.ticks(70);shot('face-wheel-waiting');g.tap();g.ticks(90);shot('face-wheel-spinning');
 g.until('WILD.dance&&WILD.dance.wheel&&WILD.dance.wheel.result',900);g.ticks(10);shot('face-wheel-result');g.until("!WILD.dance||WILD.dance.stage==='yawn'",400);g.ticks(30);shot('face-yawn');g.until('!WILD.dance',900);
 g.run('WILD.left=8');g.ticks(60);shot('face-last-seconds');
 g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;WILD.order.push(id);}}board.status='playing';wildFinish(true)");g.ticks(60*3.2);shot('face-visitor-card');g.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
