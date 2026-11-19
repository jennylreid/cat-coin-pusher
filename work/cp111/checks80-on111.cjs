// UAT 110 (CP-74): copied from work/cp109-lab/checks80-on109.cjs; the reference also gets the UAT 110 Hug swap.
// UAT 109 (CP-83): copied from work/cp108/checks80-on108.cjs; the reference adds UAT 109's edit (the CP-83 block replaced).
// UAT 107 (CP-87 Daily puzzles): copied from work/cp106-hug/checks80-on106.cjs; the reference also gets cp87-puzzles.js.
// UAT 106 (CP-74 Hug): copied from work/cp106/checks80-on106.cjs (CP-86's), with the CP-74 blocks in place of cp86-meow.js.
// UAT 105 (CP-72 final ending): copied from work/cp104-lab/checks80-on104.cjs; the reference also gets UAT 105 ending edits and cp72-small.js.
// UAT 99 checks for CP-80 (the Developer wheel on the Siamese board).
// 1 base build (as published): "Wheel lands on YAWN" on the Siamese board gives no wheel and throws at GO (the bug, reproduced)
// 2 this build: "Wheel lands on YAWN" on all 5 boards -> countdown -> the wheel after GO -> the Yawn -> back to play; no errors
// 3 normal play (no Developer button) on all 5 boards, 40 s from GO: identical to the base (pieces, coins, score, side games,
//   Dance breaks), and the Siamese still never gets a Dance break or the wheel
// Usage: node checks80.cjs | DEV=1 node checks80.cjs (on release-dev.html, published UAT 96)
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp33/runtime.cjs');
const DEV=process.env.DEV==='1',V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,DEV?'edits-dev.json':'edits.json'),'utf8'));
const src=path.resolve(__dirname,DEV?'release-dev.html':'release.html'),base=path.resolve(__dirname,'../cp98/release.html'),ref=path.join(__dirname,'ref-base-named.html');
{let B=fs.readFileSync(base,'utf8');B=B.replace(/const BUILD = '[^']+';/,"const BUILD = '"+V.displayName+"';");const E101=JSON.parse(fs.readFileSync(path.join(__dirname,'../cp101/edits.json'),'utf8'));for(const [a,b] of E101.edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit');B=B.split(a).join(b);}for(const f of ['../cp100/cp72-ending.js','../cp101/cp82-titles.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'../cp102/edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit102');B=B.split(a).join(b);}for(const f of ['../cp102/cp72-peek.js','../cp104-lab/cp83-lab.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'../cp105/edits.json'),'utf8')).edits.slice(3)){if(B.split(a).length!==2)throw new Error('edit105');B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'../cp105/cp72-small.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const f of ['../cp106-hug/cp74-art.js','../cp106-hug/cp74-hug.js','../cp107/cp87-puzzles.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'../cp108/cp86-meow.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'../cp109-lab/edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit109');B=B.split(a).join(b);}for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit110');B=B.split(a).join(b);}{const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp88-bank.js'),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} /* CP-88: + cp88-bank.js */ /* UAT 110 (CP-74): + the Hug block swapped for try 8 */ /* UAT 108: + cp86-meow.js */ /* UAT 106 (CP-74): + the CP-74 art and Hug blocks; UAT 107 (CP-87): + cp87-puzzles.js */ // UAT 102: the reference is UAT 101's (UAT 98 + this build's name + the UAT 100 ending block + the CP-82 edit and block) + the UAT 102 edits and cp72-peek.js, so only UAT 99's changes differ
const out=path.resolve(__dirname,'../../tickets/CP-88-evidence/uat'+V.displayName.split(' ').pop()+(DEV?'-dev':''));fs.mkdirSync(out,{recursive:true});
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const CATS=['tuxedo','orange','ragdoll','siamese','tortie'];
async function boot(file,cat){
 const g=await make({sourceFile:file,render:false,seed:7,width:400,height:889,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.run=s=>vm.runInContext(s,g.c);
 g.errs=[];g.tick=()=>{ms+=1000/60;try{t();}catch(e){g.errs.push(String(e&&e.message||e).slice(0,160));}};
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.message||e).slice(0,160));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run(`for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('${cat}');`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(240);g.ticks=ticks;return g;}
async function forced(file,cat){const g=await boot(file,cat);
 g.run('w2ForceWheel(W2_WHEEL.findIndex(s=>s.label==="YAWN"))');const r={phases:[],wheel:false,yawn:false,ended:false};
 for(let i=0;i<60*30;i++){g.tick();const ph=g.run('WILD.phase');if(r.phases[r.phases.length-1]!==ph)r.phases.push(ph);
  if(g.run("!!(WILD.dance&&WILD.dance.stage==='wheel')"))r.wheel=true;if(g.run('!!(W2_YAWN&&W2_YAWN.cp58)'))r.yawn=true;
  if(r.yawn&&!g.run('!!W2_YAWN')){r.ended=true;break;}}
 g.ticks(120);r.backToPlay=g.run("WILD.phase==='play'&&board.status==='playing'");r.errs=[...g.errs,...JSON.parse(g.run('JSON.stringify(__errs)'))];g.close();return r;}
async function normal(file,cat){const g=await boot(file,cat);const tr=[];let dance=0,wheel=0;
 for(let i=0;i<60*40;i++){g.tick();if(g.run('!!WILD.dance'))dance++;if(g.run("!!(WILD.dance&&WILD.dance.stage==='wheel')"))wheel++;
  if(i%30===0)tr.push(g.run("JSON.stringify([WILD.phase,bodies.length,bodies.reduce((s,b)=>{const p=b.rb.translation();return s+p.x*3+p.y*5+p.z*7;},0).toFixed(3),S.coins,!!WILD.chase,!!WILD.toss,!!WILD.petGame,!!WILD.dance])"));}
 const r={trace:crypto.createHash('sha256').update(tr.join('|')).digest('hex'),dance,wheel,errs:[...g.errs,...JSON.parse(g.run('JSON.stringify(__errs)'))]};g.close();return r;}
(async()=>{
 {const r=await forced(ref,'siamese');check('1 base build: on the Siamese board the forced wheel never comes and the game throws at GO (the reported bug)',!r.wheel&&!r.yawn&&r.errs.some(e=>/reading 'n'/.test(e)),r);}
 {const r={};let ok=true;for(const c of CATS){const x=await forced(src,c);r[c]={phases:x.phases.join('>'),wheel:x.wheel,yawn:x.yawn,ended:x.ended,back:x.backToPlay,errs:x.errs};ok=ok&&x.wheel&&x.yawn&&x.ended&&x.backToPlay&&!x.errs.length;}
  check('2 this build: "Wheel lands on YAWN" on all 5 boards gives the wheel after GO, then the Yawn, then play again; no errors',ok,r);}
 {const r={};let ok=true;for(const c of CATS){const a=await normal(src,c),b=await normal(ref,c);r[c]={same:a.trace===b.trace,dance:a.dance,wheel:a.wheel,errs:a.errs.length+b.errs.length};
   ok=ok&&a.trace===b.trace&&a.dance===b.dance&&a.wheel===b.wheel&&!a.errs.length&&!b.errs.length;if(c==='siamese')ok=ok&&a.dance===0&&a.wheel===0;}
  check('3 normal play on all 5 boards (40 s, no Developer button) is identical to the base; the Siamese still never gets a Dance break or wheel',ok,r);}
 fs.writeFileSync(path.join(out,'checks80-on111.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
