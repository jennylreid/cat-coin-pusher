// CP-92 smoke: start the endless board, drop, reset, home. Usage: node smoke.cjs [release.html]
const {game}=require('../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html'));
(async()=>{const g=await game({src,seed:3,render:false});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 g.ticks(10);const J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));
 console.log('home',J("{screen:PGU.screen,btn:endBtn(),lab:typeof labhBtn==='function'?labhBtn():null}"));
 g.run('endStart()');console.log('after start',J("{on:END.on,wild:WILD.on,phase:WILD.phase,coins:S.coins,key:endKey(),name:endName(),screen:PGU.screen,coll:WILD_COLLECTION}"));
 g.until("WILD.phase==='play'",600);g.ticks(30);
 console.log('play',J("{phase:WILD.phase,left:WILD.left,coins:S.coins,table:endCoinsOnTable(),clock:wildClock(),msg:wildMessage()}"));
 let c0=+g.run('S.coins');for(let i=0;i<120;i++){g.run(`tryDrop({x:${Math.round(200+100*Math.sin(i*.7))},y:DROP_Y})`);g.ticks(20);}
 g.ticks(300);console.log('after 120 drops',J("{coins:S.coins,meter:END.w.meter,stats:END.stats,phase:WILD.phase,status:board.status,table:endCoinsOnTable()}"));
 g.run('END.w.meter=END.METER');g.until('endFree()',3000);console.log('free',g.run('endFree()'),'ready',g.run('endReady()'));
 const rr=J('endRowRect()');g.tap(rr.x+rr.w/2,rr.y+rr.h/2);console.log('sweep',J('!!END.sweep'));
 g.ticks(130);console.log('after sweep',J("{sweep:!!END.sweep,key:endKey(),name:endName(),seen:END.w.seen,meter:END.w.meter,phase:WILD.phase,status:board.status,coins:S.coins,table:endCoinsOnTable(),bodies:bodies.filter(b=>!b.dead).length}"));
 const starts={};starts[J('endKey()')]=J('endCoinsOnTable()');for(let i=0;i<20;i++){g.run('END.w.meter=END.METER;endStartSweep()');g.ticks(120);starts[J('endKey()')]=J('endCoinsOnTable()');}console.log('start coins',JSON.stringify(starts));
 console.log('after 20 more resets',J("{key:endKey(),seen:END.w.seen.length,order:endOrder().length,phase:WILD.phase,lab:LAB.on(),err:null}"));
 g.run('S.coins=0;board.remaining=0;END.w.coins=0;END.w.t=Date.now()');g.ticks(10);
 console.log('empty',J("{drop:tryDrop({x:200,y:DROP_Y}),msg:wildMessage(),clock:wildClock(),phase:WILD.phase,status:board.status}"));
 g.ticks(60*31);console.log('after 31 s',J("{coins:S.coins,w:END.w.coins,clock:wildClock()}"));
 g.ticks(60*8);console.log('still play after 8s empty-ish',J("{phase:WILD.phase,status:board.status}"));
 g.run("wildReset()");g.ticks(5);console.log('home',J("{on:END.on,coins:S.coins,w:END.w.coins,saved:JSON.parse(localStorage.getItem(END.KEY)).coins,phase:WILD.phase}"));
 g.close&&g.close();})().catch(e=>{console.error(e);process.exit(1);});
