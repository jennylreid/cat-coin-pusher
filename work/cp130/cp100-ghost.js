// ---- CP-100 fix (UAT 130 proposed): the finger's lift must not tap the list that the same touch opened ----
// Jenny on UAT 129: "can't access level nor goal boards". Home taps act on pointerdown, so Level boards, Goal boards and the
// round Daily button open their list while the finger is still down; on a phone the browser then sends a click where the finger
// lifts, which lands on the list now under it: a row (Level boards starts the endless board on that board, Goal boards starts a
// goal board). Daily puzzles already ignores that click (CP-87: CP87.openedAt, 500 ms); the CP-100 lists lacked it. Fix: when a list opens during a touch, the next click inside that list is ignored
// (only within 400 ms of the lift). Lists opened any other way (a goal round ending) are not affected.
const CP100G={down:false,armed:false,until:0,ate:0};
try{document.addEventListener('pointerdown',()=>{CP100G.down=true;},true);
 const up=()=>{CP100G.down=false;if(CP100G.armed){CP100G.armed=false;CP100G.until=performance.now()+400;}};
 document.addEventListener('pointerup',up,true);document.addEventListener('pointercancel',up,true);
 document.addEventListener('click',e=>{const now=performance.now();if(!(CP100G.armed||now<CP100G.until))return;
  const t=e.target;if(!(t&&t.closest&&t.closest('#cp100boards')))return;
  e.stopPropagation();e.preventDefault();CP100G.armed=false;CP100G.until=0;CP100G.ate++;try{diagEvent('cp100','lift click ignored');}catch(_){}},true);}catch(e){}
function cp100Arm(){if(CP100G.down){CP100G.armed=true;CP100G.until=0;}}
{const __g1=cp100Open;cp100Open=function(){cp100Arm();return __g1.apply(this,arguments);};}
