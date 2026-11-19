// CP-86 Sonic meow mitts, UAT 116 final: E only, a longer hold and a quick return; the choice removed.
// Usage: SRC=<build> BASE=<UAT 115 release.html> OUT=<dir> BUILD_DIR=<build folder> node checks86m.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp115/release.html'));
const out=path.resolve(process.env.OUT||path.join(__dirname,'../../tickets/CP-86-evidence/mitts-dev'));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
// the base build is renamed to this build's name (the name is drawn on screen), so frames can be compared pixel for pixel
const ref=path.join(path.dirname(src),'ref-base-named-m.html'); /* beside the build, where its art folder is */{const S=fs.readFileSync(src,'utf8'),n=S.match(/const BUILD = '[^']+';/)[0];let B=fs.readFileSync(base,'utf8');B=B.replace(/const BUILD = '[^']+';/,n);fs.writeFileSync(ref,B);}
async function midRound(file,{cat,seed,level=3,secs=6,fps=60,render=false,w=400,h=889,pr=1,pick=null}){const st={'catpusher.uat.devdefault.v1':'1'};if(pick)st['catpusher.uat.cp86mitts.v1']=pick;
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:st}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:st});
 if(render)g.c.Path2D=require(NAPI).Path2D;g.c.atob=g.c.atob||(s=>Buffer.from(s,'base64').toString('latin1'));
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};const tk=fps===60?g.tick:g.tick30;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(${level-1},PG_SWITCH_LEVEL);PG.lv.sel=${level};if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 // (without rendering no art loads: a stand-in face object lets the face's timing be read; nothing is drawn)
 // a round won or lost mid-power would end the power early: kept going while measuring (both builds)
 g.run(`WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.${cat}=2;${render?'':"if(typeof CP75_ART==='object'&&CP75_ART.siamese&&!CP75_ART.siamese.face)CP75_ART.siamese.face={stub:1};"}{const f=wildFinish;wildFinish=function(){if(PGPX)return;return f.apply(this,arguments);};}`);return {g,tk};}
const STATE="JSON.stringify({p:PGPX?[PGPX.id,+PGPX.t.toFixed(4)]:null,reach:pglReach(),coins:board.coins,pieces:bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,+q.x.toFixed(3),+q.y.toFixed(3),+q.z.toFixed(3)];})})";
// each mitt as seen on screen: place and turn (left mitt's turn; the right mirrors), from whichever way the mitts are drawn
const POSE="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=pawMotion(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=__cp86MittRest(s),o=cp86MittOff(s,'wait',b)||{x:0,y:0,r:0};r.push({x:b.x+o.x,y:b.y+o.y,a:MITT_TURN+(s<0?o.r:-o.r)});}}return r;})()";
const REST="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=__cp86Paw(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=__cp86MittRest(s);r.push({x:b.x,y:b.y,a:MITT_TURN});}}return r;})()";
const HEAD="(()=>{const P=CP86M.POSE.head;return [-1,1].map(s=>{const R=cp58Rest(s);return {x:R.x+s*P.dx,y:R.y+P.dy,a:P.a};});})()";
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y),off=(A,B)=>Math.max(...A.map((p,k)=>dist(p,B[k])+60*Math.abs(p.a-B[k].a)));
(async()=>{const file=process.env.F==='115'?path.resolve(__dirname,'../cp115/release.html'):src,tag=process.env.F||'116';
 const {g,tk}=await midRound(file,{cat:'siamese',seed:7,w:412,h:915,pr:1,render:true,pick:'E'});g.run(TAP);const dir=path.join(__dirname,'dev','hstrip'+tag);fs.mkdirSync(dir,{recursive:true});const rows=[];
 for(let i=0;i<9*60;i++){tk();const t=+g.run("PGPX&&PGPX.id==='sonic'?PGPX.t:0");if(t>=4.15&&t<=5){g.c.draw();const cv=g.c.document.getElementById('cv');fs.writeFileSync(path.join(dir,'f'+t.toFixed(3)+'.png'),cv.toBuffer('image/png'));rows.push([+t.toFixed(3),+g.run('cp86MWeight().toFixed(3)'),g.run('cp86MOnTop()'),+g.run('cp86K()')]);}
  if(t===0&&rows.length)break;}
 console.log(JSON.stringify(rows));g.close();})();