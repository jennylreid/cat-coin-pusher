// ---- CP-93 round 3 (Jenny, Nov 21, via PM: "Towers: build 1, 2, 3 (no hidden timer)") ----
// Giant towers board only; level boards and the frozen pickup are unchanged. Falls still come from physics: no timer, no
// scripted tip added.
// 1. Tapping a Towers option (the on-board pill, Engineer tools or Goal boards) while on the Giant towers board rebuilds the
//    three towers at once in that option (fresh towers, the spill count back to 0 of 3; coins, timer and wallet untouched).
//    The board always shows the active option ("Towers A: Today" ... "Towers D: heavy + shelf"), in the pill's letters.
// 2. Quake knocks a tower over in every option: on the hit, the standing tower nearest the front is let go and pushed near
//    its top (the same push B and D already gave every tower); the shake moves the rest as usual. (Before: B and D only, and
//    they pushed every tower.)
// 3. C and D: the shelf towers start 12 units nearer the front edge (shelf depths 665/650/660 -> 677/662/672).
// 4. A log line per spill in the phone's diagnostic log: "cp93 spill <tower> <why> t=<s since built> drops=<coins dropped
//    since built> towers=<A-D>", plus "cp93 build <A-D>" when the towers are built.
CP93P.cfg.shelf=CP93P.cfg.shelf.map(z=>z+12);
const CP93R_LETTER={today:'A',a:'B',c:'C',ac:'D'};
Object.assign(CP93P.NAMES,{today:'A: Today',a:'B: heavy towers',c:'C: towers on the shelf',ac:'D: heavy + shelf'});
function cp93rLetter(){return CP93R_LETTER[CP93P.get()]||'A';}
// 1. rebuild on a switch (done at the next frame, outside the physics step)
{const __cp93rSet=CP93P.set;CP93P.set=function(k){const old=CP93P.get();__cp93rSet.call(CP93P,k);
  try{if(CP93P.get()!==old&&typeof cp93L==='function'&&cp93L())CP93.rebuild=true;}catch(e){}};}
function cp93rRebuild(){CP93.rebuild=false;if(!(typeof cp93L==='function'&&cp93L()))return false;
 if(['won','lost'].includes(board.status)||(LAB.st&&LAB.st.pending))return false;
 for(const b of [...bodies]){if(b.dead)continue;if((b.kind==='stack'&&b.cp93!=null)||b.cp93Top!=null)removeCoin(b);}
 cp93Build();if(LAB.st)LAB.st.got=0;CP93.flash=time+1.5;try{diagEvent('cp93','rebuilt '+cp93rLetter());}catch(e){}return true;}
{const __cp93rUpd=update;update=function(dt){try{if(CP93.rebuild)cp93rRebuild();}catch(e){try{diagEvent('cp93','rebuild '+e);}catch(_){}}return __cp93rUpd(dt);};}
// the active option on the Giant board (other boards keep the label shown only when not A)
{const __cp93rHud=drawBoardHUD;drawBoardHUD=function(){const r=__cp93rHud.apply(this,arguments);try{if(CP93P.get()==='today'&&typeof cp93L==='function'&&cp93L()){
  const hud=hudLayout(),tx='Tower physics: '+CP93P.NAMES.today;ctx.save();ctx.font='bold 11px system-ui';ctx.textAlign='left';const w=ctx.measureText(tx).width+12;
  ctx.fillStyle='rgba(120,40,0,.92)';ctx.fillRect(hud.left+2,hud.bottomY-47,w,16);ctx.fillStyle='#ffe08a';ctx.fillText(tx,hud.left+8,hud.bottomY-35);ctx.restore();}
  if(CP93.flash&&time<CP93.flash&&typeof cp93L==='function'&&cp93L()){const hud=hudLayout();ctx.save();ctx.font='bold 13px system-ui';ctx.textAlign='center';
   const tx='Towers '+CP93P.NAMES[CP93P.get()]+' - new towers',w=ctx.measureText(tx).width+18;ctx.fillStyle='rgba(120,40,0,.92)';ctx.fillRect(200-w/2,hud.bottomY-74,w,22);
   ctx.fillStyle='#ffe08a';ctx.fillText(tx,200,hud.bottomY-58);ctx.restore();}}catch(e){}return r;};}
// 2. Quake on the Giant board: one tower (the standing one nearest the front), every option
{const __cp93rQuake=stepCatquake;stepCatquake=function(){const giant=typeof cp93L==='function'&&!!cp93L(),was=catquakeHit;
  if(!giant)return __cp93rQuake();const A0=CP93P.A;CP93P.A=()=>false;try{__cp93rQuake();}finally{CP93P.A=A0;} // B/D's every-tower push is replaced here
  try{if(!was&&catquakeHit&&CP93.tw){let best=-1,bz=-1e9;
    for(let gi=0;gi<CP93.tw.length;gi++){if(CP93.tw[gi].tipped)continue;const base=bodies.find(b=>!b.dead&&b.kind==='stack'&&b.cp93===gi&&b.cp93Seg===0);if(!base)continue;
     const z=base.rb.translation().z;if(z>bz){bz=z;best=gi;}}
    if(best>=0){cp93Let(best,false,'quake');for(const b of bodies){if(b.dead||b.kind!=='stack'||b.cp93!==best)continue;
      const t=b.rb.translation(),top=qrot(b.rb.rotation(),{x:0,y:b.half*M,z:0}),k=b.rb.mass()*TOWER_TIP_PUSH*CP93P.cfg.quake,sx=(Math.random()-.5)*1.2;
      b.tipping=true;b.rb.wakeUp();b.rb.applyImpulseAtPoint({x:sx*k,y:0,z:k},{x:t.x+top.x,y:t.y+top.y,z:t.z+top.z},true);}}}}catch(e){}};}
// 4. the log lines
{const __cp93rBuild=cp93Build;cp93Build=function(){const r=__cp93rBuild();try{if(typeof cp93L==='function'&&cp93L()){CP93.rel0=board.released|0;diagEvent('cp93','build '+cp93rLetter());}}catch(e){}return r;};}
{const __cp93rBreak=breakStack;breakStack=function(b){const gi=b&&!b.dead&&b.cp93!=null?b.cp93:null,fresh=gi!=null&&CP93.done&&!CP93.done[gi];const r=__cp93rBreak(b);
  try{if(fresh&&CP93.done[gi]){const tw=CP93.tw&&CP93.tw[gi];diagEvent('cp93','spill '+gi+' '+((tw&&tw.why)||'break')+' t='+(time-(CP93.t0b||0)).toFixed(1)+' drops='+((board.released|0)-(CP93.rel0|0))+' towers='+cp93rLetter());}}catch(e){}return r;};}
// ---- end CP-93 round 3 ----
