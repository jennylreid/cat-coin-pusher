// CP-97 stills (chip closed, open, after switching to Orange, locked); from CP-92's, real game at phone sizes: Home (Developer on and off), the endless board (wallet, meter part-full), the meter full
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
 const clear="for(const b of [...bodies])if(!b.dead&&CP97_COINS.includes(b.kind))removeCoin(b);WILD.incoming=WILD.incoming.filter(o=>!CP97_COINS.includes(o.kind));WILD.nextBonus=999";
 g.run("S.dev=false;PG.current=PGU.boardCat='tuxedo';endLoad().coins=300;endStart()");let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();
 for(let i=0;i<40;i++){g.run(`tryDrop({x:${Math.round(200+90*Math.sin(i))},y:DROP_Y})`);T(18);}g.run(clear);n=0;while(g.run('cp97Locked()')&&n++<1500){g.tick();if(n%60===0)g.run(clear);}T(60);
 shot('1-chip-closed');const c=JSON.parse(g.run('JSON.stringify(cp97Chip())'));tap(c.x+c.w/2,c.y+c.h/2);T(10);shot('2-chip-open');
 const f=JSON.parse(g.run("JSON.stringify(cp97Row().faces.find(f=>f.cat==='orange'))"));tap(f.x+f.w/2,f.y+f.h/2);T(20);shot('3-switched-orange');
 g.run("{const b=addCoin('fish',null,200,COIN_HALF+.2,520,yawTurn(0));}");T(10);tap(c.x+c.w/2,c.y+c.h/2);T(6);shot('4-chip-locked');
 info.push({sz,errs:JSON.parse(g.run('JSON.stringify(__errs)')),cat:g.run('PGU.boardCat')});g.close&&g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
