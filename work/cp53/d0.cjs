const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:3});g.ticks(20);g.tap(200,400);g.ticks(40);g.run(`DANCE.move=0;danceStartNow()`);g.until("WILD.dance&&WILD.dance.phase==='dance'",2000);
for(let i=0;i<8;i++){g.ticks(9);console.log(g.run(`JSON.stringify([(danceNow()-WILD.dance.p0)/WILD.dance.beat,pawDancePhase(),pawGaze(),pawMotion(0),!!pawDance&&pawDance.dbreak,WILD.dance.move])`));}g.close();})();
