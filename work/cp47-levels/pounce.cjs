const {game}=require('../cp43/harness.cjs'),path=require('path'),fs=require('fs');
const src=path.resolve(process.argv[2]||'preview.html'),OUT=path.resolve(process.argv[3]||'shots');fs.mkdirSync(OUT,{recursive:true});
const shot=(g,n)=>{g.c.draw();fs.writeFileSync(path.join(OUT,n+'.png'),g.c.document.getElementById('cv').toBuffer('image/png'));};
(async()=>{for(const mode of ['all','some']){const g=await game({src,render:true,seed:9});g.run('S.muted=false;S.dev=true');
 g.run("globalThis.__errs=[];const fe=frameError;frameError=function(e){__errs.push(String(e&&e.stack||e).slice(0,300));return fe(e);}");
 g.ticks(150);g.tap(200,700);g.ticks(30);
 g.run(`PG.open.tortie=1;pgSwitchBoard('tortie');PG.lv.passed=2;PG.lv.sel=3;wildReset();PGU.screen='board';WILD.pounceForce=true;pgStartRound();`);
 g.until('!!WILD.pounce&&WILD.pounce.phase==="play"',900);const left0=g.run('WILD.left');let k=0,shotDone=false;
 while(g.run('!!WILD.pounce&&WILD.pounce.phase==="play"')&&k<1200){const m=JSON.parse(g.run('JSON.stringify((WILD.pounce.mice.find(m=>m.state==="run"&&m.x>30&&m.x<370)||null))'));
  if(m&&k%8===0&&(mode==='all'||k%24===0))g.tap(Math.round(m.x),Math.round(m.y-14));else if(mode==='some'&&k%50===25)g.tap(200,300);
  if(!shotDone&&k>150&&g.run('WILD.pounce.slams.length>0')){shot(g,'pounce-play-'+mode);shotDone=true;}g.tick();k++;}
 g.ticks(20);shot(g,'pounce-end-'+mode);
 console.log(mode,g.run(`JSON.stringify({caught:WILD.pounce&&WILD.pounce.caught,n:WILD.pounce&&WILD.pounce.n,whiffs:WILD.pounce&&WILD.pounce.whiffs,esc:WILD.pounce&&WILD.pounce.escaped,perfect:WILD.pounce&&WILD.pounce.perfect,rain:WILD.rainLeft,timerHeld:Math.abs(WILD.left-${left0})<0.5})`));
 g.ticks(200);console.log(' after',g.run('JSON.stringify({powers:PG.powers,pounce:!!WILD.pounce,phase:WILD.phase,errs:__errs})'));}
})();
