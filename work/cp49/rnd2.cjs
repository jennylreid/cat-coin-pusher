const {game}=require('../cp47/harness.cjs'),path=require('path');
(async()=>{for(const src of ['../cp48/release.html','release.html']){const g=await game({src:path.resolve(src),seed:9});console.log(src,g.c.Math.random(), g.run('typeof seededRandom==="function"?seededRandom():0'));}})();
