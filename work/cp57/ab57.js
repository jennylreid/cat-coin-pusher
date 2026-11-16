// --- UAT 55: A/B of the between-rounds layout (CP-45 A/B brief; Jenny, Nov 14: one clear thing to do, where you are and
// how hard it is, everything else quiet at the edges; "CatCoin needs to have a cat and coins right away").
// Both variants share one hierarchy: one big PLAY; "Level n" and a difficulty tag; the goal ("Collect these 7" with the
// prize icons); Kitchen, Porch, Album (left) and Shop, Boards (right) as small round buttons in the side columns, with a
// "!" when something waits there and the same unlock rules; a slim top bar (level/XP, coins, Catnip, Collections,
// Inventory, MODES with Developer, Settings). Nothing goes over the cat's face; nothing in the bottom strip during play.
//  A, main screen: between rounds a screen of its own: the board's cat (floating head) over a coin rain and a pile of coins,
//     with the hierarchy. PLAY goes onto the board and starts the round; the end card's New goal comes back here.
//  B, board view: no extra screen; between rounds the coin board stays behind, the hierarchy sits in the goal card's area
//     (below the chin) instead of the old card and the row of five equal buttons.
// "?" shows the old goal card (the rules), from which a tap starts the round as before.
// Developer: "Home layout: A main screen / B board view" (default A, takes effect at once) and a difficulty tag per board.
const PG_AB_KEY='catpusher.uat.homelayout.v1',PG_DIFF_KEY='catpusher.uat.difficulty.v1';
const PG_DIFFS=['Normal','Hard','Super hard'],PG_DIFF_COL={Normal:['#7dff6a','#0c3a12'],Hard:['#ffb23f','#4a2200'],'Super hard':['#ff5a8a','#4a0a22']};
const PG_DIFF_DEFAULT={tuxedo:'Normal',orange:'Normal',ragdoll:'Hard',siamese:'Hard',tortie:'Super hard'}; // placeholders, by opening order
let PG_AB='A',PG_DIFF={...PG_DIFF_DEFAULT};
try{const a=localStorage.getItem(PG_AB_KEY);if(a==='A'||a==='B')PG_AB=a;const d=JSON.parse(localStorage.getItem(PG_DIFF_KEY)||'null');if(d)for(const c in PG_DIFF_DEFAULT)if(PG_DIFFS.includes(d[c]))PG_DIFF[c]=d[c];}catch(e){}
function pgABSave(){try{localStorage.setItem(PG_AB_KEY,PG_AB);localStorage.setItem(PG_DIFF_KEY,JSON.stringify(PG_DIFF));}catch(e){}}
function pgABOn(){return !!(PG&&!PG_HOME_OFF&&!PGU.oldBoards);}
function pgDiff(cat){return PG_DIFF[cat]||'Normal';}
const PG_SIDE_L=['kitchen','porch','album'],PG_SIDE_R=['shop','board'];

// the slim top bar: row 1 only (the five big buttons move to the side columns)
const __abDock=pgDock;
pgDock=function(){const D=__abDock();if(!pgABOn())return D;const top=D.top,bot=D.bottom,y1=Math.round((top+bot)/2)-1,r=y1-15; // the same band as before (it covers the round's HUD), one row centred in it
 return {top,bottom:bot,y1,gear:{x:W-40,y:r,w:40,h:30},coll:{x:248,y:r+1,w:30,h:28},inv:{x:280,y:r+1,w:30,h:28},modes:S.dev?{x:314,y:r+4,w:44,h:22}:null,tiles:[]};};

// side columns: from y0 down, 3 on the left and 2 on the right
function pgSideRects(y0,gap){const r=[];PG_SIDE_L.forEach((id,i)=>r.push({id,x:36,y:y0+i*gap,r:25}));PG_SIDE_R.forEach((id,i)=>r.push({id,x:W-36,y:y0+i*gap,r:25}));
 return r.map(b=>({...b,level:PG_DOCK_LEVEL[b.id],hit:{x:b.x-32,y:b.y-30,w:64,h:68}}));}
function pgDrawSide(rects,t){for(const b of rects){const id=b.id,col=PG_DOCK_COL[id],locked=b.level&&PG.level<b.level,pr=PGU.door&&PGU.door.id===id?Math.min(1,PGU.door.t/.24):0,k=1-.12*Math.sin(pr*Math.PI);
  ctx.save();ctx.translate(b.x,b.y);ctx.scale(k,k);uiCircle(0,3,b.r,'rgba(0,0,0,.35)');const g=ctx.createLinearGradient(0,-b.r,0,b.r);g.addColorStop(0,col[0]);g.addColorStop(1,col[1]);uiCircle(0,0,b.r,g,'#fff6d0',2);
  ctx.save();ctx.beginPath();ctx.arc(0,0,b.r-2,0,7);ctx.clip();ctx.scale(.42,.42);pgDoorIcon(id,0,4,t);ctx.restore();
  if(locked){uiCircle(0,0,b.r,'rgba(10,6,20,.6)');pgLock(0,0,.7);}
  ctx.textAlign='center';ctx.textBaseline='middle';const lab=locked?'LEVEL '+b.level:pgDockName(id).toUpperCase();ctx.font='900 10px Impact, system-ui';const lw=ctx.measureText(lab).width+10;
  uiRound(-lw/2,b.r-4,lw,15,7,'rgba(16,8,28,.9)',locked?'#ffe08a':col[0],1);ctx.fillStyle=locked?'#ffe08a':'#fff';ctx.fillText(lab,0,b.r+4);
  if(!locked&&pgWaiting(id)){const kk=1+.1*Math.sin(t*6);uiCircle(b.r*.72,-b.r*.72,9*kk,'#ff3a6a','#fff',2);ctx.fillStyle='#fff';ctx.font='900 '+Math.round(13*kk)+'px Impact, system-ui';ctx.fillText('!',b.r*.72,-b.r*.72+1);}
  ctx.restore();}}
function pgSideTap(rects,p){for(const b of rects){if(!contains(b.hit,p))continue;if(b.level&&PG.level<b.level){pgSfx('lock');pgToast(pgDockName(b.id)+' opens at level '+b.level,'#ffe08a');return true;}pgSfx('door');PGU.door={id:b.id,t:0};return true;}return false;}

// the centre: board name, Level n + difficulty, the goal, PLAY, "?"
function pgDiffPill(x,y,tag){ctx.font='900 15px Impact, system-ui';const w=ctx.measureText(tag.toUpperCase()).width+22,c=PG_DIFF_COL[tag]||PG_DIFF_COL.Normal;uiRound(x-w/2,y-12,w,24,12,c[0],'#fff6d0',1.5);ctx.fillStyle=c[1];ctx.textAlign='center';ctx.fillText(tag.toUpperCase(),x,y+1);return w;}
function pgCentre(y,t,o={}){const cat=PGU.boardCat||'tuxedo',L={};
 wildText(o.name||wildModeName(),200,y,o.nameSize||30,'#ffd23f','#2a0b3e',6);
 // Level n and the tag side by side
 ctx.font='italic 900 22px Impact, "Arial Black", system-ui';const lt='LEVEL '+pgBoardLevel(),lw=ctx.measureText(lt).width;ctx.font='900 15px Impact, system-ui';const tw=ctx.measureText(pgDiff(cat).toUpperCase()).width+22,tot=lw+10+tw,x0=200-tot/2;
 ctx.textAlign='left';wildText(lt,x0,y+38,22,'#fff','#2a0b3e',5);ctx.textAlign='center';pgDiffPill(x0+lw+10+tw/2,y+37,pgDiff(cat));
 // the goal
 ctx.font='bold 15px system-ui';ctx.fillStyle='#ffe8b0';ctx.fillText('Collect these '+WILD_GOAL,200,y+72);
 const n=WILD_COLLECTION.length,sp=Math.min(42,238/Math.max(1,n));WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(n-1)/2)*sp,y+98,Math.min(40,sp-2),!!WILD.have[id]));
 // "?" how to play
 L.help={x:200-58,y:y+130,w:116,h:26};uiRound(L.help.x,L.help.y,L.help.w,L.help.h,13,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);ctx.font='bold 12px system-ui';ctx.fillStyle='#e8dcff';ctx.fillText('? How to play',200,L.help.y+L.help.h/2+1);
 return L;}
function pgPlayButton(y,t,hh=78){const k=1+.035*Math.sin(t*4),r={x:78,y,w:244,h:hh};ctx.save();ctx.translate(200,y+hh/2);ctx.scale(k,k);ctx.translate(-200,-(y+hh/2));
 uiRound(r.x,r.y+6,r.w,r.h,30,'rgba(0,0,0,.4)');const g=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g.addColorStop(0,'#ffe36a');g.addColorStop(.55,'#ffc21f');g.addColorStop(1,'#e8900a');uiRound(r.x,r.y,r.w,r.h,30,g,'#fff6d0',3);
 uiRound(r.x+14,r.y+8,r.w-28,18,9,'rgba(255,255,255,.35)');ctx.textAlign='center';wildText('PLAY',200,r.y+r.h/2+3,Math.min(46,hh*.6),'#fff','#7a3a00',8);ctx.restore();return r;}
function pgStartRound(){PGU.rules=false;const L=w2CardLayout();pgSfx('door');__pgPointer({timeStamp:0,preventDefault(){}},{x:200,y:L.start.y+L.start.h/2});}

// ---- B: the board view's between-rounds panel (in place of the goal card) ----
function pgBLayout(){const h=hudLayout(),ch=w43ChinY(),bot=Math.min(H-Math.max(24,h.bottom+16),h.bottomY-12); // UAT 57: the panel ends above the bottom readouts (rule 11)
 const py=Math.max(ch+8+194,bot-96),ph=Math.max(50,Math.min(78,bot-6-py));return {ch,bot,panel:{x:72,y:ch+8,w:256,h:bot-ch-8},play:py,playH:ph,side:pgSideRects(ch+46,Math.min(96,(bot-ch-80)/3))};}
const __abCard=drawWild2Card;
drawWild2Card=function(){if(!pgABOn()||PG_AB!=='B'||PGU.rules)return __abCard();const B=pgBLayout(),t=PGU.T,pop=Math.min(1,(WILD.cardT||0)/.25);
 ctx.save();ctx.globalAlpha=pop;ctx.fillStyle='rgba(12,6,24,.4)';ctx.fillRect(0,B.ch,W,H-B.ch); // the board keeps moving behind
 uiRound(B.panel.x,B.panel.y,B.panel.w,B.panel.h,20,'rgba(29,15,51,.5)','rgba(255,214,120,.55)',1.5);uiRound(B.panel.x,B.panel.y,B.panel.w,172,20,'rgba(29,15,51,.95)'); // the goal reads clearly; the board shows below itctx.textAlign='center';ctx.textBaseline='middle';
 PGU.bL=pgCentre(B.panel.y+30,t);PGU.bL.play=pgPlayButton(B.play,t,B.playH);pgDrawSide(B.side,t);ctx.restore();};
const __abBoardPointer=pgBoardPointer;
pgBoardPointer=function(p){
 if(pgABOn()&&PG_AB==='B'&&!PGU.rules&&!PGU.win&&!PGU.pick&&!PGU.modes&&!PGU.door&&pgRestPhase()&&WILD.phase==='card'){
  if(p.y<=pgDock().bottom)return __abBoardPointer(p);const B=pgBLayout(),L=PGU.bL;
  if(pgSideTap(B.side,p))return true;
  if(L&&contains(L.play,p)){pgStartRound();return true;}
  if(L&&contains(L.help,p)){pgSfx('tap');PGU.rules=true;return true;}
  return true;}
 return __abBoardPointer(p);};
const __abCountdown=wildStartCountdown;wildStartCountdown=function(){PGU.rules=false;return __abCountdown();};

// ---- A: the main screen ----
const PGA={coins:[],seeded:0,pile:null,react:-9,hearts:[]};
function pgMainRects(){const top=pgDock().bottom,bot=H-Math.max(24,hudLayout().bottom+16),k=Math.max(.72,Math.min(1,(bot-top)/700)); // shorter phones: the cat and gaps shrink so nothing overlaps (rule 11)
 const name=top+268*k,play=Math.max(name+178,bot-165);return {top,bot,head:{x:200,y:top+118*k,w:240*k},name,play,side:pgSideRects(top+48,Math.min(100,(name+150-top-48)/2.4))};}
function pgMainPile(){if(PGA.pile)return PGA.pile;const a=[];let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let row=0;row<4;row++){const n=9-row*2;for(let i=0;i<n;i++)a.push({x:200+(i-(n-1)/2)*44+(r()-.5)*14,y:-row*20+(r()-.5)*6,r:22+r()*6,f:.55+r()*.45,ph:r()*6});}return PGA.pile=a;}
function pgDrawMain(dt){const R=pgMainRects(),t=PGU.T,cat=PGU.boardCat||'tuxedo';
 if(ART.background){const cover=Math.max(W/ART.background.width,H/ART.background.height),bw=ART.background.width*cover,bh=ART.background.height*cover;ctx.drawImage(ART.background,(W-bw)/2,(H-bh)/2,bw,bh);}else{ctx.fillStyle='#1d1030';ctx.fillRect(0,0,W,H);}
 let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(30,10,50,.5)');gr.addColorStop(1,'rgba(20,6,34,.88)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 ctx.save();ctx.translate(200,R.head.y);ctx.rotate(t*.2);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=i%2?'rgba(255,210,63,.1)':'rgba(255,122,213,.06)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-40,-H);ctx.lineTo(40,-H);ctx.fill();}ctx.restore();
 // the coin rain (the board's own coin, as on the title) and a pile of coins under PLAY
 if(!PGA.seeded){PGA.seeded=1;for(let i=0;i<6;i++)PGA.coins.push(pgTitleCoin(rand(0,H*.7)));}
 if(PGA.coins.length<12&&Math.random()<dt*2.2)PGA.coins.push(pgTitleCoin(-40));const csp=sprite('coin');
 for(let i=PGA.coins.length-1;i>=0;i--){const c=PGA.coins[i];c.y+=c.vy*dt*.8;c.vy=Math.min(c.vy+45*dt,170);c.x+=Math.sin(t*c.wf+c.s)*c.wa*dt;if(c.y>H+50){PGA.coins.splice(i,1);continue;}
  const fl=Math.cos(c.s+t*c.vs),hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,c.y);ctx.globalAlpha=.3;ctx.fillStyle='#ffd76a';ctx.beginPath();ctx.ellipse(0,0,c.r*1.2*Math.max(.3,Math.abs(fl)),c.r*1.2,0,0,7);ctx.fill();ctx.globalAlpha=1;ctx.scale(Math.max(.18,Math.abs(fl)),1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();}
 const py=R.play+150;for(const c of pgMainPile()){const hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,py+c.y);ctx.scale(1,c.f);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);if(((t*.7+c.ph)%5)<.12)uiCircle(-c.r*.3,-c.r*.3,c.r*.2,'#fffbe6');ctx.restore();}
 // the board's cat: floats, blinks, looks around; a tap gets the sweet face, hearts and a meow
 const el=t-PGA.react,live=el<1.4,by=Math.sin(t*1.6)*4-(live?Math.abs(Math.sin(el*9))*10*(1-el/1.4):0);
 pgHead(cat,R.head.x,R.head.y+by,R.head.w,live||(t%7)<1?'sweet':'calm',{look:Math.sin(t*.5)*.8,lookY:Math.sin(t*.37),blink:((t+.3)%4.7)<.13?1:0});
 for(let i=PGA.hearts.length-1;i>=0;i--){const h=PGA.hearts[i];h.t+=dt;if(h.t>1.3){PGA.hearts.splice(i,1);continue;}if(h.t<0)continue;ctx.save();ctx.globalAlpha=Math.max(0,1-h.t/1.3);pgHeart(h.x+Math.sin(h.t*5)*7,h.y-h.t*50,1,'#ff6ab8');ctx.restore();}
 ctx.textAlign='center';ctx.textBaseline='middle';PGA.L=pgCentre(R.name,t);PGA.L.play=pgPlayButton(R.play,t);pgDrawSide(R.side,t);
 pgDrawMainBar();
 if(PGU.pick)pgDrawBoardPick(dt);ctx.save();pgDrawModes();ctx.restore();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';}
// the slim top bar on the main screen (the board's own bar drawing, always fully shown)
function pgDrawMainBar(){const c=WILD.cardT,ph=WILD.phase;WILD.cardT=1;WILD.phase='card';try{pgDrawDock();}finally{WILD.cardT=c;WILD.phase=ph;}}
function pgMainTap(p){const R=pgMainRects(),L=PGA.L;
 if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return;}
 if(PGU.pick||PGU.modes){pgBoardPointer(p);return;}
 if(PGU.door)return;
 const D=pgDock();if(p.y<=D.bottom){if(contains(D.gear,p))openCredits();else if(contains(D.coll,p)){pgSfx('tap');openLoopScreen('water');}else if(contains(D.inv,p)){pgSfx('tap');openLoopScreen('inventory');}else if(D.modes&&contains(D.modes,p)){pgSfx('tap');PGU.modes=true;PGU.modesT=0;}return;}
 if(pgSideTap(R.side,p))return;
 if(L&&contains(L.play,p)){PGU.screen='board';PGU.fade=.25;pgStartRound();return;}
 if(L&&contains(L.help,p)){pgSfx('tap');PGU.rules=true;PGU.screen='board';PGU.fade=.2;return;}
 if(Math.hypot(p.x-R.head.x,(p.y-R.head.y)*1.2)<R.head.w*.45){PGA.react=PGU.T;pgSfx('meow');pgSfx('purr',.7);for(let i=0;i<5;i++)PGA.hearts.push({x:R.head.x+rand(-60,60),y:R.head.y-40,t:-i*.08});}}
const __abDown=pgPointerDown;pgPointerDown=function(e,p){if(PGU.screen==='main'){pgMainTap(p);return;}return __abDown(e,p);};
// A: between rounds (a goal card is up and no rules asked for), the main screen shows instead of the board; B: never.
const __abUpdate=update;
update=function(dt){__abUpdate(dt);if(!PG||!pgABOn())return;
 if(PG_AB==='A'&&PGU.screen==='board'&&WILD.on&&WILD.phase==='card'&&!PGU.rules&&!PGU.door&&!inventoryOpen){PGU.screen='main';PGU.fade=Math.max(PGU.fade,.2);}
 if(PGU.screen==='main'&&(PG_AB==='B'||!WILD.on||WILD.phase!=='card'))PGU.screen='board';}; // B, or a round started some other way (Developer)
// leaving a side screen between rounds comes back to the main screen in A
const __abGo=pgGo;pgGo=function(screen){__abGo(screen);if(screen==='board'&&pgABOn()&&PG_AB==='A'&&WILD.on&&WILD.phase==='card')PGU.screen='main';};

// ---- Developer: the layout switch and the difficulty tags ----
const __abDevHtml=pgDevHtml;
pgDevHtml=function(){const h=__abDevHtml(),b='min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;padding:0 10px';
 const rows='<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Home layout</span><button id="pg-ab" style="'+b+'">'+(PG_AB==='A'?'A main screen':'B board view')+'</button></div>'
  +PG_CATS.map(c=>'<div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Difficulty: '+PG_CAT[c].name+'</span><button data-pgdiff="'+c+'" style="'+b+'">'+pgDiff(c)+'</button></div>').join('');
 return h.replace('<h3 style="margin-top:10px"><span>MODES',rows+'<h3 style="margin-top:10px"><span>MODES');};
const __abDevBind=wildDevBind;
wildDevBind=function(panel){__abDevBind(panel);const box=panel.querySelector&&panel.querySelector('#pg-dev');if(!box)return;const re=()=>{const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 const ab=box.querySelector('#pg-ab');if(ab)ab.onclick=()=>{PG_AB=PG_AB==='A'?'B':'A';pgABSave();try{diagEvent('progress-tuning','layout='+PG_AB);}catch(e){}re();};
 for(const btn of box.querySelectorAll('[data-pgdiff]'))btn.onclick=()=>{const c=btn.dataset.pgdiff;PG_DIFF[c]=PG_DIFFS[(PG_DIFFS.indexOf(pgDiff(c))+1)%PG_DIFFS.length];pgABSave();try{diagEvent('progress-tuning','difficulty '+c+'='+PG_DIFF[c]);}catch(e){}re();};};
