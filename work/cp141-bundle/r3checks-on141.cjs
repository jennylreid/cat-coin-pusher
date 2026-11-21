// UAT 141 copy of work/cp93-towers/r3checks.cjs, run on work/cp141-bundle/release.html (the block is already in it).
// CP-93 round 3 checks on UAT 140 + cp93-round3.js (no render). Usage: node r3checks.cjs > logs/r3checks.txt
const fs=require('fs'),path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
const BASE=path.resolve(__dirname,'../cp140-bundle/release.html');
function patched(){let h=fs.readFileSync(BASE,'utf8');const i=h.lastIndexOf('</script>');h=h.slice(0,i)+fs.readFileSync(path.join(__dirname,'cp93-round3.js'),'utf8')+'\n'+h.slice(i);
 const f=path.join(__dirname,'_r3-'+process.pid+'.html');fs.writeFileSync(f,h);return f;}
const out=[];const check=(name,ok,info)=>{out.push({name,ok:!!ok,info});console.log((ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(info).slice(0,700));};
async function game(src,tp){const g=await make33({sourceFile:src,render:false,seed:7,pixelRatio:1,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.cp93physics.v1':tp||'today'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);g.J=s=>JSON.parse(g.run('JSON.stringify('+s+')'));
 g.run("S.dev=false;S.muted=true;globalThis.__ev=[];{const d=diagEvent;diagEvent=function(a,b){__ev.push(a+' '+b);return d.apply(this,arguments);};}");
 const sc=()=>+g.run('scale'),tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");
 g.run("CP93.seed=7919;labStart('giant')");let n=0;while(g.run("WILD.phase")!=='play'&&n++<900)g.tick();return g;}
const TW="bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null&&b.cp93Seg===0).map(b=>({g:b.cp93,x:Math.round(b.rb.translation().x/M),z:Math.round(b.rb.translation().z/M)}))";
const ticks=(g,n)=>{for(let i=0;i<n;i++)g.tick();};
(async()=>{const src=path.resolve(__dirname,'release.html') /* UAT 141: the combined build already has the block */;try{
 // 1. switch mid-board rebuilds at once, label, count reset; and back
 {const g=await game(src,'today');ticks(g,120);const before=g.J(TW),segs0=+g.run("bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null).length");
  g.run("LAB.st.got=1");g.run("CP93P.set('c')");ticks(g,2);const after=g.J(TW),st=g.J("{got:LAB.st.got,shelf:!!CP93.shelf,heavy:!!CP93.heavy,flash:CP93.flash>time,segs:bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null).length,tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).length,phase:WILD.phase}");
  g.run("CP93P.set('a')");ticks(g,2);const a=g.J(TW),sa=g.J("{shelf:!!CP93.shelf,heavy:!!CP93.heavy,segs:bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93!=null).length}");
  g.run("CP93P.set('a')");ticks(g,2);const same=g.J("__ev.filter(e=>e.startsWith('cp93 rebuilt')).length");
  check('1 switching Towers on the Giant board rebuilds the towers at once: C puts 3 fresh towers on the shelf (z 662-677), count back to 0, play goes on; B rebuilds on the deck heavy; tapping the same option again does nothing',
   before.every(t=>t.z<430)&&after.length===3&&after.every(t=>t.z>=655&&t.z<=685)&&st.got===0&&st.shelf&&!st.heavy&&st.flash&&st.tops===3&&st.phase==='play'&&a.length===3&&a.every(t=>t.z<430)&&sa.heavy&&!sa.shelf&&same===2,{before,after,st,a,sa,rebuilt:same,segs0});
  check('4a log: "cp93 build" on each build and "cp93 rebuilt" on each switch',g.J("__ev.filter(e=>/^cp93 (build|rebuilt)/.test(e))").length>=5,g.J("__ev.filter(e=>e.startsWith('cp93'))"));
  g.close();}
 // 2. Quake knocks a tower in every option; 4b spill log line
 const qr={};for(const tp of ['today','a','c','ac']){const g=await game(src,tp);ticks(g,180);g.run("board.quakes=Math.max(1,board.quakes);useCatquake()");ticks(g,360);
  qr[tp]=g.J("{spilled:CP93.stats.spilled,lets:CP93.tw.map(t=>t.why||null),ev:__ev.filter(e=>e.startsWith('cp93 spill'))}");g.close();}
 check('2 Quake (3 s in, no drops) spills at least one tower within 6 s in every option, let go by the quake',Object.values(qr).every(r=>r.spilled>=1&&r.lets.includes('quake')),qr);
 check('4b log: one "cp93 spill <tower> <why> t= drops= towers=" line per spilled tower',Object.values(qr).every(r=>r.ev.length===r.spilled&&r.ev.every(e=>/^cp93 spill \d (\w+) t=[\d.]+ drops=\d+ towers=[ABCD]$/.test(e))),Object.fromEntries(Object.entries(qr).map(([k,r])=>[k,r.ev])));
 // 3. shelf start
 {const g=await game(src,'c');const tw=g.J(TW);check('3 C: shelf towers start 12 nearer the front (677/662/672)',JSON.stringify(tw.map(t=>t.z).sort())===JSON.stringify([662,672,677].sort())||tw.every((t,i)=>Math.abs(t.z-[677,662,672][t.g])<=3),tw);g.close();}
}finally{} /* UAT 141: src is the bundle itself, never deleted */
 fs.writeFileSync(path.join(__dirname,'logs','r3checks.json'),JSON.stringify(out,null,1));console.log(out.filter(x=>x.ok).length+' passed, '+out.filter(x=>!x.ok).length+' failed');})().catch(e=>{console.error(e);process.exit(1)});
