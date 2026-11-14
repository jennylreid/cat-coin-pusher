// --- the coin board is home (Jenny, Nov 14). Between rounds (goal card, end card) a bar sits across the top of the
// board, where the round's HUD is, so it never covers the cat's face or the table: level and XP, coins, Catnip,
// Settings, and buttons for Kitchen, Porch, Album, Shop and Boards (a pink paw when something waits). During a round the
// normal HUD is back.
const PG_DOCK_IDS=['kitchen','porch','album','shop','board'],PG_DOCK_LEVEL={kitchen:2,porch:2,album:0,shop:2,board:0};
const PG_DOCK_COL={board:['#ffb23f','#a8400f'],kitchen:['#ff8a5a','#7a2a1a'],porch:['#7ad65a','#1f5a1a'],album:['#d06aff','#4a1a6a'],shop:['#4fd0ff','#0a4a6a']};
function pgDockName(id){return {kitchen:'Kitchen',porch:'Porch',album:'Album',shop:'Shop',board:'Boards'}[id];}
function pgRestPhase(){return !!(PG&&!PG_HOME_OFF&&WILD.on&&!inventoryOpen&&PGU.screen==='board'&&(WILD.phase==='card'||(WILD.phase==='end'&&WILD.endT>=.9)));}
function pgDock(){const h=hudLayout(),top=h.top,bot=Math.max(top+78,h.headerBottom+2),y1=top+15,ty=top+31,th=bot-ty-5,gap=5,tw=(W-12-gap*4)/5;
 return {top,bottom:bot,y1,gear:{x:W-40,y:top,w:40,h:30},coll:{x:248,y:top+1,w:30,h:28},inv:{x:280,y:top+1,w:30,h:28},modes:S.dev?{x:314,y:top+4,w:44,h:22}:null,tiles:PG_DOCK_IDS.map((id,i)=>({id,x:6+i*(tw+gap),y:ty,w:tw,h:th,level:PG_DOCK_LEVEL[id]}))};}
function pgWaiting(id){
 if(id==='kitchen')return PG_RECIPES.some(r=>pgCanCook(r))||PG_RECIPES.some(r=>PG.recipes[r.id]&&PG.seen['r:'+r.id]===0);
 if(id==='porch')return PG.porch.some(s=>s&&(s.state==='visit'||s.state==='missed'))||(PG.level>=2&&PG.porch.some(s=>!s)&&Object.values(PG.dishes).some(n=>n>0));
 if(id==='album')return !!PG.newPhoto;
 if(id==='board')return !!PG.newBoard;
 if(id==='shop'){const m=pgMissing(pgCurrentRecipe());return Object.keys(m).some(i=>!pgWinnable(i)&&PG.coins>=pgBuy(i));}
 return false;}
function pgDrawDock(){
 const D=pgDock(),t=PGU.T,a=WILD.phase==='card'?Math.min(1,(WILD.cardT||0)/.2):Math.min(1,((WILD.endT||0)-.9)/.2);if(!(a>0))return;
 ctx.save();ctx.globalAlpha=a;ctx.textBaseline='middle';
 let gr=ctx.createLinearGradient(0,0,0,D.bottom);gr.addColorStop(0,'#160a24');gr.addColorStop(1,'#2c1544');ctx.fillStyle=gr;ctx.fillRect(0,0,W,D.bottom);
 ctx.fillStyle='rgba(0,0,0,.35)';ctx.fillRect(0,D.bottom,W,4);ctx.fillStyle='#ffe08a';ctx.fillRect(0,D.bottom-2,W,2);
 // level badge and XP bar
 const y=D.y1,need=pgXPNeed(PG.level),u=Math.min(1,PG.xp/need),bx=40,bw=100;
 uiCircle(21,y,14,'#ffd23f','#fff6d0',2);ctx.fillStyle='#3a1a00';ctx.textAlign='center';ctx.font='900 16px Impact, system-ui';ctx.fillText(PG.level,21,y+1);
 uiRound(bx,y-8,bw,16,8,'rgba(255,255,255,.12)','#ffe08a',1);if(u>0)uiRound(bx+1,y-7,Math.max(14,(bw-2)*u),14,7,'#7dff6a');
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui';ctx.fillText(PG.xp+' / '+need+' XP',bx+bw/2,y+1,bw-8);
 // coins (the jar) and Catnip
 uiCircle(152,y,8,'#f5c632','#a8740c',1.5);pgPaw(152,y+1,.16,'#a8740c');ctx.textAlign='left';ctx.font='bold 15px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,163,y+1,48);
 const cx=163+Math.min(48,ctx.measureText(String(PG.coins)).width)+15;pgCatnipLeaf(cx,y+7,.72);ctx.fillStyle='#8dff9a';ctx.fillText(PG.catnip,cx+12,y+1);
 // Collections and Inventory (moved up from the bottom strip), MODES (Developer only), Settings
 pgCollIcon(D.coll.x+D.coll.w/2,y);pgInvIcon(D.inv.x+D.inv.w/2,y);
 if(D.modes){const m=D.modes;uiRound(m.x,m.y,m.w,m.h,10,'rgba(20,60,60,.92)','#5ef0c0',1.5);ctx.fillStyle='#d8fff2';ctx.textAlign='center';ctx.font='900 11px Impact, system-ui';ctx.fillText('MODES',m.x+m.w/2,m.y+m.h/2+1);}
 pgGearIcon(D.gear.x+D.gear.w/2,y,9);
 // the buttons
 for(const r of D.tiles){const id=r.id,col=PG_DOCK_COL[id],locked=r.level&&PG.level<r.level,cxr=r.x+r.w/2,cyr=r.y+r.h/2;
  const pr=PGU.door&&PGU.door.id===id?Math.min(1,PGU.door.t/.24):0,press=1-.1*Math.sin(pr*Math.PI);
  ctx.save();ctx.translate(cxr,cyr);ctx.scale(press,press);ctx.translate(-cxr,-cyr);
  uiRound(r.x,r.y+3,r.w,r.h,12,'rgba(0,0,0,.4)');const g2=ctx.createLinearGradient(0,r.y,0,r.y+r.h);g2.addColorStop(0,col[0]);g2.addColorStop(1,col[1]);uiRound(r.x,r.y,r.w,r.h,12,g2,'#fff6d0',1.5);
  const k=Math.max(.3,Math.min(.5,(r.h-18)/62));ctx.save();ctx.beginPath();ctx.rect(r.x+2,r.y+2,r.w-4,r.h-16);ctx.clip();ctx.translate(cxr,r.y+(r.h-14)/2+3);ctx.scale(k,k);pgDoorIcon(id,0,0,t);ctx.restore();
  ctx.textAlign='center';wildText(locked?'LEVEL '+r.level:pgDockName(id).toUpperCase(),cxr,r.y+r.h-9,11,locked?'#ffe08a':'#fff',col[1],3);
  if(locked){uiRound(r.x,r.y,r.w,r.h,12,'rgba(10,6,20,.55)');pgLock(r.x+r.w-13,r.y+14,.62);wildText('LEVEL '+r.level,cxr,r.y+r.h-9,11,'#ffe08a','#2a1838',3);}
  else if(pgWaiting(id)){const px=r.x+r.w-10,py=r.y+10,kk=1+.12*Math.sin(t*6);uiCircle(px,py,10*kk,'#fff','#ff6ab8',2);pgPaw(px,py+1,.24*kk,'#ff3a8a');}
  ctx.restore();}
 ctx.restore();}

// Small code-drawn icons for the bar: Collections (a fan of cards) and Inventory (a satchel).
function pgCollIcon(x,y){ctx.save();ctx.translate(x,y);for(const [dx,r,c] of [[-5,-.25,'#abd1c8'],[5,.25,'#e4f0df'],[0,0,'#2f7279']]){ctx.save();ctx.translate(dx,1);ctx.rotate(r);uiRound(-6,-9,12,17,2,c,'#f6dfa4',1.2);ctx.restore();}ctx.fillStyle='#f5d58c';ctx.beginPath();ctx.moveTo(-3,-5);ctx.lineTo(3,-5);ctx.lineTo(3,3);ctx.lineTo(0,1);ctx.lineTo(-3,3);ctx.closePath();ctx.fill();ctx.restore();}
function pgInvIcon(x,y){ctx.save();ctx.translate(x,y);ctx.strokeStyle='#f6dfa4';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,-5,5,Math.PI,0);ctx.stroke();uiRound(-10,-5,20,15,4,'#b0602a','#f6dfa4',1.2);uiRound(-10,-5,20,7,3,'#8a4418');uiCircle(0,1,2.2,'#ffd23f');ctx.restore();}
// ---- UAT 51: on the cat boards nothing takes taps in the bottom strip (Jenny, Nov 14: "a lot of tapping takes place at
// the bottom of the screen"). Collections and Inventory move to the top bar between rounds; Settings is a small gear in
// the top HUD during a round (between EXIT and the sound button). Info-only readouts stay low.
function pgOwnHud(){return !!(PG&&!PG_HOME_OFF&&WILD.on&&PGU.screen==='board');}
const PG_OFF={x:-999,y:-999,w:0,h:0};
const __pgInvBtn=inventoryButton;inventoryButton=function(){return pgOwnHud()?PG_OFF:__pgInvBtn();};
const __pgCollTile=collectionsTile;collectionsTile=function(){return pgOwnHud()?{...PG_OFF,placement:'off'}:__pgCollTile();};
function pgPlayGear(){const h=hudLayout();return {x:W-h.right-80,y:h.mainY-17,w:36,h:34};}
function pgDrawPlayGear(){const g=pgPlayGear();uiCircle(g.x+g.w/2,g.y+g.h/2,15,'rgba(255,255,255,.1)','rgba(232,220,255,.5)',1);pgGearIcon(g.x+g.w/2,g.y+g.h/2,8);}
// MODES (Developer only): the game's own modes picker, shown over the board.
function pgDrawModes(){if(!PGU.modes)return;PGU.modesT+=pgDrawDtM();const on=WILD.on,o=MODES_UI.open,t=MODES_UI.t;WILD.on=false;MODES_UI.open=true;MODES_UI.t=PGU.modesT;try{drawModesPicker();}catch(e){}finally{WILD.on=on;MODES_UI.open=o;MODES_UI.t=t;}}
function pgDrawDtM(){return 1/60;}
function pgModesTap(p){const R=modesPickerRects();for(const r of R.rows)if(contains(r,p)){PGU.modes=false;sfx.wild('beep',1);PGU.oldBoards=false;wildModeEnter(r.id);PGU.fade=.3;return;}PGU.modes=false;pgSfx('back');}
