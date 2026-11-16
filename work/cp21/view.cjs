const path=require('path'),fs=require('fs'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime);
(async()=>{const src=process.argv[2];const staged=path.join(payload,'view-'+path.basename(src));fs.copyFileSync(src,staged);const g=await make({render:true,sourceFile:staged});
console.log(vm.runInContext("JSON.stringify({...VIEW,front:VIEW.y+__NF*VIEW.zy,back:VIEW.y+__top*VIEW.zy})",g.c));g.close();})();
