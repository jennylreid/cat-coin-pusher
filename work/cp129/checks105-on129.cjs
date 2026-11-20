// UAT 105 checks (CP-72 Zoomies ending, final; Jenny Nov 18: "only peek-a-boo. Kitten stays small: the puffed one hangs back
// and peeks at normal size (at most a little bigger), no blow-up and no screen-sized cat. Remove the other ending choices.")
// + Zoomies sound choice removed + the stale "UAT 62" label. Usage: node checks105.cjs | DEV=1 node checks105.cjs (on UAT 103)
// -> tickets/CP-96-evidence/uat105[-dev]/checks105-on129.json + stills peek-*.png
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../cp105/edits.json'),'utf8')).base,out=path.resolve(__dirname,'../../tickets/CP-96-evidence/uat129'+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
const BASEPIN=DEV?'8d9eee781044fceded19dd719a119cc3ae4c8ee498e8d667116705fe699beba6':V.baseSHA256;
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
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp128/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='88297acc70af24ddfb24ac541dbec4285226517280fb98b9e477d16eeac3c645')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}{const O=fs.readFileSync(path.resolve(__dirname,'../cp124/cp96-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');if(B.split(O).length!==2)m=[];B=B.split(O).join(N);}
  check('0 the build is published 2026.11.19 UAT 128 + build name + the Daily puzzles block with the Sleepy Coins pupils fix (everything else unchanged)',S===B&&m.length===1);}
 // 1. paths against the base (Peek-a-boo, UAT 102-104): the cream kitten identical; the ginger kitten identical up to its last
 // leap; in that leap it grows at most a little (no 1.5x blow-up), stays puffed, hangs 0.6 s (was 1 s), then drop / peek / duck as before
 {const P=st=>`(()=>{${st}const out=[];for(const [id,x0] of [[0,null],[1,null],[0,330],[0,90]]){const k={id,coat:Z72.coats[id]};z72Path(k,x0==null?null:{x:x0,z:T.FRONT-120});const L=[];for(let u=0;u<=k.len+.001;u+=1/60)L.push(z72KitPos(k,u));out.push({len:k.len,segs:k.segs.map(s=>s.k+':'+s.d.toFixed(4)),pos:L});}return out;})()`;
  const g=(await midRound(src,{seed:3})).g;const a=J(g,P('')),tried=J(g,P("CP72E.set('hang');CP72E.set('short');"));const style=g.run('Z72.leapHang.style');g.close();
  const g2=(await midRound(base,{seed:3})).g;const b=J(g2,P(''));g2.close();
  const same=(x,y)=>JSON.stringify(x)===JSON.stringify(y);const r={onlyPeek:same(tried,a)&&style==='peek',cream:same(a[1],b[1]),paths:[]};
  for(const n of [0,2,3]){const A=a[n],B=b[n],L0=B.segs.findIndex(s=>s.startsWith('leap')),T0=B.pos.findIndex(p=>p.si===L0);
   const row={before:same(A.pos.slice(0,T0),B.pos.slice(0,T0)),segsBefore:same(A.segs.slice(0,L0),B.segs.slice(0,L0)),leaps:A.segs.slice(L0)};
   const LP=A.pos.filter(p=>p.si>=L0),Lb=B.pos.filter(p=>p.si>=L0);row.maxGrow=+Math.max(...LP.map(p=>p.grow||1)).toFixed(3);row.baseMaxGrow=+Math.max(...Lb.map(p=>p.grow||1)).toFixed(3);
   const H=A.pos.filter(p=>p.si===L0+1);row.hangS=+(H.length/60).toFixed(2);row.puffed=H.every(p=>p.puff===1);row.noTilt=H.every(p=>!p.lean);
   const K=A.pos.filter(p=>p.pk);row.peekS=[+(K.filter(p=>p.pk==='drop').length/60).toFixed(2),+(K.filter(p=>p.pk==='hold').length/60).toFixed(2),+(K.filter(p=>p.pk==='duck').length/60).toFixed(2)];
   row.shorter=+(B.len-A.len).toFixed(3);r.paths.push(row);}
  notes.paths=r;console.log(JSON.stringify(r));const p0=r.paths[0];
  check('1 only Peek-a-boo (other endings can\'t be chosen); the cream kitten unchanged; the ginger kitten as before up to its last leap, where it now grows at most '+p0.maxGrow+'x (UAT 104: '+p0.baseMaxGrow+'x), stays puffed, hangs '+p0.hangS+' s (was 1 s), then drops, peeks '+p0.peekS[1]+' s and ducks as before',
   r.onlyPeek&&r.cream&&r.paths.every(p=>p.before&&p.segsBefore&&p.maxGrow<=1.25&&p.baseMaxGrow>2&&Math.abs(p.hangS-.6)<=.02&&p.puffed&&p.noTilt&&Math.abs(p.peekS[1]-.5)<=.02&&Math.abs(p.shorter-.4)<=.02),r);}
 // 2. in play against the base (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on the same
 // frames; Zoomies ends about 0.4 s sooner (the shorter hang); one charge; clean after
 {const rows=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const row={fps,seed};
   for(const [tag,file] of [['a',src],['b',base]]){const {g,tk}=await midRound(file,{seed,fps});g.run(TAP);const r={per:[],len:0};
    for(let i=0;i<Math.round(13*fps)&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();const s=J(g,"({p:PGPX?PGPX.t:-1,per:PUSH_PERIOD})");if(s.p>=0)r.len=+s.p.toFixed(2);r.per.push(s.per);}
    r.st=J(g,'Z72.stats');r.used=2-+g.run('pgpCount()');r.clean=g.run('!Z72X&&!PGPX');r.errs=J(g,'__errs').length;row[tag]=r;g.close();}
   const a=row.a,b=row.b;const C={carried:JSON.stringify(a.st.carried)===JSON.stringify(b.st.carried),paid:JSON.stringify(a.st.paid)===JSON.stringify(b.st.paid),
    turboSame:JSON.stringify(a.per)===JSON.stringify(b.per.slice(0,a.per.length)),sooner:a.len<=b.len+.001&&a.len>=b.len-.45,used:a.used===1,clean:a.clean,errs:!a.errs&&!b.errs};
   const fails=Object.keys(C).filter(k=>!C[k]);if(fails.length)ok=false;rows.push({fps,seed,len:[a.len,b.len],carried:a.st.carried,paid:a.st.paid,fails});console.log(JSON.stringify(rows[rows.length-1]));}
  notes.play=rows;check('2 in play against the base (2 seeds x 60/30 fps): the same pieces shoved and paid; the pusher at double speed on the same frames; Zoomies ends a little sooner ('+rows.map(r=>r.len.join(' vs ')).join(', ')+' s); one charge; clean after; no frame errors',ok,rows);}
 // 3. on screen at 412x915 and 360x640: the hanging kitten stays small (at most about a fifth of the screen width, puff included);
 // the peek is at CP72S.peek x its board size, eyes just above the bottom edge; after ducking it is out of sight; stills
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){const sz=w+'x'+h;const {g,tk}=await midRound(src,{seed:7,w,h,pr:2,render:true});
   const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,`peek-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
   g.run(TAP);const row={sz,shots:[],hangW:0,peek:null,duckEnd:null};const taken=new Set();
   for(let i=0;i<14*60&&g.run('!!(PGPX&&PGPX.id==="zoomies72")');i++){tk();
    const k=J(g,"(()=>{const k=Z72X&&Z72X.kits[0];if(!k||!k.P||k.gone)return null;const P=k.P;const g=skyScreen(P.x,P.z,0),base=g.s*Z72.size/48,sP=base*CP72S.peek,bottom=ctx.canvas.height/(scale*renderPixelRatio),at=bottom+(33-CP72P.eyes)*sP,y=P.pk==='duck'?at+P.pu*P.pu*40*sP:at;return {pk:P.pk||null,pu:P.u,si:P.si,n:k.segs.length,w:P.pk?0:34*base*(P.grow||1)*(1+.3*(P.puff||0)),ratio:sP/base,bottom,eyeTop:y-(33+6.6)*sP,eyeBot:y-(33-6.6)*sP,earTop:y-54*sP};})()");
    if(!k)continue;if(k.si>=k.n-5)row.hangW=Math.max(row.hangW,+k.w.toFixed(1));
    if(k.si===k.n-4&&k.pu>=.5&&!taken.has('1-hang')){taken.add('1-hang');shot('1-hang');row.shots.push('1-hang');}
    for(const [n,pk] of [['2-drop','drop'],['3-peek','hold'],['4-duck','duck']])if(k.pk===pk&&k.pu>=.5&&!taken.has(n)){taken.add(n);shot(n);row.shots.push(n);}
    if(k.pk==='hold'&&!row.peek)row.peek={eyeTop:+k.eyeTop.toFixed(1),eyeBot:+k.eyeBot.toFixed(1),bottom:+k.bottom.toFixed(1),ratio:+k.ratio.toFixed(2)};
    if(k.pk==='duck')row.duckEnd={earTop:+k.earTop.toFixed(1),bottom:+k.bottom.toFixed(1)};}
   row.errs=J(g,'__errs').length;g.close();rows.push(row);console.log(JSON.stringify(row));const q=row.peek;
   if(!(row.shots.length===4&&row.hangW>0&&row.hangW<=82&&q&&q.ratio<=1.2&&q.eyeTop<q.bottom&&q.eyeBot<=q.bottom+.5&&row.duckEnd&&row.duckEnd.earTop>row.duckEnd.bottom&&!row.errs))ok=false;}
  notes.screen=rows;check('3 at 412x915 and 360x640: the hanging kitten stays small (widest '+rows.map(r=>r.hangW).join(' / ')+' of 400 units, puff included); the peek at '+(rows[0].peek&&rows[0].peek.ratio)+'x its board size with its eyes just above the bottom edge; out of sight after ducking; stills; no frame errors',ok,rows);}
 // 4. the choices are gone: a phone that saved Hang / Short close-up or a P1-P3 sound gets Peek-a-boo and today's sound
 // (Zoomies plays no P1-P3 bed); Level 7's edge prizes still stay put (UAT 102's side guard)
 {const r={};const {g,tk}=await midRound(src,{seed:1,store:{'catpusher.uat.cp72ending.v2':'hang','catpusher.uat.cp72zsound.v1':'P2'}});
  r.pick=J(g,"({ending:CP72E.get(),style:Z72.leapHang.style,sound:CP72Z.get(),endingChoices:CP72E.CHOICES,soundChoices:CP72Z.CHOICES})");g.run(TAP);
  for(let i=0;i<11*60&&g.run('!!PGPX');i++)tk();r.played=J(g,'CP72Z.stats.played');r.errs=J(g,'__errs').length;g.close();
  const g7=(await midRound(src,{seed:1,level:7})).g;const items=()=>J(g7,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return {id:b.id,x:q.x/M,gap:tableHalfAt(Math.min(T.FRONT,q.z/M))-z72R(b)*1.1-Math.abs(q.x/M-200)};})");
  const A=items();g7.run(TAP);for(let i=0;i<Math.round(3.25*60);i++)g7.tick();const B=items();g7.close();
  r.level7=A.filter(a=>a.gap<0).map(a=>{const b=B.find(x=>x.id===a.id);return b?+Math.abs(b.x-a.x).toFixed(1):null;}).filter(x=>x!=null);
  notes.choices=r;check('4 the ending and sound choices are gone: saved Hang + P2 still give Peek-a-boo and today\'s sound (no P1-P3 played); Level 7 edge prizes stay put (moved '+r.level7.join('/')+')',
   r.pick.ending==='peek'&&r.pick.style==='peek'&&r.pick.sound==='today'&&r.pick.endingChoices.join()==='peek'&&r.pick.soundChoices.join()==='today'&&!Object.keys(r.played).length&&!r.errs&&r.level7.length>=4&&r.level7.every(d=>d<10),r);}
 check('5 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks105-on129.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
