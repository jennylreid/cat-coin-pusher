// CP-74 prototype checks (headless, real game + prototype): walls exactly 6 s while the arms are in, the lock, Home and
// round end mid-power leave nothing behind, no frame errors. Usage: node check.cjs > tickets/CP-74-evidence/check.json
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
async function game(){const g=await make({sourceFile:path.join(__dirname,'game','proto.html'),render:false,seed:7,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');for(let i=0;i<140;i++)g.tick();g.run('z74DemoRound(3)');let k=0;while(g.run("WILD.phase")!=='play'&&k++<1500)g.tick();
 g.run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();return g;}
const res={};const ok=(n,v,d)=>{res[n]={pass:!!v,detail:d};};
(async()=>{let g=await game();const n0=g.run('world.colliders.len()');g.run('PG.powers.ragdoll=2');g.run('z74DemoPlay()');
 const tr=[];for(let i=0;i<60*8;i++){g.tick();if(i%6==0)tr.push([+g.run('PGPX?PGPX.t:-1').toFixed(2),g.run('world.colliders.len()')-n0]);
  if(i===120){const c=g.run('pgpCount()');g.run('{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});}');res.lockCount=[c,g.run('pgpCount()')];}}
 const on=tr.filter(x=>x[1]===2);ok('walls',on.length&&on[0][0]>=.4&&on[0][0]<=.55&&on[on.length-1][0]>=6.35&&on[on.length-1][0]<=6.5&&tr[tr.length-1][1]===0,{first:on[0],last:on[on.length-1],end:tr[tr.length-1]});
 ok('lock',res.lockCount[0]===res.lockCount[1]&&res.lockCount[0]===1,res.lockCount);ok('ends',g.run('PGPX===null'),null);
 ok('errors',!JSON.parse(g.run('JSON.stringify(__errs)')).length,JSON.parse(g.run('JSON.stringify(__errs)')));g.close();
 for(const [name,how] of [['home','wildExit()'],['roundEnd','WILD.left=0']]){g=await game();const n=g.run('world.colliders.len()');g.run('z74DemoPlay()');for(let i=0;i<120;i++)g.tick();
  try{g.run(how);}catch(e){}for(let i=0;i<240;i++)g.tick();ok(name+'MidPower',g.run('PGPX===null')&&g.run('world.colliders.len()')===n,{px:g.run('PGPX&&PGPX.t'),cols:g.run('world.colliders.len()')-n});g.close();}
 console.log(JSON.stringify({build:path.join(__dirname,'game','proto.html'),passed:Object.values(res).every(r=>typeof r!=='object'||!('pass' in r)||r.pass),res},null,1));})().catch(e=>{console.error(e);process.exit(1)});

// UAT 104: the harness has no Image decoding; load the Hug art (CP74_ART data URIs) the way the page would
async function __z74LoadArt(g){const run=s=>require('vm').runInContext(s,g.c);if(run('typeof CP74_ART')!=='object')return;const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');for(const k of ['shoulder','left','right']){const u=run('CP74_ART.'+k);g.c.__z74im=await N.loadImage(Buffer.from(u.split(',')[1],'base64'));run('Z74.img.'+k+'=__z74im');}}
