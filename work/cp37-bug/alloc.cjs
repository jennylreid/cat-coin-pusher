// Counts native objects the game creates per drawn frame (canvases, getImageData, Path2D, gradients) in the desktop harness.
const {game}=require('../cp39/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]),board=process.argv[3];
(async()=>{const g=await game({seed:4,render:true,src}),a=g.c.__game;const c=g.c;
 if(board==='wild'){a.wildEnter();a.wildStartCountdown();g.ticks(240);}else if(board==='wild2'){g.run('wild2Enter();wildStartCountdown()');g.ticks(240);}else g.run('selectBoard(2);S.coins=999;');
 for(let s=0;s<10;s++){g.run(`S.coins=Math.max(S.coins,50);holding=true;holdPos={x:200+70*Math.sin(${s}*0.9),y:DROP_Y};`);g.ticks(60);}
 if(process.argv[4]==='dance'){g.run('WILD.happy=99;holding=false');g.run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");g.until('!!WILD.dance',600);}
 const cnt={canvas:0,imageData:0,path2d:0,grad:0};const ce=c.document.createElement;c.document.createElement=(...x)=>{cnt.canvas++;return ce(...x);};
 const cv=c.document.getElementById('cv'),ctx=cv.getContext('2d'),P=c.Path2D;c.Path2D=function(...x){cnt.path2d++;return new P(...x);};
 for(const k of ['createLinearGradient','createRadialGradient']){const f=ctx[k].bind(ctx);ctx[k]=(...x)=>{cnt.grad++;return f(...x);};}
 const gi=ctx.getImageData.bind(ctx);ctx.getImageData=(...x)=>{cnt.imageData++;return gi(...x);};
 const mem0=process.memoryUsage().rss;for(let i=0;i<300;i++){g.tick();c.draw();}
 console.log(board,process.argv[4]||'',JSON.stringify({perFrame:Object.fromEntries(Object.entries(cnt).map(([k,v])=>[k,+(v/300).toFixed(2)])),rssGrowMB:+((process.memoryUsage().rss-mem0)/1e6).toFixed(0),dance:g.run('WILD.dance?WILD.dance.phase:null')}));g.close();})().catch(e=>{console.error(e);process.exitCode=1;});
