// a whole round from Home: PLAY door -> card -> 60 s hold-to-drop -> end card -> Home
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.resolve(process.argv[2]||'out'),cat=process.argv[3]||'tuxedo',seed=+(process.argv[4]||3);fs.mkdirSync(OUT,{recursive:true});
(async()=>{const g=await game({src:path.resolve('release.html'),seed,render:true}),cv=g.c.document.getElementById('cv');const st=strictAudio(g);g.run('S.muted=false');const errs=[];
 const shot=n=>{try{g.c.draw();}catch(e){errs.push('draw '+n+': '+e.message);}fs.writeFileSync(path.join(OUT,n+'.png'),cv.toBuffer('image/png'));};
 frames(g,5,errs);
 if(cat!=='tuxedo')g.run(`PG.open['${cat}']=1;PG.openOrder.push('${cat}');PG.level=5`);
 if(cat==='tuxedo'){const D=JSON.parse(g.run('JSON.stringify(pgDoors().board)'));g.tap(D.x+D.w/2,D.y+D.h/2);frames(g,30,errs);}else{g.run(`pgPlay('${cat}')`);frames(g,10,errs);}
 const info=()=>JSON.parse(g.run('JSON.stringify({screen:PGU.screen,on:WILD.on,phase:WILD.phase,mode:WILD.mode,list:WILD_COLLECTION,goal:WILD_GOAL,star:WILD.star,cat:PGU.boardCat,headSwapped:ART.head!==PG_ORIG.head})'));
 const i0=info();shot(cat+'-card');
 g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
 const t0=Date.now();let drawMs=0,nd=0;
 for(let s=0;s<70&&g.run("WILD.phase==='play'");s++){g.run(`holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);for(let f=0;f<60;f++){frames(g,1,errs);if(f%10===0){const a=performance.now();g.c.draw();drawMs+=performance.now()-a;nd++;}}if(s===20)shot(cat+'-play');}
 g.run('holding=false');frames(g,240,errs);shot(cat+'-end');
 const res=JSON.parse(g.run('JSON.stringify({have:WILD.have,got:WILD.got,win:WILD.win,res:WILD.pgResult,coins:WILD.pgCoins,left:WILD.left})'));
 const R=JSON.parse(g.run('JSON.stringify(wildEndRects())'));g.tap(R.back.x+R.back.w/2,R.back.y+R.back.h/2);frames(g,30,errs);shot(cat+'-home');
 const after=JSON.parse(g.run('JSON.stringify({screen:PGU.screen,on:WILD.on,level:PG.level,xp:PG.xp,coins:PG.coins,items:PG.items,headBack:ART.head===PG_ORIG.head,list:WILD_COLLECTION.length})'));
 console.log(JSON.stringify({cat,i0,res,after,errs,audio:st.created,avgDrawMs:+(drawMs/nd).toFixed(2)}));g.close&&g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
