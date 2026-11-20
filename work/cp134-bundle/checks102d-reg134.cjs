// CP-102 Developer tidy-up, behaviour checks (non-render runtime), on release.html (published UAT 131 + cp102-dev.js).
// 1 every Side game button starts its game on every board: the endless board (Tuxedo and Orange), each cat's own level board,
//   and from Home (the current cat's board); no coin used, the board kept
// 2 every Power button starts that cat's power on every board; the player's own power stock is unchanged
// 3 Start Dance break now: the current cat's board and its own dance (Tuxedo, Orange, Ragdoll, endless); from Home the current
//   cat's board; a cat with no dance (Siamese, Tortie) gets the note and no dance
// 4 the Music row (Developer only): a tap on A/B/C switches the Orange's and the Ragdoll's music at once and saves it; it is
//   never a dance tap; a tap elsewhere still is; with Developer off there is no row
// 5 a start-now while another side game runs waits for it, then starts
// 6 production and the UAT channel untouched
// Usage: node checks102d.cjs [outDir]
const fs=require('fs'),path=require('path'),vm=require('vm'),crypto=require('crypto');const make=require('../cp72/runtime.cjs');
const src=path.resolve(__dirname,'release.html'),out=path.resolve(process.argv[2]||path.join(__dirname,'../../tickets/CP-100-evidence/uat134/regression'));fs.mkdirSync(out,{recursive:true});
const root=path.resolve(__dirname,'../..'),sha=f=>crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const prodJ=path.join(root,'phone/CatCoinPusher-game.json'),uatJ=path.join(root,'uat/CatCoinPusher-UAT-game.json'),prod0=sha(prodJ),uat0=sha(uatJ);
let passed=[],failed=[],res={};function check(n,b,info){(b?passed:failed).push(n);res[n]={pass:!!b,info};console.log((b?'PASS ':'FAIL ')+n+(info!==undefined?' '+JSON.stringify(info).slice(0,900):''));}
const GAMES={toss:'toss',chase:'chase',pet:'petGame',pounce:'pounce'};
// where: 'endless:<cat>', 'level:<cat>', 'home:<cat>' (Home showing, <cat> the current cat)
async function game(where,{dev=false}={}){const [kind,cat]=where.split(':');
 const g=await make({sourceFile:src,render:false,width:400,height:889,pixelRatio:1,seed:7,storage:{'catpusher.uat.devdefault.v1':'1'}});
 let ms=100000;g.c.performance={now:()=>ms,timeOrigin:0};const t=g.tick.bind(g);g.tick=()=>{ms+=1000/60;t();};g.run=s=>vm.runInContext(s,g.c);
 g.run("S.dev=false;S.muted=true;globalThis.__errs=[];const __fe=frameError;frameError=e=>{__errs.push(String(e&&e.stack||e).slice(0,300));return __fe(e)}");
 const sc=()=>+g.run('scale');g.tap=(x,y)=>{g.pointer('pointerdown',x*sc(),y*sc());g.pointer('pointerup',x*sc(),y*sc());};
 for(let i=0;i<150;i++)g.tick();g.tap(200,700);for(let i=0;i<30;i++)g.tick();
 g.run(`if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=true;PG.lv.passed=Math.max(2,PG_SWITCH_LEVEL);PG.lv.sel=3;if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}PGU.boardCat='${cat}';PG.current='${cat}';PG.powers={tuxedo:2,orange:1,ragdoll:0,siamese:3,tortie:1};`+
  (kind==='endless'?`endStart();`:`pgPlay('${cat}');if(WILD.phase==='end')wildReset();wildStartCountdown();`));
 let k=0;while(g.run("WILD.phase")!=='play'&&k++<900)g.tick();for(let i=0;i<200;i++){if(i%30===0)g.tap(200+110*Math.sin(i/60*1.2+7),560);g.tick();}
 g.run("WILD.left=Math.max(WILD.left,90);WILD.nextBonus=999;");
 if(kind==='home'){g.run("if(WILD.on)wildExit();PGU.screen='main';");for(let i=0;i<30;i++)g.tick();}
 if(dev)g.run('S.dev=true;');
 g.state=()=>JSON.parse(g.run("JSON.stringify({cat:PGU.boardCat,screen:PGU.screen,end:typeof endActive==='function'&&endActive(),mode:WILD.mode,on:WILD.on,phase:WILD.phase,coins:S.coins,powers:PG.powers,pgpx:PGPX&&(PGPX.power||PGPX.id),dance:!!WILD.dance,orange:!!(WILD.dance&&WILD.dance.orange),ragdoll:!!(WILD.dance&&WILD.dance.ragdoll),want:CP102.want,err:CP102.err||null})"));
 g.errs=()=>JSON.parse(g.run('JSON.stringify(__errs)'));return g;}
const WHERE=['endless:tuxedo','endless:orange','level:tuxedo','level:orange','level:ragdoll','level:siamese','level:tortie','home:orange'];
(async()=>{
 // 1 side games
 {const rows={};let ok=true;for(const w of WHERE)for(const [id,run] of Object.entries(GAMES)){const g=await game(w);const a=g.state();g.run(`cp102Start('game','${id}')`);
   let st=null;for(let i=0;i<600&&!st;i++){g.tick();if(g.run(`!!WILD.${run}`))st=g.state();}
   const want={toss:'orange',chase:'siamese',pet:'ragdoll',pounce:'tortie'}[id],good=!!st&&st.cat===want&&st.end&&(a.end?st.coins>=a.coins:true)&& /* UAT 134 (item I): the endless board with the game's own cat; coins compared only when it starts on the endless wallet (a level's coins are another purse) */!g.errs().length;
   rows[w+' '+id]=good?'ok':{a,st,errs:g.errs()};if(!good)ok=false;g.close();}
  check('1 (UAT 134) every Side game button starts its game on the endless board with its own cat, from every board and Home, no coin used',ok,Object.fromEntries(Object.entries(rows).filter(([,v])=>v!=='ok')));res.sideGames=rows;}
 // 2 powers
 {const rows={};let ok=true;for(const w of WHERE)for(const c of ['tuxedo','orange','ragdoll','siamese','tortie']){const g=await game(w);const a=g.state(),pid=g.run(`PGP['${c}'].id`);g.run(`cp102Start('power','${c}')`);
   let st=null;for(let i=0;i<600&&!st;i++){g.tick();const s=g.state();if(s.pgpx&&String(s.pgpx).startsWith(pid))st=s;}
   for(let i=0;i<5;i++)g.tick();const b=g.state();
   const want=c,good=!!st&&st.cat===want&&st.end&& /* UAT 134 (item I): always the endless board */ /* UAT 133 (CP-94 #6): a power button switches to that power's cat first; the endless board stays on */JSON.stringify(b.powers)===JSON.stringify(a.powers)&&!g.errs().length;
   rows[w+' '+c]=good?'ok':{pid,a,st,b,errs:g.errs()};if(!good)ok=false;g.close();}
  check("2 (UAT 134) every Power button starts its power on the endless board with that power's cat, from every board and Home; the player's own power stock is unchanged",ok,Object.fromEntries(Object.entries(rows).filter(([,v])=>v!=='ok')));res.powers=rows;}
 // 3 Start Dance break now
 {const rows={};for(const w of ['level:tuxedo','level:orange','level:ragdoll','endless:tuxedo','home:orange','home:ragdoll','level:siamese','level:tortie']){const g=await game(w);g.run('danceStartNow()');
   let st=null;for(let i=0;i<600&&!st;i++){g.tick();if(g.run('!!WILD.dance'))st=g.state();}const after=st||g.state();
   rows[w]={dance:!!st,cat:after.cat,end:after.end,orange:after.orange,ragdoll:after.ragdoll,want:after.want,errs:g.errs().length};g.close();}
  const R=rows,ok=R['level:tuxedo'].dance&&!R['level:tuxedo'].orange&&!R['level:tuxedo'].ragdoll&&R['level:orange'].orange&&R['level:ragdoll'].ragdoll&&R['endless:tuxedo'].dance&&R['endless:tuxedo'].end&&
   R['home:orange'].orange&&R['home:orange'].cat==='orange'&&R['home:ragdoll'].ragdoll&&R['home:ragdoll'].cat==='ragdoll'&&!R['level:siamese'].dance&&!R['level:siamese'].want&&!R['level:tortie'].dance&&!R['level:tortie'].want&&Object.values(R).every(r=>!r.errs);
  check("3 Start Dance break now: the current cat's board and its own dance (endless too, and from Home); Siamese and Tortie get the note, no dance",ok,R);}
 // 4 the music row
 {const rows={};for(const [cat,store] of [['orange','CP94'],['ragdoll','CP101']])for(const dev of [true,false]){const g=await game('level:'+cat,{dev});g.run("WILD.dancePending={f:null,wait:9};");
   for(let i=0;i<30&&!g.run('!!WILD.dance');i++)g.tick();let j=0;while(+g.run('(danceNow()-WILD.dance.p0)/WILD.dance.beat')<2.3&&j++<600)g.tick();
   const before=JSON.parse(g.run('JSON.stringify({music:WILD.dance.music,taps:Object.keys(WILD.dance.judged).length,hits:WILD.dance.hits|0,misses:WILD.dance.misses|0,tapsN:WILD.dance.tapN|0})'));
   const sc=+g.run('scale'),Y=+g.run('DANCE_LANE_Y+60');g.pointer('pointerdown',(271)*sc,Y*sc);g.pointer('pointerup',(271)*sc,Y*sc);g.tick();
   const mid=JSON.parse(g.run(`JSON.stringify({music:WILD.dance.music,saved:${store}.get(),misses:WILD.dance.misses|0,hits:WILD.dance.hits|0})`));
   g.tap(200,200);g.tick();const after=JSON.parse(g.run('JSON.stringify({misses:WILD.dance.misses|0,hits:WILD.dance.hits|0})'));
   rows[cat+(dev?' dev':' no-dev')]={before,mid,after,errs:g.errs().length};g.close();}
  const R=rows,dev=c=>R[c+' dev'],nod=c=>R[c+' no-dev'];
  const PICK={orange:'B',ragdoll:'A'};const ok=['orange','ragdoll'].every(c=>dev(c).mid.music===PICK[c]&&(dev(c).mid.misses+dev(c).mid.hits)>(dev(c).before.misses+dev(c).before.hits) /* UAT 133: no music row; the tap is a dance tap; the music stays at the pick */
   &&nod(c).mid.music===nod(c).before.music&&(nod(c).mid.misses+nod(c).mid.hits)>(nod(c).before.misses+nod(c).before.hits)&&!dev(c).errs&&!nod(c).errs);
  check('4 (UAT 133, Jenny) no Music row: a tap where it was is a dance tap, the music stays at the pick (Orange B, Ragdoll A), Developer on or off',ok,R);}
 // 5 waits for a running side game
 {const g=await game('level:orange');g.run("WILD.tossPending={f:null,wait:9};");for(let i=0;i<120&&!g.run('!!WILD.toss');i++)g.tick();const during=g.run('!!WILD.toss');
  g.run("cp102Start('game','chase')");for(let i=0;i<20;i++)g.tick();const notYet=!g.run('!!WILD.chase')&&!!g.run('CP102.want');
  let k=0;while(g.run('!!WILD.toss')&&k++<4000)g.tick();let st=false;for(let i=0;i<600&&!st;i++){g.tick();st=g.run('!!WILD.chase');}
  check('5 a start-now while another side game runs waits for it, then starts',during&&notYet&&st&&!g.errs().length,{during,notYet,st,errs:g.errs()});g.close();}
 check('6 production and the UAT channel untouched',sha(prodJ)===prod0&&sha(uatJ)===uat0);
 fs.writeFileSync(path.join(out,'checks102d.json'),JSON.stringify({build:src,passed:failed.length===0,passedChecks:passed,failed,res},null,1));
 console.log(`${passed.length} passed, ${failed.length} failed`);process.exit(failed.length?1:0);
})().catch(e=>{console.error(e);process.exit(2)});
