// ---- UAT 141: the Collections test's tap-to-place in three beats (Jenny, Nov 21: the teleport felt "deeply unsatisfying";
// "a single tap is enough because there's only one action here"). A single tap on a satchel item places it (edit in build: a tap
// is finger down and up within 0.6 s moving under 12 px; a sideways swipe is a scroll the browser cancels, so it never counts as a
// tap; a second tap while it flies does nothing).
// 1. Lift: on the tap the prize pops up under the finger (a quick grow with a bounce, 0.22 s) with a soft pick-up sound.
// 2. Flight: it flies to its spot on an arc (up and over, easing in, 0.55 s) with a sparkle trail.
// 3. Landing: a small squash on arrival, a ring of light rippling out, a chime and a short vibration (navigator.vibrate, skipped
//    quietly if the phone doesn't allow it), then the existing blend-in glow and glints as it's placed.
// Drag-and-drop gets the same landing. Drawn on a full-screen layer over the Collections screen that takes no touches.
const CP141={fx:[],cv:null,raf:0,stats:{flies:0,landings:0,vib:0}};
function cp141Layer(){const el=CP138.el;if(!el)return null;if(CP141.cv&&CP141.cv.parentNode===el)return CP141.cv;const c=document.createElement('canvas');
 c.style.cssText='position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:5';el.appendChild(c);CP141.cv=c;return c;}
function cp141Screen(page,name){const [sx,sy]=cp138Center(page,name),r=CP138.cv.getBoundingClientRect();return {x:r.left+sx/368*r.width,y:r.top+sy/492*r.height,k:r.width/368};}
function cp141Loop(){const c=cp141Layer();if(!c){CP141.raf=0;return;}const dpr=window.devicePixelRatio||1,W0=innerWidth,H0=innerHeight;if(c.width!==Math.round(W0*dpr)||c.height!==Math.round(H0*dpr)){c.width=Math.round(W0*dpr);c.height=Math.round(H0*dpr);}
 const g=c.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,W0,H0);const now=performance.now()/1000;
 for(let i=CP141.fx.length-1;i>=0;i--){const f=CP141.fx[i],u=now-f.t;if(u>f.len){CP141.fx.splice(i,1);if(f.done)try{f.done();}catch(e){}continue;}cp141DrawFx(g,f,u,now);}
 CP141.raf=CP141.fx.length?requestAnimationFrame(cp141Loop):0;if(!CP141.raf)g.clearRect(0,0,W0,H0);}
function cp141Kick(){if(!CP141.raf)CP141.raf=requestAnimationFrame(cp141Loop);}
function cp141Sprite(g,id,x,y,size,sx=1,sy=1,a=1){const sp=cp138Sprite(id),[bx,by,bw,bh]=sp.bb,s=size/Math.max(bw,bh);g.save();g.globalAlpha=a;g.translate(x,y);g.scale(sx,sy);g.drawImage(sp.cv,bx,by,bw,bh,-bw*s/2,-bh*s/2,bw*s,bh*s);g.restore();}
function cp141Spark(g,x,y,r,a){g.save();g.globalAlpha=a;g.translate(x,y);g.fillStyle='#fff6d0';g.beginPath();for(let i=0;i<8;i++){const an=i*Math.PI/4,rr=i%2?r*.3:r;g.lineTo(Math.cos(an)*rr,Math.sin(an)*rr);}g.closePath();g.fill();g.restore();}
function cp141DrawFx(g,f,u){const E=x=>x*x*(3-2*x);
 if(f.kind==='lift'){const v=Math.min(1,u/f.len),b=1+.35*Math.sin(Math.PI*v)*(1-v*.4);cp141Sprite(g,f.id,f.x,f.y-14*E(v),f.size*b);}
 if(f.kind==='flight'){const v=Math.min(1,u/f.len),e=1-Math.pow(1-v,2.2);const x=f.x0+(f.x1-f.x0)*e,y=f.y0+(f.y1-f.y0)*e-Math.sin(Math.PI*e)*f.arc;
  f.trail.push({x,y,t:u});while(f.trail.length&&u-f.trail[0].t>.35)f.trail.shift();for(const p of f.trail){const a=1-(u-p.t)/.35;cp141Spark(g,p.x+(Math.sin(p.t*40)*6),p.y+(Math.cos(p.t*33)*6),5*a+1,a*.85);}
  cp141Sprite(g,f.id,x,y,f.size*(1.15-.35*e));}
 if(f.kind==='land'){const v=Math.min(1,u/f.len),sq=v<.35?1-.18*Math.sin(Math.PI*v/.35):1+.08*Math.sin(Math.PI*(v-.35)/.65)*(1-v),a=v<.7?1:1-(v-.7)/.3;
  cp141Sprite(g,f.id,f.x,f.y,f.size,1+(1-sq)*.9,sq,a);const R=f.size*(.45+1.2*E(v));g.save();g.globalAlpha=(1-v)*.9;g.strokeStyle='#ffe9b0';g.lineWidth=4*(1-v)+1;g.shadowColor='#ffd27a';g.shadowBlur=14;g.beginPath();g.arc(f.x,f.y,R,0,Math.PI*2);g.stroke();g.restore();}}
// the landing (both paths): squash, ring, chime, a short buzz
function cp141Land(page,name,then){const id=CP138_IDS[name],p=cp141Screen(page,name),now=performance.now()/1000;cp141Layer();
 CP141.fx.push({kind:'land',id,x:p.x,y:p.y,size:62*p.k,t:now,len:.42,done:then});CP141.stats.landings++;try{pgSfx('ding',.9);}catch(e){}
 try{if(navigator.vibrate&&navigator.vibrate(22))CP141.stats.vib++;}catch(e){}cp141Kick();}
// the tap: lift under the finger, arc flight with sparkles, then the landing and the placement
cp140Fly=function(name){const page=CP138.page,id=CP138_IDS[name];if(!id||pgHave(id)<1||cp138Placed(page).has(name)||!CP138.cv||CP141.busy)return;CP141.busy=true;
 const chip=CP138.el.querySelector('#cp138sat [data-n="'+name.replace(/"/g,'')+'"]'),r=chip?chip.getBoundingClientRect():{left:innerWidth/2-30,top:innerHeight-80,width:60,height:60};
 const x0=r.left+r.width/2,y0=r.top+r.height/2,t=cp141Screen(page,name),now=performance.now()/1000,size=62*t.k;cp141Layer();
 if(chip)chip.style.visibility='hidden';try{pgSfx('bubble',.8);}catch(e){}CP140.stats.flies++;CP141.stats.flies++;
 CP141.fx.push({kind:'lift',id,x:x0,y:y0,size:Math.max(48,size),t:now,len:.22,done:()=>{
  CP141.fx.push({kind:'flight',id,x0,y0:y0-14,x1:t.x,y1:t.y,arc:Math.max(60,Math.abs(y0-t.y)*.35),size:Math.max(48,size),trail:[],t:performance.now()/1000,len:.55,done:()=>{
   cp141Land(page,name,null);try{cp138Place(page,name);}catch(e){}CP141.busy=false;}});cp141Kick();}});cp141Kick();};
// drag-and-drop: the same landing on a successful drop
{const __pl141=cp138Place;cp138Place=function(page,name){const fromDrag=!!CP141.dropping;const r=__pl141.apply(this,arguments);try{if(fromDrag&&cp138Placed(page).has(name))cp141Land(page,name,null);}catch(e){}return r;};}
// the screen's own pointerup listener was added when it was built: mark the drop with one listener before it and one after
{const __op141=cp138Open;cp138Open=function(){const r=__op141.apply(this,arguments);try{const el=CP138.el;if(el&&!el.cp141){el.cp141=1;el.addEventListener('pointerup',()=>{CP141.dropping=true;},true);el.addEventListener('pointerup',()=>{CP141.dropping=false;});}}catch(e){}return r;};}
// Reset for retesting (Jenny: "When you promote UAT 141, I'd like you to reset the collections so I can retest"): once, on the first
// launch of this build (UAT only), the Collections test pages are emptied (as "Reset the test pages") and every prize that was
// placed on them goes back to the bag (up to the pantry cap) so it can be placed again. The old Water and Kitchen pages keep their
// own save and are not touched.
const CP141R={KEY:'catpusher.uat.cp141reset.v1',done:false,back:0};
function cp141Reset(){if(CP141R.done)return;try{if(!/\bUAT\b/.test(BUILD)||localStorage.getItem(CP141R.KEY)){CP141R.done=true;return;}if(typeof PG==='undefined'||!PG||!PG.items)return;
 const st=cp138Load();for(const page in (st.placed||{}))for(const name of st.placed[page]){const id=CP138_IDS[name];if(!id)continue;PG.items[id]=Math.min(pgCap(),pgHave(id)+1);CP141R.back++;}
 cp138Save({placed:{}});try{pgSave();}catch(e){}localStorage.setItem(CP141R.KEY,'1');CP141R.done=true;try{diagEvent('cp141','collections test reset, '+CP141R.back+' prizes back to the bag');}catch(e){}}catch(e){}}
{const __u141=update;update=function(dt){const r=__u141(dt);if(!CP141R.done)cp141Reset();return r;};}
// ---- end UAT 141 Collections tap ----
