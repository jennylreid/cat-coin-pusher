const make=require('../runtime.cjs'),{performance}=require('perf_hooks'),vm=require('vm');
(async()=>{let g=await make({sourceFile:process.argv[2]||'work/cp25/pickup-options/release.html',render:true,pixelRatio:2.7});g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;let stats={};for(const name of ['draw','coinPaintOrder','drawBody','save','step','solidCoinContacts','coinRotationContacts','deliveryImpact','dampCoinImpacts']){const f=g.c[name];if(!f)continue;stats[name]=[];g.c[name]=function(...a){const t=performance.now();let v=f(...a);stats[name].push(performance.now()-t);return v;};}for(let i=0;i<240;i++){if(i%12===0)g.drop();g.tick();g.c.draw();}for(const [k,a] of Object.entries(stats)){a.sort((a,b)=>a-b);stats[k]={calls:a.length,mean:a.reduce((a,b)=>a+b,0)/a.length,p95:a[Math.floor(a.length*.95)]};}console.log(JSON.stringify(stats,null,2));g.close();})();



