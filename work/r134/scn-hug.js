// The phone flow: all cats open, the Tuxedo; Home; PLAY (the endless board); round in play; Settings, Developer on; tap Hug.
const st=()=>JSON.parse(w.eval("JSON.stringify({screen:PGU.screen,cat:PGU.boardCat,cur:PG.current,wild:WILD.on,phase:WILD.phase,end:END.on,endA:endActive(),px:PGPX&&(PGPX.power||PGPX.id)||null,want:CP102.want,err:CP102.err||null,panel:panel.style.display,coins:S.coins,wallet:END.w&&END.w.coins,key:END.on?endKey():null,bodies:bodies.filter(b=>!b.dead).length,art:typeof PGU.art!=='undefined'?PGU.art:null})"));
const where=new URLSearchParams(parent.location.search).get('where')||'endless';
w.eval("if(!PG)pgInit();for(const c of PG_CATS)PG.open[c]=1;PG.lv.passed=Math.max(PG.lv.passed||0,PG_SWITCH_LEVEL+2);if(PGU.screen==='title'){PGU.title.t=9;pgTitleDone();}PGU.boardCat='tuxedo';PG.current='tuxedo';if(WILD.on)wildExit();PGU.screen='main';pgSave();");
await sleep(800);log({home:st()});
if(where==='endless'){w.eval("endStart()");for(let i=0;i<60&&w.eval("WILD.phase")!=='play';i++)await sleep(250);await sleep(2500);}
if(where==='level'){w.eval("pgPlay('tuxedo');if(WILD.phase==='end')wildReset();wildStartCountdown();");for(let i=0;i<60&&w.eval("WILD.phase")!=='play';i++)await sleep(250);await sleep(2500);}
const pre=new URLSearchParams(parent.location.search).get('pre');if(pre){log({pre:w.eval(pre)});await sleep(+(new URLSearchParams(parent.location.search).get('wait')||300));}
log({before:st()});await shot('before-'+where);
w.eval("S.dev=true;openCredits();");await sleep(600);
const b=w.eval("(()=>{const b=panel.querySelector('#cp102-power-ragdoll');return b?{t:b.textContent,vis:b.getClientRects().length>0}:null})()");log({btn:b});
w.eval("panel.querySelector('#cp102-power-ragdoll').click()");log({tap:st()});
for(let i=0;i<40;i++){await sleep(250);const s=st();if(i%4===0||s.px)log({t:i/4,...s});if(s.px){await sleep(1200);await shot('hug-'+where);break;}}
log({diag:w.eval("JSON.stringify((typeof DIAG!=='undefined'&&DIAG.events?DIAG.events:[]).slice(-12))")});
return st();
