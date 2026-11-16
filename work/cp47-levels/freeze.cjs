// Freeze investigation (UAT 62, Nov 15): replay Jenny's last 40 s: Ragdoll on Level 6, Hug early, hold until the
// 110 coins run out, let the round end on "out of coins", then try the buttons. Logs real ms per tick, coins, errors.
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'release.html'),LV=+(process.env.LV||6),HUG=process.env.HUG!=='0';
(async()=>{const g=await game({src,render:false,seed:+(process.env.SEED||7)});g.run('S.muted=false');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,400));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`for(const c of PG_CATS){PG.open[c]=1;}PG.powers={ragdoll:2};pgSwitchBoard('ragdoll');PG.lv.passed=9;PG.lv.sel=${LV-1};wildReset();PGU.screen='board';pgStartRound();`);
 g.until("WILD.phase==='play'",900);
 const st=()=>JSON.parse(g.run(`JSON.stringify({t:+time.toFixed(1),phase:WILD.phase,status:board.status,left:+WILD.left.toFixed(1),bank:S.coins,coins:bodies.filter(coinSolid).length,bodies:bodies.length,px:PGPX&&PGPX.id,screen:PGU.screen,panel:panel.style.display,inv:inventoryOpen,holding,errs:__errs.length})`));
 let k=0,worst=0;const log=[];const tick=()=>{const a=g.realNow();g.tick();const d=g.realNow()-a;worst=Math.max(worst,d);k++;return d;};
 const hold=(x,n)=>{g.pointer('pointerdown',x,DROP_SCREEN_Y);for(let i=0;i<n;i++)tick();g.pointer('pointerup',x,DROP_SCREEN_Y);};
 var DROP_SCREEN_Y=+g.run('Math.round(hudLayout().headerBottom+60)');
 hold(227,146);hold(212,46);
 if(HUG){const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);console.log('hug',JSON.stringify(st()));}
 for(const [x,n] of [[276,350],[213,370],[256,440],[268,170],[230,90],[237,105]]){g.ticks(40);let ms=0;for(let i=0;i<n;i+=30){const m=Math.min(30,n-i);g.pointer('pointerdown',x,DROP_SCREEN_Y);for(let j=0;j<m;j++)ms+=tick();if(i+m>=n)g.pointer('pointerup',x,DROP_SCREEN_Y);}
  log.push({...st(),msPerTick:+(ms/n).toFixed(1)});console.log(JSON.stringify(log.at(-1)));}
 let sec=0;while(g.run("WILD.phase")==='play'&&sec<(+process.env.SECS||60)){let ms=0,mx=0;for(let i=0;i<60;i++){const d=tick();ms+=d;mx=Math.max(mx,d);}sec++;const s=st();console.log('sec',JSON.stringify({left:s.left,coins:s.coins,turbo:+g.run('WILD.turbo').toFixed(1),period:+g.run('PUSH_PERIOD').toFixed(2),msPerTick:+(ms/60).toFixed(1),maxTick:+mx.toFixed(0)}));}
 let ended=g.until("WILD.phase==='end'",60*40);console.log('ended',ended,JSON.stringify(st()),'worst tick ms',worst.toFixed(0));
 g.ticks(240);console.log('after end',JSON.stringify(st()));
 // the end card's buttons
 const R=JSON.parse(g.run('JSON.stringify(wildEndRects())'));
 g.tap(R.again.x+R.again.w/2,R.again.y+R.again.h/2);g.ticks(60);console.log('tap again',JSON.stringify(st()));
 g.until("WILD.phase==='play'",900);g.ticks(60);console.log('next round',JSON.stringify(st()));
 g.run("WILD.left=.1");g.until("WILD.phase==='end'",300);g.ticks(90);const R2=JSON.parse(g.run('JSON.stringify(wildEndRects())'));g.tap(R2.back.x+R2.back.w/2,R2.back.y+R2.back.h/2);g.ticks(60);console.log('tap main screen',JSON.stringify(st()));
 console.log('errs',JSON.stringify(JSON.parse(g.run('JSON.stringify(__errs.slice(0,5))'))));
})();
