// ---------- CP-86 mitts final: the return (Jenny, Nov 19: "The fade is in the midst as they move down from above the head back
// down to base... I prefer it if that split second is used to keep the hands or the mitts above the head a little bit
// longer.") ----------
// What read as a fade: the mitts are drawn in front of the head during the meow and behind it otherwise (the idle mitts are
// drawn before the head). Back at rest they overlap the cheeks, so on the face's switch frame their upper half vanished
// behind the head in one frame, while still moving. They were always fully opaque, same art, same size.
// Now: the mitts hold above the head until CP86F.drop; then come down quickly in front of the face to just under the
// cheeks (rest + CP86F.dip, where no part of them overlaps the head, so drawing them in front or behind the head gives the
// same picture), arriving at CP86F.under; they change layer there, on that frame, and tuck up into rest behind the head
// by the face's switch (CP86.tail before the end), so the face still switches on a still cat. Always fully opaque.
const CP86F={drop:4.65,under:4.8,dip:95};
// where the idle mitts rest, for the way they are being drawn now (the rest pose or the idle mitts)
function cp86FRest(side){if(isRestPose()){const R=cp58Rest(side),m=__cp86Paw(side);return {x:R.x+m.x,y:R.y+m.y,a:-.12};}const b=__cp86MittRest(side);return {x:b.x,y:b.y,a:MITT_TURN};}
function cp86FDip(side){const r=cp86FRest(side),R=cp58Rest(side);return {dx:side*(r.x-R.x),dy:r.y-R.y+CP86F.dip,a:r.a};}
const __cp86FTarget=cp86MTarget;
cp86MTarget=function(side){const T=__cp86FTarget(side),X=PGPX;if(!X||X.id!=='sonic'||X.t<CP86F.drop)return T;
 const R=cp58Rest(side),d=cp86FDip(side),D={x:R.x+side*d.dx,y:R.y+d.dy,a:d.a},k=cp58Ease((X.t-CP86F.drop)/(CP86F.under-CP86F.drop));
 return {x:T.x+(D.x-T.x)*k,y:T.y+(D.y-T.y)*k,a:T.a+(D.a-T.a)*k};};
// full weight until the mitts are under the cheeks, then eased to 0 (rest) by the face's switch
cp86MWeight=function(){const X=PGPX;if(!X||X.id!=='sonic'||cp86K()<=0)return 0;const end=cp86End(X);
 return cp58Ease(X.t/CP86M.up)*(X.t<CP86F.under?1:cp58Ease((end-X.t)/(end-CP86F.under)));};
// in front of the head until the mitts are under the cheeks; behind it (where the idle mitts belong) from then on
const __cp86FOnTop=cp86MOnTop;
cp86MOnTop=function(){return __cp86FOnTop()&&!(PGPX&&PGPX.t>=CP86F.under);};
// ---------- end CP-86 mitts final ----------
