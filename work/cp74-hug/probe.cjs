// CP-74 probe: geometry numbers + a still at time t after the power (today or proto). Usage: node probe.cjs page WxH t out.png [expr]
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const [,,page='current.html',size='412x915',tt='1.5',out='',expr='']=process.argv;const [w,h]=size.split('x').map(Number);
(async()=>{const g=await make({sourceFile:path.join(__dirname,'game',page),render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;await __z74LoadArt(g);
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};const run=s=>vm.runInContext(s,g.c);const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 run('S.dev=false;S.muted=true');ticks(140);run(`z74DemoRound(${+process.env.LEVEL||3})`);let k=0;while(run("WILD.phase")!=='play'&&k++<1500)g.tick();
 run('z74DemoQuiet()');ticks(150);run('z74DemoQuiet()');if(+tt>=0)run('z74DemoPlay()');ticks(Math.max(0,+tt)*60);g.c.draw();
 if(out)fs.writeFileSync(out,g.c.document.getElementById('cv').toBuffer('image/png'));
 if(expr)console.log(run(expr));console.log(JSON.stringify({errs:JSON.parse(run('JSON.stringify(__errs)'))}));g.close();})().catch(e=>{console.error(e);process.exit(1)});

// UAT 104: the harness has no Image decoding; load the Hug art (CP74_ART data URIs) the way the page would
async function __z74LoadArt(g){const run=s=>require('vm').runInContext(s,g.c);if(run('typeof CP74_ART')!=='object')return;const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');for(const k of ['shoulder','left','right']){const u=run('CP74_ART.'+k);g.c.__z74im=await N.loadImage(Buffer.from(u.split(',')[1],'base64'));run('Z74.img.'+k+'=__z74im');}}
