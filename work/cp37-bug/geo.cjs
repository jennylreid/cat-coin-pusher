const {game}=require('../cp37/harness.cjs');
(async()=>{const g=await game({seed:4,render:true,src:require('path').resolve('uat37.html')});g.c.draw();
for(const [z,h] of [[216,0],[216,22],[216,30],[230,22],[242,22],[260,4],[260,22],[290,4],[290,30],[320,40]]){
 const c=g.run(`(()=>{const top=screenOf(200,${z}-26,${h}),mid=screenOf(200,${z},${h}),bot=screenOf(200,${z}+26,${h});return [top.y,mid.y,bot.y]})()`);
 console.log('z',z,'h',h,'screen y back/centre/front',c.map(v=>v.toFixed(1)).join(' '));}
console.log('chin line (CHIN_Y) =215; slot clip y=218; LIFT',g.run('LIFT'));g.close();})();
