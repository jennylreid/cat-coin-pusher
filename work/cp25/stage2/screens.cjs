const make=require('../runtime.cjs'),path=require('path'),fs=require('fs');
(async()=>{
 const src=path.resolve(process.argv[2]||'work/cp25/stage2/draft.html'),g=await make({sourceFile:src,render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
 // UI fixture: explicitly seed inventory to show selection/completion states without changing board art.
 a.S.got={cheese:2,shrimp:2,tuna:1};const out='tickets/CP-25-evidence/stage2/';
 g.snapshot(out+'board-current-hud.png');a.S.dev=true;a.emptyPurse();g.snapshot(out+'empty-purse.png');a.S.coins=220;a.S.dev=false;
 a.openLoopScreen('inventory');g.snapshot(out+'inventory.png');
 a.openLoopScreen('water');g.snapshot(out+'water-empty.png');
 a.screenTap({x:80,y:525});g.snapshot(out+'water-selected.png');a.screenTap({x:100,y:200});g.snapshot(out+'water-one-placed.png');
 a.screenTap({x:280,y:525});a.screenTap({x:280,y:200});g.snapshot(out+'water-complete.png');
 a.openLoopScreen('cheese');g.snapshot(out+'cheese-empty.png');a.screenTap({x:80,y:525});a.screenTap({x:100,y:200});g.snapshot(out+'cheese-complete.png');
 a.closeInventory();g.snapshot(out+'collection-rest-reaction.png');
 // Shortest supported aspect and representative insets: avoid depending on desktop fullscreen size.
 g.c.innerHeight=720;g.c.setAndroidSafeArea({width:400,height:720,top:34,bottom:20,left:0,right:0});g.c.resize();a.openLoopScreen('water');g.snapshot(out+'water-short-safe-area.png');
 fs.writeFileSync(out+'screens.json',JSON.stringify({fixture:'UI-only inventory: cheese 2, shrimp 2, tuna 1; placements use real screen taps',phonePixels:[1080,2400],shortViewport:[400,720],safeArea:{top:34,bottom:20}},null,2));g.close();console.log('Collection screenshots ready');
})().catch(e=>{console.error(e);process.exitCode=1});
