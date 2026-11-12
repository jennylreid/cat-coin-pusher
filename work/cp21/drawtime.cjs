// CP-21: median desktop draw time per frame, phone resolution, Board 1 mid-play. Usage: node drawtime.cjs a.html b.html ...
const fs=require('fs'),path=require('path'),{performance}=require('perf_hooks');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime),native=require('module').createRequire(runtime)('@napi-rs/canvas');
(async()=>{const games=[];for(const src of process.argv.slice(2)){const staged=path.join(payload,'time-'+path.basename(src));fs.copyFileSync(src,staged);
 const g=await make({render:true,sourceFile:staged});g.c.Path2D=native.Path2D;g.c.__loadImage=s=>native.loadImage(path.join(payload,s));
 g.c.devicePixelRatio=2.7;g.c.resize();await g.c.loadArt();g.c.__game.selectBoard(0);for(let i=0;i<240;i++){if(i%20===0)g.c.tryDrop({x:200,y:g.c.DROP_Y});g.tick();}for(let i=0;i<20;i++)g.c.draw();games.push(g);}
 const t=games.map(()=>[]);for(let f=0;f<80;f++)games.forEach((g,i)=>{const s=performance.now();g.c.draw();t[i].push(performance.now()-s);});
 process.argv.slice(2).forEach((n,i)=>{t[i].sort((a,b)=>a-b);console.log(n,'median draw ms',t[i][40].toFixed(2));});games.forEach(g=>g.close());
})().catch(e=>{console.error(e);process.exitCode=1});
