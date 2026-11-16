from pathlib import Path
import re,json,base64
p=Path(__file__).parent;r=p.parents[2]
h=(p.parent/'scene-one/release.html').read_text(encoding='utf-8')
u=json.loads((r/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert base64.b64decode(u['files']['index.html'])==(p.parent/'scene-one/release.html').read_bytes()
def rep(a,b):
 global h
 assert a in h,a[:80]
 h=h.replace(a,b)
rep("const BUILD = '2026.10.28 UAT 6';","const BUILD = '2026.10.29 UAT 1';")
rep("future:['sardine','crab']","future:['sardine','crab','clam','kelp']")
rep("mouse:'Toy mouse'","mouse:'Toy mouse',clam:'Clam',kelp:'Kelp',seahorse:'Seahorse'")
rep("ART.collectionsTile=await image('img/art/collections-satchel-v1.png');", "ART.collectionsTile=await image('img/art/collections-satchel-v1.png');\n ART.waterScene=await image('img/art/water-scene-v1.png');\n ART.collectionOutlines={tuna:await image('img/art/tuna-outline.png'),shrimp:await image('img/art/shrimp-outline.png')};")
rep('function collectionGeometry(){','function placeholderCollectionGeometry(){')
pos=h.index('function contains(r,p)')
h=h[:pos]+'''function collectionGeometry(){
 const g=placeholderCollectionGeometry();if(loopScreen!=='water')return g;
 const scene={x:g.left,y:g.top+126,w:g.right-g.left,h:g.satchel.y-42-(g.top+126)};
 const anchors=[['tuna',.28,.38,.42,.24],['shrimp',.73,.64,.30,.23],['sardine',.70,.19,.31,.16],['crab',.28,.83,.32,.19],['clam',.72,.86,.24,.14],['kelp',.12,.64,.18,.19]];
 return {...g,scene,slots:anchors.map(([id,u,v,w,h])=>({id,x:scene.x+(u-w/2)*scene.w,y:scene.y+(v-h/2)*scene.h,w:w*scene.w,h:h*scene.h,future:COLLECTIONS.water.future.includes(id)}))};
}
'''+h[pos:]
start=h.index('function drawInventory(){');end=h.index('function outlinePrize(',start)
draw=h[start:end].strip()
water=draw.replace('function drawInventory(){','function drawWaterInventory(){')
water=water.replace(' g.slots.forEach(r=>{', ''' const sc=g.scene;ctx.save();ctx.beginPath();ctx.rect(sc.x,sc.y,sc.w,sc.h);ctx.clip();ctx.drawImage(ART.waterScene,sc.x,sc.y,sc.w,sc.h);ctx.restore();
 g.slots.forEach(r=>{''')
water=re.sub(r"ctx.fillStyle=hover\?'#685174':[\s\S]*?ctx.strokeRect\(r.x\+2,r.y\+2,r.w-4,r.h-4\);", "if(hover){ctx.strokeStyle='#ffe29a';ctx.lineWidth=2;ctx.strokeRect(r.x,r.y,r.w,r.h);}",water)
water=water.replace('Math.min(1.4,(r.h-48)/85)','Math.min(1.2,r.w/135,r.h/100)')
water=water.replace('else shadowPrize(r.id,0,0);','else ctx.drawImage(ART.collectionOutlines[r.id],-90,-65,180,130);')
water=water.replace("ctx.restore();ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 16px system-ui';", "ctx.restore();ctx.shadowColor='#102f42';ctx.shadowBlur=4;ctx.textAlign='center';ctx.fillStyle='#fff';ctx.font='bold 13px system-ui';")
water=water.replace("ctx.fillText(PRIZE_NAMES[r.id],x,r.y+r.h-33);", "ctx.fillText(PRIZE_NAMES[r.id],x,r.y+r.h+5);")
water=water.replace("ctx.font='12px system-ui';ctx.fillStyle='#d0bedf';ctx.fillText(r.future?'Future prize':placements[r.id]?'Placed':'Drop here',x,r.y+r.h-14);", "ctx.font='10px system-ui';ctx.fillStyle='#f1f5ed';if(!r.future)ctx.fillText(placements[r.id]?'Placed':'Drop here',x,r.y+r.h+20);ctx.shadowBlur=0;")
h=h[:start]+draw.replace('function drawInventory(){','function drawPlaceholderInventory(){')+'\n'+water+"\nfunction drawInventory(){if(loopScreen==='water')drawWaterInventory();else drawPlaceholderInventory();}\n"+h[end:]
rep(" if(id==='sardine')", " if(id==='clam'){ctx.moveTo(-31,17);ctx.quadraticCurveTo(-45,-19,-17,-30);ctx.quadraticCurveTo(0,-44,17,-30);ctx.quadraticCurveTo(45,-19,31,17);ctx.closePath();for(const x of [-22,-11,0,11,22]){ctx.moveTo(0,17);ctx.lineTo(x,-23+Math.abs(x)*.3);}}\n else if(id==='kelp'){for(const side of [-1,1]){ctx.moveTo(0,34);ctx.bezierCurveTo(side*7,13,side*26,7,side*8,-9);ctx.bezierCurveTo(side*25,-12,side*20,-32,side*8,-39);ctx.bezierCurveTo(side*2,-29,side*12,-18,side*2,-10);ctx.bezierCurveTo(-side*10,10,side*4,22,0,34);}}\n else if(id==='sardine')")
(p/'draft.html').write_text(h,encoding='utf-8');print('Built approved Water and clam/kelp future outlines')
