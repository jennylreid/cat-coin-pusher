const path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
(async()=>{const seed=+(process.env.S||4);const g=await make33({sourceFile:path.resolve(__dirname,'release.html'),render:false,seed,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.run=s=>vm.runInContext(s,g.c);g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();g.run(`CP93.seed=${seed*7919};`);
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.run("labStart('giant')");
 g.run("CP93.pl=[];{const o=step;step=function(){const before=bodies.filter(b=>!b.dead&&b.cp93Top!=null).map(b=>b.uid);const r=o();for(const u of before){const b=bodies.find(x=>x.uid===u);if(!b||b.cp93Top==null){const p=b?b.rb.translation():null;const segs=bodies.filter(s=>!s.dead&&s.cp93!=null);CP93.pl.push({t:+time.toFixed(2),uid:u,dead:!b,p:p?[Math.round(p.x/M),Math.round(p.y/M),Math.round(p.z/M)]:null,v:b?b.rb.linvel():null,phase:WILD.phase,pfx:typeof PGPX!=='undefined'&&PGPX?PGPX.id:null});}}return r;};}");
 let lastPh=0,inS=0,nextOk=0,drops=0;const xs=[150,250,200,120,280];
 for(let tick=0;tick<40*60;tick++){if(g.run("WILD.phase==='play'")){const ph=+g.run('pushPhase/PUSH_PERIOD');if(ph<lastPh)inS=0;lastPh=ph;if(inS<2&&tick>=nextOk){const r0=+g.run('board.released');g.run(`tryDrop({x:${xs[drops%xs.length]},y:DROP_Y})`);if(+g.run('board.released')>r0){drops++;inS++;nextOk=tick+17;}}}g.tick();}
 console.log(g.run("JSON.stringify(CP93.pl)"));})();
