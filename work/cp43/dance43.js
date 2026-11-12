// ---------- UAT 43: dance taps are logged, and the player's tap offset is learned ----------
// Every dance tap records its signed offset from the nearest beat (raw, before any allowance) and whether it banked.
// At the end of the break a 'dance-taps' event goes in the performance log: the offsets (ms), mean, median, spread,
// the allowance used, and the device's reported audio output delay. With "Auto tap offset" on (default), the game
// learns the player's offset from their taps, from the count-in on: after 3 taps near a beat, the allowance becomes the
// median of the last 6 (clamped -0.05..0.30 s) from the next tap on, and the break's median is saved for the next one.
const DANCE_OFFSET_KEY='catpusher.uat.danceoffset.v1';
let DANCE_LEARNED=null;try{const raw=localStorage.getItem(DANCE_OFFSET_KEY);if(raw!==null&&Number.isFinite(+raw))DANCE_LEARNED=+raw;}catch(e){}
DANCE_DIALS.auto=[0,1,1,'Auto tap offset',''];DANCE.auto=1;
try{const d=JSON.parse(localStorage.getItem(DANCE_KEY)||'null');if(d&&(d.auto===0||d.auto===1))DANCE.auto=d.auto;}catch(e){}
function danceMedian(a){const s=[...a].sort((x,y)=>x-y),m=s.length>>1;return s.length%2?s[m]:(s[m-1]+s[m])/2;}
function danceClampOffset(x){return Math.max(-.05,Math.min(.3,x));}
const __d43Start=danceStart,__d43Tap=danceTap,__d43Finale=danceFinale,__d43DialText=danceDialText,__d43DevHtml=danceDevHtml,__d43Bind=wildDevBind;
danceStart=function(){
 __d43Start();const D=WILD.dance;if(!D)return;
 D.offsets=[];D.tapLog=[];if(DANCE.auto&&DANCE_LEARNED!=null)D.latency=DANCE_LEARNED;D.latency0=D.latency;
};
danceTap=function(e){
 const D=WILD.dance;if(!D||D.phase==='finale'||!D.offsets)return __d43Tap(e);
 const now=danceNow(),stamp=e&&Number.isFinite(e.timeStamp)&&e.timeStamp>0&&Math.abs(performance.now()-e.timeStamp)<500?e.timeStamp/1000:now;
 const k0=Math.round((stamp-D.p0)/D.beat),raw=stamp-(D.p0+k0*D.beat),h0=D.hits,m0=D.misses;
 __d43Tap(e);
 const res=D.hits>h0?'hit':D.misses>m0?'miss':k0<0?'count':'-';
 if(D.tapLog.length<80)D.tapLog.push([k0,Math.round(raw*1000),res]);
 if(Math.abs(raw)<=.3&&k0>=-DANCE_COUNT_IN&&k0<D.n){D.offsets.push(raw);
  if(DANCE.auto&&D.offsets.length>=3)D.latency=danceClampOffset(danceMedian(D.offsets.slice(-6)));}
};
danceFinale=function(D){
 try{
  const o=D.offsets||[],ms=o.map(x=>Math.round(x*1000)),mean=o.length?o.reduce((s,x)=>s+x,0)/o.length:0,sd=o.length>1?Math.sqrt(o.reduce((s,x)=>s+(x-mean)*(x-mean),0)/(o.length-1)):0;
  if(o.length>=4&&DANCE.auto){DANCE_LEARNED=danceClampOffset(danceMedian(o));try{localStorage.setItem(DANCE_OFFSET_KEY,String(+DANCE_LEARNED.toFixed(3)));}catch(e){}}
  diagEvent('dance-taps',JSON.stringify({hits:D.hits,beats:D.n,taps:(D.tapLog||[]).length,offsetsMs:ms,meanMs:Math.round(mean*1000),medianMs:o.length?Math.round(danceMedian(o)*1000):null,sdMs:Math.round(sd*1000),
   allowanceStartMs:Math.round((D.latency0??D.latency)*1000),allowanceEndMs:Math.round(D.latency*1000),windowMs:Math.round(D.window*1000),learnedMs:DANCE_LEARNED==null?null:Math.round(DANCE_LEARNED*1000),
   audioOutMs:Math.round(sfx.danceLatency()*1000),auto:!!DANCE.auto,log:(D.tapLog||[]).slice(0,40)}));
 }catch(e){}
 return __d43Finale(D);
};
danceDialText=function(k){if(k==='auto')return 'Auto tap offset: '+(DANCE.auto?'on':'off')+(DANCE_LEARNED==null?' (nothing learned yet)':' (learned '+Math.round(DANCE_LEARNED*1000)+' ms)');return __d43DialText(k);};
danceDevHtml=function(){return __d43DevHtml().replace('<button id="dance-dev-reset" class="wide">','<button id="dance-forget-offset" class="wide">Forget the learned tap offset</button><button id="dance-dev-reset" class="wide">');};
wildDevBind=function(panel){__d43Bind(panel);const b=panel.querySelector&&panel.querySelector('#dance-forget-offset');if(b)b.onclick=()=>{DANCE_LEARNED=null;try{localStorage.removeItem(DANCE_OFFSET_KEY);}catch(e){}const top=panel.scrollTop;openCredits();panel.scrollTop=top;};};

// --- every tap has an outcome you can see and hear (Jenny: "can't tell a miss from a tap that didn't register") ---
// A banked beat keeps its effect (the notes join, the ring flashes gold, the coin chime). A tap that banks nothing gets
// the same-size negative: the two notes crack apart, a red ✕ pops at the ring and a muted "bonk" plays. Every tap also
// leaves a tick on the lane where it landed: left of the ring = early, right = late (gold for a hit, red for a miss,
// white for a count-in tap), so the player can see their timing and the auto offset at work.
const __d43TapFb=danceTap,__d43Draw=danceDraw;
danceTap=function(e){
 const D=WILD.dance;if(!D||D.phase==='finale')return __d43TapFb(e);
 const h0=D.hits;const before=D.tapLog?D.tapLog.length:0;__d43TapFb(e);
 const last=D.tapLog&&D.tapLog.length>before?D.tapLog[D.tapLog.length-1]:null,k0=last?last[0]:0,rawMs=last?last[1]:0;
 // offset shown against the beat the player was aiming at, after the allowance (what the judge used)
 const b=D.beat,o=rawMs/1000-D.latency,off=((o+b/2)%b+b)%b-b/2,hit=D.hits>h0,count=k0<0&&!hit; // within ±half a beat, as the judge sees it
 (D.fb||(D.fb=[])).push({t:0,hit,count,off});if(D.fb.length>12)D.fb.shift();
 if(!hit&&!count)sfx.wild43&&sfx.wild43('bonk',1);else if(count)sfx.dance('count',.5,0,900);
};
danceDraw=function(){
 __d43Draw();const D=WILD.dance;if(!D||!D.fb||D.phase==='finale')return;const Y=DANCE_LANE_Y;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const now=performance.now();if(D.fbT===undefined)D.fbT=now;const dt=Math.min(.1,(now-D.fbT)/1000);D.fbT=now;
 let fresh=0;
 for(const f of D.fb){f.t+=dt;const px=Math.max(-62,Math.min(62,f.off/D.beat*68)),a=Math.max(.25,1-f.t/1.6);
  ctx.globalAlpha=a;ctx.fillStyle=f.hit?'#ffd23f':f.count?'#ffffff':'#ff5a5a';ctx.fillRect(200+px-1.5,Y+11,3,10);if(f.t<1.2)fresh++;}
 ctx.globalAlpha=1;
 if(fresh){ctx.font='bold 9px system-ui';ctx.fillStyle='rgba(255,224,244,.75)';ctx.fillText('EARLY',148,Y+16);ctx.fillText('LATE',252,Y+16);}
 const m=[...D.fb].reverse().find(f=>!f.hit&&!f.count);
 if(m&&m.t<.55){const u=m.t/.55,s=u<.15?.6+u/.15*.6:1.2-.2*Math.min(1,(u-.15)/.2);
  // the two notes crack apart from the ring
  ctx.globalAlpha=1-u;for(const side of [-1,1]){ctx.save();ctx.translate(200+side*(16+46*u),Y-4*u);ctx.rotate(side*u*1.2);danceNoteGlyph(0,0,.9,'#ff7a7a');ctx.restore();}
  ctx.strokeStyle='#ff5a5a';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(196,Y-18);ctx.lineTo(202,Y-6);ctx.lineTo(197,Y+4);ctx.lineTo(203,Y+16);ctx.stroke();
  // and a red ✕ pops at the ring
  ctx.save();ctx.translate(200,Y);ctx.scale(s,s);ctx.lineCap='round';ctx.strokeStyle='#2a0010';ctx.lineWidth=11;ctx.beginPath();ctx.moveTo(-13,-13);ctx.lineTo(13,13);ctx.moveTo(13,-13);ctx.lineTo(-13,13);ctx.stroke();
  ctx.strokeStyle='#ff4b4b';ctx.lineWidth=7;ctx.stroke();ctx.restore();}
 ctx.restore();
};
