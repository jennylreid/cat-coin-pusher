const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict'),vm=require('vm'),{spawn}=require('child_process'),{once}=require('events');
(async()=>{
 const render=process.argv.includes('--render'),src=path.resolve(process.argv[2]||'work/cp25/stage2/draft.html'),out='tickets/CP-25-evidence/stage2/';
 const g=await make({sourceFile:src,render,height:888.889}),a=g.c.__game,rows=[];let ff,completed;
 if(render){g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=1.35;g.c.resize();ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','10','-i','pipe:0','-c:v','libx264','-pix_fmt','yuv420p','-crf','25',out+'hold-loop-and-collections-5x.mp4'],{stdio:['pipe','ignore','inherit'],windowsHide:true});completed=once(ff,'exit');}
 async function frame(){if(render){g.c.draw();if(!ff.stdin.write(g.c.document.getElementById('cv').toBuffer('image/png')))await once(ff.stdin,'drain');}}
 let previous=0,lastWon=-1;
 for(let f=0;f<18000;f++){
  if(a.board.status!=='won'){
   const ts=a.bodies.filter(b=>b.boardTarget),t=ts[Math.floor(a.board.used/12)%ts.length];
   const missing=a.BOARD.targets.filter(t=>!a.board.collected.includes(t.id)&&!ts.some(b=>b.id===t.id));
   assert.equal(missing.length,0,'Target lost off side: '+JSON.stringify(missing));
   // Aim through the real screen-to-world transform, following the chosen prize lane.
   const p=g.c.screenOf(t?t.rb.translation().x*100:200,vm.runInContext('DROP_Y',g.c),0);
   const touchX=200+(p.x-200)*a.view.z;
   if(a.streamPointer===null)g.pointer('pointerdown',touchX,450);else g.pointer('pointermove',touchX,450);
  }else g.pointer('pointerup',200,450);
  g.tick();
  if(a.board.status==='won'&&lastWon!==a.boardIndex){lastWon=a.boardIndex;rows.push({board:a.boardIndex+1,used:a.board.used,purse:a.S.coins,inventory:{...a.S.got}});console.log('Cleared',rows[rows.length-1]);if(a.boardIndex===0){g.pointer('pointerup',200,450);a.openLoopScreen('cheese');a.screenTap({x:80,y:525});a.screenTap({x:100,y:200});for(let k=0;k<20;k++)await frame();a.closeInventory();}}
  if(f%600===0)console.log('Progress',f,a.boardIndex+1,a.board.status,a.board.used,a.S.coins);
  if(f%30===0)await frame();
  if(a.boardIndex!==previous){previous=a.boardIndex;if(previous===0&&rows.length===3)break;}
 }
 assert.equal(rows.length,3);assert.equal(a.boardIndex,0);assert.equal(a.S.got.cheese,2);assert.equal(a.S.got.shrimp,3);assert.equal(a.S.got.tuna,1);
 a.openLoopScreen('inventory');for(let f=0;f<20;f++)await frame();
 a.openLoopScreen('water');for(let f=0;f<15;f++)await frame();a.screenTap({x:80,y:525});a.screenTap({x:100,y:200});for(let f=0;f<15;f++)await frame();a.screenTap({x:280,y:525});a.screenTap({x:280,y:200});for(let f=0;f<25;f++)await frame();
 a.openLoopScreen('cheese');a.screenTap({x:80,y:525});a.screenTap({x:100,y:200});for(let f=0;f<25;f++)await frame();
 if(render){ff.stdin.end();assert.equal((await completed)[0],0);g.c.devicePixelRatio=2.7;g.c.resize();g.snapshot(out+'earned-cheese-complete.png');a.openLoopScreen('water');g.snapshot(out+'earned-water-complete.png');a.openLoopScreen('inventory');g.snapshot(out+'earned-inventory-after-placement.png');}
 assert(a.collectionPaid.water&&a.collectionPaid.cheese);
 fs.writeFileSync(out+'natural-hold-loop.json',JSON.stringify({mode:render?'rendered':'headless',dropInterval:a.dropInterval,rows,nextBoard:a.boardIndex+1,afterPlacement:{purse:a.S.coins,inventory:a.S.got,placements:a.placements,rewards:a.collectionPaid}},null,2));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
