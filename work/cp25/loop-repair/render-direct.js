// The old rail matte is no longer applied, so a full-screen offscreen layer
// and alpha composite are redundant. Preserve order, masks and source sampling.
function __drawBoardBodies(){
 const ratio=scale*devicePixelRatio;
 if(ratio!==__matteRatio||H!==__matteH){__matteRatio=ratio;__matteH=H;__boardClipPath=null;__skyClipPath=null;}
 const previousClip=__activeCoinClip;ctx.save();ctx.setTransform(...__camera);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='low';ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';__activeCoinClip='felt';
 try{for(const b of coinPaintOrder(bodies))if(!b.danceDown){
  const t=b.rb.translation();
  if(t.z/M-b.r>=LEDGE_BACK-.5)drawCoinOccluded(b);
  else{ctx.save();ctx.beginPath();ctx.rect(-1000,218,3000,3000);ctx.clip();drawCoinOccluded(b);ctx.restore();}
 }}finally{__activeCoinClip=previousClip;ctx.restore();}
}
