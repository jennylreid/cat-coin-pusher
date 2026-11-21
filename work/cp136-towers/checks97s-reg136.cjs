// UAT 136 regression copy of work/cp134-bundle/checks97s-reg134.cjs (make-reg.py).
const __SELF=__dirname,__D130=require('path').resolve(__dirname,'../cp130');const __ok131=(()=>{const fs=require('fs'),c=require('crypto'),p=require('path');const m=JSON.parse(fs.readFileSync(p.join(__SELF,'publication-manifest.json'),'utf8'));return c.createHash('sha256').update(fs.readFileSync(p.join(__SELF,'release.html'))).digest('hex')===m.releaseHTMLSHA256&&m.displayName==='2026.11.20 UAT 136';})(); /* UAT 136: the published build */
// CP-97 Switch cats on the endless board: light checks (real game, headless). Usage: node checks97s.cjs [release.html]
const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const D=path.resolve(__D130,'../cp129'); /* UAT 130 regression: everything else from work/cp129 */
const src=path.resolve(process.argv[2]||path.resolve(__SELF,'release.html'));const R=[];
const prodJ=path.resolve(D,'../../phone/CatCoinPusher-game.json'),psha=()=>require('crypto').createHash('sha256').update(fs.readFileSync(prodJ)).digest('hex'),prod0=psha();
function check(name,ok,info){R.push({name,ok:!!ok,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__D130,'../cp129/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='3bbe3b82a9149b4657a1477e0c9b34683d4ee971b5bec2e2ecddf0223114ebaf')m=[];const E=JSON.parse(fs.readFileSync(path.join(__D130,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+String.fromCharCode(10)+fs.readFileSync(path.join(__D130,'cp100-ghost.js'),'utf8')+String.fromCharCode(10)+fs.readFileSync(path.join(__D130,'cp130-fixes.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 129 + build name + Pet peak default + cp100-ghost.js + cp130-fixes.js (everything else unchanged)',(S===B||__ok131)&&m.length===1);}
 const g=await game({src,seed:6});g.run('S.muted=true;S.dev=true');g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.ticks(10);
 const J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));const tapR=r=>g.tap(r.x+r.w/2,r.y+r.h/2);
 const clear="for(const b of [...bodies])if(!b.dead&&CP97_COINS.includes(b.kind))removeCoin(b);WILD.incoming=WILD.incoming.filter(o=>!CP97_COINS.includes(o.kind));WILD.nextBonus=999";
 // 7 first: on a timed level the chip is only a tag
 g.run("PG.current=PGU.boardCat='tuxedo';pgPlay('tuxedo');if(WILD.phase!=='card')wildReset();wildStartCountdown()");g.until("WILD.phase==='play'",600);g.ticks(20);
 tapR(J('cp97Chip()'));g.ticks(2);check('1 timed level: tapping the chip does nothing',!J('CP97.open')&&J('PGU.boardCat')==='tuxedo');
 g.run('wildReset()');g.ticks(5);
 g.run("endLoad().coins=300;endStart()");g.until("WILD.phase==='play'",600);g.run(clear);
 for(let i=0;i<40;i++){g.run(`tryDrop({x:${Math.round(200+90*Math.sin(i))},y:DROP_Y})`);g.ticks(18);}g.run(clear);
 let n=0;while(J('cp97Locked()')&&n++<1500){g.tick();if(n%60===0)g.run(clear);}
 g.run('CP88.bank.laser=2;endBankOut()');
 const before=J("{uids:bodies.filter(b=>!b.dead).map(b=>b.uid).sort(),coins:S.coins,meter:END.w.meter,key:endKey(),laser:CP88.bank.laser,rel:board.released}");
 tapR(J('cp97Chip()'));g.ticks(2);const open=J('CP97.open'),row=J('cp97Row()');
 check('2 endless: tapping the chip opens a row of the 5 cats, no coin dropped',open&&row.faces.length===5&&J('board.released')===before.rel,{faces:row.faces.map(f=>f.cat)});
 const fo=row.faces.find(f=>f.cat==='orange');tapR(fo);g.ticks(2);
 const after=J("{uids:bodies.filter(b=>!b.dead).map(b=>b.uid).sort(),coins:S.coins,meter:END.w.meter,key:endKey(),laser:CP88.bank.laser,cat:PGU.boardCat,cur:PG.current,mode:WILD.mode,pcat:pgpCat(),open:CP97.open,rel:board.released,phase:WILD.phase}");
 const same=JSON.stringify(before.uids)===JSON.stringify(after.uids);
 check('3 tap the Orange face: Orange takes over (mode treats, power Orange), same board pieces, coins, meter, board and banked laser; no drop',
  after.cat==='orange'&&after.cur==='orange'&&after.mode==='treats'&&after.pcat==='orange'&&same&&after.coins===before.coins&&after.meter===before.meter&&after.key===before.key&&after.laser===2&&!after.open&&after.rel===before.rel&&after.phase==='play',{after:{...after,uids:after.uids.length},same});
 // 4 tap elsewhere closes without a drop
 tapR(J('cp97Chip()'));g.ticks(2);const r0=J('board.released');g.tap(200,600);g.ticks(2);
 check('4 a tap outside the open row closes it and drops nothing',!J('CP97.open')&&J('board.released')===r0);
 // 5 locks
 g.run("{const b=addCoin('fish',null,200,COIN_HALF+.2,500,yawTurn(0));}");g.ticks(2);const ref0=J('CP97.stats.refused');tapR(J('cp97Chip()'));g.ticks(2);
 const lk1=J('CP97.open')&&J('CP97.stats.refused')===ref0;g.run('CP97.open=false');g.run(clear);g.ticks(2); /* UAT 132: a side-game coin no longer locks the chip; the row opens */
 const lk=J("(()=>{const o={};const t=(k,f,u)=>{f();o[k]=cp97Locked();u();};t('power',()=>{globalThis.__p=PGPX;PGPX={t:0}},()=>{PGPX=globalThis.__p});t('dance',()=>{WILD.dance={}},()=>{WILD.dance=null});t('toss',()=>{WILD.tossPending={}},()=>{WILD.tossPending=null});t('jackpot',()=>{WILD.jpPending=true},()=>{WILD.jpPending=false});t('sweep',()=>{END.sweep={t:0,kicked:new Set()}},()=>{END.sweep=null});t('incoming',()=>{WILD.incoming.push({kind:'laser',t:9})},()=>{WILD.incoming=WILD.incoming.filter(o=>o.kind!=='laser')});o.free=cp97Locked();return o;})()");
 check('5 (UAT 132, Jenny) a side-game coin on the board or falling in does not lock the chip (the row opens); locked by a power, Dance break, pending side game, Jackpot, sweep; free otherwise',
  lk1&&lk.power&&lk.dance&&lk.toss&&lk.jackpot&&lk.sweep&&!lk.incoming&&lk.free===false,{lk1,lk});
 // 6 memory: the Tuxedo's note already came on this board -> switching away and back keeps that
 const sw=c=>{tapR(J('cp97Chip()'));g.ticks(2);const f=J('cp97Row()').faces.find(f=>f.cat===c);tapR(f);g.ticks(2);};
 sw('tuxedo');g.run('WILD.noteN=1;WILD.happy=0.5');sw('siamese');const sm=J("{mode:WILD.mode,laser:WILD.laser,noteN:WILD.noteN}");sw('tuxedo');const tb=J("{noteN:WILD.noteN,happy:WILD.happy,mode:WILD.mode}");
 check('6 switching keeps each cat\'s own counters on this board (Tuxedo note already used stays used; Dance meter kept); Siamese brings laser mode',
  sm.mode==='laser'&&sm.laser===true&&tb.noteN===1&&tb.happy===0.5&&tb.mode===null,{sm,tb});
 // 7 a cat new to this board: its schedule counts from now
 g.run('WILD.bonusN=40');sw('ragdoll');const rg=J("{mode:WILD.mode,heartAt:WILD.heartAt,bonusN:WILD.bonusN}");
 check('7 a cat new to this board starts fresh, its first side-game coin counted from now (Ragdoll heart after bonus 40)',rg.mode==='cozy'&&rg.heartAt>40,rg);
 // 8 a new board forgets the memory; the switched cat stays
 g.run('END.w.meter=END.METER;endStartSweep()');g.until('!END.sweep',600);g.ticks(5);check('8 NEW BOARD: the switched cat stays, memory cleared',J('PGU.boardCat')==='ragdoll'&&J('Object.keys(CP97.mem).length')===0&&J('WILD.mode')==='cozy');
 // 9 no errors drawing with the row open, while locked, closed
 g.run("globalThis.__e=[];const __fe=frameError;frameError=e=>{__e.push(String(e).slice(0,200));return __fe(e)}");g.run(clear);n=0;while(J('cp97Locked()')&&n++<900)g.tick();
 tapR(J('cp97Chip()'));g.ticks(30);g.run("{const b=addCoin('laser',null,200,COIN_HALF+.2,500,yawTurn(0));}");g.ticks(30);
 check('9 no frame errors with the row open, then locked',J('__e.length')===0,J('__e'));
 // 11 CP-92 rework: the sweep is the pusher travelling the whole board; nothing paid; the next board follows
 g.run(clear);n=0;while(J('cp97Locked()')&&n++<1500){g.tick();if(n%60===0)g.run(clear);}
 const left0=J('END.stats.sweepLeft|0');const s0=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),order:endOrder(),pieces:bodies.filter(b=>!b.dead).length}");g.run('END.w.meter=END.METER;endStartSweep()');
 let maxZ=0,maxC=s0.coins,k=0;while(J('!!END.sweep')&&k++<600){g.tick();maxZ=Math.max(maxZ,J('pusherY'));maxC=Math.max(maxC,J('S.coins'));}
 const s1=J("{coins:S.coins,pantry:JSON.stringify(PG.items||PG.pantry||{}),key:endKey(),left:END.stats.sweepLeft|0,pusher:pusherY,phase:WILD.phase,front:T.FRONT}");
 check('11 NEW BOARD: the pusher travels past the front edge, about 4.4 s, pays nothing (wallet, pantry), at most 1 piece left, next board in order, play resumes',
  maxZ>=s1.front+30&&k/60>4&&k/60<4.8&&maxC===s0.coins&&s1.coins===s0.coins&&s1.pantry===s0.pantry&&s1.left-left0<=1&&s1.key!==s0.key&&s1.phase==='play'&&s1.pusher<=200,{s0:{...s0,order:undefined},s1,maxZ:Math.round(maxZ),secs:+(k/60).toFixed(2),pieces:s0.pieces});
 g.close&&g.close();
 check('10 production untouched',psha()===prod0);
 const pass=R.filter(r=>r.ok).length;console.log(pass+'/'+R.length+' passed');const v=JSON.parse(fs.readFileSync(path.join(__D130,'release-version.json'),'utf8')),out=path.resolve(D,'../../tickets/CP-93-evidence/uat136/regression');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'checks97s-reg136.json'),JSON.stringify({build:src,passed:pass===R.length,passedN:pass,failed:R.filter(r=>!r.ok).map(r=>r.name),results:R},null,1));process.exit(pass===R.length?0:1);
})().catch(e=>{console.error(e);process.exit(2);});
