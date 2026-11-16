// strict fake Web Audio, frames with exceptions caught, dance-break runs (from UAT 40/41 checks)
const {game,tapAtBeat}=require('./harness.cjs');
function strictAudio(g){const st={created:0,started:[]};const now=()=>g.ms()/1000-100;const fin=(...a)=>{for(const x of a)if(!Number.isFinite(x))throw new TypeError('non-finite audio value '+x);};
 const P=()=>({__param:true,_v:0,get value(){return this._v;},set value(x){fin(x);this._v=x;},setValueAtTime(v,t){fin(v,t);if(t<0)throw new RangeError('time');},linearRampToValueAtTime(v,t){fin(v,t);},exponentialRampToValueAtTime(v,t){fin(v,t);if(!(v>0)&&!(v<0))throw new RangeError('exp ramp to '+v);},cancelScheduledValues(t){fin(t);}});
 const node=()=>{st.created++;const n={__node:true,connect(d){if(!d||!(d.__node||d.__param||d.__dest))throw new TypeError("Failed to execute 'connect' on 'AudioNode': Overload resolution failed.");return d;},disconnect(){},start(t){if(t!==undefined)fin(t);n.t0=t??now();st.started.push(n);},stop(t){if(t!==undefined)fin(t);n.t1=t??now();},frequency:P(),gain:P(),Q:P(),detune:P(),type:'',buffer:null,loop:false,curve:null};return n;};
 g.c.AudioContext=class{constructor(){this.sampleRate=8000;this.state='running';this.destination={__dest:true};}get currentTime(){return now();}createGain(){return node();}createOscillator(){return node();}createBiquadFilter(){return node();}createBufferSource(){return node();}createWaveShaper(){return node();}createBuffer(){return {getChannelData:()=>new Float32Array(4000)};}resume(){}};
 st.live=()=>{st.started=st.started.filter(n=>!(n.t1<=now()));return st.started.length;};return st;}
// one frame as the game runs it: physics, update and draw, with exceptions caught and recorded (the real frame() would stop)
function frames(g,n,errs){for(let i=0;i<n;i++){try{g.tick();if((g.nd=(g.nd||0)+1)%20===0)g.c.draw();}catch(e){errs.push(String(e.message||e).slice(0,140));return false;}}return true;}
async function breakRun(src,v2,{perfect=true,slice=null,win=false}={}){
 const g=await game({src,seed:7,render:true});const st=strictAudio(g),errs=[];g.run('S.muted=false');g.run(v2?'wild2Enter()':'wildEnter()');g.c.__game.wildStartCountdown();frames(g,200,errs);g.run('WILD.left=170;S.coins=300');
 if(win){g.run("for(const id of WILD_COLLECTION){if(!WILD.have[id]){WILD.have[id]=true;WILD.got++;(WILD.order||(WILD.order=[])).push(id);}}board.status='playing';wildFinish(true)");frames(g,60*5,errs);
  const r={errs,visitor:!!g.run('WILD.visitor'),liveNodes:st.live()};g.close();return r;}
 if(slice!=null)g.run('w2ForceSlice='+slice);g.run('danceStartNow()');let k=0;while(!g.run('!!WILD.dance')&&k<300){if(!frames(g,1,errs))break;k++;}
 if(!g.run('!!WILD.dance')){g.close();return {errs:errs.concat('no dance')};}
 const n=g.run('WILD.dance.n');for(let b=0;b<n&&!errs.length;b++){if(!perfect&&b%5===3)continue;const target=g.run(`WILD.dance.p0+${b}*WILD.dance.beat+WILD.dance.latency`);while(g.ms()/1000<target-1/120&&frames(g,1,errs));g.tap();}
 k=0;while(g.run('!!WILD.dance')&&k<60*25&&frames(g,1,errs))k++;const t0=g.run('time');frames(g,60,errs);
 const r={errs,ended:!g.run('WILD.dance'),gameRunning:g.run('time')>t0,stage:g.run('WILD.dance&&WILD.dance.stage'),liveNodes:st.live(),nodesCreated:st.created};g.close();return r;}
module.exports={strictAudio,frames,breakRun};
