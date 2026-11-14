// Checks a build for the CP-45 pupils fix: node check_pupils.cjs <release.html>
// Draws the title (the cat smiles at about 1.1-2.3 s) and counts the pupils pgHead fills (#120c12) on each face.
// PASS when the sweet face has its pupils as the calm one does; exit code 1 otherwise.
const path=require('path'),{game}=require('../cp43/harness.cjs'),{strictAudio}=require('../cp43/helpers43.cjs');
(async()=>{const src=path.resolve(process.argv[2]);const g=await game({src,seed:3,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);g.run('S.muted=false;S.dev=false');
 g.run("globalThis.__pp={};const ph=pgHead;pgHead=function(cat,x,y,w,face,o){const P=Object.getPrototypeOf(ctx),f=P.fill;let n=0;P.fill=function(...a){if(this.fillStyle==='#120c12')n++;return f.apply(this,a);};try{return ph.apply(this,arguments);}finally{P.fill=f;__pp[face]=Math.max(__pp[face]||0,n);}};");
 const errs=[];for(let i=0;i<100;i++){try{g.tick();g.c.draw();}catch(e){errs.push(e.message);break;}}const pp=JSON.parse(g.run('JSON.stringify(__pp)'));g.close();
 const ok=pp.sweet>=2&&pp.calm>=2&&!errs.length;console.log((ok?'PASS':'FAIL')+' the sweet face has its pupils as the calm face does '+JSON.stringify({pupils:pp,errs}));process.exit(ok?0:1);})();
