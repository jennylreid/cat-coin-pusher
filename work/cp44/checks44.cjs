// UAT 44 checks (sound on, strict fake Web Audio, frames drawn with exceptions caught). node checks44.cjs [src] [outdir]
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames,breakRun}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'release.html')),OUT=path.resolve(process.argv[3]||path.join(__dirname,'..','..','tickets','CP-24-evidence','uat44'));fs.mkdirSync(OUT,{recursive:true});
const passed=[],failed=[];function check(name,ok,info){(ok?passed:failed).push(info===undefined?name:{name,info});console.log((ok?'PASS ':'FAIL ')+name+(info!==undefined?' '+JSON.stringify(info):''));}
async function g0(seed=5){const g=await game({src,seed,render:true});const st=strictAudio(g);g.run('S.muted=false;S.dev=true');return {g,st,errs:[]};}
async function wild2(){const o=await g0();o.g.run('wild2Enter();wildStartCountdown()');let k=0;while(o.g.run('WILD.phase')!=='play'&&k++<900)frames(o.g,1,o.errs);frames(o.g,30,o.errs);return o;}
const S=g=>JSON.parse(g.run('JSON.stringify({saves:PAW40_STATE.saves,teeter:!!PAW40_STATE.teeter,saved:PAW40_STATE.saved,missed:PAW40_STATE.missed,lost:WILD.lostN})'));
(async()=>{
 {const {g}=await g0();check('build label',g.run('BUILD')==='2026.11.12 UAT 44',g.run('BUILD'));g.close();}
 // CP-24: a tuna on the bare edge with its centre 25 past it falls; 10 inside stays; a coin with its centre past the edge falls
 for(const [off,falls] of [[25,true],[5,true],[-10,false]]){const {g,errs}=await g0(4);g.run(`selectBoard(2);finishBoard=()=>{};reconcileBoardTargets=()=>{};{const t=bodies.find(b=>!b.dead&&b.id==='tuna');removeCoin(t);for(const b of bodies.slice()){const p=b.rb.translation();if(!b.dead&&Math.hypot(p.x/M-T.R,p.z/M-475)<75)removeCoin(b);}globalThis.__f=addCoin('item','tuna',T.R+${off},halfOf('item')+5,475,yawTurn(0));}`);
  frames(g,120,errs);check(`CP-24 tuna centre ${off} past the side edge ${falls?'falls':'stays'}`,g.run('__f.dead')===falls&&!errs.length,{dead:g.run('__f.dead'),errs});g.close();}
 {const {g,errs}=await g0(4);g.run(`selectBoard(0);for(const b of bodies.slice()){const p=b.rb.translation();if(!b.dead&&b.kind!=='item'&&Math.hypot(p.x/M-T.R,p.z/M-560)<80)removeCoin(b);}globalThis.__c=addCoin('coin',null,T.R+8,COIN_HALF+5,560,yawTurn(0));globalThis.__d=addCoin('coin',null,T.R-12,COIN_HALF+5,620,yawTurn(0));`);
  frames(g,120,errs);check('CP-24 coin centre 8 past the edge falls; centre 12 inside stays',g.run('__c.dead')&&!g.run('__d.dead')&&!errs.length,{past:g.run('__c.dead'),inside:g.run('__d.dead'),errs});g.close();}
 // CP-40: save, miss, run out, not on Wild
 {const {g,st,errs}=await wild2();const n0=st.created;g.run('paw40ForceTip()');let k=0;while(!g.run('!!PAW40_STATE.teeter')&&k++<60)frames(g,1,errs);const glowSound=st.created>n0;frames(g,8,errs);
  const e=JSON.parse(g.run('JSON.stringify((()=>{const e=paw40Screen(PAW40_STATE.teeter.b);return {x:e.x,y:e.y-14*e.s}})())'));g.run('globalThis.__s=PAW40_STATE.teeter.b');const u0=g.run('board.used'),n1=st.created;g.tap(e.x,e.y);frames(g,90,errs);
  const inside=g.run('!__s.dead&&Math.abs(__s.rb.translation().x/M-200)<(T.R-T.L)/2'),r=S(g);
  check('CP-40 tap on the glowing prize saves it (one save used, back on the board, no coin dropped, sounds)',glowSound&&st.created>n1&&r.saves===2&&r.saved===1&&inside&&g.run('board.used')===u0&&!errs.length,{glowSound,r,inside,errs});
  fs.writeFileSync(path.join(OUT,'live-audio-nodes.txt'),String(st.live()));g.close();}
 {const {g,errs}=await wild2();g.run('paw40ForceTip()');let k=0;while(!g.run('!!PAW40_STATE.teeter')&&k++<60)frames(g,1,errs);g.run('globalThis.__m=PAW40_STATE.teeter.b');const u0=g.run('board.used');g.tap(200,300);frames(g,2,errs);const used=g.run('board.used')-u0;
  let w=0;while(g.run('!!PAW40_STATE.teeter')&&w<120){frames(g,1,errs);w++;}frames(g,60,errs);const r=S(g);
  check('CP-40 a tap elsewhere drops a coin, uses no save; the prize falls into the lost-prize moment after ~0.5 s',used===1&&r.saves===3&&g.run('__m.dead')&&r.lost>=1&&w>=25&&w<=35&&!errs.length,{used,window:w,r,errs});g.close();}
 {const {g,errs}=await wild2();const seq=[];for(let i=0;i<4;i++){g.run('paw40ForceTip()');let k=0;while(!g.run('!!PAW40_STATE.teeter')&&k++<40)frames(g,1,errs);if(!g.run('!!PAW40_STATE.teeter')){seq.push('no glow');frames(g,60,errs);continue;}const e=JSON.parse(g.run('JSON.stringify(paw40Screen(PAW40_STATE.teeter.b))'));g.tap(e.x,e.y-10);frames(g,80,errs);seq.push(S(g).saves);}
  check('CP-40 three saves per round, then no glow',JSON.stringify(seq)==='[2,1,0,"no glow"]'&&!errs.length,{seq,errs});
  g.run('wildReset()');check('CP-40 saves reset each round',S(g).saves===3);g.run('PAW40.perRound=5;wildReset()');check('CP-40 dial sets saves per round',S(g).saves===5);g.close();}
 {const {g,errs}=await g0();g.run('wildEnter();wildStartCountdown()');frames(g,260,errs);g.run(`addCoin('item','duck',200+((T.R-T.L)/2+4),COIN_HALF*2+halfOf('item')+2,600,yawTurn(0))`);frames(g,30,errs);check('CP-40 not on Wild (only Wild 2)',!g.run('!!PAW40_STATE.teeter')&&!errs.length,{errs});g.close();}
 {const {g,errs}=await g0();const html=g.run('wildDevHtml()');check('CP-40 developer: force tip-off button and saves dial',html.includes('paw40-tip')&&html.includes('Paw saves per round'));g.close();}
 // whole rounds: Boards 1-3 and Wild 2 with hold-to-drop, no exceptions, sound on
 for(const bd of ['0','1','2','w2']){const {g,errs}=bd==='w2'?await wild2():await g0(3);if(bd!=='w2')g.run(`selectBoard(${bd});S.coins=999`);
  for(let s=0;s<30&&!errs.length;s++){g.run(`S.coins=Math.max(S.coins,60);holding=true;holdPos={x:200+90*Math.sin(${s}*0.9),y:DROP_Y};`);frames(g,60,errs);}
  check(`30 s of play on ${bd==='w2'?'Wild 2':'Board '+(+bd+1)} without errors`,!errs.length,{errs,status:g.run('board.status')});g.close();}
 // the dance break still runs (UAT 43)
 {const r=await breakRun(src,true);check('Wild 2 dance break runs to the end',r.ended&&r.gameRunning&&!r.errs.length,r);}
 fs.writeFileSync(path.join(OUT,'checks.json'),JSON.stringify({passed,failed},null,1));console.log(passed.length+' passed '+failed.length+' failed');
})().catch(e=>{console.error(e);process.exitCode=1;});
