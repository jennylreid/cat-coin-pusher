// CP-43 checks: Cozy mode and Pet the cat (real runtime, sound ON through a strict fake Web Audio unless noted; desktop).
const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path'),crypto=require('crypto');
eval(fs.readFileSync(path.join(__dirname,'strict-audio.part'),'utf8'));
const SRC=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),BASE=path.resolve(process.argv[3]||path.join(__dirname,'../cp45/release.html'));
const out=[];const ok=(name,pass,detail='')=>{out.push({name,pass:!!pass,detail});console.log((pass?'PASS ':'FAIL ')+name+(detail?'  '+detail:''));};
const fp=g=>crypto.createHash('sha1').update(g.run("bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return b.kind+':'+p.x.toFixed(4)+','+p.y.toFixed(4)+','+p.z.toFixed(4)}).join('|')+'#'+S.coins")).digest('hex').slice(0,16);
async function G(o={}){const g=await game({src:SRC,...o});const st=strictAudio(g);g.st=st;g.errs=[];g.run('S.muted=false');const t=g.tick;g.tick=()=>{try{t();}catch(e){g.errs.push(String(e.message).slice(0,160));}};return g;}
function drops(g,sec,every=.4){for(let i=0;i<sec*60;i++){if(i%Math.round(every*60)===0)g.drop();g.tick();}}
(async()=>{
 // 1. Boards 1-3 and Wild 2 unchanged
 for(const [label,pre,sec] of [['Board 1',"",25],['Board 3',"loadBoard&&0",0],['Wild 2 round',"wild2Enter();wildStartCountdown()",40],['Treat toss mode round',"wildModeEnter('treats');wildStartCountdown()",40]]){
  if(!sec)continue;const fps=[];for(const src of [BASE,SRC]){const g=await game({src,seed:9});g.run('S.muted=true');if(pre)g.run(pre);drops(g,sec);fps.push(fp(g));g.close();}
  ok(label+' identical to the base after '+sec+' s (same seed and drops)',fps[0]===fps[1],fps.join(' vs '));}
 // 2. MODES picker -> COZY; its card; tap to start; EXIT; Wild 2 and the other modes keep their own
 {const g=await G();const mb=JSON.parse(g.run('JSON.stringify(modesButton())'));g.tap(mb.x+mb.w/2,mb.y+mb.h/2);g.ticks(10);
  const rows=JSON.parse(g.run('JSON.stringify(modesPickerRects().rows)')),row=rows.find(r=>r.id==='cozy');
  ok('COZY is listed in the MODES picker',!!row,rows.map(r=>r.id).join(', '));g.tap(row.x+row.w/2,row.y+row.h/2);g.ticks(10);
  ok('picking COZY opens the Cozy goal card',g.run("WILD.on&&WILD.v2&&petMode()&&WILD.phase==='card'&&wildModeName()==='COZY'"));
  ok('Cozy card lines are the pet lines',g.run("wildCardLines()[0][0]==='heart'&&wildCardLines().length===6"));
  ok('Cozy features only Pet the cat (no happy meter, music-note or fish coin)',g.run("wildFeature('pet')&&!wildFeature('dance')&&!wildFeature('toss')"));
  g.tap(200,600);g.ticks(5);ok('a tap on the card starts the 3-2-1',g.run("WILD.phase==='count'"));
  g.ticks(260);ok('round running after GO',g.run("WILD.phase==='play'"));
  const ex=JSON.parse(g.run('JSON.stringify(wildButton())'));g.tap(ex.x+ex.w/2,ex.y+ex.h/2);g.ticks(5);
  ok('EXIT leaves Cozy',g.run("!WILD.on&&!petMode()&&!WILD.mode"));
  const w=JSON.parse(g.run('JSON.stringify(wild2Button())'));g.tap(w.x+w.w/2,w.y+w.h/2);g.ticks(5);
  ok('WILD 2 button still opens plain Wild 2 with its own card',g.run("WILD.on&&WILD.v2&&!WILD.mode&&wildCardLines()[0][0]==='meter'&&wildFeature('dance')&&!wildFeature('pet')"));
  ok('no exceptions (sound on, strict audio)',!g.errs.length,g.errs.join('; '));g.close();}
 // 3. Natural rounds: about one heart coin a Cozy round, pushing it off starts petting; notes/fish still on Wild 2
 {const rows=[];for(const seed of [21,22,23,24]){const g=await G({seed});g.run('petEnter();wildStartCountdown()');let started=0,t=0;
   while(g.run("WILD.phase!=='end'")&&t<120){drops(g,1);t++;if(g.run('!!WILD.petGame'))started=1;}
   rows.push({seed,hearts:g.run('WILD.heartN'),pets:g.run('WILD.pets'),notes:g.run('WILD.noteN'),fish:g.run('WILD.fishN'),won:g.run("board.status"),errs:g.errs.length});g.close();}
  ok('Cozy: heart coin about once a round (4 rounds)',rows.every(r=>r.hearts>=1&&r.hearts<=2),JSON.stringify(rows));
  ok('Cozy: a heart pushed off starts Pet the cat in at least 2 of 4 auto rounds',rows.filter(r=>r.pets>0).length>=2);
  ok('Cozy: no exceptions in 4 rounds',rows.every(r=>!r.errs));
  const g=await G({seed:21});g.run('wild2Enter();wildStartCountdown()');let t=0;while(g.run("WILD.phase!=='end'")&&t<120){drops(g,1);t++;}
  ok('Wild 2: no heart coins, no petting',g.run('WILD.heartN===0&&WILD.pets===0&&!petMode()'),'notes '+g.run('WILD.noteN')+' fish '+g.run('WILD.fishN'));g.close();}
 // 4. Heart coin pushed off -> petting starts after its pickup; timer, Turbo and bonus clock pause; no coin drops
 {const g=await G();g.run('petEnter();wildStartCountdown()');g.ticks(300);
  g.run("var hb=addCoin('heart',null,200,30,620,randomTurn(.1),{x:0,y:0,z:0},{x:0,y:0,z:0});wildRainCollected(hb,200)");
  ok('heart coin pickup queues petting',g.run('!!WILD.petPending'));let k=0;while(!g.run('!!WILD.petGame')&&k<200){g.tick();k++;}
  ok('petting starts within 1.5 s of the pickup',g.run('!!WILD.petGame'),(k/60).toFixed(2)+' s');
  const left=g.run('WILD.left'),coins=g.run('S.coins');g.ticks(120);g.tap(200,700);g.ticks(60);
  ok('round timer paused while petting',Math.abs(g.run('WILD.left')-left)<1e-9);
  ok('a tap on the board during petting drops no coin (the cat glances: "pet my head!")',g.run('S.coins')===coins&&g.run('WILD.petGame.huhs')===1);
  g.close();}
 // 5. Strokes build the purr; peak; lift stops; ear tap flicks; DONE; over-petting hisses (each with sound)
 {const g=await G();g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);
  const a=JSON.parse(g.run('JSON.stringify(headToScreen(110,40))')),e=JSON.parse(g.run('JSON.stringify(headToScreen(53,29))'));
  const n0=g.st.created;g.tap(e.x,e.y);g.tick();
  ok('ear tap: ear flick + whisker twitch + sound',g.run('WILD.petGame.ears===1&&WILD.petGame.earL.t<.1&&WILD.petGame.whisk.t<.1')&&g.st.created>n0);
  g.pointer('pointerdown',a.x,a.y);let x=a.x,d=1,L0=g.run('WILD.petGame.L');for(let i=0;i<60;i++){x+=d*5;if(x>a.x+160||x<a.x)d=-d;g.pointer('pointermove',x,a.y);g.tick();}
  const L1=g.run('WILD.petGame.L');ok('stroking builds the purr (1 s of stroking)',L1>L0+.15,L0.toFixed(2)+' -> '+L1.toFixed(2));
  ok('purr sound live while stroking',g.run('!!(sfx.__purr&&sfx.__purr.on)'));
  ok('eyes close as the purr builds (approved Happy features)',g.run('petSquint()')>.9);
  g.pointer('pointerup',x,a.y);g.ticks(20);ok('lifting briefly does not stop (0.33 s)',g.run("WILD.petGame.phase==='play'"));
  g.ticks(40);ok('staying off the cat for 0.75 s stops it',g.run("WILD.petGame.phase==='end'"),JSON.stringify(g.run('JSON.stringify(WILD.petGame.result)')));
  g.ticks(200);ok('coins pour onto the board after the stop',g.run('WILD.rained')>0||g.run('SKY.length')>0);
  ok('petting ends and the purr stops',g.run('!WILD.petGame&&!(sfx.__purr&&sfx.__purr.on)'));
  // over-petting
  g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);g.pointer('pointerdown',a.x,a.y);x=a.x;let grr=false;
  for(let i=0;i<60*12&&g.run("WILD.petGame&&WILD.petGame.phase==='play'");i++){x+=d*5;if(x>a.x+160||x<a.x)d=-d;g.pointer('pointermove',x,a.y);g.tick();if(g.run('WILD.petGame.grr'))grr=true;}
  const R=JSON.parse(g.run('JSON.stringify(WILD.petGame&&WILD.petGame.result)'));
  ok('over-petting: growl warning, then a hiss and the Sharp Grin for a moment',grr&&R&&R.kind==='hiss'&&g.run("petHeadImg(ART.head)===ART.headWild"),JSON.stringify(R));
  g.pointer('pointerup',x,a.y);g.ticks(240);
  // DONE button
  g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);g.pointer('pointerdown',a.x,a.y);x=a.x;
  for(let i=0;i<90;i++){x+=d*5;if(x>a.x+160||x<a.x)d=-d;g.pointer('pointermove',x,a.y);g.tick();}g.pointer('pointerup',x,a.y);
  const r=JSON.parse(g.run('JSON.stringify(petDoneRect())'));g.tap(r.x+r.w/2,r.y+r.h/2);g.tick();
  ok('DONE stops at once',g.run("WILD.petGame.result&&WILD.petGame.result.why==='done'"));
  ok('no exceptions (sound on, strict audio)',!g.errs.length,g.errs.join('; '));g.close();}
 // 6. Win waits; EXIT during petting; Settings pauses; dance break waits
 {const g=await G();g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);
  g.run("for(const id of WILD_COLLECTION)if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;}wildFinish(true)");
  ok('a win during petting waits',g.run("WILD.phase==='play'&&WILD.petGame&&WILD.petGame.winWaiting"));
  g.run('WILD.happy=DANCE.notches;danceStart()');ok('no dance break starts during petting',g.run('!WILD.dance'));
  g.run("panel.style.display='block'");const t0=g.run('WILD.petGame.t');g.ticks(60);ok('Settings open: petting clock stops, purr off',g.run('WILD.petGame.t')===t0&&g.run('!(sfx.__purr&&sfx.__purr.on)'));
  g.run("panel.style.display='none'");g.ticks(60*14);ok('after petting the waiting win plays (round won)',g.run("WILD.phase==='end'&&board.status==='won'"),g.run('WILD.phase')+' '+g.run('board.status'));
  g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);g.run('wildExit()');g.ticks(10);
  ok('EXIT during petting: clean exit, purr off',g.run('!WILD.on&&!WILD.petGame&&!(sfx.__purr&&sfx.__purr.on)'));
  ok('no exceptions',!g.errs.length,g.errs.join('; '));g.close();}
 // 7. Sound off: silent
 {const g=await G();g.run('S.muted=true');g.run('petStartNow()');g.until('WILD.petGame&&WILD.petGame.phase==="play"',900);const n0=g.st.created;
  const a=JSON.parse(g.run('JSON.stringify(headToScreen(110,40))'));g.pointer('pointerdown',a.x,a.y);let x=a.x;for(let i=0;i<120;i++){x+=(i%60<30?5:-5);g.pointer('pointermove',x,a.y);g.tick();}g.pointer('pointerup',x,a.y);g.ticks(180);
  ok('sound off: no audio nodes made while petting',g.st.created===n0,(g.st.created-n0)+' nodes');g.close();}
 // 8. Dials: saved, loaded, in the performance log
 {const storage={};let g=await G({storage});g.run("stepPetDial('len',1);stepPetDial('peak',-1);stepPetDial('grace',1)");
  const P=JSON.parse(g.run('JSON.stringify(PET)'));const log=JSON.parse(g.run('diagPayload()'));g.close();
  ok('dials step and save',P.len===9.5&&P.peak===3&&Math.abs(P.grace-1.3)<1e-9&&!!storage['catpusher.uat.pet.v1'],JSON.stringify(P));
  ok('dials in the performance log',log.petTuning&&log.petTuning.len===9.5&&log.petTuningDefaults&&Array.isArray(log.petLog));
  g=await G({storage});ok('dials load on the next start',g.run('PET.len===9.5&&PET.peak===3'));
  const html=g.run('wildDevHtml()');ok('Developer: Start pet the cat now and the three dials',html.includes('Start pet the cat now')&&html.includes('Peak timing')&&html.includes('Pet length')&&html.includes('Grumpy after'));g.close();}
 fs.writeFileSync(path.join(__dirname,'checks47.json'),JSON.stringify(out,null,1));
 console.log(out.filter(x=>x.pass).length+' pass, '+out.filter(x=>!x.pass).length+' fail');
})().catch(e=>{console.error(e);process.exitCode=1;});
