const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {loadImage,Path2D}=require(NAPI);
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(__dirname,'../cp138-published/release.html');
const out=path.resolve(process.argv[2]||path.join(__dirname,'../../tickets/CP-107-evidence'));fs.mkdirSync(out,{recursive:true});let passed=[],failed=[],res={};function check(n,b,info){(b?passed:failed).push(n);res[n]={pass:!!b,info};console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
async function game(file,where,{render=false,W=412,H=915,store={},dev=false}={}){const [kind,cat]=where.split(':');
 const g=render?await make33({sourceFile:file,render:true,seed:7,pixelRatio:1,width:W,height:H,storage:{'catpusher.uat.devdefault.v1':'1',...store}})
  :await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed:7,storage:{'catpusher.uat.devdefault.v1':'1',...store}});
 if(render)g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale');g.tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();g.tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}PGU.boardCat='${cat}';PG.current='${cat}';PG.powers={tuxedo:2,orange:1,ragdoll:0,siamese:3,tortie:1};`+
  (kind==='endless'?`endStart();`:`pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`));
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<240;i++){if(i%30===0)g.tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;globalThis.__snd=[];for(const f of ['danceLoud','cp94Loud','dance']){const o=sfx[f];if(o)sfx[f]=function(k,v,d,a){__snd.push([f,k,+(+v).toFixed(3),+(+a||0).toFixed(2)]);return o.apply(this,arguments);};}");
 if(kind==='home'){g.run("if(WILD.on)wildExit();PGU.screen='main';");for(let i=0;i<30;i++)g.tick();}
 if(dev)g.run('S.dev=true;');
 if(render){for(const k2 of ['shoulder','left','right']){const u=g.run('CP74_ART.'+k2);g.c.__im=await loadImage(Buffer.from(u.split(',')[1],'base64'));g.run('Z74.img.'+k2+'=__im');}
  const cv=g.c.document.getElementById('cv');g.frame=()=>{g.c.draw();return cv.getContext('2d').getImageData(0,0,cv.width,cv.height);};g.png=f=>{g.c.draw();fs.writeFileSync(path.join(out,f),cv.toBuffer('image/png'));};}
 g.errs=()=>JSON.parse(g.run('JSON.stringify(__errs)'));return g;}
