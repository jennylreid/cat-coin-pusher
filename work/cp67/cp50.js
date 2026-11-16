// ===== CP-50 Simple first board (UAT 67; Jenny, Nov 16, via PM) =====
// Goal icons: the prize at full colour on a soft cream circle (like the Album and Kitchen cards); a collected prize gets a
// green rim and a check on the circle's rim, top right (the star prize's star sits top left). (x, y) is the centre, w the
// circle's diameter. Same icon art, only bigger.
function cp50Icon(id,x,y,w,got){const r=w/2;
 ctx.save();ctx.shadowColor='rgba(0,0,0,.38)';ctx.shadowBlur=Math.max(2,w*.12);ctx.shadowOffsetY=Math.max(1,w*.05);uiCircle(x,y,r,'#fff4dc');ctx.restore();
 uiCircle(x,y,r-.5,null,got?'#3fbf2e':'#dcb878',got?Math.max(1.8,w*.075):Math.max(1.1,w*.04));
 const pw=w*.92;ctx.save();ctx.beginPath();ctx.arc(x,y,r-1,0,7);ctx.clip();drawPrize('item',id,x,y+pw*.13,pw/(radius('item')*2.8));ctx.restore();
 if(got){const k=Math.max(5,w*.2),cx=x+r*.74,cy=y-r*.74;uiCircle(cx,cy,k,'#7dff6a','#1f6a18',Math.max(1,k*.2));
  ctx.save();ctx.strokeStyle='#0c3a12';ctx.lineWidth=Math.max(1.6,k*.32);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(cx-k*.5,cy);ctx.lineTo(cx-k*.12,cy+k*.4);ctx.lineTo(cx+k*.55,cy-k*.42);ctx.stroke();ctx.restore();}}
// A centred row of n icons: diameter up to maxD, gap between circles, never wider than maxW.
function cp50Fit(n,maxW,maxD,gap){const D=Math.max(14,Math.min(maxD,(maxW+gap)/Math.max(1,n)-gap));return {D,step:D+gap};}
function cp50Draw(cx,cy,f){const n=WILD_COLLECTION.length;WILD_COLLECTION.forEach((id,i)=>wildIcon(id,cx+(i-(n-1)/2)*f.step,cy,f.D,!!WILD.have[id]));}

// --- End card: title, then "n of N prizes", then the icon row, then the stars and coins line, each with clear space ---
const CP50_END={count:70,icons:105,maxD:44,maxW:316};
function cp50EndRow(R){const f=cp50Fit(WILD_GOAL,CP50_END.maxW,CP50_END.maxD,4);cp50Draw(200,R.card.y+CP50_END.icons,f);globalThis.CP50_ENDROW={...f,cy:R.card.y+CP50_END.icons};}

// --- Home goal line: bigger icons between the goal text and "? How to play" (moved 12 px down, still clear of PLAY);
//     narrower where a side button reaches the row. Layout B's panel keeps its old spacing, with the new icons.
const CP50_HOME={help:142,cy:110,maxD:52,maxW:340,narrow:250};
function cp50HomeRow(y){const n=WILD_COLLECTION.length;
 if(PGU.screen!=='main'){const f=cp50Fit(n,240,44,4);cp50Draw(200,y+105,f);return;}
 const top=y+CP50_HOME.cy-CP50_HOME.maxD/2-4,bot=y+CP50_HOME.cy+CP50_HOME.maxD/2+4;let side=false;
 try{for(const b of pgMainRects().side||[]){const h=b.hit;if(h&&h.y<bot&&h.y+h.h>top)side=true;}}catch(e){}
 const f=cp50Fit(n,side?CP50_HOME.narrow:CP50_HOME.maxW,CP50_HOME.maxD,6);cp50Draw(200,y+CP50_HOME.cy,f);globalThis.CP50_HOMEROW={...f,cy:y+CP50_HOME.cy,side};}

// --- In a round: the level name and the prizes to collect in the band above the cat's head ---
// Drawn after the machine and before the cat, so the cat always stays on top (it can never be covered, even when the head
// moves in a dance). Sized to sit between the top bar and the forehead, and between the ears: the cat's head top is at
// VIEW.y + 57 * VIEW.zy across x 103..297 (measured on all four phone sizes); the inner ear edges rise about 0.9 px per
// px outside that, so a row that is shorter may be a little wider. The row keeps 6 px above the forehead (its soft edge).
function cp50RowOn(){return !!(WILD.on&&!inventoryOpen&&pglOn()&&(WILD.phase==='play'||WILD.phase==='count'||WILD.phase==='end'));}
function cp50RowLayout(){const hud=hudLayout(),n=WILD_COLLECTION.length,F=VIEW.y+57*VIEW.zy,top=hud.headerBottom+2,ly=top+8,T=top+17,gap=5;
 let D=Math.min(40,F-6-T),half=97;
 for(;D>16;D-=.5){const B=T+D;half=B<=F-9?Math.min(140,100+(F-9-B)/.9):97;if(n*(D+gap)-gap<=2*half)break;}
 return {n,D,step:D+gap,cy:T+D/2,ly,top,bottom:T+D,F,half,left:200-((n-1)/2)*(D+gap)-D/2,right:200+((n-1)/2)*(D+gap)+D/2};}
function cp50DrawRow(){if(!cp50RowOn())return;const lvl=WILD.pglLevel||pglSel(),L=PGL_LEVELS[lvl-1]||pglOn(),R=cp50RowLayout();globalThis.CP50_ROW=R;if(R.D<14)return;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 wildText('Level '+lvl+' · '+L.name,200,R.ly,14,'#ffd23f','#2a0b3e',4);
 cp50Draw(200,R.cy,R);ctx.restore();}
const __cp50Machine=drawMachine;drawMachine=function(...a){const r=__cp50Machine.apply(this,a);try{cp50DrawRow();}catch(e){}return r;};

// --- Level 1: no bonus prizes. A bonus drop that would bring a prize brings a 5-coin rain instead, unless it is bringing
//     back a goal prize that fell off a side (otherwise the level could not be won); the cat's own sky-drop prizes are off.
function cp50Lv1(){return !!(pglOn()&&(WILD.pglLevel||pglSel())===1);}
const __cp50Bonus=wildScheduleBonus;
wildScheduleBonus=function(){const lv1=cp50Lv1(),n=WILD.incoming.length,miss=lv1?wildMissing():[];const r=__cp50Bonus();
 if(lv1){const o=WILD.incoming[n];if(o&&o.kind==='item'&&!miss.includes(o.id)){o.kind='rain5';o.id=null;}}return r;};
const __cp50Reset=wildReset;wildReset=function(){const r=__cp50Reset();if(cp50Lv1())WILD.pglSched=PGL_CAT_DROPS.length;return r;};
