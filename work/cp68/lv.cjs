const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('../cp67/release.html'),seed:1});console.log(g.run("JSON.stringify(PGL_LEVELS.map((l,i)=>[i+1,l.name,l.tag,l.coins,l.secs,l.goal.length]))"));})();
