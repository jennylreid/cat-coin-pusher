// CP-50 real-game screenshots: Home goal line, a round's goal row (start and with prizes collected), the end card
// (2, 5 and 8 prizes), Album and Kitchen, at the four phone sizes. Developer off. Draw only; nothing injected but test state.
// Usage: node shots.cjs SRC OUTDIR TAG [sizes e.g. 360x640,412x915] [what e.g. home,round,end,album,kitchen]
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const src=path.resolve(process.argv[2]),OUT=path.resolve(process.argv[3]),TAG=process.argv[4]||'shot';fs.mkdirSync(OUT,{recursive:true});
const sizes=(process.argv[5]||'360x640,360x780,393x852,412x915').split(',').map(s=>s.split('x').map(Number));
const what=(process.argv[6]||'home,round,end,album,kitchen').split(',');
async function game(o){const g=await make({sourceFile:src,render:true,seed:5,pixelRatio:2,...o});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 g.run=s=>vm.runInContext(s,g.c);g.ticks=n=>{for(let i=0;i<n;i++)g.tick();};g.until=(c,m=1200)=>{let k=0;while(!g.run(c)&&k<m){g.tick();k++;}return k<m;};
 g.tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");return g;}
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
async function home(w,h,passed,sel){const st={'catpusher.uat.devdefault.v1':'1'};
 const g=await game({storage:st,width:w,height:h});g.run('S.dev=false;S.muted=true');g.ticks(150);g.tap(200,700);g.ticks(40);
 g.run(`pglLv().passed=${passed};pglLv().sel=${sel};PG.shown={kitchen:1,album:1};PG.ever={cheese:1,shrimp:1,egg:1,milk:1,sardine:1,biscuit:1,feather:1};PG.items={cheese:2,shrimp:1,egg:3,milk:1,sardine:1,biscuit:1};PG.recipes={tunadish:1};pgSave();if(WILD.phase==='card')wildReset();`);
 g.ticks(30);g.run("PGA.coins&&(PGA.coins.length=0);PGA.seeded=1;");g.c.draw();return g;}
const info=[];
(async()=>{
 for(const [w,h] of sizes){const sz=w+'x'+h;
  if(what.includes('home')){for(const [p,s] of [[0,1],[1,2],[9,10]]){const g=await home(w,h,p,s);shot(g,`${TAG}-home-L${s}-${sz}`);info.push({sz,shot:'home L'+s,errs:J(g,'__errs')});}}
  if(what.includes('round')){for(const [p,s,got] of [[0,1,[]],[0,1,['cheese']],[1,2,[]],[1,2,'two'],[9,10,'two']]){
    const g=await home(w,h,p,s);const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);g.until("WILD.phase==='play'",900);g.ticks(70);
    const ids=got==='two'?J(g,'WILD_COLLECTION.slice(0,2)'):got;
    g.run(`for(const id of ${JSON.stringify(ids)}){WILD.have[id]=true;const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);if(b)removeCoin(b);}WILD.got=${ids.length};`);g.ticks(20);
    const n=`${TAG}-round-L${s}-${ids.length}got-${sz}`;shot(g,n);info.push({sz,shot:n,errs:J(g,'__errs'),goal:J(g,'WILD_COLLECTION'),items:J(g,"bodies.filter(b=>!b.dead&&b.kind==='item').map(b=>{const q=b.rb.translation();return [b.id,Math.round(q.x/M),Math.round(q.z/M)]})"),chin:J(g,'w43ChinY()'),VIEWy:J(g,'VIEW.y'),hb:J(g,'hudLayout().headerBottom'),row:J(g,'globalThis.CP50_ROW||null')});}}
  if(what.includes('end')){for(const [p,s] of [[0,1],[1,2],[9,10]]){
    const g=await home(w,h,p,s);const pl=J(g,'PGA.L.play');g.tap(pl.x+pl.w/2,pl.y+pl.h/2);g.until("WILD.phase==='play'",900);g.ticks(30);
    g.run(`const id=WILD_COLLECTION[0];WILD.have[id]=true;WILD.got=1;WILD.left=.05;`);g.until("WILD.phase==='end'",600);g.ticks(100);
    const n=`${TAG}-end-L${s}-${sz}`;shot(g,n);info.push({sz,shot:n,errs:J(g,'__errs')});}}
  if(what.includes('album')){const g=await home(w,h,1,2);g.run("pgGo('album');PGU.album.page=0;");g.ticks(40);shot(g,`${TAG}-album-${sz}`);info.push({sz,shot:'album',errs:J(g,'__errs'),back:J(g,'pgBack()')});}
  if(what.includes('kitchen')){const g=await home(w,h,2,3);g.run("pgGo('kitchen');");g.ticks(40);shot(g,`${TAG}-kitchen-${sz}`);info.push({sz,shot:'kitchen',errs:J(g,'__errs')});}
 }
 fs.writeFileSync(path.join(OUT,TAG+'-shots.json'),JSON.stringify(info,null,1));console.log(JSON.stringify(info));
})().catch(e=>{console.error(e);process.exit(1)});
