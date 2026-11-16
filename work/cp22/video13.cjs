const make=require('./runtime.cjs'),path=require('path'),fs=require('fs'),{spawn}=require('child_process'),{once}=require('events');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{
 const g=await make({sourceFile:path.resolve(process.argv[2]),render:true,height:888.889}),a=g.c.__game;g.c.Path2D=native.Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const output='tickets/CP-22-evidence/uat13-motion.mp4';const ff=spawn('ffmpeg',['-hide_banner','-loglevel','error','-y','-f','image2pipe','-vcodec','png','-framerate','10','-i','pipe:0','-c:v','libx264','-pix_fmt','yuv420p','-crf','24',output],{stdio:['pipe','ignore','inherit'],windowsHide:true});const completed=once(ff,'exit');
 for(let f=0;f<1200;f++){
  if(f>=60&&f<780&&f%3===0)a.tryDrop({x:200});g.tick();
  if(f%6===0){g.c.draw();const png=g.c.document.getElementById('cv').toBuffer('image/png');if(!ff.stdin.write(png))await once(ff.stdin,'drain');}
  if(f===720)g.snapshot('tickets/CP-22-evidence/uat13-pushing.png');
 }
 g.snapshot('tickets/CP-22-evidence/uat13-settled.png');ff.stdin.end();const [code]=await completed;if(code)throw Error('Video encoder failed');g.close();console.log(output);
})().catch(e=>{console.error(e);process.exitCode=1});
