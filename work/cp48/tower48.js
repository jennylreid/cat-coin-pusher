// ---------- CP-44 Tower wall mode (UAT 48) ----------
// Wild 2's board and goal with a wall of five tall coin towers side by side across the board, a prize perched on each
// (the round's star prize on the middle, tallest one). Towers topple sideways a lot once shoved, so a top prize often
// goes over a side edge: Paw save (CP-40) makes that a skill moment. The Dance break stays as in Wild 2.
const TW={z:470,gap:58,heights:[13,18,23,18,13],limit:[3,7],side:1.1};
const TW_KEY='catpusher.uat.towerwall.v1';
try{const d=JSON.parse(localStorage.getItem(TW_KEY)||'null');if(d&&Number.isFinite(+d.side))TW.side=Math.min(3,Math.max(0,+d.side));}catch(e){}
registerWildMode({id:'towers',name:'TOWER WALL',blurb:'Topple the towers, win the prizes on top',
 colors:['#ffb23f','#3a1d00','#4a2a10'],panel:['#5c3a1f','#24140a'],features:{towerwall:true,dance:true},
 // six lines, as on the Wild 2 card (its layout counts W2_CARD_LINES)
 cardLines:[['tower','Five towers, a prize on each','Shove them over!'],['paw','Prizes topple off the sides','Tap the glow to Paw save'],
  ['meter','Prizes fill the happy meter','and the cat dances!'],['visitor','Win','and a cat comes to visit'],['rain10','Rain coins pour','5, 10 or 25 coins'],['!','Bonus drops','fall from the sky']],
 icon(x,y){twIcon(x,y,1);},
 cardIcon(kind,x,y){
  if(kind==='tower'){twIcon(x,y+4,.7);return true;}
  if(kind==='paw'){const w=34,h=w*ART.paw.height/ART.paw.width;ctx.drawImage(ART.paw,x-w/2,y-h/2,w,h);return true;}
  return false;}
});
// three little coin towers with a prize on the middle one (menu and goal-card icon)
function twIcon(x,y,k){ctx.save();ctx.translate(x,y);ctx.scale(k,k);
 for(const [dx,n] of [[-14,4],[0,6],[14,4]])for(let i=0;i<n;i++){const cy=14-i*5;ctx.fillStyle='#a8740c';ctx.beginPath();ctx.ellipse(dx,cy+1.5,7,3,0,0,7);ctx.fill();ctx.fillStyle='#f5c632';ctx.beginPath();ctx.ellipse(dx,cy,7,3,0,0,7);ctx.fill();}
 drawPrize('item','tuna',0,-14,16/prizeWidth('tuna',1));ctx.restore();}
function twOn(){return WILD.on&&wildFeature('towerwall');}
// The wall: the Wild 2 prefill, then its towers swapped for five side by side, and five of its prizes moved on top.
const __twPrefill=wildPrefill;
wildPrefill=function(){__twPrefill();if(!twOn())return;
 for(const b of [...bodies])if(!b.dead&&b.kind==='stack')removeCoin(b);
 const xs=[-2,-1,0,1,2].map(i=>200+i*TW.gap);
 for(const b of [...bodies]){if(b.dead||b.kind==='stack'||b.kind==='item')continue;const p=b.rb.translation();if(!xs.some(x=>Math.hypot(p.x/M-x,p.z/M-TW.z)<COIN_R*1.9+b.r))continue;
  if(b.kind==='coin'||b.kind==='silver')removeCoin(b);else b.rb.setTranslation({x:p.x,y:p.y,z:(TW.z+COIN_R*2+b.r+4)*M},true);} // rain and Quake coins step out of the way
 for(let i=0;i<5;i++){const t=addStack(xs[i],null,TW.z,null,TW.heights[i],null,seededRandom()*6);t.limit=TW.limit[0]+seededRandom()*(TW.limit[1]-TW.limit[0]);t.tw=true;t.twSlot=i;}
};
// The prizes go on top once the board has settled (resetBoard settles the physics after the prefill, and a prize
// put there earlier can slide off a tall tower while it settles): the star on the middle, tallest tower.
function twPlacePrizes(){const towers=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.tw).sort((a,b)=>a.twSlot-b.twSlot);if(!towers.length)return;
 const items=bodies.filter(b=>!b.dead&&b.kind==='item').sort((a,b)=>(b.id===WILD.star)-(a.id===WILD.star)||a.rb.translation().z-b.rb.translation().z);
 const order=[2,1,3,0,4].map(i=>towers.find(t=>t.twSlot===i)).filter(Boolean);
 for(let k=0;k<order.length&&k<items.length;k++){const t=order[k],p=t.rb.translation(),b=items[k];
  b.rb.setTranslation({x:p.x,y:p.y+(t.half+halfOf('item')+.6)*M,z:p.z},true);b.rb.setLinvel({x:0,y:0,z:0},true);b.rb.setAngvel({x:0,y:0,z:0},true);b.rb.setRotation(yawTurn(0),true);b.twTop=true;}
}
const __twReset=wildReset;wildReset=function(){const r=__twReset();if(twOn())twPlacePrizes();return r;};
// A mode starts after Wild 2's reset, so the board is rebuilt once the mode is set.
const __twModeEnter=wildModeEnter;
wildModeEnter=function(id){const r=__twModeEnter(id);if(r&&twOn())wildReset();return r;};
// Sideways topple: when a wall tower starts to tip, its top also gets a push toward the nearer side (the middle one
// either way), so it leans out over the board's edges more than forward.
const __twStep=step;
step=function(){__twStep();if(!twOn())return;
 for(const b of bodies){if(b.dead||b.kind!=='stack'||!b.tw||!b.tipping||b.twSide)continue;b.twSide=true;
  const t=b.rb.translation(),x=t.x/M,dir=Math.abs(x-200)<8?(Math.random()<.5?-1:1):Math.sign(x-200),k=b.rb.mass()*TW.side,top=qrot(b.rb.rotation(),{x:0,y:b.half*M,z:0});
  b.rb.applyImpulseAtPoint({x:dir*k,y:0,z:0},{x:t.x+top.x,y:t.y+top.y,z:t.z+top.z},true);
  try{diagEvent('towerwall','topple '+(dir<0?'left':'right'));}catch(e){}}
};
// Developer: the sideways push (0 = topples the way it is shoved, as on Wild).
function twDevHtml(){const b='min-width:52px;min-height:44px;background:#3a2d52;color:#f4ecff;border:1px solid #6b5a8a;border-radius:10px;font-size:22px';
 return '<div class="set" id="tw-dev"><h3><span>Tower wall</span><span>tuning</span></h3><div style="display:flex;align-items:center;gap:8px;margin:4px 0"><span style="flex:1">Sideways topple</span><button data-tw="-1" style="'+b+'">−</button><b style="min-width:36px;text-align:center">'+TW.side.toFixed(1)+'</b><button data-tw="1" style="'+b+'">+</button></div><button id="tw-start" class="wide">Tower wall: start a round now</button></div>';}
const __twDevHtml=wildDevHtml;wildDevHtml=function(){return __twDevHtml()+twDevHtml();};
const __twDevBind=wildDevBind;wildDevBind=function(panel){__twDevBind(panel);const box=panel.querySelector&&panel.querySelector('#tw-dev');if(!box)return;
 for(const btn of box.querySelectorAll('[data-tw]'))btn.onclick=()=>{TW.side=Math.min(3,Math.max(0,Math.round((TW.side+ +btn.dataset.tw*.1)*10)/10));try{localStorage.setItem(TW_KEY,JSON.stringify({side:TW.side}));diagEvent('towerwall-tuning','side='+TW.side);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};
 box.querySelector('#tw-start').onclick=()=>{panel.style.display='none';wildModeEnter('towers');};};
// A Paw save in this mode flicks the prize further in (TW.flick m/s, CP-40's own flick elsewhere), toward the middle,
// so a save isn't undone by the next tower toppling.
const TW_BASE_FLICK=PAW40.flick;TW.flick=4;
const __twTick=wildTick;wildTick=function(dt){PAW40.flick=twOn()?TW.flick:TW_BASE_FLICK;return __twTick(dt);};
