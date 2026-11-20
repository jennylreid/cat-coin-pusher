// CP-101 rework (body behind the dancing head) checks, rendered (the real game drawing, art loaded), on the build in
// release.html against its base (release-version.json). Usage: node checks101b.cjs [outDir]
// 1 (412x915 and 360x640) during the Ragdoll's flops the body is drawn and covers the pusher above the board's back edge
// 2 the body never draws inside the board's rim (no coin, board or prize pixel changes; only the rim line is re-stroked)
// 3 before the dance the Ragdoll board is pixel-identical to the base
// 4 the Tuxedo's dance is pixel-identical to the base (the body is the Ragdoll's only)
// 5 the body goes away when the dance ends, and is not drawn during the Hug
// 6 production and the UAT channel untouched
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make33=require('../cp33/runtime.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {loadImage,Path2D}=require(NAPI);
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp132-nobody/release.html') /* UAT 132 bundle: the bundle without this block */;
const out=path.resolve(process.argv[2]||path.join(__dirname,'../../tickets/CP-101-evidence/uat'+V.displayName.split(' ').pop()));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],res={};function check(n,b,info){(b?passed:failed).push(n);res[n]={pass:!!b,info};console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
async function game(file,{cat='ragdoll',W=412,H=915}={}){
 // the art folder beside the build (the render harness reads art/ next to the source file)
 const g=await make33({sourceFile:file,render:true,seed:7,pixelRatio:1,width:W,height:H,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<300;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;");
 // the harness has no Image decoding: hand the Hug's art (CP74_ART) to the game as the browser would
 for(const k2 of ['shoulder','left','right']){const u=g.run('CP74_ART.'+k2);g.c.__im=await loadImage(Buffer.from(u.split(',')[1],'base64'));g.run('Z74.img.'+k2+'=__im');}
 const cv=g.c.document.getElementById('cv');
 g.frame=()=>{g.c.draw();return cv.getContext('2d').getImageData(0,0,cv.width,cv.height);};
 g.png=f=>{g.c.draw();fs.writeFileSync(path.join(out,f),cv.toBuffer('image/png'));};
 g.dance=()=>{g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<20&&!g.run('!!WILD.dance');i++)g.tick();return g.run('!!WILD.dance');};
 g.to=x=>{let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<x&&j++<2000)g.tick();};
 return g;}
// pixel differences as a box in screen units (null: identical)
// (the build's name label, bottom left, differs by design and is skipped)
const diffBox=(a,b,sc)=>{let x0=1e9,y0=1e9,x1=-1,y1=-1,n=0;for(let i=0;i<a.data.length;i+=4)if(a.data[i]!==b.data[i]||a.data[i+1]!==b.data[i+1]||a.data[i+2]!==b.data[i+2]){const p=i/4,x=p%a.width,y=(p/a.width)|0;if(y/sc>=a.height/sc-24&&x/sc<230)continue;n++;x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}return n?{n,box:[x0,y0,x1,y1].map(v=>+(v/sc).toFixed(1))}:null;};
// the rim polygon (screen units) and its distance test
function inPoly(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;}
function segD(p,a,b){const dx=b.x-a.x,dy=b.y-a.y,l=dx*dx+dy*dy||1;let u=((p.x-a.x)*dx+(p.y-a.y)*dy)/l;u=Math.max(0,Math.min(1,u));return Math.hypot(p.x-a.x-u*dx,p.y-a.y-u*dy);}
(async()=>{
 for(const [W,H] of [[412,915],[360,640]]){const sz=W+'x'+H,g=await game(src,{W,H});const sc=+g.run('scale')*+g.run('renderPixelRatio');
  const started=g.dance();const flops=[];
  for(const x of [0.2,3.2,1.6]){g.to(x);g.run('CP101B.off=true');const off=g.frame();g.run('CP101B.off=false');const on=g.frame();g.png(`body-ragdoll-x${x}-${sz}.png`);
   g.run('CP101B.off=true');g.png(`nobody-ragdoll-x${x}-${sz}.png`);g.run('CP101B.off=false');
   const rim=JSON.parse(g.run('JSON.stringify(z74RimPts())')),P=[...rim.left,...rim.right.slice().reverse()],top=Math.min(...P.map(p=>p.y));
   let inside=0,outside=0,goldOff=0,goldOn=0;const isGold=(d,i)=>d[i]>170&&d[i+1]>110&&d[i+1]<200&&d[i+2]<110;
   for(let py=0;py<on.height;py++)for(let px=0;px<on.width;px++){const i=(py*on.width+px)*4,ux=px/sc,uy=py/sc;
    if(uy>top-60&&uy<top&&ux>60&&ux<340){if(isGold(off.data,i))goldOff++;if(isGold(on.data,i))goldOn++;}
    if(on.data[i]===off.data[i]&&on.data[i+1]===off.data[i+1]&&on.data[i+2]===off.data[i+2])continue;
    const p={x:ux,y:uy};if(inPoly(P,ux,uy)){let near=false;for(let k=1;k<P.length&&!near;k++)if(segD(p,P[k-1],P[k])<3)near=true;if(!near&&segD(p,P[P.length-1],P[0])>=3)inside++;}else outside++;}
   flops.push({x,outside,inside,goldOff,goldOn});}
  check(`1 ${sz}: the body is drawn during the Ragdoll's dance and covers the pusher above the board's back edge`,started&&flops.every(f=>f.outside>1000&&f.goldOn<=f.goldOff*.25)&&+g.run('CP101B.frames')>0&&!g.run('CP101B.err'),flops);
  check(`2 ${sz}: the body never draws inside the board's rim (coins, board and prizes unchanged)`,flops.every(f=>f.inside===0),flops.map(f=>[f.x,f.inside]));
  if(W===412){let j=0;while(g.run('!!WILD.dance')&&j++<4000)g.tick();const n0=+g.run('CP101B.frames');g.frame();g.frame();const n1=+g.run('CP101B.frames');
   g.run("PG.powers=PG.powers||{};PG.powers.ragdoll=2;");for(let i=0;i<400&&!g.run('pgpReady()');i++)g.tick();g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");
   let hug=false;for(let i=0;i<200;i++){g.tick();if(g.run("!!(PGPX&&PGPX.z74)")){hug=true;g.frame();}}const n2=+g.run('CP101B.frames');
   check('5 the body goes when the dance ends and is not drawn during the Hug',n0>0&&n1===n0&&hug&&n2===n0,{n0,n1,hug,n2});}
  const errs=JSON.parse(g.run('JSON.stringify(__errs)'));if(errs.length)check(`errors ${sz}`,false,errs);g.close();}
 {const fr={};for(const [n,f] of [['base',base],['new',src]]){const g=await game(f);fr[n]=g.frame();g.close();}
  const d=diffBox(fr.base,fr.new,1);check('3 before the dance the Ragdoll board is pixel-identical to the base',!d,d);}
 {const fr={};for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,{cat:'tuxedo'});g.dance();g.to(2.2);fr[n]=g.frame();g.close();}
  const d=diffBox(fr.base,fr.new,1);check("4 the Tuxedo's dance is pixel-identical to the base",!d,d);}
 check('6 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks101b.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedChecks:passed,failed,res},null,1));
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
