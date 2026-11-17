// Level 3 on UAT 70: all 5 prizes in, a dance whose bonus clock is frozen under one frame; she taps the beats, then keeps tapping.
const {game,level,play,SRC}=require('./common.cjs');
const ST="({left:+WILD.left.toFixed(2),ph:WILD.phase,st:board.status,got:WILD.got,coins:S.coins,eq:board.earnedQuakes,dance:WILD.dance?(WILD.dance.phase+'/'+(WILD.dance.stage||'')):null,held:!!WILD.winHeld,nb:+WILD.nextBonus.toFixed(3),bonusN:WILD.bonusN,sky:SKY.length,rainLeft:WILD.rainLeft,bodies:bodies.filter(b=>!b.dead).length,rainOnBoard:bodies.filter(b=>!b.dead&&RAIN[b.kind]).length,notes:bodies.filter(b=>!b.dead&&b.kind==='note').length,dances:WILD.danceN||0,errs:__errs.length})";
(async()=>{const seed=+process.argv[2]||5,mode=process.argv[3]||'bug',secs=+process.argv[4]||120,src=process.argv[5]||SRC;
 const g=await game(seed,src);level(g,2,3);play(g);
 let ms=()=>g.run('performance.now()');
 g.ticks(60*4);
 g.run("for(const id of WILD_COLLECTION.slice(0,4)){WILD.have[id]=true;}WILD.got=4;");
 g.run("WILD.danceForce=true");g.until('!!WILD.dance',600);
 if(mode==='bug')g.run('WILD.nextBonus=0.01');
 g.run("WILD.have[WILD_COLLECTION[4]]=true;WILD.got=5;wildFinish(true)");
 g.run("globalThis.__dn=0;const __ds=danceStart;danceStart=function(){__dn++;return __ds.apply(this,arguments)}");
 console.log('t0',JSON.stringify(g.J(ST)),'held',g.J('WILD.winHeld'));
 let sec=0,tk=0,lastTap=0;const coinHist=[];
 while(sec<secs){
  const D=g.J("WILD.dance?{ph:WILD.dance.phase,p0:WILD.dance.p0,beat:WILD.dance.beat,lat:WILD.dance.latency,now:danceNow()}:null");
  if(D&&(D.ph==='dance'||D.ph==='count')){const x=(D.now-D.p0-D.lat)/D.beat,k=Math.round(x);if(k>=0&&Math.abs(x-k)*D.beat<1/120&&tk-lastTap>10){g.tap(200,560);lastTap=tk;}}
  else if(tk%15===0)g.tap(80+Math.random()*240,560); // keeps tapping like she did
  g.tick();tk++;
  if(tk%60===0){sec++;const s=g.J(ST);s.dn=g.J('__dn');if(sec%5===0||sec<=2)console.log(sec,JSON.stringify(s));if(s.ph!=='play'){console.log('ENDED at',sec,s.st);break;}}
 }
})();
