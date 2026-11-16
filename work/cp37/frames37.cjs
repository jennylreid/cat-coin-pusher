// CP-36 evidence frames (desktop, real runtime, @napi-rs/canvas at DPR 1.35, H 888.9). Not phone evidence.
const {game,tapAtBeat}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const O=path.resolve(__dirname,'../../tickets/CP-36-evidence');fs.mkdirSync(O,{recursive:true});
const only=process.argv[2];
const shot=(g,n)=>{if(only&&!n.includes(only))return;g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
const push=(g,id,kind='item')=>g.run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='${kind}'&&(${kind==='item'}?b.id==='${id}':true));b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()`);
(async()=>{
 {const g=await game({render:true}),a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);
  shot(g,'meter-0-empty');
  push(g,'cheese');g.ticks(8);shot(g,'meter-1-first-notch');g.ticks(60);
  push(g,'shrimp');g.ticks(60);push(g,'yarn');g.ticks(70);shot(g,'meter-3-of-4');
  push(g,'duck');g.ticks(14);shot(g,'meter-4-full');
  g.until('!!WILD.dance');g.ticks(20);shot(g,'dance-1-count-in');
  g.until('WILD.dance.phase==="dance"');
  tapAtBeat(g,0,0);g.ticks(3);shot(g,'dance-2-first-beat-banked');
  for(let k=1;k<6;k++)tapAtBeat(g,k,0.01);g.run('Math.random=()=>0.01');tapAtBeat(g,6,0);g.run('delete Math.random');g.ticks(8);shot(g,'dance-3-rain-coin-banked');
  for(let k=7;k<11;k++)tapAtBeat(g,k,-.02);tapAtBeat(g,11,.3);g.ticks(4);shot(g,'dance-4-off-beat');
  for(let k=13;k<15;k++)tapAtBeat(g,k,0);g.ticks(10);shot(g,'dance-5-bank-counting');
  g.until('WILD.dance.phase==="finale"');g.ticks(12);shot(g,'rain-1-roar');g.ticks(14);shot(g,'rain-2-pouring');g.ticks(30);shot(g,'rain-3-landing');
  g.until('!WILD.dance');g.ticks(90);shot(g,'rain-4-after-timer-resumes');
  g.close();}
 {const g=await game({render:true}),a=g.c.__game;a.wildEnter();a.wildStartCountdown();g.ticks(240);
  g.run("WILD.nextBonus=.01;WILD.noteAt=0");g.ticks(30);shot(g,'note-1-incoming');g.until('bodies.some(b=>!b.dead&&b.kind==="note")');g.ticks(40);shot(g,'note-2-on-board');
  push(g,null,'note');g.until('treatAwards.some(f=>f.pop&&f.t>=f.tr)',200);shot(g,'note-3-pop');g.ticks(14);shot(g,'note-4-meter-full');
  g.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
