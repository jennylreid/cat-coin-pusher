// UAT 102 checks (CP-72 peek-a-boo ending; Jenny Nov 18: "keep this small jump, but before leaving the screen, pause at the
// edge of the screen with just the eyes showing, just for a moment." / "go with the peekaboo ending also."): a third
// "Zoomies ending" choice Peek-a-boo, the default. Usage: node checks102.cjs (release.html on the base in release-version.json);
// DEV=1 node checks102.cjs (release-dev.html on published UAT 100; preparation only)
// -> tickets/CP-72-evidence/uat102[-dev]/checks102-on104.json + stills peek-*.png
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../cp102/edits.json'),'utf8')).base,out=path.resolve(__dirname,'../../tickets/CP-83-evidence/uat104'+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
const BASEPIN=DEV?'57f3dad50eb6ef644183f27db5056bda96a3ac9f395e8a4249d3edf14c0d4618':V.baseSHA256;
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
const K1='catpusher.uat.cp72ending.v1',K2='catpusher.uat.cp72ending.v2';
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
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp103/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='8d9eee781044fceded19dd719a119cc3ae4c8ee498e8d667116705fe699beba6')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published cp103 + build name + the CP-83 block replaced by the round-2 block (everything else unchanged)',S===B&&m.length===1);}
 // 1. paths against the base: Peek-a-boo = the base's "Hang" (UAT 96's) up to the end of the hang, then drop / peek / duck
 // (fully hidden on the table: the peek is drawn over the screen); Short close-up and Hang identical to the base's; cream kitten identical
 {const P=st=>`(()=>{${st}const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const L=[];for(let u=0;u<=k.len+.001;u+=1/60)L.push(z72KitPos(k,u));out.push({len:k.len,segs:k.segs.map(s=>s.k+':'+s.d.toFixed(4)),pos:L});}return out;})()`;
  const g=(await midRound(src,{seed:3})).g;const a=J(g,P('')),aShort=J(g,P("CP72E.set('short');")),aHang=J(g,P("CP72E.set('hang');"));g.close();
  const g2=(await midRound(base,{seed:3})).g;const bShort=J(g2,P("CP72E.set('short');")),bHang=J(g2,P("CP72E.set('hang');"));g2.close();
  const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);const r={short:same(aShort,bShort),hang:same(aHang,bHang),cream:same(a[1],bHang[1]),paths:[]};
  for(const n of [0,2,3]){const A=a[n],B=bHang[n],last=B.segs.length-1,T0=B.pos.findIndex(p=>p.si===last);
   const row={upToHangEnd:same(A.pos.slice(0,T0),B.pos.slice(0,T0)),segsBefore:same(A.segs.slice(0,last),B.segs.slice(0,last)),peekSegs:A.segs.slice(last)};
   const H=A.pos.filter(p=>p.si===last-1);row.hang={s:+(H.length/60).toFixed(2),puff:H.every(p=>p.puff===1),tilt:H.every(p=>!p.lean),grow:+Math.max(...H.map(p=>p.grow)).toFixed(3)};
   const K=A.pos.filter(p=>p.pk);row.hidden=K.every(p=>p.fade===0);row.peekS={drop:+(K.filter(p=>p.pk==='drop').length/60).toFixed(2),hold:+(K.filter(p=>p.pk==='hold').length/60).toFixed(2),duck:+(K.filter(p=>p.pk==='duck').length/60).toFixed(2)};
   row.longer=+(A.len-B.len).toFixed(3);r.paths.push(row);}
  notes.paths=r;console.log(JSON.stringify(r));const p0=r.paths[0];
  check('1 Peek-a-boo: the ginger kitten\'s path is the Hang (UAT 96) one up to the end of its hang ('+p0.hang.s+' s, puffed, not tilted, '+p0.hang.grow+'x), then it drops to the screen edge ('+p0.peekS.drop+' s), peeks ('+p0.peekS.hold+' s) and ducks away ('+p0.peekS.duck+' s); the cream kitten unchanged; Short close-up and Hang identical to the base\'s',
   r.short&&r.hang&&r.cream&&r.paths.every(p=>p.upToHangEnd&&p.segsBefore&&p.hang.puff&&p.hang.tilt&&p.hidden&&Math.abs(p.peekS.hold-.5)<=.02&&Math.abs(p.peekS.drop-.24)<=.02&&Math.abs(p.peekS.duck-.14)<=.02),r);}
 // 2. in play against the base's Hang (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on the
 // same frames; the power ends once both kittens have finished, about 0.73 s later (the peek instead of the 0.15 s shrink away)
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   for(const [tag,file,store] of [['a',src,{}],['b',base,{[K1]:'hang'}]]){const {g,tk}=await midRound(file,{seed,fps,store});g.run(TAP);const r={per:[],len:0};
    for(let i=0;i<Math.round(13*fps)&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();const s=J(g,"({p:PGPX?PGPX.t:-1,per:PUSH_PERIOD})");if(s.p>=0)r.len=+s.p.toFixed(2);r.per.push(s.per);}
    r.st=J(g,'Z72.stats');r.used=2-+g.run('pgpCount()');r.clean=g.run('!Z72X&&!PGPX');r.errs=J(g,'__errs').length;r.style=g.run('Z72.leapHang.style');row[tag]=r;g.close();}
   const a=row.a,b=row.b;const C={styles:a.style==='peek'&&b.style==='still',carried:JSON.stringify(a.st.carried)===JSON.stringify(b.st.carried),paid:JSON.stringify(a.st.paid)===JSON.stringify(b.st.paid),
    turboSame:JSON.stringify(a.per.slice(0,b.per.length))===JSON.stringify(b.per),later:a.len>=b.len-.02&&a.len<=b.len+.8,used:a.used===1,clean:a.clean,errs:!a.errs&&!b.errs};
   const fails=Object.keys(C).filter(k=>!C[k]);if(fails.length)ok=false;rows.push({fps,seed,len:[a.len,b.len],carried:a.st.carried,paid:a.st.paid,fails});console.log(JSON.stringify(rows[rows.length-1]));}
  notes.play=rows;check('2 in play against the base\'s Hang (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on the same frames; the power ends once the peek is over ('+rows.map(r=>r.len.join(' vs ')).join(', ')+' s); one charge; clean after; no frame errors',ok,rows);}
 // 3. on screen at 412x915 and 360x640: during the peek the kitten's eyes are on screen just above the bottom edge and the
 // rest of it below (only the top of its head and eyes show); after ducking it is fully out of sight; stills of each beat
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;const {g,tk}=await midRound(src,{seed:7,w,h,pr:2,render:true});
   const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,`peek-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
   g.run(TAP);const row={sz,shots:[],peek:null,duckEnd:null};const taken=new Set();
   for(let i=0;i<14*60&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();
    const k=J(g,"(()=>{const k=Z72X&&Z72X.kits[0];if(!k||!k.P||k.gone)return null;const P=k.P;const g=skyScreen(P.x,P.z,0),p0=skyScreen(P.x,P.z,P.h),s=g.s*Z72.size/48*(P.grow||1),bottom=ctx.canvas.height/(scale*renderPixelRatio),at=bottom+(33-CP72P.eyes)*s,y=P.pk==='duck'?at+P.pu*P.pu*40*s:at;return {pk:P.pk||null,pu:P.u,si:P.si,n:k.segs.length,x:p0.x,s,bottom,feet:y,eyeTop:y-(33+6.6)*s,eyeBot:y-(33-6.6)*s,earTop:y-54*s,headW:17*s};})()");
    if(!k)continue;
    if(k.si===k.n-4&&k.pu>=.5&&!taken.has('1-hang')){taken.add('1-hang');shot('1-hang');row.shots.push('1-hang');}
    for(const [n,pk] of [['2-drop','drop'],['3-peek','hold'],['4-duck','duck']])if(k.pk===pk&&k.pu>=.5&&!taken.has(n)){taken.add(n);shot(n);row.shots.push(n);}
    if(k.pk==='hold'&&!row.peek)row.peek={eyeTop:+k.eyeTop.toFixed(1),eyeBot:+k.eyeBot.toFixed(1),earTop:+k.earTop.toFixed(1),bottom:+k.bottom.toFixed(1),x:+k.x.toFixed(1),headW:+k.headW.toFixed(1)};
    if(k.pk==='duck')row.duckEnd={earTop:+k.earTop.toFixed(1),bottom:+k.bottom.toFixed(1)};}
   row.errs=J(g,'__errs').length;g.close();rows.push(row);console.log(JSON.stringify(row));const q=row.peek;
   if(!(row.shots.length===4&&q&&q.eyeTop>q.bottom-q.headW*1.6&&q.eyeBot<=q.bottom+.5&&q.eyeTop<q.bottom&&q.x-q.headW>=0&&q.x+q.headW<=400&&row.duckEnd&&row.duckEnd.earTop>row.duckEnd.bottom&&!row.errs))ok=false;}
  notes.screen=rows;check('3 at 412x915 and 360x640: during the peek the eyes sit just above the bottom edge with only the top of the head above them, inside the screen width; after ducking the kitten is out of sight; stills of the hang, drop, peek and duck; no frame errors',ok,rows);}
 // 4. the choice: Peek-a-boo is the default on every phone (new key v2: an earlier pick saved under v1 is not carried over);
 // a saved Short close-up / Hang still applies; junk falls back to Peek-a-boo; choosing saves it
 {const r={};for(const [tag,store] of [['fresh',{}],['oldV1Hang',{[K1]:'hang'}],['savedShort',{[K2]:'short'}],['savedHang',{[K2]:'hang'}],['junk',{[K2]:'zzz'}]]){
   const g=(await midRound(src,{seed:1,secs:1,store})).g;r[tag]=J(g,"({pick:CP72E.get(),style:Z72.leapHang.style,choices:CP72E.CHOICES.map(k=>CP72E.NAMES[k])})");
   if(tag==='fresh'){g.run("CP72E.set('short')");r.afterSet=J(g,`({style:Z72.leapHang.style,saved:localStorage.getItem('${K2}')})`);g.run("CP72E.set('peek')");r.backPeek=J(g,`({style:Z72.leapHang.style,saved:localStorage.getItem('${K2}')})`);}g.close();}
  notes.choice=r;check('4 "Zoomies ending" = Peek-a-boo / Short close-up / Hang; Peek-a-boo is the default (also for a phone that saved a pick in UAT 100); saved Short / Hang apply; junk falls back to Peek-a-boo; choosing saves it',
   r.fresh.pick==='peek'&&r.fresh.style==='peek'&&r.fresh.choices.join('|')==='Peek-a-boo|Short close-up|Hang'&&r.oldV1Hang.style==='peek'&&r.savedShort.style==='crazy'&&r.savedHang.style==='still'&&r.junk.style==='peek'&&r.afterSet.style==='crazy'&&r.afterSet.saved==='short'&&r.backPeek.style==='peek'&&r.backPeek.saved==='peek',r);}
 // 6. the side guard (Jenny: "nudge prizes only while they're sliding toward a side; resting edge prizes stay put."):
 // (a) Level 7 "Edge of the table": in the first 2 s of Zoomies the edge prizes stay put (base UAT 100: they slide 40-70 inward);
 // (b) every level x 2 seeds: prizes lost over a side during Zoomies, this build vs the base (should stay 0, as in the base)
 {const lvRun=async(file,level,seed,store)=>{const {g}=await midRound(file,{seed,level,store});
   const items=()=>J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return {id:b.id,x:q.x/M,gap:tableHalfAt(Math.min(T.FRONT,q.z/M))-z72R(b)*1.1-Math.abs(q.x/M-200)};})");
   g.run("globalThis.__side=[];{const f=fallOff;fallOff=function(b,...a){if(Z72X&&!b.dead&&b.kind==='item'){const q=b.rb.translation();if(Math.abs(q.x/M-200)>(T.R-T.L)/2-2&&q.z/M<T.FRONT-4)__side.push(b.id);}return f.call(this,b,...a);};}");
   const A=items();g.run(TAP);for(let i=0;i<Math.round((1.25+2)*60);i++)g.tick();const B=items();for(let i=0;i<10*60&&g.run('!!PGPX');i++)g.tick();
   const edge=A.filter(a=>a.gap<0).map(a=>{const b=B.find(x=>x.id===a.id);return b?Math.abs(b.x-a.x):null;});
   const r={side:J(g,'__side'),edgeN:edge.length,edgeMove:edge.filter(x=>x!=null).map(x=>+x.toFixed(1)),errs:J(g,'__errs').length};g.close();return r;};
  const N=+(await (async()=>{const {g}=await midRound(src,{seed:1,secs:0});const n=g.run('PGL_N');g.close();return n;})());
  const r={level7:{},levels:[]};let ok=true;
  for(const seed of [1,2]){r.level7['seed'+seed]={new:await lvRun(src,7,seed,{}),base:await lvRun(base,7,seed,{[K1]:'hang'})};const q=r.level7['seed'+seed];
   if(!(q.new.edgeN>=4&&q.new.edgeMove.every(d=>d<10)&&q.base.edgeMove.some(d=>d>30)))ok=false;}
  for(let lv=1;lv<=N;lv++)for(const seed of [1,2]){const a=await lvRun(src,lv,seed,{}),b=await lvRun(base,lv,seed,{[K1]:'hang'});
   r.levels.push({lv,seed,sideNew:a.side.length,sideBase:b.side.length,errs:a.errs+b.errs});if(a.side.length>b.side.length||a.errs)ok=false;console.error('level',lv,seed,a.side.length,b.side.length);}
  notes.sideGuard=r;console.log(JSON.stringify(r.level7));
  check('6 side guard: on Level 7 the edge prizes stay put in the first 2 s of Zoomies ('+Object.values(r.level7).map(q=>'moved '+q.new.edgeMove.join('/')+' vs base '+q.base.edgeMove.join('/')).join('; ')+'); on all '+N+' levels x 2 seeds no more prizes go over a side during Zoomies than in UAT 100 (this build '+r.levels.reduce((a,x)=>a+x.sideNew,0)+', UAT 100 '+r.levels.reduce((a,x)=>a+x.sideBase,0)+'); no frame errors',ok,r);}
 check('5 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks102-on104.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
