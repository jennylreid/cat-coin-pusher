const {spawn}=require('child_process'),fs=require('fs'),os=require('os'),path=require('path');
const E=path.resolve('tickets/CP-69-evidence/uat88'),sleep=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{const ch=spawn('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-first-run','--user-data-dir='+fs.mkdtempSync(path.join(os.tmpdir(),'cp88-')),'--remote-debugging-port=9668','about:blank'],{stdio:'ignore'});
try{let list;for(let i=0;i<50;i++){try{list=await(await fetch('http://127.0.0.1:9668/json/list')).json();break;}catch(e){await sleep(200);}}
const ws=new WebSocket(list[0].webSocketDebuggerUrl);await new Promise(r=>ws.onopen=r);let id=0,pending={};ws.onmessage=m=>{const d=JSON.parse(m.data);if(d.id){pending[d.id](d);delete pending[d.id];}};
const call=(method,params={})=>new Promise(r=>{const i=++id;pending[i]=r;ws.send(JSON.stringify({id:i,method,params}));});
const run=async expression=>{const d=await call('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(d.result.exceptionDetails)throw Error(JSON.stringify(d.result.exceptionDetails));return d.result.result.value;};
await call('Page.enable');await call('Runtime.enable');await call('Emulation.setDeviceMetricsOverride',{width:412,height:915,deviceScaleFactor:1,mobile:true});
await call('Page.navigate',{url:'http://127.0.0.1:8795/work/cp88/boot88/index.html'});
for(let i=0;i<100;i++){await sleep(200);if(await run("typeof PGU!=='undefined'&&typeof WILD_ART!=='undefined'&&!!WILD_ART['cp69-cane']&&typeof bodies!=='undefined'&&bodies.length>0"))break;}
const boot=await run("({build:BUILD,title:PGU.screen==='title',art:['hat','bowtie','monocle','cane'].every(k=>!!WILD_ART['cp69-'+k])})");
await run("globalThis.__errors=[];window.addEventListener('error',e=>__errors.push(e.message));S.dev=true;window.Android={checkUpdates(){}};openCredits();");
const dev=await run("({labels:Array.from(document.querySelectorAll('#cp70-main button')).map(n=>n.textContent),closed:!document.querySelector('#cp70-engineer').open,engineerButtons:document.querySelectorAll('#cp70-engineer button').length,allIDs:Array.from(panel.querySelectorAll('[id]')).map(n=>n.id)})");
fs.writeFileSync(E+'/developer.json',JSON.stringify(dev,null,2));
const handlers=await run("(()=>{const n=S.coins;panel.querySelector('[data-coins=\"1000\"]').click();const coins=S.coins===n+1000;panel.querySelector('#pgt-powers').click();const powers=PG_CATS.every(c=>pgpCount(c)===3);panel.querySelector('#cp70-engineer').open=true;openCredits();return {coins,powers,collapsedAgain:!panel.querySelector('#cp70-engineer').open,handlerIDs:['pgl-all','pgl-pass','pgt-reset','pg-give','pgt-powers','pgt-cats','dance-now','w2-spin','cp64-now','pg-visit','pg-reset'].every(id=>typeof document.getElementById(id).onclick==='function')};})()");
fs.writeFileSync(E+'/developer-handlers.json',JSON.stringify(handlers,null,2));if(Object.values(handlers).some(x=>!x))throw Error('Developer handlers failed');
await run("panel.style.display='none';if(!PG)pgInit();PGU.title.t=9;pgTitleDone();PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';pgStartRound();");
for(let i=0;i<90;i++){await sleep(100);if(await run("WILD.phase==='play'"))break;}
boot.play=await run("WILD.phase==='play'");
for(const [w,h]of [[412,915],[360,640]]){
await call('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:true});await sleep(200);
await run("WILD.left=60;WILD.nextBonus=999;PGU.boardCat='tuxedo';PG.powers.tuxedo=3;CP63X=null;PGPX=null;pgpUse('tuxedo');");
await sleep(1350);const shot=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${E}/power-${w}x${h}.png`,Buffer.from(shot.result.data,'base64'));
await sleep(1400);const sh=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${E}/sweep-${w}x${h}.png`,Buffer.from(sh.result.data,'base64'));await sleep(2000);
}
await call('Emulation.setDeviceMetricsOverride',{width:412,height:915,deviceScaleFactor:1,mobile:true});await sleep(200);
await run("WILD.left=60;WILD.nextBonus=999;PG.powers.tuxedo=3;pgpUse('tuxedo');");
fs.mkdirSync(E+'/frames',{recursive:true});for(let i=0;i<50;i++){const sh=await call('Page.captureScreenshot',{format:'png'});fs.writeFileSync(`${E}/frames/${String(i).padStart(3,'0')}.png`,Buffer.from(sh.result.data,'base64'));await sleep(70);}
boot.errors=await run('__errors');boot.cleaned=await run('!CP63X');fs.writeFileSync(E+'/real-browser-boot.json',JSON.stringify(boot,null,2));console.log(JSON.stringify(boot));ws.close();if(!boot.title||!boot.play||boot.errors.length)process.exitCode=1;
}finally{ch.kill();}})().catch(e=>{console.error(e);process.exitCode=1;});
