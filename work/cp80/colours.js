// CP-62: Jenny requested random A/B/C colours for notes, cushions and yarn.
// Art-only state: independent of gameplay RNG; each object keeps its colour into pickup/loss.
const CP62_ART={};
const CP62_COLOURS=new WeakMap();
let cp62ColourSeed=(Date.now()>>>0)||62;
function cp62Colour(id,owner){
 if(!CP62_ART[id]||!owner)return null;
 let old=CP62_COLOURS.get(owner);if(old&&old.id===id)return old.i;
 cp62ColourSeed^=cp62ColourSeed<<13;cp62ColourSeed^=cp62ColourSeed>>>17;cp62ColourSeed^=cp62ColourSeed<<5;
 const i=(cp62ColourSeed>>>0)%3;CP62_COLOURS.set(owner,{id,i});return i;
}
function cp62DrawPrize(kind,id,x,y,s,owner){
 const i=cp62Colour(id,owner);if(i===null)return drawPrize(kind,id,x,y,s);
 const old=WILD_ART[id];WILD_ART[id]=CP62_ART[id][i];
 try{return drawPrize(kind,id,x,y,s);}finally{WILD_ART[id]=old;}
}
const __cp62Queue=queueTreatAward;
queueTreatAward=function(id,x,body,preview=false,kind='item'){
 const f=__cp62Queue(id,x,body,preview,kind);CP62_COLOURS.delete(f);
 const i=cp62Colour(id,body||f);if(i!==null)CP62_COLOURS.set(f,{id,i});return f;
};
const __cp62Lost=queueLostPrize;
queueLostPrize=function(b,x,z){const f=__cp62Lost(b,x,z);CP62_COLOURS.delete(f);const i=cp62Colour(b.id,b);if(i!==null)CP62_COLOURS.set(f,{id:b.id,i});return f;};
