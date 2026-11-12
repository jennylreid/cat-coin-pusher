// CP-37: steady coin draw order. Each overlapping pair is ordered by the contact normal between the two bodies; when
// they nearly touch (a packed pile) that normal swings with sub-pixel jiggle and the pair swapped order frame to frame,
// which read as flicker and coins blinking behind each other. A pair now keeps its last order and only changes it when
// the new geometry is clear (normal within about 78 degrees of the view, either way) or has said so for 3 recomputes
// in a row. While the pair is undecided (|d| < .015) it gets no edge, as before.
const __cp37Order=new Map();let __cp37OrderTick=0;
function __cp37PairSign(ua,ub,pair){
 const flip=ua<ub?1:-1,key=ua<ub?ua+':'+ub:ub+':'+ua,raw=pair.d,s=Math.abs(raw)<.015?0:Math.sign(raw)*flip;
 const m=__cp37Order.get(key);
 if(!m){if(!s)return 0;__cp37Order.set(key,{s,n:0,t:__cp37OrderTick});return s*flip;}
 m.t=__cp37OrderTick;
 if(!s){m.n=0;return 0;} // no edge while the geometry is undecided (holding one here created order cycles)
 if(s===m.s){m.n=0;return m.s*flip;}
 if(Math.abs(pair.dn??raw)>=.2||++m.n>=3){m.s=s;m.n=0;}
 return m.s*flip;
}
function __cp37OrderPrune(){if(++__cp37OrderTick%300)return;for(const [k,m] of __cp37Order)if(__cp37OrderTick-m.t>600)__cp37Order.delete(k);}
