// Frames of the PLAY screen and each level's opening layout (settled), as the Tuxedo.
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'preview.html'),OUT=path.resolve(process.argv[3]||'shots');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({src,render:true});const errs=[];g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(40);shot(g,'main-L1');
 console.log(g.run('JSON.stringify({screen:PGU.screen,coll:WILD_COLLECTION,coins:S.coins,left:WILD.left,lv:PG.lv,shown:PG.shown})'));
 const only=process.env.LV?process.env.LV.split(',').map(Number):[1,2,3,4,5,6,7,8,9,10];
 for(const n of only){g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();`);g.ticks(5);
  const info=g.run(`JSON.stringify({n:${n},coll:WILD_COLLECTION,star:WILD.star,coins:S.coins,left:WILD.left,items:bodies.filter(b=>!b.dead&&b.kind!=='coin'&&b.kind!=='silver').map(b=>[b.kind,b.id||'',Math.round(b.rb.translation().x/M),Math.round(b.rb.translation().z/M),Math.round(b.rb.translation().y/M)])})`);
  console.log(info);shot(g,'main-L'+n);
  g.run("PGU.screen='board';pgStartRound()");g.ticks(230);shot(g,'board-L'+n);
  g.run("PGU.screen='board';");}
 console.log('errors',g.run('JSON.stringify(__errs)'));
})();
