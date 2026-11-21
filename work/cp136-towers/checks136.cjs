// CP-93 Tower physics checks (UAT build folder; reads release-version.json and edits.json).
// Usage: node checks136.cjs -> tickets/CP-93-evidence/uat<NNN>/checks136.json
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {game}=require('../cp43/harness.cjs');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))),U=V.displayName.split(' ').pop();
const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(E.base),out=path.resolve(__dirname,'../../tickets/CP-93-evidence/uat'+U);fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);notes[n]=info;console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const PUSH_MAX_OK=430;
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function boot(file,seed,storage){const g=await game({src:file,seed,render:false,storage:storage||{}});
 g.run('S.muted=true;S.dev=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
const level=(g,n)=>{g.run(`PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};pgPlay('tuxedo');wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);};
const giant=(g,seed)=>{g.run(`CP93.seed=${seed}*7919;labStart('giant')`);g.until("WILD.phase==='play'",900);};
function drop(g,s){if(!g.run("WILD.phase==='play'"))return;const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<s.last)s.n=0;s.last=ph;
 if(s.n<2&&s.t>=s.ok){const r0=+g.run('board.released');g.run(`tryDrop({x:${[150,250,200,120,280][s.d%5]},y:DROP_Y})`);if(+g.run('board.released')>r0){s.d++;s.n++;s.ok=s.t+17;}}}
function play(g,secs){const s={last:0,n:0,t:0,ok:0,d:0};for(let i=0;i<secs*60;i++){s.t=i;drop(g,s);g.tick();}return s.d;}
const TOW="bodies.filter(b=>!b.dead&&b.kind==='stack').map(b=>{const p=b.rb.translation();return [+(p.x/M).toFixed(2),+(p.z/M).toFixed(2),+(p.y/M).toFixed(2)]})";
const PHYS="bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93==null).map(b=>({m:+(b.rb.mass()/b.n).toFixed(4),g:b.rb.gravityScale(),f:+b.rb.collider(0).friction().toFixed(3),lim:b.limit}))";
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(base,'utf8');let ok=sha(base)===V.baseSHA256;for(const [a,b] of E.edits){if(B.split(a).length!==2)ok=false;B=B.split(a).join(b);}
  for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is the published base ('+V.base+') + build name + cp93-physics.js (everything else unchanged)',ok&&S===B);}
 // 1: Today is the default and plays exactly as the base (same seed, same drops: every tower in the same place)
 {const r={};for(const [k,f] of [['base',base],['build',src]]){const g=await boot(f,5);const m=k==='build'?g.run('CP93P.get()'):'n/a';
   level(g,5);play(g,15);const l5=J(g,TOW);giant(g,2);play(g,20);const gi=J(g,TOW);r[k]={m,l5,gi,errs:J(g,'__errs').length};}
  check('1 default "Today": Level 5 and Giant towers play exactly as the base (towers in the same places after 15 s / 20 s of drops)',r.build.m==='today'&&JSON.stringify(r.base.l5)===JSON.stringify(r.build.l5)&&JSON.stringify(r.base.gi)===JSON.stringify(r.build.gi)&&r.build.l5.length>0&&r.build.errs===0,{m:r.build.m,l5:r.build.l5.length,giant:r.build.gi.length,errs:r.build.errs});}
 // 2-4: A on the level boards, live
 {const g=await boot(src,7);level(g,5);const t0=J(g,PHYS);g.run("CP93P.set('a')");g.tick();const a=J(g,PHYS);const key=g.run("localStorage.getItem(CP93P.KEY)");
  check('2 choosing "A: heavy towers, fast spill" saves it on the phone and switches the towers in play at once: twice the weight (5x today), 2x gravity, grip 0.25, no tip after a shove',key==='a'&&t0.length>0&&a.every((x,i)=>x.m>t0[i].m*4.5&&x.g===2&&x.f===0.25&&x.lim===1e9),{key,today:t0[0],a:a[0]});
  const d=play(g,20);const st=J(g,`{tw:${TOW},errs:__errs,bodies:bodies.length}`);
  check('3 A on Level 5: 20 s of drops with no frame errors, towers on the board',st.errs.length===0&&st.tw.length>0,{drops:d,towers:st.tw.length,bodies:st.bodies,errs:st.errs.slice(0,2)});
  g.run("CP93P.set('today')");g.tick();const back=J(g,PHYS);
  check('4 back to "Today" puts the towers in play back to today\'s weight, gravity, grip and tip rule',back.every((x,i)=>Math.abs(x.m-t0[i].m)<1e-4&&x.g===1&&Math.abs(x.f-t0[i].f)<1e-3&&x.lim===t0[i].lim),{back:back[0],today:t0[0]});}
 // 5: A's spill: a broken tower's coins drop at 2.5x gravity with little drag, then back to normal
 {const g=await boot(src,9);g.run("CP93P.set('a')");level(g,5);const r=J(g,"(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='stack');const n0=bodies.length;breakStack(b);const nw=bodies.slice(n0);return {n:nw.length,g:nw.map(c=>c.rb.gravityScale()),d:nw.map(c=>+c.rb.linearDamping().toFixed(2))}})()");
  g.ticks(90);const later=J(g,"bodies.filter(c=>c.cp93pUntil).length");
  check('5 A: a broken tower\'s coins fall at 2.5x gravity with drag 0.05, back to normal after 1.2 s',r.n>0&&r.g.every(x=>x===2.5)&&r.d.every(x=>x===0.05)&&later===0,{...r,stillFast:later});}
 // 6: A: Quake knocks the towers near the top: on Level 2 (towers of 10 and 12 coins) at least one spills; today none
 {const r={};for(const m of ['today','a']){const g=await boot(src,11);g.run(`CP93P.set('${m}')`);level(g,2);g.ticks(60);
   g.run("CP93T={n:0};{const b0=breakStack;breakStack=function(b){if(b&&!b.dead&&b.kind==='stack')CP93T.n++;return b0(b);};}");
   g.run("board.quakes=Math.max(1,board.quakes);useCatquake()");g.ticks(300);r[m]=+g.run('CP93T.n');}
  check('6 A: Quake spills towers on Level 2 (Today: none)',r.today===0&&r.a>=1,r);}
 // 7-8: C and A + C on the giant board
 for(const [m,n] of [['c','7 "C: giant towers on the shelf"'],['ac','8 "A + C"']]){const g=await boot(src,13);g.run(`CP93P.set('${m}')`);giant(g,1);
  const st=J(g,`{shelf:!!CP93.shelf,heavy:!!CP93.heavy,deck:[PUSH_MIN,PUSH_MAX],base:bodies.filter(b=>!b.dead&&b.cp93Seg===0).map(b=>{const p=b.rb.translation();return [Math.round(p.z/M),Math.round(p.y/M)]}),tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).length}`);
  const d=play(g,60);const r=J(g,"{tw:(CP93.tw||[]).map(t=>t.why||null),broke:CP93.stats.broke,got:LAB.st.got,errs:__errs}");
  const ok=st.shelf&&st.heavy===(m==='ac')&&st.base.length===3&&st.base.every(([z,y])=>z>PUSH_MAX_OK&&y<40)&&st.tops===3&&r.errs.length===0&&r.tw.some(w=>w==='edge')&&r.got>=1;
  check(n+': the giant towers stand on the shelf in front of the deck (deck 350/420), a prize on each; with drops at least one is pushed to the ledge and spills within 60 s, counted; no frame errors',ok,{st,drops:d,...r,errs:r.errs.slice(0,2)});}
 check('9 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks136.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));
 console.log(failed.length?'FAILED '+failed.length:'ALL PASS '+passed.length);process.exit(failed.length?1:0);})().catch(e=>{console.error(e);process.exit(1);});
