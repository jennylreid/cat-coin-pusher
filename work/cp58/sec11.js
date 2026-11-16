 // 11. UAT 58: no glow or halo on any coin (title and main screen); falling coins on the main screen are solid (their gold
 //     edge as they turn); the pile is 9 coins at their true proportions, not squashed, not crowded
 if(on(11)){const g=await game({src,seed:3,render:true,storage:{'catpusher.uat.devdefault.v1':'1','catpusher.uat.homelayout.v1':'A'}});strictAudio(g);g.run('S.dev=false');
  g.run(`globalThis.__glow=0;globalThis.__thick=0;globalThis.__pile=[];const P=Object.getPrototypeOf(ctx),f=P.fill,di=P.drawImage;
   P.fill=function(...a){if(this.fillStyle==='#ffd76a'&&this.globalAlpha<1&&(PGU.screen==='title'||PGU.screen==='main'))__glow++;return f.apply(this,a);};
   P.drawImage=function(img,...a){if(PGU.screen==='main'&&img===sprite('coin').cv&&a.length===4&&this.getTransform().a===scale*renderPixelRatio)__pile.push([+(a[2]/a[3]).toFixed(3),Math.round(a[0]+a[2]/2),Math.round(a[1]+a[3]/2),Math.round(a[2])]);return di.call(this,img,...a);};
   const tc=pgThickCoin;pgThickCoin=function(...a){if(PGU.screen==='main')__thick++;return tc.apply(this,a);};`);
  for(let i=0;i<150;i++){g.tick();if(i%3===0)g.c.draw();}const tg=g.run('__glow');g.tap(200,400);for(let i=0;i<60;i++){g.tick();if(i%3===0)g.c.draw();}g.run('__pile.length=0;__glow=0;__thick=0');g.c.draw();
  const pile=J(g,'__pile'),mg=g.run('__glow'),th=g.run('__thick');
  let crowd=0;for(let i=0;i<pile.length;i++)for(let j=i+1;j<pile.length;j++)if(Math.abs(pile[i][2]-pile[j][2])<5&&Math.abs(pile[i][1]-pile[j][1])<pile[i][3]*.95)crowd++;
  check('no glow or halo on any coin: the title (rain 2) and the main screen',tg===0&&mg===0,{title:tg,main:mg});
  check("the main screen's falling coins are solid coins with their gold edge as they turn (not paper-thin discs)",th>0,{thick:th});
  check('the pile under PLAY: 9 coins at their true proportions (round, not squashed), side by side without crowding',pile.length===9&&pile.every(p=>p[0]===1)&&crowd===0,{pile,crowd});
  g.close();}
