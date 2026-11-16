// CP-40 checks: force a tip-off on Wild 2; (1) tap on the glowing prize saves it, (2) a tap elsewhere drops a coin and
// uses no save, the prize falls when the window ends, (3) saves run out at the dial value, (4) not on Wild / Board 1.
const {game}=require('../cp42/harness.cjs'),path=require('path');
(async()=>{const src=path.resolve(process.argv[2]||'v-a40.html'),out={};
 async function setup(v2=true){const g=await game({src,seed:5});g.run(`S.dev=true;${v2?'wild2Enter()':'wildEnter()'};wildStartCountdown()`);g.until(`WILD.phase==='play'`,900);g.ticks(30);return g;}
 const st=g=>JSON.parse(g.run(`JSON.stringify({saves:PAW40_STATE.saves,teeter:!!PAW40_STATE.teeter,swipe:!!PAW40_STATE.swipe,saved:PAW40_STATE.saved,missed:PAW40_STATE.missed,lost:WILD.lostN??null})`));
 // 1. save
 {const g=await setup();g.run('paw40ForceTip()');const ok=g.until('!!PAW40_STATE.teeter',60);const before=st(g);
  const e=JSON.parse(g.run('JSON.stringify((()=>{const e=paw40Screen(PAW40_STATE.teeter.b);return {x:e.x,y:e.y-14*e.s,id:PAW40_STATE.teeter.b.id}})())'));
  const t0=g.ms();const drops0=g.run('board.used');g.tap(e.x,e.y);g.ticks(90);const b=JSON.parse(g.run(`JSON.stringify((()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${e.id}');if(!b)return null;const p=b.rb.translation();return {x:p.x/M,z:p.z/M,h:p.y/M,inside:Math.abs(p.x/M-200)<(T.R-T.L)/2}})())`));
  out.save={teeterStarted:ok,before,after:st(g),prize:b,dropsDuringTap:g.run('board.used')-drops0};}
 // 2. miss: tap far away
 {const g=await setup();g.run('paw40ForceTip()');g.until('!!PAW40_STATE.teeter',60);g.run('globalThis.__mb=PAW40_STATE.teeter.b');const id=g.run('__mb.id'),u0=g.run('board.used');
  g.tap(200,300);g.ticks(2);const used=g.run('board.used')-u0;let hang=0;while(g.run('!!PAW40_STATE.teeter')&&hang<120){g.tick();hang++;}g.ticks(40);
  out.miss={coinDropped:used,windowFrames:hang,after:st(g),prizeFell:g.run('__mb.dead'),lostN:g.run('WILD.lostN??null')};}
 // 3. run out
 {const g=await setup();let saves=[];for(let k=0;k<4;k++){g.run('paw40ForceTip()');if(!g.until('!!PAW40_STATE.teeter',40)){saves.push('no glow');g.ticks(60);continue;}const e=JSON.parse(g.run('JSON.stringify(paw40Screen(PAW40_STATE.teeter.b))'));g.tap(e.x,e.y-10);g.ticks(80);saves.push(st(g).saves);}out.runOut=saves;}
 // 4. Wild (not 2): no glow
 {const g=await setup(false);g.run(`const b=addCoin('item','duck',200+((T.R-T.L)/2+4),COIN_HALF*2+halfOf('item')+2,600,yawTurn(0));`);g.ticks(20);out.wild1={teeter:g.run('!!PAW40_STATE.teeter')};}
 console.log(JSON.stringify(out,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
