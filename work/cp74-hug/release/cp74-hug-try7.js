// ---------- CP-74 Hug (UAT 106, try 6; Jenny, Nov 18: "CP-74 Hug layout: approved. Title first, then the hug with no words over
// it; small phones arms only is fine. Then Codex art." Art: "go ahead and get started on that. I think it looks decent. I
// don't think it looks great as standalone art, but I think it's going to work with the animation.") ----------
// The Ragdoll's Hug, as approved in the CP-74 layout prototype (work/cp74-hug/cp74-hug.js), now with Codex's painted art
// (CP74_ART, revision 2: one shoulder mirrored, a left and a right arm, fixed canvases):
// - Title first (the rule for every power, CP-82): "HUG!" shows big and alone for 1.2 s, then the hug starts 1.25 s after the
//   tap with no words over it ("NO SIDE FALLS" is gone; other callouts wait until it ends).
// - (try 7, after UAT 106) No elbow, no fades: the resting mitts travel forward and down to the lower corners at constant
//   size, each straight painted arm slides out from behind its shoulder under its mitt, and the shoulders lean forward into
//   the reach; letting go is the same played backwards. (UAT 106 = try 6: the arms unfolded at an elbow.) Earlier: each arm unfolds forward: the
//   forearm opens from the elbow with the mitt leading while the upper arm swings down from the shoulder onto the side of
//   the board, in one graceful eased move (about 1.4 s; the mitt fades in), and folds back the same way, the painting cut at the elbow into
//   two pieces (UAT 104d; 104a grew, 104b swung, 104c popped and bent backwards on the way out); the approved
//   big mitts (same image and size, only moved and turned in 40 degrees) sit in the lower corners like a funnel. The idle
//   mitts lift away meanwhile and come back after.
// - The arms are the gutter walls: today's two colliders (same size and place) exist while the arms are fully in, for 6 s.
// - Hearts all over and the Pet the cat purr while it lasts.
// - Nothing covers the board: the art is clipped to outside the board's actual rim (CP-78), and the rim is drawn again over
//   the arms' edge. Drawn right after the machine: under the coins, falling prizes and the head. Mitts below the front lip
//   (off-screen on short phones, which then show the arms only).
const Z74={
 IN:1.5,     // in (try 7): the shoulders slide out from behind the head 0-0.4 s; the resting mitts travel forward and down to
             // the lower corners and each straight arm slides out from behind its shoulder under its mitt (0.1-1.5 s, eased);
             // the shoulders lean forward and down with the reach
 ON:1.5,     // the gutter walls go up once the arms are in place...
 HOLD:6,     // ...and stay 6 s (as before)
 OUT:1.5,    // let go: the reach played backwards, frame for frame (same 1.5 s)
 LEAN:{dy:14,dx:8,grow:.06}, // the shoulders' lean at full reach: 14 down, 8 out, 6% wider (the mitts never change size)
 FOLD1:.5,   // the arm (try 4): folded, the upper arm is swung 29 degrees out about the shoulder...
 FOLD2:1.6,  // ...and the forearm bent 92 degrees at the elbow (the way a cat's elbow bends; it only ever opens to straight)
 ELBOW:560,  // where the arm painting is cut into upper arm and forearm (reference y; Codex's canvas row 1000 of 2080)
 MITT_W:182, // the approved idle-mitt size (MITT_W), unchanged
 MITT_DX:174, // each mitt's centre from the middle (lower corners)
 MITT_DY:90, // mitt centre below the front lip
 MITT_TURN:.7, // turned in 40 degrees: the two mitts make a V that opens up to the front edge
 SH_DX:150,ARM_R:27, // the arms' path (hearts come off it)
 // Codex's registration (work/cp74-art/revision2/registration-v2.json): shoulder 200x160 units centred x32/368, y=shY-30;
 // left arm 200x520 at x -70, right arm mirrored about x 200; Y and height mapped from the reference rim (top 370.743,
 // bottom 774.374 at 412x915; arm top 310) to the board's current projected rim.
 REF:{rimTop:370.74302348118385,rimBot:774.3742523461208,armTop:310,armH:520,armX:-70,armW:200,shX:32,shUp:30,shW:200,shH:160},
 f:0,drawnF:-1,pawsF:-9,img:{},pre:{},rimM:null,rimKey:'',rim:null,stats:{uses:0,on:[],off:[]}};
const z74Clamp=(x,a,b)=>Math.max(a,Math.min(b,x)),z74Ease=u=>1-Math.pow(1-z74Clamp(u,0,1),3),z74Seg=(t,a,b)=>z74Clamp((t-a)/(b-a),0,1);
// the art, decoded once at start
for(const k of ['shoulder','left','right']){try{const im=new Image();im.onload=()=>{Z74.img[k]=im;};im.src=CP74_ART[k];}catch(e){Z74.err=String(e);}}
// frame counter (the drawing hooks below run once per frame)
const __z74Draw=draw;draw=function(){Z74.f++;return __z74Draw.apply(this,arguments);};
function z74On(){const X=PGPX;return !!(X&&X.z74&&WILD.on&&!inventoryOpen);}
// --- the envelope: how far in each piece is at time t (from the start of the hug, after the title) ---
function z74Env(t){const o=t-(Z74.ON+Z74.HOLD);
 const io=u=>{u=z74Clamp(u,0,1);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;}; // ease in and out: slow start, slow end
 // sh: shoulders out from behind the head (0 tucked, 1 out); reach: 0 = mitts resting beside the head, arms hidden behind the
 // shoulders; 1 = mitts in the lower corners, arms along the board's sides. Letting go = the same curves at reversed time.
 const at=x=>({sh:io(z74Seg(x,0,.4)),reach:io(z74Seg(x,.1,1.5))});
 if(o<0)return {...at(t),hold:t>=Z74.IN,arm:1};
 const r=Z74.ON-o*(Z74.ON/Z74.OUT);return {...at(r),hold:false,arm:1};}
// the arm painting cut at the elbow into two pieces (no repainting): the upper arm with a rounded end at the elbow, and the
// forearm whose top fades over the upper arm; plus the arm's centre line per canvas row (for the pivots). Made once.
function z74Pieces(){if(Z74.pieces)return Z74.pieces;const im=Z74.img.left;if(!im)return null;const W=im.width,Hh=im.height,k=Hh/Z74.REF.armH,cut=Math.round((Z74.ELBOW-Z74.REF.armTop)*k);
 const src=document.createElement('canvas');src.width=W;src.height=Hh;const sg=src.getContext('2d');sg.drawImage(im,0,0);const d=sg.getImageData(0,0,W,Hh).data;
 const centre=row=>{row=Math.round(z74Clamp(row,0,Hh-1));let l=-1,r=-1;for(let x=0;x<W;x++)if(d[(row*W+x)*4+3]>128){if(l<0)l=x;r=x;}return l<0?W/2:(l+r)/2;};
 const half=row=>{let l=-1,r=-1;for(let x=0;x<W;x++)if(d[(row*W+x)*4+3]>128){if(l<0)l=x;r=x;}return l<0?60:(r-l)/2;};
 const ov=Math.round(15*k),up=document.createElement('canvas');up.width=W;up.height=cut+ov;const ug=up.getContext('2d');ug.drawImage(im,0,0);
 // rounded elbow end: keep the rows above the cut, and below it only inside a half-ellipse
 ug.globalCompositeOperation='destination-in';ug.beginPath();ug.rect(0,0,W,cut);ug.ellipse(centre(cut),cut,half(cut)+2,ov,0,0,Math.PI);ug.fill();
 const lo=document.createElement('canvas'),top=cut-ov;lo.width=W;lo.height=Hh-top;const lg=lo.getContext('2d');lg.drawImage(im,0,-top);
 lg.globalCompositeOperation='destination-in';const gr=lg.createLinearGradient(0,0,0,ov);gr.addColorStop(0,'rgba(0,0,0,0)');gr.addColorStop(1,'rgba(0,0,0,1)');lg.fillStyle=gr;lg.fillRect(0,0,W,lo.height);
 return Z74.pieces={up,lo,k,cut,top,pivotRow:Math.round(70*k),pivotX:centre(Math.round(70*k)),elbowX:centre(cut)};}
// where the left mitt is (screen units) at reach u: from its resting place beside the head (as drawPaws draws it) down a
// curve that keeps out to the side, to its place in the lower corner; its turn goes from the resting turn to 40 degrees
// the left mitt's path at reach u: from exactly where the board's resting mitt is drawn (drawPaws: mittRest(side), turned by
// MITT_TURN plus its tiny wobble) in a straight line to its place in the lower corner, turning to 40 degrees; same size throughout
function z74MittPath(L,u){const m=mittRest(-1),x0=m.x,y0=m.y,x2=200-Z74.MITT_DX,y2=L.mittY,t0=-(MITT_TURN+Math.sin(time*1.7)*.018);
 return {x:x0+(x2-x0)*u,y:y0+(y2-y0)*u,dx:x2-x0,dy:y2-y0,turn:t0+(Z74.MITT_TURN-t0)*u};}
// where each mitt is drawn this frame: 'paws' (the resting mitts' own pass, above the coins) while any of it may be over the
// board, 'layer' (with the arms, under the coins) once it is wholly below the front lip
function z74MittPass(L,e){const T=z74MittPath(L,e.reach);return T.y-70<L.lip?'paws':'layer';}
function z74DrawMitts(){const X=PGPX,e=z74Env(X.t),L=Z74.L||z74Layout(),r=z74RimPts(),R=Z74.REF;if(!r)return;
 const ys=(r.left[r.left.length-1].y-r.left[0].y)/(R.rimBot-R.rimTop),ay=r.left[0].y+(R.armTop-R.rimTop)*ys;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const s of [-1,1]){const kn=e.hold?3*Math.sin(X.t*Math.PI*2*1.3+(s>0?Math.PI:0)):0;ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,true,kn);ctx.restore();}
 ctx.restore();}
// the left arm (try 7): Codex's whole arm painting, straight, never bent or scaled. It slides along the paw's whole path, its
// end always under the paw; at reach 1 it is in place along the board's side. It moves with the shoulder (z74ShoulderAt) and is only drawn below the line
// through the shoulder's middle, which the shoulder painting covers. The mitt (mitt=true) is the resting mitt travelling.
function z74ShoulderAt(L,e){const R=Z74.REF,k=e.sh,ln=e.reach,Ln=Z74.LEAN; // the left shoulder's centre offset from its place
 return {x:(1-k)*60-Ln.dx*ln,y:-(1-k)*40+Ln.dy*ln,cx:R.shX,cy:L.shY-R.shUp};}
function z74LeftArm(L,e,ay,ys,mitt,kn){const T=z74MittPath(L,e.reach);if(mitt){z74Mitt(T.x,T.y+kn,-1,1,T.turn);return;}
 const R=Z74.REF,ah=R.armH*ys,im=z74Pre('left',R.armW,ah);if(!im)return;const S=z74ShoulderAt(L,e);
 const back=1-e.reach,ox=-T.dx*back,oy=-T.dy*back; // the arm slides the paw's whole path: its end stays under the paw
 ctx.save();ctx.beginPath();ctx.rect(-200,S.cy+S.y,800,H+400);ctx.clip();
 ctx.drawImage(im,R.armX+ox,ay+oy,R.armW,ah);ctx.restore();}
// --- layout (screen units, 400 wide), from the game's own projection every frame ---
function z74Layout(){const hw=(T.R-T.L)/2,F=skyScreen(200-hw,T.FRONT,0),lip=F.y,chin=w43ChinY();
 const mittY=lip+Z74.MITT_DY,shY=chin+30;
 const L={lip,chin,shY,mittY,H,sides:{}};
 for(const s of [-1,1]){const pts=[];const S={x:200+s*(Z74.SH_DX+18),y:shY+18};pts.push({x:S.x,y:S.y});
  const z0=GUARD_END-20;const p0=skyScreen(200+s*hw,z0,0);
  for(let i=1;i<=6;i++){const u=i/6,r=Z74.ARM_R*p0.s;pts.push({x:S.x+(p0.x+s*(r+1)-S.x)*u,y:S.y+(p0.y-S.y)*u});}
  for(let z=z0+15;z<=T.FRONT;z+=15){const p=skyScreen(200+s*hw,z,0),r=Z74.ARM_R*p.s;pts.push({x:p.x+s*(r+1),y:p.y});}
  const M={x:200+s*Z74.MITT_DX,y:mittY};L.sides[s]={pts,M,S};}
 return L;}
// --- the board's rim (CP-78) on screen: the same outline cp78Rim strokes, through the transform it was last drawn with ---
const __z74Rim=cp78Rim;cp78Rim=function(){try{const m=ctx.getTransform();Z74.rimM=[m.a,m.b,m.c,m.d,m.e,m.f];}catch(e){}return __z74Rim.apply(this,arguments);};
function z74RimPts(){const m=Z74.rimM;if(!m)return null;const k=scale*renderPixelRatio,key=m.join()+','+k;if(Z74.rimKey===key)return Z74.rim;
 const F=__felt,last=F[F.length-1],left=[[last[1]+1,__NF+3]],right=[];
 for(let i=F.length-1;i>=0;i-=58)left.push([F[i][1]+1,F[i][0]]);left.push([F[0][1]+1,F[0][0]]);
 right.push([F[0][2]-1,F[0][0]]);for(let i=0;i<F.length;i+=58)right.push([F[i][2]-1,F[i][0]]);right.push([last[2]-1,last[0]],[last[2]-1,__NF+3]);
 const tr=p=>({x:(m[0]*p[0]+m[2]*p[1]+m[4])/k,y:(m[1]*p[0]+m[3]*p[1]+m[5])/k});
 Z74.rim={left:left.map(tr).reverse(),right:right.map(tr)};Z74.rimKey=key;return Z74.rim;}
// clip to everything outside the board's rim
function z74ClipOutside(r){ctx.beginPath();ctx.rect(-200,-200,800,H+400);r.left.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
 for(let i=r.right.length-1;i>=0;i--)ctx.lineTo(r.right[i].x,r.right[i].y);ctx.closePath();ctx.clip('evenodd');}
// a sprite pre-scaled once to the device pixels it is drawn at (so each frame copies it 1:1)
function z74Pre(name,w,h){const im=Z74.img[name];if(!im)return null;const k=scale*renderPixelRatio,pw=Math.max(1,Math.round(w*k)),ph=Math.max(1,Math.round(h*k)),c=Z74.pre[name];
 if(c&&c.width===pw&&c.height===ph)return c;const cv=document.createElement('canvas');cv.width=pw;cv.height=ph;const g=cv.getContext('2d');g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';g.drawImage(im,0,0,pw,ph);
 return Z74.pre[name]=cv;}
// shoulders + arms: arms wipe down the sides (then on past the lip to the mitts), shoulders come forward and tuck in
function z74Body(L,e){const r=z74RimPts();if(!r)return;const R=Z74.REF,ys=(r.left[r.left.length-1].y-r.left[0].y)/(R.rimBot-R.rimTop),ay=r.left[0].y+(R.armTop-R.rimTop)*ys,ah=R.armH*ys;
 ctx.save();z74ClipOutside(r);
 // each arm slides out from behind its shoulder (whole painting, straight); then the shoulders, leaning into the reach
 for(const s of [-1,1]){ctx.save();if(s>0){ctx.translate(400,0);ctx.scale(-1,1);}z74LeftArm(L,e,ay,ys,false,0);ctx.restore();}
 const sh=z74Pre('shoulder',R.shW,R.shH),k=e.sh,ln=e.reach,Ln=Z74.LEAN,S=z74ShoulderAt(L,e);
 // tucked (k=0) the shoulder sits 60 in and 40 up, behind the head; it slides out (no fade, no pop), then leans with the reach
 // drawn only down to 40 below the paw's centre under the paw, and beside the paw only down to the cheek line (behind the head),
 // so its soft lower edge always has the arm beneath it and its cut never shows
 const Tp=z74MittPath(L,e.reach);
 if(sh&&k>0)for(const s of [-1,1]){ctx.save();const px=s<0?Tp.x:400-Tp.x,cut=Tp.y+40,hi=Math.min(cut,Tp.y-40);ctx.beginPath(); // under the paw: down to cut; beside it (towards the middle): down to 40 above the paw's centre (above that it is behind the head), so the step is under the paw
  if(s<0){ctx.rect(-200,-200,px+50+200,cut+200);ctx.rect(px+50,-200,600,hi+200);}else{ctx.rect(px-50,-200,600,cut+200);ctx.rect(-200,-200,px-50+200,hi+200);}ctx.clip();ctx.translate(s<0?S.cx+S.x:400-S.cx-S.x,S.cy+S.y);if(s>0)ctx.scale(-1,1);
  const q=1+Ln.grow*ln;ctx.scale(q,q);ctx.drawImage(sh,-R.shW/2,-R.shH/2,R.shW,R.shH);ctx.restore();}
 ctx.restore();
 // the board's own rim again, over the arms' edge
 ctx.save();ctx.setTransform(...Z74.rimM);__z74Rim();ctx.restore();}
// the approved mitt (ART.paw: the Ragdoll's copy on this board), drawn exactly as the idle mitt (drawRestMitt, MITT_W)
function z74Mitt(x,y,s,a,turn){if(a<=0)return;ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);if(s>0)ctx.scale(-1,1);ctx.rotate(-(turn===undefined?Z74.MITT_TURN:turn));drawRestMitt(Z74.MITT_W);ctx.restore();}
function z74DrawLayer(){const X=PGPX,e=z74Env(X.t),L=z74Layout();Z74.L=L;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 z74Body(L,e);
 // mitts: drawn here (under the coins) once they are below the lip, or if the resting mitts' pass did not run last frame
 const hidden=sweepTime>0||catquakeTime>0;
 if(!hidden&&(z74MittPass(L,e)==='layer'||Z74.pawsF<Z74.f-1)){ctx.restore();z74DrawMitts();return;}
 ctx.restore();}
// drawn right after the machine: under the coins (falling coins and the pickup stay in front) and under the head
const __z74Machine=drawMachine;drawMachine=function(){const r=__z74Machine.apply(this,arguments);if(z74On()&&Z74.drawnF!==Z74.f){Z74.drawnF=Z74.f;try{z74DrawLayer();}catch(e){Z74.err=String(e);}}return r;};
// during the hug the resting mitts are drawn travelling: here, in their own pass above the coins, while over the board
const __z74Paws=drawPaws;drawPaws=function(){if(!z74On()||sweepTime>0||catquakeTime>0)return __z74Paws();
 Z74.pawsF=Z74.f;try{const L=Z74.L||z74Layout();if(z74MittPass(L,z74Env(PGPX.t))==='paws')z74DrawMitts();}catch(e){Z74.err=String(e);}};
// --- the power: title first (CP-82's path: the big "HUG!" alone, then this starts 1.25 s after the tap) ---
CP82.ids.push('hug');
CP82A.hug=function(){PGPX={id:'hug',z74:1,t:0,dur:Z74.ON+Z74.HOLD+Z74.OUT,cols:null,hearts:[],acc:0,pop:0,clasp:false};Z74.stats.uses++;
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
// hearts only: no words over the hug
const __z74PD=pgpDraw;
pgpDraw=function(){const X=PGPX;if(!(X&&X.z74))return __z74PD();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);
 for(const h of X.hearts){const u=h.t/h.life,k=u<.12?u/.12:1;ctx.save();ctx.globalAlpha=Math.max(0,Math.min(1,(1-u)*1.6))*.95;pgHeart(h.x,h.y,h.s*(.6+.4*k)*1.15,'rgba(90,20,60,.35)');pgHeart(h.x,h.y,h.s*(.6+.4*k),h.c);ctx.restore();}
 ctx.restore();};
// ---------- end CP-74 ----------
