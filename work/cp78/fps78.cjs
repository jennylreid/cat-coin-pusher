const path=require('path'),vm=require('vm');const make=require('../cp72/runtime.cjs');
(async()=>{const fps=+process.argv[2];const g=await make({sourceFile:path.resolve('release.html'),render:false,width:400,height:889,pixelRatio:1,seed:1,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/fps;t();};g.run=s=>vm.runInContext(s,g.c);
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let k=0;k<10*fps;k++)g.tick();
 g.run("globalThis.__yt=[];const __w=w2YawnTick;w2YawnTick=function(dt){__yt.push(+dt.toFixed(4));return __w(dt);};w2StartYawn();");
 for(let i=0;i<4*fps;i++){g.tick();}
 console.log(fps,'game time per frame',g.run('JSON.stringify(__yt.slice(0,5))'),'calls',g.run('__yt.length'),'sum',g.run('__yt.reduce((a,b)=>a+b,0).toFixed(2)'));})();
