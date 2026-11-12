const path=require('path'),fs=require('fs'),vm=require('vm');
const runtime='C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs';
const payload='C:/Users/jenny/AppData/Local/Temp/claude/C--Users-jenny-OneDrive-work-CoinPusher/eec126af-e501-4cc3-8e69-d2db672a47f4/scratchpad/payload';
const make=require(runtime);
(async()=>{const src=process.argv[2];const staged=path.join(payload,'view-'+path.basename(src));fs.copyFileSync(src,staged);const g=await make({render:true,sourceFile:staged});
console.log(vm.runInContext("JSON.stringify({d:[20,60,100,135,170,205,233,240,275,303].map(z=>[z,JSON.stringify(screenOf(200,z,0))]),chin:VIEW.y+CHIN_Y*VIEW.zy,T:[T.BACK,T.FRONT],dpr:VIEW.zy})",g.c));g.close();})();
