// --- the title screen (Jenny, Nov 14): "CatCoin" drops in letter by letter (a clink each), coins rain, the Tuxedo pops
// up and meows, a little jingle. UAT 54 (Jenny: "keep it open and then allow the player to tap to play"): after the intro
// (PG_TITLE_INTRO s) it stays, alive (rays turning, letters bobbing, the cat looking around and smiling now and then, the
// rain going on), until a tap on TAP TO PLAY. Taps during the intro are ignored so it always plays out. The coin rain is
// the board's own coin, bigger (22-34 px), slower and floatier, always behind the title and the cat.
const PG_TITLE_INTRO=1.9,PG_TITLE_WORD='CatCoin';
function pgEaseBack(u){const c=1.7;return 1+(c+1)*Math.pow(u-1,3)+c*Math.pow(u-1,2);}
function pgEaseBounce(u){const n=7.5625,d=2.75;if(u<1/d)return n*u*u;if(u<2/d)return n*(u-=1.5/d)*u+.75;if(u<2.5/d)return n*(u-=2.25/d)*u+.9375;return n*(u-=2.625/d)*u+.984375;}
function pgTitleTick(dt){const T0=PGU.title;T0.t+=dt;
 const beats=[...[...PG_TITLE_WORD].map((c,i)=>[.3+i*.09+.3,'coin']),[1.15,'meow'],[1.5,'levelup']];
 while(T0.snd<beats.length&&T0.t>=beats[T0.snd][0]){pgSfx(beats[T0.snd][1],beats[T0.snd][1]==='coin'?.8:1);T0.snd++;}
 pgTitleCoinsTick(T0,dt);}
function pgTitleCoin(y){return {x:rand(24,376),y,vy:rand(70,120),r:rand(22,34),s:rand(0,6),vs:rand(1.6,3.2),wf:rand(.8,1.6),wa:rand(8,18)};}
// ---- UAT 56: four coin rains to compare (Developer "Title coins: 1-4", default 2) ----
const PG_TC_KEY='catpusher.uat.titlecoins.v1';let PG_TC=2;try{const v=+localStorage.getItem(PG_TC_KEY);if(v>=1&&v<=4)PG_TC=v;}catch(e){}
function pgTitleFast(y){const c=pgTitleCoin(y);c.vy=rand(170,260);c.vs=rand(3,6);c.wa*=.5;return c;}
function pgTitleFloor(T0,x){const k=Math.max(0,Math.min(19,Math.floor(x/20)));return T0.floor[k];}
function pgTitleCoinsTick(T0,dt){const mode=T0.mode||(T0.mode=PG_TC);
 if(mode===1||mode===2){ // twice as fast as UAT 54, still spinning; 2 shows the coin's edge (drawn in code)
  if(!T0.seeded){T0.seeded=1;for(let i=0;i<5;i++)T0.coins.push(pgTitleFast(-40-i*90));}
  if(T0.coins.length<18&&Math.random()<dt*6)T0.coins.push(pgTitleFast(-40));
  for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.y+=c.vy*dt;c.vy=Math.min(c.vy+90*dt,380);c.x+=Math.sin(T0.t*c.wf+c.s)*c.wa*dt;if(c.y>H+50)T0.coins.splice(i,1);}return;}
 if(mode===3){ // fountain: bursts of coins from the bottom that arc up and fall back, like a jackpot
  T0.burstT=(T0.burstT||0)-dt;if(T0.burstT<=0&&T0.coins.length<34){T0.burstT=rand(.45,.8);const bx=rand(70,330),n=3+(Math.random()*3|0);
   for(let i=0;i<n;i++){const c=pgTitleCoin(H+30);c.x=bx+rand(-16,16);c.vx=rand(-150,150);c.vy=-rand(720,980);c.vs=rand(4,8);T0.coins.push(c);}}
  for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.x+=c.vx*dt;c.y+=c.vy*dt;c.vy+=900*dt;if(c.y>H+60&&c.vy>0)T0.coins.splice(i,1);}return;}
 // 4, pile-up: coins fall fast and land on a growing pile at the bottom, a clink each
 if(!T0.floor){T0.floor=Array.from({length:20},()=>pgBot()+6);T0.pile=[];T0.clinkT=0;}
 T0.clinkT-=dt;
 if(T0.pile.length<90&&T0.coins.length<14&&Math.random()<dt*7)T0.coins.push(pgTitleFast(-40));
 for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.vy=Math.min(c.vy+600*dt,520);c.y+=c.vy*dt;const fl=pgTitleFloor(T0,c.x)-c.r*.45;
  if(c.y>=fl){c.y=fl;c.f=rand(.5,.62);c.tilt=rand(-.25,.25);T0.pile.push(c);T0.coins.splice(i,1);const k=Math.floor(c.x/20);for(let j=k-1;j<=k+1;j++)if(j>=0&&j<20)T0.floor[j]=Math.min(T0.floor[j],c.y-(j===k?11:6));
   if(T0.clinkT<=0){T0.clinkT=.07;pgSfx('coin',.35);}}}}
// A coin turning about its vertical axis with its thickness showing: the approved coin face (as it is), plus a gold edge
// drawn in code beside it, as wide as the coin's thickness times how far it has turned.
function pgThickCoin(csp,x,y,r,a){const c=Math.cos(a),sn=Math.sin(a),rx=Math.max(.06,Math.abs(c))*r,hs=csp.half*r/COIN_R,d=r*.3*sn;
 ctx.save();ctx.translate(x,y);
 if(Math.abs(d)>.4){const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff1a8');g.addColorStop(.45,'#d89a1c');g.addColorStop(1,'#7a4c04');ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(d,0,rx,r,0,0,7);ctx.fill();ctx.fillRect(Math.min(0,d),-r,Math.abs(d),2*r);
  ctx.strokeStyle='rgba(100,60,0,.45)';ctx.lineWidth=1;ctx.beginPath();for(let k=-r+3;k<r-1;k+=3.5){ctx.moveTo(Math.min(0,d),k);ctx.lineTo(Math.max(0,d),k);}ctx.stroke();}
 ctx.save();ctx.scale(rx/r,1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();
 if(Math.abs(c)<.5){ctx.globalAlpha=(.5-Math.abs(c))*.5;ctx.fillStyle='#3a2200';ctx.beginPath();ctx.ellipse(0,0,rx,r,0,0,7);ctx.fill();ctx.globalAlpha=1;}
 ctx.restore();}
function pgTitleSkip(){if(PGU.title.t>=PG_TITLE_INTRO){pgSfx('whoosh');pgTitleDone();}}
function pgTitleDone(){if(PGU.screen!=='title')return;PGU.screen='board';PGU.fade=.3;if(!WILD.on)pgPlay(pgPlayCat());try{diagEvent('progress','title done t='+PGU.title.t.toFixed(2));}catch(e){}}
function pgDrawTitle(){
 const T0=PGU.title,t=T0.t;
 if(ART.background){const cover=Math.max(W/ART.background.width,H/ART.background.height),bw=ART.background.width*cover,bh=ART.background.height*cover;ctx.drawImage(ART.background,(W-bw)/2,(H-bh)/2,bw,bh);}else{ctx.fillStyle='#1d1030';ctx.fillRect(0,0,W,H);}
 let gr=ctx.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(30,10,50,.55)');gr.addColorStop(1,'rgba(20,6,34,.9)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
 const ty=Math.max(pgTop()+120,H*.27);
 // slow rays behind the title
 ctx.save();ctx.translate(200,ty);ctx.rotate(t*.35);for(let i=0;i<12;i++){ctx.rotate(Math.PI/6);ctx.fillStyle=i%2?'rgba(255,210,63,.13)':'rgba(255,122,213,.08)';ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(-40,-H);ctx.lineTo(40,-H);ctx.fill();}ctx.restore();
 // coins raining, spinning
 const csp=sprite('coin'),mode=T0.mode||PG_TC;
 if(T0.pile)for(const c of T0.pile){const hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.tilt);ctx.scale(1,c.f);ctx.fillStyle='#8a5a06';ctx.beginPath();ctx.ellipse(0,c.r*.28/c.f,c.r,c.r,0,0,7);ctx.fill();ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();}
 if(mode!==1){for(const c of T0.coins)pgThickCoin(csp,c.x,c.y,c.r,c.s+t*c.vs);}
 else for(const c of T0.coins){const fl=Math.cos(c.s+t*c.vs),k=c.r/COIN_R,hs=csp.half*k;ctx.save();ctx.translate(c.x,c.y);
  ctx.scale(Math.max(.18,Math.abs(fl)),1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();} // UAT 58: no glow or glint (Jenny: halos)
 // the Tuxedo pops up from the bottom, then smiles
 const u=Math.min(1,Math.max(0,(t-.1)/.7)),hy=H+150-(H+150-H*.66)*pgEaseBack(u),face=(t>1.1&&t<2.3)||(t>3&&(t%6)<1.2)?'sweet':'calm';
 pgHead('tuxedo',200,hy+Math.sin(t*2.2)*4,340,face,{look:Math.sin(t*1.7)*.7,blink:((t+.5)%3)<.12?1:0});
 // the title, letter by letter
 const size=82;ctx.font='italic 900 '+size+'px Impact, "Arial Black", system-ui';const ws=[...PG_TITLE_WORD].map(ch=>ctx.measureText(ch).width),tot=ws.reduce((a,b)=>a+b,0)+4*(ws.length-1);
 let x=200-tot/2;ctx.textAlign='center';ctx.textBaseline='middle';
 [...PG_TITLE_WORD].forEach((ch,i)=>{const lt=t-(.3+i*.09),cx=x+ws[i]/2;x+=ws[i]+4;if(lt<0)return;const d=Math.min(1,lt/.3),y=ty-(1-pgEaseBounce(d))*300+(d>=1?Math.sin(t*3+i*.8)*4:0);
  const sq=d>=1&&lt<.42?1+.18*Math.sin((lt-.3)/.12*Math.PI):1;ctx.save();ctx.translate(cx,y);ctx.scale(sq,1/sq);ctx.rotate(Math.sin(t*2+i)*.04);
  wildText(ch,0,0,size,i<3?'#ffd23f':'#ff8ad8',i<3?'#4a1a00':'#3a0b2e',13);ctx.restore();});
 // "tap to play"
 if(t>=PG_TITLE_INTRO){const a=Math.min(1,(t-PG_TITLE_INTRO)/.3),k=1+.05*Math.sin(t*4.5),by=pgBot()-58;ctx.save();ctx.globalAlpha=a;ctx.translate(200,by);ctx.scale(k,k);
  uiRound(-96,-23,192,46,23,'rgba(0,0,0,.35)');uiRound(-96,-26,192,46,23,'#7dff6a','#fff6d0',3);ctx.font='italic 900 22px Impact, "Arial Black", system-ui';ctx.fillStyle='#0c3a12';ctx.fillText('TAP TO PLAY',0,-2);ctx.restore();}
 ctx.font='10px system-ui';ctx.fillStyle='rgba(255,255,255,.5)';ctx.textAlign='left';ctx.fillText(BUILD,8,pgBot()-6);}
