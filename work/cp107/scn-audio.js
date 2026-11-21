// real Chrome: the Siamese's and the Tortie's dances with the real audio engine; counts the voices built and any error
const out={};
for(const cat of ['siamese','tortie']){
 w.eval(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=1;PG.lv.passed=Math.max(PG.lv.passed||0,PG_SWITCH_LEVEL+2);if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}if(WILD.on)wildExit();pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`);
 for(let i=0;i<60&&w.eval("WILD.phase")!=='play';i++)await sleep(250);await sleep(1500);
 w.eval("window.__mus=[];CP107.voices=0;CP107.audioErr=null;S.muted=false;try{sfx.unlock&&sfx.unlock()}catch(e){};WILD.dancePending={f:null,wait:9};");
 for(let i=0;i<40&&!w.eval('!!WILD.dance');i++)await sleep(100);
 const t0=Date.now();while(w.eval('!!WILD.dance&&WILD.dance.phase!=="finale"')&&Date.now()-t0<30000){w.eval("(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat,k=Math.floor(x);if(x>=0){const m=['A','B','C','A'][Math.min(3,Math.floor(x/16))];if(D.music!==m){D.music=m;(window.__mus||(window.__mus=[])).push(m);}}if(x-k<.35&&k>=0&&k<D.n&&!D.judged[k]&&!(D.rest&&D.rest[k]))danceTap({timeStamp:performance.now()+D.latency*1000})})()");await sleep(30);}
 out[cat]=JSON.parse(w.eval("JSON.stringify({played:window.__mus,voices:CP107.voices,audioErr:CP107.audioErr,ok:sfx._w2ok(),hits:WILD.dance&&WILD.dance.hits,taps:WILD.dance&&WILD.dance.taps,acState:(()=>{try{return sfx._dBus().context.state}catch(e){return 'n/a'}})()})"));
 await shot('chrome-'+cat);await sleep(3000);}
return out;
