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
(async()=>{
 // 0. the build is UAT 115 + this ticket's edits, as the build folder's edits.json says
 if(process.env.BUILD_DIR){const D=process.env.BUILD_DIR,E=JSON.parse(fs.readFileSync(path.join(D,'edits.json'),'utf8')),V=JSON.parse(fs.readFileSync(path.join(D,'release-version.json'),'utf8'));
  let B=fs.readFileSync(base,'utf8'),m=sha(base)===V.baseSHA256;for(const [a,b] of E.edits){if(B.split(a).length!==2)m=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(D,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is the published UAT 115 + build name + 4 marked CP-86 mitts final edits + cp86-final.js (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===5&&E.edits.slice(1).every(e=>/CP-86 mitts final/.test(e[1]))&&E.appendedBeforeLastScriptClose.join()==='cp86-final.js');}
 // 1. against UAT 115 with E picked (60/30 fps x 2 seeds): play identical every frame; face and eyes on the same frames; the
 // mitts identical to UAT 115's E until its return began (4.3 s); then held above the head (within the shake) until 4.7 s;
 // then a quick return: it starts at 4.7 s, ends at rest by the face switch (4.9 s), takes 0.2 s (11+ frames at 60 fps, 5+
 // at 30), moves every frame and no frame jumps more than 35% of the way (no cut); exactly at rest outside the meow
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   const A=await midRound(src,{cat:'siamese',seed,fps}),B=await midRound(ref,{cat:'siamese',seed,fps,pick:'E'});A.g.run(TAP);B.g.run(TAP);
   let same=true,face=true,early=0,hold=0,holdA=0,outside=0,exitOff=0,ret=[],errs=0;
   for(let i=0;i<Math.round(8*fps);i++){A.tk();B.tk();if(A.g.run(STATE)!==B.g.run(STATE))same=false;
    if(+A.g.run('cp86K()')!==+B.g.run('cp86K()')||+A.g.run('cp86Open()')!==+B.g.run('cp86Open()'))face=false;
    const id=A.g.run("PGPX?PGPX.id:'-'"),t=+A.g.run('PGPX?PGPX.t:0'),pa=J(A.g,POSE),pb=J(B.g,POSE),rest=J(A.g,REST);
    if(id!=='sonic'){outside=Math.max(outside,off(pa,rest));continue;}
    if(t<4.3)early=Math.max(early,off(pa,pb));
    if(t>=3.8&&t<4.64){const H=J(A.g,HEAD);hold=Math.max(hold,...pa.map((p,k)=>dist(p,H[k])));holdA=Math.max(holdA,...pa.map((p,k)=>Math.abs(p.a-H[k].a)));}
    if(t>=4.62&&t<4.9)ret.push({t,pa,rest,top:A.g.run('cp86MOnTop()')});if(t>=4.9)exitOff=Math.max(exitOff,off(pa,rest));
    if(!A.g.run('!!PGPX')&&i>fps*7)break;}
   errs=J(A.g,'__errs').length+J(B.g,'__errs').length;A.g.close();B.g.close();
   // the return: from the last held frame to rest; its frames and steps (shake included, which only fades as it settles)
   const startD=ret.length?Math.max(...ret[0].pa.map((p,k)=>dist(p,ret[0].rest[k])))+2*95:0;let maxStep=0,moving=0;const topBefore=ret.filter(x=>x.t<4.8).every(x=>x.top),topAfter=ret.filter(x=>x.t>=4.8).every(x=>!x.top);
   for(let k=1;k<ret.length;k++){const s=Math.max(...ret[k].pa.map((p,j)=>dist(p,ret[k-1].pa[j])));maxStep=Math.max(maxStep,s);if(s>.5)moving++;}
   Object.assign(row,{same,face,early:+early.toFixed(4),hold:+hold.toFixed(2),holdA:+holdA.toFixed(3),returnFrames:ret.length,moving,topBefore,topAfter,startD:+startD.toFixed(1),maxStep:+maxStep.toFixed(1),maxStepShare:+(maxStep/Math.max(1,startD)).toFixed(3),exitOff:+exitOff.toFixed(3),outside:+outside.toFixed(4),errs});
   row.ok=same&&face&&row.early===0&&row.hold<=5.5&&row.holdA<=.08&&ret.length>=(fps===60?14:7)&&moving>=(fps===60?13:6)&&row.maxStepShare<=.35&&topBefore&&topAfter&&row.exitOff<=.05&&row.outside===0&&!errs;
   if(!row.ok)ok=false;rows.push(row);}
  notes.timeline=rows;check('1 vs UAT 115 E (60/30 fps x 2 seeds): play identical every frame; face and eyes on the same frames; mitts as UAT 115 E until 4.3 s, held above the head until 4.65 s, then quickly down in front of the face to under the cheeks (by 4.8 s, in front of the head) and up into rest behind the head by the face switch (4.9 s): moving every frame, no frame over 35% of the path; at rest outside the meow',ok,rows);}
 // 2. E's first half unchanged: the Dancing pose until 3.0 s, above the head exactly as the eyes open (3.75 s)
 {const {g,tk}=await midRound(src,{cat:'siamese',seed:8});g.run(TAP);const r={before:0,openFrame:null};
  const D="(()=>{const P=CP86M.POSE.D;return [-1,1].map(s=>{const R=cp58Rest(s);return {x:R.x+s*P.dx,y:R.y+P.dy,a:P.a};});})()";
  for(let i=0;i<9*60;i++){tk();if(!g.run("!!PGPX&&PGPX.id==='sonic'")){if(r.openFrame)break;continue;}const t=+g.run('PGPX.t'),T=J(g,'[cp86MTarget(-1),cp86MTarget(1)]');
   if(t<3)r.before=Math.max(r.before,off(T,J(g,D)));if(+g.run('cp86Open()')&&!r.openFrame)r.openFrame={t:+t.toFixed(3),off:+off(T,J(g,HEAD)).toFixed(6)};}
  r.errs=J(g,'__errs').length;g.close();
  check('2 E as passed: the Dancing pose until 3.0 s, above the head exactly as the eyes open',r.before<1e-9&&r.openFrame&&r.openFrame.off<1e-6&&!r.errs,r);}
 // 3. E is the only behaviour: no saved value, an old saved choice (head, B, D) or nonsense all give E; set() refuses others
 {const r={};for(const v of [null,'head','B','D','F','nonsense']){const {g}=await midRound(src,{cat:'siamese',seed:5,pick:v});r[String(v)]=g.run("(()=>{const a=CP86M.get();CP86M.set('head');return a+'/'+CP86M.get()+'/'+CP86M.CHOICES.join(',');})()");g.close();}
  check('3 E is the only behaviour: no saved choice, any old saved choice and nonsense all give E; nothing else can be set',Object.values(r).every(x=>x==='E/E/E'),r);}
 // 4. nowhere else: other cats' powers never move the mitts or change their layer
 {const rows=[];let ok=true;for(const cat of ['tuxedo','orange','ragdoll','tortie']){const {g,tk}=await midRound(src,{cat,seed:4});g.run(TAP);let mx=0,top=0;for(let i=0;i<9*60;i++){tk();mx=Math.max(mx,+g.run('cp86MWeight()'));if(g.run('cp86MOnTop()'))top++;}rows.push([cat,mx,top]);if(mx||top)ok=false;g.close();}
  check('4 the other cats powers never move the mitts or change their layer',ok,rows);}
 // 5. on screen (render harness, 412x915 and 360x640): every frame identical to UAT 115 with E picked, except from 4.3 s of the
 // meow (UAT 115's slow return began) to its end; no draw errors
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
   const A=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true}),B=await midRound(ref,{cat:'siamese',seed:7,w,h,pr:1,render:true,pick:'E'});A.g.run(TAP);B.g.run(TAP);
   const grab=g=>{g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const r={sz,diffBefore:0,changedLate:0,diffAfter:0,frames:0};
   for(let i=0;i<8*60;i++){A.tk();B.tk();if(i%5)continue;const id=A.g.run("PGPX?PGPX.id:'-'"),t=+A.g.run('PGPX?PGPX.t:0');const a=grab(A.g),b=grab(B.g),CW=+A.g.run("document.getElementById('cv').width");r.frames++;let n=0;for(let p=0;p<a.length;p+=4)if(a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2]){if((p/4)%CW===CW-1&&!(id==='sonic'&&t>=4.3)){r.edgeMax=Math.max(r.edgeMax||0,Math.abs(a[p]-b[p]),Math.abs(a[p+1]-b[p+1]),Math.abs(a[p+2]-b[p+2]));continue;}n++;}
    if(id==='sonic'&&t>=4.3){if(n)r.changedLate++;}else if(id==='sonic'||!r.seen){if(id==='sonic')r.seen=1;if(n)r.diffBefore++;}else if(n)r.diffAfter++;
    if(!A.g.run('!!PGPX')&&i>7*60)break;}
   r.errs=J(A.g,'__errs').length;A.g.close();B.g.close();r.ok=r.diffBefore===0&&r.diffAfter===0&&(r.edgeMax||0)<=16&&r.changedLate>0&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.screen=rows;check('5 on screen (412x915, 360x640): identical to UAT 115 E every frame except the meow from 4.3 s (the new hold and quick return), apart from a faint trace (edgeMax) in the canvas edge column the harness background only part-covers at 360 wide; no draw errors',ok,rows);}
 // 7. the mitts are fully opaque on every frame of the meow: every mitt drawing (drawRestMitt) during it is at globalAlpha 1,
 // normal blending, no filter, the same size, two mitts every frame (render harness, 60 fps, 412x915 and 360x640)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});
   g.run("globalThis.__al=[];{const f=drawRestMitt;drawRestMitt=function(){if(PGPX&&PGPX.id==='sonic'){const m=ctx.getTransform();__al.push([PGPX.t,ctx.globalAlpha,ctx.globalCompositeOperation,ctx.filter||'none',Math.hypot(m.a,m.b),arguments[0],arguments[1]===undefined?1:arguments[1]]);}return f.apply(this,arguments);};}");
   g.run(TAP);let frames=0;for(let i=0;i<8*60;i++){tk();if(g.run("!!PGPX&&PGPX.id==='sonic'")){g.c.draw();frames++;}else if(frames)break;}
   const al=J(g,'__al'),per={};for(const x of al)per[x[0]]=(per[x[0]]||0)+1;const sizes=[...new Set(al.map(x=>x[4].toFixed(4)+'/'+x[5]))];
   const r={sz:w+'x'+h,frames,draws:al.length,notOpaque:al.filter(x=>x[1]!==1||x[2]!=='source-over'||!['none',''].includes(x[3])||x[6]!==1).length,framesWithout2:Object.values(per).filter(n=>n!==2).length,sizes,errs:J(g,'__errs').length};g.close();
   r.ok=frames>250&&r.draws===2*frames&&r.notOpaque===0&&r.framesWithout2===0&&sizes.length===1&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.opacity=rows;check('7 the mitts are fully opaque on every frame of the meow (alpha 1, normal blending, no filter, same art and size, both drawn every frame)',ok,rows);}
 // 8. the layer change (in front of the head -> behind it, on the first frame at 4.8 s) is invisible: that frame drawn with the
 // mitts in front and behind is the same picture (random sparkles seeded alike for both draws; at 360x640 the harness's
 // own frame-to-frame difference, measured by drawing the same mode twice, is the allowance)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});g.run(TAP);
   for(let i=0;i<9*60;i++){tk();if(+g.run("PGPX&&PGPX.id==='sonic'?PGPX.t:0")>=+g.run('CP86F.under'))break;}
   const t=+g.run('PGPX.t'),grab=()=>{g.run("globalThis.__r=7;Math.random=()=>{__r=(__r*16807)%2147483647;return __r/2147483647;}");g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const real=g.run('cp86MOnTop()');g.run("globalThis.__ot=cp86MOnTop;cp86MOnTop=function(){return true;}");const a=grab(),a2=grab();g.run("cp86MOnTop=function(){return false;}");const b2=grab();g.run("cp86MOnTop=__ot");
   const cnt=(x,y)=>{let n=0;for(let p=0;p<x.length;p+=4)if(x[p]!==y[p]||x[p+1]!==y[p+1]||x[p+2]!==y[p+2])n++;return n;};
   const r={sz:w+'x'+h,t:+t.toFixed(3),onTopThatFrame:real,frontVsBehind:cnt(a,b2),sameModeTwice:cnt(a,a2)};g.close();
   r.ok=r.onTopThatFrame===false&&r.frontVsBehind<=r.sameModeTwice+20;if(!r.ok)ok=false;rows.push(r);}
  notes.layer=rows;check('8 the layer change happens with the mitts under the cheeks, where in front of and behind the head look the same',ok,rows);}
 check('6 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks86m.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
