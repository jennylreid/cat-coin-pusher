// CP-100 PLAY goes to the endless board: light checks (real game, drawn so Home's buttons exist). Usage: node checks100.cjs [release.html]
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html'));const R=[];
const prodJ=path.resolve(__dirname,'../../phone/CatCoinPusher-game.json'),psha=()=>crypto.createHash('sha256').update(fs.readFileSync(prodJ)).digest('hex'),prod0=psha();
function check(name,ok,info){R.push({name,ok:!!ok,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
async function boot(storage={}){const g=await make33({sourceFile:src,render:true,seed:5,pixelRatio:1,width:412,height:915,storage});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.T=n=>{for(let i=0;i<n;i++)g.tick();};g.J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));const sc=()=>+g.run('scale');g.tapAt=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 g.run("S.muted=true;S.dev=false");g.T(150);g.tapAt(200,700);g.T(30);g.run("if(!PG)pgInit();if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.T(60);g.c.draw();return g;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp128/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='88297acc70af24ddfb24ac541dbec4285226517280fb98b9e477d16eeac3c645')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}{const O=fs.readFileSync(path.resolve(__dirname,'../cp124/cp96-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');if(B.split(O).length!==2)m=[];B=B.split(O).join(N);}
  check('0 the build is published 2026.11.19 UAT 128 + build name + the Daily puzzles block with the Sleepy Coins pupils fix (everything else unchanged)',S===B&&m.length===1);}
 let g=await boot();
 const h0=g.J("{screen:PGU.screen,play:PGA.L&&PGA.L.play,btn:endBtn(),lab:labhBtn(),gentle:endLoad().gentle,coins:cp100Coins(),jar:PG.coins}");
 check('1 fresh save: Home shows Level boards (no Board lab button), the top bar coins are the wallet (100), a gentle first board is set',h0.screen==='main'&&h0.play&&h0.btn&&h0.lab===null&&h0.coins===100&&h0.gentle===true,h0);
 // 2 PLAY opens the endless board, First push with Level 1's quiet rules
 g.tapAt(h0.play.x+h0.play.w/2,h0.play.y+h0.play.h/2);let n=0;while(g.run('WILD.phase')!=='play'&&n++<900)g.tick();
 const s2=g.J("{on:END.on,key:endKey(),lv1:cp50Lv1(),sched:WILD.pglSched,phase:WILD.phase,screen:PGU.screen}");
 check("2 PLAY starts the endless board on First push with Level 1's quiet rules (no cat sky drops)",s2.on&&s2.key==='L1'&&s2.lv1===true&&s2.sched===2&&s2.phase==='play'&&s2.screen==='board',s2);
 // 3 the first NEW BOARD: Line up, the quiet rules end, Tuna dish unlocks and the Kitchen appears
 g.run("PG.photos={};END.w.meter=END.METER");n=0;while(!g.run('endFree()')&&n++<2000)g.tick();g.run('endStartSweep()');n=0;while(g.run('!!END.sweep')&&n++<600)g.tick();g.T(5);
 const s3=g.J("{key:endKey(),lv1:cp50Lv1(),recipe:'tunadish' in PG.recipes,kitchen:!!(PG.shown&&PG.shown.kitchen),seen:END.w.seen.length}");
 check('3 the 2nd board (Line up) unlocks Tuna dish and opens the Kitchen; the quiet rules end',s3.key==='L2'&&!s3.lv1&&s3.recipe&&s3.kitchen,s3);
 // 4 rotation: 10 levels then every lab board, Giant towers included
 const ord=g.J('endOrder()');check('4 the NEW BOARD rotation is the 10 open level boards only (goal boards are not in it)',ord.length===10&&ord[9]==='L10'&&!ord.some(k=>k.startsWith('lab:')),ord);
 // 5 Home again: All boards opens a list in two sections; a level board starts the endless board on it; a goal board plays with
 //   its own goal and drops and never touches the wallet
 g.run('wildReset()');g.T(10);g.c.draw();g.run("CP100.list={style:{display:'none'}};CP100.body={innerHTML:''}"); // the harness's stand-in document can't build the overlay; the real list is checked in real Chrome (shots100.cjs)
 const b=g.J('endBtn()');g.tapAt(b.x+b.w/2,b.y+b.h/2);g.T(2);
 const L5a=g.J("{open:CP100.list.style.display==='flex',mode:CP100.mode,boards:CP100.body.innerHTML.split('data-k=').length-1,goals:CP100.body.innerHTML.split('data-g=').length-1,on:END.on}");
 g.run("CP100.list.style.display='none'");const gb=g.J('cp100GoalBtn()');g.tapAt(gb.x+gb.w/2,gb.y+gb.h/2);g.T(2);
 const L5=g.J("{open:CP100.list.style.display==='flex',mode:CP100.mode,boards:CP100.body.innerHTML.split('data-k=').length-1,goals:CP100.body.innerHTML.split('data-g=').length-1,on:END.on,cup:CP100.body.innerHTML.indexOf('Sink 6 coins in the cup · 18 drops')>=0}");L5.levels=L5a;
 g.run("CP100.list.style.display='none';cp100Play('L5')");n=0;while(g.run('WILD.phase')!=='play'&&n++<900)g.tick();
 const s5=g.J("{key:endKey(),on:END.on,left:WILD.left,phase:WILD.phase,wallet:endLoad().coins}");
 g.run('wildReset()');g.T(10);const w0=g.J('endLoad().coins');g.run("cp100Goal('cup')");n=0;while(g.run('WILD.phase')!=='play'&&n++<900)g.tick();
 const s5g=g.J("{lab:LAB.on(),sel:LAB.st.sel,budget:labBudget(),left:LAB.st.left,on:END.on,coins:S.coins}");g.run('tryDrop({x:200,y:DROP_Y})');g.T(30);const s5h=g.J("{left:LAB.st.left,wallet:endLoad().coins}");
 check('5 Level boards opens its list (10), Goal boards opens its own (12, e.g. Cup shot 18 drops), neither starts a board; a board starts the endless board on it; a goal board plays with its own goal and 18 drops, the wallet untouched',
  L5a.open&&L5a.mode==='levels'&&L5a.boards===10&&L5a.goals===0&&!L5a.on&&L5.open&&L5.mode==='goals'&&L5.boards===0&&L5.goals===12&&!L5.on&&L5.cup&&s5.key==='L5'&&s5.on&&s5.left>=590&&s5g.lab&&s5g.sel==='cup'&&s5g.budget===18&&!s5g.on&&s5h.left===17&&s5h.wallet===w0,{L5,s5,s5g,s5h,w0});
 g.run('labhHome()');g.T(5);
 // 6 the Shop in Catnip, no jar coins moved
 g.run("PG.items=PG.items||{};PG.items.egg=3;PG.items.bowtie=2;PG.catnip=0;globalThis.__jar=PG.coins");
 g.run("PGU.shop.tab='sell';pgShopTap({id:'egg',x:24,y:300,w:352,h:58,btn:{x:270,y:310,w:96,h:36}});pgShopTap({id:'bowtie',x:24,y:300,w:352,h:58,btn:{x:270,y:310,w:96,h:36}})");
 const s6=g.J("{nip:PG.catnip,jar:PG.coins===__jar,egg:PG.items.egg,sellEgg:pgSell('egg'),sellBow:pgSell('bowtie'),buyEgg:pgBuy('egg'),buyBow:pgBuy('bowtie')}");
 g.run("PG.catnip=4;PGU.shop.tab='buy';PG.items.milk=0;pgShopTap({id:'milk',x:24,y:300,w:352,h:58,btn:{x:270,y:310,w:96,h:36}})");const s6b=g.J("{nip:PG.catnip,milk:PG.items.milk,jar:PG.coins===__jar}");
 check('6 Shop: selling gives Catnip (egg 1, bow tie 2), buying costs Catnip (4 / 8); the jar is never touched',s6.nip===3&&s6.jar&&s6.egg===2&&s6.sellEgg===1&&s6.sellBow===2&&s6.buyEgg===4&&s6.buyBow===8&&s6b.nip===0&&s6b.milk===1&&s6b.jar,{s6,s6b});
 // 7 the Shop draws with no jar and no errors; Home's bar shows the wallet
 g.run("globalThis.__e=[];const __fe=frameError;frameError=e=>{__e.push(String(e).slice(0,200));return __fe(e)}");g.run("wildReset()");g.T(5);g.run("pgGo('shop')");g.T(20);g.c.draw();g.run("pgGo('main')");g.T(20);g.c.draw();
 check('7 the Shop and Home draw with no errors',g.J('__e.length')===0,g.J('__e'));
 g.close&&g.close();
 // 8 a player who already has an endless wallet keeps it and gets no gentle board
 g=await boot({'catpusher.uat.cp92endless.v1':JSON.stringify({coins:37,t:Date.now(),meter:50,cur:'L4',seen:['L1','L2','L3','L4']})});
 const s8=g.J("{coins:cp100Coins(),gentle:!!endLoad().gentle,cur:endLoad().cur}");g.close&&g.close();
 check('8 an existing endless save is kept as is (37 coins, Crammed), no gentle board',s8.coins<=40&&s8.coins>=37&&!s8.gentle&&s8.cur==='L4',s8);
 check('9 production untouched',psha()===prod0);
 const pass=R.filter(r=>r.ok).length;console.log(pass+'/'+R.length+' passed');
 let out=__dirname;try{const v=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8'));out=path.resolve(__dirname,'../../tickets/CP-96-evidence/uat'+v.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});}catch(e){}
 fs.writeFileSync(path.join(out,'checks100-on129.json'),JSON.stringify({build:src,passed:pass===R.length,passedN:pass,failed:R.filter(r=>!r.ok).map(r=>r.name),results:R},null,1));process.exit(pass===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(2);});
