const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await game({src:path.resolve('proto48.html'),seed:2,render:true}),cv=g.c.document.getElementById('cv');g.run('S.dev=true;S.muted=false');
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join('out',`tw-${n}.png`),cv.toBuffer('image/png'));};
 g.run('MODES_UI.open=true;MODES_UI.t=1');shot('0-picker');g.run(`MODES_UI.open=false;wildModeEnter('towers')`);g.ticks(30);shot('1-card');
 g.run('wildStartCountdown()');g.until(`WILD.phase==='play'`,900);g.ticks(10);shot('2-wall');
 for(let s=0;s<40;s++){g.run(`S.coins=Math.max(S.coins,60);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+2),y:DROP_Y};`);g.ticks(60);
  if(g.run('!!PAW40_STATE.teeter')){shot('3-glow-'+s);}
  if(s===8||s===16||s===30)shot('4-play-'+s);}
 g.close&&g.close();})();
