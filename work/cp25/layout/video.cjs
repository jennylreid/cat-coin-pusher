const make=require('../runtime.cjs'),path=require('path'),{spawn}=require('child_process'),{once}=require('events'),fs=require('fs');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/layout/draft.html'),render:true,height:888.889}),a=g.c.__game;
 g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const out='tickets/CP-25-evidence/layout/',ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','10','-i','pipe:0','-c:v','libx264','-pix_fmt','yuv420p','-crf','25',out+'satchel-and-awards.mp4'],{stdio:['pipe','ignore','inherit'],windowsHide:true}),completed=once(ff,'exit');
 async function frame(){g.c.draw();if(!ff.stdin.write(g.c.document.getElementById('cv').toBuffer('image/png')))await once(ff.stdin,'drain');}
 async function wait(n){for(let f=0;f<n;f++){for(let k=0;k<6;k++)g.tick();await frame();}}
 // Fixture moves the existing two board prizes across the actual front payout path.
 // It demonstrates UI timing; the prior natural three-board clip remains separate evidence.
 a.tryDrop({x:200});for(const id of ['cheese','shrimp']){const b=a.bodies.find(b=>b.id===id);b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);}
 await wait(45);await wait(45); // both 2-second awards, clear feedback and next-board transition
 const tile=a.collectionsTile();g.pointer('pointerdown',tile.x+22,tile.y+22);g.pointer('pointerup',tile.x+22,tile.y+22);await wait(10);
 async function drag(id){const geo=a.collectionGeometry(),r=geo.items.find(r=>r.id===id),t=geo.slots.find(r=>r.id===id),from={x:r.x+r.w/2,y:r.y+r.h/2},to={x:t.x+t.w/2,y:t.y+t.h/2};g.pointer('pointerdown',from.x,from.y);for(let f=1;f<=16;f++){g.pointer('pointermove',from.x+(to.x-from.x)*f/16,from.y+(to.y-from.y)*f/16);await frame();}g.pointer('pointerup',to.x,to.y);await wait(14);}
 await drag('shrimp');const s=a.screenLayout();g.pointer('pointerdown',s.right-40,s.top+64);g.pointer('pointerup',s.right-40,s.top+64);await wait(6);await drag('cheese');await wait(20);
 ff.stdin.end();const [code]=await completed;if(code)throw Error('Video encoding failed');fs.writeFileSync(out+'video-fixture.json',JSON.stringify({description:'Existing cheese/shrimp moved to actual front payout, then queued overlays, board advance and real pointer drags; playback real time except drag animation sampling',paid:a.collectionPaid,placements:a.placements},null,2));g.close();console.log('Interaction clip ready');
})().catch(e=>{console.error(e);process.exitCode=1});
