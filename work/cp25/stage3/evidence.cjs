const make=require('../runtime.cjs'),path=require('path'),fs=require('fs'),{spawn}=require('child_process'),{once}=require('events');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]||'work/cp25/stage3/draft.html'),render:true,height:888.889}),a=g.c.__game,out='tickets/CP-25-evidence/stage3/';
 g.c.Path2D=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas').Path2D;g.c.devicePixelRatio=2.7;g.c.resize();
 for(const id of ['cheese','shrimp','tuna']){a.queueTreatAward(id);g.snapshot(out+'overlay-'+id+'.png');a.dismissTreatAward();}
 g.c.devicePixelRatio=1.35;g.c.resize();
 const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','10','-i','pipe:0','-c:v','libx264','-pix_fmt','yuv420p','-crf','25',out+'item-only-overlays.mp4'],{stdio:['pipe','ignore','inherit'],windowsHide:true}),done=once(ff,'exit');
 a.tryDrop({x:200});for(const id of ['cheese','shrimp']){const b=a.bodies.find(b=>b.id===id);b.rb.setTranslation({x:2,y:-1,z:8},true);a.fallOff(b,200);}
 for(let f=0;f<65;f++){for(let k=0;k<6;k++)g.tick();g.c.draw();if(!ff.stdin.write(g.c.document.getElementById('cv').toBuffer('image/png')))await once(ff.stdin,'drain');}
 ff.stdin.end();if((await done)[0])throw Error('Encoder failed');g.close();console.log('Overlay stills and queue clip captured');
})().catch(e=>{console.error(e);process.exitCode=1});
