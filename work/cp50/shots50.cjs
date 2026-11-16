// Quick frames: title, board goal card with the top bar, the picker, end card.
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'out');const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:2,render:true});const st=strictAudio(g);g.run('S.muted=false');const errs=[];
 frames(g,3,errs);console.log('screen',g.run('PGU.screen'),'hud',g.run('JSON.stringify(hudLayout())'),'H',g.run('H'));
 frames(g,40,errs);shot(g,'title-0.7');frames(g,50,errs);shot(g,'title-1.5');frames(g,80,errs);console.log('after title',g.run('PGU.screen'),g.run('WILD.on'),g.run('WILD.phase'));
 frames(g,30,errs);shot(g,'board-card');console.log('dock',g.run('JSON.stringify(pgDock())'));
 g.run('PGU.pick=true;PGU.pickT=0');frames(g,20,errs);shot(g,'picker');g.run('PGU.pick=false');
 console.log('errs',errs,'nodes',st.created);g.close&&g.close();})();
