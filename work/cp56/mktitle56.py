# One-off: UAT 56 title coin variants in title56.js (Jenny, Nov 14: the coins float rather than fall, and they're flat).
# Developer "Title coins: 1-4" (default 2): 1 faster; 2 faster with the coin's edge showing as it turns; 3 fountain; 4 pile-up.
# The title fly-in and the cat's motion are frozen and not touched; the coins stay behind the title and the cat.
from pathlib import Path
p = Path(__file__).parent / 'title56.js'
s = p.read_text(encoding='utf-8')
def rep(a, b):
    global s
    assert s.count(a) == 1, a[:70]
    s = s.replace(a, b)
rep(""" if(!T0.seeded){T0.seeded=1;for(let i=0;i<4;i++)T0.coins.push(pgTitleCoin(-40-i*70));}
 if(T0.coins.length<18&&Math.random()<dt*3.4)T0.coins.push(pgTitleCoin(-40));
 for(let i=T0.coins.length-1;i>=0;i--){const c=T0.coins[i];c.y+=c.vy*dt;c.vy=Math.min(c.vy+45*dt,190);c.x+=Math.sin(T0.t*c.wf+c.s)*c.wa*dt;if(c.y>H+50)T0.coins.splice(i,1);}}
function pgTitleCoin(y){return {x:rand(24,376),y,vy:rand(70,120),r:rand(22,34),s:rand(0,6),vs:rand(1.6,3.2),wf:rand(.8,1.6),wa:rand(8,18)};}""",
""" pgTitleCoinsTick(T0,dt);}
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
function pgThickCoin(csp,x,y,r,a){const c=Math.cos(a),sn=Math.sin(a),rx=Math.max(.06,Math.abs(c))*r,hs=csp.half*r/COIN_R,d=r*.24*sn;
 ctx.save();ctx.translate(x,y);
 if(Math.abs(d)>.4){const g=ctx.createLinearGradient(0,-r,0,r);g.addColorStop(0,'#fff1a8');g.addColorStop(.45,'#d89a1c');g.addColorStop(1,'#7a4c04');ctx.fillStyle=g;
  ctx.beginPath();ctx.ellipse(d,0,rx,r,0,0,7);ctx.fill();ctx.fillRect(Math.min(0,d),-r,Math.abs(d),2*r);
  ctx.strokeStyle='rgba(100,60,0,.45)';ctx.lineWidth=1;ctx.beginPath();for(let k=-r+3;k<r-1;k+=3.5){ctx.moveTo(Math.min(0,d),k);ctx.lineTo(Math.max(0,d),k);}ctx.stroke();}
 ctx.save();ctx.scale(rx/r,1);ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();
 if(Math.abs(c)<.5){ctx.globalAlpha=(.5-Math.abs(c))*.5;ctx.fillStyle='#3a2200';ctx.beginPath();ctx.ellipse(0,0,rx,r,0,0,7);ctx.fill();ctx.globalAlpha=1;}
 if(c>.9){ctx.globalAlpha=(c-.9)*8;uiCircle(-rx*.35,-r*.35,r*.18,'#fffbe6');ctx.globalAlpha=1;}
 ctx.restore();}""")
rep(""" const csp=sprite('coin');for(const c of T0.coins){const fl=Math.cos(c.s+t*c.vs),k=c.r/COIN_R,hs=csp.half*k;ctx.save();ctx.translate(c.x,c.y);""",
""" const csp=sprite('coin'),mode=T0.mode||PG_TC;
 if(T0.pile)for(const c of T0.pile){const hs=csp.half*c.r/COIN_R;ctx.save();ctx.translate(c.x,c.y);ctx.rotate(c.tilt);ctx.scale(1,c.f);ctx.fillStyle='#8a5a06';ctx.beginPath();ctx.ellipse(0,c.r*.28/c.f,c.r,c.r,0,0,7);ctx.fill();ctx.drawImage(csp.cv,-hs,-hs,2*hs,2*hs);ctx.restore();}
 if(mode!==1){for(const c of T0.coins)pgThickCoin(csp,c.x,c.y,c.r,c.s+t*c.vs);}
 else for(const c of T0.coins){const fl=Math.cos(c.s+t*c.vs),k=c.r/COIN_R,hs=csp.half*k;ctx.save();ctx.translate(c.x,c.y);""")
p.write_text(s, encoding='utf-8')
print('ok')
