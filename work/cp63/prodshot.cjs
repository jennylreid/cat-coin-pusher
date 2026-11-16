const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await game({src:path.resolve('../cp25/promotion/release.html'),render:true,seed:5});g.ticks(120);
 console.log(g.run("JSON.stringify({board:typeof boardIndex!=='undefined'?boardIndex:null,coins:bodies.filter(b=>!b.dead&&(b.kind==='coin'||b.kind==='silver')).length,stacks:bodies.filter(b=>!b.dead&&b.kind==='stack').length})"));
 g.c.draw();fs.writeFileSync('../../tickets/CP-48-evidence/uat63/production-board1.png',g.c.document.getElementById('cv').toBuffer('image/png'));})();
