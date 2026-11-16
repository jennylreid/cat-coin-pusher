// The top bar with a phone status-bar inset (androidSafeArea), frame for the report.
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:2,render:true});strictAudio(g);const errs=[];
 g.run('androidSafeArea.top=32;androidSafeArea.bottom=24;androidSafeArea.width=innerWidth');frames(g,20,errs);g.tap(200,400);frames(g,40,errs);
 console.log(g.run('JSON.stringify({hud:hudLayout(),dock:pgDock().bottom,chin:w43ChinY(),card:w2CardLayout().card.y})'));
 g.c.draw();fs.writeFileSync(path.join(__dirname,'..','..','tickets','CP-45-evidence','uat50','board-home-inset.png'),g.c.document.getElementById('cv').toBuffer('image/png'));console.log(errs);})();
