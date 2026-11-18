// UAT 90 checks (CP-71 on UAT 89: the Yawn never eats coins; no food in reach -> the mitt knocks a few top coins behind
// the table). base89.html is a byte copy of ../cp89/release.html (published UAT 89) beside this folder's art/.
// Usage: node checks90.cjs   -> tickets/CP-71-evidence/uat90/checks90.json
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'base89.html'),out=path.resolve(__dirname,'../../tickets/CP-71-evidence/uat90');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
// every removal made from inside a Yawn tick (with whether the piece lay on top), callouts, chewing/gulp sounds
const WATCH="globalThis.__yr=[];const __rc=removeCoin;removeCoin=function(b){try{if(/w2YawnTick/.test(new Error().stack)){const y=b.rb.translation().y/M;__yr.push({kind:b.kind,id:b.id||null,top:b.kind==='item'||y-cp61Half(b)>=COIN_HALF*1.5});}}catch(e){}return __rc.apply(this,arguments);};"+
 "globalThis.__calls=[];const __co=callout;callout=function(t,o){__calls.push(String(t));return __co.apply(this,arguments);};"+
 "globalThis.__snd=[];{const w=sfx.wild2;sfx.wild2=function(k,...a){__snd.push('wild2:'+k);return w.call(this,k,...a)};const p=sfx.pg;sfx.pg=function(k,...a){__snd.push('pg:'+k);return p.call(this,k,...a)};}";
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
const CLEAR="for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;";
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
// runs a wheel Yawn to its end; samples whether anything is ever held in the mitt and the Yawn's length
function yawn(g){g.run(WHEEL);let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<10*g.fps)g.tk();
 const grabs=J(g,'W2_YAWN?W2_YAWN.grabs.map(x=>x.id):[]');let held=false,len=0,flyEnd=[];
 for(let i=0;i<Math.round(6*g.fps)&&g.run('!!W2_YAWN');i++){g.tk();len=+g.run('W2_YAWN?W2_YAWN.t:0')||len;
  if(g.run('!!(W2_YAWN&&W2_YAWN.grabs.some(x=>x.held&&x.coins))'))held=true;
  const f=J(g,'W2_YAWN&&W2_YAWN.flyers?W2_YAWN.flyers.filter(f=>f.t>=f.dur).map(f=>{const a=cp71At(f);return [Math.round(a.z),Math.round(a.h)]}):[]');if(f.length>flyEnd.length)flyEnd=f;}
 for(let i=0;i<Math.round(1*g.fps);i++)g.tk();return {grabs,held,len:+len.toFixed(2),flyEnd,ended:!g.run('!!W2_YAWN')};}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 if(sha(base)!==sha(path.resolve(__dirname,'../cp89/release.html')))throw new Error('base89.html is not UAT 89');
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
  for(const [a,b] of E.edits)B=B.split(a).join(b);const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp71-knock.js'),'utf8')+fs.readFileSync(path.join(__dirname,'cp73-words.js'),'utf8')+'\n'+B.slice(i);
  check('0 UAT 89 + the CP-71 edits + the CP-71 and CP-73 blocks = the build (nothing else changes)',S===B);}
 // 1. no food in reach (none at all, or only toys): coins are knocked behind the table, never held, carried or eaten
 notes.coins=[];let ok1=true;
 for(const toys of [false,true])for(const level of [1,3])for(const fps of [60,30])for(const seed of [1,2,3]){const g=await round(src,{seed,level,fps});
  g.run(CLEAR+(toys?"for(const [id,x,z] of [['sock',140,600],['box',260,640],['ball',200,690]])addCoin('item',id,x,40,z,yawTurn(0));":""));for(let i=0;i<g.fps;i++)g.tk();
  g.run('globalThis.__k0=CP71.stats.knocked;');const y=yawn(g),taken=J(g,'__yr'),calls=J(g,'__calls'),snd=J(g,'__snd'),errs=J(g,'__errs'),kn=+g.run('CP71.stats.knocked-__k0');
  const row={toys,level,fps,seed,grabs:y.grabs,taken:taken.map(x=>x.kind+(x.top?'':'(bottom)')),knocked:kn,held:y.held,len:y.len,behind:y.flyEnd,nom:calls.filter(c=>/NOM/.test(c)),chew:snd.filter(s=>/wild2:catch|pg:plop/.test(s)),errs:errs.length};
  notes.coins.push(row);console.log(JSON.stringify(row));
  if(!(y.grabs.join()==='coins'&&!y.held&&taken.length>=2&&taken.length<=4&&taken.every(x=>x.kind!=='item'&&x.top)&&kn===taken.length&&y.flyEnd.length===taken.length&&y.flyEnd.every(([z,h])=>z<190&&h<0)&&
   !row.nom.length&&!row.chew.length&&y.len<4.3&&y.ended&&!errs.length))ok1=false;g.close();}
 check('1 no food in reach (none, or only toys), Levels 1 and 3 x 3 seeds x 60/30 fps: the mitt knocks '+[...new Set(notes.coins.map(r=>r.taken.length))].sort().join('/')+' top coins back over the rear edge (all end behind the table, below its top), never holds, carries or eats one; no NOM, no chewing or gulp sound; toys untouched; the Yawn ends by '+Math.max(...notes.coins.map(r=>r.len))+' s; no frame errors',ok1,notes.coins.map(r=>[r.toys?'toys':'none',r.level,r.fps,r.seed,r.taken.length,r.held,r.len]));
 // 2. food in reach: everything identical to UAT 89 (grabs, removals, callouts, sounds, bottle, length)
 notes.food=[];let ok2=true;
 const FOODRUN=async(file,{seed,level,fps,milk})=>{const g=await round(file,{seed,level,fps});if(milk){g.run(CLEAR+"addCoin('item','milk',200,40,600,yawTurn(0));");for(let i=0;i<g.fps;i++)g.tk();}
  const y=yawn(g);const r={grabs:y.grabs,len:y.len,taken:J(g,'__yr'),calls:J(g,'__calls'),snd:J(g,'__snd'),bottle:J(g,'CP58_BOTTLE.stats'),bodies:J(g,"bodies.filter(b=>!b.dead).length"),errs:J(g,'__errs').length};g.close();return r;};
 for(const [level,milk] of [[3,false],[4,false],[9,false],[3,true]])for(const fps of [60,30])for(const seed of [1,2]){
  const a=await FOODRUN(src,{seed,level,fps,milk}),b=await FOODRUN(base,{seed,level,fps,milk});const same=JSON.stringify(a)===JSON.stringify(b);
  notes.food.push({level,milk,fps,seed,grabs:a.grabs,same,errs:a.errs});if(!same||a.errs||!a.grabs.length||a.grabs.includes('coins'))ok2=false;}
 check('2 food in reach (Levels 3, 4, 9 and a milk run x 2 seeds x 60/30 fps): grabs, removals, callouts, sounds, the bottle toss and the Yawn length identical to UAT 89',ok2,notes.food.map(r=>[r.level,r.milk?'milk':'',r.fps,r.seed,r.grabs.join(','),r.same]));
 // 3. drawn: on a coin run the flying coins are drawn and the eating face never shows; on a food run it shows as before
 {const {game:game43}=require('../cp43/harness.cjs');const res={};
  for(const kind of ['coins','food']){const g=await game43({src,seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});
   g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
   g.ticks(140);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);if(!g.run('PG'))g.run('pgInit()');
   g.run("PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");g.until("WILD.phase==='play'",900);
   for(let i=0;i<600;i++){if(i%30==0)g.tap((200+100*Math.sin(i/40))*g.run('scale'),560*g.run('scale'));g.tick();}
   await new Promise(r=>setTimeout(r,400));g.run("WILD.left=60;"+CLEAR+(kind==='food'?"addCoin('item','cheese',200,40,600,yawTurn(0));":""));g.ticks(60);
   g.run("globalThis.__d={eyes:0,fly:0};const __cf=cp58Face;cp58Face=function(){const d=ctx.drawImage;ctx.drawImage=function(im,...a){if(im===CP58_RUNWAY_EYES)__d.eyes++;return d.call(this,im,...a);};try{return __cf();}finally{ctx.drawImage=d;}};"+WHEEL);
   for(let i=0;i<6*60;i++){g.tick();if(i%2===0){g.c.draw();if(g.run("!!(W2_YAWN&&W2_YAWN.flyers&&W2_YAWN.flyers.some(f=>f.t>=0&&f.t<f.dur))"))g.run('__d.fly++');}}
   res[kind]={...J(g,'__d'),errs:J(g,'__errs')};g.close();}
  check('3 drawn: coin run '+res.coins.fly+' frames of coins flying back, eating eyes '+res.coins.eyes+' times; food run eating eyes '+res.food.eyes+' times (as before); no frame errors',
   res.coins.fly>5&&res.coins.eyes===0&&res.food.eyes>10&&!res.coins.errs.length&&!res.food.errs.length,res);}
 // 6. CP-73: Formal inspection identical to UAT 89 except where its words show (removals, timing, sounds); its words are
 // said in the band above the head (not the callout queue), the intro is gone before the lens starts
 {notes.inspect=[];let ok=true;for(const fps of [60,30])for(const seed of [1,2]){const r=[];for(const f of [src,base]){const g=await round(f,{seed,level:3,fps});
   g.run("globalThis.__off=[];const __rc3=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();__off.push([b.kind,b.id||'',Math.round(p.x/M),Math.round(p.z/M)]);}catch(e){}return __rc3.apply(this,arguments);};"+
    "globalThis.__bam=0;{const b=sfx.bam;sfx.bam=function(){__bam++;return b.apply(this,arguments)};}globalThis.__say=[];if(typeof cp73Say==='function'){const s=cp73Say;cp73Say=function(w,c,d){__say.push([String(w),+(CP63X?CP63X.t:0).toFixed(2),d]);return s.apply(this,arguments);};}"+
    "globalThis.__calls=[];PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=1;pgpUse();");
   for(let i=0;i<8*g.fps;i++)g.tk();
   r.push({off:g.run('JSON.stringify(__off)'),bam:+g.run('__bam'),say:J(g,'__say'),calls:J(g,'__calls').filter(c=>/FORMAL|HMM|SPLENDID/.test(c)),errs:J(g,'__errs').length});g.close();}
  const [a,b]=r,row={fps,seed,sameRemovals:a.off===b.off,bam:[a.bam,b.bam],say:a.say,oldCalls:b.calls,newCalls:a.calls,errs:a.errs};notes.inspect.push(row);console.log(JSON.stringify(row));
  const intro=a.say.find(x=>/FORMAL/.test(x[0]));
  if(!(row.sameRemovals&&a.bam===b.bam&&a.say.length===3&&!a.calls.length&&b.calls.length===3&&intro&&intro[2]<=0.55&&!a.errs))ok=false;}
  check('6 CP-73 Formal inspection (2 seeds x 60/30 fps): removals and pop sounds identical to UAT 89; FORMAL INSPECTION!, HMM. and SPLENDID. shown in the band above the head instead of the big callout; the intro lasts 0.5 s, gone before the lens starts at 0.55 s; no frame errors',ok,notes.inspect.map(r=>[r.fps,r.seed,r.sameRemovals,r.bam.join('/'),r.say.map(x=>x[0]+'@'+x[1]).join(' ')]));}
 // 7. CP-73 layout: at 412x915 and 360x640 the words fit inside the goal band above the head (the beam starts at the eye)
 {const make33=require('../cp33/runtime.cjs'),NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';const res=[];
  for(const [w,h] of [[412,915],[360,640]]){const g=await make33({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.run=s=>vm.runInContext(s,g.c);
   for(let i=0;i<150;i++)g.tick();g.run("PGU.title.t=9;pgTitleDone();if(!PG)pgInit();PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<60;i++)g.tick();
   const m=J(g,"(()=>{const R=cp50RowLayout(),B=cp73Band();ctx.save();ctx.font='italic 900 40px Impact';const out=['FORMAL INSPECTION!','HMM.','SPLENDID.'].map(word=>{const ww=ctx.measureText(word).width,size=Math.min(B.h*.8,28,40*250/ww),wd=ww*size/40;return {word,size:+size.toFixed(1),top:+(B.cy-size*.6).toFixed(1),bottom:+(B.cy+size*.6).toFixed(1),left:+(200-wd/2*1.1).toFixed(1),right:+(200+wd/2*1.1).toFixed(1)};});ctx.restore();return {bandTop:R.top,bandBottom:R.bottom,headTop:R.F,words:out};})()");
   res.push({size:w+'x'+h,...m});g.close();}
  check('7 CP-73 at 412x915 and 360x640: each word sits inside the goal band above the head (bottom above the head line), within the screen',res.every(r=>r.words.every(x=>x.bottom<=r.headTop&&x.top>=r.bandTop-12&&x.left>=0&&x.right<=400)),res);}
 check('4 seven simultaneous pickups: identical frame trace and sound calls to UAT 89',(await burst(src))===(await burst(base)));
 check('5 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks90.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
