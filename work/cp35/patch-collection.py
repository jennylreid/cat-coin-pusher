# One-off: CP-35 goal change relayed by the PM (Nov 11): collect the whole collection; lose on time or coins.
from pathlib import Path
p = Path(__file__).parent / 'wild35.js'
s = p.read_text(encoding='utf-8')


def r(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)


r("const WILD_GOAL=6,", "const WILD_COLLECTION=['cheese','shrimp','tuna','yarn','duck','mouse','bell'],WILD_GOAL=WILD_COLLECTION.length,WILD_OUT_SEC=6,")
r("toppled:0,rained:0,bonusN:0};\nconst", "toppled:0,rained:0,bonusN:0,have:{},lastPay:0,reason:''};\nconst")
r("got:0,nextBonus:5,", "got:0,have:{},lastPay:0,reason:'',nextBonus:5,")
r("function wildFinish(win){", "function wildFinish(win,reason){")
r("board.endReason=win?'wild-goal':'time';", "board.endReason=win?'wild-goal':(reason||'time');WILD.reason=win?'':(reason||'time');")
r("try{diagEvent('wild',win?'win':'time-up');}catch(e){}", "try{diagEvent('wild',win?'win':WILD.reason);}catch(e){}")
r("""function wildPrizeCollected(b,x){
 WILD.got++;queueTreatAward(b.id,x,b);
 const p=proj(x,T.FRONT);floats.push({text:WILD.got>=WILD_GOAL?'GOAL!':'PRIZE '+WILD.got+'/'+WILD_GOAL,x:p.x,y:p.y-10,t:0,big:true});
 if(WILD.got>=WILD_GOAL)wildFinish(true);
}""", """function wildPrizeCollected(b,x){
 // Each prize of the collection counts once; a repeat pays 5 coins into the Wild bank instead.
 queueTreatAward(b.id,x,b);const p=proj(x,T.FRONT),fresh=WILD_COLLECTION.includes(b.id)&&!WILD.have[b.id];
 if(fresh){WILD.have[b.id]=true;WILD.got++;floats.push({text:WILD.got>=WILD_GOAL?'COLLECTION!':WILD.got+' / '+WILD_GOAL,x:p.x,y:p.y-10,t:0,big:true});}
 else{S.coins+=5;board.remaining=S.coins;floats.push({text:'REPEAT +5 COINS',x:p.x,y:p.y-10,t:0});}
 if(WILD.got>=WILD_GOAL)wildFinish(true);
}
// Needed prizes that are nowhere on the board or on their way (lost off a side): the next bonus drop brings one.
function wildMissing(){return WILD_COLLECTION.filter(id=>!WILD.have[id]&&!bodies.some(b=>!b.dead&&b.kind==='item'&&b.id===id)&&!WILD.incoming.some(o=>o.id===id));}""")
r("""const r=Math.random(),pick=r<.3?'rain5':r<.5?'rain10':r<.58?'rain25':r<.7?'quake':'prize';
 const id=pick==='prize'?['yarn','duck','mouse','bell','cheese','shrimp','tuna'][Math.random()*7|0]:null;""",
  """const miss=wildMissing(),r=Math.random(),pick=miss.length?'prize':r<.3?'rain5':r<.5?'rain10':r<.58?'rain25':r<.7?'quake':'prize';
 const need=WILD_COLLECTION.filter(id=>!WILD.have[id]),id=pick!=='prize'?null:miss.length?miss[0]:need.length&&Math.random()<.5?need[Math.random()*need.length|0]:WILD_COLLECTION[Math.random()*WILD_GOAL|0];""")
r(" if(WILD.left<=0){wildFinish(false);return;}",
  " if(WILD.left<=0){wildFinish(false,'time');return;}\n"
  " // Out of coins: empty bank, nothing raining or falling in, no Quake to use, and nothing paid at the front for WILD_OUT_SEC.\n"
  " if(S.coins>0||WILD.rainLeft>0||WILD.rains.length||WILD.incoming.length||board.earnedQuakes>0||catquakeTime>0)WILD.lastPay=Math.max(WILD.lastPay,time);\n"
  " if(time-WILD.lastPay>=WILD_OUT_SEC){wildFinish(false,'coins');return;}\n"
  " if(WILD.nextBonus>2&&wildMissing().length)WILD.nextBonus=2;")
r(" if(board.status!=='playing'){removeCoin(b);return;}", " if(board.status!=='playing'){removeCoin(b);return;}\n WILD.lastPay=time;")
r("  return __wildFallOff(b,x); // coins", "  if(!rescue&&!side)WILD.lastPay=time;\n  return __wildFallOff(b,x); // coins")
r("""ctx.fillText('Prizes '+WILD.got+' / '+WILD_GOAL,hud.left+20,bottom+7);
 for(let i=0;i<WILD_GOAL;i++){const x=hud.left+26+i*15,y=bottom+26,got=i<WILD.got;uiCircle(x,y,5.5,got?'#7dff6a':'rgba(255,255,255,.12)',got?'#2f8a26':'#fff0d0',1);}""",
  """ctx.fillText('Collection '+WILD.got+' / '+WILD_GOAL,hud.left+14,bottom+5);
 WILD_COLLECTION.forEach((id,i)=>{const x=hud.left+24+(i%4)*24,y=bottom+22+(i/4|0)*22;wildIcon(id,x,y,20,!!WILD.have[id]);});""")
r("function wildMessage(){return S.coins===0?'Out of coins!'",
  "function wildIcon(id,x,y,w,got){ctx.save();ctx.globalAlpha=got?1:.32;drawPrize('item',id,x,y+w*.3,w/(radius('item')*2.8));ctx.restore();if(got){const cx=x+w*.42,cy=y+w*.3;uiCircle(cx,cy,5,'#7dff6a','#1f6a18',1);ctx.strokeStyle='#0c3a12';ctx.lineWidth=1.6;ctx.beginPath();ctx.moveTo(cx-2.5,cy);ctx.lineTo(cx-.5,cy+2);ctx.lineTo(cx+2.8,cy-2.2);ctx.stroke();}}\n"
  "function wildMessage(){return S.coins===0&&WILD.phase==='play'?(board.earnedQuakes>0?'Use your Quake!':'Out of coins!')")
r("(WILD.win?'You won!':\"Time's up\"):'Win '+WILD_GOAL+' prizes!';}", "(WILD.win?'You won!':WILD.reason==='coins'?'Out of coins':\"Time's up\"):'Collect all '+WILD_GOAL+'!';}")
r("""ctx.fillStyle='#fff';ctx.font='bold 22px system-ui';ctx.fillText('Win '+WILD_GOAL+' prizes',200,R.card.y+96);
  ctx.fillText('in '+WILD_SECONDS+' seconds',200,R.card.y+124);""",
  """ctx.fillStyle='#fff';ctx.font='bold 21px system-ui';ctx.fillText('Collect all '+WILD_GOAL+' prizes',200,R.card.y+88);
  WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*42,R.card.y+106,36,false));
  ctx.fillStyle='#fff';ctx.font='bold 15px system-ui';ctx.fillText('before the '+WILD_SECONDS+' s timer or your coins run out',200,R.card.y+158,320);""")
r("const lines=[['rain10','Rain coins pour 5, 10 or 25 coins'],['!','Bonus drops fall from the sky'],['T','Towers topple. Turbo at 0:30']];",
  "const lines=[['rain10','Rain coins pour 5, 10 or 25 coins'],['!','Bonus drops fall from the sky']];")
r("const y=R.card.y+164+i*30;", "const y=R.card.y+190+i*28;")
r("""else wildText("TIME'S UP!",0,0,58,'#ff6a4a','#2a0010',10);""",
  """else wildText(WILD.reason==='coins'?'OUT OF COINS!':"TIME'S UP!",0,0,WILD.reason==='coins'?48:58,'#ff6a4a','#2a0010',10);""")
r("""ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+36);""",
  """ctx.fillText(WILD.got+' of '+WILD_GOAL+' prizes',200,R.card.y+26);WILD_COLLECTION.forEach((id,i)=>wildIcon(id,200+(i-(WILD_GOAL-1)/2)*38,R.card.y+40,30,!!WILD.have[id]));""")
r("""'So close. One more go?',200,R.card.y+64);""", """(WILD.reason==='coins'?'The coins ran out. One more go?':'The timer ran out. One more go?'),200,R.card.y+92);""")
r("bonus drops',200,R.card.y+90);", "bonus drops',200,R.card.y+114);")
r("return {card:{x:40,y:cy-120,w:320,h:250},again:{x:70,y:cy+40,w:260,h:52},back:{x:110,y:cy+100,w:180,h:30}};",
  "return {card:{x:30,y:cy-120,w:340,h:270},again:{x:70,y:cy+16,w:260,h:52},back:{x:110,y:cy+110,w:180,h:30}};")
p.write_text(s, encoding='utf-8')
print('patched')
