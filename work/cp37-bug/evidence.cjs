// CP-37 evidence frames: Wild and Board 3 after N s of hold-to-drop; each frame normal and with the cat art hidden
// (cut-away: shows what is underneath the head and mitts). node evidence.cjs <src> <tag> <board> <sec> [seed]
const {game}=require('../cp37/harness.cjs'),fs=require('fs'),path=require('path');
const [,,s0,tag,board,sec,seedA]=process.argv;const src=path.resolve(s0),seed=+(seedA||4);
const O=path.resolve(__dirname,'out','evidence');fs.mkdirSync(O,{recursive:true});
(async()=>{const g=await game({seed,render:true,src}),a=g.c.__game,cv=g.c.document.getElementById('cv');
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');g.run('finishBoard=()=>{}');
 for(let s=0;s<+sec;s++){g.run(`S.coins=Math.max(S.coins,50);if(globalThis.WILD&&WILD.on){WILD.got=Math.min(WILD.got,WILD_GOAL-2);WILD.left=Math.max(WILD.left,30);}holding=true;holdPos={x:200+70*Math.sin(${s}*0.9+${seed}),y:DROP_Y};`);g.ticks(60);}
 g.run('holding=false');g.ticks(20); // let the last drop land; no pickup overlay mid-air
 g.c.draw();fs.writeFileSync(path.join(O,`${board}-${sec}s-${tag}.png`),cv.toBuffer('image/png'));
 g.c.__blank=g.c.document.createElement('canvas');g.run('ART.head=ART.headWild=ART.headSweet=__blank;drawPaws=drawHappyPaws=drawTrackingPupils=drawHappyFeatures=()=>{}');
 g.c.draw();fs.writeFileSync(path.join(O,`${board}-${sec}s-${tag}-cutaway.png`),cv.toBuffer('image/png'));
 const tall=g.run('bodies.filter(b=>!b.dead&&b.rb.translation().z/M<CHIN_Y+60).map(b=>+(b.rb.translation().y/M).toFixed(0)).sort((a,b)=>b-a).slice(0,8)');
 console.log(board,sec,tag,'highest coins near the backstop (height):',JSON.stringify(tall));g.close();})();
