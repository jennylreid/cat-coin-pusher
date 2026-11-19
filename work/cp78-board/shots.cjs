// CP-78 real-game stills (from CP-69's work/cp88/browser.cjs). Headless Chrome on a local server (PORT env, default 8878, serving CoinPusher/).
// Usage: node work/cp78-board/shots.cjs <runtime folder under work/cp78-board> <out folder> [frames]
// Stills: for each (level, cat) and each size: idle, then mid-Yawn (the wheel's Yawn, cp58StartYawn). With "frames": 412x915 Yawn frame sequence.
const {spawn}=require('child_process'),fs=require('fs'),os=require('os'),path=require('path');
const [RT,OUT,MODE]=process.argv.slice(2),E=path.resolve(OUT),PORT=process.env.PORT||8878,DBG=9700+Math.floor(Math.random()*200);
fs.mkdirSync(E,{recursive:true});const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const CASES=JSON.parse(process.env.CASES||'[[9,"tuxedo"],[1,"orange"],[5,"ragdoll"]]'),SIZES=[[412,915],[360,640]],YAWN_AT=+(process.env.YAWN_AT||1500);
(async()=>{const ch=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--no-first-run','--autoplay-policy=no-user-gesture-required','--user-data-dir='+fs.mkdtempSync(path.join(os.tmpdir(),'cp78-')),'--remote-debugging-port='+DBG,'about:blank'],{stdio:'ignore'});
try{let list;for(let i=0;i<50;i++){try{list=await(await fetch(`http://127.0.0.1:${DBG}/json/list`)).json();break;}catch(e){await sleep(200);}}
const ws=new WebSocket(list[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0,pending={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id){pending[d.id](d);delete pending[d.id];}};
const call=(method,params={})=>new Promise(r=>{const i=++id;pending[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
const run=async expression=>{const d=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(d.result.exceptionDetails)throw Error(JSON.stringify(d.result.exceptionDetails).slice(0,600));return d.result.result.value;};
const shot=async f=>{const s=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(path.join(E,f),Buffer.from(s.result.data,'base64'));};
const size=async(w,h)=>{await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:+(process.env.DPR||1),mobile:true});await sleep(250);};
await call('Page.enable');await call('Runtime.enable');await size(412,915);
await call('Page.navigate',{url:`http://127.0.0.1:${PORT}/work/cp78-board/${RT}/index.html`});
for(let i=0;i<150;i++){await sleep(200);if(await run("typeof PGU!=='undefined'&&typeof ART!=='undefined'&&!!ART.head&&typeof bodies!=='undefined'&&bodies.length>0"))break;}
const log={build:await run('BUILD'),cases:[]};
await run("globalThis.__errors=[];window.addEventListener('error',e=>__errors.push(e.message));window.Android={checkUpdates(){}};if(!PG)pgInit();PGU.title.t=9;pgTitleDone();");
const start=async(lv,cat)=>{await run(`PG.lv.passed=10;PG.lv.sel=${lv};PGU.boardCat='${cat}';wildReset();PGU.screen='board';pgStartRound();`);
 for(let i=0;i<90;i++){await sleep(100);if(await run("WILD.phase==='play'"))break;}
 await run(`PGU.boardCat='${cat}';WILD.left=99;WILD.nextBonus=999;`);await sleep(1500);if(process.env.PRE)await run(process.env.PRE);};
const yawn=()=>run("WILD.left=99;WILD.nextBonus=999;cp58StartYawn();");
if(MODE==='frames'){const [lv,cat]=CASES[0];await start(lv,cat);await size(412,915);await sleep(400);fs.mkdirSync(path.join(E,'frames'),{recursive:true});await yawn();
 const t0=Date.now();for(let i=0;i<120;i++){await shot(`frames/${String(i).padStart(3,'0')}.png`);const next=t0+(i+1)*50;await sleep(Math.max(0,next-Date.now()));}log.frameMs=(Date.now()-t0)/120;}
else if(MODE==='anims'){await size(412,915);for(const cat of ['tuxedo','orange','ragdoll','siamese','tortie']){await start(3,cat);
 await run(`WILD.left=99;WILD.nextBonus=999;PG.powers['${cat}']=3;pgpUse('${cat}');`);for(const t of [1600,3200,5000]){await sleep(t===1600?1600:t===3200?1600:1800);await shot(`anim-${cat}-power-${t}.png`);}await sleep(4000);}
 await run("WILD.left=99;danceStartNow();");for(const t of [1500,3500,6000,9000]){await sleep(t===1500?1500:t===3500?2000:t===6000?2500:3000);await shot(`anim-dance-${t}.png`);}}
else for(const [lv,cat] of CASES){await start(lv,cat);const c={lv,cat,playing:await run("WILD.phase==='play'"),boardCat:await run('PGU.boardCat')};
 for(const [w,h] of SIZES){await size(w,h);await sleep(700);await shot(`L${lv}-${cat}-${w}x${h}-idle.png`);await yawn();await sleep(YAWN_AT);await shot(`L${lv}-${cat}-${w}x${h}-yawn.png`);await sleep(4500);}
 log.cases.push(c);}
if(process.env.POST)log.post=await run(process.env.POST);log.errors=await run('__errors');fs.writeFileSync(path.join(E,'shots-log.json'),JSON.stringify(log,null,2));console.log(JSON.stringify(log));ws.close();
}finally{ch.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
