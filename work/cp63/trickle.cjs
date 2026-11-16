// After a flood to the cap: what happens with no drops vs a slow trickle (one coin every GAP s) above the cap?
const {game}=require('../cp43/harness.cjs'),path=require('path'),SRC=process.env.SRC||'release.html';
const GAP=+(process.env.GAP||1),HARD=+(process.env.HARD||999),LV=+(process.env.LV||1),SEED=+(process.env.SEED||5);
(async()=>{const g=await game({src:path.resolve(SRC),seed:SEED});g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`PG.lv.passed=9;PG.lv.sel=${LV};wildReset();PGU.screen='board';pgStartRound();`);g.until("WILD.phase==='play'",900);
 g.run("globalThis.__falls=0;const fo=fallOff;fallOff=function(b,x){__falls++;return fo(b,x);};");
 const Y=+g.run('Math.round(hudLayout().headerBottom+60)');for(const x of [276,213,256,268,230,237,200,180,220]){g.pointer('pointerdown',x,Y);g.ticks(150);g.pointer('pointerup',x,Y);}
 g.run(`WILD.left=60;if(typeof cp48Full==='function')cp48Full=function(){return w43PlainCount()>=${HARD};}`);// past the cap: drops allowed up to HARD
 const out=[];let k=0;const f0=+g.run('__falls');
 for(let s=0;s<30&&g.run("WILD.phase==='play'");s++){if(GAP>0&&s%GAP===0){k=g.run(`lastDrop=-99;tryDrop({x:${Math.round(200+100*Math.sin(s*1.3))},y:DROP_Y})`);}g.ticks(60);if(s%5===4)out.push(k+":"+g.run("w43PlainCount()+'g'+bodies.filter(b=>!b.dead&&b.kind==='gold5').length+' '+board.status+' '+WILD.phase")+'/f'+(+g.run('__falls')-f0));}
 console.log('GAP',GAP,'HARD',HARD,'L'+LV,out.join(' '),'bank',g.run('S.coins'));})();
