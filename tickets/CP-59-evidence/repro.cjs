const {game,level,play}=require('./common.cjs');
const ST="({left:+WILD.left.toFixed(2),ph:WILD.phase,st:board.status,got:WILD.got,coins:S.coins,eq:board.earnedQuakes,dance:WILD.dance?(WILD.dance.phase+'/'+(WILD.dance.stage||'')):null,held:!!WILD.winHeld,nb:+WILD.nextBonus.toFixed(3),bonusN:WILD.bonusN,inc:WILD.incoming.length,sky:SKY.length,rainLeft:WILD.rainLeft,rained:WILD.rained,bodies:bodies.filter(b=>!b.dead).length,rainOnBoard:bodies.filter(b=>!b.dead&&RAIN[b.kind]).length,items:bodies.filter(b=>!b.dead&&b.kind==='item').length,quakeCoins:bodies.filter(b=>!b.dead&&b.kind==='quake').length,errs:__errs.length})";
(async()=>{const seed=+process.argv[2]||5,mode=process.argv[3]||'bug',secs=+process.argv[4]||60;
 const g=await game(seed);level(g,2,3);play(g);
 g.ticks(60*4); // 4 s of play
 // all five prizes collected already (as in her screenshots) — optional
 if(process.argv[5]==='won')g.run("for(const id of WILD_COLLECTION){WILD.have[id]=true;}WILD.got=WILD_GOAL-1;");
 g.run("WILD.danceForce=true");g.until('!!WILD.dance',600);
 if(mode==='bug')g.run('WILD.nextBonus=0.01');
 console.log('t0',JSON.stringify(g.J(ST)));
 if(process.argv[5]==='won'){g.run("WILD.got=WILD_GOAL;wildFinish(true)");console.log('win attempted', JSON.stringify(g.J("({held:WILD.winHeld,ph:WILD.phase})")));}
 for(let s=1;s<=secs;s++){g.ticks(60);if(s%5===0||s<=3)console.log(s,JSON.stringify(g.J(ST)));if(g.run('WILD.phase')!=='play'){console.log('ENDED at',s);break;}}
})();
