// UAT 85 checks (CP-58 add-on on UAT 84: the wheel's Yawn eats food only; milk leaves an empty bottle on the board).
// base84.html is a byte copy of ../cp63-uat/release.html (published UAT 84) beside this folder's art/.
// Usage: node checks85.cjs   -> tickets/CP-58-evidence/uat85/checks85.json
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'base84.html'),out=path.resolve(__dirname,'../../tickets/CP-58-evidence/uat85');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const FOOD=['cheese','shrimp','tuna','biscuit','sardine','egg','milk'];
// what the Yawn itself removes (from inside a Yawn tick), and whether each piece lay on top of the pile
const WATCH="globalThis.__yr=[];const __rc=removeCoin;removeCoin=function(b){try{if(/w2YawnTick/.test(new Error().stack)){const y=b.rb.translation().y/M;__yr.push({kind:b.kind,id:b.id||null,top:b.kind==='item'||y-cp61Half(b)>=COIN_HALF*1.5});}}catch(e){}return __rc.apply(this,arguments);};"+
 "globalThis.__calls=[];const __co=callout;callout=function(t,o){__calls.push(String(t));return __co.apply(this,arguments);};"+
 "globalThis.__cl=0;{const c=sfx.cp58Clink;if(c)sfx.cp58Clink=function(){__cl++;return c.apply(this,arguments)};}";
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
const CLEAR="for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;";
const BOTTLES="bodies.filter(b=>b.bottle&&!b.dead).map(b=>{const p=b.rb.translation();return {id:b.id,kind:b.kind,x:Math.round(p.x/M),y:Math.round(p.y/M),z:Math.round(p.z/M),r:b.r,half:b.half}})";
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function round(file,{seed,level=3,secs=10,fps=60}){const g=await game(file,{seed});const tk=fps===60?g.tick:g.tick30;
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run('WILD.left=Math.max(WILD.left,90);');g.run(WATCH);g.tk=tk;g.fps=fps;return g;}
function yawn(g){g.run(WHEEL);let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<10*g.fps)g.tk();
 const grabs=J(g,'W2_YAWN?W2_YAWN.grabs.map(x=>x.id):[]');let tossAt=null;
 for(let i=0;i<Math.round(6*g.fps)&&g.run('!!W2_YAWN');i++){g.tk();if(tossAt==null&&g.run('!!(W2_YAWN&&W2_YAWN.bottle)'))tossAt=+g.run('W2_YAWN.t.toFixed(2)');}
 for(let i=0;i<Math.round(2*g.fps);i++)g.tk();return {grabs,tossAt,ended:!g.run('!!W2_YAWN')};}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 if(sha(base)!==sha(path.resolve(__dirname,'../cp63-uat/release.html')))throw new Error('base84.html is not UAT 84');
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
  for(const [a,b] of E.edits)B=B.split(a).join(b);const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp58-bottle.js'),'utf8')+'\n'+B.slice(i);
  check('0 UAT 84 + the listed edits + the add-on block = the build (nothing else changes)',S===B);}
 // 1. food only: real rounds with toys and food on the board
 notes.food=[];let ok1=true,toysSeen=0;
 for(const level of [3,4,9])for(const fps of [60,30])for(const seed of [1,2]){const g=await round(src,{seed,level,fps});
  const onBoard=J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>b.id)");toysSeen+=onBoard.filter(id=>!FOOD.includes(id)).length;
  const y=yawn(g),taken=J(g,'__yr'),errs=J(g,'__errs');const items=taken.filter(x=>x.kind==='item').map(x=>x.id);
  const row={level,fps,seed,onBoard,grabs:y.grabs,itemsEaten:items,coins:taken.filter(x=>x.kind!=='item').length,errs:errs.length};notes.food.push(row);console.log(JSON.stringify(row));
  if(!(y.grabs.length&&y.grabs.every(id=>id==='coins'||FOOD.includes(id))&&items.every(id=>FOOD.includes(id))&&y.ended&&!errs.length))ok1=false;g.close();}
 check('1 food only (Levels 3, 4, 9 x 2 seeds x 60/30 fps, '+toysSeen+' toys on those boards): the Yawn took only food or coins, never a toy; no frame errors',ok1&&toysSeen>0,notes.food.map(r=>[r.level,r.fps,r.seed,r.grabs.join(','),r.itemsEaten.join(',')]));
 // 2. only toys in reach: coins, no toy taken
 notes.toys=[];let ok2=true;for(const fps of [60,30])for(const seed of [1,2,3]){const g=await round(src,{seed,level:4,fps});
  g.run(CLEAR+"for(const [id,x,z] of [['sock',140,560],['box',260,600],['ball',200,650],['feather',110,690],['mouse',290,700]])addCoin('item',id,x,40,z,yawTurn(0));");for(let i=0;i<g.fps;i++)g.tk();
  const before=J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').length"),y=yawn(g),taken=J(g,'__yr'),errs=J(g,'__errs');
  const row={fps,seed,grabs:y.grabs,taken:taken.map(x=>x.kind+(x.top?'':'(bottom)')),toysBefore:before,errs:errs.length};notes.toys.push(row);
  if(!(y.grabs.length===1&&y.grabs[0]==='coins'&&taken.length>=2&&taken.every(x=>x.kind!=='item'&&x.top)&&!errs.length))ok2=false;g.close();}
 check('2 only toys in reach (5 toys placed at the front): the mitt takes '+[...new Set(notes.toys.map(r=>r.taken.length))].join('/')+' top coins, no toy; no frame errors',ok2,notes.toys.map(r=>[r.fps,r.seed,r.taken.join(',')]));
 // 3. milk -> the empty bottle on the board; pushed off front and side: clink, gone, never a prize
 notes.milk=[];let ok3=true;for(const fps of [60,30])for(const seed of [1,2,3]){const g=await round(src,{seed,level:3,fps});
  g.run(CLEAR+"addCoin('item','milk',200,40,600,yawTurn(0));");for(let i=0;i<g.fps;i++)g.tk();
  g.run("globalThis.__ta=treatAwards.length;globalThis.__have=JSON.stringify(WILD.have);globalThis.__lost0=WILD.lostN|0;globalThis.__miss0=JSON.stringify(wildMissing());");
  const y=yawn(g),b=J(g,BOTTLES),eaten=J(g,'__yr').filter(x=>x.kind==='item').map(x=>x.id);
  const missSame=g.run("bodies.some(b=>b.bottle)&&!WILD_COLLECTION.includes('bottle')&&!WILD.have.bottle&&!wildMissing().includes('bottle')"); // with the bottle on the board it is never a goal, never collected
  g.run("{const b=bodies.find(b=>b.bottle&&!b.dead);if(b){b.rb.setTranslation({x:200*M,y:20*M,z:(T.FRONT+8)*M},true);b.rb.setLinvel({x:0,y:-1,z:2},true);}}");for(let i=0;i<g.fps*1.5;i++)g.tk();
  const afterFront=J(g,'CP58_BOTTLE.stats');const fallingBottle=g.run("falling.some(f=>f.id==='bottle')")||afterFront.off>0;
  g.run("{const b=addCoin('item','bottle',(T.R+14),12,520,yawTurn(0));b.bottle=true;b.rb.setLinvel({x:2,y:-1,z:0},true);}");for(let i=0;i<g.fps*1.5;i++)g.tk();
  const st=J(g,'CP58_BOTTLE.stats'),row={fps,seed,grabs:y.grabs,eaten,tossAt:y.tossAt,bottle:b,stats:st,clinks:+g.run('__cl'),awards:+g.run('treatAwards.length-__ta'),haveSame:g.run('JSON.stringify(WILD.have)===__have'),
   lostAdded:+g.run('(WILD.lostN|0)-__lost0'),missSame,left:J(g,BOTTLES).length,fallingBottle,errs:J(g,'__errs')};notes.milk.push(row);console.log(JSON.stringify(row));
  const B0=b[0];if(!(y.grabs.join()==='milk'&&eaten.join()==='milk'&&b.length===1&&B0.id==='bottle'&&B0.kind==='item'&&B0.z>260&&B0.z<760&&B0.y<60&&Math.abs(B0.x-200)<170&&
   st.off===1&&st.side===1&&row.clinks===2&&row.awards===0&&row.haveSame&&row.lostAdded<=1&&missSame&&row.left===0&&!row.errs.length))ok3=false;g.close();}
 check('3 milk: drunk (lost as before), the empty bottle lands on the board in front of the pusher as a piece with milk\'s size; pushed off the front and off a side it clinks and is gone; no pickup, no goal change, not counted; no frame errors',ok3,notes.milk.map(r=>[r.fps,r.seed,r.tossAt,r.bottle.map(b=>[b.x,b.y,b.z]),r.clinks,r.awards,r.haveSame,r.lostAdded]));
 // 4. at most 2 bottles; same size and collider as milk
 {const g=await round(src,{seed:2,level:3});const sizes=[];
  for(let n=0;n<3;n++){g.run(CLEAR.replace("removeCoin(b)","{if(!b.bottle)removeCoin(b)}")+"addCoin('item','milk',200,40,610,yawTurn(0));");for(let i=0;i<60;i++)g.tk();yawn(g);}
  const b=J(g,BOTTLES),st=J(g,'CP58_BOTTLE.stats'),milk=J(g,"(()=>{const m=addCoin('item','milk',200,200,400,yawTurn(0));const r={r:m.r,half:m.half,mass:m.rb.mass(),shape:m.rb.collider(0).shape.type,groups:m.rb.collider(0).collisionGroups(),fr:m.rb.collider(0).friction()};removeCoin(m);return r;})()");
  const bb=J(g,"(()=>{const m=bodies.find(b=>b.bottle);return {r:m.r,half:m.half,mass:m.rb.mass(),shape:m.rb.collider(0).shape.type,groups:m.rb.collider(0).collisionGroups(),fr:m.rb.collider(0).friction()};})()");
  check('4 three milk Yawns in a row: 2 bottles on the board, the third kept; the bottle has milk\'s size, collider, weight and grip',b.length===2&&st.tossed===2&&st.kept===1&&JSON.stringify(milk)===JSON.stringify(bb)&&!J(g,'__errs').length,{bottles:b.length,st,milk,bottle:bb});g.close();}
 // 5. Formal inspection never picks a bottle, and is identical to UAT 84 when there are none
 {const g=await round(src,{seed:3,level:3});g.run(CLEAR+"for(const x of [170,230]){const b=addCoin('item','bottle',x,40,700,yawTurn(0));b.bottle=true;}");for(let i=0;i<60;i++)g.tk();
  const pick=J(g,"cp63Pick().map(b=>b.id||b.kind)");check('5a Formal inspection\'s picks skip empty bottles (2 at the front edge)',!pick.includes('bottle')&&pick.length>0,pick);g.close();}
 notes.power=[];let ok5=true;for(const fps of [60,30])for(const seed of [1,2]){const r=[];for(const f of [src,base]){const g=await round(f,{seed,level:3,fps});
   g.run("globalThis.__off=[];const __rc3=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();__off.push([b.kind,b.id||'',Math.round(p.x/M),Math.round(p.z/M)]);}catch(e){}return __rc3.apply(this,arguments);};PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");
   for(let i=0;i<8*g.fps;i++)g.tk();r.push(g.run('JSON.stringify(__off)')+'|'+g.run('__errs.length'));g.close();}
  notes.power.push({fps,seed,same:r[0]===r[1],n:JSON.parse(r[0].split('|')[0]).length});if(r[0]!==r[1])ok5=false;}
 check('5b Formal inspection (Tuxedo power), no bottles: identical removals to UAT 84',ok5,notes.power);
 // 6. drawn: the bottle in the mitt, in flight and on the board with the empty painting; drips are white; no frame errors
 {const {game:game43}=require('../cp43/harness.cjs');const g=await game43({src,seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});
  g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
  g.ticks(140);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);if(!g.run('PG'))g.run('pgInit()');
  g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);g.ticks(300);
  await new Promise(r=>setTimeout(r,400));g.run("WILD.left=60;"+CLEAR+"addCoin('item','milk',200,40,600,yawTurn(0));");g.ticks(60);
  g.run("globalThis.__bd={over:0,board:0};globalThis.__drip=new Set();"+
   "const __yt=yawnText;yawnText=function(){const d=ctx.drawImage;ctx.drawImage=function(im,...a){if(im===CP58_BOTTLE_ART)__bd.over++;return d.call(this,im,...a);};try{return __yt();}finally{ctx.drawImage=d;}};"+
   "const __db=__drawBoardBodies;__drawBoardBodies=function(){const d=ctx.drawImage;ctx.drawImage=function(im,...a){if(im===CP58_BOTTLE_ART)__bd.board++;return d.call(this,im,...a);};try{return __db();}finally{ctx.drawImage=d;}};"+WHEEL);
  for(let i=0;i<8*60;i++){g.tick();if(i%2===0)g.c.draw();if(g.run('!!(W2_YAWN&&W2_YAWN.crumbs.length)'))for(const c of J(g,'W2_YAWN.crumbs.map(c=>c.c)'))g.run('__drip.add('+JSON.stringify(c)+')');}
  const u=J(g,'__bd'),drips=J(g,'[...__drip]'),loaded=g.run('!!CP58_BOTTLE_ART'),e=J(g,'__errs');g.close();
  check('6 drawn with the empty-bottle painting in the mitt/in flight ('+u.over+' frames) and on the board ('+u.board+'); milk drips are white ('+drips.join(',')+'); no frame errors',loaded&&u.over>5&&u.board>5&&drips.length&&drips.every(c=>/^#(ffffff|f1ece0)$/.test(c))&&!e.length,{u,drips,e});}
 // 7. Level 8: tick time with 2 bottles vs none (desktop, physics + update, no drawing)
 {const g=await round(src,{seed:2,level:8,secs:6});const {performance:P}=require('perf_hooks');
  const time=n=>{const t0=P.now();for(let i=0;i<n;i++)g.tick();return (P.now()-t0)/n;};time(120);
  const pieces=+g.run('bodies.filter(b=>!b.dead).length');const a=[],b=[];
  for(let k=0;k<4;k++){a.push(time(240));g.run("for(const x of [160,240]){const b=addCoin('item','bottle',x,40,380,yawTurn(0));b.bottle=true;}");b.push(time(240));g.run('for(const b of bodies.slice())if(b.bottle)removeCoin(b);');}
  const ma=a.reduce((s,v)=>s+v,0)/a.length,mb=b.reduce((s,v)=>s+v,0)/b.length;notes.level8={pieces,tickMsNone:+ma.toFixed(3),tickMsTwoBottles:+mb.toFixed(3),runs:{none:a.map(v=>+v.toFixed(3)),two:b.map(v=>+v.toFixed(3))}};
  check('7 Level 8 ('+pieces+' pieces): '+ma.toFixed(2)+' ms per tick without bottles, '+mb.toFixed(2)+' ms with 2 (desktop)',mb<=ma*1.2+.3&&!J(g,'__errs').length,notes.level8);g.close();}
 check('8 seven simultaneous pickups: identical frame trace and sound calls to UAT 84',(await burst(src))===(await burst(base)));
 check('9 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks85.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
