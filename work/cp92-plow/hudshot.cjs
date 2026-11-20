// CP-92 HUD fix stills: the endless board's clock spot while the wallet refills ("+1 0:23") and when Full, at phone sizes.
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'shots'));fs.mkdirSync(out,{recursive:true});
(async()=>{const info=[];for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);const T=n=>{for(let i=0;i<n;i++)g.tick();};
 g.run("S.muted=true;S.dev=false");T(150);g.pointer('pointerdown',200*+g.run('scale'),700*+g.run('scale'));g.pointer('pointerup',200*+g.run('scale'),700*+g.run('scale'));T(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");T(60);
 g.run("endLoad().coins=57;endLoad().t=Date.now()-7000;endStart()");let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();T(30);
 const shot=nm=>{g.c.draw();fs.writeFileSync(path.join(out,nm+'-'+sz+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
 shot('hud-refilling');const a=JSON.parse(g.run("JSON.stringify({clock:wildClock(),btn:cp51Btn()})"));
 g.run("endLoad().coins=END.CAP;S.coins=END.CAP;board.remaining=S.coins");T(10);shot('hud-full');
 info.push({sz,...a,full:g.run('wildClock()')});g.close&&g.close();}console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
