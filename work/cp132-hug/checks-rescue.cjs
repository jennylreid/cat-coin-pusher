// CP-74 Hug rescue checks (UAT 131): the build vs its base, headless, real game.
// Usage: node checks-rescue.cjs <build.html> <base.html> <out.json>
//  0 the build is the base + the build name + cp74-rescue.js (+ demo controls on dev pages), nothing else
//  1 outside the Hug nothing changes: a 12 s round with player drops is identical body for body on base and build
//  2 the Hug's walls go up and down at the same moments as the base (length unchanged)
//  3 crowded sides: at let-go no piece is within 5 units of a side edge (base has some); side drops in the 3 s after let-go <= base
//  4 visible slide, no teleport: the biggest one-frame move of any piece during the Hug stays under 6 units (a coin is 52 wide)
//  5 Home and the round ending mid-Hug leave no walls and no Hug; no frame errors anywhere
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const [,,BUILD,BASE,OUT]=process.argv;const res={passed:[],failed:[],info:{}};
const check=(n,b,info)=>{(b?res.passed:res.failed).push(n);res.info[n]=info;console.log((b?'PASS ':'FAIL ')+n+' '+JSON.stringify(info).slice(0,600));};
async function game(file,seed){const g=await make({sourceFile:file,render:false,seed,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t0=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t0();};g.run=s=>vm.runInContext(s,g.c);g.J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));
 g.run("globalThis.__errs=[];const __fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,200));return __fe(e);}");
 g.run('S.dev=false;S.muted=true');for(let i=0;i<140;i++)g.tick();
 // the Ragdoll's board, Level 3, as the CP-74 demo controls do (defined here so release builds need no demo code)
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.current='ragdoll';{const L=pglLv();L.passed=Math.max(L.passed,2);L.sel=3;}
  if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}try{pgPlay('ragdoll');}catch(e){}if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run('WILD.phase')!=='play'&&k++<1500)g.tick();g.quiet=()=>g.run("WILD.nextBonus=999;if(typeof WILD.nextToss==='number')WILD.nextToss=999;WILD.left=Math.max(WILD.left,30);board.remaining=Math.max(board.remaining,50);");
 g.quiet();for(let i=0;i<120;i++)g.tick();return g;}
const hug=g=>g.run(`(()=>{PG.powers=PG.powers||{};PG.powers[pgpCat()]=Math.max(2,pgpCount());if(board.status==='ready')board.status='playing';const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});return !!PGPX;})()`);
const crowd=g=>g.run(`for(let i=0;i<16;i++){const s=i%2?1:-1;addCoin('coin',null,200+s*rand(120,142),40+i*3,rand(460,730),yawTurn(rand(0,6)));}addCoin('item','yarn',58,50,560,yawTurn(0));addCoin('item','duck',342,50,640,yawTurn(0));`);
const POS="bodies.filter(b=>!b.dead).map(b=>{const p=b.rb.translation();return [b.uid,+(p.x/M).toFixed(3),+(p.z/M).toFixed(3)]})";
const EDGE="(()=>{const h=(T.R-T.L)/2;let n=0;for(const b of bodies){if(b.dead||!b.rb.isEnabled())continue;const p=b.rb.translation();if(p.y<0||p.z/M<GUARD_END-30)continue;if(h-(Math.abs(p.x/M-200)+b.r)<5)n++;}return n;})()";
(async()=>{
 {const s=fs.readFileSync(BUILD,'utf8'),b=fs.readFileSync(BASE,'utf8'),blk=fs.readFileSync(path.join(__dirname,'cp74-rescue.js'),'utf8');
  const demo=fs.readFileSync(path.join(__dirname,'../cp74-hug/demo.js'),'utf8');let r=s.replace(blk+'\n','');const dev=r.includes(demo);if(dev)r=r.replace(demo+'\n','');
  const bn=/const BUILD = '[^']+';/;r=r.replace(bn,(b.match(bn)||[''])[0]);check('0 build = base + name + rescue block',r===b&&s.includes(blk),{dev,bytes:[b.length,s.length]});}
 // 1 outside the Hug: identical
 {const a=[];for(const f of [BASE,BUILD]){const g=await game(f,5);for(let i=0;i<720;i++){g.tick();if(i%27==0)g.run('tryDrop({x:200+rand(-140,140)})');if(i%60==0)g.quiet();}a.push(g.J(POS));g.close();}
  check('1 no Hug: identical to base',JSON.stringify(a[0])===JSON.stringify(a[1]),{bodies:a.map(x=>x.length)});}
 // 2-4 crowded Hug, both pages, three seeds
 const R={};for(const [name,f] of [['base',BASE],['build',BUILD]])for(const seed of [11,22,33]){const g=await game(f,seed);crowd(g);for(let i=0;i<90;i++)g.tick();g.quiet();
  g.run("globalThis.__side=0;globalThis.__sideT=[];const __go=gutterOff;gutterOff=function(b,x){__sideT.push(__f);return __go.apply(this,arguments);};globalThis.__f=0;globalThis.__mv=0;globalThis.__last=new Map();");
  const ok=hug(g);let off=-1,on=-1,edge=null,F=0;
  for(let i=0;i<60*14;i++){g.tick();F++;g.run('__f='+F);
   if(g.run('!!(PGPX&&PGPX.z74)'))g.run(`for(const b of bodies){if(b.dead)continue;const p=b.rb.translation();if(p.y<0)continue;const q=__last.get(b.uid);if(q)__mv=Math.max(__mv,Math.hypot(p.x/M-q[0],p.z/M-q[1]));__last.set(b.uid,[p.x/M,p.z/M]);}`);
   if(on<0&&g.run('!!(PGPX&&PGPX.cols)'))on=F;if(off<0&&g.run('!!(PGPX&&PGPX.wallsDone)')){off=F;edge=g.run(EDGE);}if(i%30==0){g.quiet();if(i%60==0)g.run('tryDrop({x:200+rand(-140,140)})');}}
  const sideT=g.J('__sideT');R[name+seed]={ok,on,off,edge,after3s:sideT.filter(x=>x>=off&&x<off+180).length,maxMove:+g.run('__mv').toFixed(2),errs:g.J('__errs').length,stats:g.J('typeof Z74R!=="undefined"?Z74R.stats:null')};g.close();}
 res.info.runs=R;const S=[11,22,33];
 check('2 walls up/down at the same moments as base',S.every(s=>R['base'+s].on===R['build'+s].on&&R['base'+s].off===R['build'+s].off&&R['build'+s].ok),S.map(s=>[R['build'+s].on,R['build'+s].off]));
 check('3 nothing at a side edge at let-go; side drops after <= base',S.every(s=>R['build'+s].edge===0&&R['build'+s].after3s<=R['base'+s].after3s)&&S.some(s=>R['base'+s].edge>0),S.map(s=>({base:R['base'+s].edge,build:R['build'+s].edge,dropsBase:R['base'+s].after3s,dropsBuild:R['build'+s].after3s})));
 check('4 slides, no teleport (max one-frame move < 6 units)',S.every(s=>R['build'+s].maxMove<6),S.map(s=>[R['base'+s].maxMove,R['build'+s].maxMove]));
 // 5 Home / round end mid-Hug
 const mid=[];for(const how of ['wildExit()','WILD.left=0']){const g=await game(BUILD,7);const n=g.run('world.colliders.len()');hug(g);for(let i=0;i<60*4;i++)g.tick();try{g.run(how);}catch(e){}for(let i=0;i<240;i++)g.tick();
  mid.push({how,px:g.run('PGPX===null'),cols:g.run('world.colliders.len()')-n,errs:g.J('__errs').length});g.close();}
 check('5 Home / round end mid-Hug clean; no frame errors',mid.every(m=>m.px&&m.cols===0&&!m.errs)&&S.every(s=>!R['build'+s].errs),mid);
 res.build=path.resolve(BUILD);res.base=path.resolve(BASE);res.passed_all=!res.failed.length;if(OUT)fs.writeFileSync(OUT,JSON.stringify(res,null,1));console.log(res.failed.length?'FAILED':'ALL PASS');
})().catch(e=>{console.error(e);process.exit(1)});
