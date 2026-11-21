async function dance(g){g.run("WILD.dancePending={f:null,wait:9};");for(let i=0;i<60&&!g.run('!!WILD.dance');i++)g.tick();
 if(!g.run('!!WILD.dance'))return {started:false};
 const D0=JSON.parse(g.run('JSON.stringify({n:WILD.dance.n,taps:WILD.dance.taps||null,siamese:!!WILD.dance.siamese,tortie:!!WILD.dance.tortie,quiet:WILD.dance.quiet||null})'));
 g.run('CP107.rec=[]');const faces={};
 let j=0;while(g.run('!!WILD.dance&&WILD.dance.phase!=="finale"')&&j++<6000){g.run('(()=>{const D=WILD.dance,x=(danceNow()-D.p0)/D.beat;const k2=Math.floor(x);if(x-k2<.12&&k2>=0&&k2<D.n&&!D.judged[k2]&&!(D.rest&&D.rest[k2]))danceTap({timeStamp:performance.now()+D.latency*1000})})()');g.tick();const f=g.run('String(cp107Face())');faces[f]=(faces[f]||0)+1;}
 const end=JSON.parse(g.run('JSON.stringify(WILD.dance&&{hits:WILD.dance.hits,misses:WILD.dance.misses,perfect:WILD.dance.perfect,stage:WILD.dance.stage})'));
 return {started:true,D0,end,faces,rec:g.run('CP107.rec.length'),ticks:j};}
(async()=>{for(const cat of ['siamese','tortie','orange','ragdoll','tuxedo']){const g=await game(src,'level:'+cat);
 const a=JSON.parse(g.run("JSON.stringify({dance:wildFeature('dance'),laser:!!WILD.laser,noteAt:WILD.noteAt,mode:WILD.mode})"));const r=await dance(g);
 console.log(cat,JSON.stringify(a),JSON.stringify(r).slice(0,600),'errs',JSON.stringify(g.errs()).slice(0,400));g.close();}})();
