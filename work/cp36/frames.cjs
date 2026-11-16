// CP-35 evidence frames and desktop frame cost (real runtime, @napi-rs/canvas CPU renderer at DPR 1.35; not phone evidence).
const make=require('../cp33/runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),{performance}=require('perf_hooks');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const O=path.resolve(__dirname,'../../tickets/CP-35-evidence');fs.mkdirSync(O,{recursive:true});
async function game(src,seed){const g=await make({sourceFile:path.resolve(__dirname,src),render:true,height:888.889,seed});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();return g;}
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(O,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{
 const g=await game('release.html',4),a=g.c.__game,run=s=>vm.runInContext(s,g.c);
 shot(g,'0-normal-board-with-wild-button');
 a.wildEnter();for(let i=0;i<20;i++)g.tick();shot(g,'1-goal-card');
 a.wildStartCountdown();for(let i=0;i<40;i++)g.tick();shot(g,'2-countdown');
 const cost={phys:[],draw:[]};let t=0,last=-9,rainShot=false,midShot=false;
 while(a.WILD.phase!=='end'&&t<70){
  if(a.WILD.phase==='play'){if(a.board.earnedQuakes>0&&run('catquakeTime===0&&sweepTime===0'))run('useEarnedQuake()');if(t-last>=.2){a.tryDrop({x:200+70*Math.sin(t*1.3),y:run('DROP_Y')});last=t;}}
  const t0=performance.now();g.tick();const t1=performance.now();g.c.draw();const t2=performance.now();cost.phys.push(t1-t0);cost.draw.push(t2-t1);t+=1/60;
  if(!rainShot&&a.WILD.rainLeft>3&&run('bodies.filter(b=>b.rain&&b.rb.translation().y>.3).length')>=4){rainShot=true;shot(g,'4-coin-rain');}
  if(!midShot&&t>16){midShot=true;shot(g,'3-mid-chaos');}
 }
 for(let i=0;i<90;i++)g.tick();shot(g,a.WILD.win?'5-win':'5-end-'+a.WILD.reason);
 const res={win:a.WILD.win,reason:a.WILD.reason,got:a.WILD.got,left:+a.WILD.left.toFixed(1)};
 // forced endings for the other screens
 const R=a.wildEndRects();g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);for(let i=0;i<200;i++)g.tick();
 run("WILD.have={cheese:1,shrimp:1,tuna:1,yarn:1};WILD.got=4;WILD.left=0.2");for(let i=0;i<110;i++)g.tick();shot(g,'6-lose-times-up');
 g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);for(let i=0;i<200;i++)g.tick();
 run("WILD.have={cheese:1,duck:1};WILD.got=2;S.coins=0;board.earnedQuakes=0;WILD.nextBonus=99");let k=0;while(a.WILD.phase==='play'&&k<1200){g.tick();run('WILD.nextBonus=99');k++;}for(let i=0;i<90;i++)g.tick();shot(g,'7-lose-out-of-coins');
 if(!a.WILD.win){g.pointer('pointerdown',R.again.x+R.again.w/2,R.again.y+R.again.h/2);for(let i=0;i<200;i++)g.tick();run("for(const id of WILD_COLLECTION.slice(1))WILD.have[id]=true;WILD.got=WILD_GOAL-1;");run("(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='cheese');b.rb.setTranslation({x:2,y:-0.5,z:(T.FRONT+6)*M},true);})()");for(let i=0;i<150;i++)g.tick();shot(g,'8-win');}
 g.close();
 // Same script on Board 3 (UAT 34) for comparison.
 const b=await game('../cp33/release.html',4),ab=b.c.__game,rb=s=>vm.runInContext(s,b.c);rb('selectBoard(2);S.coins=400;');const base={phys:[],draw:[]};t=0;last=-9;
 while(t<45){if(t-last>=.2){ab.tryDrop({x:200+70*Math.sin(t*1.3),y:rb('DROP_Y')});last=t;}const t0=performance.now();b.tick();const t1=performance.now();b.c.draw();const t2=performance.now();base.phys.push(t1-t0);base.draw.push(t2-t1);t+=1/60;}
 b.close();
 const st=v=>{const s=[...v].sort((x,y)=>x-y);return {avg:+(v.reduce((x,y)=>x+y,0)/v.length).toFixed(2),p95:+s[Math.floor(s.length*.95)].toFixed(2),max:+s[s.length-1].toFixed(2)};};
 const out={note:'Desktop node + @napi-rs/canvas CPU renderer, one process, hold-sweep drops every 0.2 s. phys = one 1/60 s physics step + update; draw = one frame. Not phone evidence; phone numbers come from her performance log.',wildRun:res,wild:{phys:st(cost.phys),draw:st(cost.draw)},board3UAT34:{phys:st(base.phys),draw:st(base.draw)}};
 fs.writeFileSync(path.join(O,'desktop-frame-cost.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));
})().catch(e=>{console.error(e);process.exitCode=1;});
