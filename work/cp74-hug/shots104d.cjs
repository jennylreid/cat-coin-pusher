// CP-74 UAT 104 stills: the UAT 104 build (game104/uat104.html = release.html + demo controls) on the Ragdoll's board,
// Level 3, power played through the real button; beats from the tap. Writes tickets/CP-74-evidence/uat104/hug104-*.png and a
// sheet per size. Usage: node shots104.cjs [sizes]
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const N=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number));
const OUT=path.resolve(__dirname,'../../tickets/CP-74-evidence/uat104');fs.mkdirSync(OUT,{recursive:true});
const BEATS=[['1-title',.6],['2-unfold-1',1.6],['3-unfold-2',1.9],['4-unfold-3',2.2],['5-unfold-4',2.5],['6-in-place',2.85],['7-fold-1',9.1],['8-fold-2',9.4],['9-fold-3',9.7],['10-after',10.4]];
(async()=>{for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:path.join(__dirname,'game104','uat104.html'),render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=N.Path2D;
 const run=s=>vm.runInContext(s,g.c);let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 for(const k of ['shoulder','left','right']){g.c.__im=await N.loadImage(Buffer.from(run('CP74_ART.'+k).split(',')[1],'base64'));run('Z74.img.'+k+'=__im');}
 run('S.dev=false;S.muted=true');for(let i=0;i<140;i++)g.tick();run('z74DemoRound(3)');let k=0;while(run('WILD.phase')!=='play'&&k++<1500)g.tick();
 run('z74DemoQuiet()');for(let i=0;i<150;i++)g.tick();run('z74DemoQuiet()');run('z74DemoPlay()');let tt=0;const files=[];
 for(const [n,s] of BEATS){while(tt<s-1e-6){g.tick();tt+=1/60;}run('draw()');const f=path.join(OUT,`hug104d-${n}-${sz}.png`);
  // the game canvas, centred on a black screen of the phone's size (narrow screens show the game's own side margins)
  const cv=g.c.document.getElementById('cv'),sc=N.createCanvas(w*2,h*2),x=sc.getContext('2d');x.fillStyle='#000';x.fillRect(0,0,w*2,h*2);x.drawImage(cv,(w*2-cv.width)/2,0);
  fs.writeFileSync(f,sc.toBuffer('image/png'));files.push([n,f]);}
 console.log(sz,run('JSON.stringify({err:Z74.err||null,errs:typeof __errs!=="undefined"?__errs:null})'));g.close();
 // sheet: the six beats side by side at 1x with labels
 const sh=N.createCanvas(w*10+90,h+30),y=sh.getContext('2d');y.fillStyle='#fff';y.fillRect(0,0,sh.width,sh.height);y.fillStyle='#000';y.font='16px sans-serif';
 for(let i=0;i<files.length;i++){const im=await N.loadImage(files[i][1]);y.drawImage(im,i*(w+10),30,w,h);y.fillText(files[i][0]+' ('+BEATS[i][1]+' s)',i*(w+10)+4,20);}
 fs.writeFileSync(path.join(OUT,`sheet104d-${sz}.png`),sh.toBuffer('image/png'));}
})().catch(e=>{console.error(e);process.exit(1)});
