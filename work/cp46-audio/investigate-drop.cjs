// CP-46 bug hunt (Jenny, UAT 60): "the sound of a coin drop when there's no coin dropping". Logs every coin-sound trigger
// with its cause, in a round where the player drops nothing for a while and then drops coins, in UAT 59 and UAT 60.
// Usage: node investigate-drop.cjs [name=release.html ...] -> prints a summary per build and writes investigate-drop.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const BUILDS=process.argv.length>2?Object.fromEntries(process.argv.slice(2).map(x=>{const [n,f]=x.split('=');return [n,path.resolve(f)];})):{uat59:path.resolve(__dirname,'../cp59/release.html'),uat60:path.resolve(__dirname,'../cp60/release.html')};
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
async function run(name,file,seed){
 const g=await game({src:file,seed,render:false});strictAudio(g);g.run('S.muted=false;S.dev=true');
 g.run(`globalThis.__log=[];globalThis.__phase='';const L=(k,o={})=>__log.push({t:+time.toFixed(2),ph:__phase,k,...o});
  const info=b=>b?{kind:b.kind,rain:!!b.rain,input:!!b.input,fresh:!!b.fresh,c46:!!b.c46,z:+(b.rb.translation().z/M).toFixed(0),y:+(b.rb.translation().y/M).toFixed(1),age:b.mouthAt!=null?+(time-b.mouthAt).toFixed(2):null}:{};
  for(const m of ['drop','land','clink','tumble','kaching','rumble']){const o=sfx[m];sfx[m]=function(...a){L('sfx.'+m,{a:a.map(x=>typeof x==='number'?+x.toFixed(2):x)});return o.apply(this,a);};}
  const rp=recordedSfx.play;recordedSfx.play=function(n,...a){L('rec.'+n);return rp.call(this,n,...a);};
  const re=recordedSfx.edge;recordedSfx.edge=function(){L('rec.edge');return re.call(this);};
  for(const m of ['wild','wild2']){const o=sfx[m];sfx[m]=function(k,...a){if(['drip','thud','land','rain','topple'].includes(k))L('sfx.'+m+'.'+k);return o.call(this,k,...a);};}
  if(typeof C46!=='undefined'){const pv=C46.pick;C46.pick=function(set,c){const i=pv.call(this,set,c);L('C46.'+set,{variant:i});return i;};
   const h=C46.hit;C46.hit=function(b,v){L('C46.hit',{v:+v.toFixed(2),...info(b)});return h.call(this,b,v);};
   const ld=C46.land;C46.land=function(){L('C46.land');return ld.call(this);};}
  const sd=skyDrop;skyDrop=function(kind,...a){L('skyDrop',{kind});return sd.call(this,kind,...a);};`);
 // UAT 59 has no C46: log its landing/hit calls through the coin loop instead (sfx.land / sfx.clink above)
 g.ticks(140);g.tap(200,400);g.ticks(40);g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();
 g.run("__phase='idle';holding=false;S.coins=Math.max(S.coins,40)");for(let s=0;s<25&&g.run("WILD.phase==='play'");s++){g.run('WILD.left=Math.max(WILD.left,60)');g.ticks(60);}
 g.run("__phase='dropping'");for(let s=0;s<15&&g.run("WILD.phase==='play'");s++){g.run(`S.coins=Math.max(S.coins,40);holding=true;holdPos={x:200+95*Math.sin(${s}*0.7+3),y:DROP_Y};WILD.left=Math.max(WILD.left,60)`);g.ticks(60);}
 g.run("holding=false;__phase='idle2'");for(let s=0;s<15&&g.run("WILD.phase==='play'");s++){g.run('WILD.left=Math.max(WILD.left,60)');g.ticks(60);}
 const log=J(g,'__log');g.close();return log;}
(async()=>{const out={};
 for(const [name,file] of Object.entries(BUILDS)){const all=[];for(const seed of [3,7]){const log=await run(name,file,seed);all.push(...log.map(e=>({...e,seed})));}
  out[name]=all;const sum={};for(const e of all){const key=e.ph+' '+e.k+(e.k.startsWith('C46.')&&e.k!=='C46.hit'&&e.k!=='C46.land'?(e.variant<0?' current':' new'):'');sum[key]=(sum[key]||0)+1;}
  console.log('=== '+name);console.log(Object.entries(sum).sort().map(([k,v])=>k.padEnd(34)+v).join('\n'));}
 fs.writeFileSync(path.join(__dirname,process.argv.length>2?'investigate-drop-fix.json':'investigate-drop.json'),JSON.stringify(out));})().catch(e=>{console.error(e);process.exit(1);});
