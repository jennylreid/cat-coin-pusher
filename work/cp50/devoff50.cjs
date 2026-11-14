// Frames of every screen with Developer off (what a production player sees).
const {game}=require('../cp43/harness.cjs'),{strictAudio,frames}=require('../cp43/helpers43.cjs'),path=require('path'),fs=require('fs');
const OUT=path.join(__dirname,'out','devoff');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{const g=await game({src:path.resolve(process.argv[2]||path.join(__dirname,'release.html')),seed:2,render:true});strictAudio(g);const errs=[];
 g.run('S.dev=false');console.log('dev',g.run('S.dev'));frames(g,40,errs);shot(g,'title');g.tap(200,400);frames(g,40,errs);shot(g,'card');
 g.run("PG.level=2;pgUnlocks(2);wildStartCountdown()");frames(g,300,errs);shot(g,'play');g.run("wildFinish(false,'time')");frames(g,90,errs);shot(g,'end');
 for(const s of ['kitchen','porch','album','shop']){g.run(`pgGo('${s}')`);frames(g,30,errs);shot(g,s);}g.run("pgGo('board');PGU.pick=true;PGU.pickT=0");frames(g,30,errs);shot(g,'picker');console.log(errs);})();
