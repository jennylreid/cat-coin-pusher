const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{for(const height of [720,889,960]){const g=await game({src:path.join(__dirname,'release.html'),seed:3,height,storage:{'catpusher.uat.homelayout.v1':'B'}});g.ticks(130);g.tap(200,400);g.ticks(40);
console.log(height,g.run("JSON.stringify((()=>{const h=hudLayout(),B=pgBLayout();return {bottomY:h.bottomY,bottom:h.bottom,settingsY:h.settingsY,bot:B.bot,play:B.play,ph:B.playH,H}})())"));g.close();}})();
