// CP-86 checks (Jenny, Nov 18: "for the Siamese cat, we can use the yawn face with Sonic Meow"): during Sonic meow's action
// the Siamese shows its CP-75 open-mouth yawn face; nothing else changes. Drawing only.
// Usage: SRC=<build release.html> BASE=<base release.html> OUT=<evidence dir> node checks86.cjs  (defaults: dev.html on UAT 104)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.env.SRC||path.join(__dirname,'dev.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp104/release.html'));
const out=path.resolve(process.env.OUT||path.join(__dirname,'evidence-dev'));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
// the base build is renamed to this build's name (the name is drawn on screen), so frames can be compared pixel for pixel
const ref=path.join(path.dirname(src),'ref-base-named.html'); /* beside the build, where its art folder is */{const S=fs.readFileSync(src,'utf8'),n=S.match(/const BUILD = '[^']+';/)[0];let B=fs.readFileSync(base,'utf8');B=B.replace(/const BUILD = '[^']+';/,n);fs.writeFileSync(ref,B);}
async function midRound(file,{cat,seed,level=3,secs=6,fps=60,render=false,w=400,h=889,pr=1}){
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
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
(async()=>{
 // 0. the build is the base + this ticket's block (and its build name), as the build folder's edits.json says
 if(process.env.BUILD_DIR){const D=process.env.BUILD_DIR,E=JSON.parse(fs.readFileSync(path.join(D,'edits.json'),'utf8')),V=JSON.parse(fs.readFileSync(path.join(D,'release-version.json'),'utf8'));
  let B=fs.readFileSync(base,'utf8'),m=sha(base)===V.baseSHA256;for(const [a,b] of E.edits){if(B.split(a).length!==2)m=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(D,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is the published base + build name + cp86-meow.js (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===1);}
 // 1. Sonic meow on the Siamese board (2 seeds x 60/30 fps): the face is off during the title, fades in over 0.15 s of the
 // action, is full while the meows and rings play, fades out over the last 0.4 s, off after; the game itself is identical
 // to the base (power clock, reach, coins and every piece's position, every frame); no errors
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   const A=await midRound(src,{cat:'siamese',seed,fps}),B=await midRound(ref,{cat:'siamese',seed,fps});A.g.run(TAP);B.g.run(TAP);
   let same=true,frames=0;const k=[];for(let i=0;i<Math.round(8*fps);i++){A.tk();B.tk();frames++;const sa=A.g.run(STATE),sb=B.g.run(STATE);if(sa!==sb)same=false;
    k.push([A.g.run("PGPX?PGPX.id:'-'"),+A.g.run('PGPX?PGPX.t:0'),+A.g.run('cp86K()'),J(A.g,'[pawMotion(-1),pawMotion(1)]'),J(B.g,'[pawMotion(-1),pawMotion(1)]'),+A.g.run('cp86Open()')]);if(!A.g.run('!!PGPX')&&i>fps*7)break;}
   const title=k.filter(x=>x[0]==='cp82title'),act=k.filter(x=>x[0]==='sonic'),after=k.filter(x=>x[0]==='-');
   row.titleMax=Math.max(0,...title.map(x=>x[2]));row.full=act.filter(x=>x[1]<4.9).every(x=>x[2]===1);
   row.fadeIn=act.length>0&&act[0][2]===1; /* switched in on the first frame (no fade) */row.fadeOut=act.filter(x=>x[1]>=4.9).every(x=>x[2]===0)&&act.some(x=>x[1]>=4.9); /* switched back in one frame (no fade) */
   row.stillAtExit=act.filter(x=>x[1]>=4.89).every(x=>x[3].every((m,i)=>Math.abs(m.x-x[4][i].x)<.05&&Math.abs(m.y-x[4][i].y)<.05&&Math.abs(m.r-x[4][i].r)<.001) /* at rest (within 0.05 units: a frame stamped 4.9 s can be 4.89998 s) */)&&+A.g.run('typeof cp86Pose')!==0;row.afterMax=Math.max(0,...after.map(x=>x[2]));
   const off=x=>x[3].map((m,i)=>({x:m.x-x[4][i].x,y:m.y-x[4][i].y,r:m.r-x[4][i].r}));
   row.mittMax=+Math.max(0,...act.map(x=>Math.max(...off(x).map(o=>Math.hypot(o.x,o.y))))).toFixed(1);
   row.mittMinY=+Math.min(0,...act.map(x=>Math.min(...off(x).map(o=>o.y)))).toFixed(2);
   row.mittOutside=+Math.max(0,...k.filter(x=>x[0]!=='sonic').map(x=>Math.max(...off(x).map(o=>Math.abs(o.x)+Math.abs(o.y)+Math.abs(o.r))))).toFixed(4);
   row.eyesClosed=act.filter(x=>x[1]<3.75).every(x=>x[5]===0);row.eyesOpen=act.filter(x=>x[1]>=3.9).every(x=>x[5]===1)&&act.some(x=>x[1]>=3.9);
   row.same=same;row.frames=frames;row.errs=J(A.g,'__errs').length+J(B.g,'__errs').length;row.art=A.g.run("!!(CP75_ART.siamese&&CP75_ART.siamese.face)");A.g.close();B.g.close();
   row.ok=row.stillAtExit&&row.eyesClosed&&row.eyesOpen&&row.mittMax>=30&&row.mittMinY>=0&&row.mittOutside===0&&row.titleMax===0&&row.full&&row.fadeIn&&row.fadeOut&&row.afterMax===0&&row.same&&!row.errs;if(!row.ok)ok=false;rows.push(row);}
  notes.timeline=rows;check('1 Sonic meow (Siamese, 2 seeds x 60/30 fps): the eyes are the squint until the last meow (3.75 s), then open (fully by 3.9 s) to the end; the mitts push and knead during the meow (up to 30+ units from rest), never lift (no offset upward), and are exactly at rest outside it; the yawn face is off during the title, switches in on the first frame of the action, stays while the meows and rings play, and switches back in one frame 0.1 s before the end with the cat already at rest (no fades); off after; the game is identical to the base every frame (power clock, 2x reach, coins, every piece); no errors',ok,rows);}
 // 2. nowhere else: the other cats' powers, and the Siamese outside Sonic meow, never show it
 {const rows=[];let ok=true;for(const cat of ['tuxedo','orange','ragdoll','tortie']){const {g,tk}=await midRound(src,{cat,seed:4});g.run(TAP);let mx=0;for(let i=0;i<9*60;i++){tk();mx=Math.max(mx,+g.run('cp86K()'));}rows.push([cat,mx]);if(mx)ok=false;g.close();}
  check('2 the face never shows outside Sonic meow (Formal inspection, Zoomies, Hug, Tortitude)',ok,rows);}
 // 3. on screen (Siamese, 360x640 and 412x915): frames identical to the base except during Sonic meow's action, where the
 // only changed pixels are on the cat (face, shake, mitts; the floating-text hold is off here, check 5 covers it); stills of the meow face
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
   const A=await midRound(src,{cat:'siamese',seed:7,w,h,pr:2,render:true}),B=await midRound(ref,{cat:'siamese',seed:7,w,h,pr:2,render:true});A.g.run('cp86FloatHold=function(){};');A.g.run(TAP);B.g.run(TAP);
   const grab=g=>{g.c.draw();const cv=g.c.document.getElementById('cv');return {d:cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data,W:cv.width,cv};};
   const r={sz,diffOutside:0,diffFramesOutsideAction:0,actionFramesChanged:0,box:null};let head=null;
   for(let i=0;i<8*60;i++){A.tk();B.tk();if(i%6)continue;const id=A.g.run("PGPX?PGPX.id:'-'"),pt=+A.g.run('PGPX?PGPX.t:0');
    if(!head)head=J(A.g,"(()=>{const k=scale*renderPixelRatio;return {k}})()");
    const a=grab(A.g),b=grab(B.g);let n=0,x0=1e9,y0=1e9,x1=-1,y1=-1;for(let p=0;p<a.d.length;p+=4)if(a.d[p]!==b.d[p]||a.d[p+1]!==b.d[p+1]||a.d[p+2]!==b.d[p+2]){n++;const x=(p/4)%a.W,y=Math.floor(p/4/a.W);x0=Math.min(x0,x);y0=Math.min(y0,y);x1=Math.max(x1,x);y1=Math.max(y1,y);}
    if(id!=='sonic'){if(n)r.diffFramesOutsideAction++;}else if(n){r.actionFramesChanged++;r.box=r.box?[Math.min(r.box[0],x0),Math.min(r.box[1],y0),Math.max(r.box[2],x1),Math.max(r.box[3],y1)]:[x0,y0,x1,y1];}
    if(id==='sonic'&&pt>=1&&!r.shot){r.shot=1;fs.writeFileSync(path.join(out,`meow-face-${sz}.png`),a.cv.toBuffer('image/png'));fs.writeFileSync(path.join(out,`meow-face-base-${sz}.png`),b.cv.toBuffer('image/png'));}
    if(!A.g.run('!!PGPX')&&i>7*60)break;}
   // the head occupies the top part of the screen: every changed pixel must lie above the board's back (head band)
   r.headBottom=Math.round(+A.g.run('(()=>{const k=scale*renderPixelRatio,y=Math.max(VIEW.y+180*VIEW.zy+45,__cp86MittRest(-1).y,__cp86MittRest(1).y);return (y+52+MITT_W*ART.paw.height/ART.paw.width*.6)*k;})()'));r.errs=J(A.g,'__errs').length;A.g.close();B.g.close();
   r.ok=r.diffFramesOutsideAction===0&&r.actionFramesChanged>0&&r.box&&r.box[3]<=r.headBottom+6&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.screen=rows;check('3 on screen (412x915, 360x640): identical to the base except during the meow, when only the cat\'s face changes (changed-pixel box on the head); stills meow-face-*.png',ok,rows);}
 // 5. floating texts wait for every power: a bonus prize landed mid-power drops as normal, but its "BONUS PRIZE!" shows only
 // once the power has ended; a text already showing when the power starts stays; the frozen pickup's board text ("2 / 5") is
 // not held
 {const rows=[];let ok=true;for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){const {g,tk}=await midRound(src,{cat,seed:6});
   g.run("floats.push({text:'BEFORE',x:200,y:300,t:0});");tk();g.run(TAP);const r={cat,power:null,during:0,items:0,beforeKept:false,pickupKept:false,after:null};
   let landed=false,landedAt=-1,frames=0;for(let i=0;i<14*60;i++){tk();frames++;const busy=g.run('!!PGPX');if(busy&&!r.power)r.power=g.run('PGPX.id');
    if(busy&&!r.beforeKept&&g.run("floats.some(f=>f.text==='BEFORE')"))r.beforeKept=true;
    if(busy&&!landed&&+g.run('PGPX.t')>=1.5){landed=true;landedAt=i;r.items=+g.run("bodies.filter(b=>!b.dead&&b.wildBonus).length");g.run("wildLandBonus({kind:'item',id:'cheese',x:200,y:520});floats.push({text:'2 / 5',x:200,y:300,t:0});");
     r.items=+g.run("bodies.filter(b=>!b.dead&&b.wildBonus).length")-r.items;}
    if(busy&&landed&&i>landedAt){if(g.run("floats.some(f=>f.text==='BONUS PRIZE!')"))r.during++;if(g.run("floats.some(f=>f.text==='2 / 5')"))r.pickupKept=true;}
    if(!busy&&landed){r.after=g.run("floats.some(f=>f.text==='BONUS PRIZE!')");break;}}
   r.held=J(g,'CP86.stats');r.errs=J(g,'__errs').length;g.close();
   r.ok=landed&&r.items===1&&r.during===0&&r.after===true&&r.beforeKept&&r.pickupKept&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  check('5 floating texts wait for all five powers: a bonus prize landed mid-power still drops, its BONUS PRIZE! shows only after the power; a text already showing stays; the frozen pickup board text (2 / 5) is not held',ok,rows);}
 check('4 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks86.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
