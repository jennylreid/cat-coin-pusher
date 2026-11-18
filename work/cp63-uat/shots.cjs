// CP-63 small-screen shots of the release build (Developer off): a Level 3 round, a few coins dropped, then the power
// through the real button; stills at the inspection, the cane and the sweep. Usage: node shots.cjs [sizes]
// -> tickets/CP-63-evidence/uatNN/small-*.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const v=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))),src=path.join(__dirname,'release.html');
const OUT=path.resolve(__dirname,'../../tickets/CP-63-evidence/uat'+v.displayName.split(' ').pop());fs.mkdirSync(OUT,{recursive:true});
const sizes=(process.argv[2]||'360x640,360x780,412x915').split(',').map(s=>s.split('x').map(Number));
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:2,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(30);
 g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<8*60;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2),560);g.tick();}
 g.run("WILD.left=60;WILD.nextBonus=999;PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;");ticks(60);
 const b=JSON.parse(g.run('JSON.stringify(pgpButton())'));tap(b.x+b.w/2,b.y+b.h/2);
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,`small-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const at=s=>{while(g.run('CP63X')&&!(g.run('CP63X.t')>=s))g.tick();};
 const picks=JSON.parse(g.run('JSON.stringify(CP63X?CP63X.picks.map(o=>o.id):null)'));
 at(1.6);shot('1-inspect');at(2.5);shot('2-cane');at(3.05);shot('3-sweep');
 info.push({sz,build:g.run('BUILD'),picks,errs:JSON.parse(g.run('JSON.stringify(__errs)'))});g.close();}
 fs.writeFileSync(path.join(OUT,'small-shots.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
