const {game}=require('./harness.cjs');
(async()=>{const g=await game({seed:4,src:require('path').resolve('../cp45/release.html')});g.ticks(5);
console.log(g.run("JSON.stringify({h:hudLayout(),W,H,VIEW,FRONT:T.FRONT,PUSH_MAX,COIN_R,L:T.L,R:T.R,FB:FUNNEL_BACK,wb:wildButton(),w2:wild2Button(),inv:typeof inventoryButton==='function'?inventoryButton():null})"));g.close();})();
