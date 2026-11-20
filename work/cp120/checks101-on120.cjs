// UAT 101 checks (CP-82, Jenny Nov 18: "For all the powers, the rule should be the words appear before the action is taken,
// because signs like meow and tortitude, in order to see them clearly, you want the words out of the way."): Sonic meow and
// Tortitude open with their big name alone, then the action with no words over it, as Formal inspection and Zoomies do.
// Usage: node checks101.cjs -> tickets/CP-82-evidence/uat101/checks101-on120.json + stills <power>-*.png
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8')),E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp100/release.html'),out=path.resolve(__dirname,'../../tickets/CP-94-evidence/uat120');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const LEAD=1.25,TAP="(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()";
const POW={siamese:{id:'sonic',dur:5,word:'SONIC MEOW!'},tortie:{id:'tortitude',dur:1.6,word:'TORTITUDE!'}};
// spies: words drawn during the power, the title's random draws, pops, the action's sounds (with the power's clock)
const SPY="globalThis.__wt=[];{const w=wildText;wildText=function(t,...a){if(PGPX&&!/^Level [0-9]/.test(String(t)))__wt.push([PGPX.id,+PGPX.t.toFixed(2),String(t)]);return w.call(this,t,...a);};}"+
 "globalThis.__draws=0;{const r=Math.random;Math.random=function(){{const st=new Error().stack;if(/cp73Draws|at callout /.test(st)&&/pgpUse/.test(st))__draws++;}return r.apply(this,arguments)};}"+
 "globalThis.__bam=0;{const b=sfx.bam;sfx.bam=function(){__bam++;return b.apply(this,arguments)};}"+
 "globalThis.__snd=[];const __sp=(o,k,tag)=>{const f=o[k];o[k]=function(a,...r){__snd.push([tag+':'+a,PGPX?PGPX.id:'-',PGPX?+PGPX.t.toFixed(2):-1]);return f.call(this,a,...r);};};"+
 "{const f=wildFinish;wildFinish=function(){if(PGPX)return;return f.apply(this,arguments);};}__sp(sfx,'wild','wild');__sp(sfx,'dance','dance');{const f=pgSfx;pgSfx=function(a,...r){__snd.push(['pg:'+a,PGPX?PGPX.id:'-',PGPX?+PGPX.t.toFixed(2):-1]);return f.call(this,a,...r);};}";
async function midRound(file,{cat,seed,level=3,secs=10,fps=60,render=false,w=400,h=889,pr=1}){
 const g=render?await make33({sourceFile:file,render:true,seed,pixelRatio:pr,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}}):await make({sourceFile:file,render:false,width:w,height:h,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 if(render)g.c.Path2D=require(NAPI).Path2D;g.c.atob=g.c.atob||(s=>Buffer.from(s,'base64').toString('latin1'));
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.tick=()=>{ms+=1000/60;t();};g.tick30=()=>{ms+=1000/30;g.run('step();step();update(1/30);');};const tk=fps===60?g.tick:g.tick30;
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(${level-1},PG_SWITCH_LEVEL);PG.lv.sel=${level};if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 const per=Math.round(fps/2);for(let k=0;k<secs*fps;k++){if(k%per===0)tap(200+110*Math.sin(k/fps*1.2+seed),560);tk();}
 g.run(`WILD.left=Math.max(WILD.left,60);WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.${cat}=2;`+SPY);return {g,tk};}
(async()=>{
 // 0. the build
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp119/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='d559538c645a9de7ec3aeaea271bf92505a6f137a4c13c0f2c036a9b578b832a')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 119 + build name + the CP-94 edits + cp94-orange-dance.js + cp98-orange-eyes.js (everything else unchanged)',S===B&&m.length===1);}
 // 0b. the Zoomies sound fix: the three embedded recordings are louder.py's files byte for byte, played at 0.35 (the yawns' gain)
 {const {g}=await midRound(src,{cat:'orange',seed:1,secs:1});const A=path.resolve(__dirname,'../cp72-pusher-sound/audio');
  const ok=['P1','P2','P3'].every(k=>g.run('CP72Z.B64.'+k)===fs.readFileSync(path.join(A,`zoomies-game-${k}-v2.mp3`)).toString('base64'))&&+g.run('CP72Z.gain')===.35&&+g.run('CP79.gain')===.35;g.close();
  check('0b Zoomies sound fix: P1-P3 are the re-levelled recordings (work/cp72-pusher-sound/louder.py), played at 0.35 like the yawn sounds',ok,JSON.parse(fs.readFileSync(path.join(A,'info-v2.json'),'utf8')));}
 // 1. timeline against UAT 100 (each power, 2 seeds x 60/30 fps, Level 3): the title alone first, the action after it,
 // with its own sounds at its start; nothing else over it; the power lasts 1.25 s longer
 {const rows=[];let ok=true;for(const cat of ['siamese','tortie'])for(const fps of [60,30])for(const seed of [1,2]){const P=POW[cat],row={cat,fps,seed};
   for(const [tag,file] of [['a',src],['b',base]]){const {g,tk}=await midRound(file,{cat,seed,fps});g.run(TAP);
    const r={title:null,act:null,actLen:0,len:0,titleWithAct:0,callMoves:[],reach2:[]};let qPrev=null;
    for(let i=0;i<Math.round(9*fps)&&g.run('!!PGPX');i++){const p0=J(g,'PGPX?{id:PGPX.id,t:PGPX.t}:null');tk();
     const s=J(g,"({id:PGPX?PGPX.id:null,p:PGPX?PGPX.t:-1,big:typeof cp82BigT==='function'?cp82BigT():-1,reach:pglReach(),q:callouts.length?{w:callouts[0].word,t:callouts[0].t}:null})");
     r.len+=fps===60?1/60:1/30;
     if(s.big>=0)r.title=r.title?{from:r.title.from,to:+s.p.toFixed(2)}:{from:+s.p.toFixed(2),to:+s.p.toFixed(2)};
     if(s.id===P.id){if(r.act==null)r.act=+(r.len-s.p).toFixed(3);r.actLen=+s.p.toFixed(2);if(s.big>=0)r.titleWithAct++;if(s.reach===2)r.reach2.push(+s.p.toFixed(2));}
     if(s.id&&s.q&&qPrev&&s.q.w===qPrev.w&&s.q.t>qPrev.t&&tag==='a')r.callMoves.push([s.id,+s.p.toFixed(2),s.q.w]);qPrev=s.q;}
    r.len=+r.len.toFixed(2);r.words=J(g,'__wt');r.draws=+g.run('__draws');r.bam=+g.run('__bam');r.snd=J(g,'__snd');r.used=2-+g.run('pgpCount()');r.errs=J(g,'__errs');
    r.clean=g.run("!PGPX&&(typeof CP82W==='undefined'||!CP82W)");r.callAfter=J(g,'callouts.map(c=>c.word)');row[tag]=r;g.close();}
   const a=row.a,b=row.b,OWN=x=>/^(pg:meow|wild:topple|dance:roar)$/.test(x[0]),sa=a.snd.filter(x=>x[1]===P.id&&x[2]<.1&&OWN(x)).map(x=>x[0]),sb=b.snd.filter(x=>x[1]===P.id&&x[2]<.1&&OWN(x)).map(x=>x[0]); // the powers' own sounds (game sounds such as a whistle can share the tap's frame)
   const C={title:!!(a.title&&a.title.from<.05&&a.title.to>=1.1&&a.title.to<LEAD),wait:a.act!=null&&Math.abs(a.act-LEAD)<.05,actLen:Math.abs(a.actLen-b.actLen)<.05&&Math.abs(b.actLen-P.dur)<.05,
    len:Math.abs(a.len-(b.len+LEAD))<.1,noTitleOverAct:!a.titleWithAct,noCallouts:!a.callMoves.length,
    sounds:JSON.stringify(sa)===JSON.stringify(sb)&&sa.length>=2&&!a.snd.some(x=>x[1]==='cp82title'&&/meow|topple|roar/.test(x[0])),
    reach:cat!=='siamese'||(a.reach2.length>0&&a.reach2[0]<.05&&Math.max(...a.reach2)>4.9),
    draws:a.draws===b.draws&&a.draws===2,pop:a.bam>=1,used:a.used===1&&b.used===1,clean:a.clean,errs:!a.errs.length&&!b.errs.length};
   row.fails=Object.keys(C).filter(k=>!C[k]);if(row.fails.length)ok=false;rows.push(row);console.log(JSON.stringify({cat,fps,seed,title:a.title,act:a.act,actLen:[a.actLen,b.actLen],len:[a.len,b.len],snd:sa,sndBase:sb,sndA:a.snd.filter(x=>x[1]===P.id&&x[2]<.2),sndB:b.snd.filter(x=>x[1]===P.id&&x[2]<.2),fails:row.fails,errs:a.errs.concat(b.errs)}));}
  notes.timeline=rows.map(r=>({cat:r.cat,fps:r.fps,seed:r.seed,title:r.a.title,actStart:r.a.act,actLen:[r.a.actLen,r.b.actLen],len:[r.a.len,r.b.len],sounds:r.a.snd,fails:r.fails}));
  check('1 Sonic meow and Tortitude (2 seeds x 60/30 fps each, against UAT 100): the big name shows alone from the tap for 1.2 s; the action starts at 1.25 s and runs as long as before (5 s / 1.6 s), with the same sounds at its start (meow + topple; roar + topple); Sonic meow\'s 2x reach runs its full 5 s from the action\'s start; none of the action sounds play during the title; no other callout moves while the power plays; the title makes the same 2 random draws as the old callout; one charge; clean after',ok,rows.map(r=>[r.cat,r.fps,r.seed,r.fails]));}
 // 2. another callout during the power waits and shows after it
 {const rows=[];let ok=true;for(const cat of ['siamese','tortie']){const {g,tk}=await midRound(src,{cat,seed:5});g.run(TAP);for(let i=0;i<30;i++)tk();g.run("callout('COIN RAIN!',{color:'#7dd3ff',dur:1.2})");
   let during=0,firstAfter=null,t=0;for(let i=0;i<9*60;i++){tk();const busy=g.run('!!PGPX');t+=1/60;const q=J(g,'callouts.length?callouts[0].t:null');if(busy&&q>0)during++;if(!busy&&q>0&&firstAfter==null)firstAfter=+t.toFixed(2);if(!busy&&!g.run('callouts.length'))break;}
   const r={cat,during,firstAfter,errs:J(g,'__errs').length};rows.push(r);if(!(r.during===0&&r.firstAfter!=null&&!r.errs))ok=false;g.close();}
  check('2 a callout made while the power plays (COIN RAIN! 0.5 s after the tap) waits, then shows once the power has ended',ok,rows);}
 // 3. on screen at 412x915 and 360x640: the title alone, then the action with no title or words
 {const rows=[];let ok=true;for(const cat of ['siamese','tortie'])for(const [w,h] of [[412,915],[360,640]]){const P=POW[cat],sz=w+'x'+h,{g,tk}=await midRound(src,{cat,seed:7,w,h,pr:2,render:true});
   const shot=n=>{g.c.draw();fs.writeFileSync(path.join(out,`${P.id}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
   g.run(TAP);const row={cat,sz,shots:[]};const at=cat==='siamese'?{'1-title':.5,'2-action':LEAD+.5,'3-action':LEAD+2.5}:{'1-title':.5,'2-action':LEAD+.15,'3-action':LEAD+.6};const taken=new Set();let tt=0;
   for(let i=0;i<9*60&&g.run('!!PGPX');i++){tk();tt+=1/60;if(i%10===0)g.c.draw();for(const [n,v] of Object.entries(at))if(!taken.has(n)&&tt>=v){taken.add(n);shot(n);row.shots.push([n,g.run('PGPX?PGPX.id:null'),+g.run('cp82BigT()').toFixed(2)]);}}
   row.words=J(g,'__wt');row.errs=J(g,'__errs').length;
   if(cat==='siamese'&&w===360){const B=await midRound(base,{cat,seed:7,w,h,pr:2,render:true});B.g.run(TAP);for(let i=0;i<3*60;i++){B.tk();if(i%10===0)B.g.c.draw();}row.baseWords=[...new Set(J(B.g,'__wt').map(x=>x[0]+':'+x[2]))];if(!row.baseWords.includes('sonic:2× REACH'))ok=false;B.g.close();}
   rows.push(row);
   if(!(row.shots.length===3&&row.shots[0][1]==='cp82title'&&row.shots[0][2]>=0&&row.shots.slice(1).every(s=>s[1]===P.id&&s[2]<0)&&!row.words.length&&!row.errs))ok=false;g.close();}
  notes.screen=rows;check('3 at 412x915 and 360x640: stills of each title alone and the action under way with no title or words drawn over it (UAT 100 drew "2× REACH" over the Sonic meow rings)',ok,rows);}
 // 4. Formal inspection and Zoomies are not touched by CP-82: same start as in UAT 100; Hug follows the title-first rule from UAT 106 (CP-74)
 {const rows=[];let ok=true;for(const [cat,id] of [['ragdoll','hug'],['tuxedo','inspect'],['orange','zoomies72']]){const r={cat};
   for(const [tag,file] of [['a',src],['b',base]]){const {g,tk}=await midRound(file,{cat,seed:4});g.run(TAP);const s=[];for(let i=0;i<90;i++){tk();if(i%15===0)s.push(J(g,"[PGPX?PGPX.id:null,PGPX?+PGPX.t.toFixed(3):-1,callouts.map(c=>c.word).join('|'),typeof CP82W!=='undefined'&&CP82W?CP82W.word:null]"));}r[tag]=s;r[tag+'errs']=J(g,'__errs').length;g.close();}
   // UAT 106 (CP-74): Hug now follows the CP-82 rule: "HUG!" alone (PGPX cp82title) until 1.25 s after the tap, then the hug
   if(id==='hug'){const title=r.a.filter(x=>x[0]==='cp82title'),hug=r.a.filter(x=>x[0]==='hug');
    r.same=title.length>0&&title.every(x=>x[3]==='HUG!')&&r.a[0][0]==='cp82title'&&hug.length>0&&hug[0][1]<.1&&r.a.indexOf(hug[0])===r.a.length-1&&!r.aerrs;}
   else r.same=JSON.stringify(r.a.map(x=>x.slice(0,3)))===JSON.stringify(r.b.map(x=>x.slice(0,3)))&&r.a[0][0]===id&&!r.aerrs&&!r.berrs;if(!r.same)ok=false;rows.push(r);}
  check('4 Hug opens with its name first ("HUG!" alone until 1.25 s, then the hug; UAT 106, CP-74), Formal inspection and Zoomies start exactly as in UAT 100',ok,rows.map(r=>[r.cat,r.same,r.a[1],r.a[r.a.length-1]]));}
 check('5 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks101-on120.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
