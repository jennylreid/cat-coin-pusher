const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm'),fs=require('fs');
(async()=>{const storage={};const g=await make({sourceFile:path.resolve(__dirname,'release.html'),seed:1,storage});const run=s=>vm.runInContext(s,g.c);
 const html0=run('wildDevHtml()');run("stepWildDial('seconds',1);stepWildDial('coins',-1);");const after=run('[WILD_SECONDS,WILD_COINS]');
 g.c.__game.wildEnter();const inRound=[g.c.__game.WILD.left,run('S.coins')];g.close();
 const g2=await make({sourceFile:path.resolve(__dirname,'release.html'),seed:1,storage});const kept=vm.runInContext('[WILD_SECONDS,WILD_COINS]',g2.c);g2.close();
 const r={labels:/Wild timer: 60 s/.test(html0)&&/Wild starting coins: 110/.test(html0),after,inRound,keptAfterRestart:kept};
 const ok=r.labels&&after[0]===65&&after[1]===100&&inRound[0]===65&&inRound[1]===100&&kept[0]===65;console.log(JSON.stringify(r),ok?'PASS':'FAIL');
 const f=path.resolve(__dirname,'../../tickets/CP-35-evidence/checks.json'),c=JSON.parse(fs.readFileSync(f));(ok?c.passed:c.failed).push('Developer dials: Wild timer and starting coins step, apply to the next round and persist');fs.writeFileSync(f,JSON.stringify(c,null,1));})();
