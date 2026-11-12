// Frames: the COZY button, the Cozy goal card (tall and 720-high), the heart coin incoming and on the board.
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,process.env.PET_OUT||'../../tickets/CP-43-evidence');fs.mkdirSync(O,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const src=path.resolve(process.argv[2]||'release.html');
 let g=await game({src,render:true,seed:4});g.ticks(30);shot(g,'10-cozy-button');
 g.run('petEnter()');g.ticks(30);shot(g,'11-cozy-goal-card');g.close();
 g=await game({src,render:true,seed:4,height:720});g.run('petEnter()');g.ticks(30);shot(g,'12-cozy-goal-card-720');g.close();
 g=await game({src,render:true,seed:4});g.run('petEnter();wildStartCountdown()');g.ticks(250);
 g.run("WILD.bonusN=WILD.heartAt-1;WILD.nextBonus=0");let k=0;while(!g.run("WILD.incoming.some(o=>o.kind==='heart')")&&k<600){g.tick();k++;}g.ticks(20);shot(g,'13-heart-coin-incoming');
 g.ticks(80);shot(g,'14-heart-coin-on-board');g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
