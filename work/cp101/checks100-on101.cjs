// UAT 100 checks (CP-72, Jenny Nov 18 on UAT 99: "can you shorten the up close pause and if that doesn't work we'll revert
// to your earlier version, prior to my close-up request."): the showing-off close-up held 0.4 s (was 1 s), zoom in/out as
// before; "Zoomies ending" Developer choice Short close-up (default) / Hang (UAT 96). Usage: node checks100.cjs
// -> tickets/CP-72-evidence/uat100/checks100-on101.json + stills zoomies-short-*.png, zoomies-hang-middle-*.png
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const DEV=false,V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=path.resolve(__dirname,'../cp99/release.html'),out=path.resolve(__dirname,'../../tickets/CP-82-evidence/uat101');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const LEAD=1.25,TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
async function midRound(file,{seed,level=3,secs=10,fps=60,render=false,w=400,h=889,pr=1,store={}}){
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1',...store}}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1',...store}});
 if(render)g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};const tk=fps===60?g.tick:g.tick30;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(${level-1},PG_SWITCH_LEVEL);PG.lv.sel=${level};if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=2;");return {g,tk};}
(async()=>{
 // 0. the build
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp100/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='57f3dad50eb6ef644183f27db5056bda96a3ac9f395e8a4249d3edf14c0d4618')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published cp100 + build name + CP-82 power titles (everything else unchanged)',S===B&&m.length===1);}
 // 1. the kittens' paths against UAT 99: the cream kitten's identical; the ginger kitten's identical up to its hang, in the
 // finish after it, and where it lands; the hang lasts 0.85 s (UAT 99: 1.45 s): the zoom up to the close-up (0.2 s) and back
 // out (0.25 s) take as long as in UAT 99, the close-up is held 0.4 s (UAT 99: 1 s), tilted 20 degrees, puffed and fully
 // visible as before. The "Hang" choice gives exactly UAT 96's hang ('still', as in UAT 99 with style 'still').
 {const P=st=>`(()=>{${st}const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const L=[];for(let u=0;u<=k.len+.001;u+=1/60)L.push(z72KitPos(k,u));const E=z72KitPos(k,k.len);out.push({len:k.len,segs:k.segs.map(s=>s.k+':'+s.d.toFixed(4)),pos:L,end:{x:E.x,z:E.z,h:E.h}});}return out;})()`;
  const FIN=`(()=>{const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const g=k.segs[k.segs.length-1];out.push([0,.25,.5,.75,1].map(u=>g.f(u)));}return out;})()`;
  const g=(await midRound(src,{seed:3})).g;const a=J(g,P('')),J2={finish:J(g,FIN)},hang=J(g,P("CP72E.set('hang');"));g.close();
  const g2=(await midRound(base,{seed:3})).g;const b=J(g2,P('')),Jb={finish:J(g2,FIN)},bStill=J(g2,P("Z72.leapHang.style='still';"));g2.close();
  const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);const r={paths:[]};
  r.hangChoice=same(hang,bStill);r.cream=same(a[1],b[1]);
  const ramp=(H,first)=>{let n=0;const L=first?H:[...H].reverse();for(const p of L){if((p.face||0)>=1)break;n++;}return +(n/60).toFixed(2);};
  for(const n of [0,2,3]){const A=a[n],B=b[n],li=B.segs.length-2,T0=B.pos.findIndex(p=>p.si===li);const row={start:+B.pos[T0].x.toFixed(1)};
   row.before=same(A.pos.slice(0,T0),B.pos.slice(0,T0));row.segsSame=same(A.segs.filter((s,i)=>i!==li),B.segs.filter((s,i)=>i!==li));
   row.finishSame=same(J2.finish[n],Jb.finish[n]);row.end=same(A.end,B.end);
   const H=A.pos.filter(p=>p.si===li),Hb=B.pos.filter(p=>p.si===li);row.hangS=+(H.length/60).toFixed(2);row.baseHangS=+(Hb.length/60).toFixed(2);
   row.fullS=+(H.filter(p=>p.face===1).length/60).toFixed(2);row.baseFullS=+(Hb.filter(p=>p.face===1).length/60).toFixed(2);
   row.zoomIn=[ramp(H,true),ramp(Hb,true)];row.zoomOut=[ramp(H,false),ramp(Hb,false)];
   row.tiltDeg=+(Math.max(...H.map(p=>Math.abs(p.lean||0)))*180/Math.PI).toFixed(2);row.tiltWithFace=H.every(p=>Math.abs(Math.abs(p.lean||0)-(p.face||0)*20*Math.PI/180)<1e-9);
   row.asBefore=H.every(p=>p.puff===1&&p.fade===1)&&Math.abs(Math.max(...H.map(p=>p.grow))-Math.max(...Hb.map(p=>p.grow)))<1e-9;
   r.paths.push(row);}
  notes.paths=r;console.log(JSON.stringify(r));const p0=r.paths[0];
  check('1 against UAT 99: the cream kitten\'s path identical; the ginger kitten\'s identical up to its hang, after it and where it lands; the hang lasts '+p0.hangS+' s (UAT 99: '+p0.baseHangS+' s); zoom in '+p0.zoomIn[0]+' s / out '+p0.zoomOut[0]+' s as in UAT 99 ('+p0.zoomIn[1]+' / '+p0.zoomOut[1]+'); the close-up held '+p0.fullS+' s (UAT 99: '+p0.baseFullS+' s), tilted '+p0.tiltDeg+' degrees; puffed and fully visible; the Hang choice is exactly UAT 96\'s hang',
   r.hangChoice&&r.cream&&r.paths.every(p=>p.before&&p.segsSame&&p.finishSame&&p.end&&p.hangS>=.84&&p.hangS<=.87&&p.fullS>=.38&&p.fullS<=.43&&Math.abs(p.zoomIn[0]-p.zoomIn[1])<=.02&&Math.abs(p.zoomOut[0]-p.zoomOut[1])<=.02&&Math.abs(p.tiltDeg-20)<.01&&p.tiltWithFace&&p.asBefore),r);}
 // 2. in play, against the base (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed for the
 // same frames (back to normal at 7 s of Zoomies in both, so the hang does not lengthen the turbo); the power ends when the
 // ginger kitten has gone; one charge; clean after
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   for(const [tag,file] of [['a',src],['b',base]]){const {g,tk}=await midRound(file,{seed,fps});g.run(TAP);const r={per:[],len:0};
    g.run("globalThis.__kd=null;{const e=pgpEnd;pgpEnd=function(){if(PGPX&&PGPX.id==='zoomies72'&&Z72X)__kd=Z72X.kits.every(k=>k.gone);return e.apply(this,arguments);};}");
    for(let i=0;i<Math.round(12*fps)&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();const s=J(g,"({p:PGPX?PGPX.t:-1,z:Z72X?Z72X.t:-1,per:PUSH_PERIOD})");if(s.p>=0)r.len=+s.p.toFixed(2);r.per.push(s.per);}
    r.kitsDone=g.run('typeof __kd!=="undefined"?__kd:null');r.normalAt=r.per.findIndex((x,i)=>i>fps*2&&x===r.per[0]);r.st=J(g,'Z72.stats');r.used=2-+g.run('pgpCount()');r.clean=g.run('!Z72X&&!PGPX');r.errs=J(g,'__errs').length;row[tag]=r;g.close();}
   const a=row.a,b=row.b,n=Math.min(a.per.length,b.per.length);
   const C={carried:JSON.stringify(a.st.carried)===JSON.stringify(b.st.carried),paid:JSON.stringify(a.st.paid)===JSON.stringify(b.st.paid),turboSame:JSON.stringify(a.per)===JSON.stringify(b.per.slice(0,a.per.length)),
    shorterBy:a.len<=b.len+.001&&a.len>=b.len-.62&&a.len>=8.23,kittensFinish:a.kitsDone===true,used:a.used===1,clean:a.clean,errs:!a.errs&&!b.errs};
   row.fails=Object.keys(C).filter(k=>!C[k]);if(row.fails.length)ok=false;rows.push({fps,seed,len:[a.len,b.len],kitsDone:[a.kitsDone,b.kitsDone],carried:a.st.carried,paid:a.st.paid,fails:row.fails});console.log(JSON.stringify(rows[rows.length-1]));}
  notes.play=rows;check('2 in play against UAT 99 (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on exactly the same frames; the power ends once both kittens have finished, up to 0.6 s (the shorter hold) before UAT 99, never before the 7 s turbo is over ('+rows.map(r=>r.len.join(' vs ')).join(', ')+' s); one charge; clean after; no frame errors',ok,rows);}
 // 3. on screen at 412x915 and 360x640: stills of the hang (start, middle, end) and of the base's leap at its top; the
 // close-up (from a quarter of the way up; its size with the tilt) stays within the screen
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;
   for(const [tag,file,store] of [['',src,{}],['-hang',src,{'catpusher.uat.cp72ending.v1':'hang'}]]){const {g,tk}=await midRound(file,{seed:7,w,h,pr:2,render:true,store});
    const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,`zoomies-${tag?'hang':'short'}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
    g.run(TAP);const row={sz,tag,shots:[],box:null,errs:0};const taken=new Set();
    for(let i=0;i<13*60&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();
     const k=J(g,"(()=>{const k=Z72X&&Z72X.kits[0];if(!k||!k.P||k.gone||k.P.seg!=='leap')return null;const P=k.P,g=skyScreen(P.x,P.z,0),p=skyScreen(P.x,P.z,P.h),s=g.s*Z72.size/48*(P.grow||1)*(1+.3*(P.puff||0));return {si:P.si,n:k.segs.length,u:P.u,x:p.x,y:p.y,s,h:P.h};})()");
     if(!k)continue;const hangSeg=k.n-2;
     if(!tag){if(k.si===hangSeg){const f=J(g,"(()=>{const P=Z72X.kits[0].P,p0=skyScreen(P.x,P.z,P.h),g=skyScreen(P.x,P.z,0),s=g.s*Z72.size/48*(P.grow||1);if(!P.face)return null;const q=cp72Face(p0,s,P.face,P.lean),c=46*q.s,cx=q.x+c*Math.sin(P.lean||0),cy=q.y-c*Math.cos(P.lean||0);const co=Math.cos(P.lean||0),si=Math.abs(Math.sin(P.lean||0));return {cx,cy,hw:q.s*(33.8*co+46*si),hh:q.s*(59*co+33.8*si),feet:q.y+10*q.s,face:P.face,H};})()");
       const bx=f&&f.face>=.25?{l:f.cx-f.hw,r:f.cx+f.hw,t:f.cy-f.hh,b:Math.min(f.cy+f.hh,f.feet)}:null;if(f)row.H=f.H;if(bx&&(!row.worst||bx.r>row.worst.r))row.worst={r:+bx.r.toFixed(1),u:+k.u.toFixed(2),f:{cx:+f.cx.toFixed(1),hw:+f.hw.toFixed(1)}};if(bx)row.box=row.box?{l:Math.min(row.box.l,bx.l),r:Math.max(row.box.r,bx.r),t:Math.min(row.box.t,bx.t),b:Math.max(row.box.b,bx.b)}:bx;
       for(const [n,u] of [['1-start',.08],['2-middle',.5],['3-end',.92]])if(!taken.has(n)&&k.u>=u){taken.add(n);shot(n);row.shots.push(n);}}}
     else if(k.si===hangSeg&&k.u>=.5&&!taken.has('middle')){taken.add('middle');shot('middle');row.shots.push('middle');}}
    row.errs=J(g,'__errs').length;if(row.box)for(const q in row.box)row.box[q]=+row.box[q].toFixed(1);rows.push(row);console.log(JSON.stringify(row));
    if(!tag&&!(row.shots.length===3&&row.box&&row.box.l>=0&&row.box.r<=400&&row.box.t>=0&&row.box.b<=row.H&&!row.errs))ok=false;g.close();}}
  notes.screen=rows;check('3 at 412x915 and 360x640: stills of the short close-up (start, middle, end), and of the Hang choice (middle); the close-up (from a quarter of the way up; its size with the tilt) stays within the screen; no frame errors',ok,rows);}
 // 4. the choice: default Short close-up ('crazy', held 0.4 s); a saved "hang" starts as UAT 96's hang; anything else saved
 // falls back to the default; choosing saves it on the phone (catpusher.uat.cp72ending.v1)
 {const r={};for(const [tag,store] of [['fresh',{}],['savedHang',{'catpusher.uat.cp72ending.v1':'hang'}],['savedShort',{'catpusher.uat.cp72ending.v1':'short'}],['junk',{'catpusher.uat.cp72ending.v1':'zzz'}]]){
   const g=(await midRound(src,{seed:1,secs:1,store})).g;r[tag]=J(g,"({pick:CP72E.get(),style:Z72.leapHang.style,faceHang:+Z72.leapHang.faceHang.toFixed(3)})");
   if(tag==='fresh'){g.run("CP72E.set('hang')");r.afterSet=J(g,"({pick:CP72E.get(),style:Z72.leapHang.style,saved:localStorage.getItem('catpusher.uat.cp72ending.v1')})");g.run("CP72E.set('nope')");r.afterBad=J(g,"CP72E.get()");}g.close();}
  notes.choice=r;check('4 "Zoomies ending": default Short close-up (style crazy, hang 0.85 s); a saved Hang starts as UAT 96\'s hang (still); junk falls back to Short; choosing saves it on the phone',
   r.fresh.pick==='short'&&r.fresh.style==='crazy'&&r.fresh.faceHang===.85&&r.savedHang.pick==='hang'&&r.savedHang.style==='still'&&r.savedShort.style==='crazy'&&r.junk.pick==='short'&&r.junk.style==='crazy'&&r.afterSet.style==='still'&&r.afterSet.saved==='hang'&&r.afterBad==='hang',r);}
 check('5 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks100-on101.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
