// CP-72 key-beat stills: the real game (UAT 89 + prototype, Developer off) on the Orange cat's board, Level N, at phone
// sizes; the power played through the real button. Usage: node shots.cjs [sizes] [level] [which] -> tickets/CP-72-evidence/
const make=require('../cp33/runtime.cjs'),path=require('path'),fs=require('fs'),vm=require('vm');
const NAPI='C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas';
const sizes=(process.argv[2]||'412x915,360x640').split(',').map(s=>s.split('x').map(Number)),level=+(process.argv[3]||3),which=process.argv[4]||'proto';
const OUT=process.env.OUT||path.resolve(__dirname,'../../tickets/CP-72-evidence');
// proto beats: the first moment a kitten is in that part of its path (or a time for the last one)
const seg=(k,u)=>`!!Z72X&&Z72X.kits.some(q=>q.P&&!q.gone&&q.P.seg==='${k}'&&q.P.u>=${u})`;
const BEATS=which==='proto'?[['1-bow',seg('bow',.6)],['2-sprint',seg('run',.5)],['3-circle',seg('circle',.3)],['4-hop',seg('hop',.5)],['5-spook',seg('spook',.45)],['6-flip',seg('flip',.4)],['7-leap',seg('leap',.2)],['8-after','!Z72X']]:[['today',1.6]];
(async()=>{const info=[];for(const [w,h] of sizes){const sz=w+'x'+h;
 const g=await make({sourceFile:process.env.SRC||path.join(__dirname,'game',which+'.html'),render:true,seed:7,pixelRatio:2,width:w,height:h,storage:{'catpusher.uat.devdefault.v1':'1'}});g.c.Path2D=require(NAPI).Path2D;
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();};
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.run('S.dev=false;S.muted=true');ticks(140);g.run(`z72DemoRound(${level})`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<1500)g.tick();
 g.run('z72DemoQuiet()');ticks(150);g.run('z72DemoQuiet()');g.run('z72DemoPlay()');let tt=0;
 for(const [n,s] of BEATS){if(typeof s==='number')while(tt<s){g.tick();tt+=1/60;}else{let c=0;while(!g.run(s)&&c++<900){g.tick();tt+=1/60;}}g.c.draw();const f=path.join(OUT,`${which==='proto'?(process.env.TAG||'new'):'today'}-${n}-${sz}.png`);fs.writeFileSync(f,g.c.document.getElementById('cv').toBuffer('image/png'));}
 info.push({sz,errs:JSON.parse(g.run('JSON.stringify(__errs)')),stats:JSON.parse(g.run("JSON.stringify(typeof Z72!=='undefined'?Z72.stats:null)"))});g.close();}
 console.log(JSON.stringify(info));})().catch(e=>{console.error(e);process.exit(1)});
