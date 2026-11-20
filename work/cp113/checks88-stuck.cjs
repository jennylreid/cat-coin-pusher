// CP-88 hotfix check only (check 7 of checks88): reproduces the stuck countdown on a build with the bug (SRC=<release.html>), passes after the fix.
// CP-88 checks (Jenny, Nov 19: "Doesn't it seem like you should be able to save that coin and spend it when you're ready?"):
// laser, fish and mouse coins bank a charge in a tap-to-start slot instead of starting their side game at once.
// Usage: node checks88.cjs  (SRC/BASE/OUT env override; defaults: this folder's release.html on its base)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8')),E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'..','cp110-hug','release.html')) /* UAT 112: CP-88's own check compares with UAT 110, the build before the coin bank */;
const out=path.resolve(process.env.OUT||path.join(__dirname,'../../tickets/CP-88-evidence/uat'+V.displayName.split(' ').pop()));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const CATS={orange:{kind:'fish',game:'toss'},siamese:{kind:'laser',game:'chase'},tortie:{kind:'mousecoin',game:'pounce'}};
// the coin goes over the front edge: the game's own hook, as the physics calls it
const COIN=k=>`wildRainCollected({kind:'${k}',id:'${k}',dead:false,rb:{translation:()=>({x:200*M,y:0,z:T.FRONT*M})}},200)`;
const PICKUP="JSON.stringify(treatAwards.map(f=>[f.kind,f.id,+f.x0.toFixed(2),+f.y0.toFixed(2),+(f.tr||0).toFixed(3),+(f.tm||0).toFixed(3),+(f.ts||0).toFixed(3),!!f.preview]))";
const SLOT="(()=>{const b=cp88Btn();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
async function midRound(file,{cat,seed=3,level=3,secs=4,fps=60,render=false,w=400,h=889,pr=1}){
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 if(render)g.c.Path2D=require(NAPI).Path2D;g.c.atob=g.c.atob||(s=>Buffer.from(s,'base64').toString('latin1'));
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};const tk=fps===60?g.tick:g.tick30;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)};globalThis.__lock=0;{const f=pgSfx;pgSfx=function(k){if(k==='lock')__lock++;return f.apply(this,arguments);};}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<40;i++){g.tick();if(render)await new Promise(r=>setTimeout(r,5));}
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(${level-1},PG_SWITCH_LEVEL);PG.lv.sel=${level};if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run(`WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.${cat}=1;{const f=wildFinish;wildFinish=function(){if(PGPX||WILD.toss||WILD.chase||WILD.pounce)return;return f.apply(this,arguments);};}`);return {g,tk,tap};}
const sideOn=(g,c)=>g.run(`!!WILD.${CATS[c].game}`);
(async()=>{
 // 7. (hotfix) bank a coin, then go Home, open another cat's board and start its round, then a new round on that board:
 // drawn every frame (the slot is drawn; a negative radius throws, as in a browser), each countdown reaches play with no frame errors
 {const rows=[];let ok=true;for(const [cat,next] of [['siamese','orange'],['orange','tortie'],['tortie','siamese']]){const {kind}=CATS[cat],r={cat,next};
   const {g,tk}=await midRound(src,{cat,render:true,secs:2,w:412,h:915,pr:1});
   // the harness's canvas accepts a negative radius; real browsers throw (IndexSizeError), which is what froze the phone: same here
   const dr=()=>{try{g.c.draw();}catch(e){if(!r.drawErr)r.drawErr=String(e).slice(0,120);}};
   g.run("{const P=Object.getPrototypeOf(ctx);for(const k of ['arc','ellipse']){const o=P[k];P[k]=function(...a){const r=k==='arc'?[a[2]]:[a[2],a[3]];if(r.some(v=>v<0))throw new Error('IndexSizeError: negative radius in '+k);return o.apply(this,a);};}}");g.run(COIN(kind));for(let i=0;i<20;i++){tk();dr();}
   g.run("(()=>{const b=wildButton();(typeof __cp51Pointer==='function'?__cp51Pointer:wildPointer)({timeStamp:0,pointerId:-1,preventDefault(){}},{x:b.x+b.w/2,y:b.y+b.h/2});})()");for(let i=0;i<60;i++){tk();dr();}
   g.run(`pgPlay('${next}');if(WILD.phase==='card')wildStartCountdown();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.nextPlay=g.run("WILD.phase")==='play';
   g.run('wildReset();wildStartCountdown();');k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.newRoundPlay=g.run("WILD.phase")==='play';
   r.errs=J(g,'__errs').map(e=>e.slice(0,120));g.close();r.ok=r.nextPlay&&r.newRoundPlay&&!r.errs.length&&!r.drawErr;if(!r.ok)ok=false;rows.push(r);}
  check('7 (hotfix) after banking a coin: Home, another board of another cat, and a new round all reach play, drawn every frame, with no frame errors',ok,rows);}
 fs.writeFileSync(path.join(out,'checks88-stuck-'+path.basename(path.dirname(src))+'.json'),JSON.stringify({build:src,passed:failed.length===0,passedN:passed.length,failed},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
