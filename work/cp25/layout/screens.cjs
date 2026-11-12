const make=require('../runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/layout/draft.html'),render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=2.7;g.c.resize();const out='tickets/CP-25-evidence/layout/';
 g.snapshot(out+'side-collections-tile.png');a.S.got={cheese:2,shrimp:2,tuna:1};a.openLoopScreen('water');g.snapshot(out+'water-satchel.png');
 const geo=a.collectionGeometry(),from=geo.items.find(x=>x.id==='tuna'),to=geo.slots.find(x=>x.id==='tuna');
 g.pointer('pointerdown',from.x+from.w/2,from.y+from.h/2);g.pointer('pointermove',to.x+to.w/2,to.y+to.h/2);g.snapshot(out+'drag-tuna.png');g.pointer('pointerup',to.x+to.w/2,to.y+to.h/2);g.snapshot(out+'water-placed.png');
 a.openLoopScreen('cheese');g.snapshot(out+'cheese-satchel.png');a.closeInventory();
 const b=a.bodies.find(x=>x.id==='shrimp');b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);for(let f=0;f<12;f++)g.tick();g.snapshot(out+'you-got-shrimp.png');
 a.queueTreatAward('tuna');g.snapshot(out+'queued-treats.png');a.dismissTreatAward();a.dismissTreatAward();
 g.c.innerHeight=720;g.c.setAndroidSafeArea({width:400,height:720,top:34,bottom:20,left:0,right:0});g.c.resize();g.snapshot(out+'short-side-tile.png');a.openLoopScreen('water');g.snapshot(out+'short-safe-area.png');
 fs.writeFileSync(out+'screens.json',JSON.stringify({fixture:'2 cheese, 2 shrimp, 1 tuna; real pointer drag; popup triggered through actual front payout',phonePixels:[1080,2400],shortPixels:[1080,1944]},null,2));g.close();console.log('Screenshots captured');
})().catch(e=>{console.error(e);process.exitCode=1});
