# One-off: makes checks54.cjs from UAT 53's checks (taps after the title's intro) plus the title section 7.
from pathlib import Path
p = Path(__file__).parent / 'checks54.cjs'
s = p.read_text(encoding='utf-8')
s = s.replace("g.ticks(20);g.tap(200,400)", "g.ticks(120);g.tap(200,400)").replace("play(g,20,errs);g.tap(200,400)", "play(g,120,errs,10);g.tap(200,400)")
s = s.replace("'2026.11.14 UAT 53'", "'2026.11.14 UAT 54'").replace("'uat53'", "'uat54'")
s = s.replace("// UAT 53 checks:", "// UAT 54 checks: UAT 53's (below; taps now come after the title's intro) plus the title screen that stays until TAP TO PLAY,\n// with a bigger, slower coin rain (section 7).\n// UAT 53 checks:", 1)
sec7 = r''' // 7. the title screen (UAT 54): the intro plays out, then it stays alive until TAP TO PLAY; a bigger, slower coin rain
 if(on(7)){const g=await game({src,seed:3,render:true});const st=strictAudio(g);g.run('S.muted=false');const errs=[];
  g.run(`globalThis.__ord=[];const h=pgHead;pgHead=function(...a){if(PGU.screen==='title')__ord.push('cat');return h.apply(this,a);};const w=wildText;wildText=function(t,...a){if(PGU.screen==='title'&&/^[CatoinC]$/.test(t))__ord.push('title');return w.call(this,t,...a);};
   const P=Object.getPrototypeOf(ctx),di=P.drawImage;P.drawImage=function(img,...a){if(PGU.screen==='title'&&img===sprite('coin').cv)__ord.push('coin');return di.call(this,img,...a);};`);
  play(g,30,errs);g.tap(200,400);play(g,30,errs);const s1=J(g,'{screen:PGU.screen,t:PGU.title.t}');
  check('a tap during the intro is ignored: the intro plays out (no jump to the board)',s1.screen==='title'&&s1.t>.9,s1);
  play(g,60,errs);shot(g,'title-tap-to-play');
  for(let i=0;i<60*30;i++){g.tick();if(i%30===0)g.c.draw();}
  const s2=J(g,'{screen:PGU.screen,t:PGU.title.t,coins:PGU.title.coins.length}');
  check('after the intro it stays on the title (32 s and counting), the rain still going, until the player taps',s2.screen==='title'&&s2.t>30&&s2.coins>=5,s2);
  const c=J(g,'(()=>{const a=PGU.title.coins;return {rMin:Math.min(...a.map(c=>c.r)),rMax:Math.max(...a.map(c=>c.r)),vMax:Math.max(...a.map(c=>c.vy))};})()');
  check('the coins are the board coin, bigger (22-34 px radius, was 10-17) and slower (at most 190 px/s, was 170-330 and speeding up)',c.rMin>=22&&c.rMax<=34&&c.vMax<=190,c);
  g.run('__ord.length=0');g.c.draw();const ord=J(g,'__ord'),lastCoin=ord.lastIndexOf('coin'),firstCat=ord.indexOf('cat'),firstTitle=ord.indexOf('title');
  check("the coins are drawn behind the cat's face and the CatCoin title (never over them)",lastCoin>=0&&lastCoin<firstCat&&lastCoin<firstTitle,{lastCoin,firstCat,firstTitle,n:ord.length});
  g.tap(200,400);play(g,40,errs);const s3=J(g,'{screen:PGU.screen,on:WILD.on,phase:WILD.phase,cat:PGU.boardCat}');
  check("a tap after the intro (TAP TO PLAY) opens the Tuxedo's board on its goal card",s3.screen==='board'&&s3.on&&s3.phase==='card'&&s3.cat==='tuxedo',s3);
  check('title: no errors with sound on',!errs.length&&st.created>0,errs);g.close();}
'''
i = s.index(" console.log(`")
s = s[:i] + sec7 + s[i:]
p.write_text(s, encoding='utf-8')
print('ok')
