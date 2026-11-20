// CP-92 stills, real game at phone sizes: Home (Developer on and off), the endless board (wallet, meter part-full), the meter full
// (NEW BOARD), the sweep half way, the next board, an empty wallet. Usage: SRC=release.html node shots.cjs [outDir]
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'shots'));fs.mkdirSync(out,{recursive:true});
const sizes=(process.env.SIZES||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 const T=n=>{for(let i=0;i<n;i++)g.tick();},shot=name=>{g.c.draw();fs.writeFileSync(path.join(out,`${name}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 T(150);tap(200,700);T(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");T(60);
 g.run('S.dev=true');T(5);shot('1-home-dev-on');const bOn=JSON.parse(g.run('JSON.stringify({end:endBtn(),lab:labhBtn(),bot:pgMainRects().bot})'));
 g.run('S.dev=false');T(5);shot('1-home-dev-off');const bOff=JSON.parse(g.run('JSON.stringify({end:endBtn(),lab:labhBtn()})'));
 tap(bOff.end.x+bOff.end.w/2,bOff.end.y+bOff.end.h/2);let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();
 for(let i=0;i<60;i++){g.run(`tryDrop({x:${Math.round(200+100*Math.sin(i*.7))},y:DROP_Y})`);T(20);}T(120);shot('2-board-meter-part');
 g.run('endLoad().meter=END.METER;END.pulse=time-3');T(30);shot('3-meter-full');
 n=0;while(!g.run('endFree()')&&n++<2000)g.tick();const rr=JSON.parse(g.run('JSON.stringify(endRowRect())'));tap(rr.x+rr.w/2,rr.y+rr.h/2);T(40);shot('4-sweep');
 T(100);shot('5-next-board');
 g.run('S.coins=0;board.remaining=0;endLoad().coins=0;endLoad().t=Date.now()-11000');T(30);shot('6-wallet-empty');
 info.push({sz,home:{devOn:bOn,devOff:bOff},errs:JSON.parse(g.run('JSON.stringify(__errs)')),key:g.run('endKey()')});g.close&&g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
