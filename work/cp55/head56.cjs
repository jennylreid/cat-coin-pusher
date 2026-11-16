const {game}=require('../cp43/harness.cjs'),path=require('path');
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:3,render:true,storage:{'catpusher.uat.homelayout.v1':'B'}});
 console.log('art',g.run("JSON.stringify(['head','headSweet','headWild'].map(k=>ART[k]?[k,ART[k].width,ART[k].height,+(ART[k].width/ART[k].height).toFixed(3),ART[k].pgW||null,ART[k].pgH||null]:[k,null]))"));
 g.run(`globalThis.__d=[];const P=Object.getPrototypeOf(ctx),di=P.drawImage;P.drawImage=function(img,...a){if(img&&img.width===ART.head.width&&img.height===ART.head.height){const t=this.getTransform();__d.push({scr:PGU.screen,args:a.slice(-4).map(v=>+(+v).toFixed(1)),tsx:+t.a.toFixed(3),tsy:+t.d.toFixed(3)});}return di.call(this,img,...a);};`);
 for(let i=0;i<60;i++){g.tick();g.c.draw();}g.run('__d.length=0');g.c.draw();console.log('title',g.run('JSON.stringify(__d.slice(0,3))'));
 g.ticks(80);g.tap(200,400);for(let i=0;i<40;i++){g.tick();g.c.draw();}g.run('__d.length=0');g.c.draw();console.log('board',g.run('JSON.stringify(__d.slice(0,3))'));g.close();})();
