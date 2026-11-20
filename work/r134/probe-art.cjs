// next round: stills of the Ragdoll's Hug or Dance break (rendered). Usage: SRC=.. WHAT=hug|dance AT=t1,t2 TAG=.. node probe.cjs outDir W H
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {loadImage,Path2D}=require(NAPI);
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||'shots');fs.mkdirSync(out,{recursive:true});
const W=+(process.argv[3]||412),H=+(process.argv[4]||915),WHAT=process.env.WHAT||'hug',CAT=process.env.CAT||'ragdoll',TAG=process.env.TAG||'';
(async()=>{const sz=W+'x'+H;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:W,height:H,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${CAT}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<300;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;"+(process.env.FORCE||''));
 for(const k2 of ['shoulder','left','right']){const u=g.run('CP74_ART.'+k2);g.c.__im=await loadImage(Buffer.from(u.split(',')[1],'base64'));g.run('Z74.img.'+k2+'=__im');}
 const info={sz,what:WHAT};const at=(process.env.AT||'1,3').split(',').map(Number);
 if(WHAT==='hug'){g.run("PG.powers.ragdoll=2;");for(let i=0;i<400&&!g.run('pgpReady()');i++)g.tick();g.run('pgpUse()');let t0=0;
  for(const x of at){while(t0<x){g.tick();t0+=1/60;}g.c.draw();fs.writeFileSync(path.join(out,`${TAG}hug-t${x}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}
  info.px=g.run('PGPX&&(PGPX.id+":"+(PGPX.power||""))');}
 else{g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();
  for(const x of at){let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<x&&j++<2000)g.tick();g.c.draw();fs.writeFileSync(path.join(out,`${TAG}dance-x${x}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));}}
 info.geo=JSON.parse(g.run("(()=>{const L=z74Layout(),r=z74RimPts(),P=[...r.left,...r.right];const top=Math.min(...P.map(p=>p.y));const near=P.filter(p=>p.y<top+3);return JSON.stringify({chin:L.chin,lip:L.lip,top,x0:Math.min(...near.map(p=>p.x)),x1:Math.max(...near.map(p=>p.x)),scale,H})})()"));
 info.errs=JSON.parse(g.run('JSON.stringify(__errs)'));console.log(JSON.stringify(info));g.close();})().catch(e=>{console.error(e);process.exit(1)});
