// UAT 82 evidence (arg 3 'coins': every prize removed first, so the mitt takes top coins): the wheel's YAWN result on a Level N round of the built release.html, 412x915 frames at 30 fps.
// Usage: node frames79.cjs [level] -> out/L<level>/f0000.png ... (encode with ffmpeg, then delete)
const fs=require('fs'),path=require('path');const {game}=require('../cp43/harness.cjs');
const {createCanvas}=require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas');
const level=+(process.argv[2]||1),OUT=path.join(process.env.FRAMES_DIR||path.join(__dirname,'out'),'L'+level+(process.argv[3]?'-'+process.argv[3]:''));fs.mkdirSync(OUT,{recursive:true});for(const f of fs.readdirSync(OUT))fs.unlinkSync(path.join(OUT,f));
(async()=>{const g=await game({src:path.join(__dirname,'release.html'),seed:7,render:true,storage:{'catpusher.uat.devdefault.v1':'1'}});
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 g.ticks(140);g.run('PGU.title.t=9;pgTitleDone()');g.ticks(30);if(!g.run('PG'))g.run('pgInit()');
 g.run(`PG.lv.passed=${level-1};PG.lv.sel=${level};wildReset();PGU.screen='board';pgStartRound();`);let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();
 for(let i=0;i<240;i++)g.tick();await new Promise(r=>setTimeout(r,300));g.run('WILD.left=60;');
 const cv=g.c.document.getElementById('cv'),o=createCanvas(412,915),x=o.getContext('2d');let f=0;
 const shot=()=>{g.c.draw();x.drawImage(cv,0,0,412,915);fs.writeFileSync(path.join(OUT,'f'+String(f++).padStart(4,'0')+'.png'),o.toBuffer('image/png'));};
 if(process.argv[3]==='coins'){for(let i=0;i<300;i++){if(i%12===0)g.run('tryDrop({x:rand(T.L+40,T.R-40),y:DROP_Y})');g.tick();}g.ticks(120);} // coins played first, as in a real round
 for(let i=0;i<30;i++){g.tick();if(i%2)shot();}
 if(process.argv[3]==='coins')g.run("for(const b of bodies.slice())if(!b.dead&&b.kind==='item')removeCoin(b);WILD.incoming.length=0;SKY.length=0;WILD.nextBonus=999;");
 g.run("WILD.dance={phase:'finale',stage:'yawn',st:0,finT:9,fx:[],bank:{coin:0,rain5:0,rain10:0},coins:0,rainCoins:0,hits:0};");
 for(let i=0;i<(process.argv[3]==='coins'?6:12)*60;i++){g.tick();if(i%2)shot();}
 console.log(JSON.stringify({level,frames:f,stats:JSON.parse(g.run('JSON.stringify(CP58.stats)')),calls:'see video',errs:JSON.parse(g.run('JSON.stringify(__errs)'))}));g.close();
})().catch(e=>{console.error(e);process.exit(1)});
