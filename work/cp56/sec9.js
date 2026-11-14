 // 9. UAT 56: Board button, Dance meter (+ hint, pulse), nothing overlaps, Level = board number, cat head proportions, title coins 1-4
 if(on(9)){const base=async(o={})=>{const g=await game({src,seed:3,render:true,height:o.height||888.889,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.homelayout.v1':o.ab||'A',...(o.storage||{})}});const st=strictAudio(g);
   if(o.inset!=null)g.run(`androidSafeArea.top=${o.inset};androidSafeArea.bottom=24;androidSafeArea.width=innerWidth`);g.run('S.muted=false;S.dev=false');const errs=[];return {g,st,errs};};
  const toRound=(g,errs)=>{play(g,130,errs,10);g.tap(200,400);play(g,40,errs,8);g.run('PGU.screen="board";wildStartCountdown()');play(g,260,errs,20);};
  // overlaps on every size
  const ov=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h,bad=[];
  for(const height of [720,888.889,960])for(const inset of [0,24,48]){const {g,errs}=await base({height,inset,ab:'B'});toRound(g,errs);
   const R=J(g,`(()=>{const h=hudLayout(),x0=W-Math.max(8,h.right+10)-124,y=h.bannerY;ctx.font='bold 11px system-ui';const lw=ctx.measureText('DANCE METER').width;
    return {btn:wildButton(),gear:pgPlayGear(),label:{x:x0+24,y:y-13-6,w:lw,h:12},meter:{x:x0+20,y:y-7,w:104,h:14},top:h.top}})()`);
   for(const [n1,n2] of [['btn','label'],['gear','label'],['btn','meter'],['gear','meter'],['btn','gear']])if(ov(R[n1],R[n2]))bad.push([height,inset,n1,n2]);if(R.btn.y<R.top-1)bad.push([height,inset,'btn above the safe area']);g.close();}
  check('nothing overlaps in the round HUD: Board button, Settings gear, the Dance meter and its label, on 720/889/960-high screens with status bars of 0, 24 and 48 px',bad.length===0,bad);
  // Board button, Dance meter, hint, pulse
  {const {g,st,errs}=await base({ab:'A'});g.run("globalThis.__tx={};const P=Object.getPrototypeOf(ctx),f=P.fillText;P.fillText=function(t,...a){__tx[String(t)]=1;return f.call(this,t,...a);};");toRound(g,errs);g.c.draw();
   check('during a round the button says "Board" with a back arrow (not EXIT); the meter says DANCE METER (not HAPPY CAT)',!!g.run("__tx['Board']")&&!g.run("__tx['EXIT']")&&!!g.run("__tx['DANCE METER']")&&!g.run("__tx['HAPPY CAT']"),Object.keys(J(g,'__tx')).filter(t=>/Board|EXIT|DANCE|HAPPY/.test(t)));
   g.run('danceFill(1,200)');play(g,6,errs);const h1=J(g,'{hint:!!PGU.dHint,happyT:WILD.happyT}');shot(g,'hud-hint');
   check('the first time ever the meter fills, a hint shows under it ("Prizes fill it. Full = Dance break!"), with a pulse round the meter',h1.hint&&h1.happyT<.45,h1);
   play(g,260,errs,20);check('the hint goes after about 4 s',!g.run('PGU.dHint'));
   check('the goal card says "Prizes fill the dance meter"',J(g,'W2_CARD_LINES').some(l=>l[1]==='Prizes fill the dance meter'));
   const b=J(g,'wildButton()'),cat=g.run('PGU.boardCat');g.tap(b.x+b.w/2,b.y+b.h/2);play(g,30,errs,5);
   check("Board goes back to this board's between-rounds view (layout A: its main screen)",g.run('PGU.screen')==='main'&&g.run('WILD.phase')==='card'&&g.run('PGU.boardCat')===cat,J(g,'{screen:PGU.screen,phase:WILD.phase,cat:PGU.boardCat}'));
   check('Board button and Dance meter: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  {const {g,errs}=await base({ab:'B',storage:{'catpusher.uat.dancehint.v1':'1'}});toRound(g,errs);g.run('danceFill(1,200)');play(g,6,errs);check('the hint shows once only (not again on this phone)',!g.run('PGU.dHint'));g.close();}
  // Level = the board number
  {const {g,errs}=await base({ab:'A'});play(g,130,errs,10);g.tap(200,400);play(g,30,errs,6);const l0=g.run('pgBoardLevel()');g.run('PGU.screen="board";wildStartCountdown()');play(g,200,errs,20);g.run('wildFinish(true)');play(g,120,errs,20);
   const l1=g.run('pgBoardLevel()');g.run('wildReset();wildStartCountdown()');play(g,200,errs,20);g.run('wildFinish(false)');play(g,120,errs,20);const l2=g.run('pgBoardLevel()');
   check('"Level n" on PLAY is the board number in sequence: 1 on a new save, +1 for each round won, not for a loss',l0===1&&l1===2&&l2===2,{l0,l1,l2});g.close();}
  // the cat head's proportions
  {const {g,errs}=await base({ab:'A'});g.run("globalThis.__hd=[];const P=Object.getPrototypeOf(ctx),di=P.drawImage;P.drawImage=function(img,...a){if(img&&img.width===1536&&img.height===1024&&a.length>=4)__hd.push([PGU.screen,+(a[a.length-2]/a[a.length-1]).toFixed(3)]);return di.call(this,img,...a);};");
   play(g,60,errs,1);const t1=J(g,'__hd.filter(x=>x[0]==="title").map(x=>x[1])');g.tap(200,400);play(g,130,errs,10);g.tap(200,400);play(g,20,errs,1);const m1=J(g,'__hd.filter(x=>x[0]==="main").map(x=>x[1])');
   check('the cat head is drawn at the art\'s own proportions (1536 x 1024 = 1.5; was 1.75) on the title and the main screen',t1.length&&m1.length&&t1.concat(m1).every(r=>Math.abs(r-1.5)<.01),{title:t1.slice(0,2),main:m1.slice(0,2)});g.close();}
  // title coin rains 1-4
  {const out={};for(const v of [1,2,3,4]){const {g,st,errs}=await base({storage:{'catpusher.uat.titlecoins.v1':String(v)}});g.run("globalThis.__clink=0;globalThis.__thick=0;const s0=pgSfx;pgSfx=function(k,...a){if(k==='coin'&&PGU.title.t>2)__clink++;return s0.call(this,k,...a);};const tc=pgThickCoin;pgThickCoin=function(...a){__thick++;return tc.apply(this,a);};");
    let up=0,vmax=0;for(let i=0;i<60*7;i++){g.tick();if(i%6===0)g.c.draw();const r=J(g,'(()=>{const a=PGU.title.coins;return [a.some(c=>c.vy<0),Math.max(0,...a.map(c=>c.vy))]})()');if(r[0])up++;vmax=Math.max(vmax,r[1]);}
    out[v]={mode:g.run('PGU.title.mode'),vmax:Math.round(vmax),up,thick:g.run('__thick'),pile:g.run('PGU.title.pile?PGU.title.pile.length:0'),clinks:g.run('__clink'),screen:g.run('PGU.screen'),errs:errs.length};shot(g,'title-check-'+v);g.close();}
   check('title coins 1: the same flat coins, about twice as fast (top speed 380 px/s, was 190)',out[1].mode===1&&out[1].vmax>=300&&out[1].thick===0,out[1]);
   check('title coins 2 (default): as fast, and each coin shows its gold edge as it turns',out[2].mode===2&&out[2].vmax>=300&&out[2].thick>0,out[2]);
   check('title coins 3: a fountain: coins burst up from the bottom and arc back down',out[3].mode===3&&out[3].up>30&&out[3].thick>0,out[3]);
   check('title coins 4: coins fall fast and pile up at the bottom with clinks',out[4].mode===4&&out[4].pile>=20&&out[4].clinks>=10,out[4]);
   check('all four stay on the title until a tap, with no errors with sound on',Object.values(out).every(o=>o.screen==='title'&&!o.errs),out);}
  {const {g}=await base();check('Developer: "Title coins" switch (default 2), "Show the title screen again", "Show the Dance meter hint again"',g.run('PG_TC')===2&&/id="pg-tc"/.test(g.run('pgDevHtml()'))&&/id="pg-title"/.test(g.run('pgDevHtml()'))&&/id="pg-dhint"/.test(g.run('pgDevHtml()')));g.close();}}
