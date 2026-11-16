 // 10. UAT 57: B's panel and PLAY end above the bottom readouts (Collection n / 5 and its icons), and nothing overlaps
 //     inside A or B, on 720, 889 and 960-high screens (rule 11)
 if(on(10)){const bad=[],info={};const ov=(a,b)=>a.x<b.x+b.w&&b.x<a.x+a.w&&a.y<b.y+b.h&&b.y<a.y+a.h;
  for(const ab of ['A','B'])for(const height of [720,888.889,960]){const g=await game({src,seed:3,render:true,height,storage:{'catpusher.uat.homelayout.v1':ab,'catpusher.uat.devdefault.v1':'1'}});strictAudio(g);g.run('S.dev=false');g.ticks(130);g.tap(200,400);for(let i=0;i<40;i++){g.tick();if(i%4===0)g.c.draw();}g.c.draw();
   const R=J(g,`(()=>{const L=${ab==='B'?'PGU.bL':'PGA.L'},h=hudLayout(),side=${ab==='B'?'pgBLayout().side':'pgMainRects().side'};return {play:L.play,help:L.help,side:side.map(b=>({x:b.x-b.r,y:b.y-b.r,w:2*b.r,h:2*b.r+18})),readTop:h.bottomY-6,panel:${ab==='B'?'pgBLayout().panel':'null'}}})()`);
   info[ab+Math.round(height)]={play:[Math.round(R.play.y),Math.round(R.play.y+R.play.h)],help:Math.round(R.help.y+R.help.h),readTop:Math.round(R.readTop)};
   if(ov(R.play,R.help))bad.push([ab,height,'PLAY over How to play']);for(const s of R.side){if(ov(s,R.play))bad.push([ab,height,'side over PLAY']);if(ov(s,R.help))bad.push([ab,height,'side over help']);}
   if(ab==='B'){if(R.play.y+R.play.h>R.readTop)bad.push([ab,height,'PLAY over the bottom readouts']);if(R.panel.y+R.panel.h>R.readTop)bad.push([ab,height,'panel over the bottom readouts']);}
   shot(g,`${ab}-${Math.round(height)}`);g.close();}
  check('nothing overlaps on 720/889/960-high screens: in B the panel and PLAY end above the bottom readouts; PLAY, How to play and the side buttons never touch, in A or B',bad.length===0,{bad,info});}
