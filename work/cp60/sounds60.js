// ---------- UAT 60 (CP-46, Jenny's picks, Nov 14): more coin sounds in rotation and the warm whoosh pusher ----------
// The new coin sounds and the pusher whoosh are made by the CP-46 audition's own code (work/cp46-audition/make-audition.cjs
// and make-round2.cjs; the coin part is copied unchanged below by work/cp60/patch.py). At start-up it runs once into a
// recorder (no sound), giving each variant's list of notes with the audition's level baked in (/*GAINS*/, from the
// audition's levels files). The notes play on the audio clock through sfx.fx46 (like sfx.mus, but on the effects master),
// a little ahead, so a big cascade never creates hundreds of nodes in one frame.
// Coins: ADDED, nothing removed (Jenny, Nov 14). Each time, one sound is picked at random from the current one plus the
// new ones (never the same one twice in a row):
// - A coin dropped onto the board: the current landing (coin-land.mp3, or its synth fallback) or one of the 4 drops on pile.
// - A coin knocking another: the current clink or one of the 4 new clinks, scaled by how hard it hit as before.
// - A rain coin's first landing: the current clink or a drop on pile; a gold coin's first landing: the current clink, a
//   gold drop or a gold clink.
// - Coins over the front edge: a single coin as now (coin-off). 3 or more within 0.35 s: the current edge sound or one of
//   the 4 spills; 10 or more within 1 s: the current edge sound or one of the 3 big cascades (a new spill or cascade
//   covers the coins that follow for a moment; a cascade can follow a spill at once). Prizes and other pieces: as now.
// - A gold coin paid at the front: its ka-ching as now, and every other time the gold over-the-edge shimmer with it.
// - The pusher (replaced): the warm whoosh (option w5), one per stroke, the return a faint breath, faster and a little
//   higher in Turbo. No beat layer and no recorded pusher.mp3. Pusher sound 50% (the default) = the auditioned level.
// Not touched: the ledge bell and the landing thump (the frozen pickup), the music, the coin roll, the coin drop at the mouth.
const C46=(()=>{
 let seedS=4646>>>0;const rand=()=>{seedS=(seedS*1664525+1013904223)>>>0;return seedS/4294967296;};
 let ev=null;
 const K={rand,set stem(s){},tone(f,t,dur,type,vol,o={}){if(vol>0)ev.push({t,k:0,f,dur,type,vol,o});},noise(t,dur,vol,o={}){if(vol>0)ev.push({t,k:1,dur,vol,o,off:rand()*.4});}};
 const hz=m=>440*Math.pow(2,(m-69)/12);
 function seeded(seed){let s=seed>>>0;return()=>{s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
/*COINS*/
 const GAIN=/*GAINS*/,W5_GAIN=/*W5GAIN*/;
 const CK=coinKit(K),SETS={};
 for(const c of COINS){ev=[];c.play(K,CK);const g=GAIN[c.group],t0=Math.min(...ev.map(e=>e.t));for(const e of ev){e.t-=t0;e.vol*=g;}ev.sort((a,b)=>a.t-b.t);
  const key=/gold-over-edge/.test(c.file)?'goldEdge':c.group;(SETS[key]=SETS[key]||[]).push({file:c.file,ev});}
 ev=null;
 // round 2, option w5 (make-round2.cjs, unchanged): the warm whoosh
 const W=(K,t,dur,vol,bp,q,attack,peakAt=.5)=>K.noise(t,dur,vol,{bp,q,a:Math.max(.06,dur*attack),lin:true,hold:Math.max(.07,dur*attack)+dur*Math.max(.05,peakAt-attack),sus:.7});
 function stroke(K,t,dur,back,turbo){const p=turbo?1.2:1,k=back?.35:1;W(K,t,dur,.075*k,420*p,.8,.45);W(K,t,dur,.035*k,900*p,.7,.45);}
 const Q=[],last={},stats={plays:{},whooshes:0,dropped:0};let lastLand=-9,lastHit=-9,lastGold=-9,edges=[],block=-9,cascadeBlock=-9;
 const ok=()=>!S.muted&&!(typeof inBackground!=='undefined'&&inBackground)&&!document.hidden&&sfx._w2ok();
 function drain(){if(!Q.length)return;if(!ok()){Q.length=0;return;}const now=sfx._pgT();
  while(Q.length&&Q[0].at-now<.2){const q=Q.shift();if(q.at>=now-.05)sfx.fx46(q.e,q.at-now,q.sc);}}
 function queue(list,sc){const now=sfx._pgT()+.005;if(Q.length+list.length>1500){stats.dropped++;return;}for(const e of list)Q.push({at:now+e.t,e,sc});Q.sort((a,b)=>a.at-b.at);drain();}
 // pick: -1 = the current (old) sound, 0.. = a new variant; never the same choice twice in a row
 function pick(set,withCurrent=true){const L=SETS[set],n=L.length+(withCurrent?1:0);let i=Math.floor(Math.random()*n);if(n>1&&i===last[set])i=(i+1)%n;last[set]=i;return i>=L.length?-1:i;}
 function playVariant(set,i,sc=1){if(!(sc>0)||!ok())return false;stats.plays[set]=(stats.plays[set]||0)+1;queue(SETS[set][i].ev,sc);return true;}
 function current(set,fn){stats.plays[set+'Current']=(stats.plays[set+'Current']||0)+1;fn();return true;}
 function play(set,sc=1,cur){if(!ok())return false;const i=pick(set,!!cur);return i<0?current(set,cur):playVariant(set,i,sc);}
 function land(){if(!ok())return sfx.land();const t=sfx._pgT();if(t-lastLand<.09)return;lastLand=t;play('pile',1,()=>sfx.land());}
 function hit(b,v){if(!(v>0)||!ok())return sfx.clink(v);const t=sfx._pgT(),old=()=>sfx.clink(v);
  if(b&&(b.kind==='gold5')&&!b.c46){b.c46=1;if(t-lastGold<.12)return;lastGold=t;play('gold',Math.max(.5,v),old);return;}
  if(b&&b.rain&&!b.c46){b.c46=1;if(t-lastLand<.09)return;lastLand=t;play('pile',Math.max(.5,v),old);return;}
  if(t-lastHit<.035)return;lastHit=t;play('clink',v,old);}
 function edge(b){if(!b||!(b.kind==='coin'||b.kind==='silver')||!ok()){recordedSfx.edge();return;}
  const now=time,old=()=>recordedSfx.edge();edges=edges.filter(t=>now-t<1&&t<=now);edges.push(now);
  if(edges.length>=10&&now>=cascadeBlock){play('cascade',1,old);block=cascadeBlock=now+1.6;return;} // a cascade can follow a spill straight away
  if(now<block)return;
  if(edges.filter(t=>now-t<.35).length>=3){play('spill',1,old);block=now+.6;return;}
  recordedSfx.edge();} // a single coin: exactly as before
 let goldN=0;function goldPaid(){if(ok()&&(goldN++)%2===1)play('goldEdge',1);} // the shimmer every other gold coin, on top of its ka-ching
 function whoosh(vol,dur,back,turbo){if(!(vol>0)||!(dur>0)||!ok())return;ev=[];stroke(K,0,dur,back,turbo);const list=ev;ev=null;stats.whooshes++;queue(list,vol/.5*W5_GAIN);}
 return {SETS,stats,play,pick,land,hit,edge,goldPaid,whoosh,drain,queued:()=>Q.length,stroke,W5_GAIN};
})();
sfx.slide=function(vol,dur,back,turbo){C46.whoosh(vol,dur,back,turbo);}; // the pusher: the warm whoosh only
const __c46Rain=wildRainCollected;
wildRainCollected=function(b,x){if(b&&b.kind==='gold5')C46.goldPaid();return __c46Rain(b,x);};
const __c46Update=update;
update=function(dt){__c46Update(dt);try{C46.drain();}catch(e){}};
