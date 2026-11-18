
// ---------- CP-75 (Jenny, Nov 18): each cat yawns with its own colours ----------
// The approved Tuxedo yawn face and squinting eyes, recoloured per cat the way pgRecolor makes the other cats' heads
// (work/cp75-yawn-faces/recolor.py; the open mouth kept as painted). Picks the copy for the cat whose head art is on
// screen (pgApplyArt / pgRestoreArt); the Tuxedo keeps the approved originals. Same canvas, size and place.
const CP75_CATS=['orange','ragdoll','siamese','tortie'],CP75_ART={};let CP75_CAT='tuxedo';
for(const c of CP75_CATS){CP75_ART[c]={};
 cp58RunwayLoad('img/art/cp75-yawn-face-'+c+'.webp',im=>{CP75_ART[c].face=im;});
 cp58RunwayLoad('img/art/cp75-yawn-eyes-'+c+'.png',im=>{CP75_ART[c].eyes=im;});}
const __cp75Apply=pgApplyArt;pgApplyArt=function(cat){__cp75Apply(cat);CP75_CAT=cat;};
const __cp75Restore=pgRestoreArt;pgRestoreArt=function(){__cp75Restore();CP75_CAT='tuxedo';};
const __cp75Face=cp58Face;
cp58Face=function(){const A=CP75_ART[CP75_CAT];if(!A||!A.face||!A.eyes)return __cp75Face();
 const f=CP58_RUNWAY,e=CP58_RUNWAY_EYES;CP58_RUNWAY=A.face;CP58_RUNWAY_EYES=A.eyes;
 try{return __cp75Face();}finally{CP58_RUNWAY=f;CP58_RUNWAY_EYES=e;}};
