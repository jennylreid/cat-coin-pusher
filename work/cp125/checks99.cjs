// CP-99 Treat toss meter out of the way (UAT 125). Usage: node checks99.cjs -> PASS/FAIL lines + checks99.json
// 0 the build is published UAT 124 + build name + the CP-99 meter edits + cp99-meter.js
// 1 tall screen (400x889, like 412x915): the meter is beneath the board, between the table's front edge and the bottom
//   corner text, scaled down evenly to fit (0.7-1)
// 2 short screen (360x640): no room beneath, so the meter sits just under the top bar (header bottom + 42), full size, above
//   the highest treat
// 3 the toss plays exactly as on UAT 124 on both screens (treats in the air, catches, streak, count, coins, every piece, every
//   frame), tapping each treat as it flies
// 4 production and the UAT channel untouched
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'..',V.base,'release.html');
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[];function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
async function game(file,{w=400,h=889,seed=7}={}){
 const g=await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);g.tick=()=>{ms+=1000/60;t();};
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)t();tap(200,700);for(let i=0;i<30;i++)t();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<200;i++)g.tick();
 g.run("WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;WILD.tossPending={f:null,wait:9};");
 for(let i=0;i<40&&!g.run('!!WILD.toss');i++)g.tick();return g;}
const GEO="JSON.stringify({front:skyScreen(200,T.FRONT,0).y,bottomY:hudLayout().bottomY,header:hudLayout().headerBottom,y:cp99MeterY(),k:cp99MeterK(),beneath:cp99Beneath(),toss:!!WILD.toss})";
const TR="JSON.stringify(WILD.toss?[WILD.toss.phase,WILD.toss.caught,WILD.toss.next,WILD.toss.streak,WILD.toss.air.map(o=>[o.id,o.state,+o.t.toFixed(3)]),S.coins,bodies.filter(b=>!b.dead).length,+bodies.reduce((s,b)=>{const p=b.rb.translation();return s+p.x*3+p.y*5+p.z*7;},0).toFixed(3)]:['done',S.coins])";
// tap each treat once it has flown 0.3 s (the same taps in both builds)
const TAPS="(()=>{const D=WILD.toss;if(!D)return 0;let n=0;for(const o of D.air){if(o.state!=='air'||o.t<.3||o.tapped)continue;o.tapped=1;const q=tossPos(o);tossTap({},{x:q.x,y:q.y});n++;}return n;})()";
async function play(file,w,h){const g=await game(file,{w,h});const tr=[];let taps=0;for(let i=0;i<60*16&&g.run('!!WILD.toss');i++){taps+=+g.run(TAPS);g.tick();tr.push(g.run(TR));}
 const r={hash:crypto.createHash('sha256').update(tr.join('|')).digest('hex'),frames:tr.length,taps,caught:JSON.parse(tr[tr.length-2]||'[]')[1],errs:JSON.parse(g.run('JSON.stringify(__errs)'))};g.close();return r;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');let ok=sha(base)===V.baseSHA256;const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
  for(const [a,b] of E.edits){if(B.split(a).length!==2)ok=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published UAT 124 + build name + the CP-99 meter edits + cp99-meter.js (everything else unchanged)',ok&&S===B);}
 {const g=await game(src,{w:400,h:889});const o=JSON.parse(g.run(GEO));g.close();
  check('1 tall screen (400x889): the meter is beneath the board, between the front edge and the corner text, scaled to fit',o.toss&&o.beneath&&o.y-20*o.k>=o.front&&o.y+20*o.k<=o.bottomY&&o.k>=.7&&o.k<=1,o);}
 {const g=await game(src,{w:360,h:640});const o=JSON.parse(g.run(GEO));g.close();
  check('2 short screen (360x640): no room beneath, so just under the top bar, full size, above the highest treat (~197)',o.toss&&!o.beneath&&Math.abs(o.y-(o.header+42))<1e-6&&o.k===1&&o.y+20<197,o);}
 {const res={};let ok=true;for(const [w,h] of [[400,889],[360,640]]){const a=await play(src,w,h),b=await play(base,w,h);res[w+'x'+h]={same:a.hash===b.hash,frames:[a.frames,b.frames],taps:[a.taps,b.taps],caught:[a.caught,b.caught],errs:a.errs.length+b.errs.length};
   if(!(a.hash===b.hash&&a.taps>0&&!a.errs.length&&!b.errs.length))ok=false;}
  check('3 the toss plays exactly as on UAT 124 on both screens (treats, catches, streak, count, coins, every piece, every frame)',ok,res);}
 check('4 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 const out=path.resolve(__dirname,'../../tickets/CP-99-evidence/uat'+V.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'checks99.json'),JSON.stringify({build:src,passed:failed.length===0,passedChecks:passed,failed},null,1));
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
