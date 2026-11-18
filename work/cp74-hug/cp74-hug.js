// ---------- CP-74 prototype: the Ragdoll's Hug, step 1 layout (stand-ins drawn in code; not release code) ----------
// During the Hug the Ragdoll's shoulders come forward at the top, thick furry arms run down both sides of the board and
// the approved big mitts (same image, same 182 size, only moved and turned) meet below the board. The arms are the gutter
// walls: the two colliders are today's (same size and place) and exist only while the arms are fully in, for 6 s.
// Hearts all over; the Pet the cat purr (sfx.purr) runs while it lasts. Nothing is drawn over the table surface except
// hearts and words: shoulders and arms are clipped to outside the table outline; the mitts sit below the front lip.
const Z74={
 IN:.6,      // arms in: shoulders 0-0.35 s, arms down the sides 0.12-0.45 s, forearms + mitts in under the lip 0.35-0.6 s
 ON:.45,     // the gutter walls go up when the side arms are complete...
 HOLD:6,     // ...and stay 6 s (as today)
 OUT:.6,     // let go: mitts out 0-0.25, forearms/arms back up 0.15-0.45, shoulders back 0.35-0.6, idle mitts return
 ARM_R:27,   // arm radius in game units at perspective scale 1 (about 50-60 units thick on screen)
 SH_R:80,    // shoulder radius
 SH_DX:150,  // shoulder centre from the middle
 MITT_W:182, // the approved idle-mitt size (MITT_W), unchanged
 MITT_DX:80, // each mitt's centre from the middle
 MITT_DY:62, // mitt centre below the front lip (screens with room)
 MITT_TURN:.3, // claws turned in toward each other (radians)
 FUR:'#8f7d6e',LIGHT:'#fbf6ee',LINE:'#5b4c40',
 f:0,drawnF:-1,stats:{uses:0,on:[],off:[],layout:{}}};
const z74Clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),z74Ease=u=>1-Math.pow(1-z74Clamp(u,0,1),3),z74Seg=(t,a,b)=>z74Clamp((t-a)/(b-a),0,1);
// frame counter (the drawing hooks below run once per frame)
const __z74Draw=draw;draw=function(){Z74.f++;return __z74Draw.apply(this,arguments);};
function z74On(){const X=PGPX;return !!(X&&X.z74&&WILD.on&&!inventoryOpen);}
// --- the envelope: how far in each piece is at time t ---
function z74Env(t){const o=t-(Z74.ON+Z74.HOLD);
 if(o<0)return {sh:z74Ease(z74Seg(t,0,.35)),arm:z74Ease(z74Seg(t,.12,.45)),fore:z74Ease(z74Seg(t,.35,.6)),idle:1-z74Seg(t,0,.22),hold:t>=Z74.IN};
 return {sh:1-z74Ease(z74Seg(o,.35,.6)),arm:1-z74Ease(z74Seg(o,.15,.45)),fore:1-z74Ease(z74Seg(o,0,.25)),idle:z74Seg(o,.4,.6),hold:false};}
// --- layout (screen units, 400 wide), recomputed from the game's own projection every frame ---
function z74Layout(){const hw=(T.R-T.L)/2,F=skyScreen(200-hw,T.FRONT,0),lip=F.y,chin=w43ChinY();
 const mittY=Math.min(lip+Z74.MITT_DY,H+15),shY=chin+30;
 const L={lip,chin,shY,mittY,H,sides:{}};
 for(const s of [-1,1]){const pts=[];const S={x:200+s*(Z74.SH_DX+18),y:shY+18};pts.push({x:S.x,y:S.y,r:Z74.ARM_R*.9});
  const z0=GUARD_END-20;const p0=skyScreen(200+s*hw,z0,0);
  // shoulder -> top of the side run
  for(let i=1;i<=6;i++){const u=i/6,r=Z74.ARM_R*p0.s;pts.push({x:S.x+(p0.x+s*(r+1)-S.x)*u,y:S.y+(p0.y-S.y)*u,r:Z74.ARM_R*(.9+(p0.s-.9)*u)});}
  // down the side, inner edge on the table edge
  for(let z=z0+15;z<=T.FRONT;z+=15){const p=skyScreen(200+s*hw,z,0),r=Z74.ARM_R*p.s;pts.push({x:p.x+s*(r+1),y:p.y,r,side:1});}
  const nSide=pts.length;
  // forearm: from the front corner, in under the lip, to the mitt's cuff
  const rF=Z74.ARM_R*F.s,c0={x:(200+s*(hw))*0+(s<0?F.x:400-F.x)+s*(rF+1),y:lip},M={x:200+s*Z74.MITT_DX,y:mittY},cuff={x:M.x+s*16,y:M.y-48},ctl={x:c0.x-s*rF*.2,y:lip+52};
  for(let i=1;i<=10;i++){const u=i/10,a=(1-u)*(1-u),b=2*u*(1-u),c=u*u;pts.push({x:a*c0.x+b*ctl.x+c*cuff.x,y:a*c0.y+b*ctl.y+c*cuff.y,r:rF*(1-.12*u),fore:1});}
  let len=0;pts[0].d=0;for(let i=1;i<pts.length;i++){len+=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y);pts[i].d=len;}
  L.sides[s]={pts,nSide,sideLen:pts[nSide-1].d,len,M,S};}
 return L;}
// the table outline on screen (back to front), for the "outside the table" clip
function z74TablePath(){ctx.beginPath();const pts=[];for(let z=T.BACK;z<=T.FRONT;z+=10)pts.push(skyScreen(200-tableHalfAt(z),z,0));
 for(let z=T.FRONT;z>=T.BACK;z-=10)pts.push(skyScreen(200+tableHalfAt(z),z,0));pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();}
function z74ClipOutside(){ctx.beginPath();ctx.rect(-200,-200,W+400,H+400);const pts=[];for(let z=T.BACK;z<=T.FRONT;z+=10)pts.push(skyScreen(200-tableHalfAt(z),z,0));
 for(let z=T.FRONT;z>=T.BACK;z-=10)pts.push(skyScreen(200+tableHalfAt(z),z,0));pts.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.clip('evenodd');}
// --- drawing the stand-ins ---
function z74Shoulders(L,k){if(k<=0)return;for(const s of [-1,1]){const S=L.sides[s].S,r=Z74.SH_R*(.65+.35*k),x=S.x+s*(1-k)*40,y=S.y-12+(1-k)*-50;
  ctx.save();ctx.globalAlpha=Math.min(1,k*1.6);ctx.fillStyle=Z74.LINE;ctx.beginPath();ctx.ellipse(x,y,r+3,r*.8+3,s*.25,0,7);ctx.fill();
  const g=ctx.createRadialGradient(x-s*r*.3,y-r*.3,r*.1,x,y,r);g.addColorStop(0,'#a8988a');g.addColorStop(1,Z74.FUR);ctx.fillStyle=g;ctx.beginPath();ctx.ellipse(x,y,r,r*.8,s*.25,0,7);ctx.fill();
  ctx.fillStyle=Z74.LINE;for(let i=0;i<9;i++){const a=-Math.PI*.95+i*.24,px=x+Math.cos(a)*r*s,py=y+Math.sin(a)*r*.8;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(a)*9*s,py+Math.sin(a)*9);ctx.lineTo(px+Math.cos(a+.18)*2*s,py+Math.sin(a+.18)*2);ctx.fill();}
  ctx.restore();}}
// an arm: a round-capped tube along the path up to length `upto` (from the shoulder): outline, fur, cream on the
// board side, a sheen, fur tufts on the outer edge. Stroked per segment (about 45 per arm) so it stays cheap.
function z74Arm(L,s,upto){const A=L.sides[s],P=[];for(const p of A.pts){if(p.d<=upto)P.push(p);else{const q=P[P.length-1];if(q){const u=(upto-q.d)/(p.d-q.d);P.push({x:q.x+(p.x-q.x)*u,y:q.y+(p.y-q.y)*u,r:q.r+(p.r-q.r)*u,fore:p.fore});}break;}}
 if(P.length<2)return;ctx.lineCap='round';ctx.lineJoin='round';
 const pass=(col,wk,add,dx,dy)=>{ctx.strokeStyle=col;for(let i=1;i<P.length;i++){const a=P[i-1],b=P[i],r=(a.r+b.r)/2;ctx.lineWidth=r*2*wk+add;ctx.beginPath();ctx.moveTo(a.x+s*dx*r,a.y+dy*r);ctx.lineTo(b.x+s*dx*r,b.y+dy*r);ctx.stroke();}};
 pass(Z74.LINE,1,6,0,0);pass(Z74.FUR,1,0,0,0);pass(Z74.LIGHT,.5,0,-.42,-.1);pass('rgba(255,255,255,.18)',.28,0,.25,-.35);
 ctx.fillStyle=Z74.LINE;for(let i=1;i<P.length;i++){const p=P[i];if(p.fore||!p.side&&i>6)continue;const x=p.x+s*p.r*.98,y=p.y,o=i%2?1:-1;ctx.beginPath();ctx.moveTo(x,y-5);ctx.lineTo(x+s*8,y+o*3);ctx.lineTo(x,y+5);ctx.fill();}}
// shoulders + arms, drawn into a cached canvas while they are fully in (redrawn only when the layout changes)
const Z74C={cv:null,key:''};
function z74Body(L,e){const full=e.sh>=1&&e.arm>=1&&e.fore>=1,draw1=()=>{z74Shoulders(L,e.sh,1);for(const s of [-1,1]){const A=L.sides[s];z74Arm(L,s,A.sideLen*e.arm+(A.len-A.sideLen)*e.fore*(e.arm>=1?1:0));}};
 if(!full){ctx.save();z74ClipOutside();draw1();ctx.restore();return;}
 const k=scale*renderPixelRatio,key=[W,H,k,VIEW.y,VIEW.zy].join();
 if(Z74C.key!==key){const cv=Z74C.cv||document.createElement('canvas');cv.width=Math.ceil(W*k);cv.height=Math.ceil(H*k);const g=cv.getContext('2d'),c0=ctx;
  ctx=g;try{ctx.setTransform(k,0,0,k,0,0);ctx.save();z74ClipOutside();draw1();ctx.restore();}finally{ctx=c0;}Z74C.cv=cv;Z74C.key=key;}
 ctx.save();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(Z74C.cv,0,0);ctx.restore();}
// the approved mitt (ART.paw: the Ragdoll's copy on this board), drawn exactly as the idle mitt (drawRestMitt, MITT_W)
function z74Mitt(x,y,s,a){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);if(s>0)ctx.scale(-1,1);ctx.rotate(-Z74.MITT_TURN);drawRestMitt(Z74.MITT_W);ctx.restore();}
function z74DrawLayer(){const X=PGPX,e=z74Env(X.t),L=z74Layout();Z74.L=L;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 z74Body(L,e);
 // mitts: slide in from the bottom corners along the forearm to where they meet
 const hidden=sweepTime>0||catquakeTime>0;
 for(const s of [-1,1]){const A=L.sides[s],u=e.fore,kn=e.hold?3*Math.sin(X.t*Math.PI*2*1.3+(s>0?Math.PI:0)):0,x=A.M.x+s*(1-u)*170,y=A.M.y+(1-u)*40+kn;if(!hidden&&u>0)z74Mitt(x,y,s,1);}
 ctx.restore();}
// draw the layer right after the machine: under the coins (falling coins and the pickup stay in front) and under the head
const __z74Machine=drawMachine;drawMachine=function(){const r=__z74Machine.apply(this,arguments);if(z74On()&&Z74.drawnF!==Z74.f){Z74.drawnF=Z74.f;try{z74DrawLayer();}catch(e){Z74.err=String(e);}}return r;};
// the idle mitts lift away while the Hug comes in and drop back when it lets go (sweep/quake keep their own mitts)
const __z74Paws=drawPaws;drawPaws=function(){if(!z74On()||sweepTime>0||catquakeTime>0)return __z74Paws();
 const k=z74Env(PGPX.t).idle;if(k<=0)return;ctx.save();ctx.globalAlpha*=k;ctx.translate(0,-(1-k)*110);try{__z74Paws();}finally{ctx.restore();}};
// --- the power ---
const __z74Use=pgpUse;
pgpUse=function(){const cat=pgpCat(),P=PGP[cat];if(P.id!=='hug')return __z74Use();
 PG.powers[cat]=pgpCount(cat)-1;pgSave();stopDrops();try{diagEvent('powers','use hug (CP-74 proto) left='+PG.powers[cat]+' level='+pglSel());}catch(e){}
 callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}
 PGPX={id:'hug',z74:1,t:0,dur:Z74.ON+Z74.HOLD+Z74.OUT,cols:null,hearts:[],acc:0,pop:0,clasp:false};Z74.stats.uses++;
 pgSfx('meow',1.2);try{sfx.paw40('swipe',1);}catch(e){}try{sfx.pet('mrrp',1);}catch(e){}};
function z74Walls(){const len=T.FRONT-GUARD_END+40,z=(GUARD_END+T.FRONT)/2; // today's two gutter colliders, unchanged
 return [-1,1].map(s=>world.createCollider(RAPIER.ColliderDesc.cuboid(8*M,40*M,len/2*M).setTranslation((200+s*((T.R-T.L)/2+8))*M,40*M,z*M).setFriction(.2)));}
function z74Heart(X,x,y,big){if(X.hearts.length>160)return;const c=['#ff6ab8','#ff9ad8','#ff3d8b','#ffc2e4'][Math.floor(Math.random()*4)];
 X.hearts.push({x,y,vx:rand(-18,18),vy:-rand(50,110)*(big?1.3:1),t:0,life:rand(1.4,2.3),s:rand(1.1,2.2)*(big?1.25:1),c,ph:rand(0,6)});}
function z74Spawn(X,dt){const L=Z74.L||(Z74.L=z74Layout());const e=z74Env(X.t);
 if(!X.clasp&&X.t>=Z74.IN){X.clasp=true;try{sfx.pet('content',1.2);}catch(err){}for(let i=0;i<36;i++){const s=i%2?1:-1,M=L.sides[s].M;z74Heart(X,M.x-s*rand(0,60),M.y-rand(20,60),true);}}
 if(!e.hold)return;X.acc+=dt*16;while(X.acc>=1){X.acc--;const s=Math.random()<.5?-1:1,A=L.sides[s];let p;
  if(Math.random()<.3)p={x:A.M.x+rand(-50,50),y:A.M.y-rand(10,50)};else{const q=A.pts[Math.floor(rand(0,A.pts.length))];p={x:z74Clamp(q.x,8,392),y:q.y};}z74Heart(X,p.x,p.y);}
 X.pop+=dt*6;while(X.pop>=1){X.pop--;z74Heart(X,rand(30,370),rand(L.chin+60,L.lip-20));}}
const __z74Tick=pgpTick;
pgpTick=function(dt){__z74Tick(dt);const X=PGPX;if(!X||!X.z74)return;
 if(!X.cols&&!X.wallsDone&&X.t>=Z74.ON){X.cols=z74Walls();Z74.stats.on.push(+X.t.toFixed(3));}
 if(X.cols&&X.t>=Z74.ON+Z74.HOLD){for(const c of X.cols){try{world.removeCollider(c,true);}catch(e){}}X.cols=null;X.wallsDone=true;Z74.stats.off.push(+X.t.toFixed(3));}
 z74Spawn(X,dt);for(const h of X.hearts){h.t+=dt;h.x+=(h.vx+Math.sin(h.t*3+h.ph)*24)*dt;h.y+=h.vy*dt;}X.hearts=X.hearts.filter(h=>h.t<h.life);
 // the purr (Pet the cat's purr engine): builds with the arms, steady while held, fades as it lets go
 if(!WILD.petGame){const o=X.t-(Z74.ON+Z74.HOLD),lv=o<0?.8*z74Seg(X.t,0,.6):.8*(1-z74Seg(o,0,.5));try{sfx.purr(lv,21+2*Math.sin(X.t*1.3),0);}catch(e){}}};
const __z74End=pgpEnd;pgpEnd=function(){const X=PGPX;const r=__z74End();if(X&&X.z74&&!WILD.petGame){try{sfx.purr(0,20);}catch(e){}}return r;};
// a pause or the inventory stops the tick; silence the purr then
const __z74WT=wildTick;wildTick=function(dt){const r=__z74WT(dt);if(PGPX&&PGPX.z74&&!WILD.petGame&&(inventoryOpen||panel.style.display==='block'||cp51Paused)){try{sfx.purr(0,20);}catch(e){}}return r;};
const __z74PD=pgpDraw;
pgpDraw=function(){const X=PGPX;if(!(X&&X.z74))return __z74PD();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const h of X.hearts){const u=h.t/h.life,k=u<.12?u/.12:1;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(1-u)*1.6))*.95;pgHeart(h.x,h.y,h.s*(.6+.4*k)*1.15,'rgba(90,20,60,.35)');pgHeart(h.x,h.y,h.s*(.6+.4*k),h.c);ctx.restore();}
 const a=Math.min(1,X.t/.35,(X.dur-X.t)/.5);ctx.globalAlpha=Math.max(0,a);wildText('NO SIDE FALLS',200,w43ChinY()+28,24,'#ff9ad8','#3a0b2e',5);ctx.restore();
};
