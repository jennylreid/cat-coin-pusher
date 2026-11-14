const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{for(const height of [711,889,960])for(const inset of [0,24,48]){const g=await game({src:path.join(__dirname,'release.html'),seed:3,height});
 g.run(`androidSafeArea.top=${inset};androidSafeArea.bottom=24;androidSafeArea.width=innerWidth`);g.ticks(3);
 g.run(`try{document.documentElement.style.setProperty('--sat','${inset}px')}catch(e){}`);
 console.log(height,inset,g.run("JSON.stringify((()=>{const h=hudLayout();const b=wildButton();return {H,top:h.top,mainY:h.mainY,bannerY:h.bannerY,headerBottom:h.headerBottom,right:h.right,exit:[b.x,b.y,b.x+b.w,b.y+b.h],viewY:Math.round(VIEW.y)}})())"));g.close();}})();
