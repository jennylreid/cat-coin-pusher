// UAT 70 (CP-51 fix) checks: END ROUND label, Level 1 cheese/shrimp at production's spots. Developer off, real runtime.
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm'),crypto=require('crypto');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp69/release.html');
const OUT=path.resolve(__dirname,'../../tickets/CP-51-evidence/uat70');fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[],notes={};function check(n,ok,info){(ok?passed:failed).push(n);console.log((ok?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
async function game(file,o={}){const g=await make({sourceFile:file,render:true,seed:5,pixelRatio:1,width:o.w||400,height:o.h||889,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);g.c.draw();return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const level=(g,p,s)=>{g.run(`pglLv().passed=${p};pglLv().sel=${s};pgSave();if(WILD.phase==='card')wildReset();`);g.ticks(10);g.c.draw();};
const play=g=>{const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);const ok=g.until("WILD.phase==='play'",900);return ok;};
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const c=r=>[r.x+r.w/2,r.y+r.h/2];
(async()=>{
 const root=path.resolve(__dirname,'..','..'),prod=path.join(root,'phone','CatCoinPusher-game.json'),prod0=sha(prod);
 const text=fs.readFileSync(src,'utf8'),before=fs.readFileSync(base,'utf8');
 const restored=text.replace("const BUILD = '2026.11.16 UAT 70';","const BUILD = '2026.11.16 UAT 69';").replace("wildButtonDraw(R.finish,'END ROUND',","wildButtonDraw(R.finish,'FINISH ROUND',").replace("p:[['cheese',140,610],['shrimp',260,690]]","p:[['cheese',110,610],['shrimp',290,575]]");
 check('0 only the build name, the button label and Level 1\'s two prize spots differ from UAT 69 (CP-52 art untouched)',restored===before);
 // Level 1 board
 const pos=[];for(const [nm,f] of [['UAT 69',base],['UAT 70',src]]){const g=await game(f,{w:360,h:640});level(g,0,1);play(g);g.ticks(5);
  const at=()=>J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return [b.id,Math.round(q.x/M),Math.round(q.z/M)]}).sort()");
  const a0=at();g.ticks(85);const a1=at();pos.push([nm,a0,a1]);
  if(nm==='UAT 70'){notes.l1=J(g,"[...new Set(bodies.filter(b=>!b.dead).map(b=>b.kind))].sort()");shot(g,'level1-start-uat70-360x640');notes.l1Errs=J(g,'__errs');
   check('1a Level 1: cheese at x 140, depth 610 and shrimp at x 260, depth 690 at the start',JSON.stringify(a0)===JSON.stringify([['cheese',140,610],['shrimp',260,690]]),a0);
   check('1b Level 1 still only gold coins plus the cheese and shrimp',notes.l1.every(k=>['coin','silver','item'].includes(k)),notes.l1);
   check('1c both prizes still on the board 1.5 s after GO',a1.length===2,a1);}
  else shot(g,'level1-start-uat69-360x640');}
 notes.positions=pos;
 // Pause pop-up label and behaviour
 {const g=await game(src,{w:360,h:640});level(g,1,2);play(g);g.ticks(120);
  g.run("globalThis.__lbl=[];const __wb=wildButtonDraw;wildButtonDraw=function(r,l,...a){__lbl.push(l);return __wb(r,l,...a);};");
  const b=J(g,'cp51Btn()');g.tap(b.x+b.w/2,b.y+b.h/2);g.ticks(3);g.c.draw();shot(g,'pause-uat70-360x640');const lbl=J(g,'__lbl');
  check('2a the pop-up shows RESUME and END ROUND (no FINISH ROUND)',J(g,'cp51Paused')&&lbl.includes('END ROUND')&&lbl.includes('RESUME')&&!lbl.includes('FINISH ROUND'),[...new Set(lbl)]);
  g.tap(...c(J(g,'cp51Rects()').finish));g.until("WILD.phase==='end'",600);g.ticks(100);shot(g,'end-round-uat70-360x640');
  check('2b END ROUND does what Finish did: the normal end card with ROUND OVER',J(g,"WILD.phase")==='end'&&J(g,'WILD.reason')==='finish'&&!J(g,'cp51Paused'),J(g,'[WILD.phase,WILD.reason]'));
  notes.popErrs=J(g,'__errs');}
 check('3 no frame errors',!notes.l1Errs.length&&!notes.popErrs.length,[notes.l1Errs,notes.popErrs]);
 check('4 production untouched',sha(prod)===prod0);
 fs.writeFileSync(path.join(OUT,'checks70.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
