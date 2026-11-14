// UAT 54 checks: UAT 53's (below; taps now come after the title's intro) plus the title screen that stays until TAP TO PLAY,
// with a bigger, slower coin rain (section 7).
// UAT 53 checks: CP-45 follow-ups (Jenny, Nov 14): the Quake coin collected on the frozen default path (Pop) like every
// other piece, the path itself unchanged (traced against UAT 52), no pinstriped box anywhere; no "Wild" in what a player sees
// (the Tuxedo's board is "Tuxedo" for now); the Dance break cat moves on the tap beat. Sound on, strict fake Web Audio.
// ONLY=1,2,... runs some sections (the desktop canvas runs out of memory if one process draws too much).
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','..','tickets','CP-45-evidence','uat54'));fs.mkdirSync(OUT,{recursive:true});
const OLD=path.resolve(__dirname,'..','cp52','release.html');
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,600):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
function play(g,n,errs,every=1){for(let i=0;i<n;i++){try{g.tick();if(i%every===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
async function g0(seed=3,dev=true){const g=await game({src,seed,render:true});const st=strictAudio(g);g.run('S.muted=false;S.dev='+dev);const errs=[];
 g.run(`globalThis.__fl=[];globalThis.__snd=[];globalThis.__w={};const q=queueTreatAward;queueTreatAward=function(id,x,b,p,k){const f=q(id,x,b,p,k);__fl.push({id:f.id,kind:f.kind,pop:f.pop});return f;};
  const sp=sfx.pickup;sfx.pickup=function(k,...a){__snd.push(k);return sp.call(this,k,...a);};const ss=sfx.special;sfx.special=function(...a){__snd.push('special');return ss.apply(this,a);};
  for(const k of ['fillText','strokeText']){const P=Object.getPrototypeOf(ctx),o=P[k];P[k]=function(t,...a){if(/wild/i.test(String(t)))__w[String(t)]=(__w[String(t)]||0)+1;return o.call(this,t,...a);};}`);
 play(g,120,errs,10);g.tap(200,400);play(g,40,errs);return {g,st,errs};}
function round(g,errs,secs=60){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)play(g,1,errs,20);
 for(let s=0;s<secs&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);
  for(let i=0;i<60;i++){try{g.tick();if(i%20===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return;}g.run('if(PANEL.on)__panel=1');}}g.run('holding=false');play(g,200,errs,10);}
// one pickup traced frame by frame from the same random state (popSeed) in a build, on the Tuxedo's board during a round
async function trace(srcF,id,kind,x){const g=await game({src:srcF,seed:3});g.ticks(120);g.tap(200,400);g.ticks(40);g.run('wildStartCountdown()');g.ticks(260);
 const r=J(g,`(()=>{treatAwards.length=0;popSeed=0x2f6b4e1d;const f=queueTreatAward('${id}',${x},null,false,'${kind}');const T=f.tr+f.tm+f.ts+f.td,pts=[];for(let t=0;t<=T+1e-6;t+=1/60){const q=pickupPoint(f,t);pts.push([q.x,q.y,q.s,q.rot,q.flip].map(v=>+v.toFixed(4)));}
  return {pop:f.pop,x0:f.x0,y0:f.y0,peak:{x:f.mx,y:f.my},peakW:prizeWidth('${id}',f.ms),tr:f.tr,tm:f.tm,td:f.td,pts,end:pts[pts.length-1],quake:quakeTarget()};})()`);g.close();return r;}
(async()=>{const ONLY=process.env.ONLY?process.env.ONLY.split(',').map(Number):null,on=n=>!ONLY||ONLY.includes(n);
 // 1. the frozen path is unchanged for every piece that already used it; the Quake coin now uses it
 if(on(1)){const same=[],ids=[['cheese','item'],['shrimp','item'],['tuna','item'],['duck','item'],['bowtie','item'],['milk','item'],['rain5','item'],['rain25','item'],['note','item'],['fish','item'],['laser','item'],['heart','item']];
  for(const [id,k] of ids){const a=await trace(OLD,id,k,140),b=await trace(src,id,k,140);same.push([id,JSON.stringify(a.pts)===JSON.stringify(b.pts)&&a.pop&&b.pop]);}
  check('the default pickup (Pop) is unchanged: every prize and coin that used it traces frame for frame the same as UAT 52',same.every(s=>s[1]),same);
  const q2=await trace(OLD,'quake','quake',140),q3=await trace(src,'quake','quake',140),c3=await trace(src,'cheese','item',140);
  check('UAT 52 for comparison: the Quake coin went to the middle of the screen at 70% (280 px) on its own path',!q2.pop&&Math.round(q2.peakW)===280&&Math.abs(q2.peak.x-200)<20,{pop:q2.pop,w:Math.round(q2.peakW),peak:q2.peak});
  check('the Quake coin now pops from where it fell, to the same size (120 px, 30%), with the same timings as the prizes',q3.pop&&Math.round(q3.peakW)===120&&Math.abs(q3.pts[0][0]-q3.x0)<.01&&Math.abs(q3.pts[0][1]-q3.y0)<.01&&Math.abs(q3.peak.x-q3.x0)<=28.5&&q3.y0-q3.peak.y>=150*.85&&q3.tr===c3.tr&&q3.tm===c3.tm&&q3.td===c3.td,{w:Math.round(q3.peakW),start:q3.pts[0].slice(0,2),x0:q3.x0,peak:q3.peak,t:[q3.tr,q3.tm,q3.td],prize:[c3.tr,c3.tm,c3.td]});
  check('it still ends at the Quake button (the count goes up there)',Math.hypot(q3.end[0]-q3.quake.x,q3.end[1]-q3.quake.y)<1,{end:q3.end.slice(0,2),button:q3.quake});
  const {g,errs}=await g0();check('build label',g.run('BUILD')==='2026.11.14 UAT 54',g.run('BUILD'));g.run('wildStartCountdown()');play(g,240,errs,20);
  g.run('treatAwards.length=0;__snd.length=0');g.run("queueTreatAward('quake',150,null,false,'quake')");let pb=0;for(let i=0;i<80;i++){g.tick();g.c.draw();if(g.run('PANEL.on'))pb++;if(i===18)shot(g,'quake-pop');}
  const snd=J(g,'__snd');check('no pinstriped box; sounds: the ledge bell like every piece, then its own chime at the button (no thump)',pb===0&&snd[0]==='bell'&&snd.includes('special')&&!snd.includes('thump'),{pb,snd});
  g.run('treatAwards.length=0;pickupFx.popStyle=0');g.run("queueTreatAward('cheese',150,null,false);queueTreatAward('quake',250,null,false,'quake')");pb=0;const pops=J(g,'treatAwards.map(f=>f.pop)');for(let i=0;i<80;i++){g.tick();g.c.draw();if(g.run('PANEL.on'))pb++;}g.run('pickupFx.popStyle=1');
  check('an old saved setting (the UAT 34 box style) can no longer bring the box back',pb===0&&pops.every(Boolean),{pb,pops});
  check('pieces: no errors with sound on',!errs.length,errs);g.close();}
 // 2. lots at once: the same busy pile-up as UAT 52 (bells, the line, two in the air), and a Quake in it takes a normal turn
 if(on(2)){const burst=async(srcF,withQuake)=>{const g=await game({src:srcF,seed:3});strictAudio(g);g.run('S.muted=false');g.ticks(120);g.tap(200,400);g.ticks(40);g.run('wildStartCountdown()');g.ticks(260);
   g.run(`globalThis.__s=[];const sp=sfx.pickup;sfx.pickup=function(k,v,d){__s.push([k,+(time).toFixed(3),+(d||0).toFixed(3),+(v||0).toFixed(2)]);return sp.apply(this,arguments);};treatAwards.length=0;popSeed=0x2f6b4e1d`);
   const ids=withQuake?['cheese','tuna','quake','shrimp','bowtie','duck','milk']:['cheese','tuna','sardine','shrimp','bowtie','duck','milk'];
   g.run(`for(const [i,id] of ${JSON.stringify(ids)}.entries())queueTreatAward(id,80+i*40,null,false,id==='quake'?'quake':'item')`);
   const rise=J(g,'treatAwards.map(f=>[f.id,+(-f.t).toFixed(3),+f.tm.toFixed(3)])');let air=0;for(let i=0;i<400;i++){g.tick();air=Math.max(air,g.run('treatAwards.filter(f=>!f.arrived&&f.t>=0).length'));}
   const r={rise,air,snd:J(g,'__s')};g.close();return r;};
  const a=await burst(OLD,false),b=await burst(src,false),c=await burst(src,true),q2=await burst(OLD,true);
  check('7 prizes at once behave exactly as in UAT 52: same line (start times, holds), same bells and thumps, same overlap',JSON.stringify(a)===JSON.stringify(b),{rise:b.rise,air:b.air,sounds:b.snd.length});
  const qi=c.rise.findIndex(r=>r[0]==='quake');
  check('with a Quake coin in the pile it takes a normal turn (same start and hold as a prize there), so the line keeps moving',c.rise[qi][1]===b.rise[qi][1]&&c.rise[qi][2]===b.rise[qi][2]&&c.rise[qi+1][1]===b.rise[qi+1][1],{withQuake:c.rise,uat52WithQuake:q2.rise});
  const bells=b.snd.filter(s=>s[0]==='bell'),thumps=b.snd.filter(s=>s[0]==='thump').length;
  check('in the pile: 3 bells at once (each quieter), the rest silent; thumps follow; two pieces in the air at once',bells.length===3&&thumps>=5&&b.air>=2,{bells,thumps,air:b.air});}
 // 3. real rounds on all five cat boards and the old boards: every pickup is a Pop, never the box
 if(on(3)){const {g,errs}=await g0(4);g.run('PG.level=6;for(const c of PG_CATS)PG.open[c]=1;globalThis.__panel=0');const by={};
  for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){g.run(`pgSwitchBoard('${cat}');__fl.length=0`);play(g,60,errs,10);round(g,errs,50);by[cat]=J(g,'__fl.map(f=>[f.id,f.pop?1:0])');}
  const all=Object.values(by).flat();
  check('real rounds on all five cat boards: every prize and coin collected (the Quake coin included) uses the Pop',all.length>20&&all.every(f=>f[1]===1)&&all.some(f=>f[0]==='quake'),Object.fromEntries(Object.entries(by).map(([c,l])=>[c,l.map(f=>f[0]).join(',')])));
  check('no pinstriped box in any round',!g.run('__panel'));check('rounds: no errors with sound on',!errs.length,errs);g.close();
  const o=await g0(5);o.g.run('PGU.oldBoards=true;if(WILD.on)wildExit();PGU.screen="board";__fl.length=0');for(let s=0;s<60;s++){o.g.run(`holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};S.coins=Math.max(S.coins,30)`);play(o.g,60,o.errs,20);}
  const fl=J(o.g,'__fl.map(f=>[f.id,f.pop?1:0])');check('the old boards (Developer) too: every pickup there uses the Pop',fl.length>0&&fl.every(f=>f[1]),fl);o.g.close();}
 // 4. the Developer panel: the style switch (Pop / UAT 34) and the old style's dials are gone
 if(on(4)){const html=fs.readFileSync(src,'utf8');check("Developer: no pickup style switch; only the Pop's own dials remain",!html.includes('<button id="pfx-style"')&&html.includes("PICKUP_FX_ORDER.filter(k=>!['popStyle','rise','size','quakeSize','held','turn','offCentre','fade','stripes','panelPad','toBag','quakeFlight'].includes(k))"));}
 // 5. no Wild in what a player sees (Developer off = production view): title, all five boards, goal and end cards, picker, screens
 if(on(5)){const {g,errs}=await g0(4,false);g.run('PG.level=6;for(const c of PG_CATS)PG.open[c]=1');const titles={};
  for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){g.run(`pgSwitchBoard('${cat}')`);play(g,60,errs);titles[cat]=g.run('wildModeName()');if(cat==='tuxedo')shot(g,'tuxedo-goal-card');round(g,errs,25);if(cat==='tuxedo')shot(g,'tuxedo-end-card');}
  g.run('PGU.pick=true;PGU.pickT=0');play(g,30,errs);shot(g,'board-picker');const pk=g.run("PG_CAT.tuxedo.board");g.run('PGU.pick=false');
  for(const sc of ['kitchen','porch','album','shop']){g.run(`PGU.screen='${sc}'`);play(g,20,errs);}g.run("PGU.screen='album';PGU.album&&(PGU.album.page=1)");play(g,20,errs);g.run("PGU.screen='board'");play(g,10,errs);
  const w=J(g,'__w');check('Developer off: no "Wild" drawn anywhere a player looks',Object.keys(w).length===0,w);
  check("the Tuxedo's board is TUXEDO (goal card title, board readout) and Tuxedo in the picker; the others keep their mode names",titles.tuxedo==='TUXEDO'&&pk==='Tuxedo'&&titles.orange==='TREAT TOSS'&&titles.ragdoll==='COZY'&&titles.siamese==='LASER CHASE'&&titles.tortie==='TOWER WALL',{titles,pk});
  g.run("ctx.font='italic 900 36px Impact, \"Arial Black\", system-ui'");const tw=g.run(`ctx.measureText("TUXEDO").width`),cw=J(g,'w2CardLayout().card').w;
  check('the title fits on the goal card',tw<cw-24,{tw,cw});
  check('names: no errors with sound on',!errs.length,errs);g.close();}
 // 6. Dance break: the cat lands on every beat of the judge's clock, all four moves, sound on and off
 if(on(6)){const out={};let worst=0;for(const muted of [false,true])for(const m of [0,1,2,3]){const g=await game({src,seed:3});strictAudio(g);g.run(`S.muted=${muted}`);g.ticks(120);g.tap(200,400);g.ticks(40);
   g.run('danceStartNow()');g.until("WILD.dance&&WILD.dance.phase==='dance'",2000);g.run(`WILD.dance.move=${m};if(pawDance)pawDance.index=${m}`);const S=[];
   for(let i=0;i<300;i++){g.tick();S.push(J(g,`(()=>{const D=WILD.dance;if(!D||D.phase!=='dance')return null;return [(danceNow()-D.p0)/D.beat,pawMotion(0).y,(pawGaze()||{x:0}).x,D.beat];})()`));}
   const s=S.filter(Boolean),e=[];for(let k=1;k<8;k++){const w=s.filter(r=>r[0]>k-.5&&r[0]<k+.5);if(!w.length)continue;const b=m===0?w.reduce((a,c)=>Math.abs(c[2])>Math.abs(a[2])?c:a):w.reduce((a,c)=>c[1]>a[1]?c:a);e.push(Math.round((b[0]-k)*b[3]*1000));}
   out[`move ${m} ${muted?'sound off':'sound on'}`]=e;worst=Math.max(worst,...e.map(Math.abs));g.close();}
  check('Dance break: every move lands on each beat of the tap clock (within one 60 fps frame, 17 ms), with sound on or off',worst<=17,out);}
 // 7. the title screen (UAT 54): the intro plays out, then it stays alive until TAP TO PLAY; a bigger, slower coin rain
 if(on(7)){const g=await game({src,seed:3,render:true});const st=strictAudio(g);g.run('S.muted=false');const errs=[];
  g.run(`globalThis.__ord=[];const h=pgHead;pgHead=function(...a){if(PGU.screen==='title')__ord.push('cat');return h.apply(this,a);};const w=wildText;wildText=function(t,...a){if(PGU.screen==='title'&&/^[CatoinC]$/.test(t))__ord.push('title');return w.call(this,t,...a);};
   const P=Object.getPrototypeOf(ctx),di=P.drawImage;P.drawImage=function(img,...a){if(PGU.screen==='title'&&img===sprite('coin').cv)__ord.push('coin');return di.call(this,img,...a);};`);
  play(g,30,errs);g.tap(200,400);play(g,30,errs);const s1=J(g,'{screen:PGU.screen,t:PGU.title.t}');
  check('a tap during the intro is ignored: the intro plays out (no jump to the board)',s1.screen==='title'&&s1.t>.9,s1);
  play(g,60,errs);shot(g,'title-tap-to-play');
  for(let i=0;i<60*30;i++){g.tick();if(i%30===0)g.c.draw();}
  const s2=J(g,'{screen:PGU.screen,t:PGU.title.t,coins:PGU.title.coins.length}');
  check('after the intro it stays on the title (32 s and counting), the rain still going, until the player taps',s2.screen==='title'&&s2.t>30&&s2.coins>=5,s2);
  const c=J(g,'(()=>{const a=PGU.title.coins;return {rMin:Math.min(...a.map(c=>c.r)),rMax:Math.max(...a.map(c=>c.r)),vMax:Math.max(...a.map(c=>c.vy))};})()');
  check('the coins are the board coin, bigger (22-34 px radius, was 10-17) and slower (at most 190 px/s, was 170-330 and speeding up)',c.rMin>=22&&c.rMax<=34&&c.vMax<=190,c);
  g.run('__ord.length=0');g.c.draw();const ord=J(g,'__ord'),lastCoin=ord.lastIndexOf('coin'),firstCat=ord.indexOf('cat'),firstTitle=ord.indexOf('title');
  check("the coins are drawn behind the cat's face and the CatCoin title (never over them)",lastCoin>=0&&lastCoin<firstCat&&lastCoin<firstTitle,{lastCoin,firstCat,firstTitle,n:ord.length});
  g.tap(200,400);play(g,40,errs);const s3=J(g,'{screen:PGU.screen,on:WILD.on,phase:WILD.phase,cat:PGU.boardCat}');
  check("a tap after the intro (TAP TO PLAY) opens the Tuxedo's board on its goal card",s3.screen==='board'&&s3.on&&s3.phase==='card'&&s3.cat==='tuxedo',s3);
  check('title: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 console.log(`\n${passed.length}/${passed.length+failed.length} passed`);fs.writeFileSync(path.join(OUT,'checks53'+(process.env.ONLY?'-'+process.env.ONLY.replace(/,/g,''):'')+'.json'),JSON.stringify({passed,failed},null,1));process.exit(failed.length?1:0);
})();
