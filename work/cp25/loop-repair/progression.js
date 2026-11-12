// Required-prize loss makes the round unwinnable: fail and retry this board.
let retryWait=0;
function reconcileBoardTargets(){
 if(!board||['won','lost'].includes(board.status))return;
 const required=BOARD.targets.map(t=>t.id);
 if(required.every(id=>board.collected.includes(id))){finishBoard('won');save();return;}
 for(const id of required){
  if(board.collected.includes(id))continue;
  const target=bodies.find(b=>!b.dead&&b.kind==='item'&&b.id===id);
  if(target){target.boardTarget=true;continue;}
  board.failedTarget=id;stopDrops();finishBoard('lost','prize-lost');retryWait=0;save();return;
 }
}
function retryBoard(){if(board.status!=='lost')return false;stopDrops();cancelCollectionDrag();resetBoard();save();return true;}
function boardTick(dt){
 reconcileBoardTargets();board.remaining=S.coins;
 if(board.status==='won'){
  if(!collectionDance&&!treatAwards.length&&!itemToasts.length&&!callouts.length&&sweepTime===0&&catquakeTime===0&&!inventoryOpen){clearWait+=dt;if(clearWait>=2)nextBoard();}
 }else clearWait=0;
 if(board.status==='lost'){
  if(!treatAwards.length&&!itemToasts.length&&sweepTime===0&&catquakeTime===0&&!inventoryOpen){retryWait+=dt;if(retryWait>=2)retryBoard();}
 }else retryWait=0;
}
