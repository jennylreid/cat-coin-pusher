const {game}=require('./harness.cjs'),fs=require('fs'),path=require('path');
const src=path.resolve(__dirname,process.argv[2]||'release.html'),out=process.argv[3];
(async()=>{for(const h of [888.889,720]){const g=await game({src,render:true,height:h,seed:4});g.ticks(30);g.run('wild2Enter()');g.ticks(30);g.c.draw();
 fs.writeFileSync(path.join(out,'wild2-goal-card'+(h<800?'-720':'')+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));
 const left=g.run('WILD.left');g.ticks(120);console.log(h,'still card, timer not running:',g.run("WILD.phase==='card'")&&g.run('WILD.left')===left);
 g.tap(200,g.run('w2CardLayout().linesY')+20);console.log('tap anywhere on card starts countdown:',g.run("WILD.phase==='count'"));g.close();}})();
