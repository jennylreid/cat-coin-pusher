const {open,sleep}=require('../cp84-puzzles/tools/cdp.cjs');
(async()=>{for(const [w,h] of [[412,915],[360,640]]){const p=await open('http://127.0.0.1:8795/work/cp105/boot105/index.html',{width:w,height:h});
await sleep(6000); await p.tap(w/2,h/2); await sleep(3000);
console.log(await p.eval("typeof PGU!=='undefined'?PGU.screen:'none'"));
await p.shot(`cp107/home-now-${w}x${h}.png`); console.log(p.logs.slice(0,5).join('\n')); await p.close();}})();
