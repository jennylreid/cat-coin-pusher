// CP-93 tower rework, prototype C (giant board only; use with proto-a.js): the towers stand on the fixed shelf in front of the
// deck, on the coin pile. The deck only shoves coins forward (it never carries a tower back and forth), the coin pile pushes
// each whole tower toward the ledge, and a tower goes over when its base reaches the ledge (or Quake / a hard knock lets it go).
const CP93C={z:[620,600,612],grip:0.25,heavy:1.5,ledge:22};
LAB.B.giant.giant.towers=LAB.B.giant.giant.towers.map((t,i)=>[t[0],CP93C.z[i],t[2],t[3]]);
{const __cp93Build=cp93Build;cp93Build=function(){const L=cp93L();
  if(L)for(const b of [...bodies]){if(b.dead||b.kind==='stack')continue;const p=b.rb.translation();if(L.giant.towers.some(t=>Math.hypot(t[0]-p.x/M,t[1]-p.z/M)<COIN_R*2+6))removeCoin(b);}
  const r=__cp93Build();
  try{for(const b of bodies){if(b.dead)continue;if(b.cp93Top!=null||(b.kind==='stack'&&b.cp93!=null)){const p=b.rb.translation();b.rb.setTranslation({x:p.x,y:p.y-TONGUE_H*M,z:p.z},true);}
   if(b.kind!=='stack'||b.cp93==null)continue;const c=b.rb.collider(0);c.setDensity(CP93C.heavy);
   if(b.cp93Seg===0){c.setFriction(CP93C.grip);c.setFrictionCombineRule(RAPIER.CoefficientCombineRule.Max);}}}catch(e){}return r;};}
cp93Slide=function(){if(!CP93.tw)return;for(let gi=0;gi<CP93.tw.length;gi++){const T9=CP93.tw[gi];if(T9.tipped)continue;
  const segs=bodies.filter(b=>!b.dead&&b.kind==='stack'&&b.cp93===gi);const base=segs.find(b=>b.cp93Seg===0);if(!base||segs.length<2){cp93Let(gi,false,'gone');continue;}
  const t=base.rb.translation(),z=t.z/M,bv=base.rb.linvel();T9.slide=z-(T9.z0??(T9.z0=z));
  if(z>T.FRONT-CP93C.ledge||qrot(base.rb.rotation(),{x:0,y:1,z:0}).y<Math.cos(6*Math.PI/180)){cp93Let(gi,true,'edge');continue;}
  let hit=false;for(const b of segs){if(b===base)continue;const v=b.rb.linvel();if(Math.hypot(v.x-bv.x,v.z-bv.z)>CP93.cfg.knock*1.6){hit=true;break;}}
  if(hit&&time>(CP93.t0b||0)+2){cp93Let(gi,false,'knock');continue;}
  const settled=time>(CP93.t0b||0)+.5;const prize=bodies.find(b=>!b.dead&&b.cp93Top===gi);
  for(const b of prize?[...segs,prize]:segs){if(b===base)continue;
   if(settled&&!b.cp93Off){const p=b.rb.translation();b.cp93Off={x:p.x-t.x,y:p.y-t.y,z:p.z-t.z};b.cp93Rot={...b.rb.rotation()};}
   if(b.cp93Off){b.rb.setTranslation({x:t.x+b.cp93Off.x,y:t.y+b.cp93Off.y,z:t.z+b.cp93Off.z},true);b.rb.setRotation(b.cp93Rot,true);}
   b.rb.setLinvel({x:bv.x,y:b.cp93Off?bv.y:Math.min(b.rb.linvel().y,bv.y),z:bv.z},true);b.rb.setAngvel({x:0,y:0,z:0},true);}}};
