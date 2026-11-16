// CP-21: render at the phone's real pixel density (Jenny's phone: 1080 px wide, ~2.62 device pixels per CSS pixel).
// Usage: node hires.cjs <html> <out.png> [board] [seconds]
const fs=require('fs'),path=require('path'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
native.GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','system-ui');
(async()=>{const [src,out,board='0',secs='2']=process.argv.slice(2);
 const staged=path.join(payload,'render-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;
 g.c.__loadImage=s=>native.loadImage(path.join(payload,s));
 g.c.devicePixelRatio=1080/400;g.c.resize();await g.c.loadArt();g.c.__game.selectBoard(+board);
 for(let i=0;i<+secs*60;i++)g.tick();vm.runInContext('for(const b of bodies.slice())removeCoin(b)',g.c);g.c.draw();fs.writeFileSync(out,g.c.document.getElementById('cv').toBuffer('image/png'));g.close();console.log('wrote',out);
})().catch(e=>{console.error(e);process.exitCode=1});
