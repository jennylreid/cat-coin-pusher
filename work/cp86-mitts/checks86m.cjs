// CP-86 Sonic meow mitts: three options (above the head = the Yawn stretch, B, C), a Developer choice; mitts only.
// Usage: SRC=<build> BASE=<UAT 113 release.html> OUT=<dir> BUILD_DIR=<build folder> node checks86m.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp113/release.html'));
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
const POSE_A="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=pawMotion(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=__cp86MittRest(s),o=cp86MittOff(s,'wait',b)||{x:0,y:0,r:0};r.push({x:b.x+o.x,y:b.y+o.y,a:MITT_TURN+(s<0?o.r:-o.r)});}}return r;})()";
const POSE_B="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=pawMotion(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=mittRest(s);r.push({x:b.x,y:b.y,a:MITT_TURN});}}return r;})()";
const TARGET="[cp86MTarget(-1),cp86MTarget(1)]";
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
(async()=>{
 // 0. the build is the base + this ticket's edits and block, as the build folder's edits.json says
 if(process.env.BUILD_DIR){const D=process.env.BUILD_DIR,E=JSON.parse(fs.readFileSync(path.join(D,'edits.json'),'utf8')),V=JSON.parse(fs.readFileSync(path.join(D,'release-version.json'),'utf8'));
  let B=fs.readFileSync(base,'utf8'),m=sha(base)===V.baseSHA256;for(const [a,b] of E.edits){if(B.split(a).length!==2)m=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(D,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is the published base + build name + 5 marked CP-86 mitts edits + cp86-mitts.js (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===6&&E.edits.slice(1).every(e=>/CP-86 mitts/.test(e[1])));}
 // 1. each option x 60/30 fps x 2 seeds: the game itself identical to UAT 113 every frame; the face and eyes switch on exactly
 // the base's frames; the mitts are exactly at rest outside the action; in it they start at rest, travel (no jump bigger than
 // the travel's own speed plus the shake), hold the pose from 1.0 to 4.0 s (within the shake), and are back at rest by the
 // face's switch (4.9 s)
 {const rows=[];let ok=true;for(const pick of ['head','B','C'])for(const fps of [60,30])for(const seed of [1,2]){const row={pick,fps,seed};
   const A=await midRound(src,{cat:'siamese',seed,fps,pick}),B=await midRound(ref,{cat:'siamese',seed,fps});A.g.run(TAP);B.g.run(TAP);
   let same=true,face=true,prev=null,maxStep=0,startOff=null,holdMax=0,holdA=0,exitOff=0,outside=0,act=0,onTop=0,onTopOutside=0,D=0;let T=null;
   for(let i=0;i<Math.round(8*fps);i++){A.tk();B.tk();const sa=A.g.run(STATE),sb=B.g.run(STATE);if(sa!==sb)same=false;
    const id=A.g.run("PGPX?PGPX.id:'-'"),t=+A.g.run('PGPX?PGPX.t:0');
    if(+A.g.run('cp86K()')!==+B.g.run('cp86K()')||+A.g.run('cp86Open()')!==+B.g.run('cp86Open()'))face=false;
    const pa=J(A.g,POSE_A),pb=J(B.g,POSE_B),off=Math.max(...pa.map((p,k)=>dist(p,pb[k])+60*Math.abs(p.a-pb[k].a)));
    const kk=+A.g.run('cp86K()'),top=A.g.run('cp86MOnTop()');if(top&&kk>0)onTop++;if(top&&!(kk>0))onTopOutside++;
    if(id!=='sonic'){outside=Math.max(outside,off);prev=null;}
    else{act++;if(startOff===null){T=J(A.g,TARGET);startOff=off;D=Math.max(...pa.map((p,k)=>dist(pb[k],T[k])));}
     if(prev)maxStep=Math.max(maxStep,...pa.map((p,k)=>dist(p,prev[k])));prev=pa;
     if(t>=1&&t<=4){holdMax=Math.max(holdMax,...pa.map((p,k)=>dist(p,T[k])));holdA=Math.max(holdA,...pa.map((p,k)=>Math.abs(p.a-T[k].a)));}
     if(t>=4.9)exitOff=Math.max(exitOff,off);}
    if(!A.g.run('!!PGPX')&&i>fps*7)break;}
   Object.assign(row,{same,face,act,startOff:+(startOff||0).toFixed(2),travel:+D.toFixed(1),maxStep:+maxStep.toFixed(2),stepLimit:+(2.5*D/fps*1.2+9).toFixed(2),holdMax:+holdMax.toFixed(2),holdA:+holdA.toFixed(3),exitOff:+exitOff.toFixed(3),outside:+outside.toFixed(4),onTop,onTopOutside,errs:J(A.g,'__errs').length+J(B.g,'__errs').length,pickUsed:A.g.run('CP86M.get()')});
   A.g.close();B.g.close();
   row.ok=same&&face&&act>0&&row.startOff<=9&&row.maxStep<=row.stepLimit&&row.holdMax<=5.5&&row.holdA<=.08&&row.exitOff<=.05&&row.outside===0&&(pick==='head'?onTop>0:onTop===0)&&onTopOutside===0&&!row.errs&&row.pickUsed===pick;
   if(!row.ok)ok=false;rows.push(row);}
  notes.timeline=rows;check('1 each option (above the head, B, C) x 60/30 fps x 2 seeds: game identical to UAT 113 every frame; face and eyes switch on the base frames; mitts exactly at rest outside the action; in it they start at rest, travel without a jump, hold the pose 1.0-4.0 s (within the shake), and are at rest by the face switch at 4.9 s; drawn after the head only for above the head, only while the face shows',ok,rows);}
 // 2. the poses: above the head is the wheel's Yawn stretch exactly (cp58Mitt at the end of its rise: place and turn); B and C
 // are the mock-ups' places and turns at 412x915 (B: x 52, y 520, turn .35 out; C: x 150, y 560, turn .35 in; right mirrored)
 {const {g}=await midRound(src,{cat:'siamese',seed:3,w:412,h:915});const r={};
  g.run("W2_YAWN={t:0,cp58:true,grabs:[],away:1,crumbs:[],mouth:null,fx:{}};");r.yawn=J(g,"[cp58Mitt(-1,CP58.up),cp58Mitt(1,CP58.up)].map(m=>({x:m.x,y:m.y,dr:m.r}))");g.run("W2_YAWN=null;");
  r.head=J(g,"(()=>{CP86M.set('head');return [-1,1].map(s=>{const T=cp86MTarget(s);return {x:T.x,y:T.y,a:T.a,dr:-s*(T.a+.12)};});})()");
  r.B=J(g,"(()=>{CP86M.set('B');return [cp86MTarget(-1),cp86MTarget(1)];})()");r.C=J(g,"(()=>{CP86M.set('C');return [cp86MTarget(-1),cp86MTarget(1)];})()");g.run("CP86M.set('head')");g.close();
  const near=(a,b,e=.05)=>Math.abs(a-b)<=e;
  const okH=r.head.every((h,k)=>near(h.x,r.yawn[k].x)&&near(h.y,r.yawn[k].y)&&near(h.dr,r.yawn[k].dr,1e-9));
  const okB=near(r.B[0].x,52,.1)&&near(r.B[0].y,520,.6)&&near(r.B[0].a,.35,1e-9)&&near(r.B[1].x,348,.1)&&near(r.B[1].y,520,.6);
  const okC=near(r.C[0].x,150,.1)&&near(r.C[0].y,560,.6)&&near(r.C[0].a,-.35,1e-9)&&near(r.C[1].x,250,.1)&&near(r.C[1].y,560,.6);
  notes.poses=r;check('2 poses: above the head = the Yawn stretch exactly (place and turn); B and C = the mock-ups at 412x915',okH&&okB&&okC,r);}
 // 3. the pick is read when a meow starts: changed mid-meow, that meow keeps its pose and the next uses the new one; a
 // stored value that isn't an option gives the default (above the head)
 {const {g,tk}=await midRound(src,{cat:'siamese',seed:5,pick:'head'});g.run('wildFinish=function(){};'); /* the round stays open for a second meow */g.run(TAP);const r={first:null,second:null};
  for(let i=0;i<9*60;i++){tk();if(g.run("!!PGPX&&PGPX.id==='sonic'")&&+g.run('PGPX.t')>1&&r.first===null){g.run("CP86M.set('C')");r.first=[];}
   if(r.first&&g.run("!!PGPX&&PGPX.id==='sonic'"))r.first.push(g.run('cp86MPick()'));if(r.first&&!g.run('!!PGPX'))break;}
  for(let i=0;i<60;i++)tk();g.run(TAP);for(let i=0;i<10*60;i++){tk();if(g.run("!!PGPX&&PGPX.id==='sonic'")){r.second=g.run('cp86MPick()');break;}}
  r.first=[...new Set(r.first||[])];r.errs=J(g,'__errs').length;g.close();
  const b=await midRound(src,{cat:'siamese',seed:5,pick:'nonsense'});r.bad=b.g.run('CP86M.get()');b.g.close();const n=await midRound(src,{cat:'siamese',seed:5});r.none=n.g.run('CP86M.get()');n.g.close();
  check('3 the pick holds for a whole meow (changed mid-meow: that meow stays above the head, the next is C); no or a wrong saved value = above the head',r.first.length===1&&r.first[0]==='head'&&r.second==='C'&&r.bad==='head'&&r.none==='head'&&!r.errs,r);}
 // 4. nowhere else: other cats' powers never move the mitts or change their layer
 {const rows=[];let ok=true;for(const cat of ['tuxedo','orange','ragdoll','tortie']){const {g,tk}=await midRound(src,{cat,seed:4});g.run(TAP);let mx=0,top=0;for(let i=0;i<9*60;i++){tk();mx=Math.max(mx,+g.run('cp86MWeight()'));if(g.run('cp86MOnTop()'))top++;}rows.push([cat,mx,top]);if(mx||top)ok=false;g.close();}
  check('4 the other cats powers never move the mitts or change their layer',ok,rows);}
 // 5. on screen (render harness, 412x915 and 360x640, each option): frames identical to UAT 113 outside the meow's action; no draw errors
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]])for(const pick of ['head','B','C']){const sz=w+'x'+h;
   const A=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true,pick}),B=await midRound(ref,{cat:'siamese',seed:7,w,h,pr:1,render:true});A.g.run(TAP);B.g.run(TAP);
   const grab=g=>{g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   // the canvas's last pixel column is only part-covered by the background in this harness at 360 wide, so it keeps a faint
   // trace of whatever was drawn there earlier (the right mitt now reaches the edge in the meow): that column is allowed a
   // small difference (reported as edgeMax); every other pixel must be identical
   const r={sz,pick,outsideDiff:0,actionChanged:0,frames:0,edgeMax:0};
   for(let i=0;i<8*60;i++){A.tk();B.tk();if(i%10)continue;const id=A.g.run("PGPX?PGPX.id:'-'");const a=grab(A.g),b=grab(B.g),CW=+A.g.run("document.getElementById('cv').width");r.frames++;let n=0,ne=0;for(let p=0;p<a.length;p+=4)if(a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2]){if((p/4)%CW===CW-1&&id!=='sonic'){r.edgeMax=Math.max(r.edgeMax,Math.abs(a[p]-b[p]),Math.abs(a[p+1]-b[p+1]),Math.abs(a[p+2]-b[p+2]));continue;}n++;}
    if(id!=='sonic'){if(n)r.outsideDiff++;}else if(n)r.actionChanged++;if(!A.g.run('!!PGPX')&&i>7*60)break;}
   r.errs=J(A.g,'__errs').length;A.g.close();B.g.close();r.ok=r.outsideDiff===0&&r.edgeMax<=16&&r.actionChanged>0&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.screen=rows;check('5 on screen (412x915, 360x640, each option): identical to UAT 113 outside the meow (except a faint trace, edgeMax, in the canvas edge column the harness background only part-covers); no draw errors',ok,rows);}
 check('6 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks86m.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
