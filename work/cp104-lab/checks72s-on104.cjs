// UAT 104 (CP-83 round 2): copied from work/cp103/checks72s-on103.cjs; the reference adds UAT 102's edits and blocks plus this folder's cp83-lab.js (the round-2 block).
// UAT 99 check for CP-72 (Jenny, Nov 18: "remove the gold streaks"): Zoomies without the speed streaks and pusher glow.
// Renders Zoomies on the Orange board (Level 1, 360x640 at pixel ratio 2) in this build and in the base renamed to this build's
// name, every 6th frame from the tap to 0.5 s after Zoomies:
// 1 the base draws streaks/glow (pixels differ in the band above the pusher during Zoomies): the removal is real
// 2 every pixel that differs lies inside that streak band (pusher top, from the left to the right streak, 26x1.4 table px up)
// 3 outside Zoomies and outside the band the frames are identical (the pusher, kittens, pieces); the play trace is identical
// (double-speed pusher, its timing, kittens, pieces, coins); the turbo sound still plays at Zoomies' start; no frame errors
// Usage: node checks72s.cjs
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const make=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json'))),E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(__dirname,'../cp98/release.html'),ref=path.join(__dirname,'ref-base-named.html');
{let B=fs.readFileSync(base,'utf8');B=B.replace(/const BUILD = '[^']+';/,"const BUILD = '"+V.displayName+"';");const E101=JSON.parse(fs.readFileSync(path.join(__dirname,'../cp101/edits.json'),'utf8'));for(const [a,b] of E101.edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit');B=B.split(a).join(b);}for(const f of ['../cp100/cp72-ending.js','../cp101/cp82-titles.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}for(const [a,b] of JSON.parse(fs.readFileSync(path.join(__dirname,'../cp102/edits.json'),'utf8')).edits.slice(1)){if(B.split(a).length!==2)throw new Error('edit102');B=B.split(a).join(b);}for(const f of ['../cp102/cp72-peek.js','cp83-lab.js']){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}fs.writeFileSync(ref,B);} // UAT 102: the reference is UAT 101's (UAT 98 + this build's name + the UAT 100 ending block + the CP-82 edit and block) + the UAT 102 edits and cp72-peek.js, so only UAT 99's changes differ
const out=path.resolve(__dirname,'../../tickets/CP-83-evidence/uat'+V.displayName.split(' ').pop());fs.mkdirSync(out,{recursive:true});
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
async function run(file,shots){
 const g=await make({sourceFile:file,render:true,seed:7,pixelRatio:2,width:360,height:640,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.message||e).slice(0,200));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('orange');if(WILD.phase==='end')wildReset();wildStartCountdown();");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();ticks(240);for(let i=0;i<20;i++){g.tick();await new Promise(r=>setTimeout(r,5));}
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers=PG.powers||{};PG.powers.orange=1;globalThis.__turbo=[];{const w=sfx.wild;sfx.wild=function(k,...a){if(k==='turbo')__turbo.push(typeof Z72X!=='undefined'&&!!Z72X);return w.call(this,k,...a)};}");
 g.run("(()=>{const b=pgpButton();return powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");
 const cv=g.c.document.getElementById('cv'),fr=[],tr=[];let after=-1;
 for(let i=0;i<60*12;i++){g.tick();const z=g.run("typeof Z72X!=='undefined'&&!!Z72X");
  if(i%6===0){g.c.draw();const d=cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data;
   const band=z?J(g,"(()=>{const L=skyScreen(T.L+30,pusherY,22),R=skyScreen(T.R-30,pusherY,22),k=scale*renderPixelRatio;return {x0:(L.x-6)*k,x1:(R.x+6)*k,y0:(L.y-4*L.s-26*1.4*L.s-6)*k,y1:(L.y+3*L.s+6)*k};})()"):null;
   fr.push({i,z,band,d:Buffer.from(d)});tr.push(g.run("JSON.stringify([PGPX?PGPX.id:null,typeof Z72X!=='undefined'&&Z72X?Z72X.kits.map(q=>q.gone?1:0).join(''):'-',pushPhase.toFixed(4),PUSH_PERIOD,bodies.length,bodies.reduce((s,b)=>{const p=b.rb.translation();return s+p.x*3+p.y*5+p.z*7;},0).toFixed(3),S.coins])"));
   if(shots&&z&&shots.length<2&&fr.filter(f=>f.z).length%20===10){fs.writeFileSync(path.join(out,`zoomies-nostreaks-${shots.length+1}-360x640.png`),cv.toBuffer('image/png'));shots.push(1);}}
  if(!z&&g.run('!PGPX')&&fr.some(f=>f.z)){if(after<0)after=i;if(i>after+30)break;}}
 const r={fr,trace:crypto.createHash('sha256').update(tr.join('|')).digest('hex'),turbo:J(g,'__turbo'),errs:J(g,'__errs'),w:cv.width};g.close();return r;}
(async()=>{
 const A=await run(src,[]),B=await run(ref,null);
 let inBand=0,outBand=0,zFrames=0,diffZ=0,nonZDiff=0;const W=A.w;
 for(let n=0;n<Math.min(A.fr.length,B.fr.length);n++){const a=A.fr[n],b=B.fr[n];if(a.z)zFrames++;let any=false;
  for(let p=0;p<a.d.length;p+=4){if(a.d[p]!==b.d[p]||a.d[p+1]!==b.d[p+1]||a.d[p+2]!==b.d[p+2]){any=true;const px=(p/4)%W,py=Math.floor(p/4/W);
    const bd=a.band||b.band;if(bd&&px>=bd.x0&&px<=bd.x1&&py>=bd.y0&&py<=bd.y1)inBand++;else{outBand++;if(bd){const o=notes.out||(notes.out={dxL:0,dxR:0,dyT:0,dyB:0,noBand:0});o.dxL=Math.max(o.dxL,bd.x0-px);o.dxR=Math.max(o.dxR,px-bd.x1);o.dyT=Math.max(o.dyT,bd.y0-py);o.dyB=Math.max(o.dyB,py-bd.y1);}else (notes.out=notes.out||{noBand:0}).noBand++;}}}
  if(any&&a.z)diffZ++;if(any&&!a.z)nonZDiff++;}
 notes.frames={compared:Math.min(A.fr.length,B.fr.length),zoomies:zFrames,zoomiesFramesWithStreaks:diffZ,lengths:[A.fr.length,B.fr.length]};
 check('1 the base draws streaks/glow during Zoomies (changed pixels in the streak band): the removal is real',diffZ>zFrames*.5&&inBand>0,notes.frames);
 check('2 every changed pixel lies inside the old streak band above the pusher',outBand===0,{inBand,outBand,out:notes.out});
 check('3 outside Zoomies frames are identical; pusher, kittens and pieces unchanged (same play trace); the turbo still plays at Zoomies start; no errors',
  nonZDiff===0&&A.trace===B.trace&&A.fr.length===B.fr.length&&JSON.stringify(A.turbo)===JSON.stringify(B.turbo)&&A.turbo.includes(true)&&!A.errs.length&&!B.errs.length,{nonZDiff,trace:A.trace===B.trace,turbo:[A.turbo,B.turbo],errs:[A.errs,B.errs]});
 fs.writeFileSync(path.join(out,'checks72s-on104.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
