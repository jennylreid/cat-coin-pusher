// ---- UAT 140: Collections test works by touch (Jenny, Nov 21, UAT 138 on her Pixel: "I can't drag and drop or tap to place an
// item... I can't place an item whatsoever"; she likes the look and the scrolling satchel) ----
// 1. Cause: the satchel scrolls sideways, so on a phone the browser took any finger movement on a satchel item as a scroll and
//    cancelled the drag (desktop mouse drags worked, which is why the earlier checks passed). Now an item in the satchel lets the
//    browser scroll only sideways: a drag that heads up toward the painting stays a drag and drops on its outline as before; a
//    sideways swipe still scrolls the satchel, and its cancelled drag is dropped quietly (no "back" sound, nothing placed).
// 2. Double-tap an item in the satchel (Jenny's request): it flies up to its spot in the painting (~0.45 s), fills it and plays the
//    placement payoff (and the completion payoff when it's the last one). Drag still works too.
// The old Water and Kitchen pages already worked by touch (their satchel is drawn in the game itself); unchanged.
const CP140={tap:null,start:null,stats:{flies:0,cancels:0}};
{const __ui140=cp138Ui;cp138Ui=function(){const r=__ui140.apply(this,arguments);try{for(const d of CP138.el.querySelectorAll('#cp138sat [data-n]'))d.style.touchAction='pan-x';}catch(e){}return r;};}
function cp140Fly(name){const page=CP138.page,id=CP138_IDS[name];if(!id||pgHave(id)<1||cp138Placed(page).has(name)||!CP138.cv)return;
 const chip=CP138.el.querySelector('#cp138sat [data-n="'+name.replace(/"/g,'')+'"]'),cr=CP138.cv.getBoundingClientRect();let from=[184,560];
 if(chip){const r=chip.getBoundingClientRect();from=[(r.left+r.width/2-cr.left)/cr.width*368,(r.top+r.height/2-cr.top)/cr.height*492];}
 const to=cp138Center(page,name),now=performance.now()/1000;CP138.fx.push({kind:'fly',page,name,t:now,len:.45,from,to});CP140.stats.flies++;
 try{pgSfx('tap');}catch(e){}setTimeout(()=>{try{cp138Place(page,name);}catch(e){}},450);}
{const __fx140=cp138DrawFx;cp138DrawFx=function(g,K,now){__fx140.apply(this,arguments);try{for(const f of CP138.fx){if(f.kind!=='fly'||f.page!==CP138.page)continue;const u=Math.min(1,(now-f.t)/f.len),e=u*u*(3-2*u);
  const x=f.from[0]+(f.to[0]-f.from[0])*e,y=f.from[1]+(f.to[1]-f.from[1])*e-Math.sin(Math.PI*e)*40,sp=cp138Sprite(CP138_IDS[f.name]),[bx,by,bw,bh]=sp.bb,s=Math.min(70/bw,70/bh)*(1-.25*e);
  g.save();g.globalAlpha=.95;g.drawImage(sp.cv,bx,by,bw,bh,x*K-bw*s*K/2,y*K-bh*s*K/2,bw*s*K,bh*s*K);g.restore();}}catch(e){}};}
// the screen's own listeners run after these (capture phase): a cancelled drag is dropped quietly; a tap (no movement) is not a
// drop, and two taps on the same item within 0.35 s make it fly
function cp140Hook(){const el=CP138.el;if(!el||el.cp140)return;el.cp140=1;
 el.addEventListener('pointerdown',e=>{CP140.start={x:e.clientX,y:e.clientY,t:performance.now()};},true);
 el.addEventListener('pointercancel',()=>{if(CP138.drag){CP138.drag=null;CP140.stats.cancels++;}},true);
 el.addEventListener('pointerup',e=>{const d=CP138.drag,s=CP140.start;if(!d||!s)return;if(Math.hypot(e.clientX-s.x,e.clientY-s.y)>12)return;
  CP138.drag=null;const now=performance.now(),T=CP140.tap;if(T&&T.n===d.n&&now-T.t<350){CP140.tap=null;cp140Fly(d.n);}else CP140.tap={n:d.n,t:now};},true);}
{const __op140=cp138Open;cp138Open=function(){const r=__op140.apply(this,arguments);cp140Hook();return r;};}
// ---- end UAT 140 ----
