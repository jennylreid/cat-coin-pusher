// UAT 32 held frames (real runtime, defaults unless stated): prizes on Board 1, Quake coin on Board 3 at Quake size 70% and
// 45%, plus a two-together sequence to show the panel easing between turns. Writes PNGs and marks next to the reports.
const make=require('./runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync}=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const O33=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat32'),O34=path.resolve(__dirname,'../../tickets/CP-34-evidence/uat32');
for(const d of [O33,O34])fs.mkdirSync(d,{recursive:true});
const deg=r=>+(r*180/Math.PI).toFixed(1);
async function held(board,id,kind,file,set={},seed=9){
 const g=await make({sourceFile:path.resolve(__dirname,'release.html'),render:true,height:888.889,seed});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 vm.runInContext(`selectBoard(${board});S.dev=false;`,g.c);const a=g.c.__game;Object.assign(a.pickupFx,set);for(let i=0;i<30;i++)g.tick();
 const f=a.queueTreatAward(id,180,null,true,kind);while(f.t<f.tr+.25)g.tick();g.c.draw();fs.writeFileSync(file,g.c.document.getElementById('cv').toBuffer('image/png'));
 const P=a.PANEL,r={id,turnDeg:deg(f.rot),art:{x:+f.mx.toFixed(1),y:+f.my.toFixed(1)},panel:{left:+(P.x-P.w/2).toFixed(1),right:+(P.x+P.w/2).toFixed(1),top:+(P.y-P.h/2).toFixed(1),bottom:+(P.y+P.h/2).toFixed(1)},...set};g.close();return r;
}
(async()=>{const out={render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime, previews'};
 out.prizeTuna=await held(0,'tuna','item',path.join(O33,'prize-held-tuna.png'));
 out.prizeShrimp=await held(0,'shrimp','item',path.join(O33,'prize-held-shrimp.png'),{},12);
 out.quake70=await held(2,'quake','quake',path.join(O34,'quake-held-70.png'));
 out.quake45=await held(2,'quake','quake',path.join(O34,'quake-held-45.png'),{quakeSize:.45});
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(O33,'prize-held-tuna.png'),'-i',path.join(O33,'prize-held-shrimp.png'),'-filter_complex','hstack=2',path.join(O33,'prize-held-compared.png')]);
 execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(O34,'quake-held-70.png'),'-i',path.join(O34,'quake-held-45.png'),'-filter_complex','hstack=2',path.join(O34,'quake-70-vs-45.png')]);
 fs.writeFileSync(path.join(O33,'frame-marks.json'),JSON.stringify(out,null,1));console.log(JSON.stringify(out,null,1));})().catch(e=>{console.error(e);process.exitCode=1;});
