const fs=require('fs'),path=require('path');
const {game}=require('../../work/cp43/harness.cjs');
const {createCanvas}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const g=await game({src:path.resolve('work/cp70/release.html'),render:true});
for(const id of ['sock','biscuit','sardine','egg','box'])fs.writeFileSync(path.join(__dirname,'current-'+id+'.png'),g.run(`wildPrizeArt('${id}').toBuffer('image/png')`));
const a=g.run('ART');
for(const id of ['cheese','shrimp','tuna']){let c=createCanvas(id==='tuna'?a.tuna.width:a.snacks.width/2,id==='tuna'?a.tuna.height:a.snacks.height),x=c.getContext('2d');if(id==='tuna')x.drawImage(a.tuna,0,0);else x.drawImage(a.snacks,id==='shrimp'?c.width:0,0,c.width,c.height,0,0,c.width,c.height);fs.writeFileSync(path.join(__dirname,'reference-'+id+'.png'),c.toBuffer('image/png'));}
console.log(g.run("JSON.stringify({radius:radius('item'),opaque:PRIZE_OPAQUE,aspect:PRIZE_ASPECT})"));
})();

