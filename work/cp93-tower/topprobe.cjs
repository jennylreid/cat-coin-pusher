const path=require('path'),vm=require('vm');const make33=require('../cp33/runtime.cjs');
(async()=>{const g=await make33({sourceFile:path.resolve(__dirname,'release.html'),render:false,seed:7,width:412,height:915,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.run=s=>vm.runInContext(s,g.c);g.run("S.dev=false;S.muted=true;");for(let i=0;i<150;i++)g.tick();
 g.run("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;if(PGU.screen==='title'&&PGU.title){PGU.title.t=9;pgTitleDone();}");g.run("labStart('giant')");
 const st=()=>g.run("JSON.stringify({ph:WILD.phase,py:Math.round(pusherY),tops:bodies.filter(b=>!b.dead&&b.cp93Top!=null).map(b=>[Math.round(b.rb.translation().y/M),Math.round(b.rb.translation().z/M)]),segtop:[0,1,2].map(g=>{const s=bodies.filter(b=>!b.dead&&b.cp93===g);const t=s[s.length-1];return t?[Math.round((t.rb.translation().y/M+t.half)),Math.round(t.rb.translation().z/M),+qrot(t.rb.rotation(),{x:0,y:1,z:0}).y.toFixed(4)]:null})})");
 for(let i=0;i<=240;i++){if(i%20===0)console.log(i,st());g.tick();}})();
