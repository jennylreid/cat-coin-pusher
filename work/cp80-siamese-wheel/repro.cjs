const make=require('C:/Users/jenny/OneDrive/work/CoinPusher/work/cp33/runtime.cjs'),vm=require('vm'),path=require('path');
const src='C:/Users/jenny/OneDrive/work/CoinPusher/work/cp97/release.html';
const J=(g,x)=>JSON.parse(g.run('JSON.stringify('+x+')'));
(async()=>{for(const cat of (process.argv[2]||'tuxedo,orange,ragdoll,siamese,tortie').split(',')){
 const g=await make({sourceFile:src,render:false,seed:7,width:400,height:889,storage:{'catpusher.uat.devdefault.v1':'1'}});g.run=s=>vm.runInContext(s,g.c);g.c.atob=s=>Buffer.from(s,'base64').toString('latin1');
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};
 const ticks=n=>{for(let i=0;i<n;i++)g.tick();},tap=(x,y)=>{const s=g.run('scale');g.pointer('pointerdown',x*s,y*s);g.pointer('pointerup',x*s,y*s);};
 g.run('S.dev=false;S.muted=true');ticks(150);tap(200,700);ticks(40);
 g.run(`for(const c of PG_CATS)PG.open[c]=true;PG.level=Math.max(PG.level,PG_SWITCH_LEVEL);pgSave();if(WILD.on)wildExit();pgPlay('${cat}');`);
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900){g.tick();}ticks(240);
 const yi=g.run("W2_WHEEL.findIndex(s=>s.label==='YAWN')");
 const before=J(g,"({v2:WILD.v2,mode:WILD.mode||null,board:PGU.boardCat,phase:WILD.phase,status:board.status})");
 console.log('pre',JSON.stringify(J(g,"({laser:WILD.laser?Object.keys(WILD.laser):WILD.laser,chase:WILD.chase?Object.keys(WILD.chase):WILD.chase})")));g.run(`w2ForceWheel(${yi})`);const after=J(g,"({v2:WILD.v2,mode:WILD.mode||null,board:PGU.boardCat,phase:WILD.phase,force:WILD.wheelForce,slice:w2ForceSlice})");
 const seen=[];let yawn=false;for(let i=0;i<60*25;i++){g.tick();const st=g.run("WILD.dance?WILD.dance.stage||WILD.dance.phase:''");if(st&&seen[seen.length-1]!==st)seen.push(st);if(g.run('!!(W2_YAWN&&W2_YAWN.cp58)')){yawn=true;break;}if(g.run("WILD.phase")==='card'||g.run("WILD.phase")==='end')g.run("if(WILD.phase==='end')wildReset();");}
 const end=J(g,"({force:WILD.wheelForce,slice:w2ForceSlice,dance:!!WILD.dance,sweep:typeof sweepTime!=='undefined'?sweepTime:null,quake:catquakeTime,phase:WILD.phase,status:board.status,panel:panel.style.display,toss:!!WILD.toss,pet:!!WILD.petGame,laser:typeof WILD.laser!=='undefined'?!!WILD.laser:null})");
 console.log(cat,'yawnIdx',yi,JSON.stringify(before),JSON.stringify(after),'stages',seen.join('>'),'YAWN',yawn,JSON.stringify(end));g.close();}})().catch(e=>{console.error(e);process.exit(1)});
