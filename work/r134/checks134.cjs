const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {loadImage,Path2D}=require(NAPI);
const src=path.resolve(process.env.SRC||path.join(__dirname,'release.html')),base=path.resolve(__dirname,'../cp133-published/release.html');
const out=path.resolve(process.argv[2]||path.join(__dirname,'../../tickets/CP-101-evidence/round134'));fs.mkdirSync(out,{recursive:true});let passed=[],failed=[],res={};function check(n,b,info){(b?passed:failed).push(n);res[n]={pass:!!b,info};console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
async function game(file,where,{render=false,W=412,H=915,store={},dev=false}={}){const [kind,cat]=where.split(':');
 const g=render?await make33({sourceFile:file,render:true,seed:7,pixelRatio:1,width:W,height:H,storage:{'catpusher.uat.devdefault.v1':'1',...store}})
  :await make({sourceFile:file,render:false,width:400,height:889,pixelRatio:1,seed:7,storage:{'catpusher.uat.devdefault.v1':'1',...store}});
 if(render)g.c.Path2D=Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale');g.tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();g.tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}PGU.boardCat='${cat}';PG.current='${cat}';PG.powers={tuxedo:2,orange:1,ragdoll:0,siamese:3,tortie:1};`+
  (kind==='endless'?`endStart();`:`pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`));
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<240;i++){if(i%30===0)g.tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;globalThis.__snd=[];for(const f of ['danceLoud','cp94Loud','dance']){const o=sfx[f];if(o)sfx[f]=function(k,v,d,a){__snd.push([f,k,+(+v).toFixed(3),+(+a||0).toFixed(2)]);return o.apply(this,arguments);};}");
 if(kind==='home'){g.run("if(WILD.on)wildExit();PGU.screen='main';");for(let i=0;i<30;i++)g.tick();}
 if(dev)g.run('S.dev=true;');
 if(render){for(const k2 of ['shoulder','left','right']){const u=g.run('CP74_ART.'+k2);g.c.__im=await loadImage(Buffer.from(u.split(',')[1],'base64'));g.run('Z74.img.'+k2+'=__im');}
  const cv=g.c.document.getElementById('cv');g.frame=()=>{g.c.draw();return cv.getContext('2d').getImageData(0,0,cv.width,cv.height);};g.png=f=>{g.c.draw();fs.writeFileSync(path.join(out,f),cv.toBuffer('image/png'));};}
 g.errs=()=>JSON.parse(g.run('JSON.stringify(__errs)'));return g;}

// ---- UAT 134 round, items H and I: change checks (run: node checks134.cjs [outDir]) ----
function edgeDist(P,x,y){let m=1e9;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[j],b=P[i],dx=b.x-a.x,dy=b.y-a.y,L=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((x-a.x)*dx+(y-a.y)*dy)/L));m=Math.min(m,Math.hypot(a.x+t*dx-x,a.y+t*dy-y));}return m;}
function inPoly(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const ST="JSON.stringify({screen:PGU.screen,cat:PGU.boardCat,cur:PG.current,wild:WILD.on,phase:WILD.phase,end:END.on,endA:endActive(),key:END.on?endKey():null,coins:S.coins,n:bodies.filter(b=>!b.dead).length,px:PGPX&&(PGPX.power||PGPX.id)||null,toss:!!WILD.toss,chase:!!WILD.chase,pet:!!WILD.petGame,pounce:!!WILD.pounce,dance:!!WILD.dance,powers:PG.powers,lvl:typeof pglActive==='function'&&pglActive()&&!END.on,err:typeof CP134S!=='undefined'?CP134S.err:null,cerr:CP102.err||null})";
const RUN={toss:'toss',chase:'chase',pet:'pet',pounce:'pounce'};
// one start-now button: where = endless:cat | home:cat | level:cat; returns before, the state when the start runs, and whether a countdown happened
async function btn(where,kind,id,pre){const g=await game(src,where);if(pre)g.run(pre);for(let i=0;i<3;i++)g.tick();const a=JSON.parse(g.run(ST));
 g.run(`cp102Start('${kind}','${id}')`);let st=null,count=false,lvl=false,k=0;const pid=kind==='power'?g.run(`PGP['${id}'].id`):null;
 for(;k<1500&&!st;k++){g.tick();const s=JSON.parse(g.run(ST));if(s.phase==='count')count=true;if(s.lvl)lvl=true;
  const on=kind==='power'?s.px&&String(s.px).startsWith(pid):kind==='game'?s[RUN[id]]:s.dance;if(on)st=s;}
 const r={a,st,count,lvl,ticks:k,errs:g.errs()};g.close();return r;}
const OWN={power:{tuxedo:'tuxedo',orange:'orange',ragdoll:'ragdoll',siamese:'siamese',tortie:'tortie'},game:{toss:'orange',chase:'siamese',pet:'ragdoll',pounce:'tortie'}};
const all=[...Object.keys(OWN.power).map(c=>['power',c]),...Object.keys(OWN.game).map(c=>['game',c])];
const ok=(r,cat)=>!!(r.st&&r.st.cat===cat&&r.st.cur===cat&&r.st.endA&&!r.lvl&&same(r.st.powers,r.a.powers)&&!r.errs.length&&!r.st.err&&!r.st.cerr);
const own=n=>OWN[n.split(':')[0]][n.split(':')[1]];
(async()=>{
 // --- I: start-now buttons ---
 {const r={};for(const [k,id] of all)r[k+':'+id]=await btn('endless:tuxedo',k,id,"S.coins=37;END.w.coins=37;");
  check('I1 from the endless board (Tuxedo): every power and side game runs on the same endless board with its own cat (no countdown, same board, wallet kept, power stock unchanged)',
   Object.entries(r).every(([n,x])=>ok(x,own(n))&&!x.count&&x.st.key===x.a.key&&x.st.coins===37),
   Object.fromEntries(Object.entries(r).map(([n,x])=>[n,x.st?{cat:x.st.cat,count:x.count,key:[x.a.key,x.st.key],coins:x.st.coins,errs:x.errs.length}:{none:true,errs:x.errs}])));}
 {const r={};for(const [k,id] of all)r[k+':'+id]=await btn('home:tuxedo',k,id);
  check('I2 from Home (Tuxedo): every power and side game starts the endless board with its own cat and runs',Object.entries(r).every(([n,x])=>ok(x,own(n))&&x.a.screen==='main'),
   Object.fromEntries(Object.entries(r).map(([n,x])=>[n,x.st?{from:x.a.screen,cat:x.st.cat,endA:x.st.endA,lvl:x.lvl}:{none:true,errs:x.errs}])));}
 {const r={};for(const [k,id] of [['power','ragdoll'],['game','toss'],['game','pounce'],['power','siamese']])r[k+':'+id]=await btn('level:tuxedo',k,id);
  check('I3 from a timed level (Tuxedo): the endless board with the own cat, never a timed level',Object.entries(r).every(([n,x])=>ok(x,own(n))&&!x.a.endA),
   Object.fromEntries(Object.entries(r).map(([n,x])=>[n,x.st?{cat:x.st.cat,endA:x.st.endA,lvl:x.lvl}:{none:true,errs:x.errs}])));}
 {const r={};r.hugFromOrange=await btn('endless:orange','power','ragdoll');r.petOnRagdoll=await btn('endless:ragdoll','game','pet');r.inspectFromSiamese=await btn('endless:siamese','power','tuxedo');
  check('I4 Hug from the Orange, Pet the cat on the Ragdoll (no switch needed), Inspect from the Siamese, all on the endless board',ok(r.hugFromOrange,'ragdoll')&&ok(r.petOnRagdoll,'ragdoll')&&ok(r.inspectFromSiamese,'tuxedo')&&!r.petOnRagdoll.count,
   Object.fromEntries(Object.entries(r).map(([n,x])=>[n,x.st&&{cat:x.st.cat,endA:x.st.endA}])));}
 {const busy=await btn('endless:tuxedo','power','ragdoll',"PG.powers.tuxedo=(PG.powers.tuxedo|0)+1;pgpUse();");
  check("I5 tapped while another power runs (the Tuxedo's Inspect): waits for it to end, then switches to the Ragdoll and plays the Hug",!!busy.a.px&&ok(busy,'ragdoll'),{before:busy.a.px,at:busy.st&&busy.st.cat,ticks:busy.ticks});}
 {const r={};r.endOrange=await btn('endless:orange','dance','');r.homeRagdoll=await btn('home:ragdoll','dance','');r.levelTuxedo=await btn('level:tuxedo','dance','');
  const g=await game(src,'endless:siamese');g.run("cp102Start('dance','')");for(let i=0;i<200;i++)g.tick();const sia=JSON.parse(g.run(ST));g.close();
  check('I6 Start Dance break now: the cat in play, on the endless board (Orange there; from Home the Ragdoll; from a level the Tuxedo); the Siamese (no dance) gets the note and nothing starts',
   ok(r.endOrange,'orange')&&ok(r.homeRagdoll,'ragdoll')&&ok(r.levelTuxedo,'tuxedo')&&!sia.dance&&sia.cat==='siamese',{o:r.endOrange.st&&r.endOrange.st.cat,h:r.homeRagdoll.st&&r.homeRagdoll.st.cat,l:r.levelTuxedo.st&&r.levelTuxedo.st.cat,siameseDance:sia.dance});}
 // UAT 132 (grey shoulders on vs CP101B.off) at the same frame, from rim132.cjs: rim-edge pixels changed and their largest change
 const RIM132={'412x915':[98,36],'360x640':[81,121]};
 // --- H: the Dance break's grey shoulders + white chest (rendered, both sizes) ---
 for(const [W,H] of [[412,915],[360,640]]){const sz=W+'x'+H,fr={};
  for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,'level:ragdoll',{render:true,W,H});g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();
   let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<3.08&&j++<2000)g.tick();
   const geo=JSON.parse(g.run("(g=>{g();const r=z74RimPts(),P=[...r.left,...r.right];return JSON.stringify({top:Math.min(...P.map(p=>p.y)),poly:[...r.left,...r.right.slice().reverse()]})})(draw)")),sc=+g.run('scale*renderPixelRatio');
   fr[n]={img:g.frame(),geo,sc,grey:+g.run('CP101B.frames'),white:+g.run('CP133C.frames'),errs:g.errs().length};g.close();}
  const A=fr.base.img,B=fr.new.img,S0=fr.base.sc,poly=fr.base.geo.poly;let inB=0,outB=0,edge=0,edgeMax=0,bb=[1e9,1e9,0,0];
  for(let y=0;y<A.height;y++)for(let x=0;x<A.width;x++){const i=(y*A.width+x)*4;if(Math.abs(A.data[i]-B.data[i])+Math.abs(A.data[i+1]-B.data[i+1])+Math.abs(A.data[i+2]-B.data[i+2])>12){
   const dd=Math.abs(A.data[i]-B.data[i])+Math.abs(A.data[i+1]-B.data[i+1])+Math.abs(A.data[i+2]-B.data[i+2]);if(inPoly(poly,x/S0,y/S0)&&y/S0>fr.base.geo.top+3&&edgeDist(poly,x/S0,y/S0)<=4){edge++;edgeMax=Math.max(edgeMax,dd);}else if(inPoly(poly,x/S0,y/S0)&&y/S0>fr.base.geo.top+3){inB++;bb=[Math.min(bb[0],x/S0|0),Math.min(bb[1],y/S0|0),Math.max(bb[2],x/S0|0),Math.max(bb[3],y/S0|0)];}else outB++;}}
  check(`H1 ${sz} Ragdoll Dance break: grey shoulders and the white chest both draw (the grey shows beside the chest); no pixel on the board changes; the rim line along the board's sides changes exactly as UAT 132's grey shoulders changed it (CP-101 body redraws the rim; logs/rim132.log)`,fr.new.grey>0&&fr.new.white>0&&fr.base.grey===0&&outB>200&&inB===0&&same([edge,edgeMax],RIM132[sz])&&!fr.new.errs,{grey:[fr.base.grey,fr.new.grey],white:[fr.base.white,fr.new.white],changedOffBoard:outB,changedOnBoard:inB,rimEdgePixels:edge,rimEdgeMaxDelta:edgeMax,bbox:inB?bb:null});}
 {const r={};for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,'level:ragdoll',{render:true});g.run("PG.powers.ragdoll=2;");for(let i=0;i<400&&!g.run('pgpReady()');i++)g.tick();g.run('pgpUse()');
   for(let i=0;i<120;i++)g.tick();r[n]={img:g.frame(),grey:+g.run('CP101B.frames'),px:g.run('PGPX&&PGPX.id'),errs:g.errs().length};g.close();}
  let d=0;const A=r.base.img.data,B=r.new.img.data;for(let i=0;i<A.length;i+=4)if(A[i]!==B[i]||A[i+1]!==B[i+1]||A[i+2]!==B[i+2])d++;
  check('H2 the Hug is unchanged (white chest only, pixel-identical to UAT 133)',d===0&&r.new.grey===0&&r.new.px==='hug'&&!r.new.errs,{diff:d,grey:r.new.grey,px:r.new.px});}
 {const g=await game(src,'level:ragdoll');g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();const o={};for(const m of ['white','grey','none'])o[m]=JSON.parse(g.run(`(CP133C.mode='${m}',JSON.stringify([cp101BodyOn(),rchestDanceOn()]))`));g.close();
  check("H3 in a Ragdoll dance: mode 'white' (default) = shoulders + chest; 'grey' = shoulders only; 'none' = neither",same(o.white,[true,true])&&same(o.grey,[true,false])&&same(o.none,[false,false]),o);}
 check('X production and UAT JSON untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks134.json'),JSON.stringify({passed,failed,res},null,1));console.log(passed.length+'/'+(passed.length+failed.length)+' pass');
})().catch(e=>{console.error(e);process.exit(1);});
