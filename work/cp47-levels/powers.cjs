const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'preview.html'),OUT=path.resolve(process.argv[3]||'shots');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const only=(process.env.CATS||'tuxedo,orange,ragdoll,siamese,tortie').split(',');
(async()=>{for(const cat of only){const g=await game({src,render:true,seed:7});g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`for(const c of PG_CATS){PG.open[c]=1;}PG.powers={${cat}:2};pgSwitchBoard('${cat}');PG.lv.passed=3;PG.lv.sel=4;wildReset();PGU.screen='board';pgStartRound();`);
 g.until("WILD.phase==='play'",900);for(let s=0;s<8;s++){g.run(`tryDrop({x:${150+s*12},y:DROP_Y})`);g.ticks(27);}
 const before=JSON.parse(g.run(`JSON.stringify({ready:pgpReady(),n:pgpCount(),side:pgpSideGame(),period:PUSH_PERIOD,front:bodies.filter(b=>!b.dead&&b.kind==='coin').reduce((a,b)=>a+b.rb.translation().z/M,0)})`));
 const B=JSON.parse(g.run('JSON.stringify(pgpButton())'));g.tap(B.x+B.w/2,B.y+B.h/2);
 const fr={tuxedo:40,orange:70,ragdoll:40,siamese:90,tortie:12}[cat];g.ticks(fr);shot(g,'power-'+cat);
 const mid=JSON.parse(g.run(`JSON.stringify({px:PGPX&&PGPX.id,period:PUSH_PERIOD,reach:pglReach(),pusherY:Math.round(pusherY),yawn:!!W2_YAWN,n:pgpCount(),shoved:WILD.pgpShoved||0})`));
 g.ticks(420);const after=JSON.parse(g.run(`JSON.stringify({px:PGPX&&PGPX.id,period:PUSH_PERIOD,reach:pglReach(),phase:WILD.phase})`));
 console.log(cat,JSON.stringify({before,mid,after,errs:JSON.parse(g.run('JSON.stringify(__errs)'))}));
 if(cat==='tortie'){ // Mouse pounce: force it, catch most mice by tapping them
  g.run('WILD.pounceForce=true');g.until('!!WILD.pounce&&WILD.pounce.phase==="play"',600);let k=0;
  while(g.run('!!WILD.pounce&&WILD.pounce.phase==="play"')&&k<900){const m=JSON.parse(g.run('JSON.stringify((WILD.pounce.mice.find(m=>m.state==="run"&&m.x>40&&m.x<360)||null))'));if(m&&k%9===0)g.tap(Math.round(m.x),Math.round(m.y-14));if(k===120)shot(g,'pounce-play');g.tick();k++;}
  g.ticks(10);shot(g,'pounce-end');console.log('pounce',g.run('JSON.stringify({caught:WILD.pounce&&WILD.pounce.caught,n:WILD.pounce&&WILD.pounce.n,perfect:WILD.pounce&&WILD.pounce.perfect,rain:WILD.rainLeft,powers:PG.powers,left:WILD.left})'));
  g.ticks(200);console.log('after pounce',g.run('JSON.stringify({powers:PG.powers,pounce:!!WILD.pounce,errs:__errs})'));}
}})();
