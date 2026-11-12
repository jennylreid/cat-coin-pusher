// CP-24 probe: a prize resting at the side edge with its disc centre at various offsets from the edge. Does it fall?
// node overhang.cjs <src> [onCoins]
const make=require('../cp33/runtime.cjs'),path=require('path'),vm=require('vm');
const src=path.resolve(process.argv[2]||'uat42.html'),onCoins=process.argv[3]==='coins';
(async()=>{const rows=[];
 for(const id of ['tuna','cheese'])for(const off of [-30,-20,-10,0,5,10,15,20,25,30]){
  const g=await make({sourceFile:src,seed:4}),run=s=>vm.runInContext(s,g.c);
  run(`selectBoard(0);for(const b of bodies.slice())removeCoin(b);reconcileBoardTargets=function(){};board.status="playing";`);
  const h=onCoins?'COIN_HALF*2+halfOf("item")+.5':'halfOf("item")+5';
  if(onCoins)run(`addCoin('coin',null,T.R-26-${30-off}+0,COIN_HALF+.2,600,yawTurn(0));addCoin('coin',null,T.R-26-${30-off}-53,COIN_HALF+.2,600,yawTurn(0))`);
  run(`globalThis.__p=addCoin('item','${id}',T.R+${off},${h},600,yawTurn(0));__p.boardTarget=false;`);
  for(let i=0;i<240;i++)g.tick();
  const r=JSON.parse(run(`JSON.stringify(__p.dead?{dead:true}:{x:__p.rb.translation().x/M-T.R,h:__p.rb.translation().y/M,tilt:+(Math.acos(Math.min(1,qrot(__p.rb.rotation(),{x:0,y:1,z:0}).y))*180/Math.PI).toFixed(1)})`));
  rows.push({id,off,...r});console.log(JSON.stringify(rows.at(-1)));g.close&&g.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
