
// ---------- CP-72 prototype v3 (Jenny, Nov 15/17): Zoomies, the Orange cat's power, rebuilt ----------
// Two kittens get the zoomies: they pop out at the back and tear down the board toward the player - zigzagging, running
// a circle, a sudden straight-up spook jump (fur and tail puffed straight out), a flip - and finally leap off the front.
// What they run into is shoved forward over the front edge into the tray (the kittens shove at most 1 prize per use;
// no hold at the edge: an occasional second prize pushed off by the double-speed pusher is fine - Jenny, Nov 18).
// double speed the whole time, with the turbo slide sound and speed streaks. Only prizes and pieces lying on top of the
// pile are shoved: the bottom layer stays. Stand-ins drawn in code: the kittens (all poses), dust, streaks. Sounds: existing.
// v4: a sideways arched-back hop; each kitten starts with a play-bow wind-up (front low, rear up, tail hooked, wide eyes);
// low stretched sprint, stretched-out leaps. Poses from Jenny's reference photos (Screenshots/ref-zoomies-1..5, private; inspiration only).
const Z72={ // every beat and number is here so it can be tuned
 dur:7, // seconds of double-speed pusher
 starts:[.4,.95], // when each kitten pops out (s)
 bow:.5, hop:{d:.45,h:36,dx:62}, // the play-bow wind-up before bolting (s); the sideways arched-back hop
 run:290, circle:330, // running speed and speed round a circle (table units/s)
 zig:85, circleR:44, // how far each side the zigzag swings; circle radius (table units)
 spook:{d:.85,h:90}, flip:{d:.55,h:52,dz:70}, // spook jump: length (s) and height; flip: length, height, distance forward
 plans:[['circle','hop','spook','flip'],['hop','spook','circle','flip']], // the stunt at each of the 4 zigzag corners, per kitten
 reach:.62, // a piece joins a kitten's shove when it touches the kitten (kitten half-width + this part of the piece's radius)
 shoveV:2.5, // how fast shoved pieces slide forward (m/s; 2.5 = 250 table units/s)
 perKitten:3, maxPieces:6, maxPrizes:1, // pieces one kitten may shove; pieces in all per use; prizes in all per use (Jenny, Nov 17)
 topOnly:true, // coins must lie on top of the pile (the bottom layer stays); prizes always count
 size:50, // kitten width (table units; a coin is 52 across)
 coats:[{fur:'#f39a3c',dark:'#b85a14',light:'#fff3df'},{fur:'#fbe7c6',dark:'#d9a96a',light:'#ffffff'}],
 stats:{runs:0,carried:[],paid:[],lostSide:[],anySide:0,anyFront:0,kits:0}};
let Z72X=null;
function z72E(x){x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);}
function z72R(b){return b.kind==='item'?ITEM_R:RAIN[b.kind]?RAIN[b.kind].r:b.kind==='quake'?COIN_R*1.15:COIN_R;}
function z72Half(b){return typeof b.half==='number'?b.half:halfOf(b.kind);}
function z72Value(b){if(b.kind==='item')return 100;if(b.kind==='quake')return 40;if(RAIN[b.kind])return RAIN[b.kind].n;return VALUE[b.kind]||1;}
// A piece a kitten may shove: on the table in front of the pusher, and a prize or lying on top of the pile.
function z72Ok(b){if(b.dead||b.kind==='stack'||b.bottle)return false;const p=b.rb.translation(),x=p.x/M,z=p.z/M,y=p.y/M;
 if(z<pusherY+10||z>T.FRONT-4||y<-3||Math.abs(x-200)>tableHalfAt(z)-4)return false;
 if(Z72.topOnly&&b.kind!=='item'&&y-z72Half(b)<COIN_HALF*1.5)return false;return true;}
// The best shovable piece left (a prize only while none is taken or aimed at); its spot becomes one of the kitten's corners.
function z72Aim(){const X=Z72X;let best=null,bv=-1;for(const b of bodies){if(!z72Ok(b)||X.taken.has(b)||X.aimed.has(b))continue;if(b.kind==='item'&&X.prizes+X.prizeAims>=Z72.maxPrizes)continue;
  const v=z72Value(b)+b.rb.translation().z/M*.001;if(v>bv){bv=v;best=b;}}
 if(!best)return null;X.aimed.add(best);if(best.kind==='item')X.prizeAims++;const q=best.rb.translation();return {x:q.x/M,z:q.z/M};}
function z72Start(){const X=Z72X={t:0,kits:[],taken:new Set(),aimed:new Set(),prizeAims:0,prizes:0,carry:[],fx:{},next:0};Z72.stats.runs++;
 const base=WILD.turbo>0?WILD_TURBO_PERIOD:WILD_PUSH_PERIOD;wildSetPeriod(base/2);X.period=base/2;
 try{sfx.wild('turbo',1);}catch(e){}pgSfx('meow',1.1);shake=Math.max(shake,.5);
 try{diagEvent('powers','cp72 zoomies');}catch(e){}}
// --- a kitten's path: a list of segments, each a function of its own 0..1 progress ---
function z72Clamp(x){return Math.max(PAY_L+28,Math.min(PAY_R-28,x));}
function z72Path(k,aim){const z0=Math.max(pusherY,PUSH_MAX)+4,z1=z0+80,zF=T.FRONT-14,segs=[],plan=Z72.plans[k.id%Z72.plans.length];
 const side0=k.id%2?1:-1,c=aim?z72Clamp(aim.x+side0*Z72.zig*.5):[150,250][k.id%2],x0=z72Clamp(c-side0*Z72.zig*.6);
 const corners=[.2,.43,.66,.86].map((f,i)=>({x:z72Clamp(c+(i%2?-1:1)*side0*Z72.zig),z:z1+(zF-z1)*f}));
 if(aim){let bi=0;corners.forEach((w,i)=>{if(Math.abs(w.z-aim.z)<Math.abs(corners[bi].z-aim.z))bi=i;});
  corners[bi]={x:z72Clamp(aim.x),z:Math.max(z1+20,Math.min(zF-40,aim.z-10))};corners.sort((a,b)=>a.z-b.z);}
 let at={x:x0,z:z1};
 segs.push({k:'pop',d:.32,f:u=>({x:x0,z:z0+(z1-z0)*u,h:26*Math.sin(u*Math.PI),pop:Math.min(1,u/.35),dir:1})});
 segs.push({k:'bow',d:Z72.bow,f:u=>({x:x0+Math.sin(u*40)*2*(u>.3?1:0),z:z1,h:0,dir:1,pose:'bow'})});
 const run=(A,B)=>{const d=Math.hypot(B.x-A.x,B.z-A.z)/Z72.run;if(d<.02)return;
  segs.push({k:'run',d,ground:1,f:u=>({x:A.x+(B.x-A.x)*u,z:A.z+(B.z-A.z)*u,h:Math.abs(Math.sin(u*d*17))*4,dir:B.z>=A.z?1:-1,pose:'sprint',lean:Math.max(-1,Math.min(1,(B.x-A.x)/Math.max(30,Math.abs(B.z-A.z))))*.35})});};
 corners.forEach((w,i)=>{run(at,w);at={x:w.x,z:w.z};const st=plan[i];
  if(st==='circle'){const sd=w.x<200?1:-1,R=Z72.circleR,C={x:w.x+sd*R,z:w.z},d=2*Math.PI*R/Z72.circle;
   segs.push({k:'circle',d,ground:1,f:u=>{const th=u*2*Math.PI;return {x:C.x-sd*R*Math.cos(th),z:C.z+R*Math.sin(th),h:Math.abs(Math.sin(u*d*17))*3,dir:Math.cos(th)>=0?1:-1,lean:sd*Math.sin(th)*.45};}});}
  else if(st==='spook'){const A={...at},S=Z72.spook;
   segs.push({k:'spook',d:S.d,f:u=>{const up=1-Math.pow(2*u-1,4);return {x:A.x+Math.sin(u*60)*1.5,z:A.z,h:S.h*up,puff:u<.9?Math.min(1,u/.06):Math.max(0,(1-u)/.1),dir:1};}});}
  else if(st==='hop'){const A={...at},H=Z72.hop,sd=A.x<200?1:-1,B={x:z72Clamp(A.x+sd*H.dx),z:A.z+12};
   segs.push({k:'hop',d:H.d,f:u=>({x:A.x+(B.x-A.x)*z72E(u),z:A.z+(B.z-A.z)*u,h:H.h*Math.sin(u*Math.PI),dir:1,pose:'arch',lean:-sd*.25*Math.sin(u*Math.PI)})});at=B;}
  else if(st==='flip'){const A={...at},F=Z72.flip,B={x:A.x,z:Math.min(zF-10,A.z+F.dz)};
   segs.push({k:'flip',d:F.d,f:u=>({x:A.x,z:A.z+(B.z-A.z)*u,h:F.h*Math.sin(u*Math.PI),rot:-2*Math.PI*z72E(u),dir:1,pose:'leap'})});at=B;}});
 run(at,{x:at.x,z:zF});
 segs.push({k:'skid',d:.16,f:u=>({x:at.x,z:zF+4*Math.sin(u*Math.PI/2),h:0,skid:u,dir:1})});
 segs.push({k:'leap',d:.4,f:u=>({x:at.x,z:zF+4+u*60,h:40*Math.sin(Math.min(1,u)*Math.PI*.8),grow:1+u*.9,fade:Math.max(0,1-u),dir:1,pose:'leap'})});
 let t=0;for(const g of segs){g.t0=t;t+=g.d;}k.segs=segs;k.len=t;}
function z72KitPos(k,u){const segs=k.segs;let g=segs[segs.length-1];for(const s of segs)if(u<s.t0+s.d){g=s;break;}
 const f=Math.max(0,Math.min(1,(u-g.t0)/g.d)),P=g.f(f);P.seg=g.k;P.si=segs.indexOf(g);P.ground=!!g.ground;P.u=f;if(u>=k.len)P.done=true;return P;}
function z72Tick(dt){const X=Z72X;if(!X)return;X.t+=dt;const t=X.t;
 // the pusher stays at double speed for the whole power (a Turbo starting or ending meanwhile keeps it doubled)
 const want=(WILD.turbo>0?WILD_TURBO_PERIOD:WILD_PUSH_PERIOD)/(t<Z72.dur?2:1);if(Math.abs(PUSH_PERIOD-want)>1e-6&&!WILD.jp)wildSetPeriod(want);
 while(X.next<Z72.starts.length&&t>=Z72.starts[X.next]){const k={id:X.kits.length,t0:Z72.starts[X.next],coat:Z72.coats[X.kits.length%Z72.coats.length],n:0,fx:{}};
  z72Path(k,z72Aim());X.kits.push(k);X.next++;Z72.stats.kits++;}
 for(const k of X.kits){const u=t-k.t0;if(u<0||k.gone)continue;const prev=k.P,P=z72KitPos(k,u);k.P=P;
  const fx=k.fx,once=(key,fn)=>{if(!fx[key]){fx[key]=1;try{fn();}catch(e){}}};
  if(P.seg==='pop')once('pop',()=>pgSfx('chirp',.8));
  if(P.seg==='bow')once('bow',()=>sfx.laser('wind',.9));
  if(P.seg==='hop'){once('hop'+P.si,()=>pgSfx('whoosh',.7));if(P.u>.85)once('hopLand'+P.si,()=>sfx.wild2('land',.6));}
  if(P.seg==='run')once('land',()=>{sfx.wild2('land',.6);pgSfx('meow',.7);});
  if(P.seg==='circle')once('circle'+P.si,()=>sfx.laser('wind',.8));
  if(P.seg==='spook'){once('spook'+P.si,()=>{pgSfx('meow',1.3);sfx.laser('pounce',.9);});if(P.u>.85)once('spookLand'+P.si,()=>sfx.wild2('land',.8));}
  if(P.seg==='flip'){once('flip'+P.si,()=>pgSfx('whoosh',1));if(P.u>.85)once('flipLand'+P.si,()=>sfx.wild2('land',.7));}
  if(P.seg==='leap')once('leap',()=>sfx.laser('pounce',.9));
  if(P.done){k.gone=true;continue;}
  // what the kitten runs into while on the ground and heading toward you joins its shove
  const fwd=prev?P.z-prev.z>=-.01:true;
  if(P.ground&&fwd&&k.n<Z72.perKitten&&X.carry.length<Z72.maxPieces)for(const b of bodies){if(k.n>=Z72.perKitten||X.carry.length>=Z72.maxPieces)break;if(X.taken.has(b)||!z72Ok(b))continue;if(b.kind==='item'&&X.prizes>=Z72.maxPrizes)continue;
   const q=b.rb.translation(),x=q.x/M,z=q.z/M,r=z72R(b);if(Math.hypot(x-P.x,z-P.z)>Z72.size*.5+r*Z72.reach||z<P.z-r*.3)continue;
   X.taken.add(b);k.n++;if(b.kind==='item')X.prizes++;X.carry.push({b,k,id:b.id||b.kind,done:false});Z72.stats.carried.push(b.id||b.kind);pgSfx('coin',.7);}}
 // no prize (and nothing a kitten shoves) goes over a side while Zoomies runs: near a side edge it is eased back
 for(const b of bodies){if(b.dead||b.kind==='stack')continue;const mine=X.taken.has(b);if(b.kind!=='item'&&!mine)continue;const q=b.rb.translation(),x=q.x/M,z=q.z/M;
  if(z>=T.FRONT-6||z<pusherY)continue;const edge=tableHalfAt(Math.min(T.FRONT,z))-z72R(b)*1.1;
  if(Math.abs(x-200)>edge){const v=b.rb.linvel(),d=x<200?1:-1;b.rb.wakeUp();b.rb.setLinvel({x:d*Math.max(1.6,d*v.x),y:v.y,z:v.z},true);Z72.stats.eased=(Z72.stats.eased|0)+1;}}
 // the shove: a shoved piece slides straight on toward you (steered inside the tray's width) and over the front edge
 for(const o of X.carry){const b=o.b;if(o.done)continue;if(b.dead){o.done=true;continue;}const q=b.rb.translation(),x=q.x/M,z=q.z/M;
  if(z>T.FRONT+4){o.done=true;continue;}
  const v=b.rb.linvel(),keep=Math.max(PAY_L+28,Math.min(PAY_R-28,x)),vx=(keep-x)*.1+v.x*.3;
  b.rb.wakeUp();b.rb.setLinvel({x:vx,y:Math.max(v.y,.3),z:Math.max(v.z,Z72.shoveV)},true);}
}
function z72Stop(){const X=Z72X;if(!X)return;Z72X=null;if(!WILD.jp)wildSetPeriod(WILD.turbo>0?WILD_TURBO_PERIOD:WILD_PUSH_PERIOD);}
// --- drawing (screen coordinates, over the board) ---
// A kitten (code stand-in): seen from the front (coming toward you) or from behind; puff 0..1 = spooked (fur spiked out,
// tail straight up like a bottle brush, eyes wide, legs stiff); rot = flip rotation.
function z72Kitten(x,y,s,C,ph,dir,skid,alpha,lean,puff,rot,pose){const k=1+.3*puff;ctx.save();ctx.globalAlpha*=alpha;ctx.translate(x,y);ctx.scale(s*k,s*k);ctx.rotate(lean||0);
 if(pose==='sprint')ctx.scale(1.1,.86);else if(pose==='leap')ctx.scale(.92,1.14);if(pose==='arch')puff=Math.max(puff,.22);const bow=pose==='bow',hook=bow||pose==='arch';ctx.lineJoin='round';ctx.lineCap='round';
 const ol='#2a1406',air=puff>0||rot,bob=air?0:Math.abs(Math.sin(ph))*3,legA=air?0:Math.sin(ph)*5;
 ctx.translate(0,-bob);if(rot){ctx.translate(0,-22);ctx.rotate(rot);ctx.translate(0,22);}
 const spiky=(cx,cy,rx,ry,n,amp)=>{ctx.beginPath();for(let i=0;i<=n*2;i++){const a=i/(n*2)*Math.PI*2,r=i%2?1:1+amp;ctx.lineTo(cx+Math.cos(a)*rx*r,cy+Math.sin(a)*ry*r);}ctx.closePath();};
 // tail: waving behind; straight up and bristling when spooked
 ctx.strokeStyle=ol;
 if(puff>.3){const top=-18-48*puff;ctx.fillStyle=C.fur;ctx.lineWidth=2;ctx.beginPath();
  for(let i=0;i<=12;i++){const yy=-18+(top+18)*i/12,w=(i%2?7:11)*puff;ctx.lineTo(w,yy);}for(let i=12;i>=0;i--){const yy=-18+(top+18)*i/12,w=(i%2?7:11)*puff;ctx.lineTo(-w,yy);}ctx.closePath();ctx.fill();ctx.stroke();}
 else if(hook){const by=bow?-30:-22,tw=bow?Math.sin(ph*.6)*3:0;ctx.lineWidth=8.5;ctx.beginPath();ctx.moveTo(0,by);ctx.lineTo(tw,by-36);ctx.arc(tw+7,by-36,7,Math.PI,Math.PI*1.9);ctx.stroke();ctx.strokeStyle=C.fur;ctx.lineWidth=5.5;ctx.stroke();}
 else{const tw=Math.sin(ph*.5)*8;ctx.lineWidth=8.5;ctx.beginPath();ctx.moveTo(0,-18);ctx.quadraticCurveTo(14+tw,-34,8+tw,-52);ctx.stroke();ctx.strokeStyle=C.fur;ctx.lineWidth=5.5;ctx.stroke();}
 // legs: running, or stiff and straight when spooked
 for(const [lx,ph2] of [[-12,1],[12,-1],[-6,-1],[6,1]]){const l=legA*ph2;ctx.fillStyle=C.dark;ctx.strokeStyle=ol;ctx.lineWidth=1.6;
  if(puff>.3){ctx.fillRect(lx*1.25-2.5,-8,5,12);ctx.strokeRect(lx*1.25-2.5,-8,5,12);}else{ctx.beginPath();ctx.ellipse(lx,-3+(l>0?-l*.6:0),5,4.5,0,0,7);ctx.fill();ctx.stroke();}}
 // body: spiked out when spooked; rear up behind the head in the play-bow; humped in the arch
 ctx.fillStyle=C.fur;ctx.strokeStyle=ol;ctx.lineWidth=2.2;const by=bow?-30:-14,bry=pose==='arch'?16:13;
 if(puff>.05)spiky(0,by-1,18,bry+1,11,.32*puff);else{ctx.beginPath();ctx.ellipse(0,by,17,bry,0,0,7);}ctx.fill();ctx.stroke();
 if(bow||pose==='leap'){ctx.fillStyle=C.light;ctx.strokeStyle=ol;ctx.lineWidth=1.6;for(const sx of [-1,1]){ctx.beginPath();ctx.ellipse(sx*(bow?15:13),bow?-2:-30,6.5,5,sx*.3,0,7);ctx.fill();ctx.stroke();}}
 if(dir>0&&!bow){ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(0,-11,9,8,0,0,7);ctx.fill();}
 // head (low between the front paws in the play-bow)
 const hy=bow?-16:dir>0?-32:-30,ew=Math.max(puff,bow?.8:0);ctx.fillStyle=C.fur;ctx.strokeStyle=ol;ctx.lineWidth=2.2;
 ctx.beginPath();ctx.moveTo(-15,hy-4);ctx.lineTo(-13-3*puff,hy-20-3*puff);ctx.lineTo(-4,hy-11);ctx.closePath();ctx.fill();ctx.stroke();
 ctx.beginPath();ctx.moveTo(15,hy-4);ctx.lineTo(13+3*puff,hy-20-3*puff);ctx.lineTo(4,hy-11);ctx.closePath();ctx.fill();ctx.stroke();
 if(puff>.05)spiky(0,hy,16,13.5,10,.22*puff);else{ctx.beginPath();ctx.ellipse(0,hy,16,13.5,0,0,7);}ctx.fill();ctx.stroke();
 // tabby stripes on the crown
 ctx.strokeStyle=C.dark;ctx.lineWidth=2.4;for(const sx of [-5,0,5]){ctx.beginPath();ctx.moveTo(sx,hy-12.5);ctx.lineTo(sx*.8,hy-7);ctx.stroke();}
 if(dir>0){ctx.fillStyle='#ffb3c4';ctx.beginPath();ctx.moveTo(-12,hy-7);ctx.lineTo(-11.5,hy-16);ctx.lineTo(-6.5,hy-10);ctx.fill();ctx.beginPath();ctx.moveTo(12,hy-7);ctx.lineTo(11.5,hy-16);ctx.lineTo(6.5,hy-10);ctx.fill();
  ctx.fillStyle=C.light;ctx.beginPath();ctx.ellipse(0,hy+5,8.5,6,0,0,7);ctx.fill();
  // eyes: big and round; squeezed shut in the skid; wide with tiny pupils when spooked
  if(skid>0&&skid<1){ctx.strokeStyle=ol;ctx.lineWidth=2;for(const ex of [-6,6]){ctx.beginPath();ctx.moveTo(ex-3.5,hy-2);ctx.lineTo(ex+3.5,hy);ctx.lineTo(ex-3.5,hy+2);ctx.stroke();}}
  else for(const ex of [-6.5,6.5]){ctx.fillStyle='#fff';ctx.strokeStyle=ol;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(ex,hy-1,4.6+1.4*ew,5.2+1.4*ew,0,0,7);ctx.fill();if(puff>.3)ctx.stroke();
   ctx.fillStyle='#1b1b1b';ctx.beginPath();ctx.ellipse(ex,hy,2.9-1.6*puff,3.8-2.2*puff,0,0,7);ctx.fill();if(puff<.3){ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(ex+1.2,hy-1.6,1.2,0,7);ctx.fill();}}
  ctx.fillStyle='#ff7a96';ctx.beginPath();ctx.moveTo(-2.2,hy+3);ctx.lineTo(2.2,hy+3);ctx.lineTo(0,hy+5.4);ctx.fill();
  ctx.strokeStyle=ol;ctx.lineWidth=1.3;
  if(puff>.3){ctx.beginPath();ctx.ellipse(0,hy+8,2.6,2.2,0,0,7);ctx.fillStyle='#5a1a1a';ctx.fill();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(0,hy+5.4);ctx.quadraticCurveTo(-2.5,hy+8.5,-4.5,hy+6.8);ctx.moveTo(0,hy+5.4);ctx.quadraticCurveTo(2.5,hy+8.5,4.5,hy+6.8);ctx.stroke();}}
 ctx.restore();}
function z72Draw(){const X=Z72X;if(!X)return;ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);const t=X.t;
 // the pusher: speed streaks on its top and a warm glow on its face each stroke
 const a=Math.min(1,t/.25,(Z72.dur-t)/.4);if(a>0){const ph=pushPhase/PUSH_PERIOD,moving=(ph>.08&&ph<.53)||ph>=.61,fwd=ph<.61;ctx.globalAlpha=a;
  const L=skyScreen(T.L+30,pusherY,22),R=skyScreen(T.R-30,pusherY,22);
  if(moving){ctx.strokeStyle='rgba(255,214,120,.85)';ctx.lineCap='round';for(let i=0;i<6;i++){const fx=(i+.5)/6,x=L.x+(R.x-L.x)*fx,len=(fwd?26:16)*L.s*(1+.4*Math.sin(t*30+i*2));ctx.lineWidth=2.6*L.s;ctx.beginPath();ctx.moveTo(x,L.y-4*L.s);ctx.lineTo(x,L.y-4*L.s-len);ctx.stroke();}}
  ctx.globalAlpha=a*(fwd&&moving?.45:.2);ctx.fillStyle='#ffb03a';ctx.fillRect(L.x,L.y-3*L.s,R.x-L.x,6*L.s);ctx.globalAlpha=1;}
 // the kittens, back to front so the nearer one overlaps; a shadow on the table, dust behind a running kitten
 const ks=X.kits.filter(k=>k.P&&!k.gone&&t>=k.t0).sort((p,q)=>p.P.z-q.P.z);
 for(const k of ks){const P=k.P,g=skyScreen(P.x,P.z,0),s=g.s*Z72.size/48*(P.grow||1)*(P.seg==='pop'?.55+.45*P.pop:1),alpha=P.fade!=null?P.fade:P.seg==='pop'?P.pop:1,sh=Math.max(.5,1-P.h/160);
  ctx.save();ctx.globalAlpha=alpha*.28*Math.max(.3,1-P.h/120);ctx.fillStyle='#000';ctx.beginPath();ctx.ellipse(g.x,g.y+2*s,24*s*sh,7*s*sh,0,0,7);ctx.fill();ctx.restore();
  if(P.ground&&alpha>0){ctx.save();for(let i=1;i<=3;i++){const d=skyScreen(P.x-(P.lean||0)*i*22+Math.sin(t*20+i+k.id)*5,P.z-(P.dir||1)*i*13,4);ctx.globalAlpha=alpha*.35*(1-i/4);ctx.fillStyle='#fff4dc';ctx.beginPath();ctx.arc(d.x,d.y,(5+i*2.2)*d.s,0,7);ctx.fill();}ctx.restore();}
  // spook jump: a burst of shock lines round the kitten as it shoots up
  if(P.seg==='spook'&&P.u<.35){const c=skyScreen(P.x,P.z,P.h+30);ctx.save();ctx.globalAlpha=alpha*(1-P.u/.35);ctx.strokeStyle='#fff';ctx.lineWidth=2.5*g.s;
   for(let i=0;i<6;i++){const an=-Math.PI/2+(i-2.5)*.42,r0=34*g.s,r1=(48+P.u*60)*g.s;ctx.beginPath();ctx.moveTo(c.x+Math.cos(an)*r0,c.y+Math.sin(an)*r0);ctx.lineTo(c.x+Math.cos(an)*r1,c.y+Math.sin(an)*r1);ctx.stroke();}ctx.restore();}
  const p=skyScreen(P.x,P.z,P.h);z72Kitten(p.x,p.y,s,k.coat,(t-k.t0)*22+k.id,P.dir,P.skid||0,alpha,P.lean||0,P.puff||0,P.rot||0,P.pose);}
 if(a>0){ctx.globalAlpha=a;wildText('2× PUSHER',200,w43ChinY()+28,26,'#ffb03a','#3a1400',5);}
 ctx.restore();}
// --- the power: the Orange cat's button now plays this Zoomies ---
const __z72Use=pgpUse;
pgpUse=function(){const cat=pgpCat(),P=PGP[cat];if(P.id!=='zoomies')return __z72Use();
 PG.powers[cat]=pgpCount(cat)-1;pgSave();stopDrops();try{diagEvent('powers','use '+P.id+' left='+PG.powers[cat]+' level='+pglSel());}catch(e){}
 callout(P.name+'!',{color:P.col,dur:1.4});try{navigator.vibrate&&navigator.vibrate([60,40,90]);}catch(e){}
 z72Start();PGPX={id:'zoomies72',t:0,dur:Z72.dur};};
const __z72PgpTick=pgpTick;
pgpTick=function(dt){const was=PGPX&&PGPX.id==='zoomies72'?PGPX:null;if(was){was.t+=dt;z72Tick(dt);if(was.t>=was.dur&&(Z72X.kits.every(k=>k.gone)||was.t>=was.dur+2))pgpEnd();return __z72PgpTick(0);}return __z72PgpTick(dt);};
const __z72PgpEnd=pgpEnd;pgpEnd=function(){const X=PGPX;if(X&&X.id==='zoomies72'){PGPX=null;z72Stop();return;}return __z72PgpEnd();};
const __z72Draw=pgpDraw;pgpDraw=function(){__z72Draw();if(Z72X)z72Draw();};
// the pusher's slide sound: the turbo version (higher, brighter, louder) while Zoomies runs
const __z72Slide=sfx.slide;sfx.slide=function(vol,dur,back,turbo){return __z72Slide.call(this,Z72X?vol*1.15:vol,dur,back,turbo||!!Z72X);};
const __z72SideGame=pgpSideGame;pgpSideGame=function(){return __z72SideGame()||!!Z72X;};
// what happened to the carried pieces (for the report): paid over the front, or lost over a side
const __z72Fall=typeof fallOff==='function'?fallOff:null;
if(__z72Fall){fallOff=function(b,...a){const X=Z72X;if(X&&!b.dead){const q=b.rb.translation(),side=Math.abs(q.x/M-200)>(T.R-T.L)/2-2&&q.z/M<T.FRONT-4;if(side)Z72.stats.anySide++;else if(q.z/M>=T.FRONT-30)Z72.stats.anyFront++;
  if(X.carry.some(o=>o.b===b))(side?Z72.stats.lostSide:Z72.stats.paid).push(b.id||b.kind);}return __z72Fall(b,...a);};}
// ---------- end CP-72 prototype ----------
