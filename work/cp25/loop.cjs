const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),assert=require('assert/strict'),{spawn}=require('child_process'),{once}=require('events');
(async()=>{
 const render=process.argv.includes('--render'),src=path.resolve(process.argv[2]||'work/cp25/draft.html');
 const g=await make({sourceFile:src,render,height:888.889}),a=g.c.__game,rows=[];let ff,completed;
 if(render){g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','10','-i','pipe:0','-c:v','libx264','-pix_fmt','yuv420p','-crf','25','tickets/CP-25-evidence/full-loop-5x.mp4'],{stdio:['pipe','ignore','inherit'],windowsHide:true});completed=once(ff,'exit');}
 let previous=0,lastWon=-1;
 for(let f=0;f<18000;f++){
  if(f%21===0&&a.board.status!=='won'){
   const ts=a.bodies.filter(b=>b.boardTarget&&!b.dead),t=ts[Math.floor(a.board.used/12)%ts.length];
   a.tryDrop({x:t?t.rb.translation().x*100:200});
  }
  g.tick();
  if(a.board.status==='won'&&lastWon!==a.boardIndex){lastWon=a.boardIndex;rows.push({board:a.boardIndex+1,used:a.board.used,purse:a.S.coins,inventory:{...a.S.got}});}
  if(render&&f%30===0){g.c.draw();if(!ff.stdin.write(g.c.document.getElementById('cv').toBuffer('image/png')))await once(ff.stdin,'drain');}
  if(a.boardIndex!==previous){previous=a.boardIndex;if(previous===0&&rows.length===3)break;}
 }
 assert.equal(rows.length,3);assert.equal(a.boardIndex,0);assert.equal(a.S.got.cheese,3);assert.equal(a.S.got.shrimp,3);assert.equal(a.S.got.tuna,1);
 if(render){ff.stdin.end();assert.equal((await completed)[0],0);g.c.devicePixelRatio=2.7;g.c.resize();g.snapshot('tickets/CP-25-evidence/board-looped.png');a.openInventory();g.snapshot('tickets/CP-25-evidence/inventory.png');a.closeInventory();a.S.coins=0;a.S.lastRegen=g.c.Date.now();a.regen();g.snapshot('tickets/CP-25-evidence/empty-purse.png');}
 fs.writeFileSync('tickets/CP-25-evidence/natural-loop.json',JSON.stringify({mode:render?'rendered':'headless',rows,nextBoard:a.boardIndex+1},null,2));console.log(JSON.stringify(rows));g.close();
})().catch(e=>{console.error(e);process.exitCode=1});
