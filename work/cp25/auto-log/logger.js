// Local UAT diagnostics: bounded numeric data, no network and no gameplay state writes.
const DIAG_KEY='catpusher.uat.diagnostics.v1';
const DIAG_SAMPLE_COLUMNS=['atSec','elapsedMs','frames','fps','physicsMsPerFrame','drawMsPerFrame','maxFrameMs','framesOver25Ms','stepsPerFrame','coins','board','screen','heldFrames','heldElapsedMs','heldPhysicsTotalMs','heldDrawTotalMs','nonActivePlayFrames'];
const DIAG_DROP_COLUMNS=['atSec','inputCanvasX','requestedWorldX','releaseWorldX','releaseCanvasX','msSincePointerDelivery','pointerDispatchLagMs'];
const diagOrigin=performance.now();
const diagRound=(x,n=1)=>Number.isFinite(x)?Math.round(x*10**n)/10**n:null;
const diagAt=()=>diagRound((performance.now()-diagOrigin)/1000,2);
function diagValidSession(s){return s&&typeof s.build==='string'&&Array.isArray(s.samples)&&Array.isArray(s.drops)&&Array.isArray(s.events);}
let diagPrevious=null;
try{const raw=localStorage.getItem(DIAG_KEY);if(raw&&raw.length<150000){const saved=JSON.parse(raw),recent=saved.current,useful=recent?.drops?.length||recent?.samples?.some(row=>row[12]>0),s=useful?recent:(diagValidSession(saved.previous)?saved.previous:recent);if(diagValidSession(s)){diagPrevious={...s,samples:s.samples.slice(-120),drops:s.drops.slice(-80),events:s.events.slice(-40)};}}}catch(e){}
const diagSession={build:BUILD,startedAt:new Date().toISOString(),environment:{userAgent:typeof navigator==='object'?navigator.userAgent||'':'',cssWidth:innerWidth,cssHeight:innerHeight,devicePixelRatio:window.devicePixelRatio||1,renderPixelRatio},samples:[],drops:[],events:[]};
let diagBin=null,diagPointerX=null,diagPointerNow=null,diagPointerLag=null,diagNeedSave=false,diagLastSave=-Infinity;
function diagPush(list,item,max){list.push(item);if(list.length>max)list.splice(0,list.length-max);}
function diagEvent(kind,data=null){diagPush(diagSession.events,[diagAt(),kind,data],40);}
function diagInput(x,stamp){const now=performance.now();diagPointerX=x;diagPointerNow=now;const lag=now-stamp;diagPointerLag=Number.isFinite(lag)&&lag>=0&&lag<10000?lag:null;}
function diagBeginHold(x,stamp){diagInput(x,stamp);diagEvent('pointer-down',diagRound(x));}
function diagEndHold(reason='stop'){if(holding){diagEvent('hold-end',reason);diagNeedSave=true;}}
function diagDrop(requested,actual,canvasX){diagPush(diagSession.drops,[diagAt(),diagRound(diagPointerX),diagRound(requested),diagRound(actual),diagRound(canvasX),diagPointerNow===null?null:diagRound(performance.now()-diagPointerNow),diagRound(diagPointerLag)],80);}
function diagFinishBin(){
 const b=diagBin;if(!b||!b.frames){diagBin=null;return;}
 const screen=panel.style.display==='block'?'settings':inventoryOpen?'inventory':pickupBlocksPlay()?'pickup-paused':board.status;
 diagPush(diagSession.samples,[diagAt(),diagRound(b.ms),b.frames,diagRound(b.frames*1000/b.ms),diagRound(b.physics/b.frames,2),diagRound(b.draw/b.frames,2),diagRound(b.max),b.slow,diagRound(b.steps/b.frames,2),bodies.filter(coinSolid).length,boardIndex+1,screen,b.heldFrames,diagRound(b.heldMs),diagRound(b.heldPhysics,2),diagRound(b.heldDraw,2),b.paused],120);
 diagBin=null;
}
function diagPersist(force=false){
 if(!force&&(holding||performance.now()-diagLastSave<5000))return;
 try{localStorage.setItem(DIAG_KEY,JSON.stringify({schema:1,current:diagSession,previous:diagPrevious}));diagLastSave=performance.now();diagNeedSave=false;}catch(e){diagLastSave=performance.now();diagNeedSave=false;diagSession.storageError=e&&e.name?String(e.name):'unavailable';/* Keep in-memory export available; never retry each frame. */}
}
function diagFrame(ms,physics,drawing,steps,wasHolding){
 if(!(ms>0)||!Number.isFinite(ms))return;
 if(!diagBin)diagBin={ms:0,frames:0,physics:0,draw:0,max:0,slow:0,steps:0,heldFrames:0,heldMs:0,heldPhysics:0,heldDraw:0,paused:0};
 const b=diagBin;b.ms+=ms;b.frames++;b.physics+=physics;b.draw+=drawing;b.max=Math.max(b.max,ms);b.slow+=ms>25?1:0;b.steps+=steps;
 const paused=inventoryOpen||pickupBlocksPlay()||panel.style.display==='block'||board.status!=='playing';if(paused)b.paused++;
 if(wasHolding&&!paused){b.heldFrames++;b.heldMs+=ms;b.heldPhysics+=physics;b.heldDraw+=drawing;}
 if(wasHolding&&!holding){diagEvent('game-stopped-hold',pickupBlocksPlay()?'pickup-paused':board.status);diagNeedSave=true;}
 if(b.ms>=1000)diagFinishBin();
 if(!holding&&diagNeedSave&&performance.now()-diagLastSave>=5000){diagFinishBin();diagPersist();}
}
function diagFlush(reason){diagFinishBin();diagEvent(reason);diagNeedSave=true;diagPersist(true);}
function diagSummary(s){
 let frames=0,ms=0,hf=0,hm=0,hp=0,hd=0,max=0,slow=0;
 for(const row of s.samples){frames+=row[2];ms+=row[1];max=Math.max(max,row[6]);slow+=row[7];hf+=row[12];hm+=row[13];hp+=row[14];hd+=row[15];}
 return {retainedSamples:s.samples.length,visibleFPS:ms?diagRound(frames*1000/ms):null,activeHoldFPS:hm?diagRound(hf*1000/hm):null,activeHoldSeconds:diagRound(hm/1000),holdPhysicsMs:hf?diagRound(hp/hf,2):null,holdDrawMs:hf?diagRound(hd/hf,2):null,maxFrameMs:max,framesOver25Ms:slow};
}
function diagExport(){
 diagFlush('export');
 const session=s=>s?{...s,summary:diagSummary(s)}:null;
 return JSON.stringify({format:'CatCoin UAT performance log v1',sampleColumns:DIAG_SAMPLE_COLUMNS,dropColumns:DIAG_DROP_COLUMNS,notes:'Frames use uncapped wall intervals; background gaps excluded. Physics includes catch-up ticks. Drawing is CPU submission time. Active-hold summary excludes settings, inventory, pickup pauses and non-playing states. X coordinates use the 400-unit canvas/world; release span remains clamped. Stored locally; no automatic upload.',current:session(diagSession),previous:session(diagPrevious)});
}
function diagCopyLog(){
 const text=diagExport(),button=panel.querySelector('#copy-perf-log');
 let output=panel.querySelector('#perf-log-output');
 if(!output){output=document.createElement('textarea');output.id='perf-log-output';output.readOnly=true;output.setAttribute('aria-label','Performance log');output.style.cssText='width:100%;height:180px;box-sizing:border-box;user-select:text;-webkit-user-select:text;font:11px monospace;';panel.appendChild(output);}
 output.value=text;output.focus();output.select();output.setSelectionRange(0,text.length);
 let copied=false;try{copied=typeof document.execCommand==='function'&&document.execCommand('copy');}catch(e){}
 if(button)button.textContent=copied?'Copied performance log':'Log ready — tap and hold the text to copy';
 return {copied,text};
}
document.addEventListener('visibilitychange',()=>{if(document.hidden)diagFlush('background');else diagEvent('foreground');});
addEventListener('pagehide',()=>diagFlush('pagehide'));
diagEvent('session-start');

