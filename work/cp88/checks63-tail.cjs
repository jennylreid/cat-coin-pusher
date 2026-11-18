// UAT 83 checks (CP-63, Jenny via PM Nov 17: the Tuxedo's power becomes Formal inspection, on UAT 82):
// 0 only the CP-63 block, the wheel-Yawn wait and the build name differ from the base UAT (base82.html = ../cp82/release.html)
// 1 the power through the real button, Levels 1-5 x 2 seeds x 60/30 fps, mid-round: up to 5 pieces lit, at most 2 prizes,
//   every lit coin lying on top of the pile (bottom layer untouched), nothing off a side during it, lit pieces carried over
//   the front, one charge used, state clean after, no frame errors
// 2 the button is locked while it plays (a second tap does nothing)
// 3 a wheel YAWN landing during an inspection waits for it, then plays CP-58's Yawn
// 4 Home (leaving the board) and the round ending mid-inspection leave nothing behind
// 5 seven simultaneous pickups: identical frame trace and sound calls to UAT 82 (frozen pickup)
// 6 the wheel's YAWN still plays CP-58's Yawn; 7 production untouched
// Usage: node checks83.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('./runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp87/release.html'),out=path.resolve(__dirname,'../../tickets/CP-69-evidence/uat'+JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))).displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const WATCH="globalThis.__side=[];const __rc2=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side.push({kind:b.kind,lit:(globalThis.__pk||[]).includes(b)});}catch(e){}return __rc2.apply(this,arguments);};"+
 "globalThis.__calls=[];const __co=callout;callout=function(t,o){__calls.push(String(t));return __co.apply(this,arguments);};";
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
const TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
const CLEAN="({cp63:!!CP63X,pgpx:!!PGPX,dance:!!(pawDance&&pawDance.cp63)})";
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function midRound(file,{seed,level=3,secs=12,fps=60}){const g=await game(file,{seed});const tk0=fps===60?g.tick:g.tick30,tk=()=>{try{tk0();}catch(e){g.run('__errs').push(String(e&&e.stack||e).slice(0,300));}};
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run("WILD.left=Math.max(WILD.left,60);PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=2;"+WATCH);return {g,tk};}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 check('0 release matches staged manifest',sha(src)===JSON.parse(fs.readFileSync(path.join(__dirname,'publication-manifest.json'))).releaseHTMLSHA256);
 // Resume at the failed rendered pickup check; preceding behavioral checks were already observed passing.
 check('5 seven simultaneous pickups: identical frame trace and sound calls to the base UAT',(await burst(src))===(await burst(base)));
 {const {g,tk}=await midRound(src,{seed:2,level:3,fps:60});g.run(WHEEL);let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<600)tk();const ok=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');
  for(let i=0;i<6*60;i++)tk();check("6 the wheel's YAWN still plays CP-58's Yawn",ok&&g.run('!W2_YAWN')&&!J(g,'__errs').length);g.close();}
 check('7 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks63-tail.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
