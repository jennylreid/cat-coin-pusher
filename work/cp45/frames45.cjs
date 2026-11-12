// CP-41 frames: the MODES button, the picker and the Treat toss goal card (desktop renderer at DPR 1.35, H 888.9).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-41-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({seed:4,render:true});g.ticks(30);shot(g,'0a-normal-board-modes-button');
 const B=JSON.parse(g.run('JSON.stringify(modesButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(20);shot(g,'0b-modes-picker');
 const R=JSON.parse(g.run('JSON.stringify(modesPickerRects())'));g.tap(R.rows[0].x+60,R.rows[0].y+30);g.ticks(30);shot(g,'0c-treat-toss-goal-card');
 g.run('wildExit()');g.run('wild2Enter()');g.ticks(30);shot(g,'0d-wild2-goal-card-unchanged');g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
