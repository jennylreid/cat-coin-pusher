// ---------- CP-93 Giant tower board (Jenny, Nov 19: "a board where the pusher is twice as long and it has giant towers.
// I mean, really tall towers of coins sitting on top of it. And then you're dropping coins onto the pusher itself, which then
// push the coins forward"; "Maybe the coins need to be stacked so that they're not so stable.") ----------
// A Board lab board (UAT, Developer on, Home > Board lab). Only while it is the board being played:
//  - the pusher deck is about twice as long: its stroke runs further forward (PUSH_MIN/PUSH_MAX from the board's deck),
//    restored to the normal 190/260 whenever any other board is built or the Wild board is left;
//  - giant towers stand on the deck, built from loose segments (a short solid column of 3-6 coins each, as every tower in the
//    game is) stacked a little off-centre and leaning, so a shove makes the upper segments slide, lean and fall apart;
//  - segments here tip after a much shorter shove and break into coins in the Board 3 cascade (a wide, spinning spill).
// Dropped coins land on the deck behind the towers (the usual drop line); the back wall scrapes them forward on each
// return stroke, into the towers. Everything else (the frozen pickup, the other boards) is untouched.
const CP93={def:{min:190,max:260},stats:{built:0,broke:0,spilled:0},cfg:{seg:[3,6],off:7,clamp:14,lean:.08,vary:3,grip:1.2,slide:[2,5],tipV:2.4,knock:1.5,tilt:Math.cos(11*Math.PI/180)}};
function cp93L(){return LAB.on()&&WILD.on&&LAB.def()&&LAB.def().giant?LAB.def():null;}
function cp93Deck(L){const d=L&&L.deck?L.deck:CP93.def;PUSH_MIN=d.min;PUSH_MAX=d.max;}
Object.assign(LAB.B,{
 giant:{name:'Giant towers',tag:'Lab',coins:120,secs:240,extras:true,lab:{kind:'topple',n:3,text:'Spill all 3 giant towers',unit:'towers'},goal:[],star:null,
  // the deck: back at 350, out at 420 (normal 190/260): 160 to 230 of deck in front of the back wall (today 0 to 70)
  deck:{min:350,max:420},
  // three giant towers in a row on the deck, clear of where dropped coins land (depth 233-265), a prize on each top;
  // [x, depth, coins (+-3), prize]
  giant:{towers:[[128,328,28,'shrimp'],[200,321,36,'tuna'],[272,325,31,'cheese']],carpet:true},
  p:[],towers:[],rain:[['rain5',110,520],['rain5',290,520]],quake:[200,560]}});
LAB.ORDER.push('giant');
if(typeof LABH_ROUNDS!=='undefined')LABH_ROUNDS.push(['CP-93',['giant']]);
// the deck length: set before the board is built (resetBoard puts the pusher at PUSH_MIN), restored for every other board
{const __cp93Reset=wildReset;wildReset=function(){cp93Deck(LAB.on()&&LAB.def()&&LAB.def().giant?LAB.def():null);const r=__cp93Reset.apply(this,arguments);try{cp93Build();}catch(e){try{diagEvent('cp93','build '+e);}catch(_){}}return r;};}
{const __cp93Exit=wildExit;wildExit=function(){cp93Deck(null);return __cp93Exit.apply(this,arguments);};}
// (the base segment grips the deck (friction 1.2; coins 0.45, the deck 0.05) so a standing tower doesn't creep along the
// slippery deck on the stroke's starts and stops; it moves along the deck only when pushed)
// a giant tower: segments of 3-6 coins, each set off the one below (up to 7 each way, 14 in all) and leaning up to 4.6
// degrees, heights uneven (the layout's count +-3 each round)
// the towers' own random numbers (a fresh look each round; CP93.seed fixes it for tests)
function cp93R(){CP93.r=(CP93.r*16807)%2147483647;return (CP93.r-1)/2147483646;}
function cp93Tower(x,z,n,top,gi){const C=CP93.cfg;let y=TONGUE_H+.15,ox=0,oz=0,left=n,si=0,last=null;
 while(left>0){let k=C.seg[0]+Math.floor(cp93R()*(C.seg[1]-C.seg[0]+1));if(left-k<C.seg[0])k=left;k=Math.min(k,left);left-=k;
  if(si>0){ox+=(cp93R()*2-1)*C.off;oz+=(cp93R()*2-1)*C.off;ox=Math.max(-C.clamp,Math.min(C.clamp,ox));oz=Math.max(-C.clamp,Math.min(C.clamp,oz));}
  const half=stackHalf(k,null),a=cp93R()*Math.PI*2,lean=(cp93R()*.6+.4)*C.lean*(si?1:.3);
  const q={x:Math.cos(a)*Math.sin(lean/2),y:0,z:Math.sin(a)*Math.sin(lean/2),w:Math.cos(lean/2)};
  const s=addStack(x+ox,y+half+.05,z+oz,q,k,null,cp93R()*6);s.limit=1e9;s.cp93=gi;s.cp93Seg=si;if(si===0&&C.grip)s.rb.collider(0).setFriction(C.grip);
  y+=half*2+.1;si++;last=s;}
 if(top){const b=addCoin('item',top,x+ox,y+halfOf('item')+.6,z+oz,yawTurn(0));b.wild=true;b.cp93Top=gi;}
 return si;}
function cp93Build(){const L=cp93L();if(!L)return;const G=L.giant;CP93.r=CP93.seed||(1+Math.floor(Math.random()*2147483645));CP93.done={};Object.assign(CP93.stats,{built:0,broke:0,spilled:0});
 // clear the deck where the towers stand, then a loose carpet of coins on the deck around them (not on the drop line)
 for(const b of [...bodies]){if(b.dead)continue;const p=b.rb.translation(),x=p.x/M,z=p.z/M;if(z<PUSH_MIN+COIN_R&&z>LEDGE_BACK-20&&b.kind!=='stack')removeCoin(b);}
 if(G.carpet){const d=COIN_R*2+1;for(let z=LEDGE_BACK+COIN_R+3;z<=PUSH_MIN-COIN_R-2;z+=d)for(let x=200-PUSH_HALF+COIN_R+2;x<=200+PUSH_HALF-COIN_R-2;x+=d){
   if(G.towers.some(t=>Math.hypot(t[0]-x,t[1]-z)<COIN_R*2+4))continue;addCoin(seededRandom()<.25?'silver':'coin',null,x,TONGUE_H+COIN_HALF+.3,z,yawTurn(seededRandom()*6));}}
 CP93.t0b=time;CP93.tw=G.towers.map(()=>({slide:0,limit:CP93.cfg.slide[0]+cp93R()*(CP93.cfg.slide[1]-CP93.cfg.slide[0]),tipped:false}));
 G.towers.forEach(([x,z,n,top],gi)=>{CP93.stats.built+=cp93Tower(x,z,n+Math.round((cp93R()*2-1)*CP93.cfg.vary),top,gi);});}
// The game's own rule (a tower tips once it has been shoved a few units) counts riding along on the deck as a shove, so it is
// off for these segments (limit 1e9). A loose stack of segments this tall rocks a little more on every stroke until it falls
// by itself, so a tower holds together while it stands: its upper segments move with its base (their offsets and lean are
// kept). It is let go, and from then on is plain physics (it comes apart within a second or so), when:
//  - its base has slid forward along the deck by its own 2-5 units (pushed by the coins the back wall scrapes off), or
//  - its base runs off the front of the deck (the base's centre within 6 of the deck's front edge, or the base leaning), or
//  - something knocks one of its segments (a speed more than 1.5 m/s off its base's, from 2 s after the board is built), or one of its segments breaks.
// (Held: once settled, half a second after the board is built, each upper segment and the prize on top keep their place
// and turn relative to the base, so the tower can't creep or curl over a long round, and the prize rides it.)
// When it is let go by a slide or the edge it is also given a forward turn over its base (each segment a forward speed in
// proportion to its height), so it falls forward over the front of the deck and spills onto the table.
function cp93Let(gi,turn,why){const T9=CP93.tw[gi];if(T9.tipped)return;T9.tipped=true;T9.why=why;CP93.stats[why]=(CP93.stats[why]||0)+1;
 const segs=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93===gi);for(const b of segs)if(b.cp93Seg===0)b.rb.collider(0).setFriction(COIN_FRICTION);if(!turn||!segs.length)return;
 const y0=TONGUE_H,top=Math.max(...segs.map(b=>b.rb.translation().y/M+b.half))-y0;
 for(const b of segs){const h=b.rb.translation().y/M-y0,v=b.rb.linvel(),k=CP93.cfg.tipV*h/top;b.rb.wakeUp();b.rb.setLinvel({x:v.x,y:v.y,z:v.z+k},true);b.rb.setAngvel({x:CP93.cfg.tipV/(top*M),y:0,z:0},true);}}
function cp93Slide(dDeck){if(!CP93.tw)return;for(let gi=0;gi<CP93.tw.length;gi++){const T9=CP93.tw[gi];if(T9.tipped)continue;
  const segs=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93===gi);const base=segs.find(b=>b.cp93Seg===0);if(!base||segs.length<2){cp93Let(gi,false,'gone');continue;}
  const t=base.rb.translation(),z=t.z/M,bv=base.rb.linvel();
  if(z>pusherY-6||qrot(base.rb.rotation(),{x:0,y:1,z:0}).y<Math.cos(4*Math.PI/180)){cp93Let(gi,true,'edge');continue;}
  if(T9.rel0==null){if(time>(CP93.t0b||0)+.5)T9.rel0=z-pusherY;}else T9.slide=(z-pusherY)-T9.rel0; // net slide along the deck since it settled
  if(T9.slide>T9.limit){cp93Let(gi,true,'slide');continue;}
  let hit=false;for(const b of segs){if(b===base)continue;const v=b.rb.linvel();if(Math.hypot(v.x-bv.x,v.z-bv.z)>CP93.cfg.knock){hit=true;break;}}
  if(hit&&time>(CP93.t0b||0)+2){cp93Let(gi,false,'knock');continue;}
  const settled=time>(CP93.t0b||0)+.5;
  const prize=bodies.find(b=>!b.dead&&b.cp93Top===gi);
  for(const b of prize?[...segs,prize]:segs){if(b===base)continue;
   if(settled&&!b.cp93Off){const p=b.rb.translation();b.cp93Off={x:p.x-t.x,y:p.y-t.y,z:p.z-t.z};b.cp93Rot={...b.rb.rotation()};}
   if(b.cp93Off){b.rb.setTranslation({x:t.x+b.cp93Off.x,y:t.y+b.cp93Off.y,z:t.z+b.cp93Off.z},true);b.rb.setRotation(b.cp93Rot,true);}
   b.rb.setLinvel({x:bv.x,y:b.cp93Off?bv.y:Math.min(b.rb.linvel().y,bv.y),z:bv.z},true);b.rb.setAngvel({x:0,y:0,z:0},true);}}}
{const __cp93Slide=step;step=function(){const p0=pusherY;const r=__cp93Slide();try{if(cp93L())cp93Slide(pusherY-p0);}catch(e){}return r;};}
// a segment breaks at a smaller lean on this board (11 degrees; normal towers 14)
{const __cp93Update=update;update=function(dt){try{if(cp93L()){const go=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null&&!b.rb.isSleeping()&&qrot(b.rb.rotation(),{x:0,y:1,z:0}).y<CP93.cfg.tilt);for(const b of go)if(!b.dead)breakStack(b);}}catch(e){}return __cp93Update(dt);};}
// the spill: a segment breaks into its coins in the Board 3 cascade (each coin keeps the segment's spin, scattered and turning)
{const __cp93Break=breakStack;breakStack=function(b){if(!(b&&b.cp93!=null&&cp93L()))return __cp93Break(b);
  CP93.stats.broke++;if(CP93.tw&&CP93.tw[b.cp93]&&!CP93.tw[b.cp93].tipped)cp93Let(b.cp93,false,'break');if(!CP93.done[b.cp93]){CP93.done[b.cp93]=1;CP93.stats.spilled++;const L=LAB.def();if(board.status==='playing'&&LAB.st.got<L.lab.n)labScore(b.rb.translation().x/M);}
  if(b.dead)return;const t=b.rb.translation(),q=b.rb.rotation(),lv=b.rb.linvel(),av=b.rb.angvel();removeCoin(b);
  for(const part of stackParts(b)){const o=qrot(q,part.p);
   const spin={x:(av.y*o.z-av.z*o.y)*M,y:(av.z*o.x-av.x*o.z)*M,z:(av.x*o.y-av.y*o.x)*M},jx=(seededRandom()*.3-.15)*4,jz=(seededRandom()*.3-.15)*2;
   const turn={x:av.x*.25+(seededRandom()-.5)*3.6,y:av.y*.25+(seededRandom()-.5)*3.6,z:av.z*.25+(seededRandom()-.5)*3.6};
   const ang=(seededRandom()-.5)*.7,ax=seededRandom()*Math.PI*2,loose={x:Math.cos(ax)*Math.sin(ang/2),y:0,z:Math.sin(ax)*Math.sin(ang/2),w:Math.cos(ang/2)};
   const nb=addCoin(part.kind,null,t.x/M+o.x,t.y/M+o.y,t.z/M+o.z,qmul(qmul(q,part.q),loose),{x:lv.x*.3+spin.x*.35+jx,y:lv.y*.3+spin.y*.35,z:lv.z*.3+spin.z*.35+jz},turn);nb.cp93Spill=time;}
  if(!recordedSfx.play('spill',.8))sfx.tumble(b.n);};}
// drawing: the pusher is the cat's tongue, so a tower standing on it is in front of the face. The head is painted over the
// back of the board (its lower edge is at CHIN_Y), so on this board everything in front of the back wall that reaches up
// into the head's area is painted again over the head, in the usual back-to-front order, clipped to the head's area (below
// it the normal pass already has the right order). Nothing changes on any other board.
{const __cp93Lost=drawLostPrizes;drawLostPrizes=function(){try{if(cp93L()){const yb=CHIN_Y+HEAD_DROP+(typeof quakeHeadOffset==='function'?quakeHeadOffset():0)+2;
   const list=bodies.filter(b=>{if(b.dead||b.danceDown)return false;const t=b.rb.translation(),z=t.z/M;if(z-b.r<LEDGE_BACK-.5)return false;const top=t.y/M+(b.kind==='stack'?b.half:0)+b.r*.6;return screenOf(t.x/M,z,top).y<yb;});
   if(list.length){ctx.save();ctx.beginPath();ctx.rect(-1000,-3000,3000,yb+3000);ctx.clip();ctx.setTransform(...__camera);const prev=__activeCoinClip;__activeCoinClip='felt';
    try{for(const b of coinPaintOrder(list))drawCoinOccluded(b);}finally{__activeCoinClip=prev;ctx.restore();}}}}catch(e){}return __cp93Lost.apply(this,arguments);};}
// CP-37 (coins above the chin line are slid forward, out from under the face) would push the tower-top prizes off; on this
// board they are painted over the face, and a held tower's prize is held with it (above), so it rides until its tower goes.
