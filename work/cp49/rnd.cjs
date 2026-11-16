require('./old-on49-hook.cjs');const {game}=require('../cp47/harness.cjs'),path=require('path');
(async()=>{for(const src of ['../cp48/release.html','release.html']){const g=await game({src:path.resolve(src),seed:9});const M=g.c.Math,r=M.random;const calls=[];M.random=()=>{calls.push((new Error().stack.split('\n')[2]||'').trim().slice(0,90));return r();};
 g.run('S.muted=true');g.run("wild2Enter()");console.log(src,calls.length,calls.slice(0,40).join('\n  '));}})();
