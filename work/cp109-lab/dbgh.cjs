const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.resolve(__dirname,'release.html'),seed:6,render:false});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 g.run("labhPlay('lanes')");g.until("WILD.phase==='play'",900);g.ticks(30);
 const st=()=>g.run("JSON.stringify({screen:PGU.screen,phase:WILD.phase,on:WILD.on,sel:LAB.st.sel,name:pglOn()&&pglOn().name,cols:LAB2.cols.length})");
 console.log('in',st());g.run('cp51Home()');for(const n of [1,10,60]){g.ticks(n);console.log('after',n,st());}})();
