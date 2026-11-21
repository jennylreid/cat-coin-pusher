// ---- UAT 138: new prize fixes from Jenny's UAT 137 test (Pixel) ----
// 1. Sizes ("The flowers are far too small... you really need all these other prizes to be large, also larger than the coins"):
//    measured by painted area (the equivalent diameter of each prize's solid pixels against a coin's 52-unit diameter), the
//    existing prizes run 0.77-1.29 coins (shrimp 1.20, cheese 1.24, tuna 1.29). Each new prize under the shrimp's size is drawn
//    bigger to match it (at most 1.55x so the 128 px art stays clean): the flowers by 1.25-1.55x. Same physics; the Star keeps
//    its approved size; the bag and Shop icons are unchanged.
const CP138_SCALE={"accordion": 1.0, "balloon_animal": 1.18, "cornflower": 1.5, "crab": 1.01, "daisy": 1.32, "diamond": 1.0, "hot_dog": 1.0, "hot_water_bottle": 1.15, "hydrangea": 1.24, "owl": 1.13, "oyster": 1.0, "rainbow": 1.48, "rose": 1.32, "sapphire_ring": 1.06, "seahorse": 1.3, "sunflower": 1.32, "tulip": 1.55};
{const __d138=cp62DrawPrize;cp62DrawPrize=function(kind,id,x,y,s,owner){const k=kind==='item'&&CP138_SCALE[id];if(!k||k===1)return __d138.apply(this,arguments);
 return __d138.call(this,kind,id,x,y+radius('item')*s*2.8*(k-1)*.2,s*k,owner);};}
// Safety: a new prize whose art hasn't loaded (or failed to) is simply not drawn that frame, never an error (UAT 137 drew the
// image regardless; browsers draw nothing for an unloaded image, but a broken one throws).
{const __g138=drawPrize;drawPrize=function(kind,id,x,y,s){if(kind==='item'&&typeof CP137_IDS!=='undefined'&&CP137_IDS.includes(id)){const a=WILD_ART[id];if(a&&!a.getContext&&!(a.complete&&a.naturalWidth))return;}return __g138.apply(this,arguments);};}
// 2. No more spinning ("Some of them are spinning unnecessarily... the sapphire ring, and the balloon animal"): the six-view
//    prizes no longer swap views while they tumble. Each prize takes one view when it appears and keeps it, so it lands, settles
//    and stays still (different prizes still land different ways).
// 3. The diamond is always the side view ("so you see the point"), with its twinkle, no view changes.
const CP138_SIDE=CP137_VIEWS.indexOf('side');
cp137ViewOf=function(b){if(!b.rb)return {v:CP138_SIDE,t:0,ph:0};let s=b.cp137;if(!s)s=b.cp137={v:b.id==='diamond'?CP138_SIDE:Math.random()*6|0,t:time,ph:Math.random()*1.75};if(b.id==='diamond')s.v=CP138_SIDE;return s;};
// 4. On-board comparison pills (Jenny's rule from 138: "I need to be able to toggle between them on the screen... then we
//    remove the toggle"): UAT builds only, on every board, one small row at the bottom left (left of the cat's name).
//    Labels (Jenny): one word for what it's for, options as letters only.
//    - "Prize art: A | B" (A = the review-2 art, B = the first pass): all new prizes switch between the review-2 art (A) and Codex's first-pass art (B; the 11
//      prizes that were revised: balloon animal, cornflower, daisy, diamond, hydrangea, owl, oyster, rainbow, rose, sunflower,
//      tulip; the other six only ever had one version, and the Star has no first pass). Same new sizes. B shows one plain
//      view, no twinkle (as the first pass was).
//    - "Towers: A | B | C | D" (A = Today, B = A, C = C, D = A + C): CP-93's tower physics, moved out of Developer onto the board, live (the same switch).
//    Both choices are saved on the phone. Taps on the pills never drop a coin.
const CP138_FIRST=['balloon_animal','cornflower','daisy','diamond','hydrangea','owl','oyster','rainbow','rose','sunflower','tulip'],CP138_FIRSTART={};
for(const id of CP138_FIRST){const im=new Image();im.src='img/art/cp138/first/'+id+'.png';CP138_FIRSTART[id]=im;}
const CP138A={KEY:'catpusher.uat.cp138art.v1',mode:'real',rects:[]};try{if(localStorage.getItem(CP138A.KEY)==='first')CP138A.mode='first';}catch(e){}
function cp138Pills(){return /\bUAT\b/.test(BUILD)&&typeof PG!=='undefined'&&PG&&!PG_HOME_OFF&&WILD.on&&PGU.screen==='board'&&!inventoryOpen&&!(typeof cp51Paused!=='undefined'&&cp51Paused);}
{const __f138=cp62DrawPrize;cp62DrawPrize=function(kind,id,x,y,s,owner){if(kind!=='item'||CP138A.mode!=='first'||!CP138_FIRSTART[id])return __f138.apply(this,arguments);
 const im=CP138_FIRSTART[id];if(!(im.complete&&im.naturalWidth))return __f138.apply(this,arguments);const old=WILD_ART[id];WILD_ART[id]=im;try{return __f138.call(this,kind,id,x,y,s,null);}finally{WILD_ART[id]=old;}};}
function cp138PillRow(){const H0=H,front=skyScreen(200,T.FRONT,0).y;return Math.round(Math.min(H0-24,Math.max(front+4,H0-50)));}
function cp138DrawPills(){CP138A.rects=[];if(!cp138Pills())return;const y=cp138PillRow(),h=20;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.font='bold 11px system-ui';ctx.textBaseline='middle';
 const groups=[['Prize art',[['real','A'],['first','B']],CP138A.mode,k=>{CP138A.mode=k;try{localStorage.setItem(CP138A.KEY,k);}catch(e){}try{diagEvent('cp138','art '+k);}catch(e){}}],
  ['Towers',[['today','A'],['a','B'],['c','C'],['ac','D']],typeof CP93P==='object'?CP93P.get():'today',k=>{if(typeof CP93P==='object')CP93P.set(k);}]];
 let x=6;for(const [lab,opts,cur,set] of groups){const lw=ctx.measureText(lab).width+10,ws=opts.map(o=>ctx.measureText(o[1]).width+12),tot=lw+ws.reduce((a,b)=>a+b,0);
  uiRound(x,y,tot,h,h/2,'rgba(20,10,30,.78)','rgba(255,255,255,.35)',1);ctx.fillStyle='#d8c8ee';ctx.textAlign='left';ctx.fillText(lab,x+6,y+h/2+1);let sx=x+lw;
  opts.forEach((o,i)=>{const w=ws[i],on=o[0]===cur;if(on)uiRound(sx+1,y+2,w-2,h-4,(h-4)/2,'#ffd23f');ctx.fillStyle=on?'#2a1838':'#f4ecff';ctx.textAlign='center';ctx.fillText(o[1],sx+w/2,y+h/2+1);CP138A.rects.push({x:sx,y:y-4,w,h:h+8,k:o[0],set});sx+=w;});
  x+=tot+8;}
 ctx.restore();}
{const __dr138=draw;draw=function(){const r=__dr138.apply(this,arguments);try{cp138DrawPills();}catch(e){}return r;};}
{const __wp138=wildPointer;wildPointer=function(e,p){try{if(cp138Pills())for(const r of CP138A.rects)if(contains(r,p)){r.set(r.k);try{pgSfx('tap');}catch(_){}return true;}}catch(_){}return __wp138.apply(this,arguments);};}
// ---- end UAT 138 prize fixes and pills ----
