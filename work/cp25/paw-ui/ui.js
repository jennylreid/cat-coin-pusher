// Local layout draft: approved paw direction, separate Collections/Inventory,
// power controls above the cat. No layout/physics/artwork changes to the board.
function uiCircle(x,y,r,fill,stroke,lw=1){ctx.beginPath();ctx.arc(x,y,r,0,7);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
function uiRound(x,y,w,h,r,fill,stroke,lw=1){ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw;ctx.stroke();}}
function uiPaw(x,y,k,fill){ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(-15,10);ctx.bezierCurveTo(-20,1,-8,-9,0,-9);ctx.bezierCurveTo(8,-9,20,1,15,10);ctx.bezierCurveTo(12,17,5,11,0,12);ctx.bezierCurveTo(-5,11,-12,17,-15,10);ctx.fill();for(const [px,py,r] of [[-16,-12,-.5],[-6,-21,-.15],[7,-21,.15],[17,-11,.5]]){ctx.save();ctx.translate(px,py);ctx.rotate(r);ctx.beginPath();ctx.ellipse(0,0,5.5,8,0,0,7);ctx.fill();ctx.restore();}ctx.restore();}
function drawPawMedallion(x,y,k,content){
 ctx.save();ctx.translate(x,y);ctx.scale(k,k);ctx.shadowColor='rgba(0,0,0,.4)';ctx.shadowBlur=18*k;ctx.shadowOffsetY=7*k;
 for(const [tx,ty,w,h,r] of [[-110,-100,30,42,-.42],[-40,-145,33,44,-.16],[41,-145,33,44,.16],[110,-100,30,42,.42]]){ctx.save();ctx.translate(tx,ty);ctx.rotate(r);ctx.beginPath();ctx.ellipse(0,0,w,h,0,0,7);ctx.fillStyle='#174c55';ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle='#e0bc70';ctx.lineWidth=3;ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,w-8,h-9,0,0,7);ctx.fillStyle='#4f8b8e';ctx.fill();ctx.restore();}
 ctx.beginPath();ctx.moveTo(-135,44);ctx.bezierCurveTo(-148,-14,-68,-91,0,-91);ctx.bezierCurveTo(68,-91,148,-14,135,44);ctx.bezierCurveTo(119,129,54,99,0,111);ctx.bezierCurveTo(-54,99,-119,129,-135,44);ctx.closePath();const teal=ctx.createLinearGradient(0,-90,0,115);teal.addColorStop(0,'#357f83');teal.addColorStop(1,'#113d49');ctx.fillStyle=teal;ctx.fill();ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.lineWidth=4;ctx.strokeStyle='#e4c77e';ctx.stroke();
 uiCircle(0,4,94,'#fcf1d1','#eccb7c',2);uiCircle(0,4,87,null,'#e1c58d',1);content();
 for(const tx of [-109,109]){uiCircle(tx,47,3,'#dabc77');uiCircle(tx*.9,67,2,'#dabc77');}ctx.restore();
}
function drawCollectionsSymbol(){
 for(const [x,y,r] of [[-22,-8,-.18],[20,-8,.18],[0,8,0]]){ctx.save();ctx.translate(x,y);ctx.rotate(r);uiRound(-42,-50,84,100,8,'#fff8e3','#a47c37',3);if(!r){ctx.fillStyle='#2a6b72';ctx.beginPath();ctx.moveTo(-24,-32);ctx.lineTo(-24,17);ctx.lineTo(0,4);ctx.lineTo(24,17);ctx.lineTo(24,-32);ctx.closePath();ctx.fill();}ctx.restore();}
}
function inventoryButton(){const h=hudLayout();return {x:W/2-22,y:h.bottomY-4,w:44,h:44};}
function powerButtons(){const h=hudLayout(),y=h.headerBottom-23;return {sweep:{x:W/2-52,y:y-21,w:42,h:42},quake:{x:W/2+10,y:y-21,w:42,h:42}};}
function powerCount(id){if(!S.dev&&BOARD.id==='tuna-terraces')return id==='quake'?board.earnedQuakes:0;return id==='quake'?board.quakes:board.sweeps;}
function powerEnabled(id){return powerCount(id)>0&&!['won','lost'].includes(board.status)&&sweepTime<=0&&catquakeTime<=0;}
function powerTap(p){
 const entry=Object.entries(powerButtons()).find(([,b])=>contains(b,p));if(!entry)return false;const id=entry[0];stopDrops();stopPawDance();if(!powerEnabled(id))return true;
 if(id==='quake'){if(!S.dev&&BOARD.id==='tuna-terraces')useEarnedQuake();else useCatquake();}
 else {if(board.status==='ready')board.status='playing';usePawSweep();}save();return true;
}
function drawPowerButtons(){
 for(const [id,b] of Object.entries(powerButtons())){ctx.save();const x=b.x+b.w/2,y=b.y+b.h/2,enabled=powerEnabled(id);ctx.globalAlpha=enabled?1:.65;uiCircle(x,y,21,'#174c55','#d7bd7a',1.4);uiCircle(x,y,17,'#2f7279');
  if(id==='quake'){uiCircle(x,y,14,'#133e56','#f3cd69',1);ctx.fillStyle='#f7d16e';ctx.beginPath();ctx.moveTo(x+3,y-12);ctx.lineTo(x-9,y+2);ctx.lineTo(x-1,y+2);ctx.lineTo(x-4,y+12);ctx.lineTo(x+10,y-3);ctx.lineTo(x+2,y-3);ctx.closePath();ctx.fill();}
  else uiPaw(x,y+3,.53,'#f8e7bd');ctx.globalAlpha=1;uiCircle(b.x+b.w-2,b.y+9,8.5,'#f6df9b','#835f2e',1);ctx.fillStyle='#243e43';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(powerCount(id),b.x+b.w-2,b.y+9);ctx.restore();
 }
}
function drawCollectionsTile(){const b=collectionsTile();drawPawMedallion(b.x+b.w/2,b.y+b.h*.63,b.h/310,drawCollectionsSymbol);}
function drawInventoryButton(){const b=inventoryButton();ctx.drawImage(ART.collectionsTile,b.x,b.y,b.w,b.h);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='12px system-ui';ctx.fillStyle='#fff0cc';ctx.fillText('Inventory',b.x+b.w/2,b.y+b.h+10);}
function drawTreatAward(){
 const a=treatAwards[0];if(!a)return;const fade=Math.max(0,Math.min(1,a.t/.1,(1.2-a.t)/.2)),k=.96+.04*Math.min(1,a.t/.16);
 ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);ctx.globalAlpha=fade;ctx.fillStyle='rgba(9,23,29,.67)';ctx.fillRect(0,0,W,H);drawPawMedallion(W/2,H/2,k,()=>drawPrize('item',a.id,0,29,1.95));ctx.restore();
}
function drawBoardHUD(){
 const hud=hudLayout();ctx.textBaseline='middle';ctx.textAlign='left';ctx.fillStyle='rgba(18,11,28,.9)';ctx.fillRect(0,0,W,hud.headerBottom);
 ctx.fillStyle='#ffd76a';ctx.font='bold 19px system-ui';ctx.fillText(board.remaining+' coins',hud.left+12,hud.mainY);
 ctx.textAlign='right';ctx.font='22px system-ui';ctx.fillText(S.muted?'🔇':'🔊',W-hud.right-12,hud.mainY);if(S.dev&&window.Android){ctx.font='20px system-ui';ctx.fillText('↻',W-hud.right-66,hud.mainY);}
 ctx.textAlign='left';ctx.font='bold 12px system-ui';ctx.fillStyle='#fff';ctx.fillText(S.coins<REGEN_CAP?'+1 '+purseCountdown():'Purse full',hud.left+12,hud.bannerY);
 if(sweepTime>0||catquakeTime>0||isRestPose())drawPaws();drawPawTouchGuides();drawTickleWords();drawPowerButtons();
 const bottom=hud.bottomY;ctx.textAlign='left';ctx.font='12px system-ui';for(let i=0;i<BOARD.targets.length;i++){const item=BOARD.targets[i],got=board.collected.includes(item.id);ctx.fillStyle=got?'#7dff6a':'#fff0d0';ctx.fillText((got?'✓ ':'')+ITEMS[item.id].name,hud.left+20,bottom+7+i*17);}
 ctx.textAlign='center';ctx.font='bold 12px system-ui';ctx.fillStyle='#fff0cc';ctx.fillText('BOARD '+(boardIndex+1)+' / '+BOARDS.length,W-hud.right-77,bottom+8);ctx.font='12px system-ui';const message=saveError?'Save unavailable':S.coins===0?'More coins in '+purseCountdown():board.status==='won'?'Next board soon…':board.status==='ready'?'Tap or hold':'Slide to aim';ctx.fillText(message,W-hud.right-77,bottom+28,130);
 drawInventoryButton();ctx.fillStyle='rgba(18,11,28,.96)';ctx.fillRect(hud.left+2,hud.settingsY-10,242,22);ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.textAlign='left';ctx.fillText(BUILD,hud.left+8,hud.settingsY);if(S.dev){ctx.font='10px system-ui';ctx.fillText(Math.round(perf.fps)+' fps',hud.left+185,hud.settingsY);}
 ctx.textAlign='right';ctx.font='12px system-ui';ctx.fillText('Settings',hud.settingsX,hud.settingsY);drawSafeAreaGuides();if(inventoryOpen)drawInventory();
}
function drawInventoryOnly(){
 const s=screenLayout(),width=s.right-s.left;ctx.fillStyle='#172e38';ctx.fillRect(0,0,W,H);ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='bold 25px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Inventory',s.left+8,s.top+6);ctx.textAlign='right';ctx.font='15px system-ui';ctx.fillText('Close',s.right-7,s.top+6);
 uiRound(s.left,s.top+42,width,42,10,'#367a7e','#dbbf79');ctx.textAlign='center';ctx.font='bold 16px system-ui';ctx.fillStyle='#fff0d0';ctx.fillText('Collections',W/2,s.top+63);
 ['cheese','shrimp','tuna'].forEach((id,i)=>{const y=s.top+116+i*145;uiRound(s.left,y,width,124,16,'#f7e9c7','#d0b777');drawPrize('item',id,s.left+69,y+78,.9);ctx.textAlign='left';ctx.font='bold 18px system-ui';ctx.fillStyle='#244e56';ctx.fillText(PRIZE_NAMES[id],s.left+143,y+44);ctx.font='16px system-ui';ctx.fillText('× '+(S.got[id]||0),s.left+143,y+77);});
 ctx.textAlign='center';ctx.fillStyle='#e8d9b3';ctx.font='13px system-ui';ctx.fillText('Won treats · place them in Collections',W/2,s.bottom-25,width);
}
