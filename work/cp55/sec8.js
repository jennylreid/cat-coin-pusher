 // 8. UAT 55: the A/B of the between-rounds layout (A main screen, B board view)
 if(on(8)){const mk=async(ab,dev=false,seed=3)=>{const g=await game({src,seed,render:true,storage:{'catpusher.uat.homelayout.v1':ab,'catpusher.uat.devdefault.v1':'1'}});const st=strictAudio(g);g.run(`S.muted=false;S.dev=${dev}`);const errs=[];
   g.run("globalThis.__toast=[];const t0=pgToast;pgToast=function(t,...a){__toast.push(t);return t0.call(this,t,...a);};");play(g,130,errs,10);g.tap(200,400);play(g,40,errs,4);return {g,st,errs};};
  const ctr=(r)=>({x:r.x+r.w/2,y:r.y+r.h/2});
  // A
  {const {g,st,errs}=await mk('A');const s0=J(g,'{screen:PGU.screen,phase:WILD.phase,cat:PGU.boardCat,ab:PG_AB}');
   check('A: after the title the main screen shows (the board waits behind on its goal)',s0.screen==='main'&&s0.phase==='card'&&s0.cat==='tuxedo'&&s0.ab==='A',s0);
   const R=J(g,'(()=>{const R=pgMainRects();return {head:R.head,side:R.side.map(b=>({id:b.id,x:b.x,y:b.y,r:b.r})),play:PGA.L.play,help:PGA.L.help,top:R.top}})()');
   check('A: the side buttons are small and at the edges, clear of the cat (left Kitchen, Porch, Album; right Shop, Boards), below the top bar',R.side.map(b=>b.id).join()==='kitchen,porch,album,shop,board'&&R.side.every(b=>b.r<=25&&(b.x+b.r<R.head.x-R.head.w/2||b.x-b.r>R.head.x+R.head.w/2)&&b.y-b.r>R.top),R.side);
   check('A: PLAY is the one big button (244 x 78, about 15 times the area of a side button)',R.play.w*R.play.h>10*Math.PI*25*25,R.play);
   g.tap(ctr(J(g,'pgMainRects().side[0].hit')).x,ctr(J(g,'pgMainRects().side[0].hit')).y);play(g,20,errs);
   check('A: a locked side button (Kitchen, level 2) stays shut and says so',g.run('PGU.screen')==='main'&&J(g,'__toast').some(t=>/level 2/.test(t)),J(g,'__toast'));
   g.run('PG.level=2');{const h=J(g,'pgMainRects().side[0].hit');g.tap(h.x+h.w/2,h.y+h.h/2);}play(g,30,errs);const k=g.run('PGU.screen');g.tap(J(g,'pgBack()').x+20,J(g,'pgBack()').y+15);play(g,10,errs);
   check('A: Kitchen opens from its side button; back returns to the main screen',k==='kitchen'&&g.run('PGU.screen')==='main',{k,back:g.run('PGU.screen')});
   g.tap(200,R.help.y+R.help.h/2);play(g,10,errs);const rl=J(g,'{screen:PGU.screen,rules:PGU.rules,phase:WILD.phase}');shot(g,'A-how-to-play');
   check('A: "? How to play" shows the old goal card on the board',rl.screen==='board'&&rl.rules&&rl.phase==='card',rl);
   g.tap(200,600);play(g,5,errs);check('A: from there a tap starts the round as before',g.run('WILD.phase')==='count'&&!g.run('PGU.rules'),g.run('WILD.phase'));
   g.run('wildFinish(true)');play(g,120,errs,6);const e=J(g,'{screen:PGU.screen,phase:WILD.phase}');shot(g,'A-end-card');
   g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   check("A: after a round the end card shows on the board; its New goal comes back to the main screen",e.screen==='board'&&e.phase==='end'&&g.run('PGU.screen')==='main'&&g.run('WILD.phase')==='card',{end:e,after:g.run('PGU.screen')});
   g.tap(200,R.play.y+R.play.h/2);play(g,6,errs);check('A: PLAY goes onto the board and starts the round (3, 2, 1)',g.run('PGU.screen')==='board'&&g.run('WILD.phase')==='count',J(g,'{screen:PGU.screen,phase:WILD.phase}'));
   g.run('wildFinish(true)');play(g,120,errs,6);g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   g.run("PG.level=6;for(const c of PG_CATS)PG.open[c]=1");{const h=J(g,'pgMainRects().side[4].hit');g.tap(h.x+h.w/2,h.y+h.h/2);}play(g,30,errs);const pk=g.run('PGU.pick');
   {const r=J(g,"pgPickRects().rows.find(r=>r.c==='orange')");g.tap(r.x+r.w/2,r.y+r.h/2);}play(g,40,errs);
   check("A: Boards opens the picker on the main screen; picking the Orange's board stays on the main screen, now for TREAT TOSS",pk&&g.run('PGU.screen')==='main'&&g.run('PGU.boardCat')==='orange'&&g.run('wildModeName()')==='TREAT TOSS',J(g,'{pk:'+pk+',screen:PGU.screen,cat:PGU.boardCat,name:wildModeName()}'));
   g.tap(R.head.x,R.head.y);play(g,10,errs);check('A: a tap on the cat gets the sweet face, hearts and a meow',g.run('PGA.hearts.length')>0);
   g.tap(370,J(g,'pgDock().y1'));play(g,5,errs);const cr=g.run("panel.style.display");g.run("panel.style.display='none'");
   check('A: the top bar works on the main screen (Settings opens)',cr==='block',cr);
   check('A: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  // B
  {const {g,st,errs}=await mk('B');const s0=J(g,'{screen:PGU.screen,phase:WILD.phase,rest:pgRestPhase()}');play(g,10,errs);
   check('B: after the title the board shows, with the new panel in the goal card area (no extra screen)',s0.screen==='board'&&s0.phase==='card'&&s0.rest&&!!g.run('PGU.bL&&PGU.bL.play'),s0);
   const B=J(g,'(()=>{const B=pgBLayout();return {ch:B.ch,panel:B.panel,side:B.side.map(b=>({id:b.id,x:b.x,y:b.y,r:b.r})),play:PGU.bL.play,help:PGU.bL.help}})()');
   check("B: nothing over the cat's face: the panel, PLAY and the side buttons are all below the chin",B.panel.y>B.ch&&B.play.y>B.ch&&B.side.every(b=>b.y-b.r>B.ch),{ch:B.ch,panel:B.panel.y,side:B.side.map(b=>b.y-b.r)});
   check('B: the top bar has no row of five big buttons any more (they are the side buttons)',J(g,'pgDock().tiles.length')===0&&B.side.length===5);
   g.tap(200,B.panel.y+B.panel.h*.45);play(g,5,errs);check('B: a tap in the panel away from PLAY does not start the round',g.run('WILD.phase')==='card');
   g.tap(200,B.play.y+B.play.h/2);play(g,5,errs);check('B: PLAY starts the round',g.run('WILD.phase')==='count');
   g.run('wildFinish(true)');play(g,120,errs,6);g.tap(...Object.values(ctr(J(g,'wildEndRects().back'))));play(g,20,errs);
   check("B: the end card's New goal comes back to the board view's panel",g.run('PGU.screen')==='board'&&g.run('WILD.phase')==='card'&&!g.run('PGU.rules'));
   g.tap(200,B.help.y+B.help.h/2);play(g,5,errs);check('B: "? How to play" shows the old goal card',g.run('PGU.rules')===true);g.tap(200,600);play(g,5,errs);
   check('B: from there a tap starts the round as before',g.run('WILD.phase')==='count');
   check('B: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
  // badges, the switch, Developer off
  {const {g,errs}=await mk('A',true);g.run("PG.level=4;for(const c of ['tuxedo','orange','ragdoll'])PG.open[c]=1;PG.newBoard='ragdoll';PG.newPhoto=1;PG.recipes.tunadish=1;PG.seen['r:tunadish']=0");play(g,10,errs);
   const w=J(g,"['kitchen','porch','album','shop','board'].map(id=>[id,pgWaiting(id)])");
   check('a "!" shows on a side button when something waits there (the same rules as the old paws)',w.find(x=>x[0]==='kitchen')[1]&&w.find(x=>x[0]==='album')[1]&&w.find(x=>x[0]==='board')[1],w);
   const html=g.run('pgDevHtml()');check('Developer: "Home layout" switch (A main screen / B board view) and a difficulty tag per board',/id="pg-ab"/.test(html)&&/A main screen/.test(html)&&(html.match(/data-pgdiff=/g)||[]).length===5,null);
   g.run("PG_AB='B'");play(g,3,errs);const toB=g.run('PGU.screen');g.run("PG_AB='A'");play(g,3,errs);const toA=g.run('PGU.screen');
   check('switching the layout takes effect at once (main screen to board view and back)',toB==='board'&&toA==='main',{toB,toA});
   check('difficulty tags: placeholders by opening order (Tuxedo and Orange Normal, Ragdoll and Siamese Hard, Tortie Super hard), shown with Level n',JSON.stringify(PG_DIFF_DEFAULT_CHECK=J(g,'PG_DIFF'))==='{"tuxedo":"Normal","orange":"Normal","ragdoll":"Hard","siamese":"Hard","tortie":"Super hard"}',J(g,'PG_DIFF'));
   g.run('S.dev=false');play(g,3,errs);check('Developer off = production view: no MODES chip on the bar (the layout switch and tags are only in the Developer panel)',J(g,'pgDock().modes')===null);
   check('switch and badges: no errors',!errs.length,errs);g.close();}}
