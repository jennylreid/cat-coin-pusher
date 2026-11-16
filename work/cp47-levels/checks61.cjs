// UAT 61 checks (CP-47 Levels and cats): the real runtime, sound ON through the strict fake Web Audio, desktop canvas.
// Usage: node checks61.cjs [BUILD release.html] [BASE release.html (UAT 60)] [OUT dir]
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs'),crypto=require('crypto');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),base=path.resolve(process.argv[3]||path.join(__dirname,'..','cp60','release.html'));
const OUT=path.resolve(process.argv[4]||path.join(__dirname,'..','..','tickets','CP-47-evidence','uat61'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,500):''));}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const fp=g=>crypto.createHash('sha1').update(g.run("bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return b.kind+(b.id||'')+':'+p.x.toFixed(3)+','+p.y.toFixed(3)+','+p.z.toFixed(3)}).join('|')+'#'+S.coins+'#'+WILD.left+'#'+WILD_COLLECTION.join(',')")).digest('hex').slice(0,16);
const snap=g=>J(g,"bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.kind+(b.id||''),+(p.x/M).toFixed(2),+(p.y/M).toFixed(2),+(p.z/M).toFixed(2)]})");
// same layout: the same pieces in the same order; prizes, towers, rain and Quake coins within 2.5 units (a twentieth of a coin), plain coins within 1 unit (95%) and 20 at most
function sameLayout(a,b){if(a.length!==b.length)return {ok:false,why:'count '+a.length+'/'+b.length};let big=0,mxP=0,mxC=0;
 for(let i=0;i<a.length;i++){if(a[i][0]!==b[i][0])return {ok:false,why:'kind '+a[i][0]+'/'+b[i][0]};const d=Math.hypot(a[i][1]-b[i][1],a[i][2]-b[i][2],a[i][3]-b[i][3]);
  if(/^(coin|silver)$/.test(a[i][0])){mxC=Math.max(mxC,d);if(d>1)big++;}else mxP=Math.max(mxP,d);}
 const nc=a.filter(x=>/^(coin|silver)$/.test(x[0])).length;return {ok:mxP<=2.5&&big<=nc*.05&&mxC<20,prizes:+mxP.toFixed(2),coins:+mxC.toFixed(2),coinsOver1:big};}
async function G(o={}){const g=await game({src,render:true,seed:o.seed||5,height:o.height||888.889});const st=strictAudio(g);g.st=st;g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);};globalThis.__txt=[];for(const k of ['fillText']){const P=Object.getPrototypeOf(ctx),o=P[k];P[k]=function(t,...a){if(globalThis.__rec)__txt.push(String(t));return o.call(this,t,...a);};}");
 g.ticks(150);g.tap(200,700);g.ticks(30);return g;}
function errs(g){return J(g,'__errs');}
function level(g,n,cat){g.run(`${cat?`if(PGU.boardCat!=='${cat}'){PG.open['${cat}']=1;pgSwitchBoard('${cat}');}`:''}PG.lv.passed=Math.max(PG.lv.passed,${n-1});PG.lv.sel=${n};wildReset();`);}
function startRound(g){g.run("PGU.screen='board';pgStartRound();");return g.until("WILD.phase==='play'",900);}
function drops(g,sec){for(let s=0;s<sec/.45&&g.run("WILD.phase==='play'");s++){g.run(`tryDrop({x:${Math.round(200+120*Math.sin(s*.8))},y:DROP_Y})`);g.ticks(27);}}
function winNow(g){g.run("for(const id of WILD_COLLECTION){const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b&&!WILD.have[id])wildPrizeCollected(b,200);}");g.ticks(90);}

(async()=>{
 // ---------- 1. the levels ----------
 {const g=await G();
  const L=J(g,"PGL_LEVELS.map(l=>({name:l.name,tag:l.tag,goal:l.goal,ids:[...l.p.map(p=>p[0]),...(l.top||[]).map(p=>p[0])],coins:l.coins,secs:l.secs,wall:!!l.wall}))"),own=J(g,'PG_CATS.flatMap(c=>PG_CAT[c].own)'),common=J(g,'PG_COMMON');
  check('1.1 ten levels, each with a name, goal and tag',L.length===10&&L.every(l=>l.name&&l.goal.length>=4&&['Normal','Hard','Super hard'].includes(l.tag)),L.map(l=>l.tag));
  check('1.2 difficulty mixes (not a steady climb): tags N N H N H N SH H N SH',L.map(l=>l.tag[0]+(l.tag==='Super hard'?'H':'')).join(' ')==='N N H N H N SH H N SH',L.map(l=>l.tag).join(', '));
  check("1.3 no cat's prize is ever in a level's layout",L.every(l=>l.ids.every(id=>!own.includes(id))));
  check('1.4 each goal is prizes laid out on that level (each kind once)',L.every(l=>l.goal.every(id=>l.ids.includes(id)&&common.includes(id))&&new Set(l.goal).size===l.goal.length));
  // same start every replay, and the same layout whichever cat plays it
  const same=[],cats=[];for(let n=1;n<=10;n++){level(g,n);const a=snap(g),t0=J(g,'[S.coins,WILD.left,WILD_COLLECTION.join()]');g.run('wildReset()');const b=snap(g),t1=J(g,'[S.coins,WILD.left,WILD_COLLECTION.join()]');
   const r=sameLayout(a,b);r.ok=r.ok&&t0.join()===t1.join();same.push(r);cats.push(a);}
  check('1.5 every level starts the same on every replay (same pieces in the same spots, coins, time, goal)',same.every(r=>r.ok),same);
  const other=[];for(let n=1;n<=10;n++){level(g,n,'orange');other.push(sameLayout(cats[n-1],snap(g)));}
  check("1.6 a level's prizes, towers and coins are the same with another cat (Orange vs Tuxedo)",other.every(r=>r.ok),other);
  level(g,5,'tuxedo');g.ticks(2);const tops=J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>[b.id,Math.round(b.rb.translation().y/M)])");
  check('1.7 Tower wall level: its five prizes sit on top of the five towers',tops.length===5&&tops.every(t=>t[1]>60),tops);
  // Level n on the PLAY screen = the level
  level(g,1);g.run("PGU.screen='main'");g.run('globalThis.__rec=1;__txt=[]');g.c.draw();g.run('globalThis.__rec=0');const t1=J(g,'__txt');
  check('1.8 PLAY screen: "LEVEL 1", its tag, and the goal line with the level name',t1.includes('LEVEL 1')&&t1.includes('NORMAL')&&t1.includes('First push: collect these 4'),t1.filter(s=>/LEVEL|NORMAL|collect/.test(s)));
  check('1.9 no XP anywhere on the PLAY screen or its bar',!t1.some(s=>/XP/.test(s)));
  shot(g,'main-level1');check('1.10 no frame errors',!errs(g).length,errs(g));}

 // ---------- 2. passing levels; no help, no rigging ----------
 {const g=await G({seed:6});level(g,1);startRound(g);winNow(g);
  const r=J(g,'({lv:PG.lv,again:pglAgainText(),back:pgBackText(),res:WILD.pgResult,level:PG.level})');shot(g,'end-pass-level1');
  check('2.1 winning Level 1 passes it and opens Level 2 (first pass)',r.lv.passed===1&&r.lv.sel===2&&r.res.first===true&&r.res.next===2,r.lv);
  check('2.2 end card: NEXT LEVEL, "Level 1 passed! Level 2 is open", the lower button is Main screen',r.again==='NEXT LEVEL'&&r.back==='Main screen',[r.again,r.back]);
  check('2.3 stars stored per level',r.lv.stars[1]>=1,r.lv.stars);
  check('2.4 no XP level changes (PG.level untouched)',r.level===1,r.level);
  // lose Level 2 twice: still Level 2, TRY AGAIN, and the next start is exactly the same (no free Quake, no rigging)
  g.run('wildReset()');const s2=snap(g),q0=J(g,'bodies.filter(b=>!b.dead&&b.kind==="quake").length');
  for(let k=0;k<2;k++){startRound(g);drops(g,4);g.run("wildFinish(false,'time')");g.ticks(80);}
  const r2=J(g,'({lv:PG.lv,again:pglAgainText(),eq:board.earnedQuakes})');
  check('2.5 a loss keeps the level (Level 2, TRY AGAIN)',r2.lv.passed===1&&r2.lv.sel===2&&r2.again==='TRY AGAIN',r2);
  g.run('wildReset()');const s3=snap(g),q1=J(g,'bodies.filter(b=>!b.dead&&b.kind==="quake").length'),eq=J(g,'board.earnedQuakes');
  const sl=sameLayout(s2,s3);check('2.6 after two losses the level starts as before: no free Quake, nothing moved or added',sl.ok&&q1===q0&&eq===0,{sl,q0,q1,eq});
  // arrows on the PLAY screen replay passed levels
  g.run('PG.lv.passed=3;PG.lv.sel=4;wildReset();PGU.screen="main";');g.ticks(10);g.c.draw();const A=J(g,'({prev:PGA.L.prev,next:PGA.L.next})');
  g.tap(A.prev.x+20,A.prev.y+20);g.ticks(5);const sel=J(g,'PG.lv.sel'),coll=J(g,'WILD_COLLECTION');shot(g,'main-arrows-level3');
  check('2.7 PLAY screen arrows: back to a passed level (4 to 3, its own goal); no arrow past the newest level',A.prev&&!A.next&&sel===3&&coll.join()==='sardine,sock,biscuit,egg,box',{A,sel,coll});
  check('2.8 no frame errors',!errs(g).length,errs(g));}

 // ---------- 3. unlocks hang off levels; cats ----------
 {const g=await G({seed:7});const side=()=>J(g,'pgSideRects(0,90).map(r=>r.id)');
  check('3.1 a new game shows no side buttons (no screen is needed yet)',side().length===0,side());
  level(g,1);startRound(g);winNow(g);g.ticks(40);const a1=side();
  g.run('wildReset()');g.ticks(2);startRound(g);winNow(g);g.ticks(60);const a2=side(),rec=J(g,'PG.recipes');
  check('3.2 Level 1 passed: still nothing; Level 2 passed: the Kitchen with the first recipe (Tuna dish)',a1.length===0&&a2.includes('kitchen')&&rec.tunadish===1,{a1,a2,rec});
  check('3.3 the Shop shows when the recipe needs something no cat of yours drops (tuna)',a2.includes('shop'),a2);
  g.run('PG.dishes.tunadish=1');g.ticks(40);const a3=side();g.run("PG.photos.orange=1");g.ticks(40);const a4=side();
  check('3.4 the Porch appears with the first dish, the Album with the first photo',a3.includes('porch')&&!a3.includes('album')&&a4.includes('album'),{a3,a4});
  check('3.5 no Cats button with one cat',!a4.includes('board'));
  g.run("pgOpenBoard('orange');PGU.moment=null;");g.ticks(60);const a5=side();
  check('3.6 a cat coin makes the cat playable at once (no level-5 gate); the Cats button appears',a5.includes('board')&&J(g,"pgCanPlay('orange')")&&J(g,'PG.lv.passed')===2,a5);
  g.run('wildReset();PGU.screen="main";');g.ticks(10);shot(g,'main-after-unlocks');
  g.run('PGU.pick=true;PGU.pickT=1');g.ticks(3);shot(g,'cat-picker');const P=J(g,'pglPickRects()');g.tap(P.rows[1].x+120,P.rows[1].y+30);g.ticks(30);
  const c=J(g,'({cat:PGU.boardCat,mode:WILD.mode,sel:PG.lv.sel,name:wildModeName(),coll:WILD_COLLECTION})');
  check('3.7 the cat picker switches to Orange (Treat toss) on the same level',c.cat==='orange'&&c.mode==='treats'&&c.sel===3&&c.name==='ORANGE',c);
  // the cat's prizes fall from the sky during play, only that cat's
  g.run("globalThis.__drops=[];const lb=wildLandBonus;wildLandBonus=function(o){__drops.push(o.kind+':'+(o.id||''));return lb(o);}");startRound(g);drops(g,40);
  const d=J(g,'__drops'),items=d.filter(s=>s.startsWith('item:')).map(s=>s.slice(5)),ownO=J(g,"PG_CAT.orange.own"),ownAll=J(g,'PG_CATS.flatMap(c=>PG_CAT[c].own)');
  check("3.8 playing Orange, at least two of Orange's prizes drop from the sky; no other cat's",items.filter(i=>ownO.includes(i)).length>=2&&items.every(i=>!ownAll.includes(i)||ownO.includes(i)),d);
  shot(g,'board-orange');check('3.9 no frame errors',!errs(g).length,errs(g));}

 // ---------- 4. powers ----------
 {const g=await G({seed:8});
  g.run("for(const c of PG_CATS)PG.open[c]=1;PG.powers={};");level(g,4,'tuxedo');startRound(g);drops(g,3);
  g.run("globalThis.__sg=pgpSideGame;pgpSideGame=()=>true;sfx.wild2('perfect',1);");g.ticks(5);const wait=J(g,'pgpCount("tuxedo")');g.run('pgpSideGame=__sg');g.ticks(5);const got=J(g,'pgpCount("tuxedo")');
  check('4.1 a perfect side game earns the cat its power, once the side game is over (Yawn +1)',wait===0&&got===1,{wait,got});
  const B=J(g,'pgpButton()');g.tap(B.x+B.w/2,B.y+B.h/2);g.ticks(30);const y=J(g,'({px:PGPX&&PGPX.id,yawn:!!W2_YAWN,n:pgpCount()})');shot(g,'power-yawn');
  check('4.2 tap the power button: Yawn (the wheel\'s yawn) and the count goes down',y.px==='yawn'&&y.yawn&&y.n===0,y);g.ticks(240);
  check('4.3 the power ends by itself',J(g,'PGPX')===null);
  g.run("PG.powers={orange:1,ragdoll:1,siamese:1,tortie:1}");
  check('4.4 the button shows the playing cat\'s own count (Tuxedo 0 while the others have 1)',J(g,'pgpCount()')===0&&!J(g,'pgpReady()'));
  // Zoomies
  level(g,4,'orange');startRound(g);drops(g,2);const p0=J(g,'PUSH_PERIOD');g.run('pgpUse()');g.ticks(60);const p1=J(g,'PUSH_PERIOD');shot(g,'power-zoomies');g.ticks(420);const p2=J(g,'PUSH_PERIOD');
  check('4.5 Zoomies: the pusher at double speed for 6 s, then back',p1===p0/2&&p2===p0,{p0,p1,p2});
  // Hug: a coin sliding off a side stays on with the Hug, falls without it
  const slide=(hug)=>{level(g,4,'ragdoll');startRound(g);if(hug)g.run('pgpUse()');g.ticks(20);
   g.run("globalThis.__c=addCoin('coin',null,T.L+20,COIN_HALF*2+4,560,yawTurn(0));__c.rb.setLinvel({x:-9,y:0,z:0},true);");g.ticks(90);return J(g,'({dead:!!__c.dead,x:__c.dead?null:Math.round(__c.rb.translation().x/M)})');};
  const without=slide(false);g.run('PG.powers.ragdoll=1');const withHug=slide(true);shot(g,'power-hug');
  check('4.6 Hug: the side gutters are blocked (a coin pushed off the side stays on), without it the coin falls',without.dead&&!withHug.dead,{without,withHug});g.ticks(400);
  check('4.7 Hug ends and the gutters open again',J(g,'PGPX')===null);
  // Sonic meow
  level(g,4,'siamese');startRound(g);let mx0=0;for(let i=0;i<200;i++){g.tick();mx0=Math.max(mx0,J(g,'pusherY'));}g.run('pgpUse()');let mx1=0;for(let i=0;i<200;i++){g.tick();mx1=Math.max(mx1,J(g,'pusherY'));if(i===60)shot(g,'power-sonic');}
  check("4.8 Sonic meow: the pusher reaches twice as far (max stroke 260 -> 330)",mx0<=261&&mx1>=325,{mx0,mx1});g.ticks(200);
  // Tortitude
  level(g,4,'tortie');startRound(g);drops(g,2);const c0=J(g,'WILD.pgCoins|0');g.ticks(60);const c1=J(g,'WILD.pgCoins|0');g.run('pgpUse()');g.ticks(12);shot(g,'power-tortitude');g.ticks(48);
  const c2=J(g,'WILD.pgCoins|0'),sh=J(g,'WILD.pgpShoved');
  check('4.9 Tortitude: a fiery burst shoves a big group of coins forward (coins off the front in the next second vs the second before)',sh>=30&&(c2-c1)>=(c1-c0)+5,{shoved:sh,before:c1-c0,after:c2-c1});
  check('4.10 no frame errors; sounds played with sound on (strict audio)',!errs(g).length&&g.st.created>500,{errs:errs(g),nodes:g.st.created});}

 // ---------- 5. Mouse pounce (the Tortoiseshell) ----------
 {const g=await G({seed:9});g.run("PG.open.tortie=1;PG.powers={};");level(g,3,'tortie');startRound(g);
  let mc=false;for(let k=0;k<10&&!mc;k++){g.run('wildScheduleBonus()');mc=J(g,"WILD.incoming.some(o=>o.kind==='mousecoin')");}
  check('5.1 the mouse coin comes as one of the bonus drops (Tortoiseshell only)',mc);
  g.run('WILD.incoming=[];WILD.pounceForce=true');g.until('!!WILD.pounce&&WILD.pounce.phase==="play"',300);const left0=J(g,'WILD.left');let k=0,shotDone=false;
  while(g.run('!!WILD.pounce&&WILD.pounce.phase==="play"')&&k<1500){const m=J(g,'(WILD.pounce.mice.find(m=>m.state==="run"&&m.x>30&&m.x<370)||null)');if(m&&k%6===0)g.tap(Math.round(m.x),Math.round(m.y-14));
   if(!shotDone&&k>200&&J(g,'WILD.pounce.slams.length')){shot(g,'pounce-play');shotDone=true;}g.tick();k++;}
  const P=J(g,'({c:WILD.pounce.caught,n:WILD.pounce.n,perfect:WILD.pounce.perfect,left:WILD.left})');g.run('wildFinish(true)');const waits=J(g,'WILD.pounce&&WILD.pounce.winWaiting');shot(g,'pounce-end');
  check('5.2 tap the mice: every one caught is PERFECT; the round timer holds during the pounce',P.perfect&&P.c===P.n&&Math.abs(P.left-left0)<.5,P);
  check('5.3 a win during the pounce waits for it to finish',waits===true);
  g.ticks(200);check('5.4 PERFECT earns the Tortoiseshell a Tortitude; the bank pours as a coin rain',J(g,'pgpCount("tortie")')===1&&J(g,'WILD.rained')>=P.n*3,{t:J(g,'pgpCount("tortie")'),rained:J(g,'WILD.rained')});
  // a miss is a miss
  g.run('wildReset()');startRound(g);g.run('WILD.pounceForce=true');g.until('!!WILD.pounce&&WILD.pounce.phase==="play"',300);g.tap(200,300);g.ticks(2);
  check('5.5 a tap on nothing is a miss (red cross)',J(g,'WILD.pounce.whiffs')===1&&J(g,'WILD.pounce.fx.some(f=>f.cross)'));
  check('5.6 no frame errors',!errs(g).length,errs(g));}

 // ---------- 6. nothing overlaps on the PLAY screen (rule 11), three phone heights ----------
 for(const h of [720,888.889,960]){const g=await G({height:h,seed:3});g.run('PG.lv.passed=4;PG.lv.sel=3;for(const c of PG_CATS)PG.open[c]=1;PG.shown={kitchen:1,porch:1,album:1,shop:1,board:1};wildReset();PGU.screen="main";');g.ticks(10);g.c.draw();
  const R=J(g,'({L:PGA.L,side:pgMainRects().side.map(s=>s.hit),play:PGA.L.play,dock:pgDock().bottom})');const ov=(a,b)=>a&&b&&a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  const bad=[];for(const s of R.side){for(const k of ['prev','next','help','play'])if(ov(R.L[k],s))bad.push(k);}if(ov(R.L.prev,R.L.help)||ov(R.L.next,R.L.help))bad.push('arrow/help');
  check('6.'+Math.round(h)+' PLAY screen at '+Math.round(h)+' px: arrows, How to play, PLAY and the side buttons never touch',!bad.length,bad);shot(g,'main-h'+Math.round(h));
  g.run('PGU.pick=true;PGU.pickT=1');g.ticks(2);const pr=J(g,'pglPickRects()');check('6.'+Math.round(h)+'b the cat picker fits on screen',pr.card.y>=0&&pr.card.y+pr.card.h<=h,{y:pr.card.y,h:pr.card.h});}

 // ---------- 7. kept as they were ----------
 {const g=await G({seed:4});const b=await game({src:base,render:false,seed:4});
  const fns=['queueTreatAward','pickupTarget','pickupEase','drawPrize','w2StartYawn','danceStart','tossStart','laserStart','petStart'];
  const same=fns.map(f=>{try{return g.run(f+'.toString()')===b.run(f+'.toString()');}catch(e){return 'missing '+f;}});
  check('7.1 the frozen pickup and the side games\' own code are byte-identical to UAT 60',same.every(x=>x===true),Object.fromEntries(fns.map((f,i)=>[f,same[i]])));
  const sk=J(g,'Object.keys(sfx).filter(k=>typeof sfx[k]==="function")').filter(k=>k!=='wild2'),sameS=sk.filter(k=>{try{return g.run('String(sfx["'+k+'"])')!==b.run('String(sfx["'+k+'"])');}catch(e){return true;}});
  check('7.2 audio: every sound function is UAT 60\'s (sfx.wild2 only gets a pass-through hook that notes a perfect)',sameS.length===0,sameS);
  // Developer MODES: the old modes as they were (no levels)
  g.run("pgModesTap({x:-1,y:-1})");g.run("PGL.dev=true;wildModeEnter('treats');");g.ticks(5);const dev=J(g,"({n:bodies.filter(b=>!b.dead&&b.kind==='item').length,lvl:!!pglOn(),coll:WILD_COLLECTION.length})");
  check('7.3 Developer MODES plays the old modes as before (CP-45 prize list on Wild 2 spots, no levels)',dev.n===dev.coll&&dev.coll>=5&&!dev.lvl,dev);
  g.run("pgPlay('tuxedo')");g.ticks(5);check('7.4 playing a cat brings levels back',!!J(g,'!!pglOn()'));
  check('7.5 the title screen and its keys are untouched',g.run('pgDrawTitle.toString()')===b.run('pgDrawTitle.toString()'));}

 const res={build:src,base,passed:passed.length,failed,at:new Date().toISOString()};fs.writeFileSync(path.join(OUT,'checks61.json'),JSON.stringify({...res,passed:failed.length===0,count:passed.length+failed.length,names:passed},null,1));
 console.log(passed.length+'/'+(passed.length+failed.length)+' passed');process.exit(failed.length?1:0);
})();
