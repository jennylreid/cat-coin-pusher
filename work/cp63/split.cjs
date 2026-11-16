const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve('../cp47-levels/release.html'),seed:7});g.c.__rn=g.realNow;g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`for(const c of PG_CATS){PG.open[c]=1;}pgSwitchBoard('ragdoll');PG.lv.passed=9;PG.lv.sel=6;wildReset();PGU.screen='board';pgStartRound();`);
 g.until("WILD.phase==='play'",900);
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');for(const x of [276,213,256,268,230,237,200,180,220]){g.pointer('pointerdown',x,Y);g.ticks(150);g.pointer('pointerup',x,Y);}
 g.run(`globalThis.__T={};for(const f of ['load','save','resetBoard','wildReset','wildEnter','pgPlay','prefill']){const o=globalThis[f];if(typeof o!=='function')continue;globalThis[f]=function(...a){const t=performance.now.call?0:0;const s=__rn();const r=o.apply(this,a);__T[f]=(__T[f]||0)+(__rn()-s);return r;};}`);
 console.log(g.run('bodies.filter(coinSolid).length'));
 const b=JSON.parse(g.run('JSON.stringify(wildButton())'));g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(12);console.log(g.run('JSON.stringify(__T)'));
})();
