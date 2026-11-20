// UAT 106 checks (CP-74 Hug with Codex's art; Jenny, Nov 18: "CP-74 Hug layout: approved. Title first, then the hug with no
// words over it; small phones arms only is fine. Then Codex art."). Usage: node checks106.cjs -> tickets/CP-74-evidence/uat106/checks106-on123.json
const fs=require('fs'),path=require('path'),crypto=require('crypto'),vm=require('vm');
const {game}=require('../cp43/harness.cjs');const make=require('../cp33/runtime.cjs');
const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const V=JSON.parse(fs.readFileSync(path.join(__dirname,'release-version.json')));
const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));
const src=path.resolve(__dirname,'release.html'),base=path.resolve(E.base),out=path.resolve(__dirname,'../../tickets/CP-97-evidence/uat123');fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],notes={};function check(n,b,info){(b?passed:failed).push(n);console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,1500):''));}
const J=(g,s)=>JSON.parse(g.run('JSON.stringify('+s+')'));
const ART=path.resolve(__dirname,'../cp74-art/revision2');
async function boot(file,seed){const g=await game({src:file,seed,render:false});
 g.run('S.muted=true;S.dev=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}');
 g.ticks(150);g.tap(200,700);g.ticks(30);g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");return g;}
async function ragdollRound(file,seed,lv=3){const g=await boot(file,seed);
 g.run(`PG.current='ragdoll';const L=pglLv();L.passed=Math.max(L.passed,${lv-1});L.sel=${lv};pgPlay('ragdoll');if(WILD.phase!=='card')wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);
 g.run("WILD.nextBonus=999;if(typeof WILD.nextToss==='number')WILD.nextToss=999;");g.ticks(60);return g;}
// the power through the real button (as a player taps it)
const TAP="WILD.left=Math.max(WILD.left,40);if(!PG.powers)PG.powers={};PG.powers[pgpCat()]=Math.max(1,pgpCount());if(board.status==='ready')board.status='playing';{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});}";
const STATE="bodies.filter(b=>!b.dead).map(b=>{const q=b.rb.translation();return [b.kind,b.id||'',Math.round(q.x*1e4),Math.round(q.y*1e4),Math.round(q.z*1e4)]})";
async function levelRun(file,lv,seed,cat){const g=await boot(file,seed);
 g.run(`PG.lv.passed=Math.max(PG.lv.passed,${lv-1});PG.lv.sel=${lv};pgPlay('${cat}');if(WILD.phase!=='card')wildReset();wildStartCountdown();`);g.until("WILD.phase==='play'",900);
 const tr=[];for(let i=0;i<900;i++){if(i%24===0)g.run(`tryDrop({x:${Math.round(200+120*Math.sin(i/37))},y:DROP_Y})`);g.tick();if(i%30===0)tr.push(J(g,`[${STATE},S.coins,Math.round(WILD.left*100),WILD.got]`));}
 const r={trace:JSON.stringify(tr),errs:J(g,'__errs').length};g.close&&g.close();return r;}
(async()=>{
 {const S=fs.readFileSync(src,'utf8');let B=fs.readFileSync(path.resolve(__dirname,'../cp122-giant/release.html'),'utf8');let m=[1];if(require('crypto').createHash('sha256').update(B).digest('hex')!=='392fd2a0841a2b88fa0e8172cbfb9461841d63abb86323612a5b12e99e641745')m=[];const E=JSON.parse(fs.readFileSync(path.join(__dirname,'edits.json'),'utf8'));for(const [a,b] of E.edits){if(B.split(a).length!==2)m=[];B=B.split(a).join(b);}for(const f of E.appendedBeforeLastScriptClose){const i=B.lastIndexOf('</script>');B=B.slice(0,i)+fs.readFileSync(path.join(__dirname,f),'utf8')+String.fromCharCode(10)+B.slice(i);}
  check('0 the build is published 2026.11.19 UAT 122 + build name + cp92-sweep2.js + cp97-switch.js (everything else unchanged)',S===B&&m.length===1);}
 // 0b. the art in the build is Codex's revision 2: same canvases, alpha identical, colour within WebP q95 rounding
 {const g=await boot(src,1);const rows=[];let ok=true;
  for(const [k,f] of [['shoulder','hug-shoulder-v2-800x640.png'],['left','hug-left-arm-v2-800x2080.png'],['right','hug-right-arm-v2-800x2080.png']]){
   const a=await N.loadImage(Buffer.from(g.run('CP74_ART.'+k).split(',')[1],'base64')),b=await N.loadImage(path.join(ART,f));
   const px=im=>{const c=N.createCanvas(im.width,im.height),x=c.getContext('2d');x.drawImage(im,0,0);return x.getImageData(0,0,im.width,im.height).data;};
   const A=px(a),B=px(b);let alphaDiff=0,rgb=0,n=0;for(let i=0;i<A.length;i+=4){alphaDiff=Math.max(alphaDiff,Math.abs(A[i+3]-B[i+3]));if(B[i+3]>200){n++;rgb+=Math.abs(A[i]-B[i])+Math.abs(A[i+1]-B[i+1])+Math.abs(A[i+2]-B[i+2]);}}
   const r={k,size:[a.width,a.height],want:[b.width,b.height],alphaDiff,meanRGBDiff:+(rgb/n/3).toFixed(2)};rows.push(r);if(a.width!==b.width||a.height!==b.height||alphaDiff>2||r.meanRGBDiff>2)ok=false;}
  check('0b the Hug art in the build is Codex revision 2 (work/cp74-art/revision2): same canvases, transparency identical, colour mean difference under 2/255 (WebP q95)',ok,rows);g.close&&g.close();}
 // 1. title first, then the hug; walls exactly while the arms are in; the button locked; the hug ends clean
 {const g=await ragdollRound(src,1);g.run("if(!PG.powers)PG.powers={};PG.powers.ragdoll=2");const n0=J(g,'world.colliders.len()'),c0=J(g,'pgpCount()');g.run(TAP);
  g.run("globalThis.__words=[];{const __wt=wildText;wildText=function(t,...a){if(PGPX&&PGPX.id==='hug')__words.push(t);return __wt.call(this,t,...a);};}");
  const tr=[];let lock=null;for(let i=0;i<60*11.5;i++){g.tick();const s=J(g,"[PGPX&&PGPX.id,PGPX?+PGPX.t.toFixed(3):-1,CP82W&&CP82W.word,world.colliders.len()]");s[3]-=n0;tr.push([+(i/60+1/60).toFixed(3),...s]);
   if(i===150){const c=J(g,'pgpCount()');g.run('{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});}');lock=[c,J(g,'pgpCount()')];}}
  const title=tr.filter(r=>r[1]==='cp82title'),hug=tr.filter(r=>r[1]==='hug'),walls=hug.filter(r=>r[4]===2);
  notes.timeline={titleFrom:title[0],titleTo:title.at(-1),hugFrom:hug[0],hugTo:hug.at(-1),wallsFrom:walls[0],wallsTo:walls.at(-1),end:tr.at(-1)};
  check('1 tap: "HUG!" alone from the tap to 1.25 s (no walls, no arms), then the hug starts (1.25 s after the tap)',title.length&&title[0][3]==='HUG!'&&title.every(r=>r[4]===0)&&Math.abs(hug[0][0]-1.25)<=1/30&&hug[0][2]<=1/30+1e-9,notes.timeline);
  check('2 the gutter walls (2 colliders) are up from 1.5 s of the hug (arms in place) to 7.5 s (6 s), the hug lasts 9 s; both walls are removed then (other bodies may drop meanwhile)',walls.length&&walls[0][2]>=1.5&&walls[0][2]<=1.52&&walls.at(-1)[2]>=7.48&&walls.at(-1)[2]<7.5+1/60&&hug.at(-1)[2]>=8.98&&tr.at(-1)[1]===null&&(()=>{const i=tr.indexOf(walls.at(-1));return tr[i+1][4]===tr[i][4]-2;})(),notes.timeline);
  check('3 the power button is locked during the power (with 2 powers held, a second tap 2.5 s in uses nothing; the first used one)',c0===2&&lock&&lock[0]===lock[1]&&lock[0]===1,{c0,lock});
  const ws=J(g,'__words');check('4 no words drawn over the hug ("NO SIDE FALLS" gone)',ws.length===0,ws);
  check('5 no frame errors, no Hug drawing error',J(g,'__errs').length===0&&J(g,'Z74.err||null')===null,[J(g,'__errs'),J(g,'Z74.err||null')]);g.close&&g.close();}
 // 2. the walls are today's: same two colliders (size, place, friction) as UAT 105's Hug
 {const desc=async file=>{const g=await ragdollRound(file,2);const n0=J(g,'world.colliders.len()');g.run(TAP);g.ticks(60*(1.25+1.8)); /* UAT 108: the reference (UAT 107) Hug also opens with its title since UAT 106, so both wait the same */
   const d=J(g,`(()=>{const o=[];world.colliders.forEach(c=>o.push(c));return o.slice(${n0}).map(c=>{const t=c.translation(),h=c.halfExtents();return [+(t.x/M).toFixed(2),+(t.y/M).toFixed(2),+(t.z/M).toFixed(2),+(h.x/M).toFixed(2),+(h.y/M).toFixed(2),+(h.z/M).toFixed(2),+c.friction().toFixed(3)]});})()`);g.close&&g.close();return d;};
  const a=await desc(src),b=await desc(base);check('6 the gutter walls are UAT 105\'s colliders exactly (size, place, friction)',a.length===2&&JSON.stringify(a)===JSON.stringify(b),{uat104:a,uat103:b});}
 // 3. a callout made during the hug (3 s after the tap) waits and shows after it (as CP-82's check 2)
 {const g=await ragdollRound(src,3);g.run(TAP);g.ticks(180);g.run("callout('COIN RAIN!',{color:'#7dd3ff',dur:1.2})");
  let during=0,firstAfter=null,t=0;for(let i=0;i<9*60;i++){g.tick();const busy=g.run('!!PGPX');t+=1/60;const q=J(g,'callouts.length?callouts[0].t:null');if(busy&&q>0)during++;if(!busy&&q>0&&firstAfter==null)firstAfter=+t.toFixed(2);if(!busy&&!g.run('callouts.length'))break;}
  const r={during,firstAfter,errs:J(g,'__errs').length};check('7 a callout made while the hug plays (COIN RAIN! 3 s after the tap) waits, then shows once the hug has ended',r.during===0&&r.firstAfter!=null&&!r.errs,r);g.close&&g.close();}
 // 4. Home or the round ending mid-power (during the title and during the hug) leaves nothing behind; the purr stops
 {const rows=[];let ok=true;for(const [name,how,at] of [['home in title','wildExit()',30],['round end in title','WILD.left=0',30],['home in hug','wildExit()',200],['round end in hug','WILD.left=0',200]]){
   const g=await ragdollRound(src,4);const n=J(g,'world.colliders.len()');g.run("globalThis.__purr=[];{const __p=sfx.purr;sfx.purr=function(l,...a){__purr.push(l);return __p.call(this,l,...a);};}");g.run(TAP);g.ticks(at);
   try{g.run(how);}catch(e){}g.ticks(240);const r={name,px:J(g,'PGPX&&PGPX.id'),cols:J(g,'world.colliders.len()')-n,purrLast:J(g,'__purr.length?__purr[__purr.length-1]:null'),errs:J(g,'__errs').length};rows.push(r);
   if(r.px!==null||r.cols!==0||r.errs||(r.purrLast!==null&&r.purrLast!==0))ok=false;g.close&&g.close();}
  check('8 Home or the round ending during the title or the hug: no power left, no walls left, purr stopped, no errors',ok,rows);}
 // 5. drawn at 412x915 and 360x640: nothing over the board (the art and the mitts stay outside the CP-78 rim), arms registered
 {const rows=[];let ok=true;for(const [w,h] of [[412,915],[360,640]]){
   const g=await make({sourceFile:path.resolve(__dirname,'../cp74-hug/game106/uat106.html'),render:true,seed:7,pixelRatio:1,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=N.Path2D;g.run=s=>vm.runInContext(s,g.c);
   for(const k of ['shoulder','left','right']){g.c.__im=await N.loadImage(Buffer.from(g.run('CP74_ART.'+k).split(',')[1],'base64'));g.run('Z74.img.'+k+'=__im');}
   g.run('S.muted=true;S.dev=false');for(let i=0;i<140;i++)g.tick();g.run('z74DemoRound(3)');let j=0;while(g.run('WILD.phase')!=='play'&&j++<1500)g.tick();g.run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();
   g.run('z74DemoPlay()');let tt=0;const moments=[];for(const at of [1.25+.3,1.25+.6,1.25+.9,1.25+1.2,1.25+1.4,4,1.25+7.5+.3,1.25+7.5+.7,1.25+7.5+1.1]){while(tt<at-1e-6){g.tick();tt+=1/60;}g.run('draw()');
   const r0=JSON.parse(g.run('JSON.stringify({rim:z74RimPts(),k:scale*renderPixelRatio,err:Z74.err||null,id:PGPX&&PGPX.id,t:PGPX&&PGPX.t})'));
   const cv=g.c.document.getElementById('cv'),mask=N.createCanvas(cv.width,cv.height),mg=mask.getContext('2d');g.c.__mg=mg;
   g.run(at===4?'{const c0=ctx;ctx=__mg;try{z74DrawLayer();}finally{ctx=c0;}}':'{const c0=ctx;ctx=__mg;try{ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);z74Body(z74Layout(),z74Env(PGPX.t));}finally{ctx=c0;}}'); /* travelling, the mitts are the resting mitts on their way (drawn under the coins); held, everything */const md=mg.getImageData(0,0,mask.width,mask.height).data,mw=mask.width,k=r0.k;
   // the board (screen units): inside the rim, 4 units in from the sides and back, down to the front lip
   const poly=[...r0.rim.left.map(p=>[p.x+4,p.y]),...r0.rim.right.slice().reverse().map(p=>[p.x-4,p.y])],yTop=r0.rim.left[0].y+4,yBot=r0.rim.left.at(-1).y-3; // inside: 4 units in from the sides and back, down to the front edge (the rim outline ends 3 units below it, __NF+3)
   const inside=(x,y)=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,yi]=poly[i],[xj,yj]=poly[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
   let over=0,inn=0,edge=0,edgeN=0;const bb=[1e9,1e9,-1e9,-1e9];for(let py=0;py<mask.height;py++)for(let px=0;px<mw;px++){const x=(px+.5)/k,y=(py+.5)/k;if(y>yTop&&y<yBot&&inside(x,y)){inn++;if(md[(py*mw+px)*4+3]>0){over++;bb[0]=Math.min(bb[0],x);bb[1]=Math.min(bb[1],y);bb[2]=Math.max(bb[2],x);bb[3]=Math.max(bb[3],y);}}}
   const rx=(y,side)=>{const pts=r0.rim[side];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];if(y<=b.y){const t=Math.max(0,Math.min(1,(y-a.y)/(b.y-a.y||1)));return a.x+(b.x-a.x)*t;}}return pts.at(-1).x;};
   for(let py=Math.ceil((r0.rim.left[0].y+40)*k);py<Math.floor((r0.rim.left.at(-1).y-6)*k);py++){const y=(py+.5)/k;for(const [side,s] of [['left',-1],['right',1]]){const px=Math.round((rx(y,side)+s*4)*k);if(px>=0&&px<mw){edgeN++;if(md[(py*mw+px)*4+3]<250)edge++;}}}
   const held=at===4,r={size:[w,h],hugT:+(r0.t||0).toFixed(2),boardPixels:inn,artPixelsOverBoard:over,overAt:over?bb.map(v=>Math.round(v)):null,armEdgeSamples:held?edgeN:null,armEdgeGaps:held?edge:null,err:r0.err};rows.push(r);if(over||r0.err||r0.id!=='hug'||(held&&(edge||!edgeN)))ok=false;}g.close();}
  check('9 at 412x915 and 360x640, reaching (5 moments) and folding away (3 moments) the shoulders and arms, and held also the mitts, draw nothing over the board (inside the CP-78 rim; travelling mitts pass under the coins); held, the arms meet the rim with no gap along the sides',ok,rows);}
 // 6. no Hug: normal play identical to UAT 105 (Ragdoll and Tuxedo boards)
 {const runs=[];let ok=true;for(const [lv,cat,seed] of [[3,'ragdoll',1],[5,'tuxedo',2]]){const a=await levelRun(src,lv,seed,cat),b=await levelRun(base,lv,seed,cat);
   const same=a.trace===b.trace&&!a.errs&&!b.errs;runs.push({lv,cat,seed,same});if(!same)ok=false;}
  check('10 without the Hug, a round plays identically to UAT 105 (every body every 30 frames, coins, time, goal)',ok,runs);}
 check('11 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks106-on123.json'),JSON.stringify({build:src,base,passed:failed.length===0,passedN:passed.length,failed,notes},null,1));if(failed.length)process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
