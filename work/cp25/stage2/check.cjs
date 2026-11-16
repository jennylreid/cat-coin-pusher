const make=require('../runtime.cjs'),assert=require('assert/strict'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'work/cp25/stage2/draft.html'),out='tickets/CP-25-evidence/stage2/';
(async()=>{
 const passed=[],storage={};
 let g=await make({sourceFile:path.resolve('work/cp25/release.html'),storage}),a=g.c.__game;
 a.selectBoard(2);a.S.got={cheese:2,shrimp:2,tuna:1};a.S.coins=330;a.save();g.close();
 g=await make({sourceFile:src,storage});a=g.c.__game;
 assert.equal(a.boardIndex,2);assert.equal(a.S.coins,330);assert.equal(a.S.got.cheese,2);assert.equal(a.placements.cheese,false);assert.equal(a.collectionPaid.water,false);
 passed.push('Stage 1 save migrates without resetting purse, inventory or current board; nothing placed automatically');
 a.openLoopScreen('inventory');a.screenTap({x:150,y:180});a.screenTap({x:90,y:200});
 assert.equal(a.placements.cheese,true);assert.equal(a.S.got.cheese,1);assert.equal(a.S.coins,380);assert.equal(a.collectionPaid.cheese,true);
 assert.equal(a.placeItem('cheese'),false);assert.equal(a.S.coins,380);assert.equal(a.S.got.cheese,1);
 a.openLoopScreen('water');a.screenTap({x:80,y:525});a.screenTap({x:280,y:200});assert.equal(a.placements.tuna,false); // mismatched slot
 a.screenTap({x:100,y:200});assert.equal(a.placements.tuna,true);assert.equal(a.S.got.tuna,0);assert.equal(a.S.coins,380);
 a.save();g.close();g=await make({sourceFile:src,storage});a=g.c.__game;assert.equal(a.placements.tuna,true);assert.equal(a.placements.shrimp,false);assert.equal(a.collectionPaid.water,false);a.openLoopScreen('water');
 a.screenTap({x:280,y:525});a.screenTap({x:280,y:200});assert.equal(a.placements.shrimp,true);assert.equal(a.S.got.shrimp,1);assert.equal(a.S.coins,480);
 assert.equal(a.collectionPaid.water,true);assert.equal(a.placeItem('sardine'),false);assert.equal(a.placeItem('crab'),false);assert.equal(a.placeItem('mouse'),false);
 a.save();g.close();g=await make({sourceFile:src,storage,startTime:5});a=g.c.__game;
 for(const id of ['cheese','shrimp','tuna']){assert.equal(a.placements[id],true);assert.equal(a.placeItem(id),false);}
 assert.equal(a.collectionPaid.water,true);assert.equal(a.collectionPaid.cheese,true);assert.equal(a.S.coins,480);
 passed.push('UI selection requires matching slot; placement consumes one; Water +100 and Cheese +50 pay once above cap; persistence blocks repeat reward; future slots cannot be placed');
 // Real pointer handlers: tap, hold, horizontal follow, release, cancellation, multi-touch and screen opening.
 a.selectBoard(0);a.closeInventory();
 g.pointer('pointerdown',200,450);g.pointer('pointerup',200,450);assert.equal(a.board.used,1);
 for(let f=0;f<90;f++)g.tick();assert.equal(a.board.used,1);
 const start=a.board.used;g.pointer('pointerdown',70,450);for(let f=0;f<30;f++)g.tick();g.pointer('pointermove',330,450);for(let f=0;f<25;f++)g.tick();
 const inputs=a.bodies.filter(b=>b.input);assert(inputs.some(b=>b.rb.translation().x<1.6));assert(inputs.some(b=>b.rb.translation().x>2.4));
 g.pointer('pointerup',330,450);const end=a.board.used;assert.equal(end-start,5);for(let f=0;f<90;f++)g.tick();assert.equal(a.board.used,end);
 g.pointer('pointerdown',200,450);g.pointer('pointercancel',200,450);const cancel=a.board.used;for(let f=0;f<30;f++)g.tick();assert.equal(a.board.used,cancel);
 g.pointer('pointerdown',200,450);a.openLoopScreen('water');a.closeInventory();const count=a.board.used;for(let f=0;f<30;f++)g.tick();assert.equal(a.board.used,count);assert.equal(a.streamPointer,null);
 passed.push('Tap drops one; hold drops five per second and follows horizontal pointer; lift/cancel/screen opening stop stream with no queued drops');
 {const hud=a.hudLayout();g.pointer('pointerdown',hud.left+50,hud.settingsY-33);assert.equal(a.inventoryOpen,true);a.closeInventory();g.pointer('pointerdown',hud.settingsX-25,hud.settingsY-33);assert.equal(a.inventoryOpen,true);a.closeInventory();}
 assert.equal(a.emptyPurse(),false);a.S.dev=true;
 const panel=g.c.document.getElementById('panel'),buttons={};panel.querySelector=sel=>panel.innerHTML.includes('id="'+sel.slice(1)+'"')?(buttons[sel]??={}):null;
 const h=a.hudLayout();g.pointer('pointerdown',h.settingsX-20,h.settingsY);assert(buttons['#empty-purse']);buttons['#empty-purse'].onclick();assert.equal(a.S.coins,0);assert.equal(a.board.remaining,0);
 a.save();g.close();g=await make({sourceFile:src,storage,startTime:5});a=g.c.__game;assert.equal(a.S.coins,0);assert.equal(a.tryDrop({x:200}),false);g.advance(20);assert.equal(a.S.coins,1);assert.equal(a.tryDrop({x:200}),true);
 passed.push('Developer-only Empty purse button empties and saves immediately, resets countdown, and refill resumes dropping');
 g.close();fs.writeFileSync(out+'checks.json',JSON.stringify({dropInterval:.2,passed},null,2));console.log(passed.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1});
