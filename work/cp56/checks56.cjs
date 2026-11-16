// UAT 56 checks: UAT 55's plus section 9 (Board button, Dance meter, no overlaps, Level = board number, the cat head's
// proportions, the four title coin rains).
// UAT 55 checks: UAT 54's (the layout default is A; the board waits behind the main screen between rounds) plus the A/B of
// the between-rounds layout (section 8).
// UAT 54 checks: UAT 53's (below; taps now come after the title's intro) plus the title screen that stays until TAP TO PLAY,
// with a bigger, slower coin rain (section 7).
// UAT 53 checks: CP-45 follow-ups (Jenny, Nov 14): the Quake coin collected on the frozen default path (Pop) like every
// other piece, the path itself unchanged (traced against UAT 52), no pinstriped box anywhere; no "Wild" in what a player sees
// (the Tuxedo's board is "Tuxedo" for now); the Dance break cat moves on the tap beat. Sound on, strict fake Web Audio.
// ONLY=1,2,... runs some sections (the desktop canvas runs out of memory if one process draws too much).
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','..','tickets','CP-45-evidence','uat56'));fs.mkdirSync(OUT,{recursive:true});
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
  const {g,errs}=await g0();check('build label',g.run('BUILD')==='2026.11.14 UAT 56',g.run('BUILD'));g.run('wildStartCountdown()');play(g,240,errs,20);
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
   const raw=J(g,'__s'),t0=raw.length?raw[0][1]:0,r={rise,air,snd:raw.map(x=>[x[0],+(x[1]-t0).toFixed(2),x[2],x[3]])};g.close();return r;}; // times from the first sound (layout A starts the board's clock a few frames later)
  const a=await burst(OLD,false),b=await burst(src,false),c=await burst(src,true),q2=await burst(OLD,true);
  if(process.env.DBG){console.log(JSON.stringify(a));console.log(JSON.stringify(b));}check('7 prizes at once behave exactly as in UAT 52: same line (start times, holds), same bells and thumps, same overlap',JSON.stringify(a)===JSON.stringify(b),{rise:b.rise,air:b.air,sounds:b.snd.length});
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
  check('the coins are the board coin, bigger (22-34 px radius, was 10-17); UAT 56 default rain 2 falls at up to 380 px/s',c.rMin>=22&&c.rMax<=34&&c.vMax<=380,c);
  g.run('__ord.length=0');g.c.draw();const ord=J(g,'__ord'),lastCoin=ord.lastIndexOf('coin'),firstCat=ord.indexOf('cat'),firstTitle=ord.indexOf('title');
  check("the coins are drawn behind the cat's face and the CatCoin title (never over them)",lastCoin>=0&&lastCoin<firstCat&&lastCoin<firstTitle,{lastCoin,firstCat,firstTitle,n:ord.length});
  g.tap(200,400);play(g,40,errs);const s3=J(g,'{screen:PGU.screen,on:WILD.on,phase:WILD.phase,cat:PGU.boardCat}');
  check("a tap after the intro (TAP TO PLAY) opens the Tuxedo's board on its goal (UAT 55: behind the main screen in layout A)",['board','main'].includes(s3.screen)&&s3.on&&s3.phase==='card'&&s3.cat==='tuxedo',s3);
  check('title: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 // 8. UAT 55: the A/B of the between-rounds layout (A main screen, B board view)
 if(on(8)){const mk=async(ab,dev=false,seed=3)=>{const g=await game({src,seed,render:true,storage:{'catpusher.uat.homelayout.v1':ab,'catpusher.uat.devdefault.v1':'1'}});const st=strictAudio(g);g.run(`S.muted=false;S.dev=${dev}`);const errs=[];
   g.run("openCredits=function(){panel.style.display='block';};globalThis.__toast=[];const t0=pgToast;pgToast=function(t,...a){__toast.push(t);return t0.call(this,t,...a);};");play(g,130,errs,10);g.tap(200,400);play(g,40,errs,4);return {g,st,errs};};
  const ctr=(r)=>({x:r.x+r.w/2,y:r.y+r.h/2});
  // A
  {const {g,st,errs}=await mk('A');const s0=J(g,'{screen:PGU.screen,phase:WILD.phase,cat:PGU.boardCat,ab:PG_AB}');
   check('A: after the title the main screen shows (the board waits behind on its goal)',s0.screen==='main'&&s0.phase==='card'&&s0.cat==='tuxedo'&&s0.ab==='A',s0);
   const R=J(g,'(()=>{const R=pgMainRects();return {head:R.head,side:R.side.map(b=>({id:b.id,x:b.x,y:b.y,r:b.r})),play:PGA.L.play,help:PGA.L.help,top:R.top}})()');
   check('A: the side buttons are small and at the edges, clear of the cat (left Kitchen, Porch, Album; right Shop, Boards), below the top bar',R.side.map(b=>b.id).join()==='kitchen,porch,album,shop,board'&&R.side.every(b=>b.r<=25&&(b.x+b.r<R.head.x-R.head.w/2||b.x-b.r>R.head.x+R.head.w/2)&&b.y-b.r>R.top),R.side);
   check('A: PLAY is the one big button (244 x 78, about 10 times the area of a side button)',R.play.w*R.play.h>8*Math.PI*25*25,R.play);
   g.tap(ctr(J(g,'pgMainRects().side[0].hit')).x,ctr(J(g,'pgMainRects().side[0].hit')).y);play(g,20,errs);
   check('A: a locked side button (Kitchen, level 2) stays shut and says so',g.run('PGU.screen')==='main'&&J(g,'__toast').some(t=>/level 2/.test(t)),J(g,'__toast'));
   g.run('PG.level=2');{const h=J(g,'pgMainRects().side[0].hit');g.tap(h.x+h.w/2,h.y+h.h/2);}play(g,30,errs);const k=g.run('PGU.screen');g.tap(J(g,'pgBack()').x+20,J(g,'pgBack()').y+15);play(g,10,errs);
   check('A: Kitchen opens from its side button; back returns to the main screen',k==='kitchen'&&g.run('PGU.screen')==='main',{k,back:g.run('PGU.screen')});
   g.tap(200,R.help.y+R.help.h/2);play(g,10,errs);const rl=J(g,'{screen:PGU.screen,rules:PGU.rules,phase:WILD.phase}');shot(g,'A-how-to-play');
   check('A: "? How to play" shows the old goal card on the board',rl.screen==='board'&&rl.rules&&rl.phase==='card',rl);
   g.tap(200,600);play(g,5,errs);check('A: from there a tap starts the round as before',g.run('WILD.phase')==='count'&&!g.run('PGU.rules'),g.run('WILD.phase'));
   g.run('wildFinish(true)');play(g,120,errs,6);const e=J(g,'{screen:PGU.screen,phase:WILD.phase}');shot(g,'A-end-card');
   g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   check("A: after a round the end card shows on the board; its New goal comes back to the main screen",e.screen==='board'&&e.phase==='end'&&g.run('PGU.screen')==='main'&&g.run('WILD.phase')==='card',{end:e,after:g.run('PGU.screen')});
   g.tap(200,R.play.y+R.play.h/2);play(g,6,errs);check('A: PLAY goes onto the board and starts the round (3, 2, 1)',g.run('PGU.screen')==='board'&&g.run('WILD.phase')==='count',J(g,'{screen:PGU.screen,phase:WILD.phase}'));
   g.run('wildFinish(true)');play(g,120,errs,6);g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   g.run("PG.level=6;for(const c of PG_CATS)PG.open[c]=1");{const h=J(g,'pgMainRects().side[4].hit');g.tap(h.x+h.w/2,h.y+h.h/2);}play(g,30,errs);const pk=g.run('PGU.pick');
   {const r=J(g,"pgPickRects().rows.find(r=>r.c==='orange')");g.tap(r.x+r.w/2,r.y+r.h/2);}play(g,40,errs);
   check("A: Boards opens the picker on the main screen; picking the Orange's board stays on the main screen, now for TREAT TOSS",pk&&g.run('PGU.screen')==='main'&&g.run('PGU.boardCat')==='orange'&&g.run('wildModeName()')==='TREAT TOSS',J(g,'{pk:'+pk+',screen:PGU.screen,cat:PGU.boardCat,name:wildModeName()}'));
   g.tap(R.head.x,R.head.y);play(g,10,errs);check('A: a tap on the cat gets the sweet face, hearts and a meow',g.run('PGA.hearts.length')>0);
   g.tap(370,J(g,'pgDock().y1'));play(g,5,errs);const cr=g.run("panel.style.display");g.run("panel.style.display='none'");
   check('A: the top bar works on the main screen (Settings opens)',cr==='block',cr);
   check('A: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  // B
  {const {g,st,errs}=await mk('B');const s0=J(g,'{screen:PGU.screen,phase:WILD.phase,rest:pgRestPhase()}');play(g,10,errs);
   check('B: after the title the board shows, with the new panel in the goal card area (no extra screen)',s0.screen==='board'&&s0.phase==='card'&&s0.rest&&!!g.run('PGU.bL&&PGU.bL.play'),s0);
   const B=J(g,'(()=>{const B=pgBLayout();return {ch:B.ch,panel:B.panel,side:B.side.map(b=>({id:b.id,x:b.x,y:b.y,r:b.r})),play:PGU.bL.play,help:PGU.bL.help}})()');
   check("B: nothing over the cat's face: the panel, PLAY and the side buttons are all below the chin",B.panel.y>B.ch&&B.play.y>B.ch&&B.side.every(b=>b.y-b.r>B.ch),{ch:B.ch,panel:B.panel.y,side:B.side.map(b=>b.y-b.r)});
   check('B: the top bar has no row of five big buttons any more (they are the side buttons)',J(g,'pgDock().tiles.length')===0&&B.side.length===5);
   g.tap(200,B.panel.y+B.panel.h*.45);play(g,5,errs);check('B: a tap in the panel away from PLAY does not start the round',g.run('WILD.phase')==='card');
   g.tap(200,B.play.y+B.play.h/2);play(g,5,errs);check('B: PLAY starts the round',g.run('WILD.phase')==='count');
   g.run('wildFinish(true)');play(g,120,errs,6);g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   check("B: the end card's New goal comes back to the board view's panel",g.run('PGU.screen')==='board'&&g.run('WILD.phase')==='card'&&!g.run('PGU.rules'));
   g.tap(200,B.help.y+B.help.h/2);play(g,5,errs);check('B: "? How to play" shows the old goal card',g.run('PGU.rules')===true);g.tap(200,600);play(g,5,errs);
   check('B: from there a tap starts the round as before',g.run('WILD.phase')==='count');
   check('B: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  // badges, the switch, Developer off
  {const {g,errs}=await mk('A',true);g.run("PG.level=4;for(const c of ['tuxedo','orange','ragdoll'])PG.open[c]=1;PG.newBoard='ragdoll';PG.newPhoto=1;PG.recipes.tunadish=1;PG.seen['r:tunadish']=0");play(g,10,errs);
   const w=J(g,"['kitchen','porch','album','shop','board'].map(id=>[id,pgWaiting(id)])");
   check('a "!" shows on a side button when something waits there (the same rules as the old paws)',w.find(x=>x[0]==='kitchen')[1]&&w.find(x=>x[0]==='album')[1]&&w.find(x=>x[0]==='board')[1],w);
   const html=g.run('pgDevHtml()');check('Developer: "Home layout" switch (A main screen / B board view) and a difficulty tag per board',/id="pg-ab"/.test(html)&&/A main screen/.test(html)&&(html.match(/data-pgdiff=/g)||[]).length===5,null);
   g.run("PG_AB='B'");play(g,3,errs);const toB=g.run('PGU.screen');g.run("PG_AB='A'");play(g,3,errs);const toA=g.run('PGU.screen');
   check('switching the layout takes effect at once (main screen to board view and back)',toB==='board'&&toA==='main',{toB,toA});
   check('difficulty tags: placeholders by opening order (Tuxedo and Orange Normal, Ragdoll and Siamese Hard, Tortie Super hard), shown with Level n',JSON.stringify(J(g,'PG_DIFF'))==='{"tuxedo":"Normal","orange":"Normal","ragdoll":"Hard","siamese":"Hard","tortie":"Super hard"}',J(g,'PG_DIFF'));
   g.run('S.dev=false');play(g,3,errs);check('Developer off = production view: no MODES chip on the bar (the layout switch and tags are only in the Developer panel)',J(g,'pgDock().modes')===null);
   check('switch and badges: no errors',!errs.length,errs);g.close();}}
 // 9. UAT 56: Board button, Dance meter (+ hint, pulse), nothing overlaps, Level = board number, cat head proportions, title coins 1-4
 if(on(9)){const base=async(o={})=>{const g=await game({src,seed:3,render:true,height:o.height||888.889,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.homelayout.v1':o.ab||'A',...(o.storage||{})}});const st=strictAudio(g);
   if(o.inset!=null)g.run(`androidSafeArea.top=${o.inset};androidSafeArea.bottom=24;androidSafeArea.width=innerWidth`);g.run('S.muted=false;S.dev=false');const errs=[];return {g,st,errs};};
  const toRound=(g,errs)=>{play(g,130,errs,10);g.tap(200,400);play(g,40,errs,8);g.run('PGU.screen="board";wildStartCountdown()');play(g,260,errs,20);};
  // overlaps on every size
  const ov=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h,bad=[];
  for(const height of [720,888.889,960])for(const inset of [0,24,48]){const {g,errs}=await base({height,inset,ab:'B'});toRound(g,errs);
   const R=J(g,`(()=>{const h=hudLayout(),x0=W-Math.max(8,h.right+10)-124,y=h.bannerY;ctx.font='bold 11px system-ui';const lw=ctx.measureText('DANCE METER').width;
    return {btn:wildButton(),gear:pgPlayGear(),label:{x:x0+24,y:y-13-6,w:lw,h:12},meter:{x:x0+20,y:y-7,w:104,h:14},top:h.top}})()`);
   for(const [n1,n2] of [['btn','label'],['gear','label'],['btn','meter'],['gear','meter'],['btn','gear']])if(ov(R[n1],R[n2]))bad.push([height,inset,n1,n2]);if(R.btn.y<R.top-1)bad.push([height,inset,'btn above the safe area']);g.close();}
  check('nothing overlaps in the round HUD: Board button, Settings gear, the Dance meter and its label, on 720/889/960-high screens with status bars of 0, 24 and 48 px',bad.length===0,bad);
  // Board button, Dance meter, hint, pulse
  {const {g,st,errs}=await base({ab:'A'});g.run("globalThis.__tx={};const P=Object.getPrototypeOf(ctx),f=P.fillText;P.fillText=function(t,...a){__tx[String(t)]=1;return f.call(this,t,...a);};");toRound(g,errs);g.c.draw();
   check('during a round the button says "Board" with a back arrow (not EXIT); the meter says DANCE METER (not HAPPY CAT)',!!g.run("__tx['Board']")&&!g.run("__tx['EXIT']")&&!!g.run("__tx['DANCE METER']")&&!g.run("__tx['HAPPY CAT']"),Object.keys(J(g,'__tx')).filter(t=>/Board|EXIT|DANCE|HAPPY/.test(t)));
   g.run('danceFill(1,200)');play(g,6,errs);const h1=J(g,'{hint:!!PGU.dHint,happyT:WILD.happyT}');shot(g,'hud-hint');
   check('the first time ever the meter fills, a hint shows under it ("Prizes fill it. Full = Dance break!"), with a pulse round the meter',h1.hint&&h1.happyT<.45,h1);
   play(g,260,errs,20);check('the hint goes after about 4 s',!g.run('PGU.dHint'));
   check('the goal card says "Prizes fill the dance meter"',J(g,'W2_CARD_LINES').some(l=>l[1]==='Prizes fill the dance meter'));
   const b=J(g,'wildButton()'),cat=g.run('PGU.boardCat');g.tap(b.x+b.w/2,b.y+b.h/2);play(g,30,errs,5);
   check("Board goes back to this board's between-rounds view (layout A: its main screen)",g.run('PGU.screen')==='main'&&g.run('WILD.phase')==='card'&&g.run('PGU.boardCat')===cat,J(g,'{screen:PGU.screen,phase:WILD.phase,cat:PGU.boardCat}'));
   check('Board button and Dance meter: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  {const {g,errs}=await base({ab:'B',storage:{'catpusher.uat.dancehint.v1':'1'}});toRound(g,errs);g.run('danceFill(1,200)');play(g,6,errs);check('the hint shows once only (not again on this phone)',!g.run('PGU.dHint'));g.close();}
  // Level = the board number
  {const {g,errs}=await base({ab:'A'});play(g,130,errs,10);g.tap(200,400);play(g,30,errs,6);const l0=g.run('pgBoardLevel()');g.run('PGU.screen="board";wildStartCountdown()');play(g,200,errs,20);g.run('wildFinish(true)');play(g,120,errs,20);
   const l1=g.run('pgBoardLevel()');g.run('wildReset();wildStartCountdown()');play(g,200,errs,20);g.run('wildFinish(false)');play(g,120,errs,20);const l2=g.run('pgBoardLevel()');
   check('"Level n" on PLAY is the board number in sequence: 1 on a new save, +1 for each round won, not for a loss',l0===1&&l1===2&&l2===2,{l0,l1,l2});g.close();}
  // the cat head's proportions
  {const {g,errs}=await base({ab:'A'});g.run("globalThis.__hd=[];const P=Object.getPrototypeOf(ctx),di=P.drawImage;P.drawImage=function(img,...a){if(img&&img.width===1536&&img.height===1024&&a.length>=4)__hd.push([PGU.screen,+(a[a.length-2]/a[a.length-1]).toFixed(3)]);return di.call(this,img,...a);};");
   play(g,60,errs,1);const t1=J(g,'__hd.filter(x=>x[0]==="title").map(x=>x[1])');g.tap(200,400);play(g,130,errs,10);g.tap(200,400);play(g,20,errs,1);const m1=J(g,'__hd.filter(x=>x[0]==="main").map(x=>x[1])');
   check('the cat head is drawn at the art\'s own proportions (1536 x 1024 = 1.5; was 1.75) on the title and the main screen',t1.length&&m1.length&&t1.concat(m1).every(r=>Math.abs(r-1.5)<.01),{title:t1.slice(0,2),main:m1.slice(0,2)});g.close();}
  // title coin rains 1-4
  {const out={};for(const v of [1,2,3,4]){const {g,st,errs}=await base({storage:{'catpusher.uat.titlecoins.v1':String(v)}});g.run("globalThis.__clink=0;globalThis.__thick=0;const s0=pgSfx;pgSfx=function(k,...a){if(k==='coin'&&PGU.title.t>2)__clink++;return s0.call(this,k,...a);};const tc=pgThickCoin;pgThickCoin=function(...a){__thick++;return tc.apply(this,a);};");
    let up=0,vmax=0;for(let i=0;i<60*7;i++){g.tick();if(i%6===0)g.c.draw();const r=J(g,'(()=>{const a=PGU.title.coins;return [a.some(c=>c.vy<0),Math.max(0,...a.map(c=>c.vy))]})()');if(r[0])up++;vmax=Math.max(vmax,r[1]);}
    out[v]={mode:g.run('PGU.title.mode'),vmax:Math.round(vmax),up,thick:g.run('__thick'),pile:g.run('PGU.title.pile?PGU.title.pile.length:0'),clinks:g.run('__clink'),screen:g.run('PGU.screen'),errs:errs.length};shot(g,'title-check-'+v);g.close();}
   check('title coins 1: the same flat coins, about twice as fast (top speed 380 px/s, was 190)',out[1].mode===1&&out[1].vmax>=300&&out[1].thick===0,out[1]);
   check('title coins 2 (default): as fast, and each coin shows its gold edge as it turns',out[2].mode===2&&out[2].vmax>=300&&out[2].thick>0,out[2]);
   check('title coins 3: a fountain: coins burst up from the bottom and arc back down',out[3].mode===3&&out[3].up>30&&out[3].thick>0,out[3]);
   check('title coins 4: coins fall fast and pile up at the bottom with clinks',out[4].mode===4&&out[4].pile>=20&&out[4].clinks>=10,out[4]);
   check('all four stay on the title until a tap, with no errors with sound on',Object.values(out).every(o=>o.screen==='title'&&!o.errs),out);}
  {const {g}=await base();check('Developer: "Title coins" switch (default 2), "Show the title screen again", "Show the Dance meter hint again"',g.run('PG_TC')===2&&/id="pg-tc"/.test(g.run('pgDevHtml()'))&&/id="pg-title"/.test(g.run('pgDevHtml()'))&&/id="pg-dhint"/.test(g.run('pgDevHtml()')));g.close();}}
 console.log(`\n${passed.length}/${passed.length+failed.length} passed`);fs.writeFileSync(path.join(OUT,'checks53'+(process.env.ONLY?'-'+process.env.ONLY.replace(/,/g,''):'')+'.json'),JSON.stringify({passed,failed},null,1));process.exit(failed.length?1:0);
})();
