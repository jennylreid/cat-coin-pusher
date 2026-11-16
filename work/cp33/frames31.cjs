// UAT 31 held frames (real runtime, Board 1 prize preview / Board 3 Quake preview, defaults), each beside the same moment
// in UAT 30 (release30.html) to show the glow removed. Same seed, same pickup, same draws.
const make=require('./runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync}=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const O33=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat31'),O34=path.resolve(__dirname,'../../tickets/CP-34-evidence/uat31');
for(const d of [O33,O34])fs.mkdirSync(d,{recursive:true});
async function held(src,board,id,kind,file){
 const g=await make({sourceFile:path.resolve(__dirname,src),render:true,height:888.889,seed:9});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 vm.runInContext(`selectBoard(${board});S.dev=false;`,g.c);const a=g.c.__game;for(let i=0;i<30;i++)g.tick();
 const f=a.queueTreatAward(id,180,null,true,kind);while(f.t<f.tr+.25)g.tick();g.c.draw();fs.writeFileSync(file,g.c.document.getElementById('cv').toBuffer('image/png'));
 const r={turnDeg:+(f.rot*180/Math.PI).toFixed(1)};g.close();return r;
}
(async()=>{const out={};
 out.prize=await held('release.html',0,'tuna','item',path.join(O33,'prize-held.png'));await held('release30.html',0,'tuna','item',path.join(O33,'prize-held-uat30.png'));
 out.quake=await held('release.html',2,'quake','quake',path.join(O34,'quake-held.png'));await held('release30.html',2,'quake','quake',path.join(O34,'quake-held-uat30.png'));
 for(const [d,n] of [[O33,'prize'],[O34,'quake']])execFileSync('ffmpeg',['-hide_banner','-loglevel','error','-y','-i',path.join(d,n+'-held-uat30.png'),'-i',path.join(d,n+'-held.png'),'-filter_complex','hstack=2',path.join(d,n+'-uat30-vs-uat31.png')]);
 console.log(JSON.stringify(out));})().catch(e=>{console.error(e);process.exitCode=1;});
