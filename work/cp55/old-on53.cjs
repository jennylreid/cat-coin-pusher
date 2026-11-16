// Runs an older UAT check suite (argv[2]) on UAT 53 with Home off (pgHomeOff), so it starts on the old board as before.
const path=require('path');
for(const m of ['../cp43/harness.cjs','../cp47/harness.cjs']){const h=require(m),orig=h.game;h.game=async(o={})=>{const g=await orig(o);try{g.run('if(typeof pgHomeOff==="function")pgHomeOff()');}catch(e){}return g;};}
const suite=path.resolve(process.argv[2]);process.argv.splice(2,1);require(suite);
