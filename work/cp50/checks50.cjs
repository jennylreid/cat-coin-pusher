// UAT 50 checks: CP-45 Gameplay map prototype, rework (a CatCoin title, then the coin board is home) (sound on, strict
// fake Web Audio, frames drawn with exceptions caught).
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames,breakRun}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','..','tickets','CP-45-evidence','uat50'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info).slice(0,400):''));}
async function g0(seed=2,storage={}){const g=await game({src,seed,render:true,storage});const st=strictAudio(g);g.run('S.muted=false;S.dev=true');const errs=[];frames(g,3,errs);return {g,st,errs};}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const tapR=(g,r)=>g.tap(r.x+r.w/2,r.y+r.h/2);
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const tile=(g,id)=>J(g,`pgDock().tiles.find(t=>t.id==='${id}')`);
// every tick drawn (the screens animate in draw)
function play(g,n,errs){for(let i=0;i<n;i++){try{g.tick();g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
// past the title (a tap skips it) onto the board's goal card, the top bar faded in
function toBoard(g,errs){if(g.run("PGU.screen==='title'")){play(g,12,errs);g.tap(200,400);}play(g,30,errs);}
function holdRound(g,errs,secs=70,top=true){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)frames(g,1,errs);
 for(let s=0;s<secs&&g.run("WILD.phase==='play'");s++){g.run(`${top?'S.coins=Math.max(S.coins,40);':''}holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};`);frames(g,60,errs);}g.run('holding=false');frames(g,200,errs);}
(async()=>{
 // 1. the CatCoin title, then the Tuxedo's coin board with the top bar; no Home screen
 {const {g,st,errs}=await g0();check('build label',g.run('BUILD')==='2026.11.14 UAT 50',g.run('BUILD'));
  const s=J(g,'{screen:PGU.screen,on:WILD.on,level:PG.level,open:PG.open}');check('the game opens on the CatCoin title screen; a new save has only the Tuxedo board, level 1',s.screen==='title'&&!s.on&&s.level===1&&JSON.stringify(s.open)==='{"tuxedo":1}',s);
  const n0=st.created;play(g,85,errs);shot(g,'title');check('the title moves and sounds: letters drop in with clinks, coins rain, the Tuxedo pops up and meows',g.run('PGU.title.coins.length')>5&&g.run('PGU.title.snd')>=8&&st.created>n0,{coins:g.run('PGU.title.coins.length'),snd:g.run('PGU.title.snd'),nodes:st.created-n0});
  play(g,90,errs);const b=J(g,'{screen:PGU.screen,on:WILD.on,v2:WILD.v2,mode:WILD.mode,phase:WILD.phase,cat:PGU.boardCat,t:PGU.title.t}');
  check("after about 2.6 s it goes straight onto the Tuxedo's coin board (Wild 2, goal card)",b.screen==='board'&&b.on&&b.v2&&!b.mode&&b.phase==='card'&&b.cat==='tuxedo'&&b.t<2.8,b);
  play(g,20,errs);shot(g,'board-home');check('the board is home: the top bar shows with the goal card (level, XP, coins, Catnip, Settings, 5 buttons)',g.run('pgRestPhase()')&&J(g,'pgDock().tiles.map(t=>t.id)').join()==='kitchen,porch,album,shop,board');
  const D=J(g,'pgDock()'),chin=g.run('w43ChinY()'),card=J(g,'w2CardLayout().card');check("the bar sits in the HUD band at the top: above the cat's head, clear of the goal card and the table",D.bottom<=110&&D.bottom<card.y&&D.bottom<chin-200,{bottom:D.bottom,card:card.y,chin});
  tapR(g,tile(g,'kitchen'));play(g,30,errs);check('a locked button (Kitchen, level 2) stays shut and says so',g.run('PGU.screen')==='board'&&g.run("PGU.toasts.some(t=>/level 2/.test(t.text))"));
  g.run("globalThis.__ty=[];globalThis.__u=uiRound;uiRound=function(x,y,w,h,r,...a){if(h===34&&r===17)__ty.push(y+17);return __u(x,y,w,h,r,...a);}");g.c.draw();const ty=J(g,'__ty'),L=J(g,'w2CardLayout()');g.run('uiRound=__u');
  check("on the goal card, messages sit in the card's free bottom slot under TAP TO START (never over the card's title)",ty.length>0&&ty.every(y=>Math.abs(y-(L.back.y+L.back.h/2))<2&&y>L.start.y),{ty,slot:L.back.y+L.back.h/2,title:L.card.y});
  g.tap(200,L.card.y+200);play(g,3,errs);check('a tap on the goal card still starts the round',g.run('WILD.phase')==='count');play(g,10,errs);check('during the round the top bar is gone (the normal HUD is back)',!g.run('pgRestPhase()'));
  check('title and board: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 {const {g,errs}=await g0();play(g,20,errs);g.tap(200,400);play(g,3,errs);check('a tap skips the title',g.run('PGU.screen')==='board'&&g.run('WILD.on')&&g.run('PGU.title.t')<.6,g.run('PGU.title.t'));g.close();}
 // 2. a UAT 48 save upgrades: coins and treats carry over, capped, extras to coins once
 {const loop=JSON.stringify({schema:1,coins:500,lastRegen:Date.now(),got:{tuna:12,cheese:2,shrimp:0}});
  const {g}=await g0(2,{'catpusher.uat.loop.v1':loop});const s=J(g,'{coins:PG.coins,items:PG.items,m:PG.migrated}');
  check('UAT 48 save: 500 coins and 12 tuna become 9 tuna (cap) + 3 × 15 coins',s.coins===545&&s.items.tuna===9&&s.items.cheese===2,s);g.close();}
 // 3. cat boards, exclusive prizes, recipes needing another board
 {const {g}=await g0();const pools=J(g,'Object.fromEntries(PG_CATS.map(c=>[c,pgPool(c)]))'),own=J(g,'Object.fromEntries(PG_CATS.map(c=>[c,PG_CAT[c].own]))');
  const excl=Object.keys(own).every(c=>own[c].every(id=>Object.keys(pools).filter(d=>pools[d].includes(id)).join()===c));
  check('each cat board drops 2 prizes no other board drops (map section 4) plus the 5 shared ones',excl&&Object.values(pools).every(p=>p.length===7),pools);
  const rec=J(g,'PG_RECIPES.map(r=>({id:r.id,cat:r.cat,other:Object.keys(r.need).filter(i=>pgOwner(i)&&pgOwner(i)!==r.cat)}))');
  check("every recipe needs a prize from another cat's board (or the Shop)",rec.every(r=>r.other.length>0),rec);
  const modes=J(g,'Object.fromEntries(PG_CATS.map(c=>[c,PG_CAT[c].mode]))');check('board matching: Tuxedo Wild 2, Orange Treat toss, Ragdoll Cozy, Siamese Laser, Tortie Tower wall',JSON.stringify(modes)==='{"tuxedo":null,"orange":"treats","ragdoll":"cozy","siamese":"laser","tortie":"towers"}',modes);
  g.run('PG.level=2;pgUnlocks(2)');const cnt={};for(let i=0;i<300;i++)for(const id of J(g,"pgRoundList('tuxedo')"))cnt[id]=(cnt[id]||0)+1;
  const lens=new Set();for(let L of [1,3,5])for(let i=0;i<20;i++){g.run('PG.level='+L);lens.add(J(g,"pgRoundList('orange')").length);}
  check('round lists are 5-7 prizes and lean toward what the recipe needs (notes, biscuit, milk) over the rest',cnt.notes>cnt.bowtie*1.15&&cnt.milk>cnt.feather*1.15&&cnt.biscuit>cnt.feather*1.15&&[...lens].every(n=>n>=5&&n<=7),{cnt,lens:[...lens]});g.close();}
 // 4. a whole Tuxedo round from the goal card; rewards; New goal; EXIT
 {const {g,st,errs}=await g0(3);toBoard(g,errs);
  const s=J(g,'{screen:PGU.screen,on:WILD.on,v2:WILD.v2,mode:WILD.mode,list:WILD_COLLECTION.slice(),goal:WILD_GOAL,star:WILD.star}');
  check('the Tuxedo board (Wild 2) has a 5-prize list from its pool and the star on the list',s.screen==='board'&&s.on&&s.v2&&!s.mode&&s.goal===5&&s.list.includes(s.star)&&s.list.every(id=>J(g,"pgPool('tuxedo')").includes(id)),s);
  shot(g,'tuxedo-card');
  check('the goal card has no visitor line; the stars line in plain words instead',!J(g,'W2_CARD_LINES').some(l=>l[0]==='visitor'||l[0]==='star')&&J(g,'W2_CARD_LINES').some(l=>l[0]==='pgstars'&&l[1]==='Win: 1 star · 20 s left: 2 stars'&&l[2]==='and a perfect side game: 3 stars'));
  holdRound(g,errs);shot(g,'tuxedo-end');
  const r=J(g,'{res:WILD.pgResult,got:WILD.got,have:WILD.have,items:PG.items,coins:PG.coins,xp:PG.xp,level:PG.level,rounds:PG.rounds}');
  check('a round gives XP, coins to the jar and its prizes to the pantry',r.res&&r.res.xp>=10&&r.rounds===1&&Object.keys(r.have).every(id=>r.items[id]>=1),r);
  check('no visiting-cat card after the round',!g.run('WILD.visitor'));
  check('between rounds the top bar is back over the end card',g.run('pgRestPhase()'));
  const R=J(g,'wildEndRects()');tapR(g,R.back);play(g,10,errs);
  check("the end card's lower button (New goal) shows the next goal card on the same board, not a menu",g.run('PGU.screen')==='board'&&g.run('WILD.on')&&g.run('WILD.phase')==='card'&&g.run('PGU.boardCat')==='tuxedo'&&g.run('pgBackText()')==='New goal');
  g.run('wildStartCountdown()');g.until("WILD.phase==='play'",900);tapR(g,J(g,'wildButton()'));play(g,5,errs);
  check('EXIT during a round comes back to the board and its next goal card',g.run('PGU.screen')==='board'&&g.run('WILD.on')&&g.run('WILD.phase')==='card'&&g.run('PGU.boardCat')==='tuxedo'&&g.run('ART.head===PG_ORIG.head'));
  g.run('pgAddXP(200)');check('XP levels up (level 2 opens Kitchen, Porch, Shop and the Tuna dish)',g.run('PG.level')>=2&&g.run('PG.recipes.tunadish')===1,J(g,'{level:PG.level,recipes:PG.recipes}'));
  check('round, New goal and EXIT: no errors with sound on',!errs.length&&st.created>0,{errs,nodes:st.created});g.close();}
 // 5. stars: 1 for the goal, 2 with 20 s left, 3 with a perfect side game
 {const {g}=await g0();g.run("pgPlay('tuxedo');wildStartCountdown()");g.until("WILD.phase==='play'",900);
  const st=x=>{g.run(x);return g.run('pgStars(true)');};check('stars: win with 10 s left = 1, 25 s = 2, 25 s and a perfect dance = 3, a loss = 0',st('WILD.left=10;WILD.pgPerfect=false')===1&&st('WILD.left=25')===2&&st('WILD.left=25;WILD.pgPerfect=true')===3&&g.run('pgStars(false)')===0);g.close();}
 // 6. Kitchen from the board's button: tap ingredients into the pot, stir with a circle, ding; back to the board
 {const {g,st,errs}=await g0();toBoard(g,errs);g.run("PG.level=2;pgUnlocks(2);PG.items={tuna:1,notes:1,biscuit:2,milk:1}");play(g,5,errs);
  check('the Kitchen button has a paw print (a recipe is ready to cook)',g.run("pgWaiting('kitchen')"));shot(g,'board-level2');tapR(g,tile(g,'kitchen'));play(g,30,errs);
  check('the Kitchen button on the board opens the Kitchen',g.run('PGU.screen')==='kitchen');shot(g,'kitchen');const row=J(g,'pgKitchenRows()[0]');g.tap(row.x+row.w-48,row.y+row.h/2);play(g,5,errs);
  check('COOK starts the pot with 4 ingredients on the shelf',g.run('!!PGU.k.cook')&&g.run('PGU.k.cook.items.length')===4);
  const its=J(g,'PGU.k.cook.items.map(i=>({x:i.x,y:i.y}))');its.forEach(i=>{g.tap(i.x,i.y-20);play(g,40,errs);});
  check('tapping each ingredient drops it in the pot (plop), then STIR',g.run("PGU.k.cook.stage")==='stir',J(g,'PGU.k.cook.items.map(i=>i.in)'));
  const py=g.run('pgPotY()')-30;g.pointer('pointerdown',260,py);for(let k=0;k<64;k++){const a=k/16*Math.PI*2;g.pointer('pointermove',200+60*Math.cos(a),py+30*Math.sin(a));g.tick();}g.pointer('pointerup',200,py);play(g,60,errs);
  const c=J(g,'{stage:PGU.k.cook.stage,dishes:PG.dishes,items:PG.items,recipe:PG.recipes.tunadish}');check('stirring in circles cooks it: DING, a Tuna dish; ingredients used and the recipe used up',c.stage==='ding'&&c.dishes.tunadish===1&&c.items.tuna===0&&c.items.biscuit===1&&c.recipe===0,c);
  shot(g,'kitchen-ding');
  const B=J(g,'pgCookButtons()');tapR(g,B.porch);play(g,5,errs);check('SET IT ON THE PORCH goes to the Porch with the dish picker open',g.run('PGU.screen')==='porch'&&g.run('PGU.porch.pick')===0);
  const P=J(g,'pgPorchPickRects()');tapR(g,P.rows[0]);play(g,5,errs);check('picking the dish sets it on spot 1',g.run('PG.porch[0]&&PG.porch[0].state')==='food'&&g.run('PG.dishes.tunadish')===0);
  tapR(g,J(g,'pgBack()'));play(g,10,errs);check('closing the Porch (Board, top left) returns to the coin board and its goal card',g.run('PGU.screen')==='board'&&g.run('WILD.on')&&g.run('WILD.phase')==='card'&&g.run('pgRestPhase()'));
  for(const id of ['album','shop']){tapR(g,tile(g,id));play(g,30,errs);const sc=g.run('PGU.screen');tapR(g,J(g,'pgBack()'));play(g,10,errs);check(`the ${id} button opens the ${id[0].toUpperCase()+id.slice(1)}; closing it returns to the board`,sc===id&&g.run('PGU.screen')==='board'&&g.run('pgRestPhase()'));}
  check('Kitchen, Porch, Album, Shop: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 // 7. Porch: eaten in real time (also while closed), the message during a round, the photo, a missed visit
 {const {g,errs}=await g0(4);g.run("PG.level=2;PG_DEV.window=60;PG.dishes={tunadish:2};pgSetFood(0,'tunadish');pgSetFood(1,'tunadish')");
  g.run("pgPlay('tuxedo');wildStartCountdown()");g.until("WILD.phase==='play'",900);g.advance(10);frames(g,60,errs);
  check("during a round: \"Someone ate the tuna\" with a paw drawn in code, below the cat's chin",g.run("PGU.toasts.some(t=>t.text==='Someone ate the tuna'&&t.icon==='paw')")&&g.run("PG.porch[0].state")==='visit');
  for(let i=0;i<40;i++){frames(g,1,errs);if(g.run("PGU.toasts[0]&&PGU.toasts[0].text.startsWith('Someone')"))break;}shot(g,'ate-message-on-board');
  g.run("wildFinish(false,'time')");g.until('WILD.endT>=1',300);play(g,5,errs);check('the Porch button has a paw print while a cat is there',g.run("pgWaiting('porch')"));
  tapR(g,tile(g,'porch'));play(g,40,errs);shot(g,'porch-visit');
  const cam=J(g,'pgCamera()');tapR(g,cam);play(g,6,errs);shot(g,'porch-photo-flash');
  const ph=J(g,'{photos:PG.photos,ready:PG.coinReady,state:PG.porch[0].state,fly:!!PGU.porch.fly}');check('the camera: shutter, flash, the photo flies to the Album; the Orange coin can now drop',ph.photos.orange===1&&ph.ready.orange===1&&ph.state==='photo'&&ph.fly,ph);
  g.advance(200);play(g,40,errs);check('a visit missed (window passed while away): paw prints, food gone',g.run('PG.porch[1].state')==='missed'&&g.run('!PG.porch[0]'),J(g,'PG.porch'));
  shot(g,'porch-missed');
  const sp=J(g,'pgSpots()[1]');g.tap(sp.x,sp.y);play(g,5,errs);check('tapping the paw prints tidies the spot',g.run('PG.porch[1]')===null);
  check('the visit window is hidden and real-time: 20 min to 2 h when the dial is off',(()=>{g.run('PG_DEV.window=0');const w=J(g,'[...Array(200)].map(()=>pgVisitWindow())');return Math.min(...w)>=20*60000&&Math.max(...w)<=120*60000;})());
  g.run("pgGo('album');PGU.album.page=2");play(g,30,errs);shot(g,'album-orange');
  check('Porch and Album: no errors',!errs.length,errs);g.close();}
 // 8. the cat coin drops, is pushed off, the board opens with a big moment; the next round is the new board; Boards picker
 {const {g,st,errs}=await g0(5);g.run("PG.level=3;PG.coinReady.orange=1;PG_FORCE_CC='orange';pgPlay('tuxedo');wildStartCountdown()");g.until("WILD.phase==='play'",900);
  g.run('WILD.nextBonus=0');frames(g,90,errs);const cc=g.run("bodies.some(b=>!b.dead&&b.kind==='cc_orange')");check("the Orange cat coin drops on the Tuxedo board",cc);
  g.run("const __b=bodies.find(b=>!b.dead&&b.kind==='cc_orange');__b.rb.setTranslation({x:200*M,y:__b.rb.translation().y,z:(T.FRONT+4)*M},true);fallOff(__b,200)");frames(g,25,errs);shot(g,'cat-coin-moment');
  const m=J(g,'{open:PG.open,moment:PGU.moment&&PGU.moment.cat,newest:pgNewest()}');check("pushing it off opens the Orange's board with a big moment (cat, fanfare, confetti)",m.open.orange===1&&m.moment==='orange'&&m.newest==='orange',m);
  const left0=g.run('WILD.left');frames(g,60,errs);check('the round timer holds during the moment',Math.abs(g.run('WILD.left')-left0)<.05);
  g.run("wildFinish(false,'time')");g.until('WILD.endT>=1',300);play(g,5,errs);check('the Boards button has a paw print for the new board',g.run("pgWaiting('board')"));
  tapR(g,J(g,'wildEndRects()').back);play(g,30,errs);
  check("before level 5 the newest board plays: the next goal card is the Orange's (Treat toss, its recoloured art)",g.run('WILD.mode')==='treats'&&g.run('WILD.phase')==='card'&&g.run('ART.head!==PG_ORIG.head')&&g.run('PGU.boardCat')==='orange'&&!g.run('pgCanPlay("tuxedo")'));
  play(g,200,errs);shot(g,'orange-board-card');check('the goal card comes up clean (no moment, no message over it)',!g.run('PGU.moment')&&!g.run('PGU.toasts.length'));
  tapR(g,tile(g,'board'));play(g,30,errs);check('the Boards button opens the board picker over the board',g.run('PGU.pick')&&g.run('PGU.screen')==='board');shot(g,'board-picker-level3');
  const R=J(g,'pgPickRects()');tapR(g,R.rows[0]);play(g,5,errs);check('before level 5 the older board is locked ("Level 5")',g.run('PGU.boardCat')==='orange'&&g.run('WILD.mode')==='treats'&&g.run("PGU.toasts.some(t=>/level 5/.test(t.text))"));
  check('the picker stays open after a locked tap',g.run('PGU.pick'));g.run('PG.level=5');tapR(g,R.rows[0]);play(g,30,errs);
  check('from level 5, switching is free: Tuxedo picked, its goal card comes up with the original art',g.run('PGU.boardCat')==='tuxedo'&&!g.run('WILD.mode')&&g.run('WILD.phase')==='card'&&g.run('ART.head===PG_ORIG.head'));
  check('cat coin chain: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
 // 9. Shop: sell, buy what no open board drops; caps
 {const {g,errs}=await g0();g.run("PG.level=2;PG.coins=100;PG.items={biscuit:2};pgGo('shop')");play(g,5,errs);let rows=J(g,'pgShopRows()');tapR(g,rows[0].btn);play(g,5,errs);
  check('selling a fish biscuit: +8 coins, one fewer',g.run('PG.coins')===108&&g.run('PG.items.biscuit')===1);
  const T=J(g,'pgShopTabs()');tapR(g,T.buy);play(g,5,errs);rows=J(g,'pgShopRows()');const ids=rows.map(r=>r.id);
  check('the Shop sells only what no open board drops (8 exclusives at the start)',ids.length===8&&!ids.includes('biscuit')&&!ids.includes('bowtie')&&ids.includes('tuna'),ids);
  const tr=rows.find(r=>r.id==='tuna');tapR(g,tr.btn);play(g,5,errs);check('buying a tuna: -60 coins (till)',g.run('PG.coins')===48&&g.run('PG.items.tuna')===1);
  tapR(g,tr.btn);play(g,5,errs);check('not enough coins: nothing bought',g.run('PG.coins')===48&&g.run('PG.items.tuna')===1);
  g.run('PG.items.tuna=0;PG.coins=0;pgAddItem("tuna",12)');check('caps: 12 tuna keep 9; the 3 extra become 45 coins at once',g.run('PG.items.tuna')===9&&g.run('PG.coins')===45&&g.run('PGU.floats.some(f=>f.text==="+45")'));
  g.run('PG_DEV.cap=3');g.run('pgAddItem("egg",5)');check('the cap dial changes the cap (3)',g.run('PG.items.egg')===3);
  check('Shop: no errors',!errs.length,errs);g.close();}
 // 10. Album: a full page stamps and gives Catnip; the win
 {const {g,errs}=await g0();g.run("PG.photos.ragdoll=3;pgCheckStamps()");check('a full cat page (3 photos) stamps and gives 3 Catnip',g.run('PG.catnip')===3&&g.run('PG.stamped.ragdoll')===1);
  toBoard(g,errs);g.run("for(const c of PG_CATS){PG.photos[c]=1;PG.open[c]=1}pgCheckWin()");play(g,30,errs);check('every cat photographed and every board open: YOU WON (on the board, between rounds)',g.run('PG.won')&&g.run('!!PGU.win'));
  shot(g,'you-won');check('Album and win: no errors',!errs.length,errs);g.close();}
 // 11. one dance move per dance, a different one each time
 {const {g}=await g0();const mv=[];for(let i=0;i<12;i++)mv.push(g.run('pgNextMove()'));check('each dance picks one of the 4 moves, never the same twice in a row',mv.every((m,i)=>m>=0&&m<4&&(i===0||m!==mv[i-1]))&&new Set(mv).size>=3,mv);
  g.run("pgPlay('tuxedo');wildStartCountdown()");g.until("WILD.phase==='play'",900);g.run('S.muted=true');g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;}}board.status='playing';wildFinish(true)");const idx=new Set();let seen=0;for(let i=0;i<60*9;i++){g.tick();const p=J(g,'pawDancePhase()');if(p){seen++;if(!p.intro)idx.add(p.index);}}
  check('the win dance holds one move (game-time clock) for the whole dance',idx.size===1&&seen>120,{moves:[...idx],seen});g.close();}
 {const r=await breakRun(src,true);check('Wild 2 dance break runs to the end (UAT 48 test)',r.ended&&r.gameRunning&&!r.errs.length,r);}
 {const r=await breakRun(src,true,{win:true});check('a Wild 2 win: no visitor card',!r.visitor&&!r.errs.length,r);}
 // 12. every cat board plays 30 s without errors, with its copy of the art and its own list
 for(const c of ['tuxedo','orange','ragdoll','siamese','tortie']){const {g,st,errs}=await g0(6);toBoard(g,errs);g.run(`PG.open['${c}']=1;PG.openOrder.push('${c}');PG.level=5;pgSwitchBoard('${c}')`);
  const s=J(g,'{mode:WILD.mode,list:WILD_COLLECTION.slice(),cat:PGU.boardCat}');holdRound(g,errs,30);shot(g,'board-'+c);
  const pool=J(g,`pgPool('${c}')`);check(`${c}'s board plays 30 s (sound on), its list from its own pool`,!errs.length&&st.created>0&&s.list.every(id=>pool.includes(id))&&s.cat===c,{s,errs});g.close();}
 // 13. Developer
 {const {g}=await g0();const h=g.run('wildDevHtml()');check('Developer: visit window, XP speed, item cap, give all cat coins, reset, cat visits now, MODES',['Visit window','XP speed','Item cap','Give all cat coins','Reset progression','Cat visits now','data-pgmode="treats"','data-pgmode="towers"','data-pgmode="wild2"'].every(x=>h.includes(x)));
  g.run('pgAddXP(10)');g.run('PG_DEV.xp=5');const x0=g.run('PG.xp');g.run('pgAddXP(4)');check('XP speed 5× multiplies XP',g.run('PG.xp')-x0===20||g.run('PG.level')>1);g.close();}
 // 14. no drawn text that relies on the phone's emoji or symbol fonts
 {const s2=['progress50.js'].map(f=>fs.readFileSync(path.join(__dirname,f),'utf8')).join('');const odd=[...new Set([...s2].filter(ch=>ch.codePointAt(0)>0x2030&&!'…−'.includes(ch)))];
  check('no emoji or symbol glyphs in the drawn text (stars, paws and arrows are drawn in code)',!odd.length,odd.map(c=>c.codePointAt(0).toString(16)));}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
