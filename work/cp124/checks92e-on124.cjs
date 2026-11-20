// CP-92 Endless board checks (real game, headless). Usage: node checks92e.cjs [release.html]  -> PASS/FAIL lines + checks92e-on124.json
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html'));const R=[];
const prodJ=path.resolve(__dirname,'../../phone/CatCoinPusher-game.json'),psha=()=>require('crypto').createHash('sha256').update(fs.readFileSync(prodJ)).digest('hex'),prod0=psha();
function check(name,ok,info){R.push({name,ok:!!ok,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
async function boot(storage={}){const g=await game({src,seed:5,storage});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.ticks(10);
 g.J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));return g;}
const drops=(g,n,gap=18)=>{for(let i=0;i<n;i++){g.run(`tryDrop({x:${Math.round(200+100*Math.sin(i*.7))},y:DROP_Y})`);g.ticks(gap);}};
(async()=>{
 // 0: the build is the published base + build name + the CP-92 block, nothing else
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp123/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='930b2d57683b64a3698ba2e180d8688ab746b0288008be9061532f8f44e9b993')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}{const O=fs.readFileSync(path.resolve(__dirname,'../cp107/cp87-puzzles.js'),'utf8'),N=fs.readFileSync(path.join(__dirname,'cp96-puzzles.js'),'utf8');if(B.split(O).length!==2)m=[];B=B.split(O).join(N);}
  check('0 the build is published 2026.11.19 UAT 123 + build name + the CP-87 block swapped for cp96-puzzles.js (everything else unchanged)',S===B&&m.length===1);}
 let g=await boot();
 // 1: start: wallet 100, no timer, no goal text, no round end
 g.run("PG.current=PGU.boardCat='tuxedo';endStart()");g.until("WILD.phase==='play'",600);const s1=g.J("{on:END.on,coins:S.coins,key:endKey(),msg:wildMessage()}");g.ticks(60*70);
 const s1b=g.J("{left:WILD.left,phase:WILD.phase,status:board.status,turbo:WILD.turbo}");
 check('1 endless start: 100 coins, First push, no goal message; after 70 s no clock run-down, no turbo, still playing',s1.on&&s1.coins===100&&s1.key==='L1'&&s1.msg===''&&s1b.left>=590&&s1b.phase==='play'&&s1b.status==='playing'&&!(s1b.turbo>0),{s1,s1b});
 // 2: the meter fills by coins played; the NEW BOARD tap sweeps (paying nothing) and the next board follows in order
 drops(g,60);const m=g.J('END.w.meter');g.run('END.w.meter=END.METER');g.until('endFree()',3000);const c0=g.J('S.coins'),rr=g.J('endRowRect()');g.tap(rr.x+rr.w/2,rr.y+rr.h/2);
 const sw=g.J('!!END.sweep');let maxC=c0;for(let i=0;i<330&&g.J('!!END.sweep');i++){g.tick();maxC=Math.max(maxC,g.J('S.coins'));}g.ticks(2); /* UAT 123: the pusher sweep (about 4.4 s) */
 const s2=g.J("{sweep:!!END.sweep,key:endKey(),meter:END.w.meter,phase:WILD.phase,status:board.status,coins:S.coins}");
 check('2 meter counts drops; NEW BOARD sweeps, pays nothing, next board in order (Line up), meter back to 0',m===60&&sw&&!s2.sweep&&s2.key==='L2'&&s2.meter===0&&s2.phase==='play'&&s2.status==='playing'&&maxC===c0&&s2.coins===c0,{m,c0,maxC,s2});
 // 3: the tap is refused when the meter isn't full
 g.tap(rr.x+rr.w/2,rr.y+rr.h/2);check('3 NEW BOARD tap refused before the meter is full',!g.J('!!END.sweep'));
 // 4: order: all 21 boards in order, then random from seen boards, never the current one
 const seq=[g.J('endKey()')];for(let i=0;i<19;i++){g.run('END.w.meter=END.METER;endStartSweep()');g.until('!END.sweep',600);g.ticks(2);seq.push(g.J('endKey()'));}
 const order=g.J('endOrder()');let rnd=[],repeat=false;for(let i=0;i<8;i++){const before=g.J('endKey()');g.run('END.w.meter=END.METER;endStartSweep()');g.until('!END.sweep',600);g.ticks(2);const k=g.J('endKey()');rnd.push(k);if(k===before)repeat=true;}
 check('4 first pass in order (10 levels, then 11 lab boards); after that random seen boards, never the same twice in a row',JSON.stringify(seq)===JSON.stringify(order.slice(1))&&order.length===21&&!repeat&&rnd.every(k=>order.includes(k)),{seq:seq.length,rnd});
 // 5: nearly empty board: the meter fills at once
 g.run("for(const b of [...bodies])if(!b.dead&&(b.kind==='coin'||b.kind==='silver'||b.kind==='gold5'))removeCoin(b);END.w.meter=0");g.ticks(120);
 check('5 a nearly empty board fills the meter within 2 s',g.J('END.w.meter')===g.J('END.METER'));
 // 6: empty wallet: no drops, the refill clock, +1 after 30 s, no round end
 g.run('S.coins=0;board.remaining=0;END.w.coins=0;END.w.t=Date.now()');g.ticks(10);const s6=g.J("{drop:tryDrop({x:200,y:DROP_Y}),msg:wildMessage(),clock:wildClock()}");g.ticks(60*31);
 const s6b=g.J("{coins:S.coins,phase:WILD.phase,status:board.status}");
 check('6 empty wallet: no drop, "Out of coins · +1 in 0:30", +1 after 30 s, no round end',s6.drop===false&&/^Out of coins/.test(s6.msg)&&s6.clock==='+1 0:30'&&s6b.coins===1&&s6b.phase==='play'&&s6b.status==='playing',{s6,s6b});
 // 7: Home leaves the mode, keeps the wallet; normal play is the level again (its own coins)
 g.run('S.coins=37;board.remaining=37');g.ticks(5);g.run('wildReset()');g.ticks(5);const s7=g.J("{on:END.on,saved:JSON.parse(localStorage.getItem(END.KEY)).coins,coins:S.coins,lvCoins:pglLevel().coins,phase:WILD.phase,screen:PGU.screen}");
 check('7 Home turns the endless board off, wallet saved (37), normal level rebuilt with its own coins',!s7.on&&s7.saved===37&&s7.coins===s7.lvCoins&&s7.screen==='main',s7);
 // 8: levels unchanged: a level round runs its clock, banks side coins per round (CP-88) and ends
 g.run("pgPlay('siamese');if(WILD.phase!=='card')wildReset();wildStartCountdown()");g.until("WILD.phase==='play'",600);const l0=g.J('WILD.left');g.ticks(120);const l1=g.J('WILD.left');
 g.run("{const b=addCoin('laser',null,200,COIN_HALF+.2,T.FRONT-5,yawTurn(0));fallOff(b,200);}");g.ticks(30);const bank1=g.J('CP88.bank.laser');g.run('wildReset()');g.ticks(3);
 check('8 levels unchanged: the clock runs down, a laser coin banks, a new round starts with an empty slot',!g.J('END.on')&&l1<l0-1.5&&bank1===1&&g.J('CP88.bank.laser')===0,{l0,l1,bank1});
 // 9: laser on the endless board: banked and kept across a new board, Home, and a fresh start of the app
 g.run("PG.current=PGU.boardCat='siamese';endStart()");g.until("WILD.phase==='play'",600);
 g.run("{const b=addCoin('laser',null,200,COIN_HALF+.2,T.FRONT-5,yawTurn(0));fallOff(b,200);}");g.ticks(30);const lb1=g.J('CP88.bank.laser');
 g.run('END.w.meter=END.METER;endStartSweep()');g.until('!END.sweep',600);g.ticks(2);const lb2=g.J('CP88.bank.laser');g.run('wildReset()');g.ticks(5);
 const store=g.J("localStorage.getItem(END.KEY)");g.close&&g.close();
 g=await boot({'catpusher.uat.cp92endless.v1':store});g.run("PG.current=PGU.boardCat='siamese';endStart()");g.until("WILD.phase==='play'",600);const lb3=g.J('CP88.bank.laser');
 check('9 endless laser: banks (1), kept after a new board, Home and an app restart',lb1===1&&lb2===1&&lb3===1,{lb1,lb2,lb3});
 // 10: fish and mouse start their game at once on the endless board (no banking), slot hidden
 g.run('wildReset()');g.ticks(5);g.run("PG.current=PGU.boardCat='orange';endStart()");g.until("WILD.phase==='play'",600);const hid=g.J('cp88Shown()');
 g.run("{const b=addCoin('fish',null,200,COIN_HALF+.2,T.FRONT-5,yawTurn(0));fallOff(b,200);}");let st=false;for(let i=0;i<300&&!st;i++){g.tick();st=g.J('!!(WILD.toss||WILD.tossPending)');}
 check('10 endless fish: no bank, Treat toss starts by itself; slot hidden',st&&g.J('CP88.bank.fish')===0&&hid===false,{hid,st});
 // 11: the side coin comes as the next bonus drop after 100 coins played, in the front part of the board
 g.run('wildReset()');g.ticks(5);g.run("PG.current=PGU.boardCat='tortie';endStart()");g.until("WILD.phase==='play'",600);
 g.run("endLoad().side=0;endLoad().coins=500;S.coins=500;board.remaining=500;WILD.incoming=WILD.incoming.filter(o=>o.kind!=='mousecoin');for(const b of [...bodies])if(!b.dead&&b.kind==='mousecoin')removeCoin(b)"); // the count is kept with the wallet: start it from 0 here
 // drop (a coin every 0.3 s) until 99 have counted, ask for a bonus drop, then one more coin and another bonus drop
 const mice="WILD.incoming.filter(o=>o.kind==='mousecoin').map(o=>Math.round(o.y)).concat(bodies.filter(b=>!b.dead&&b.kind==='mousecoin').map(b=>Math.round(b.rb.translation().z/M)))";
 let k=0;while(g.J('endLoad().side')<99&&k++<600)drops(g,1);g.run('wildScheduleBonus()');g.ticks(3);const n99=g.J(mice).length;
 while(g.J('endLoad().side')<100&&k++<700)drops(g,1);g.run('if(!WILD.pounce&&!WILD.pouncePending)wildScheduleBonus()');g.ticks(3);const inc=g.J(mice);
 check('11 side coin: none before 100 coins played; the next bonus drop after 100 is the mouse coin, landing at depth 600-680',n99===0&&inc.length===1&&inc[0]>=600&&inc[0]<=680,{n99,inc,side:g.J('END.w.side')});
 g.close&&g.close();
 check('12 production untouched (phone/CatCoinPusher-game.json unchanged during the run; app IDs and channels not touched by this block)',psha()===prod0&&!/com\.jenny\.catpusher|CatCoinPusher-game\.json/.test(fs.readFileSync(path.join(__dirname,'../cp119/cp92-endless.js'),'utf8')));
 const pass=R.filter(r=>r.ok).length;console.log(pass+'/'+R.length+' passed');
 const v=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'),'utf8')),out=path.resolve(__dirname,'../../tickets/CP-96-evidence/uat'+v.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
 fs.writeFileSync(path.join(out,'checks92e-on124.json'),JSON.stringify({build:src,passed:pass===R.length,passedN:pass,failed:R.filter(r=>!r.ok).map(r=>r.name),results:R},null,1));process.exit(pass===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(2);});
