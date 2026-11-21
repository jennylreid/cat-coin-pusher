(async()=>{const g=await game(src,'level:siamese');
 console.log(g.run(`String(__petDanceStart).slice(0,300)`));console.log(g.run(`JSON.stringify({laser:WILD.laser,dev:typeof W2_DEV_WHEEL!=='undefined'?W2_DEV_WHEEL:'u'})`));
 console.log(g.run(`Object.getOwnPropertyDescriptor(WILD,'laser')?JSON.stringify(Object.keys(Object.getOwnPropertyDescriptor(WILD,'laser'))):'none'`));
 g.close();})();
