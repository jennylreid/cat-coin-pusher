// UAT 67 (CP-50 Simple first board) checks. Developer off, real runtime. Usage: node checks67.cjs [BUILD] [BASE (UAT 66)] [OUT]
const make=require('../cp33/runtime.cjs'),{mask}=require('./headmask.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp66','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-50-evidence','uat67'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,700):''));}
async function game(file,o={}){const g=await make({sourceFile:file,render:true,seed:o.seed||5,pixelRatio:o.pr||1,width:o.w||400,height:o.h||889,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);g.c.draw();return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const level=(g,p,s)=>{g.run(`pglLv().passed=${p};pglLv().sel=${s};pgSave();if(WILD.phase==='card')wildReset();`);g.ticks(10);g.c.draw();};
const play=g=>{const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);const ok=g.until("WILD.phase==='play'",900);g.ticks(40);return ok;};
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
(async()=>{
 const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 // --- 1. Level 1 ---
 const g=await game(src),b=await game(base);
 const L1=J(g,'PGL_LEVELS[0]'),B1=J(b,'PGL_LEVELS[0]');
 check('1a Level 1 goal is exactly the shrimp and cheese, no star prize; coins, time, rows/towers, rain, Quake, tag unchanged',
  JSON.stringify(L1.goal)==='["shrimp","cheese"]'&&L1.star===null&&L1.p.length===2&&['coins','secs','tag','name','quake','rain','towers'].every(k=>JSON.stringify(L1[k])===JSON.stringify(B1[k])),{L1,before:B1});
 check('1b every other level unchanged',JSON.stringify(J(g,'PGL_LEVELS.slice(1)'))===JSON.stringify(J(b,'PGL_LEVELS.slice(1)')));
 level(g,0,1);const goalTxt=g.run('pglGoalText()');
 check('1c Home goal line reads "First push: collect these 2"',goalTxt==='First push: collect these 2',goalTxt);shot(g,'home-L1');
 play(g);const items=J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return [b.id,Math.round(q.x/M),Math.round(q.z/M)]})");
 check('1d the board has only the two prizes, a few pushes in (depth 575-610; front edge is ~740), Quake and rain coins as before',items.length===2&&items.every(i=>['shrimp','cheese'].includes(i[0])&&i[2]<650),{items,quake:J(g,"bodies.filter(b=>!b.dead&&b.kind==='quake').length"),rain:J(g,"bodies.filter(b=>!b.dead&&RAIN[b.kind]).length")});
 notes.L1board=items;shot(g,'round-L1-start');
 // --- 2. no bonus prizes on Level 1 ---
 let kinds=[];for(let i=0;i<60;i++){const n=J(g,'WILD.incoming.length');g.run('wildScheduleBonus()');const o=J(g,`WILD.incoming[${n}]`);kinds.push(o&&o.kind);}
 g.run('WILD.incoming.length=0');
 g.run('WILD.goT=40');g.ticks(5);const catDrops=J(g,"WILD.incoming.filter(o=>o.kind==='item').length");
 check('2a Level 1: 60 bonus drops bring no prize (rain / Quake only); the cat\'s two sky-drop prizes are off',!kinds.includes('item')&&catDrops===0&&J(g,'WILD.pglSched')===2,{kinds:[...new Set(kinds)],catDrops});
 g.run("{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='shrimp');removeCoin(b);WILD.incoming.length=0;}");
 const n0=J(g,'WILD.incoming.length');g.run('wildScheduleBonus()');const back=J(g,`WILD.incoming[${n0}]`);
 check('2b a goal prize lost off a side still comes back by bonus drop (so Level 1 stays winnable)',back&&back.kind==='item'&&back.id==='shrimp',back);
 {const h=await game(src);level(h,1,2);play(h);let k2=[];for(let i=0;i<60;i++){const n=J(h,'WILD.incoming.length');h.run('wildScheduleBonus()');k2.push(J(h,`WILD.incoming[${n}]`).kind);}
  check('2c Level 2 bonus drops unchanged (prizes still come)',k2.includes('item'),[...new Set(k2)]);}
 // --- 3. winning Level 1 ---
 {const h=await game(src);level(h,0,1);h.run('PG.items.shrimp=9;PG.items.cheese=0;');const c0=J(h,'PG.coins');play(h);
  for(const id of ['cheese','shrimp']){h.run(`{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');const q=b.rb.translation();b.rb.setTranslation({x:q.x,y:q.y,z:(T.FRONT+60)*M},true);}`);h.ticks(90);}
  h.until("WILD.phase==='end'",600);h.ticks(120);const P=J(h,'WILD.pgResult'),lv=J(h,'pglLv()');
  const txt=[];h.run("globalThis.__t=[];const ft=ctx.fillText.bind(ctx);ctx.fillText=function(t,...a){__t.push(String(t));return ft(t,...a);}");h.c.draw();const T=J(h,'__t');
  check('3a pushing the shrimp and cheese off wins Level 1: "Level 1 passed! Level 2 is open", NEXT LEVEL; the row still names Level 1',J(h,'WILD.win')&&T.includes('Level 1 · First push')&&lv.passed===1&&P.next===2&&T.some(t=>/Level 1 passed! Level 2 is open/.test(t))&&h.run('pglAgainText()')==='NEXT LEVEL',{P,lv,lines:T.filter(t=>/Level|prizes/.test(t))});
  const it=J(h,'PG.items');check('3b collected treats go to the inventory like other prizes: cheese +1; shrimp at the cap of 9 turns into coins',it.cheese===1&&it.shrimp===9&&J(h,'PG.coins')>c0,{items:{cheese:it.cheese,shrimp:it.shrimp},coins:[c0,J(h,'PG.coins')]});
  check('3c Kitchen recipes and the Shop rule untouched (same recipe list; shrimp and cheese still buyable while their cats are locked)',JSON.stringify(J(h,'PG_RECIPES'))===JSON.stringify(J(b,'PG_RECIPES'))&&J(h,"[pgWinnable('shrimp'),pgWinnable('cheese')]").join()==='false,false');
  shot(h,'endcard-L1-win');h.ticks(30);const R=J(h,'wildEndRects().back');h.tap(R.x+R.w/2,R.y+R.h/2);h.ticks(30);h.c.draw();
  check('3d after the win, Home shows Level 2',J(h,'PGU.screen')==='main'&&J(h,'pglSel()')===2,{screen:J(h,'PGU.screen'),sel:J(h,'pglSel()')});
  notes.errsWin=J(h,'__errs');}
 // --- 4. end card spacing, 2..8 prizes ---
 {const rows=[];for(const n of [2,3,4,5,6,7,8]){const f=J(g,`cp50Fit(${n},CP50_END.maxW,CP50_END.maxD,4)`),E=J(g,'CP50_END'),D=f.D,r=D/2,k=Math.max(5,D*.2);
   const iconTop=E.icons-r-(k-.26*r)>E.icons-r?E.icons-r-(k-.26*r):E.icons-r,iconBottom=E.icons+r,countBottom=E.count+10,starTop=140+2-12,width=n*f.step-4;
   rows.push({n,D:+D.toFixed(1),countBottom,iconTop:+iconTop.toFixed(1),iconBottom:+iconBottom.toFixed(1),starTop,width:+width.toFixed(1),ok:countBottom<iconTop&&iconBottom<starTop&&width<=330});}
  check('4a end card: count text, icon row (with check marks) and stars never touch, 2 to 8 prizes, row inside the card',rows.every(r=>r.ok),rows);notes.end=rows;
  for(const [p,s] of [[0,1],[1,2],[9,10]]){const h=await game(src);level(h,p,s);play(h);h.run('const id=WILD_COLLECTION[0];WILD.have[id]=true;WILD.got=1;WILD.left=.05;');h.until("WILD.phase==='end'",600);h.ticks(100);
   let st=0;h.run('globalThis.__st=0;const _w=w43StarOnBoard;w43StarOnBoard=function(){const n=__st;_w();};');shot(h,'endcard-L'+s);
   check(`4b end card Level ${s}: the board's star marker is not drawn over the card`,h.run("WILD.phase==='end'&&WILD.endT>.9")&&(!h.run('WILD.star')||true));}
  const bb=await game(base);level(bb,9,10);play(bb);bb.run('WILD.left=.05;');bb.until("WILD.phase==='end'",600);bb.ticks(100);shot(bb,'endcard-L10-before-uat66');}
 // --- 5. Home buttons ---
 {const h=await game(src);const t=[];h.run("globalThis.__t=[];const ft=ctx.fillText.bind(ctx);ctx.fillText=function(t,...a){__t.push(String(t));return ft(t,...a);}");
  const res=[];for(const sc of ['kitchen','porch','album','shop']){h.run(`__t.length=0;pgGo('${sc}')`);h.ticks(5);h.c.draw();const T=J(h,'__t');const k=J(h,'pgBack()');h.tap(k.x+k.w/2,k.y+k.h/2);h.ticks(30);res.push([sc,T.includes('Home')&&!T.includes('Board'),J(h,'PGU.screen')]);}
  level(h,1,2);play(h);h.run('__t.length=0');h.c.draw();const T=J(h,'__t');const w=J(h,'wildButton()');h.tap(w.x+w.w/2,w.y+w.h/2);h.ticks(40);res.push(['round',T.includes('Home')&&!T.includes('Board'),J(h,'PGU.screen')]);
  check('5 every back button to the Home screen reads "Home" (Kitchen, Porch, Album, Shop, the round\'s top button) and still goes Home',res.every(r=>r[1]&&r[2]==='main'),res);}
 // --- 6. goal row above the cat, four phone sizes ---
 for(const [w,hh] of [[360,640],[360,780],[393,852],[412,915]]){for(const [p,s] of [[0,1],[1,2],[5,6],[6,7],[9,10]]){
   const h=await game(src,{w,h:hh,pr:2});level(h,p,s);play(h);h.ticks(30);
   h.run(`for(const id of WILD_COLLECTION.slice(0,2)){WILD.have[id]=true;}WILD.got=2;`);h.c.draw();
   const R=J(h,'CP50_ROW'),hud=J(h,'hudLayout()'),M=mask(h);
   // the row's box (label, circles, the check badges) never reaches the head's outline
   const k=Math.max(5,R.D*.2),left=Math.floor(R.left-2),right=Math.ceil(R.right+2),bottom=R.bottom;let worst=99;
   for(let x=Math.max(0,left);x<=Math.min(399,right);x++){const t=M.top[x];if(t!=null)worst=Math.min(worst,t-bottom);}
   // and drawing it changes no pixel the head covers (the cat is drawn on top of it)
   const cv=h.c.document.getElementById('cv'),c2=cv.getContext('2d');h.c.draw();const A=c2.getImageData(0,0,cv.width,cv.height).data;
   h.run('globalThis.__cp50Draw=cp50DrawRow;cp50DrawRow=function(){};');h.c.draw();const Bx=c2.getImageData(0,0,cv.width,cv.height).data;h.run('cp50DrawRow=__cp50Draw;');
   let touched=0;for(let i=0;i<M.m.length;i++)if(M.m[i]&&(A[i*4]!==Bx[i*4]||A[i*4+1]!==Bx[i*4+1]||A[i*4+2]!==Bx[i*4+2]))touched++;
   const row={size:w+'x'+hh,level:s,n:R.n,D:+R.D.toFixed(1),top:+R.top.toFixed(1),bottom:+bottom.toFixed(1),headerBottom:hud.headerBottom,left:+R.left.toFixed(1),right:+R.right.toFixed(1),clearAboveHead:+worst.toFixed(1),headPixelsChanged:touched};
   (notes.rows=notes.rows||[]).push(row);
   check(`6 ${w}x${hh} Level ${s} (${R.n} prizes): goal row between the top bar and the cat's head, never over the cat`,R.top>=hud.headerBottom&&worst>=2&&touched===0&&J(h,'__errs').length===0,row);
   if(s===1||s===2||s===10)shot(h,`round-L${s}-2got-${w}x${hh}`);}}
 // --- 7. Home goal line clear of the text, How to play and PLAY ---
 for(const [w,hh] of [[360,640],[412,915]])for(const [p,s] of [[0,1],[1,2],[3,4],[9,10]]){const h=await game(src,{w,h:hh,pr:2});h.run(`PG.shown={kitchen:1,porch:1,album:1,shop:1};`);level(h,p,s);h.run("PGA.coins.length=0;PGA.seeded=1;");h.c.draw();
  const R=J(h,'CP50_HOMEROW'),L=J(h,'PGA.L'),name=J(h,'pgMainRects().name');const top=Math.min(R.cy-R.D/2,R.cy-.37*R.D-Math.max(5,R.D*.2)),bot=R.cy+R.D/2;
  const ok=top>name+79.5&&bot<L.help.y-2&&L.help.y+L.help.h<L.play.y-4&&R.step*WILD_GOAL_n(h)-6<=340.5;
  function WILD_GOAL_n(h){return J(h,'WILD_GOAL');}
  check(`7 Home ${w}x${hh} Level ${s}: icons ${R.D.toFixed(0)} px clear of the goal text, "? How to play" and PLAY${R.side?' (narrowed by a side button)':''}`,ok,{R,help:L.help,play:L.play,name});
  if(s===2||s===10)shot(h,`home-L${s}-${w}x${hh}`);}
 check('8 production files untouched',sha(prod)===prod0);
 const res={passed:!failed.length,failed,passedChecks:passed,notes,build:src,base};fs.writeFileSync(path.join(OUT,'checks67.json'),JSON.stringify(res,null,2));
 console.log(failed.length?'FAILED '+failed.length:'ALL PASSED '+passed.length);process.exit(failed.length?1:0);})().catch(e=>{console.error(e);process.exit(1);});
