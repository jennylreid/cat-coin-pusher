// ---------- CP-88 Bank side-game coins (Jenny, Nov 19: "While I ran Sonic Meow, the laser went over the edge and the laser game
// started on a board that had just been cleared by Sonic Meow... Doesn't it seem like you should be able to save that coin and
// spend it when you're ready?"; go: "laser, fish and mouse coins go to a tap-to-start slot instead of starting at once. Dance
// break unchanged.") ----------
// A laser, fish or mouse coin over the edge plays its pickup exactly as before (the frozen pickup is untouched: the coin's
// own handler still runs). Then, instead of starting its side game, it banks a charge in a slot beside the power buttons,
// drawn in the power button's style (a little smaller, below the Home button) with the coin's own icon and a count. Tapping the slot starts that side game, through
// the game's own start path, when nothing else is running: no power (title or action), no Dance break, no Yawn, no side game
// and no pause; otherwise the tap is refused with the same lock sound as the power button. Tapping is the only way to start
// them. Charges last for the round (a new round starts with none, as the side game's coin was always a this-round thing).
// While its side game runs the slot is hidden, so that game's own HUD (the laser's timer bar) shows as before.
const CP88={KINDS:['laser','fish','mousecoin'],bank:{laser:0,fish:0,mousecoin:0},pulse:-9,stats:{banked:0,started:0,refused:0},
 PEND:{laser:'chasePending',fish:'tossPending',mousecoin:'pouncePending'},GAME:{laser:'chase',fish:'toss',mousecoin:'pounce'},
 COL:{laser:'#ff6a6a',fish:'#7de8c8',mousecoin:'#ffb36a'}};
// the board's own side-game coin (each board drops only its cat's coin)
function cp88Kind(){if(!WILD.on)return null;if(WILD.laser)return 'laser';if(wildFeature('toss'))return 'fish';if(wildFeature('pounce'))return 'mousecoin';return null;}
// beside the Quake button, just below the round's Home button (which sits on the power buttons' row there): 34 units, the
// power button's rings at 0.82 scale, so it clears Home and stays inside the header
const CP88R=17;
function cp88Btn(){const b=powerButtons().quake,hud=hudLayout(),x0=W-Math.max(8,hud.right+10)-124,h=wildButton(),cx=Math.max(b.x+b.w+8,x0)+CP88R,
 cy=Math.max(b.y+b.h/2,h.y+h.h+2+CP88R);return {x:cx-CP88R,y:cy-CP88R,w:CP88R*2,h:CP88R*2};}
function cp88Shown(){const k=cp88Kind();return !!k&&!WILD[CP88.GAME[k]];}
function cp88Paused(){return inventoryOpen||panel.style.display==='block'||(typeof cp51Paused!=='undefined'&&cp51Paused);}
function cp88Ready(){const k=cp88Kind();return !!k&&CP88.bank[k]>0&&WILD.phase==='play'&&board.status==='playing'&&!PGPX&&!pgpSideGame()&&!WILD.dance&&!WILD.toss&&!WILD.chase&&!WILD.pounce&&!WILD.petGame
 &&!WILD.tossPending&&!WILD.chasePending&&!WILD.pouncePending&&!W2_YAWN&&sweepTime<=0&&catquakeTime<=0&&!(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)&&!cp88Paused();}
// banking: the coin's own handler runs (its pickup, its log); the start it queued becomes a charge
const __cp88Rain=wildRainCollected;
wildRainCollected=function(b,x){const k=b&&b.kind;if(!CP88.KINDS.includes(k))return __cp88Rain.apply(this,arguments);
 const p=CP88.PEND[k],before=WILD[p];const r=__cp88Rain.apply(this,arguments);if(WILD[p]!==before)WILD[p]=before;
 CP88.bank[k]++;CP88.stats.banked++;CP88.pulse=time;try{diagEvent('cp88','bank '+k+' n='+CP88.bank[k]);}catch(e){}return r;};
// the tap: start through the game's own path (its tick starts a pending side game when the board allows it)
function cp88Use(){const k=cp88Kind();CP88.bank[k]--;WILD[CP88.PEND[k]]={f:null,wait:9};CP88.stats.started++;try{diagEvent('cp88','start '+k+' left='+CP88.bank[k]);}catch(e){}}
const __cp88Tap=powerTap;
powerTap=function(p){if(cp88Shown()&&contains(cp88Btn(),p)){stopDrops();if(cp88Ready())cp88Use();else{CP88.stats.refused++;try{pgSfx('lock');}catch(e){}}return true;}return __cp88Tap.apply(this,arguments);};
function cp88Icon(k,x,y,s){const sp=sprite(k);if(sp&&sp.cv)ctx.drawImage(sp.cv,x-s/2,y-s/2,s,s);}
const __cp88DrawPB=drawPowerButtons;
drawPowerButtons=function(){__cp88DrawPB.apply(this,arguments);if(!cp88Shown())return;const k=cp88Kind(),b=cp88Btn(),x=b.x+b.w/2,y=b.y+b.h/2,n=CP88.bank[k],on=cp88Ready(),c=CP88.COL[k];
 const pu=time-CP88.pulse,s=pu<2.5?1+.12*Math.abs(Math.sin(pu*7)):1;
 ctx.save();ctx.translate(x,y);ctx.scale(s*CP88R/21,s*CP88R/21);ctx.globalAlpha=on||n>0?1:.65;uiCircle(0,0,21,'#3a1d50',c,1.6);uiCircle(0,0,17,'#5a2d74');cp88Icon(k,0,0,27);
 if(pu<2.5){ctx.globalAlpha=Math.max(0,1-pu/2.5);ctx.strokeStyle=c;ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,21+pu*10,0,7);ctx.stroke();}
 ctx.restore();ctx.save();uiCircle(b.x+b.w+1,b.y+7,8,'#f6df9b','#835f2e',1);ctx.fillStyle='#243e43';ctx.font='bold 11px system-ui';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n,b.x+b.w+1,b.y+7);ctx.restore();};
// charges last for the round
const __cp88Reset=wildReset;wildReset=function(){CP88.bank={laser:0,fish:0,mousecoin:0};return __cp88Reset.apply(this,arguments);};
const __cp88Exit=wildExit;wildExit=function(){CP88.bank={laser:0,fish:0,mousecoin:0};return __cp88Exit.apply(this,arguments);};
// ---------- end CP-88 ----------
