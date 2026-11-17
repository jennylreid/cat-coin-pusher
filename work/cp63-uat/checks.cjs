// UAT 83 checks (CP-63, Jenny via PM Nov 17: the Tuxedo's power becomes Formal inspection, on UAT 82):
// 0 only the CP-63 block, the wheel-Yawn wait and the build name differ from the base UAT (base82.html = ../cp82/release.html)
// 1 the power through the real button, Levels 1-5 x 2 seeds x 60/30 fps, mid-round: up to 5 pieces lit, at most 2 prizes,
//   every lit coin lying on top of the pile (bottom layer untouched), nothing off a side during it, lit pieces carried over
//   the front, one charge used, state clean after, no frame errors
// 2 the button is locked while it plays (a second tap does nothing)
// 3 a wheel YAWN landing during an inspection waits for it, then plays CP-58's Yawn
// 4 Home (leaving the board) and the round ending mid-inspection leave nothing behind
// 5 seven simultaneous pickups: identical frame trace and sound calls to UAT 82 (frozen pickup)
// 6 the wheel's YAWN still plays CP-58's Yawn; 7 production untouched
// Usage: node checks83.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'base.html'),out=path.resolve(__dirname,'../../tickets/CP-63-evidence/uat'+JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))).displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex'),prodJ=path.join(root,'phone/CatCoinPusher-game.json'),prod0=sha(prodJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const WATCH="globalThis.__side=[];const __rc2=removeCoin;removeCoin=function(b){try{const p=b.rb.translation();if(Math.abs(p.x/M-200)>tableHalfAt(p.z/M)-2&&p.z/M<T.FRONT-10)__side.push({kind:b.kind,lit:(globalThis.__pk||[]).includes(b)});}catch(e){}return __rc2.apply(this,arguments);};"+
 "globalThis.__calls=[];const __co=callout;callout=function(t,o){__calls.push(String(t));return __co.apply(this,arguments);};";
const WHEEL="WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};";
const TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
const CLEAN="({cp63:!!CP63X,pgpx:!!PGPX,dance:!!(pawDance&&pawDance.cp63)})";
async function game(file,{seed,render=false}){const g=await make({sourceFile:file,render,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");return g;}
async function midRound(file,{seed,level=3,secs=12,fps=60}){const g=await game(file,{seed});const tk0=fps===60?g.tick:g.tick30,tk=()=>{try{tk0();}catch(e){g.run('__errs').push(String(e&&e.stack||e).slice(0,300));}};
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run("WILD.left=Math.max(WILD.left,60);PGU.boardCat='tuxedo';PG.powers=PG.powers||{};PG.powers.tuxedo=2;"+WATCH);return {g,tk};}
async function burst(file){const g=await game(file,{seed:5,render:true});
 for(let i=0;i<150;i++)g.tick();
 g.run("treatAwards.length=0;popSeed=0x2f6b4e1d;globalThis.__sounds=[];sfx.pickup=function(...a){__sounds.push(a)};S.muted=false;for(const [i,id] of ['sock','biscuit','sardine','egg','box','sock','cheese'].entries())queueTreatAward(id,70+i*40,null,false,'item')");
 const trace=[];for(let i=0;i<160;i++){g.tick();trace.push(J(g,'treatAwards.map(f=>({id:f.id,t:f.t,tr:f.tr,tm:f.tm,td:f.td,x0:f.x0,y0:f.y0,peak:f.peak,arrived:f.arrived,done:f.done}))'));}g.close();return JSON.stringify({trace,sounds:J(g,'__sounds')});}
(async()=>{
 if(sha(base)!==sha(path.resolve(__dirname,'../'+JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))).base+'/release.html')))throw new Error('base.html is not the base release');
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')))B=B.split(a).join(b);
  const i=B.lastIndexOf('</script>'),add=fs.readFileSync(path.join(__dirname,'cp63-added.js'),'utf8');B=B.slice(0,i)+add+'\n'+B.slice(i);
  check('0 only the CP-63 block, the wheel-Yawn wait and the build name differ from the base UAT',S===B);}
 // 1 + 2: the power through the real button
 notes.power=[];let ok1=true,lit=0,paid=0;
 for(const level of [1,2,3,4,5])for(const fps of [60,30])for(const seed of [1,2]){const {g,tk}=await midRound(src,{seed,level,fps});
  const playing=g.run("WILD.phase==='play'&&board.status==='playing'"),before=+g.run('pgpCount()');g.run(TAP);const started=g.run('!!CP63X');
  const picks=started?J(g,"CP63X.picks.map(o=>{const y=o.b.rb.translation().y/M;return {id:o.id,kind:o.kind,top:o.kind==='item'||y-cp63Half(o.b)>=COIN_HALF*1.5};})"):[];
  g.run("globalThis.__pk=CP63X?CP63X.picks.map(o=>o.b):[]");
  for(let i=0;i<fps;i++)tk();const lockedDuring=g.run('!pgpReady()'),t1=+g.run('CP63X?CP63X.t:-1');g.run(TAP);const t2=+g.run('CP63X?CP63X.t:-1'),countMid=+g.run('pgpCount()');
  for(let i=0;i<Math.round(4*fps);i++)tk();
  const roundEnded=g.run("WILD.phase!=='play'"),gone=+g.run('__pk.filter(b=>b.dead).length'),clean=J(g,CLEAN),side=J(g,'__side'),errs=J(g,'__errs'),words=J(g,'__calls').filter(c=>/INSPECTION|HMM|SPLENDID/.test(c));
  const row={level,fps,seed,playing,roundEnded,picks:picks.map(p=>p.id+(p.top?'':'(bottom!)')),gone,side,lockedDuring,secondTapIgnored:t2>=t1&&countMid===before-1,used:before-+g.run('pgpCount()'),clean,words,errs:errs.length};
  {const c=await midRound(src,{seed,level,fps});for(let i=0;i<Math.round(5*fps);i++)c.tk();row.sideNoPower=J(c.g,'__side').length;c.g.close();}
  notes.power.push(row);console.log(JSON.stringify(row));lit+=picks.length;paid+=gone;
  const prizes=picks.filter(p=>p.kind==='item').length;
  if(!(playing&&started&&picks.length>=1&&picks.length<=5&&prizes<=2&&picks.every(p=>p.top)&&!side.some(x=>x.lit)&&lockedDuring&&row.secondTapIgnored&&row.used===1&&!clean.cp63&&!clean.pgpx&&!clean.dance&&!errs.length))ok1=false;g.close();}
 check('1 Formal inspection through the real button, Levels 1-5 x 2 seeds x 60/30 fps: '+lit+' pieces lit (1-5 each, max 2 prizes, coins only from on top of the pile), '+paid+' of them carried off the front, no lit piece off a side (all pieces off a side during it: '+notes.power.reduce((n,r)=>n+r.side.length,0)+'; same windows without the power: '+notes.power.reduce((n,r)=>n+r.sideNoPower,0)+'), one charge used, clean after, no frame errors',ok1,notes.power.map(r=>[r.level,r.fps,r.seed,r.picks.length,r.gone,r.side.length,r.roundEnded?'won/ended':'']));
 check('2 the power button is locked while it plays; a second tap does nothing',notes.power.every(r=>r.lockedDuring&&r.secondTapIgnored));
 // 3: a wheel YAWN landing mid-inspection waits, then plays CP-58's Yawn
 {const {g,tk}=await midRound(src,{seed:4,level:3,fps:60});g.run(TAP);for(let i=0;i<30;i++)tk();g.run(WHEEL);const log=[];
  for(let i=0;i<10*60;i++){tk();if(i%15===0)log.push(g.run("(CP63X?'I':'-')+(W2_YAWN?(W2_YAWN.cp58?'Y':'y'):'-')"));}
  const s=log.join(' '),overlap=log.some(x=>x==='IY'||x==='Iy'),lastI=log.findLastIndex(x=>x[0]==='I'),firstY=log.findIndex(x=>x[1]==='Y');
  check('3 a wheel YAWN during an inspection waits for it, then plays CP-58\'s Yawn',!overlap&&lastI>=0&&firstY>lastI&&g.run('!WILD.dance')&&!J(g,'__errs').length,s);g.close();}
 // 4: Home and round end mid-inspection
 {const r=[];for(const how of ['home','timeup']){const {g,tk}=await midRound(src,{seed:3,level:2,fps:60});g.run(TAP);for(let i=0;i<150;i++)tk();
   const mid=g.run('!!CP63X');if(how==='home')g.run('wildExit()');else g.run('WILD.left=0.01');for(let i=0;i<240;i++)tk();
   r.push({how,mid,clean:J(g,CLEAN),errs:J(g,'__errs').length});g.close();}
  check('4 leaving the board or the round ending mid-inspection leaves nothing behind',r.every(x=>x.mid&&!x.clean.cp63&&!x.clean.pgpx&&!x.clean.dance&&!x.errs),r);}
 check('5 seven simultaneous pickups: identical frame trace and sound calls to the base UAT',(await burst(src))===(await burst(base)));
 {const {g,tk}=await midRound(src,{seed:2,level:3,fps:60});g.run(WHEEL);let n=0;while(!g.run('!!(W2_YAWN&&W2_YAWN.cp58)')&&n++<600)tk();const ok=g.run('!!(W2_YAWN&&W2_YAWN.cp58)');
  for(let i=0;i<6*60;i++)tk();check("6 the wheel's YAWN still plays CP-58's Yawn",ok&&g.run('!W2_YAWN')&&!J(g,'__errs').length);g.close();}
 check('7 production untouched',sha(prodJ)===prod0);
 fs.writeFileSync(path.join(out,'checks.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
