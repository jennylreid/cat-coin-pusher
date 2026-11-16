// Where the cat's ear tips start on screen, for several status-bar heights (during a round, no bar drawn).
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
(async()=>{for(const top of [0,24,32,40,48,60]){const g=await game({src:path.join(__dirname,'release.html'),seed:2,render:true});strictAudio(g);const errs=[];
 g.run(`androidSafeArea.top=${top};androidSafeArea.width=innerWidth`);frames(g,5,errs);g.run("pgTitleDone();wildStartCountdown()");g.until("WILD.phase==='play'",900);frames(g,5,errs);
 g.run('PGU.toasts=[]');g.c.draw();const cv=g.c.document.getElementById('cv'),c2=cv.getContext('2d'),k=cv.width/400;const hb=g.run('hudLayout().headerBottom');
 let ear=null;for(let y=Math.ceil(hb+1);y<300&&ear==null;y++){const d=c2.getImageData(0,Math.round(y*k),cv.width,1).data;for(let x=0;x<cv.width;x++){const i=x*4;if(d[i]>200&&d[i+1]<170&&d[i+2]>150&&d[i]-d[i+1]>60){ear=y;break;}}}
 console.log(JSON.stringify({top,hb,dock:g.run('pgDock().bottom'),earPinkTop:ear,headTopEst:g.run('VIEW.y')}));g.close&&g.close();}})();
