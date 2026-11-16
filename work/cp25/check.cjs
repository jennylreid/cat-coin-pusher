const make=require('./runtime.cjs'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
(async()=>{
 const src=path.resolve(process.argv[2]||'work/cp25/draft.html'),results=[];
 const storage={};let g=await make({sourceFile:src,storage}),a=g.c.__game;
 assert.equal(a.S.coins,220);assert.equal(a.tryDrop({x:200}),true);assert.equal(a.S.coins,219);
 const spent=a.S.coins;assert.equal(a.tryDrop({x:200}),false);assert.equal(a.S.coins,spent);
 for(let i=0;i<200;i++)g.tick();a.save();
 const before=a.bodies.map(b=>({id:b.id,p:b.rb.translation()})),used=a.board.used;
 g.close();g=await make({sourceFile:src,storage,startTime:4});a=g.c.__game;
 assert.equal(a.S.coins,219);assert.equal(a.board.used,used);assert.equal(a.bodies.length,before.length);
 assert.equal(JSON.stringify(a.bodies.map(b=>({id:b.id,p:b.rb.translation()}))),JSON.stringify(before));results.push('Close/reopen retains purse, board number, all body positions and spent coins');
 a.S.coins=0;a.S.lastRegen=g.c.Date.now();a.save();g.close();
 g=await make({sourceFile:src,storage,startTime:65});a=g.c.__game;assert.equal(a.S.coins,3);
 g.advance(100000);assert.equal(a.S.coins,300);g.advance(100000);assert.equal(a.S.coins,300);
 a.tryDrop({x:200});g.advance(19);assert.equal(a.S.coins,299);g.advance(1);assert.equal(a.S.coins,300);
 results.push('Offline refill counts whole intervals, caps at 300, and banks no time at cap');
 a.S.coins=0;a.S.lastRegen=g.c.Date.now();const n=a.bodies.length;
 assert.equal(a.tryDrop({x:200}),false);for(let i=0;i<300;i++)g.tick();assert.notEqual(a.board.status,'lost');assert.equal(a.bodies.length,n);
 g.advance(20);assert.equal(a.tryDrop({x:200}),true);results.push('Empty purse waits without loss and resumes at refill');
 a.selectBoard(2);a.S.coins=310;
 const coin=a.bodies.find(b=>b.kind==='coin');coin.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(coin,200);assert.equal(a.S.coins,311);a.fallOff(coin,200);assert.equal(a.S.coins,311);
 const side=a.bodies.find(b=>b.kind==='coin');a.gutterOff(side,390);assert.equal(a.S.coins,311);
 for(const id of ['cheese','shrimp','tuna']){const b=a.bodies.find(b=>b.id===id);b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);a.fallOff(b,200);assert.equal(a.S.got[id],1);}
 assert.equal(a.board.status,'won');a.save();g.close();g=await make({sourceFile:src,storage});a=g.c.__game;
 assert.equal(a.boardIndex,2);for(const id of ['cheese','shrimp','tuna'])assert.equal(a.S.got[id],1);
 for(let i=0;i<600;i++)g.tick();assert.equal(a.boardIndex,0);assert.equal(a.S.coins,311);
 results.push('Front coin pays once above cap; side coin pays nothing; all three treats persist exactly once; Board 3 loops to Board 1');
 a.openInventory();const p=a.bodies[0].rb.translation();for(let i=0;i<60;i++)g.tick();assert.deepEqual(a.bodies[0].rb.translation(),p);a.closeInventory();
 results.push('Inventory pauses board motion while open');g.close();
 fs.writeFileSync('tickets/CP-25-evidence/checks.json',JSON.stringify({passed:results},null,2));console.log(results.join('\n'));
})().catch(e=>{console.error(e);process.exitCode=1;});

