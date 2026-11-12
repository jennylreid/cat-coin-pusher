// ---------- CP-41 Game modes (UAT 45): a pattern for modes built on Wild 2 ----------
// A mode is a set of settings on top of Wild 2 (its goal card, timer, rain coins, bonus drops, towers, Turbo, music, win
// and lose cards and the visitor): a name and colours, its goal-card lines, and which side games it features. Side games
// are self-contained pieces that check wildFeature('<name>'). Wild 1 and Wild 2 have no mode and keep exactly what they
// had (the Dance break); a mode turns on only what it lists. Modes are started from the MODES picker in the header.
// To add a mode: registerWildMode({id, name, button, colors, features:{...}, cardLines:[[icon,line1,line2],...], icon(x,y)}).
const WILD_MODES={},WILD_MODE_ORDER=[];
function registerWildMode(m){if(!WILD_MODES[m.id])WILD_MODE_ORDER.push(m.id);WILD_MODES[m.id]=m;}
WILD.mode=null;
function wildMode(){return WILD.on&&WILD.mode?WILD_MODES[WILD.mode]||null:null;}
// No mode (Wild 1, Wild 2): the Dance break only. A mode: exactly the side games it lists.
function wildFeature(f){const m=wildMode();return m?!!(m.features&&m.features[f]):f==='dance';}
function wildModeName(){const m=wildMode();return m?m.name:'WILD 2';}
function wildModeColor(i){const m=wildMode();return m?m.colors[i]:['#a6ff6a','#10301a'][i];}
function wildModePanel(){const m=wildMode();return m&&m.panel?m.panel:['#4b1f6e','#1d0f33'];}
function wildCardLines(){const m=wildMode();return m?m.cardLines:W2_CARD_LINES;}
function wildModeEnter(id){
 if(!WILD_MODES[id])return false;MODES_UI.open=false;
 if(WILD.on)wildExit();
 if(!wild2Enter())return false;WILD.mode=id;
 try{diagEvent('mode','enter '+id);}catch(e){}return true;
}
const __modesExit=wildExit;
wildExit=function(){const r=__modesExit();WILD.mode=null;return r;};

// --- the MODES button (header, second row, right; normal board only) and the picker ---
const MODES_UI={open:false,t:0};
function modesButton(){const h=hudLayout();return {x:W-Math.max(8,h.right+10)-80,y:h.bannerY-12,w:80,h:24};}
function modesPickerRects(){const n=WILD_MODE_ORDER.length,top=Math.max(hudLayout().headerBottom+20,120),rows=WILD_MODE_ORDER.map((id,i)=>({id,x:34,y:top+64+i*84,w:332,h:72}));
 return {card:{x:20,y:top,w:360,h:96+n*84+44},rows,close:{x:140,y:top+64+n*84+8,w:120,h:30}};}
function drawModesButton(){
 if(inventoryOpen||WILD.on||!WILD_MODE_ORDER.length)return;const b=modesButton(),pulse=.5+.5*Math.sin(performance.now()/300+.8);
 ctx.save();uiRound(b.x,b.y,b.w,b.h,12,MODES_UI.open?'#5ef0c0':'rgba(20,60,60,.92)','rgba(94,240,192,'+(.55+.45*pulse)+')',2);
 ctx.fillStyle=MODES_UI.open?'#0b2a2a':'#d8fff2';ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='900 13px Impact, "Arial Black", system-ui';ctx.fillText('MODES',b.x+b.w/2-7,b.y+b.h/2+1);const tx=b.x+b.w-15,ty=b.y+b.h/2;ctx.beginPath();ctx.moveTo(tx-5,ty-2.5);ctx.lineTo(tx+5,ty-2.5);ctx.lineTo(tx,ty+3.5);ctx.closePath();ctx.fill();ctx.restore();
}
function drawModesPicker(){
 if(!MODES_UI.open||WILD.on||inventoryOpen)return;const R=modesPickerRects(),u=Math.min(1,MODES_UI.t/.2),k=.85+.15*(1-Math.pow(1-u,3));
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 ctx.globalAlpha=u;ctx.fillStyle='rgba(12,6,24,.6)';ctx.fillRect(0,0,W,H);
 const cy=R.card.y+R.card.h/2;ctx.translate(200,cy);ctx.scale(k,k);ctx.translate(-200,-cy);
 wildPanel(R.card,'#1f4a4e','#0d2224');wildText('GAME MODES',200,R.card.y+34,32,'#5ef0c0','#0b2a2a',6);
 for(const r of R.rows){const m=WILD_MODES[r.id];uiRound(r.x,r.y,r.w,r.h,16,m.colors[2]||'#2a5a5e',m.colors[0],2);
  if(m.icon)m.icon(r.x+38,r.y+r.h/2);ctx.textAlign='left';wildText(m.name,r.x+76,r.y+24,24,m.colors[0],m.colors[1],5);
  ctx.textAlign='left';ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';ctx.fillText(m.blurb,r.x+76,r.y+52,r.w-90);ctx.textAlign='center';}
 uiRound(R.close.x,R.close.y,R.close.w,R.close.h,15,'rgba(255,255,255,.12)','#d8c8ee',1);ctx.fillStyle='#f4ecff';ctx.font='bold 14px system-ui';ctx.fillText('Close',200,R.close.y+R.close.h/2+1);
 ctx.restore();
}
const __modesBtn=drawWildButton,__modesDraw=draw,__modesPointer=wildPointer,__modesUpdate=update,__modesIcon=w2CardIcon;
drawWildButton=function(){__modesBtn();drawModesButton();};
draw=function(){__modesDraw();try{drawModesPicker();}catch(e){}};
update=function(dt){__modesUpdate(dt);if(MODES_UI.open)MODES_UI.t+=dt;};
wildPointer=function(e,p){
 if(!WILD.on&&world&&!inventoryOpen){
  if(MODES_UI.open){const R=modesPickerRects();for(const r of R.rows)if(contains(r,p)){sfx.wild('beep',1);wildModeEnter(r.id);return true;}
   MODES_UI.open=false;return true;} // Close, or a tap anywhere else, closes it
  if(WILD_MODE_ORDER.length&&contains(modesButton(),p)){MODES_UI.open=true;MODES_UI.t=0;sfx.wild('beep',.6);return true;}
 }
 return __modesPointer(e,p);
};
// Goal-card icons a mode can use besides Wild 2's (the fish coin is drawn by its own module).
w2CardIcon=function(kind,x,y){
 const m=wildMode();if(m&&m.cardIcon&&m.cardIcon(kind,x,y))return;
 return __modesIcon(kind,x,y);
};
