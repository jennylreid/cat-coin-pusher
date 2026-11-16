// UAT 33 spin frames (real runtime, defaults, real payout so the collected prize is gone from the board): spin in while
// growing, rest at full size, spin out into the bag. Writes single frames and a strip next to the CP-33 report.
const make=require('./runtime.cjs'),fs=require('fs'),path=require('path'),vm=require('vm'),{execFileSync}=require('child_process');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const O=path.resolve(__dirname,'../../tickets/CP-33-evidence/uat33');fs.mkdirSync(O,{recursive:true});
(async()=>{
 const g=await make({sourceFile:path.resolve(__dirname,'release.html'),render:true,height:888.889,seed:9});g.c.Path2D=require(NAPI).Path2D;g.c.devicePixelRatio=1.35;g.c.resize();
 const run=s=>vm.runInContext(s,g.c),a=g.c.__game;run('selectBoard(0);S.dev=false;S.coins=200;board.status="playing";');for(let i=0;i<30;i++)g.tick();
 const id=a.BOARD.targets.map(t=>t.id).includes('tuna')?'tuna':a.BOARD.targets[0].id;assert(run(`(()=>{const b=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id==='${id}');if(!b)return false;b.rb.setTranslation({x:180*M,y:-0.5,z:(T.FRONT+6)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);return true;})()`));
 g.tick();const f=a.treatAwards[0],lv=f.tr+f.tm,marks=[];
 const shots=[['1-spin-in',f.tr*.25],['2-spin-in',f.tr*.5],['3-spin-in',f.tr*.75],['4-rest',f.tr+.3],['5-spin-out',lv+f.td*.25],['6-spin-out',lv+f.td*.45]];
 const files=[];for(const [name,t] of shots){while(f.t<t-1e-9)g.tick();g.c.draw();const file=path.join(O,`spin-${name}.png`);fs.writeFileSync(file,g.c.document.getElementById('cv').toBuffer('image/png'));files.push(file);
  const q=a.pickupPoint(f);marks.push({frame:path.basename(file),sec:+f.t.toFixed(3),flip:+q.flip.toFixed(3),turnDeg:+(q.rot*180/Math.PI).toFixed(1),widthOfScreen:+(a.prizeWidth(id,q.s)/400).toFixed(3)});}
 const args=['-hide_banner','-loglevel','error','-y'];for(const x of files)args.push('-i',x);
 args.push('-filter_complex',files.map((_,i)=>`[${i}]scale=270:-1[s${i}]`).join(';')+';'+files.map((_,i)=>`[s${i}]`).join('')+`hstack=${files.length}`,path.join(O,'spin-in-rest-out.png'));
 execFileSync('ffmpeg',args);fs.writeFileSync(path.join(O,'spin-marks.json'),JSON.stringify({render:'desktop @napi-rs/canvas, 400x889 CSS at DPR 1.35, real runtime, real payout on Board 1, defaults',prize:id,marks},null,1));
 console.log(JSON.stringify(marks,null,1));g.close();
})().catch(e=>{console.error(e);process.exitCode=1;});
function assert(x){if(!x)throw new Error('assert');}
