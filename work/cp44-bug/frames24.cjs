// CP-24 frames: Board 3's tuna placed on the bare table edge and lip with its centre 25 units past the right edge (over half the fish
// hanging off), frames at 0.1, 0.6 and 1.5 s. node frames24.cjs <src> <tag>
const {game}=require('../cp42/harness.cjs'),fs=require('fs'),path=require('path');
const [,,s0,tag]=process.argv,O=path.resolve(__dirname,'out','frames');fs.mkdirSync(O,{recursive:true});
(async()=>{const g=await game({seed:4,render:true,src:path.resolve(s0)}),cv=g.c.document.getElementById('cv');
 g.run('selectBoard(2);S.coins=999;finishBoard=()=>{};reconcileBoardTargets=()=>{};');g.ticks(30);
 g.run(`{const t=bodies.find(b=>!b.dead&&b.id==='tuna');removeCoin(t);for(const b of bodies.slice()){const p=b.rb.translation();if(!b.dead&&Math.hypot(p.x/M-T.R,p.z/M-475)<75)removeCoin(b);}globalThis.__f=addCoin('item','tuna',T.R+25,halfOf("item")+5,475,yawTurn(0));__f.boardTarget=true;}`);
 const log=[];let k=0;for(const at of [6,36,90]){while(k<at){g.tick();k++;}g.c.draw();fs.writeFileSync(path.join(O,`b3-tuna-${tag}-${k}.png`),cv.toBuffer('image/png'));
  log.push(g.run(`__f.dead?'gone':(()=>{const p=__f.rb.translation();return 'x '+(p.x/M-T.R).toFixed(1)+' past edge, h '+(p.y/M).toFixed(1)})()`));}
 console.log(tag,log.join(' | '));g.close&&g.close();})();
