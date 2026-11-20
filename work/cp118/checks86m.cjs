// CP-86 Sonic meow mitts, UAT 118: the held beat after the rings.
// Usage: SRC=<build> BASE=<UAT 116 or 117 release.html> OUT=<dir> BUILD_DIR=<build folder> node checks86m.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(process.env.BASE||path.join(__dirname,'../cp116/release.html'));
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
const STATE="JSON.stringify({p:PGPX?[PGPX.id,+PGPX.t.toFixed(4)]:null,reach:pglReach(),shake:+shake.toFixed(4),coins:board.coins,pieces:bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,+q.x.toFixed(3),+q.y.toFixed(3),+q.z.toFixed(3)];})})";
// each mitt as seen on screen: place and turn (left mitt's turn; the right mirrors), from whichever way the mitts are drawn
const POSE="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=pawMotion(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=__cp86MittRest(s),o=cp86MittOff(s,'wait',b)||{x:0,y:0,r:0};r.push({x:b.x+o.x,y:b.y+o.y,a:MITT_TURN+(s<0?o.r:-o.r)});}}return r;})()";
const REST="(()=>{const r=[];for(const s of [-1,1]){if(isRestPose()){const m=__cp86Paw(s),R=cp58Rest(s);r.push({x:R.x+m.x,y:R.y+m.y,a:s<0?m.r-.12:-m.r-.12});}else{const b=__cp86MittRest(s);r.push({x:b.x,y:b.y,a:MITT_TURN});}}return r;})()";
const HEAD="(()=>{const P=CP86M.POSE.head;return [-1,1].map(s=>{const R=cp58Rest(s);return {x:R.x+s*P.dx,y:R.y+P.dy,a:P.a};});})()";
const VT="(()=>{const X=cp86X();return X?X.t:-1;})()";
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y),off=(A,B)=>Math.max(...A.map((p,k)=>dist(p,B[k])+60*Math.abs(p.a-B[k].a)));
(async()=>{
 // 0. the build is the base + this ticket's edit and block, as the build folder's edits.json says
 if(process.env.BUILD_DIR){const D=process.env.BUILD_DIR,E=JSON.parse(fs.readFileSync(path.join(D,'edits.json'),'utf8')),V=JSON.parse(fs.readFileSync(path.join(D,'release-version.json'),'utf8'));
  let B=fs.readFileSync(base,'utf8'),m=sha(base)===V.baseSHA256;for(const [a,b] of E.edits){if(B.split(a).length!==2)m=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(D,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is the published base + build name + 1 marked CP-86 held beat edit + cp86-beat.js (everything else unchanged)',fs.readFileSync(src,'utf8')===B&&m&&E.edits.length===2&&/CP-86 held beat/.test(E.edits[1][1])&&E.appendedBeforeLastScriptClose.join()==='cp86-beat.js');}
 // 1. against the base (60/30 fps x 2 seeds): the game is identical every frame (power clock, its end, 2x reach, board shake,
 // coins, every piece); the face and eyes switch on the base's frames up to 4.9 s; the mitts match the base until 4.65 s.
 // After the power ends (rings gone: they are drawn only while it runs), the pose holds: meow face, eyes open, mitts above the
 // head, the shiver settled by 5.25 s, so from 5.25 to 5.5 s the mitts sit exactly at the pose; then the drop (in front of the
 // head) to under the cheeks by 5.65 s, behind the head from there, at rest by 5.75 s, the face switching back on that frame;
 // the return moves every frame and no frame is over 35% of its path; at rest outside
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   const A=await midRound(src,{cat:'siamese',seed,fps}),B=await midRound(ref,{cat:'siamese',seed,fps});A.g.run(TAP);B.g.run(TAP);
   let same=true,faceEarly=true,early=0,beatMax=0,still=0,ringsDuringBeat=0,powerEnd=null,faceOff=null,lastFace=null,outside=0,ret=[],faceOnAll=true;
   for(let i=0;i<Math.round(9*fps);i++){A.tk();B.tk();if(A.g.run(STATE)!==B.g.run(STATE))same=false;
    const t=+A.g.run(VT),pid=A.g.run("PGPX?PGPX.id:'-'"),k=+A.g.run('cp86K()'),pa=J(A.g,POSE),rest=J(A.g,REST);
    if(t<0){if(faceOff===null&&lastFace!==null)faceOff={lastFaceT:+lastFace.t.toFixed(3),lastFaceOff:+lastFace.off.toFixed(2),nextFrameOff:+off(pa,rest).toFixed(4)};outside=Math.max(outside,off(pa,rest));if(powerEnd!==null&&i>fps*8)break;continue;}
    if(pid==='sonic'&&t<4.9&&(k!==+B.g.run('cp86K()')||+A.g.run('cp86Open()')!==+B.g.run('cp86Open()')))faceEarly=false;
    if(pid==='sonic'&&t<4.65)early=Math.max(early,off(pa,J(B.g,POSE)));
    if(pid!=='sonic'&&powerEnd===null)powerEnd=+t.toFixed(3);
    if(pid!=='sonic'&&t<5.5){if(!k||!+A.g.run('cp86Open()'))faceOnAll=false;const H=J(A.g,HEAD);beatMax=Math.max(beatMax,...pa.map((p,j)=>dist(p,H[j])));if(t>=5.25)still=Math.max(still,off(pa,H));}
    if(t>=5.47&&t<5.75)ret.push({t,pa,rest,top:A.g.run('cp86MOnTop()'),k});
    if(k>0)lastFace={t,off:off(pa,rest)};}
   const errs=J(A.g,'__errs').length+J(B.g,'__errs').length,basePowerEnd=1;A.g.close();B.g.close();
   const path=ret.length?Math.max(...ret[0].pa.map((p,j)=>dist(p,ret[0].rest[j])))+2*95:0;let maxStep=0,moving=0;
   for(let j=1;j<ret.length;j++){const s=Math.max(...ret[j].pa.map((p,q)=>dist(p,ret[j-1].pa[q])));maxStep=Math.max(maxStep,s);if(s>.5)moving++;}
   const topOk=ret.filter(x=>x.t<5.64).every(x=>x.top)&&ret.filter(x=>x.t>=5.66).every(x=>!x.top);
   Object.assign(row,{same,faceEarly,early:+early.toFixed(4),powerEnd,beatMax:+beatMax.toFixed(2),stillOff:+still.toFixed(4),faceOnAll,returnFrames:ret.length,moving,maxStepShare:+(maxStep/Math.max(1,path)).toFixed(3),topOk,faceOff,outside:+outside.toFixed(4),errs});
   row.ok=same&&faceEarly&&row.early===0&&powerEnd!==null&&powerEnd<=5.04&&row.beatMax<=5.5&&row.stillOff<1e-6&&faceOnAll&&ret.length>=(fps===60?15:7)&&moving>=(fps===60?14:6)&&row.maxStepShare<=.35&&topOk&&faceOff&&faceOff.lastFaceT>=5.71&&faceOff.lastFaceT<=5.755&&faceOff.nextFrameOff===0&&row.outside===0&&!errs;
   if(!row.ok)ok=false;rows.push(row);}
  notes.timeline=rows;check('1 vs the base (60/30 fps x 2 seeds): the game identical every frame (the power still ends at 5 s, the 2x reach and shake with it); face, eyes and mitts as the base until 4.65 s; after the rings end, the pose holds (meow face, eyes open, mitts above the head, still from 5.25 s) until 5.5 s; then the quick drop (in front of the head) and the tuck behind it, at rest as the face switches back at 5.75 s; moving every frame, no frame over 35% of the path',ok,rows);}
 // 2. floating texts: one made during the beat waits until the face has switched back; texts held during the power are
 // released then too (not at the power's end)
 {const {g,tk}=await midRound(src,{cat:'siamese',seed:6});g.run(TAP);const r={madeAt:null,shownDuringTail:0,shownAfter:null,calloutHeldTail:0,tailFrames:0,calloutHeldAfter:null};
  for(let i=0;i<9*60;i++){tk();const t=+g.run(VT),pid=g.run("PGPX?PGPX.id:'-'");
   if(r.madeAt!==null&&t>=0&&g.run("floats.some(f=>f.text==='BEAT TEST')"))r.shownDuringTail++;
   if(t>=0&&pid==='-'){r.tailFrames++;if(g.run('cp82Holding()'))r.calloutHeldTail++;}
   if(pid==='-'&&t>=5.1&&r.madeAt===null){g.run("floats.push({text:'BEAT TEST',x:200,y:300,t:0});");r.madeAt=+t.toFixed(3);} /* checked from the next frame, after the hold has run */
   if(r.madeAt!==null&&t<0){r.calloutHeldAfter=g.run('cp82Holding()');for(let j=0;j<3&&!r.shownAfter;j++){r.shownAfter=g.run("floats.some(f=>f.text==='BEAT TEST')");if(!r.shownAfter)tk();}break;}}
  r.errs=J(g,'__errs').length;g.close();
  check('2 floating texts and callouts (COIN RAIN) wait through the beat: a text made during it shows once the face has switched back (within 3 frames); callouts are held on every tail frame and released after',r.madeAt!==null&&r.shownDuringTail===0&&r.shownAfter===true&&r.tailFrames>30&&r.calloutHeldTail===r.tailFrames&&r.calloutHeldAfter===false&&!r.errs,r);}
 // 3. something else starting during the beat (Sonic meow tapped again: its title starts) sends the tail straight to its
 // drop: the mitts still travel home (no frame over 35% of the way) and the tail is over before the new meow's action
 {const {g,tk}=await midRound(src,{cat:'siamese',seed:5});g.run('wildFinish=function(){};');g.run(TAP);const r={tapAt:null,maxStepShare:0,endedBeforeAction:null,cut:0};let prev=null,path=0;
  for(let i=0;i<12*60;i++){tk();const t=+g.run(VT),pid=g.run("PGPX?PGPX.id:'-'");
   if(pid==='-'&&t>=5.1&&r.tapAt===null){g.run(TAP);r.tapAt=+t.toFixed(3);r.title=g.run("PGPX?PGPX.id:'-'");}
   if(r.tapAt!==null&&r.endedBeforeAction===null){const pa=J(g,POSE);if(prev){const s=Math.max(...pa.map((p,j)=>dist(p,prev[j])));r.maxStepShare=Math.max(r.maxStepShare,s);}else path=Math.max(...pa.map((p,j)=>dist(p,J(g,REST)[j])))+2*95;prev=pa;
    if(pid==='sonic')r.endedBeforeAction=g.run('CP86T===null')&&+g.run('PGPX.t')<.2;}
   if(r.endedBeforeAction!==null)break;}
  r.maxStepShare=+(r.maxStepShare/Math.max(1,path)).toFixed(3);r.cut=J(g,'CP86B.stats').cut;r.errs=J(g,'__errs').length;g.close();
  check('3 a new power started during the beat: the tail goes straight to its drop, the mitts travel home with no jump, and it is over before the new action',r.tapAt!==null&&r.title==='cp82title'&&r.cut===1&&r.maxStepShare<=.35&&r.endedBeforeAction===true&&!r.errs,r);}
 // 4. nowhere else: other cats' powers never start a tail, move the mitts or change their layer
 {const rows=[];let ok=true;for(const cat of ['tuxedo','orange','ragdoll','tortie']){const {g,tk}=await midRound(src,{cat,seed:4});g.run(TAP);let mx=0,top=0,tail=0;for(let i=0;i<9*60;i++){tk();mx=Math.max(mx,+g.run('cp86MWeight()'));if(g.run('cp86MOnTop()'))top++;if(g.run('!!CP86T'))tail++;}rows.push([cat,mx,top,tail]);if(mx||top||tail)ok=false;g.close();}
  check('4 the other cats powers never start the tail, move the mitts or change their layer',ok,rows);}
 // 5. the mitts are fully opaque on every frame of the meow and its tail (render harness, 60 fps, 412x915 and 360x640)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});
   g.run("globalThis.__al=[];{const f=drawRestMitt;drawRestMitt=function(){const X=cp86X();if(X&&cp86K()>0){const m=ctx.getTransform();__al.push([X.t,ctx.globalAlpha,ctx.globalCompositeOperation,ctx.filter||'none',Math.hypot(m.a,m.b),arguments[0],arguments[1]===undefined?1:arguments[1]]);}return f.apply(this,arguments);};}");
   g.run(TAP);let frames=0,tailFrames=0;for(let i=0;i<9*60;i++){tk();if(g.run("cp86K()>0")){g.c.draw();frames++;if(!g.run('!!PGPX'))tailFrames++;}else if(frames)break;}
   const al=J(g,'__al'),per={};for(const x of al)per[x[0]]=(per[x[0]]||0)+1;const sizes=[...new Set(al.map(x=>x[4].toFixed(4)+'/'+x[5]))];
   const r={sz:w+'x'+h,frames,tailFrames,draws:al.length,notOpaque:al.filter(x=>x[1]!==1||x[2]!=='source-over'||!['none',''].includes(x[3])||x[6]!==1).length,framesWithout2:Object.values(per).filter(n=>n!==2).length,sizes,errs:J(g,'__errs').length};g.close();
   r.ok=frames>300&&tailFrames>=40&&r.draws===2*frames&&r.notOpaque===0&&r.framesWithout2===0&&sizes.length===1&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.opacity=rows;check('5 the mitts are fully opaque on every frame of the meow and its held beat (alpha 1, normal blending, no filter, same art and size, both drawn every frame)',ok,rows);}
 // 6. the layer change (first frame at 5.65 s) is invisible: that frame drawn with the mitts in front and behind is the same
 // picture (random sparkles seeded alike; at 360x640 the harness's own frame-to-frame difference is the allowance)
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const {g,tk}=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true});g.run(TAP);
   for(let i=0;i<9*60;i++){tk();if(+g.run(VT)>=+g.run('CP86F.under'))break;}
   const t=+g.run(VT),grab=()=>{g.run("globalThis.__r=7;Math.random=()=>{__r=(__r*16807)%2147483647;return __r/2147483647;}");g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const real=g.run('cp86MOnTop()');g.run("globalThis.__ot=cp86MOnTop;cp86MOnTop=function(){return true;}");const a=grab(),a2=grab();g.run("cp86MOnTop=function(){return false;}");const b2=grab();g.run("cp86MOnTop=__ot");
   const cnt=(x,y)=>{let n=0;for(let p=0;p<x.length;p+=4)if(x[p]!==y[p]||x[p+1]!==y[p+1]||x[p+2]!==y[p+2])n++;return n;};
   const r={sz:w+'x'+h,t:+t.toFixed(3),onTopThatFrame:real,frontVsBehind:cnt(a,b2),sameModeTwice:cnt(a,a2)};g.close();
   r.ok=r.onTopThatFrame===false&&r.frontVsBehind<=r.sameModeTwice+20;if(!r.ok)ok=false;rows.push(r);}
  notes.layer=rows;check('6 the layer change happens with the mitts under the cheeks, where in front of and behind the head look the same',ok,rows);}
 // 7. on screen (render harness, 412x915 and 360x640): every frame identical to the base until 4.65 s of the meow; no draw errors
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){
   const A=await midRound(src,{cat:'siamese',seed:7,w,h,pr:1,render:true}),B=await midRound(ref,{cat:'siamese',seed:7,w,h,pr:1,render:true});A.g.run(TAP);B.g.run(TAP);
   const grab=g=>{g.c.draw();const cv=g.c.document.getElementById('cv');return cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;};
   const r={sz:w+'x'+h,diffBefore:0,frames:0};
   for(let i=0;i<9*60;i++){A.tk();B.tk();if(i%5)continue;const t=+A.g.run(VT),pid=A.g.run("PGPX?PGPX.id:'-'");if(pid==='sonic'&&t>=4.65)break;const a=grab(A.g),b=grab(B.g);r.frames++;let n=0;for(let p=0;p<a.length;p+=4)if(a[p]!==b[p]||a[p+1]!==b[p+1]||a[p+2]!==b[p+2])n++;if(n)r.diffBefore++;}
   r.errs=J(A.g,'__errs').length;A.g.close();B.g.close();r.ok=r.frames>50&&r.diffBefore===0&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.screen=rows;check('7 on screen (412x915, 360x640): identical to the base every frame until 4.65 s of the meow; no draw errors',ok,rows);}
 check('8 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks86m.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
