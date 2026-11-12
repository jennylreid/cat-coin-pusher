from pathlib import Path
import json,base64
p=Path(__file__).parent;r=p.parents[2];h=(p.parent/'seahorse/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes());assert base64.b64decode(u['files']['index.html'])==(p.parent/'seahorse/release.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a[:80]
 h=h.replace(a,b)
rep("const BUILD = '2026.10.29 UAT 2';","const BUILD = '2026.10.29 UAT 3';")
rep("cheese:{name:'Cheese'","cheese:{name:'Kitchen'")
rep("['Water','Cheese']","['Water','Kitchen']")
rep("loopScreen===name.toLowerCase()","loopScreen===(i===0?'water':'cheese')")
rep("ART.waterScene=await image('img/art/water-scene-v1.png');", "ART.waterScene=await image('img/art/water-scene-v1.png');\n ART.kitchenScene=await image('img/art/cheese-scene-v1.png');")
rep("ART.collectionOutlines={tuna:","ART.collectionOutlines={cheese:await image('img/art/cheese-outline.png'),tuna:")
rep("const g=placeholderCollectionGeometry();if(loopScreen!=='water')return g;", """const g=placeholderCollectionGeometry();
 if(loopScreen==='cheese'){
 const scene={x:g.left,y:g.top+126,w:g.right-g.left,h:g.satchel.y-42-(g.top+126)};
 return {...g,scene,slots:[['cheese',.30,.40,.40,.26],['mouse',.72,.84,.32,.17]].map(([id,u,v,w,h])=>({id,x:scene.x+(u-w/2)*scene.w,y:scene.y+(v-h/2)*scene.h,w:w*scene.w,h:h*scene.h,future:id==='mouse'}))};
 }
 if(loopScreen!=='water')return g;""")
start=h.index('function drawWaterInventory(){');end=h.index('function drawInventory(){',start)
draw=h[start:end].strip().replace('function drawWaterInventory(){','function drawKitchenInventory(){').replace('ctx.drawImage(ART.waterScene,','ctx.drawImage(ART.kitchenScene,')
h=h[:end]+draw+'\n'+h[end:]
rep("if(loopScreen==='water')drawWaterInventory();else drawPlaceholderInventory();", "if(loopScreen==='water')drawWaterInventory();else drawKitchenInventory();")
(p/'draft.html').write_text(h,encoding='utf-8');print('Kitchen name and approved painting integrated; save ID retained')
