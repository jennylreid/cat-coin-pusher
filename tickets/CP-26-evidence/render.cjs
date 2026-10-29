const make=require('../../work/cp25/runtime.cjs'),path=require('path'),fs=require('fs');
const native=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
(async()=>{const g=await make({sourceFile:path.resolve('work/cp25/paw-ui/release.html'),render:true,height:888.889});g.c.Path2D=native.Path2D;g.c.devicePixelRatio=2.7;g.c.resize();g.snapshot('tickets/CP-26-evidence/current-phone.png');g.close();})();
