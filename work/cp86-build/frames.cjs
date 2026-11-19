// CP-86 frame-by-frame around the eye switch (60 fps, 412x915, real colours): per frame the head offset (as petHeadXf adds),
// the mitt offsets, the eye state, the head art and face in use, and a strip of head crops. Usage: node frames.cjs [from] [to]
const fs=require('fs'),path=require('path'),vm=require('vm');const make=require('../cp33/runtime.cjs');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const from=+(process.argv[2]||3.55),to=+(process.argv[3]||3.95),out=path.resolve(__dirname,'../../tickets/CP-86-evidence/frames');fs.mkdirSync(out,{recursive:true});
(async()=>{const g=await make({sourceFile:path.join(__dirname,'release.html'),render:true,seed:7,pixelRatio:1,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=1e5;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);const J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<40;i++)g.tick();
 g.run("for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}if(WILD.on)wildExit();pgPlay('siamese');");
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){if(g.run("WILD.phase")==='card'){g.c.draw();const pl=J('(typeof PGA==="object"&&PGA.L&&PGA.L.play)||null');if(pl)tap(pl.x+pl.w/2,pl.y+pl.h/2);}g.tick();}
 for(let i=0;i<240;i++)g.tick();for(let i=0;i<40;i++){g.tick();await new Promise(r=>setTimeout(r,10));} // recoloured art copies load
 g.run("WILD.left=60;WILD.nextBonus=999;PG.powers.siamese=1;{const f=wildFinish;wildFinish=function(){if(PGPX)return;return f.apply(this,arguments);};}");
 g.run("(()=>{const b=pgpButton();powerTap({x:b.x+b.w/2,y:b.y+b.h/2});})()");
 const rows=[],crops=[];let i=0;while(i++<900){g.tick();const st=J("PGPX?{id:PGPX.id,t:PGPX.t}:null");if(!st)break;if(st.id!=='sonic'||st.t<from)continue;if(st.t>to)break;
  const P=J("(()=>{const P=cp86Pose();const m=[pawMotion(-1),pawMotion(1)];return {face86:+cp86K().toFixed(2),k:P&&+P.k.toFixed(2),p:P&&+P.p.toFixed(3),hx:P?+(P.k*P.sh*(1.2+2.8*P.p)).toFixed(2):0,hy:P?+(P.k*6*P.p).toFixed(2):0,ml:[+m[0].x.toFixed(1),+m[0].y.toFixed(1)],mr:[+m[1].x.toFixed(1),+m[1].y.toFixed(1)],eyes:cp86Open(),face:powerFace(),art:cp86HeadArt()===ART.headSweet?'sweet':cp86HeadArt()===ART.head?'head':'other',pose:isRestPose()};})()");
  rows.push({t:+st.t.toFixed(3),...P});g.c.draw();const cv=g.c.document.getElementById('cv'),n=`f${String(rows.length).padStart(2,'0')}.png`;fs.writeFileSync(path.join(out,n),cv.toBuffer('image/png'));crops.push(n);}
 const d=(a,b,f)=>Math.abs(f(a)-f(b));let maxH=0,maxM=0;for(let j=1;j<rows.length;j++){maxH=Math.max(maxH,d(rows[j],rows[j-1],r=>r.hy));maxM=Math.max(maxM,d(rows[j],rows[j-1],r=>r.ml[1]),d(rows[j],rows[j-1],r=>r.mr[1]));}
 fs.writeFileSync(path.join(out,'frames.json'),JSON.stringify(rows,null,1));console.log(JSON.stringify({frames:rows.length,maxHeadYStep:+maxH.toFixed(2),maxMittYStep:+maxM.toFixed(2),faces:[...new Set(rows.map(r=>r.face+'/'+r.art+'/'+r.pose))],errs:J('__errs').length}));
 for(const r of rows)console.log(r.t,'face',r.face86,'motion',r.k,'eyes',r.eyes,'p',r.p,'head',r.hx,r.hy,'mitts',r.ml.join(','),r.mr.join(','),r.face);g.close();})().catch(e=>{console.error(e);process.exit(1)});
