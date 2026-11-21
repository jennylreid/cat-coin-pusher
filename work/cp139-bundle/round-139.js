// ---- UAT 139 (Jenny, Nov 21; tickets/NEXT-ROUND.md items 23 and 24) ----
// 23. Prize art B: "the original art from codex is way better than the art I refined so I'm selecting b." The new prizes use the
//     first-version art and land one way, with two exceptions (Jenny): the rainbow is the A version (her glowing pick), and the
//     diamond is the A version in a tilted view (left or right, picked when it appears and kept) with its twinkle, so its point
//     shows. The Prize art pill is gone, and so is the rest of the A art (not in the package). Sizes (painted size, the diameter
//     of a circle with the area of the prize's solid pixels): a new prize under the shrimp's 1.20 coins is drawn bigger to 1.20;
//     one already above keeps its size (Jenny: no shrinking). (Edits in build: the art, the views, the pill.)
CP138A.mode='real'; // a phone that had "B" picked on the old pill: the exceptions (A rainbow, A diamond) still show
const CP139_TILT=[CP137_VIEWS.indexOf('tilt-left'),CP137_VIEWS.indexOf('tilt-right')];
cp137ViewOf=function(b){if(!b.rb)return {v:CP139_TILT[0],t:0,ph:0};let s=b.cp137;if(!s)s=b.cp137={v:CP139_TILT[Math.random()<.5?0:1],t:time,ph:Math.random()*1.75};return s;};
Object.assign(CP138_SCALE,{"accordion": 1.0, "balloon_animal": 1.11, "cornflower": 1.01, "crab": 1.01, "daisy": 1.0, "diamond": 1.06, "hot_dog": 1.0, "hot_water_bottle": 1.15, "hydrangea": 1.0, "owl": 1.0, "oyster": 1.0, "rainbow": 1.48, "rose": 1.0, "sapphire_ring": 1.06, "seahorse": 1.3, "sunflower": 1.0, "tulip": 1.21});
// 24. The Star bigger ("it's quite small... such a faint glow"): drawn about 1.15 coins across (edit in build), with a brighter,
//     more visible core: its frame drawn a second time additively, and a soft white-blue glow at its centre that breathes with it.
{const __s139=cp62DrawPrize;cp62DrawPrize=function(kind,id,x,y,s,owner){const r=__s139.apply(this,arguments);if(kind!=='item'||id!=='cstar')return r;
 try{ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha*=.55;__s139.apply(this,arguments);ctx.restore();
  const base=radius('item')*s*2.8,cy=y-.2*base,R=base*.42,k=.82+.18*Math.sin(time*5.2),g=ctx.createRadialGradient(x,cy,0,x,cy,R);
  g.addColorStop(0,'rgba(255,255,255,'+(.95*k)+')');g.addColorStop(.18,'rgba(225,240,255,'+(.7*k)+')');g.addColorStop(.5,'rgba(150,200,255,'+(.22*k)+')');g.addColorStop(1,'rgba(120,170,255,0)');
  ctx.save();ctx.globalCompositeOperation='lighter';ctx.fillStyle=g;ctx.beginPath();ctx.arc(x,cy,R,0,Math.PI*2);ctx.fill();ctx.restore();}catch(e){}return r;};}
// 25. Paw save (Jenny: "acceptable to bat it into the center of the pile and truly save the thing"): when the mitt reaches the
//     prize, it is batted back over the edge, up, and carried toward the middle of the pile (x 200, its depth kept between
//     440 and 660) over about half a second, pushing coins aside, so it lands well inside and is truly saved. The tap timing,
//     the glow window, the reach and the saves per round are unchanged (as hard as today).
const CP139B={dur:.55,stats:{bats:0}};
{const __pt139=paw40Tick;paw40Tick=function(dt){const W=PAW40_STATE.swipe,was=W&&W.hit;const r=__pt139.apply(this,arguments);
 try{if(W&&W.hit&&!was&&W.b&&!W.b.dead){const b=W.b,p=b.rb.translation(),z=Math.max(440,Math.min(660,p.z/M));b.cp139Bat={t0:time,tx:200*M,tz:z*M};CP139B.stats.bats++;}
  for(const b of bodies){const B=b.cp139Bat;if(!B||b.dead)continue;const u=(time-B.t0)/CP139B.dur;if(u>=1){b.cp139Bat=null;continue;}
   const p=b.rb.translation(),left=Math.max(.06,CP139B.dur*(1-u)),v=b.rb.linvel();
   b.rb.setLinvel({x:(B.tx-p.x)/left,y:u<.45?Math.max(v.y,PAW40.lift*.9):v.y,z:(B.tz-p.z)/left},true);}}catch(e){}return r;};}
// 26. Body pill "Body: A | B" (Jenny, Nov 21: "arms folded under the crouching cat with the mitts still up near the face"; her
//     reference: Screenshots/body-b-reference-uat138-2026-11-21.png). A = today. B = the crouching-cat body kept all the time:
//     the Ragdoll Dance break's body (CP-101: the Hug's approved shoulder painting drawn twice under the head, its soft lower
//     edge fading down beside the top of the board), outside the board's rim, under the head and mitts, never over the board,
//     coins or prizes; nothing in the bottom corners. Recoloured per cat from a copy (the approved art untouched): Tuxedo black,
//     Orange ginger, Ragdoll as is, Siamese cream, Tortie dark brown. Not drawn during the Hug (it has its own arms) or the
//     Ragdoll's Dance break (which draws this body already). UAT only, saved on the phone.
const CP139BODY={KEY:'catpusher.uat.cp139body.v1',mode:'a',cache:{},frames:0,
 FILTER:{tuxedo:'grayscale(1) brightness(.32) contrast(1.1)',orange:'sepia(1) saturate(3.2) hue-rotate(-12deg) brightness(1.05)',ragdoll:'none',siamese:'sepia(.55) saturate(.9) brightness(1.5)',tortie:'sepia(.9) saturate(1.6) hue-rotate(-8deg) brightness(.55)'}};
try{if(localStorage.getItem(CP139BODY.KEY)==='b')CP139BODY.mode='b';}catch(e){}
function cp139BodyParts(cat){const parts=z74ShoulderParts();if(!parts)return null;const f=CP139BODY.FILTER[cat]||'none';if(f==='none')return parts;
 const c=CP139BODY.cache[cat];if(c&&c.src===parts)return c;const mk=im=>{const cv=document.createElement('canvas');cv.width=im.width;cv.height=im.height;const g=cv.getContext('2d');g.filter=f;g.drawImage(im,0,0);return cv;};
 return CP139BODY.cache[cat]={src:parts,solid:mk(parts.solid),soft:mk(parts.soft)};}
function cp139BodyOn(){return !!(CP139BODY.mode==='b'&&typeof cp138Pills==='function'&&/\bUAT\b/.test(BUILD)&&WILD.on&&PGU.screen==='board'&&!inventoryOpen&&!(typeof PGPX!=='undefined'&&PGPX)&&!(typeof cp101BodyOn==='function'&&cp101BodyOn()));}
function cp139Body(){const r=z74RimPts(),parts=cp139BodyParts(PGU.boardCat||'tuxedo');if(!r||!parts)return;const L=z74Layout(),R=Z74.REF,w=R.shW*CP101B.k,h=R.shH*CP101B.k,cy=L.chin+CP101B.dy;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);z74ClipOutside(r);
 for(const sd of [-1,1]){ctx.save();ctx.translate(200+sd*CP101B.dx,cy);if(sd>0)ctx.scale(-1,1);ctx.drawImage(parts.soft,-w/2,-h/2,w,h);ctx.drawImage(parts.solid,-w/2,-h/2,w,h);ctx.restore();}
 ctx.restore();ctx.save();ctx.setTransform(...Z74.rimM);__z74Rim();ctx.restore();CP139BODY.frames++;}
{const __m139=drawMachine;drawMachine=function(){const r=__m139.apply(this,arguments);if(cp139BodyOn()&&CP139BODY.f!==Z74.f){CP139BODY.f=Z74.f;try{cp139Body();}catch(e){CP139BODY.err=String(e);}}return r;};}
// The pill row sits clear of the build label (Jenny's still showed it on top of the label): it ends above the label's box.
cp138PillRow=function(){const hud=hudLayout(),front=skyScreen(200,T.FRONT,0).y;return Math.round(Math.min(hud.settingsY-34,Math.max(front+4,H-50)));};
// 27. DANCE AGAIN at most once in a row (Jenny, Nov 21: perfect Tuxedo dances landed on DANCE AGAIN "4 or 5 times in a row...
//     the only way to end it is to fail"). Cause: the wheel draws DANCE AGAIN fresh every spin at 0.17 of the odds (about 1 in
//     6), so long runs only take luck (4 in a row is about 1 in 1,200 runs); nothing else forced it. Now the wheel at the end of the
//     dance that DANCE AGAIN started can't land on DANCE AGAIN: it draws from the other slices at their usual odds, so a perfect
//     streak always ends with a real reward. All other odds unchanged.
const CP139A={stats:{excluded:0}};
{const __ap139=w2ApplySlice;w2ApplySlice=function(s,D){if(s&&s.kind==='again')WILD.cp139Again=(WILD.dances|0);return __ap139.apply(this,arguments);};}
{const __pk139=w2PickSlice;w2PickSlice=function(){const i=__pk139.apply(this,arguments);try{
  if(WILD.cp139Again!=null&&(WILD.dances|0)===WILD.cp139Again+1&&W2_WHEEL[i]&&W2_WHEEL[i].kind==='again'){
   const ok=W2_WHEEL.map((x,k)=>k).filter(k=>W2_WHEEL[k].kind!=='again'),tot=ok.reduce((a,k)=>a+W2_WHEEL[k].w,0);let r=Math.random()*tot;CP139A.stats.excluded++;
   for(const k of ok){r-=W2_WHEEL[k].w;if(r<0)return k;}return ok[0];}}catch(e){}return i;};}
// ---- end UAT 139 ----
