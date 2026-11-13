const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
(async()=>{const g=await game({src:path.resolve('../cp48/release.html'),seed:2,render:true});const cv=g.c.document.getElementById('cv');
g.ticks(30);g.c.draw();fs.writeFileSync('out/base-board.png',cv.toBuffer('image/png'));
g.run('wild2Enter()');g.ticks(30);g.c.draw();fs.writeFileSync('out/base-w2card.png',cv.toBuffer('image/png'));
g.run('wildStartCountdown()');g.until("WILD.phase==='play'",900);g.ticks(30);g.c.draw();fs.writeFileSync('out/base-w2play.png',cv.toBuffer('image/png'));
console.log(g.run('W'),g.run('H'),g.run('scale'),g.run('renderPixelRatio'),cv.width,cv.height);g.close&&g.close();})();
