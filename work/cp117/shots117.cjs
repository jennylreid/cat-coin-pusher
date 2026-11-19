// CP-72 peek-a-boo stills: the real game (Orange board, Level 3), Zoomies through the real button, at phone sizes.
// Usage: [SRC=release.html] node shots102.cjs [outDir] -> peek-1-hang, peek-2-drop, peek-3-peek, peek-4-duck at 412x915 and 360x640
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,process.env.SRC||'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'shots'));fs.mkdirSync(out,{recursive:true});
const seg=c=>`(()=>{const k=Z72X&&Z72X.kits[0];if(!k||!k.P||k.gone)return false;const P=k.P;return ${c};})()`;
const BEATS=[['1-run',"(()=>{const X=Z72X;return !!X&&X.kits.length===2&&X.kits.every(k=>k.P&&!k.gone&&k.P.seg==='run'&&!(k.P.puff>0));})()"],['2-spook',seg("P.seg==='spook'&&P.u>=.3")],['3-puff',seg("P.si===k.segs.length-4&&P.u>=.5")],['4-peek',seg("P.pk==='hold'&&P.pu>=.5")]];
(async()=>{const info=[];for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
 const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.cp90kittens.v1':process.env.MODE||'painted'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<600;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=2;");
 g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");const got=[];
 for(const [n,c] of BEATS){let i=0;while(!g.run(c)&&i++<900)g.tick();if(i<900){g.c.draw();fs.writeFileSync(path.join(out,`${process.env.MODE||'painted'}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));got.push(n);}}
 info.push({sz,got,mode:g.run('CP90.get()'),stats:JSON.parse(g.run('JSON.stringify(CP90.stats)')),art:g.run('Object.keys(CP90.art).join()'),style:g.run('Z72.leapHang.style'),errs:JSON.parse(g.run('JSON.stringify(__errs)'))});g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
