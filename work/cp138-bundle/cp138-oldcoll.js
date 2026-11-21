// ---- UAT 138: the old Collections pages show every prize that fills them (Jenny, Nov 21: "Some of them aren't displaying all
// the prizes that are needed to fill them in... we've created some prizes that fit into those") ----
// Water: tuna and shrimp, plus sardine, crab, seahorse and the oyster (CP-105; it takes the planned Clam spot) are fillable
// spots, each drawn as an outline in the page's existing style until placed (kelp stays scenery until a kelp prize exists).
// Kitchen (Jenny): cheese, hot dog, milk, egg and fish biscuit; the toy-mouse outline is gone (it could never be filled). Everything else on these screens is
// unchanged. The newly fillable prizes come from the bag (the same prizes the Shop sells): the old screen shows the bag's
// count, and placing one takes it from the bag. (Edits in build: the page lists, the clam spot, the Kitchen spot, the page a
// prize belongs to.) While the Collections test is on, its screen has an "Old pages" button to reach these.
const CP138_OLD=['sardine','crab','seahorse','oyster','hot_dog','milk','egg','biscuit'];
const CP138_KITCHEN=['hot_dog','milk','egg','biscuit'];
Object.assign(PRIZE_NAMES,{oyster:'Oyster',hot_dog:'Hot dog',milk:'Milk',egg:'Egg',biscuit:'Fish biscuit'});
function cp138OldSync(){try{for(const id of CP138_OLD)S.got[id]=pgHave(id);}catch(e){}}
function cp138Outline(id){const c=document.createElement('canvas');c.width=360;c.height=260;const g=c.getContext('2d'),o=ctx,col=CP138_KITCHEN.includes(id)?'#fff0c8':'#d6f2f4';
 const sp=document.createElement('canvas');sp.width=360;sp.height=260;const sg=sp.getContext('2d');try{ctx=sg;pgPrizeIcon(id,180,105,200);}catch(e){}finally{ctx=o;}
 for(let a=0;a<16;a++){const dx=Math.cos(a*Math.PI/8)*4.5,dy=Math.sin(a*Math.PI/8)*4.5;g.drawImage(sp,dx,dy);}
 g.globalCompositeOperation='source-in';g.fillStyle=col;g.fillRect(0,0,360,260);g.globalCompositeOperation='destination-out';g.drawImage(sp,0,0);g.globalCompositeOperation='source-over';return c;}
{const __ol138b=openLoopScreen;openLoopScreen=function(view){cp138OldSync();try{for(const id of CP138_OLD)if(!ART.collectionOutlines[id]||!ART.collectionOutlines[id].cp138){const c=cp138Outline(id);c.cp138=1;ART.collectionOutlines[id]=c;}}catch(e){}return __ol138b.apply(this,arguments);};}
{const __pi138=placeItem;placeItem=function(id){cp138OldSync();const r=__pi138.apply(this,arguments);try{if(r!==false&&CP138_OLD.includes(id)){PG.items[id]=Math.max(0,pgHave(id)-1);pgSave();cp138OldSync();}}catch(e){}return r;};}
// The satchel shows this page's prizes not placed yet (up to three, in its three cells, the ones in the bag first; placing one
// brings the next): before, it always showed cheese, shrimp and tuna, so the other prizes could never be dragged in.
function cp138SatchelIds(){try{cp138OldSync();const set=COLLECTIONS[loopScreen]||COLLECTIONS.water;const rest=set.items.filter(id=>!placements[id]);
 return rest.map((id,i)=>[id,i]).sort((a,b)=>((S.got[b[0]]||0)>0)-((S.got[a[0]]||0)>0)||a[1]-b[1]).slice(0,3).map(x=>x[0]);}catch(e){return ['cheese','shrimp','tuna'];}}
// ---- end UAT 138 old Collections pages ----
