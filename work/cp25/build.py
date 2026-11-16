from pathlib import Path
import re
p=Path(__file__).parent
h=(p.parent/'cp22/release.html').read_text(encoding='utf-8')
def replace(a,b):
 global h
 assert a in h,a[:100]
 h=h.replace(a,b)
replace('START_COINS = 100, REGEN_SEC = 20, REGEN_CAP = 100','START_COINS = 220, REGEN_SEC = 20, REGEN_CAP = 300')
replace("function boardTick(dt) {", "function legacyBoardTick(dt) {")
pos=h.index('function selectBoard(index)')
h=h[:pos]+'''// CP-25: a purse replaces board allowances and board time limits.
let inventoryOpen=false, clearWait=0, saveError=false;
function boardTick(dt){
 board.remaining=S.coins;
 if(board.status==='won'){
  if(!itemToasts.length&&!callouts.length&&sweepTime===0&&catquakeTime===0&&!inventoryOpen){clearWait+=dt;if(clearWait>=2)nextBoard();}
 }else clearWait=0;
}
'''+h[pos:]
replace("if(board.status!=='won'||boardIndex>=BOARDS.length-1)return false;return selectBoard(boardIndex+1);", "if(board.status!=='won')return false;clearWait=0;const ok=selectBoard((boardIndex+1)%BOARDS.length);save();return ok;")
replace('S.coins=BOARD.coins;S.shakes=0;', 'board.remaining=S.coins;S.shakes=0;')
replace('function load() { resetBoard(); }', '''const LOOP_KEY='catpusher.uat.loop.v1';
function load(){
 let data;try{data=JSON.parse(localStorage.getItem(LOOP_KEY)||'null');}catch(e){}
 if(data&&data.schema===1){
  S.coins=Number.isSafeInteger(data.coins)&&data.coins>=0?data.coins:START_COINS;
  S.lastRegen=Number.isFinite(data.lastRegen)?data.lastRegen:Date.now();
  S.got={};for(const id of ['cheese','shrimp','tuna'])S.got[id]=Number.isSafeInteger(data.got?.[id])&&data.got[id]>=0?data.got[id]:0;
  S.dev=!!data.dev;
  boardIndex=Number.isInteger(data.boardIndex)&&BOARDS[data.boardIndex]?data.boardIndex:0;BOARD=BOARDS[boardIndex];
 }
 resetBoard();
 if(data?.schema===1&&Array.isArray(data.bodies)&&data.bodies.length<2000&&data.board){
  for(const b of bodies.slice())removeCoin(b);
  for(const row of data.bodies){
   const b=addCoin(row.kind,row.id,row.p.x/M,row.p.y/M,row.p.z/M,row.q,row.v,row.a);
   Object.assign(b,row.flags);b.rb.setGravityScale(row.gravity??1,true);b.rb.enableCcd(true);
  }
  board={...board,...data.board,remaining:S.coins};
  time=data.time||0;lastDrop=data.lastDrop??-99;pushPhase=data.pushPhase||0;
  pusherY=data.pusherY||PUSH_MIN;tongueDrawY=pusherY;
  tongue.setTranslation({x:2,y:TONGUE_H/2*M,z:(pusherY-TONGUE_LEN/2)*M},true);
  if(board.status==='won')callout('BOARD CLEAR!',{voice:'quest',color:'#7dff6a',afterCollections:true});
 }
 regen();
}
''')
replace('function save() { /* This review prototype never writes the production save. */ }','''function save(){
 try{
  const rows=bodies.filter(b=>!b.dead).map(b=>({kind:b.kind,id:b.id,p:b.rb.translation(),q:b.rb.rotation(),v:b.rb.linvel(),a:b.rb.angvel(),gravity:b.rb.gravityScale(),flags:Object.fromEntries(Object.entries(b).filter(([k])=>!['rb','uid','sortK'].includes(k)))}));
  localStorage.setItem(LOOP_KEY,JSON.stringify({schema:1,coins:S.coins,lastRegen:S.lastRegen,got:S.got,dev:S.dev,boardIndex,board,bodies:rows,time,lastDrop,pushPhase,pusherY}));saveError=false;
 }catch(e){saveError=true;}
}''')
replace('function regen() {}','''function regen(){
 const now=Date.now();
 if(now<S.lastRegen)S.lastRegen=now;
 if(S.coins>=REGEN_CAP)S.lastRegen=now;
 else {const n=Math.floor((now-S.lastRegen)/(REGEN_SEC*1000));if(n>0){S.coins=Math.min(REGEN_CAP,S.coins+n);S.lastRegen+=n*REGEN_SEC*1000;if(S.coins===REGEN_CAP)S.lastRegen=now;}}
 board.remaining=S.coins;
}
function purseCountdown(){return clock(Math.max(0,REGEN_SEC*1000-(Date.now()-S.lastRegen)));}
''')
replace('function tryDrop(at=aim) {','function tryDrop(at=aim) {\n regen();if(inventoryOpen)return false;')
replace('board.remaining--;board.used++;board.released++;S.coins=board.remaining;', 'S.coins--;board.remaining=S.coins;board.used++;board.released++;')
replace('b.mouthExit=exit.id;sfx.drop();return true;', 'b.mouthExit=exit.id;sfx.drop();save();return true;')
replace('function fallOff(b, x) {','function fallOff(b, x) {\n if(b.dead)return;')
replace('fallOff=function(b,x){const t=', 'fallOff=function(b,x){if(b.dead)return;const t=')
replace("if(b.kind==='quake'){board.earnedQuakes++;", "if(['coin','silver'].includes(b.kind)){regen();S.coins++;board.remaining=S.coins;}\n if(b.kind==='item'&&['cheese','shrimp','tuna'].includes(b.id))S.got[b.id]=(S.got[b.id]||0)+1;\n if(b.kind==='quake'){board.earnedQuakes++;")
replace("if(board.collected.length===BOARD.targets.length)finishBoard('won');", "if(board.collected.length===BOARD.targets.length)finishBoard('won');\n save();")
replace('function step() {','function step() {\n if(inventoryOpen)return;')
replace('function update(dt) {','function update(dt) {\n if(inventoryOpen){regen();return;}')
replace("ctx.fillText(clock((BOARD.seconds-board.elapsed)*1000),hud.left+12,hud.bannerY);", "ctx.fillText(S.coins<REGEN_CAP?'+1 '+purseCountdown():'Purse full',hud.left+12,hud.bannerY);")
replace("ctx.fillText(board.status==='won'?(boardIndex<BOARDS.length-1?'NEXT BOARD':'ALL BOARDS CLEAR'):'TRY AGAIN',200,bottom+18);", "ctx.fillText(board.status==='won'?'NEXT BOARD SOON…':'TRY AGAIN',200,bottom+18);")
start=h.index(" ctx.fillStyle='#fff';ctx.font='12px system-ui';ctx.fillText(board.status==='lost'?")
end=h.index('\n if(board.quakeStats)',start)
h=h[:start]+''' ctx.fillStyle='#fff';ctx.font='12px system-ui';ctx.fillText(saveError?'Save unavailable · keep app open':S.coins===0?'More coins in '+purseCountdown():board.status==='won'?'Treats saved · Board '+((boardIndex+1)%3+1)+' next':board.status==='ready'?'Tap board to play':'Tap board · purse carries over',200,bottom+42);
'''+h[end:]
replace("ctx.textAlign='right';ctx.font='12px system-ui';ctx.fillText('Settings',hud.settingsX,hud.settingsY);drawSafeAreaGuides();", "ctx.textAlign='right';ctx.font='12px system-ui';ctx.fillText('Settings',hud.settingsX,hud.settingsY);ctx.fillText('Inventory',hud.settingsX,hud.settingsY-33);drawSafeAreaGuides();if(inventoryOpen)drawInventory();")
pos=h.index('function drawHUD()')
h=h[:pos]+'''function drawInventory(){
 const hud=hudLayout(),top=hud.top+28;
 ctx.fillStyle='#160f24';ctx.fillRect(0,0,W,H);
 ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 25px system-ui';ctx.fillText('Inventory',22,top+10);
 ctx.textAlign='right';ctx.font='bold 16px system-ui';ctx.fillText('Close',W-hud.right-20,top+10);
 ctx.textAlign='left';ctx.font='14px system-ui';ctx.fillStyle='#d0bedf';ctx.fillText('Treats won off the front are kept here.',22,top+51);
 ['cheese','shrimp','tuna'].forEach((id,i)=>{
  const y=top+90+i*132;ctx.fillStyle='#30213f';ctx.fillRect(20,y,W-40,116);
  drawPrize('item',id,80,y+80,.8);
  ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 19px system-ui';ctx.fillText(ITEMS[id].name,155,y+40);
  ctx.font='17px system-ui';ctx.fillStyle='#ffd76a';ctx.fillText('Owned: '+(S.got[id]||0),155,y+76);
 });
 ctx.font='14px system-ui';ctx.fillStyle='#d0bedf';ctx.fillText('Purse: '+S.coins+' coins',22,top+515);
 ctx.fillText('Collections come in Stage 2.',22,top+546);
}
'''+h[pos:]
replace("  const p = toGame(e);", "  const p = toGame(e);\n  if(inventoryOpen){const h=hudLayout();if(p.x>280&&p.y<h.top+68){inventoryOpen=false;save();}return;}\n  {const h=hudLayout();if(p.x>h.settingsX-80&&p.y>h.settingsY-50&&p.y<h.settingsY-16){inventoryOpen=true;holding=false;save();return;}}")
replace("if(p.y<hud.bottomY+32&&board.status==='won'){nextBoard();return;}","if(p.y<hud.bottomY+32&&board.status==='won')return;")
replace('    resetBoard();return;\n  }\n  // the top bar','    return;\n  }\n  // the top bar')
replace('  S, get bodies()', '  get inventoryOpen(){return inventoryOpen;}, openInventory(){inventoryOpen=true;}, closeInventory(){inventoryOpen=false;}, regen, load, fallOff, gutterOff,\n  S, get bodies()')
(p/'draft.html').write_text(h,encoding='utf-8')
print('Built CP-25 Stage 1')
