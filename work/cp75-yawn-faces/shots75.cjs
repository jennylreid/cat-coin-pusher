// CP-75 Step 1 stills: each cat's wheel Yawn in the real game, today (work/cp94/release.html, published UAT 94 source)
// vs new (proto.html = the same + cp75-yawn.js). Opens the cat's own board (pgPlay), starts the wheel's YAWN slice,
// shoots the yawn peak (t=1.0) and the eating eyes (t=3.6, if a food prize was grabbed).
// Usage: node shots75.cjs [sizes] [cats] -> tickets/CP-75-evidence/raw/<variant>-<cat>-<shot>-<size>.png + info JSON
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const OUT=path.resolve(__dirname,'../../tickets/CP-75-evidence/raw');fs.mkdirSync(OUT,{recursive:true});
const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
const cats=(process.argv[3]||'tuxedo,orange,ragdoll,siamese,tortie').split(',');
const V={today:path.resolve(__dirname,'../cp94/release.html'),new:path.join(__dirname,'proto.html')};
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{const info=[];for(const [w,h] of sizes)for(const cat of cats)for(const [vn,src] of Object.entries(V)){
 if(cat==='tuxedo'&&vn==='new'&&!process.env.TUX)continue; // the Tuxedo is unchanged (same code path, original art)
 const sz=w+'x'+h;
 const g=await make({sourceFile:src,render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run(`for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('${cat}');`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){if(g.run("WILD.phase")==='card'){g.c.draw();const pl=J(g,'(typeof PGA==="object"&&PGA.L&&PGA.L.play)||null');if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2);}g.tick();}
 ticks(240);for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));} // art copies and loads settle
 g.run('WILD.nextBonus=999;WILD.left=60;');
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 const shot=n=>{g.c.draw();fs.writeFileSync(path.join(OUT,`${vn}-${cat}-${n}-${sz}.png`),g.c.document.getElementById('cv').toBuffer('image/png'));};
 const at=s=>{let n=0;while(!(g.run('W2_YAWN&&W2_YAWN.t')>=s)&&n++<2000)g.tick();};
 at(1.0);shot('yawn');const grabs=J(g,'W2_YAWN?W2_YAWN.grabs.map(x=>({id:x.id,coins:!!x.coins})):null');at(3.62);const eat=g.run('!!(W2_YAWN&&W2_YAWN.grabs[0]&&!W2_YAWN.grabs[0].coins&&W2_YAWN.grabs.some(x=>x.held))');shot('eat');
 info.push({sz,cat,vn,phase:g.run('WILD.phase'),boardCat:g.run('PGU.boardCat'),cp75:g.run("typeof CP75_CAT==='string'?CP75_CAT:null"),grabs,eat,errs:J(g,'__errs')});g.close();console.error(sz,cat,vn,'done');}
 fs.writeFileSync(path.join(OUT,'info.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
