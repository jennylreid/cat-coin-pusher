// UAT 92 power text: the cat picker (all cats open, powers held) at 412x915 and 360x640 -> tickets/CP-73-evidence/uat92/cats-<size>.png
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.join(__dirname,process.env.SRC||'release.html'),OUT=path.resolve(__dirname,'../../tickets/CP-73-evidence/uat92');const tag=process.env.TAG||'';
(async()=>{const info=[];for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.run=s=>vm.runInContext(s,g.c);
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");g.run('S.dev=false;S.muted=true');
 for(let i=0;i<150;i++)g.tick();g.run("PGU.title.t=9;pgTitleDone();if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.powers={tuxedo:3,orange:9,ragdoll:2,siamese:1,tortie:5};PGU.pick=true;PGU.pickT=1;");
 for(let i=0;i<20;i++)g.tick();g.c.draw();fs.writeFileSync(path.join(OUT,`cats${tag}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));
 info.push({sz,errs:JSON.parse(g.run('JSON.stringify(__errs)')),line:g.run("pglCatLine('tuxedo')")});g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
