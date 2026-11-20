// CP-92: coins back per 100 played on the endless board, and the table's coin count at the start of each layout.
// Each run: start the endless board on one layout (refill off), WARM drops to settle, then N drops at one every GAP ticks
// across the drop lane; return = (coins dropped + change in the wallet) / coins dropped over the measured part.
// Everything stays on as in play (prizes, bonus drops, rain, side games, powers left alone).
// Usage: KEYS=L1,L5 SEEDS=1,2 N=300 WARM=150 GAP=18 node measure.cjs [release.html]
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html'));
const KEYS=(process.env.KEYS||'L1,L4,L6,L9,lab:pins,lab:cup').split(','),SEEDS=(process.env.SEEDS||'1,2').split(',').map(Number);
const N=+(process.env.N||300),WARM=+(process.env.WARM||150),GAP=+(process.env.GAP||18),OUT=process.env.OUT||'';
async function run(key,seed){const g=await game({src,seed});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.ticks(10);
 g.run(`PG.current=PGU.boardCat='${process.env.CAT||'tuxedo'}';END.REFILL=1e9;endLoad().cur='${key}';endLoad().coins=100000;endStart()`);g.until("WILD.phase==='play'",600);g.ticks(10);
 const start=+g.run('endCoinsOnTable()');let i=0;
 const drop=()=>{g.run(`tryDrop({x:${Math.round(200+105*Math.sin(i*.77+seed))},y:DROP_Y})`);i++;g.ticks(GAP);};
 for(let k=0;k<WARM;k++)drop();
 const c0=+g.run('S.coins'),d0=+g.run('END.stats.dropped'),f0=+g.run('END.stats.credited'),p0=+g.run('END.stats.prizeCoins|0'),r0=+g.run('END.stats.rainCoins|0'),t0=+g.run('endCoinsOnTable()');
 for(let k=0;k<N;k++)drop();g.ticks(240);
 const r=JSON.parse(g.run('JSON.stringify({c:S.coins,d:END.stats.dropped,f:END.stats.credited,p:END.stats.prizeCoins|0,rc:END.stats.rainCoins|0,side:END.stats.side,table:endCoinsOnTable(),resets:END.stats.resets,auto:END.stats.auto,key:endKey()})'));
 const dropped=r.d-d0,ret=(dropped+r.c-c0)/dropped*100;g.close&&g.close();
 return {key,seed,start,dropped,per100:+ret.toFixed(1),frontCoinsPer100:+((r.f-f0)/dropped*100).toFixed(1),prizeCoinsPer100:+((r.p-p0)/dropped*100).toFixed(1),rainCoinsPer100:+((r.rc-r0)/dropped*100).toFixed(1),tableStart:t0,side:r.side,tableEnd:r.table,auto:r.auto,keyEnd:r.key};}
(async()=>{const rows=[];for(const k of KEYS)for(const s of SEEDS){const r=await run(k,s);rows.push(r);console.log(JSON.stringify(r));}
 const avg=rows.reduce((a,r)=>a+r.per100,0)/rows.length;console.log('MEAN per 100:',avg.toFixed(1));
 if(OUT)fs.writeFileSync(OUT,JSON.stringify({src,N,WARM,GAP,rows,mean:+avg.toFixed(1)},null,1));})().catch(e=>{console.error(e);process.exit(1);});
