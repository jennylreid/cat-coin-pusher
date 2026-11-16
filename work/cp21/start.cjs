// CP-21: a board's starting layout after it settles (no taps). Usage: node start.cjs <html> <out.png> <board>
const fs=require('fs'),path=require('path');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
native.GlobalFonts.registerFromPath('C:/Windows/Fonts/seguisym.ttf','system-ui');
(async()=>{const [src,out,board='0']=process.argv.slice(2);
 const staged=path.join(payload,'render-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;
 g.c.__loadImage=s=>native.loadImage(path.join(payload,s));await g.c.loadArt();g.c.__game.selectBoard(+board);
 for(let i=0;i<120;i++)g.tick();g.snapshot(out);g.close();console.log('wrote',out);
})().catch(e=>{console.error(e);process.exitCode=1});
