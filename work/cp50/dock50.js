// --- the coin board is home (Jenny, Nov 14). Between rounds (goal card, end card) a bar sits across the top of the
// board, where the round's HUD is, so it never covers the cat's face or the table: level and XP, coins, Catnip,
// Settings, and buttons for Kitchen, Porch, Album, Shop and Boards (a pink paw when something waits). During a round the
// normal HUD is back.
const PG_DOCK_IDS=['kitchen','porch','album','shop','board'],PG_DOCK_LEVEL={kitchen:2,porch:2,album:0,shop:2,board:0};
const PG_DOCK_COL={board:['#ffb23f','#a8400f'],kitchen:['#ff8a5a','#7a2a1a'],porch:['#7ad65a','#1f5a1a'],album:['#d06aff','#4a1a6a'],shop:['#4fd0ff','#0a4a6a']};
function pgDockName(id){return {kitchen:'Kitchen',porch:'Porch',album:'Album',shop:'Shop',board:'Boards'}[id];}
function pgRestPhase(){return !!(PG&&!PG_HOME_OFF&&WILD.on&&!inventoryOpen&&PGU.screen==='board'&&(WILD.phase==='card'||(WILD.phase==='end'&&WILD.endT>=.9)));}
function pgDock(){const h=hudLayout(),top=h.top,bot=Math.max(top+78,h.headerBottom+2),y1=top+15,ty=top+31,th=bot-ty-5,gap=5,tw=(W-12-gap*4)/5;
 return {top,bottom:bot,y1,gear:{x:W-46,y:top,w:46,h:30},tiles:PG_DOCK_IDS.map((id,i)=>({id,x:6+i*(tw+gap),y:ty,w:tw,h:th,level:PG_DOCK_LEVEL[id]}))};}
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
 const y=D.y1,need=pgXPNeed(PG.level),u=Math.min(1,PG.xp/need),bx=40,bw=128;
 uiCircle(21,y,14,'#ffd23f','#fff6d0',2);ctx.fillStyle='#3a1a00';ctx.textAlign='center';ctx.font='900 16px Impact, system-ui';ctx.fillText(PG.level,21,y+1);
 uiRound(bx,y-8,bw,16,8,'rgba(255,255,255,.12)','#ffe08a',1);if(u>0)uiRound(bx+1,y-7,Math.max(14,(bw-2)*u),14,7,'#7dff6a');
 ctx.fillStyle='#fff';ctx.font='bold 10px system-ui';ctx.fillText('LEVEL '+PG.level+' · '+PG.xp+' / '+need+' XP',bx+bw/2,y+1,bw-8);
 // coins (the jar) and Catnip
 uiCircle(186,y,8,'#f5c632','#a8740c',1.5);pgPaw(186,y+1,.16,'#a8740c');ctx.textAlign='left';ctx.font='bold 15px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText(PG.coins,198,y+1);
 const cx=198+ctx.measureText(String(PG.coins)).width+18;pgCatnipLeaf(cx,y+7,.72);ctx.fillStyle='#8dff9a';ctx.fillText(PG.catnip,cx+12,y+1);
 // Settings
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
