// UAT 130: why the cat chip stays locked on the Ragdoll's endless board. Plays the Ragdoll on the endless board and logs lock reasons.
const {game}=require('../../cp43/harness.cjs'),path=require('path');
const src=path.resolve(process.argv[2]||'../../cp129/release.html'),SEC=+(process.argv[3]||240);
(async()=>{const g=await game({src,seed:6});g.run('S.muted=true;S.dev=false');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();PG.open.ragdoll=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.ticks(10);
 const J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));
 g.run("PG.current=PGU.boardCat='ragdoll';endLoad().coins=900;endStart();");g.until("WILD.phase==='play'",600);
 g.run(`globalThis.__why=function(){const r=[];if(!cp97On())r.push('off:'+WILD.phase+'/'+PGU.screen);if(typeof PGPX!=='undefined'&&PGPX)r.push('power');if(typeof CP86T!=='undefined'&&CP86T)r.push('cp86');
  if(typeof pgpSideGame==='function'&&pgpSideGame())r.push('side:'+pgpSideGame());for(const k of ['dance','dancePending','toss','tossPending','chase','chasePending','pounce','pouncePending','petGame','petPending','jp','jpPending'])if(WILD[k])r.push(k);
  if(END.sweep)r.push('sweep');if(sweepTime>0)r.push('sweepTime');if(catquakeTime>0)r.push('quake');
  for(const b of bodies)if(!b.dead&&CP97_COINS.includes(b.kind)){const p=b.rb.translation();r.push('coin:'+b.kind+'@'+Math.round(p.x/M||p.x)+','+Math.round(p.z/M||p.z));}
  for(const o of WILD.incoming)if(CP97_COINS.includes(o.kind))r.push('incoming:'+o.kind);if(typeof PAW40_STATE==='object'&&PAW40_STATE&&PAW40_STATE.swipe)r.push('paw40');return r;}`);
 console.log('mode',J('WILD.mode'),'cat',J('PGU.boardCat'),'cats',J('cp97Cats()'));
 const runs={};let last='';
 for(let s=0;s<SEC;s++){if(s===5)g.run("WILD.incoming.push({kind:'heart',id:null,x:200,y:640,t:.9,t0:.9});");if(s===8)console.log('heart',J("bodies.filter(b=>!b.dead&&b.kind==='heart').length"));for(let i=0;i<3;i++){g.run(`tryDrop({x:${Math.round(200+90*Math.sin(s*3+i))},y:DROP_Y})`);g.ticks(20);}
  const w=J('__why()').join(' ');const key=w.replace(/@[-\d,]+/g,'');runs[key]=(runs[key]||0)+1;if(w!==last&&s%1===0){console.log(s+'s',w||'FREE','| pet',J("[WILD.petGame&&{t:+WILD.petGame.t.toFixed(1),ph:WILD.petGame.phase,ww:WILD.petGame.winWaiting||0,L:WILD.petGame.L},WILD.petPending&&1,WILD.hearts,WILD.heartAt,S.coins]"));last=w;}}
 console.log("seconds by reason",JSON.stringify(runs));console.log("end",JSON.stringify(J("({rel:board.released,coins:S.coins,side:END.w.side,hearts:WILD.hearts,heartAt:WILD.heartAt,happy:WILD.happy,dances:WILD.dances,kinds:bodies.filter(b=>!b.dead).map(b=>b.kind).filter((k,i,a)=>a.indexOf(k)===i)})")));g.close&&g.close();process.exit(0);})().catch(e=>{console.error(e);process.exit(1)});
