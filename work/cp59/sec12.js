 // 12. UAT 59: layout A's group sits together (PLAY right under How to play, no big gap) and the coin pile has room under
 //     PLAY (never touching it), on 720, 889 and 960-high screens; the side buttons are as before
 if(on(12)){const out={},bad=[];for(const height of [720,888.889,960]){const g=await game({src,seed:3,render:true,height,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.homelayout.v1':'A'}});strictAudio(g);g.run('S.dev=false');g.ticks(130);g.tap(200,400);for(let i=0;i<40;i++){g.tick();if(i%4===0)g.c.draw();}g.c.draw();
   const r=J(g,'(()=>{const R=pgMainRects(),rows=pgMainPileRows(R);return {help:PGA.L.help.y+PGA.L.help.h,play:PGA.L.play,pileTop:R.bot-28-(rows-1)*44-27,rows,side:R.side.map(b=>[b.id,b.x,Math.round(b.y)])}})()');
   const gap=r.play.y-r.help,room=r.pileTop-(r.play.y+r.play.h);out[Math.round(height)]={gap:Math.round(gap),room:Math.round(room),rows:r.rows,side:r.side};
   if(!(gap>=8&&gap<=24))bad.push([height,'gap',gap]);if(room<10)bad.push([height,'pile touches PLAY',room]);g.close();}
  check("layout A: PLAY sits right under How to play (8-24 px, no big empty gap) and the pile has its own room below PLAY, on 720/889/960-high screens",bad.length===0,{bad,out});}
