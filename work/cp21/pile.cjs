// CP-21: Board 3 with the Quake coin moved into the middle of the coin rows (lying on top of them), settled, at phone
// resolution. For judging the Quake coin's size among the paw coins only. Usage: node pile.cjs <html> <out.png>
const fs=require('fs'),path=require('path');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
native.GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','system-ui');
(async()=>{const [src,out]=process.argv.slice(2);const staged=path.join(payload,'render-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;g.c.__loadImage=s=>native.loadImage(path.join(payload,s));
 g.c.devicePixelRatio=1080/400;g.c.resize();await g.c.loadArt();const a=g.c.__game;a.selectBoard(2);
 const q=a.bodies.find(b=>b.kind==='quake');q.rb.setTranslation({x:1.45,y:.09,z:3.6},true);q.rb.setRotation({x:0,y:0,z:0,w:1},true);
 for(let i=0;i<120;i++)g.tick();g.c.draw();fs.writeFileSync(out,g.c.document.getElementById('cv').toBuffer('image/png'));g.close();console.log('wrote',out);
})().catch(e=>{console.error(e);process.exitCode=1});
