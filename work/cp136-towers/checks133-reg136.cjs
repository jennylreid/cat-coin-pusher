// UAT 136 regression copy of work/cp134-bundle/checks133-reg134.cjs (make-reg.py).
// UAT 134 regression copy of work/cp133-round/checks133.cjs (make-reg.py); test-only updates marked UAT 134.
// Next round blocks (#2 music, #4 white chest, #6 power buttons) on release.html (published UAT 132 + the three blocks),
// against the base (published UAT 132). Usage: node checks133.cjs [outDir]
// M1 the Orange's dance plays B (Wild mambo) even with A or C saved: slots, judging and sounds identical to the base with B
// M2 the Ragdoll's dance plays A (Music box) even with C saved: identical to the base with A
// M3 the Developer A/B/C row is gone: with Developer on, a tap where the row was is an ordinary dance tap
// M4 the Tuxedo's dance is identical to the base
// C1 (412x915, 360x640) during the Hug: no gold pusher and no dark back-rim line between the chin and the board; the face's white
// C2 (both sizes) during the Ragdoll's flops: the same; the CP-101 grey shoulders are not drawn
// C3 (both sizes) the chest never changes a pixel inside the board below its back edge (+2.5 units): coins, prizes, board
// C4 the Ragdoll's board with no Hug or dance, and the Tuxedo's dance, are pixel-identical to the base
// C5 the grey fallback: CP133C.mode='grey' brings back the CP-101 grey shoulders in the dance
// P1 Hug from the Tuxedo's board, the Orange's, the endless board and Home: switches to the Ragdoll's board, the Hug plays,
//    the power stock is unchanged; the endless board stays on
// P2 every power from the Tuxedo's board switches to its own cat and plays
// P3 a power on its own cat's board: no switch, the round goes on
// P4 side game buttons are unchanged (Treat toss from the Tuxedo's board starts there)
// 9 production and the UAT channel untouched
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const {loadImage,Path2D}=require(NAPI);
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp132-published/release.html');
const out=path.resolve(process.argv[2]||path.join(__dirname,'../../tickets/CP-93-evidence/uat136/regression/checks133'));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],res={};function check(n,b,info){(b?passed:failed).push(n);res[n]={pass:!!b,info};console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,800):''));}
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
// a whole dance, tapping every tap on time; returns the start, the judging and the sounds
async function dance(g){g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();
 const D0=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,music:WILD.dance.music||null,orange:!!WILD.dance.orange,ragdoll:!!WILD.dance.ragdoll})'));
 let j=0;while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&j++<4000){g.run('(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat,k=Math.round(x);if(Math.abs(x-k)<.02&&!D.judged[k]&&!(D.rest&&D.rest[k]))danceTap({timeStamp:performance.now()+D.latency*1000})})()');g.tick();}
 const end=JSON.parse(g.run('JSON.stringify(WILD.dance&&{hits:WILD.dance.hits,misses:WILD.dance.misses})'));return {D0,end,snd:JSON.parse(g.run('JSON.stringify(__snd)'))};}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function inPoly(P,x,y){let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const a=P[i],b=P[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)c=!c;}return c;}
(async()=>{
 // --- #2 music ---
 {const r={};for(const [n,f,store] of [['base B',base,{'catpusher.uat.cp94music.v1':'B'}],['new A',src,{'catpusher.uat.cp94music.v1':'A'}],['new C',src,{'catpusher.uat.cp94music.v1':'C'}]]){const g=await game(f,'level:orange',{store});r[n]=await dance(g);r[n].errs=g.errs().length;g.close();}
  check('M1 the Orange dances to B (Wild mambo) whatever was saved; identical to the base with B',r['new A'].D0.music==='B'&&r['new C'].D0.music==='B'&&same(r['base B'].D0,r['new A'].D0)&&same(r['base B'].end,r['new A'].end)&&same(r['base B'].snd,r['new A'].snd)&&same(r['new A'].snd,r['new C'].snd)&&!r['new A'].errs,
   {music:[r['base B'].D0.music,r['new A'].D0.music,r['new C'].D0.music],sounds:[r['base B'].snd.length,r['new A'].snd.length],hits:[r['base B'].end,r['new A'].end]});}
 {const r={};for(const [n,f,store] of [['base A',base,{'catpusher.uat.cp101music.v1':'A'}],['new C',src,{'catpusher.uat.cp101music.v1':'C'}]]){const g=await game(f,'level:ragdoll',{store});r[n]=await dance(g);r[n].errs=g.errs().length;g.close();}
  check('M2 the Ragdoll dances to A (Music box) whatever was saved; identical to the base with A',r['new C'].D0.music==='A'&&same(r['base A'].D0,r['new C'].D0)&&same(r['base A'].end,r['new C'].end)&&same(r['base A'].snd,r['new C'].snd)&&!r['new C'].errs,{music:[r['base A'].D0.music,r['new C'].D0.music],sounds:[r['base A'].snd.length,r['new C'].snd.length]});}
 {const r={};for(const cat of ['orange','ragdoll']){const g=await game(src,'level:'+cat,{dev:true});g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();
   let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<2.3&&j++<600)g.tick();const a=+g.run('(WILD.dance.hits|0)+(WILD.dance.misses|0)'),m0=g.run('WILD.dance.music');
   const sc=+g.run('scale'),Y=+g.run('DANCE_LANE_Y+60');g.pointer('pointerdown',271*sc,Y*sc);g.pointer('pointerup',271*sc,Y*sc);g.tick();
   r[cat]={before:a,after:+g.run('(WILD.dance.hits|0)+(WILD.dance.misses|0)'),music:[m0,g.run('WILD.dance.music')],row:g.run('cp102Music()===null'),errs:g.errs().length};g.close();}
  check('M3 the Developer A/B/C row is gone: a tap where it was is an ordinary dance tap; the music stays',Object.values(r).every(x=>x.row&&x.after>x.before&&x.music[0]===x.music[1]&&!x.errs),r);}
 {const r={};for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,'level:tuxedo');r[n]=await dance(g);g.close();}
  check("M4 the Tuxedo's dance is identical to the base",same(r.base,r.new),{snd:[r.base.snd.length,r.new.snd.length]});}
 // --- #4 the white chest (rendered) ---
 for(const [W,H] of [[412,915],[360,640]]){const sz=W+'x'+H,rows={};
  for(const what of ['hug','dance']){const fr={};for(const [n,f] of [['base',base],['new',src]]){const g=await game(f,'level:ragdoll',{render:true,W,H});const sc=+g.run('scale');
    if(what==='hug'){g.run("PG.powers.ragdoll=2;");for(let i=0;i<400&&!g.run('pgpReady()');i++)g.tick();g.run('pgpUse()');for(let i=0;i<180;i++)g.tick();}
    else{g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<3.08&&j++<2000)g.tick();}
    g.c.draw();const geo=JSON.parse(g.run("(()=>{const L=z74Layout(),r=z74RimPts(),P=[...r.left,...r.right.slice().reverse()];return JSON.stringify({chin:L.chin,top:Math.min(...P.map(p=>p.y)),P})})()"));
    const on=g.frame();let off=null;if(n==='new'){g.run("CP133C.mode='none'");off=g.frame();g.run("CP133C.mode='white'");g.png(`chest-${what}-${sz}.png`);}else g.png(`base-${what}-${sz}.png`);
    fr[n]={on,off,geo,sc,grey:n==='new'?+g.run('CP101B.frames'):null,chest:n==='new'?+g.run('CP133C.frames'):null,errs:g.errs().length};g.close();}
   // the gap: between the chin and the board's back edge, over the pusher's width
   const N=fr.new,B=fr.base,sc=N.sc,top=N.geo.top;let goldB=0,goldN=0,darkN=0,white=0,inside=0,all=0;
   const isGold=(d,i)=>d[i]>170&&d[i+1]>110&&d[i+1]<200&&d[i+2]<110,isDark=(d,i)=>d[i]<70&&d[i+1]<90&&d[i+2]<90;
   for(let py=0;py<N.on.height;py++)for(let px=0;px<N.on.width;px++){const x=px/sc,y=py/sc,i=(py*N.on.width+px)*4;
    if(x>125&&x<275&&y>N.geo.chin+(what==='hug'?2:-60)&&y<top+1.5){all++;if(isGold(B.on.data,i))goldB++;if(isGold(N.on.data,i))goldN++;if(y>top-4&&isDark(N.on.data,i))darkN++;if(Math.abs(N.on.data[i]-249)<4&&Math.abs(N.on.data[i+1]-244)<4&&Math.abs(N.on.data[i+2]-236)<4)white++;}
    if(y>top+2.6&&inPoly(N.geo.P,x,y)&&(N.on.data[i]!==N.off.data[i]||N.on.data[i+1]!==N.off.data[i+1]||N.on.data[i+2]!==N.off.data[i+2]))inside++;}
   rows[what]={goldBase:goldB,goldNew:goldN,darkNew:darkN,white,all,inside,grey:N.grey,chest:N.chest,errs:B.errs+N.errs};}
  check(`C1 ${sz}: during the Hug no gold pusher and no dark rim line between the chin and the board; the face's white`,rows.hug.goldBase>500&&rows.hug.goldNew===0&&rows.hug.darkNew===0&&rows.hug.white>rows.hug.all*.5&&!rows.hug.errs,rows.hug);
  check(`C2 ${sz}: (UAT 134) during the Ragdoll's flop no gold and no dark rim line under the head; the grey shoulders draw with the chest`,rows.dance.goldNew===0&&rows.dance.darkNew===0&&rows.dance.grey>0&& /* UAT 134 (item H): grey shoulders with the white chest */rows.dance.chest>0&&!rows.dance.errs,rows.dance);
  check(`C3 ${sz}: (UAT 134) during the Hug the chest never changes a pixel inside the board below its back edge`,rows.hug.inside===0 /* UAT 134: the dance's rim change by the grey shoulders is checks134 H1 */,{hug:rows.hug.inside,dance:rows.dance.inside});}
 {const fr={};for(const [n,f] of [['base',path.resolve(__dirname,'../cp134-mine/release.html')],['new',src]]){let g=await game(f,'level:ragdoll',{render:true}); /* UAT 134: vs this build without H and I */fr[n+'R']=g.frame();g.close();g=await game(f,'level:tuxedo',{render:true});g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();for(let i=0;i<90;i++)g.tick();fr[n+'T']=g.frame();g.close();}
  const eq=(a,b)=>{for(let i=0;i<a.data.length;i++)if(a.data[i]!==b.data[i])return false;return true;};
  check("C4 (UAT 134) the Ragdoll's board (no Hug, no dance) and the Tuxedo's dance are pixel-identical to this build without H and I",eq(fr.baseR,fr.newR)&&eq(fr.baseT,fr.newT));}
 {const g=await game(src,'level:ragdoll',{render:true});g.run("CP133C.mode='grey';WILD.dancePending={f:null,wait:9};");for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();for(let i=0;i<60;i++)g.tick();g.frame();
  check("C5 the grey fallback (CP133C.mode='grey') brings back the CP-101 grey shoulders in the dance",+g.run('CP101B.frames')>0&&+g.run('CP133C.frames')===0,{grey:+g.run('CP101B.frames'),white:+g.run('CP133C.frames')});g.close();}
 // --- #6 power buttons ---
 const pw=async(where,c)=>{const g=await game(src,where);const a=JSON.parse(g.run("JSON.stringify({cat:PGU.boardCat,end:typeof endActive==='function'&&endActive(),powers:PG.powers,left:WILD.left})"));const pid=g.run(`PGP['${c}'].id`);
  g.run(`cp102Start('power','${c}')`);let st=null;for(let i=0;i<900&&!st;i++){g.tick();const s=JSON.parse(g.run("JSON.stringify({px:PGPX&&(PGPX.power||PGPX.id),cat:PGU.boardCat,end:typeof endActive==='function'&&endActive(),powers:PG.powers,phase:WILD.phase})"));if(s.px&&String(s.px).startsWith(pid))st=s;}
  const r={a,st,errs:g.errs().length};g.close();return r;};
 {const r={};for(const w of ['level:tuxedo','level:orange','endless:tuxedo','home:tuxedo'])r[w]=await pw(w,'ragdoll');
  check("P1 Hug from the Tuxedo's, the Orange's, the endless board and Home: (UAT 134) the endless board with the Ragdoll, the Hug plays, stock unchanged",Object.entries(r).every(([w,x])=>x.st&&x.st.cat==='ragdoll'&&same(x.st.powers,x.a.powers)&&x.st.end /* UAT 134 (item I) */&&!x.errs),r);}
 {const r={};for(const c of ['tuxedo','orange','ragdoll','siamese','tortie'])r[c]=await pw('level:tuxedo',c);
  check("P2 every power from the Tuxedo's board switches to its own cat and plays",Object.entries(r).every(([c,x])=>x.st&&x.st.cat===c&&same(x.st.powers,x.a.powers)&&!x.errs),Object.fromEntries(Object.entries(r).map(([c,x])=>[c,x.st&&x.st.cat])));}
 {const g=await game(src,'endless:siamese');const l0=0; /* UAT 134: on its own cat's endless board */g.run("cp102Start('power','siamese')");let st=false;for(let i=0;i<600&&!st;i++){g.tick();st=g.run("!!(PGPX&&String(PGPX.power||PGPX.id).startsWith('sonic'))");}
  const s=JSON.parse(g.run("JSON.stringify({cat:PGU.boardCat,phase:WILD.phase,end:typeof endActive==='function'&&endActive()})"));check("P3 (UAT 134) a power on its own cat's endless board: no switch, the round goes on",st&&s.cat==='siamese'&&s.phase==='play'&&s.end&&!g.errs().length,{st,s,l0});g.close();}
 {const g=await game(src,'level:tuxedo');g.run("cp102Start('game','toss')");let st=false;for(let i=0;i<600&&!st;i++){g.tick();st=g.run('!!WILD.toss');}
  check("P4 (UAT 134) Treat toss from the Tuxedo's board starts on the endless board with the Orange",st&&g.run('PGU.boardCat')==='orange'&&g.run("typeof endActive==='function'&&endActive()"),{st,cat:g.run('PGU.boardCat')});g.close();}
 check('9 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks133-reg136.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedChecks:passed,failed,res},null,1));
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
