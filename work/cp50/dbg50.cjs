const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:5,render:true});strictAudio(g);const errs=[];frames(g,3,errs);
 g.run("PG.open.orange=1;PG.openOrder.push('orange');PG.level=5;pgPlay('orange')");frames(g,30,errs);
 const J=x=>JSON.parse(g.run('JSON.stringify('+x+')'));console.log(J('{cat:PGU.boardCat,mode:WILD.mode,phase:WILD.phase,pick:PGU.pick,rest:pgRestPhase()}'));
 const t=J("pgDock().tiles.find(t=>t.id==='board')");g.tap(t.x+t.w/2,t.y+t.h/2);frames(g,30,errs);console.log('pick',g.run('PGU.pick'),J('pgPickRects().rows[0]'));
 const r=J('pgPickRects().rows[0]');g.tap(r.x+r.w/2,r.y+r.h/2);frames(g,30,errs);console.log(J('{cat:PGU.boardCat,mode:WILD.mode,phase:WILD.phase,on:WILD.on,art:ART.head===PG_ORIG.head,scr:PGU.screen,toasts:PGU.toasts.map(t=>t.text)}'),errs);})();
