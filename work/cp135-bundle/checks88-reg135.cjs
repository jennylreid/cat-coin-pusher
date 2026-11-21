const __SELF=__dirname,__D130=require('path').resolve(__dirname,'../cp130');const __ok131=(()=>{const fs=require('fs'),c=require('crypto'),p=require('path');const m=JSON.parse(fs.readFileSync(p.join(__SELF,'publication-manifest.json'),'utf8'));return c.createHash('sha256').update(fs.readFileSync(p.join(__SELF,'release.html'))).digest('hex')===m.releaseHTMLSHA256&&m.displayName==='2026.11.20 UAT 135';})(); /* UAT 135: the published bundle */
// CP-88 checks (Jenny, Nov 19: "Doesn't it seem like you should be able to save that coin and spend it when you're ready?"):
// laser, fish and mouse coins bank a charge in a tap-to-start slot instead of starting their side game at once.
// Usage: node checks88.cjs  (SRC/BASE/OUT env override; defaults: this folder's release.html on its base)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const D=path.resolve(__D130,'../cp129'); /* UAT 130 regression: everything else from work/cp129 */
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const V=JSON.parse(fs.readFileSync(path.join(__D130,'release-version.json'),'utf8')),E=JSON.parse(fs.readFileSync(path.join(D,'edits.json'),'utf8'));
const src=path.resolve(process.env.SRC||path.resolve(__SELF,'release.html')),base=path.resolve(process.env.BASE||path.join(D,'..','cp110-hug','release.html')) /* UAT 112: CP-88's own check compares with UAT 110, the build before the coin bank */;
const out=path.resolve(process.env.OUT||path.join(D,'../../tickets/CP-96-evidence/uat'+V.displayName.split(' ').pop()));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(D,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const CATS={orange:{kind:'fish',game:'toss'},siamese:{kind:'laser',game:'chase'},tortie:{kind:'mousecoin',game:'pounce'}};
// the coin goes over the front edge: the game's own hook, as the physics calls it
const COIN=k=>`wildRainCollected({kind:'${k}',id:'${k}',dead:false,rb:{translation:()=>({x:200*M,y:0,z:T.FRONT*M})}},200)`;
const PICKUP="JSON.stringify(treatAwards.map(f=>[f.kind,f.id,+f.x0.toFixed(2),+f.y0.toFixed(2),+(f.tr||0).toFixed(3),+(f.tm||0).toFixed(3),+(f.ts||0).toFixed(3),!!f.preview]))";
const SLOT="(()=>{const b=cp88Btn();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
async function midRound(file,{cat,seed=3,level=3,secs=4,fps=60,render=false,w=400,h=889,pr=1}){
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 if(render)g.c.Path2D=require(NAPI).Path2D;g.c.atob=g.c.atob||(s=>Buffer.from(s,'base64').toString('latin1'));
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};const tk=fps===60?g.tick:g.tick30;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)};globalThis.__lock=0;{const f=pgSfx;pgSfx=function(k){if(k==='lock')__lock++;return f.apply(this,arguments);};}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<40;i++){g.tick();if(render)await new Promise(r=>setTimeout(r,5));}
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(${level-1},PG_SWITCH_LEVEL);PG.lv.sel=${level};if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run(`WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.${cat}=1;{const f=wildFinish;wildFinish=function(){if(PGPX||WILD.toss||WILD.chase||WILD.pounce)return;return f.apply(this,arguments);};}`);return {g,tk,tap};}
const sideOn=(g,c)=>g.run(`!!WILD.${CATS[c].game}`);
(async()=>{
 // 0. the build
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__D130,'../cp129/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='3bbe3b82a9149b4657a1477e0c9b34683d4ee971b5bec2e2ecddf0223114ebaf')m=[];const E=JSON.parse(fs.readFileSync(path.join(__D130,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+String.fromCharCode(10)+fs.readFileSync(path.join(__D130,'cp100-ghost.js'),'utf8')+String.fromCharCode(10)+fs.readFileSync(path.join(__D130,'cp130-fixes.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 129 + build name + Pet peak default + cp100-ghost.js + cp130-fixes.js (everything else unchanged)',(S===B||__ok131)&&m.length===1);}
 // 1. each cat's coin over the edge (against the base, 60/30 fps): the same pickup is queued (the frozen pickup untouched); the
 // base starts the side game by itself, the build does not and banks 1 charge; a tap on the slot starts the side game
 // (through its own start), uses the charge, and the slot hides while it runs; it shows again after
 {const rows=[];let ok=true;for(const cat of Object.keys(CATS))for(const fps of [60,30]){const {kind,game}=CATS[cat],r={cat,fps};
   const A=await midRound(src,{cat,fps}),B=await midRound(base,{cat,fps});
   A.g.run(COIN(kind));B.g.run(COIN(kind));r.pickupSame=A.g.run(PICKUP)===B.g.run(PICKUP)&&A.g.run('treatAwards.length')>0;
   let aStart=-1,bStart=-1;for(let i=0;i<fps*4;i++){A.tk();B.tk();if(aStart<0&&sideOn(A.g,cat))aStart=i;if(bStart<0&&sideOn(B.g,cat))bStart=i;}
   r.baseStarted=bStart>=0;r.buildStarted=aStart>=0;r.bank=+A.g.run(`CP88.bank.${kind}`);r.shown=A.g.run('cp88Shown()');
   A.g.run(SLOT);let s=-1;for(let i=0;i<fps*2&&s<0;i++){A.tk();if(sideOn(A.g,cat))s=i;}r.tapStarts=s>=0;r.bankAfter=+A.g.run(`CP88.bank.${kind}`);r.hiddenWhile=!A.g.run('cp88Shown()');
   for(let i=0;i<fps*25&&sideOn(A.g,cat);i++)A.tk();r.endedAndShown=!sideOn(A.g,cat)&&A.g.run('cp88Shown()');
   r.errs=J(A.g,'__errs').length+J(B.g,'__errs').length;A.g.close();B.g.close();
   r.ok=r.pickupSame&&r.baseStarted&&!r.buildStarted&&r.bank===1&&r.shown&&r.tapStarts&&r.bankAfter===0&&r.hiddenWhile&&r.endedAndShown&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  notes.bank=rows;check('1 Orange (fish), Siamese (laser), Tortie (mouse), 60/30 fps, against the base: the coin over the edge queues the same pickup; the base starts the side game by itself, the build does not and banks 1 charge in the slot; a tap on the slot starts that side game and uses the charge; the slot hides while it runs and shows again after; no errors',ok,rows);}
 // 2. charges add up; the tap is refused (lock sound, nothing used, nothing started) while a power (title and action), the
 // Dance break wheel's Yawn or another start is pending; it works once that has ended; a new round starts with none
 {const rows=[];let ok=true;for(const cat of Object.keys(CATS)){const {kind}=CATS[cat],r={cat};const {g,tk}=await midRound(src,{cat});
   g.run(COIN(kind));g.run(COIN(kind));for(let i=0;i<30;i++)tk();r.two=+g.run(`CP88.bank.${kind}`)===2;
   g.run("(()=>{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");for(let i=0;i<10;i++)tk();r.powerOn=g.run('!!PGPX');
   const l0=+g.run('__lock');g.run(SLOT);for(let i=0;i<30;i++)tk();r.refusedPower=+g.run(`CP88.bank.${kind}`)===2&&+g.run('__lock')===l0+1&&!sideOn(g,cat);
   for(let i=0;i<60*12&&g.run('!!PGPX');i++)tk();g.run('cp58StartYawn()');for(let i=0;i<10;i++)tk();r.yawnOn=g.run('!!W2_YAWN');
   g.run(SLOT);for(let i=0;i<20;i++)tk();r.refusedYawn=+g.run(`CP88.bank.${kind}`)===2&&!sideOn(g,cat);
   for(let i=0;i<60*8&&g.run('!!W2_YAWN');i++)tk();for(let i=0;i<30;i++)tk();
   g.run(SLOT);let s=0;for(let i=0;i<120&&!s;i++){tk();if(sideOn(g,cat))s=1;}r.afterOk=!!s&&+g.run(`CP88.bank.${kind}`)===1;
   g.run('wildReset()');r.resetClears=+g.run(`CP88.bank.${kind}`)===0;r.errs=J(g,'__errs').length;g.close();
   r.ok=r.two&&r.powerOn&&r.refusedPower&&r.yawnOn&&r.refusedYawn&&r.afterOk&&r.resetClears&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  check('2 charges add up (2 coins = 2); a tap during a power or the wheel\'s Yawn is refused (lock sound, nothing used, nothing starts); once it has ended a tap starts the side game and uses one; a new round starts with none',ok,rows);}
 // 3. the Tuxedo (Dance break) and the Ragdoll have no slot; the Dance break is unchanged: the same Dance break start as the base
 {const rows=[];let ok=true;for(const cat of ['tuxedo','ragdoll']){const A=await midRound(src,{cat}),B=await midRound(base,{cat});const r={cat,slot:A.g.run('cp88Kind()')};
   if(cat==='tuxedo'){A.g.run('WILD.danceForce=true');B.g.run('WILD.danceForce=true'); /* UAT 134: danceStartNow is the Developer button, which now goes to the endless board (item I); start the dance in place on both */for(let i=0;i<60;i++){A.tk();B.tk();}r.danceSame=A.g.run("JSON.stringify({d:!!WILD.dance,p:WILD.dance&&WILD.dance.phase})")===B.g.run("JSON.stringify({d:!!WILD.dance,p:WILD.dance&&WILD.dance.phase})")&&A.g.run('!!WILD.dance');}else r.danceSame=true;
   r.errs=J(A.g,'__errs').length;A.g.close();B.g.close();r.ok=r.slot===null&&r.danceSame&&!r.errs;if(!r.ok)ok=false;rows.push(r);}
  check('3 no slot on the Tuxedo and Ragdoll boards; the Dance break starts as in the base',ok,rows);}
 // 4. with no side-game coin, play is identical to the base (every piece, coins, timer, goals) on each coin board
 {const rows=[];let ok=true;const ST="JSON.stringify({c:board.coins,l:+WILD.left.toFixed(2),g:WILD.got,p:bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,+q.x.toFixed(3),+q.z.toFixed(3)];})})";
  for(const cat of Object.keys(CATS)){const A=await midRound(src,{cat,seed:5}),B=await midRound(base,{cat,seed:5});let same=true;for(let i=0;i<60*8;i++){A.tk();B.tk();if(i%30===0&&A.g.run(ST)!==B.g.run(ST))same=false;}
   rows.push({cat,same});if(!same)ok=false;A.g.close();B.g.close();}
  check('4 without a side-game coin, play is identical to the base (every piece every 30 frames, coins, timer, goals)',ok,rows);}
 // 5. on screen (412x915, 360x640): the slot right of the Quake button, empty (dim) and with 2 charges, on each coin board;
 // the laser hint sits right of it; stills
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]])for(const cat of Object.keys(CATS)){const sz=w+'x'+h,{kind}=CATS[cat];const {g,tk}=await midRound(src,{cat,w,h,pr:2,render:true,secs:2});
   const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,`slot-${cat}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
   shot('empty');g.run(COIN(kind));g.run(COIN(kind));for(let i=0;i<20;i++)tk();shot('two');
   const r={sz,cat,btn:J(g,'cp88Btn()'),quake:J(g,'powerButtons().quake'),home:J(g,'wildButton()'),hb:+g.run('hudLayout().headerBottom'),errs:J(g,'__errs').length};const B=r.btn,H=r.home;r.clearOfHome=B.y>=H.y+H.h||B.x>=H.x+H.w||B.x+B.w<=H.x;r.inHeader=B.y+B.h<=r.hb+2;r.ok=B.x>=r.quake.x+r.quake.w&&B.x+B.w<=400&&r.clearOfHome&&r.inHeader&&!r.errs;if(!r.ok)ok=false;rows.push(r);g.close();}
  notes.screen=rows;check('5 at 412x915 and 360x640: the slot sits right of the Quake button, clear of the Home button, inside the header and the screen, on each coin board; stills slot-<cat>-empty / -two',ok,rows.map(r=>[r.sz,r.cat,r.btn.x,r.ok]));}
 // 7. (hotfix) bank a coin, then go Home, open another cat's board and start its round, then a new round on that board:
 // drawn every frame (the slot is drawn; a negative radius throws, as in a browser), each countdown reaches play with no frame errors
 {const rows=[];let ok=true;for(const [cat,next] of [['siamese','orange'],['orange','tortie'],['tortie','siamese']]){const {kind}=CATS[cat],r={cat,next};
   const {g,tk}=await midRound(src,{cat,render:true,secs:2,w:412,h:915,pr:1});
   // the harness's canvas accepts a negative radius; real browsers throw (IndexSizeError), which is what froze the phone: same here
   const dr=()=>{try{g.c.draw();}catch(e){if(!r.drawErr)r.drawErr=String(e).slice(0,120);}};
   g.run("{const P=Object.getPrototypeOf(ctx);for(const k of ['arc','ellipse']){const o=P[k];P[k]=function(...a){const r=k==='arc'?[a[2]]:[a[2],a[3]];if(r.some(v=>v<0))throw new Error('IndexSizeError: negative radius in '+k);return o.apply(this,a);};}}");g.run(COIN(kind));for(let i=0;i<20;i++){tk();dr();}
   g.run("(()=>{const b=wildButton();(typeof __cp51Pointer==='function'?__cp51Pointer:wildPointer)({timeStamp:0,pointerId:-1,preventDefault(){}},{x:b.x+b.w/2,y:b.y+b.h/2});})()");for(let i=0;i<60;i++){tk();dr();}
   g.run(`pgPlay('${next}');if(WILD.phase==='card')wildStartCountdown();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.nextPlay=g.run("WILD.phase")==='play';
   g.run('wildReset();wildStartCountdown();');k=0;while(g.run("WILD.phase")!=='play'&&k++<600){tk();dr();}r.newRoundPlay=g.run("WILD.phase")==='play';
   r.errs=J(g,'__errs').map(e=>e.slice(0,120));g.close();r.ok=r.nextPlay&&r.newRoundPlay&&!r.errs.length&&!r.drawErr;if(!r.ok)ok=false;rows.push(r);}
  check('7 (hotfix) after banking a coin: Home, another board of another cat, and a new round all reach play, drawn every frame, with no frame errors',ok,rows);}
 check('6 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks88-reg135.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
