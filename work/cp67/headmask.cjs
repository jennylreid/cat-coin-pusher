// Measures the cat's head outline in a round at each phone size: draws the frame with and without the head art and
// reports, per x (canvas units), the topmost pixel the head covers. Used to place and check the CP-50 goal row.
// Usage: node headmask.cjs SRC [sizes]  -> prints JSON; module use: require('./headmask.cjs').mask(g)
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
// returns {pr, w, h, top:[per canvas-x the first head pixel y in canvas units or null], hidden:Uint8 mask}
function mask(g){
 const cv=g.c.document.getElementById('cv'),ctx2=cv.getContext('2d');
 const grab=()=>{g.c.draw();return ctx2.getImageData(0,0,cv.width,cv.height).data;};
 g.run(`globalThis.__noHead=false;if(!globalThis.__hmPatched){globalThis.__hmPatched=1;const heads=new Set(Object.keys(ART).filter(k=>/^head|Head/.test(k)).map(k=>ART[k]).filter(Boolean));
  if(typeof PG_ART!=='undefined')for(const c in PG_ART)for(const k in PG_ART[c])if(/head/i.test(k))heads.add(PG_ART[c][k]);
  const di=ctx.drawImage.bind(ctx);ctx.drawImage=function(img,...a){if(__noHead&&heads.has(img))return;return di(img,...a);};}`);
 const A=grab();g.run('__noHead=true');const B=grab();g.run('__noHead=false');
 const pr=cv.width/400,w=cv.width,h=cv.height,top=[];const m=new Uint8Array(w*h);
 for(let i=0;i<w*h;i++){const d=Math.abs(A[i*4]-B[i*4])+Math.abs(A[i*4+1]-B[i*4+1])+Math.abs(A[i*4+2]-B[i*4+2]);if(d>24)m[i]=1;}
 for(let X=0;X<400;X++){const x=Math.round((X+.5)*pr);let y0=null;for(let y=0;y<h;y++)if(m[y*w+x]){y0=y/pr;break;}top.push(y0);}
 return {pr,w,h,top,m};}
module.exports={mask};
if(require.main===module)(async()=>{
 const src=path.resolve(process.argv[2]);const sizes=(process.argv[3]||'360x640,360x780,393x852,412x915').split(',').map(s=>s.split('x').map(Number));const out=[];
 for(const [W,Hh] of sizes){const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,width:W,height:Hh,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
  let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
  g.run('S.dev=false;S.muted=true');for(let i=0;i<150;i++)g.tick();const s=g.run('scale');g.pointer('pointerdown',200*s,700*s);g.pointer('pointerup',200*s,700*s);for(let i=0;i<40;i++)g.tick();
  g.run("PGU.screen='board';pgStartRound();");let k=0;while(!g.run("WILD.phase==='play'")&&k++<900)g.tick();for(let i=0;i<70;i++)g.tick();
  const M=mask(g);const col=x=>M.top[x];
  out.push({size:W+'x'+Hh,H:g.run('H'),VIEWy:g.run('VIEW.y'),zy:g.run('VIEW.zy'),hb:g.run('hudLayout().headerBottom'),chin:g.run('w43ChinY()'),
   minTop:Math.min(...M.top.slice(60,340).filter(v=>v!=null)),at:{100:col(100),130:col(130),160:col(160),200:col(200),240:col(240),270:col(270),300:col(300)},
   between:Math.min(...M.top.slice(110,290).filter(v=>v!=null)),prof:Array.from({length:30},(_,i)=>[40+i*11,M.top[40+i*11]==null?null:Math.round(M.top[40+i*11])])});}
 console.log(JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exit(1)});
