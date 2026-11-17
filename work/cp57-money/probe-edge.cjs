// CP-57: what plays TODAY when each kind of piece goes over the front edge (UAT 71 source, real runtime).
// Each piece is made with the game's addCoin at the front and handed to the game's own fallOff; every sound call is logged.
// Usage: node probe-edge.cjs [release.html]   -> tickets/CP-57-evidence/edge-sounds-today.json
const {game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||path.join(__dirname,'../cp71/release.html'));
const OUT=path.resolve(__dirname,'../../tickets/CP-57-evidence');fs.mkdirSync(OUT,{recursive:true});
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
const CASES=[['prize (cheese)','item','cheese'],['prize (Jingle bell / Cat bell)','item','bell'],['prize (yarn)','item','yarn'],
 ['plain coin','coin',null],['plain rain coin (from a coin rain)','coin',null,true],['gold 5 rain coin','gold5',null],
 ['Coin rain 5','rain5',null],['Coin rain 10','rain10',null],['Coin rain 25','rain25',null],
 ['Quake coin','quake',null],['music note coin (Dance)','note',null],['fish coin','fish',null],['laser coin','laser',null],['heart coin','heart',null],['mouse coin (Pounce)','mousecoin',null],
 ['recipe coin','recipecoin',null]];
(async()=>{const g=await game({src,seed:5});strictAudio(g);g.run('S.muted=false;S.dev=false');
 g.ticks(140);g.run('if(PGU.screen==="title"){PGU.title.t=9;pgTitleDone();}');g.ticks(40);
 if(g.run('WILD.phase')!=='play'){g.run('wildStartCountdown()');let k=0;while(g.run('WILD.phase')!=='play'&&k++<900)g.tick();}
 g.run(`globalThis.__S=[];const L=(n,a)=>__S.push(n+(a&&a.length?'('+a.filter(x=>typeof x!=='object').map(x=>typeof x==='number'?+x.toFixed(2):x).join(',')+')':''));
  for(const m of Object.keys(sfx)){const o=sfx[m];if(typeof o!=='function'||m.startsWith('_')||['unlock','danceLatency','bgmBus','bgm','mus','fx46','slide'].includes(m))continue;sfx[m]=function(...a){L('sfx.'+m,a);return o.apply(this,a);};}
  const rp=recordedSfx.play;recordedSfx.play=function(n,...a){L('recording '+n);return rp.call(this,n,...a);};
  for(const m of ['play','edge','goldPaid']){const o=C46[m];C46[m]=function(...a){L('C46.'+m,a.filter(x=>typeof x==='string'));return o.apply(this,a);};}
  const lb=ledgeBell;ledgeBell=function(){L('ledgeBell');return lb.call(this);};`);
 const res={};
 for(const [label,kind,id,rain] of CASES){
  g.run('__S.length=0;board.status="playing";if(WILD.phase!=="play")WILD.phase="play";');
  let r;try{r=g.run(`(()=>{const b=addCoin('${kind}',${id?`'${id}'`:'null'},200,8,TABLE_FRONT_TEST);${rain?'b.rain=true;':''}fallOff(b,200);return 'ok';})()`.replace('TABLE_FRONT_TEST','T.FRONT-2'));}catch(e){r='error: '+String(e.message).slice(0,120);}
  g.ticks(90); // let the flight land (thump / special on arrival)
  res[label]={kind,id,result:r,sounds:J(g,'__S')};console.log(label.padEnd(36),JSON.stringify(res[label].sounds));}
 fs.writeFileSync(path.join(OUT,'edge-sounds-today.json'),JSON.stringify({build:src,cases:res},null,1));g.close();})().catch(e=>{console.error(e);process.exit(1)});
