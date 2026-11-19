// CP-72 question (Jenny, UAT 100, Level 7: "a bunch of prizes move inward on the board"): what moves them when Zoomies starts.
// Runs Level 7 on the Orange board (UAT 100), taps Zoomies, and logs every prize's sideways movement and which rule touched it.
// Usage: node probe-l7.cjs [seed] [guardOff]
const path=require('path'),vm=require('vm'),fs=require('fs');const make=require('../cp72/runtime.cjs'),make33=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const seed=+(process.argv[2]||1),off=process.argv[3]==='1',shots=process.env.SHOTS;
(async()=>{const src=path.resolve(__dirname,process.env.SRC||'../cp100/release.html');
 const g=shots?await make33({sourceFile:src,render:true,seed,pixelRatio:2,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}}):await make({sourceFile:src,render:false,width:400,height:889,pixelRatio:1,seed,storage:{'catpusher.uat.devdefault.v1':'1'}});
 if(shots)g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true");const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(6,PG_SWITCH_LEVEL);PG.lv.sel=7;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<600;i++){if(i%30===0)tap(200+110*Math.sin(i/60*1.2+seed),560);g.tick();}
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=2;");
 const lvl=g.run("JSON.stringify({sel:pglSel(),name:(typeof pglInfo==='function'?pglInfo():null)})");
 const items=()=>JSON.parse(g.run("JSON.stringify(bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return {id:b.id,x:+(q.x/M).toFixed(1),z:+(q.z/M).toFixed(1),edge:+(tableHalfAt(Math.min(T.FRONT,q.z/M))-z72R(b)*1.1).toFixed(1)}}))"));
 // tag which rule moves each prize: the kittens' shove (X.taken) vs the side guard (|x-200| > edge -> pushed inward)
 g.run("globalThis.__guard={};{const b0=z72Tick;z72Tick=function(dt){const X=Z72X;const before=X?bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>[b,b.rb.translation().x/M]):[];const e0=Z72.stats.eased|0;b0(dt);if(X)for(const [b,x] of before){const q=b.rb.translation(),z=q.z/M,edge=tableHalfAt(Math.min(T.FRONT,z))-z72R(b)*1.1;if(z<T.FRONT-6&&z>=pusherY&&Math.abs(x-200)>edge)__guard[b.id]=(__guard[b.id]||0)+1;}};}");
 if(off)g.run("{const z0=z72Tick;z72Tick=function(dt){const th=tableHalfAt;tableHalfAt=z=>1e9;try{return z0(dt);}finally{tableHalfAt=th;}};}"); 
 const A=items();if(shots){g.c.draw();fs.writeFileSync(path.join(shots,'level7-before-412x915.png'),g.c.document.getElementById('cv').toBuffer('image/png'));}
 g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");
 for(let i=0;i<Math.round(1.25*60)+60;i++)g.tick();const SIDE0=+g.run('Z72.stats.anySide');
 if(shots){g.c.draw();fs.writeFileSync(path.join(shots,'level7-1s-412x915.png'),g.c.document.getElementById('cv').toBuffer('image/png'));}
 const B=items();if(process.env.FULL){for(let i=0;i<9*60&&g.run('!!PGPX');i++)g.tick();console.error(JSON.stringify({off,seed,sideFallsDuringZoomies:+g.run('Z72.stats.anySide'),prizesLeft:items().length}));}const taken=JSON.parse(g.run("JSON.stringify(Z72X?[...Z72X.taken].map(b=>b.id):[])"));const guard=JSON.parse(g.run('JSON.stringify(__guard)'));
 const moves=A.map(a=>{const b=B.find(x=>x.id===a.id);return b?{id:a.id,x0:a.x,x1:b.x,dx:+(b.x-a.x).toFixed(1),z0:a.z,z1:b.z,sideGap0:+(a.edge-Math.abs(a.x-200)).toFixed(1),guardFrames:guard[a.id]||0,kitten:taken.includes(a.id)}:{id:a.id,gone:true}});
 console.log(JSON.stringify({lvl,seed,eased:g.run('Z72.stats.eased|0'),tableHalfFront:+g.run('tableHalfAt(T.FRONT)').toFixed(1),tableHalfBack:+g.run('tableHalfAt(pusherY+20)').toFixed(1),moves},null,0));g.close();})().catch(e=>{console.error(e);process.exit(1)});
