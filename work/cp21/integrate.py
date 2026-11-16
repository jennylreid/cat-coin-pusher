# CP-21 (Claude engineer): builds draft.html from baseline.html (= published UAT 2026.10.17 UAT 3 index.html).
# Usage: python integrate.py [CAM_K]   (0.73 reproduces the baseline view exactly)
import sys
from pathlib import Path
here = Path(__file__).parent
s = (here / 'baseline.html').read_text(encoding='utf-8')
cam_k = sys.argv[1] if len(sys.argv) > 1 else '0.25'
cam_tilt = sys.argv[8] if len(sys.argv) > 8 else '0.65'
rails = sys.argv[9] if len(sys.argv) > 9 else 'off'
zoom = sys.argv[10] if len(sys.argv) > 10 else 'fill'
coin_look = sys.argv[11] if len(sys.argv) > 11 else '2'
layout = sys.argv[12] if len(sys.argv) > 12 else 'rows'
frame = sys.argv[13] if len(sys.argv) > 13 else 'u'
head_z = sys.argv[14] if len(sys.argv) > 14 else '0.94'
start_clear = sys.argv[15] if len(sys.argv) > 15 else '70'
arm_len = sys.argv[16] if len(sys.argv) > 16 else '90'
shadow = sys.argv[17] if len(sys.argv) > 17 else '0'
outline = sys.argv[18] if len(sys.argv) > 18 else '0'
outline_w = sys.argv[19] if len(sys.argv) > 19 else '1.6'
rim = sys.argv[20] if len(sys.argv) > 20 else '74,40,4],[160,98,14'
coin_face = sys.argv[21] if len(sys.argv) > 21 else 'bigpaw-clear'
contrast = sys.argv[22] if len(sys.argv) > 22 else '1.6'
saturate = sys.argv[23] if len(sys.argv) > 23 else '1.25'
smooth = sys.argv[24] if len(sys.argv) > 24 else 'on'
quake_bright = sys.argv[25] if len(sys.argv) > 25 else 'on'
quake_side = sys.argv[26] if len(sys.argv) > 26 else 'on'
quake_size = sys.argv[27] if len(sys.argv) > 27 else 'same'
lift = sys.argv[28] if len(sys.argv) > 28 else 'on'
table_w = sys.argv[29] if len(sys.argv) > 29 else '392'
table_front = sys.argv[30] if len(sys.argv) > 30 else '640'
armrests = sys.argv[31] if len(sys.argv) > 31 else 'on'
arm_h = sys.argv[32] if len(sys.argv) > 32 else '40'
mitt_lift = sys.argv[33] if len(sys.argv) > 33 else '40'
arm_front = sys.argv[34] if len(sys.argv) > 34 else '240'
mitt_hook = sys.argv[35] if len(sys.argv) > 35 else '30'
mitt_d = sys.argv[36] if len(sys.argv) > 36 else '228'
mitt_art = sys.argv[37] if len(sys.argv) > 37 else 'claws'
mitt_layer = sys.argv[38] if len(sys.argv) > 38 else 'behind'
cuff = sys.argv[39] if len(sys.argv) > 39 else 'off'
head_drop = sys.argv[40] if len(sys.argv) > 40 else '0'
lock = sys.argv[41] if len(sys.argv) > 41 else 'off'
gutters = sys.argv[42] if len(sys.argv) > 42 else 'off'
mitt_x, mitt_y, mitt_turn, funnel_back, funnel_d2, funnel_d1 = (sys.argv[2:8] + ['160', '250', '0', '110', '315', '225'][len(sys.argv[2:8]):])

def sub(old, new, count=1):
    global s
    assert s.count(old) == count, (old, s.count(old))
    s = s.replace(old, new)

# Step 1: flatter camera. Drawing only: physics, drop lanes and art files are unchanged.
plane = s[s.index('function __plane(y){'):]
plane = plane[:plane.index('\n') + 1]
sub(plane, plane + '''// CP-21 flatter camera. CAM_K is how strongly the table narrows toward the back as drawn (0 = parallel rails, as if
// seen from straight above; 0.73 = the UAT-18 view). Only the drawing changes: physics and drop lanes are the same.
// The painted table is re-projected row by row to this camera (__warpTable), so coins, rails and pusher stay in register.
const CAM_K=Math.max(.01,''' + cam_k + '''),__sBack0=__sBack,__spanBack0=__spanBack,__camSB=1/(1+CAM_K);
// CAM_TILT: how tall the table looks on screen (1 = step 1). Lower = a lower camera, so coins look more side-on.
const CAM_TILT=''' + cam_tilt + ''',__front1=__top+(__front-__top)*CAM_TILT;
const __camSpanBack=__spanFront-(__spanFront-__spanBack0)*(1-__camSB)/(1-__sBack0);
function __camS(u){return 1/(1+CAM_K*(1-u));}
__plane=function(y){const s=__camS((y-T.BACK)/(T.FRONT-T.BACK)),v=(s-__camSB)/(1-__camSB),py=__top+(__front1-__top)*v,gx=(__camSpanBack+(__spanFront-__camSpanBack)*v)/170,ds=CAM_K/(T.FRONT-T.BACK)*s*s,dy=(__front1-__top)*ds/(1-__camSB),dg=(__spanFront-__camSpanBack)*ds/(170*(1-__camSB));return {py,gx,dy,dg};};
// A row of the painted table at screen y (old camera) -> its y and width factor k under the new camera, and back.
// Above the back edge and below the front edge (posts, back wall, front rail) keep their painted height.
function __camFwd(y){if(y<__top||y>__front){const e=y<__top?__top:__front,m=__camFwd(e);return {y:m.y+y-e,k:m.k};}const v0=(y-__top)/(__front-__top),s0=__sBack0+v0*(1-__sBack0),u=1-(1/s0-1)/P_K,v1=(__camS(u)-__camSB)/(1-__camSB);
 return {y:__top+(__front1-__top)*v1,k:(__camSpanBack+(__spanFront-__camSpanBack)*v1)/(__spanBack0+(__spanFront-__spanBack0)*v0)};}
function __camBack(y){if(y<__top||y>__front1){const e=y<__top?__top:__front1,m=__camBack(e);return {y:m.y+y-e,k:m.k};}const v1=(y-__top)/(__front1-__top),s1=__camSB+v1*(1-__camSB),u=1-(1/s1-1)/CAM_K,s0=1/(1+P_K*(1-u)),v0=(s0-__sBack0)/(1-__sBack0);
 return {y:__top+(__front-__top)*v0,k:(__camSpanBack+(__spanFront-__camSpanBack)*v1)/(__spanBack0+(__spanFront-__spanBack0)*v0)};}
// Step 3: each row is also narrowed to the funnel's width at that row's table depth (posts/back wall: the back's).
const __slotHalf=__camSpanBack*PUSH_HALF/170;
function __rowFunnel(y){const v1=Math.max(0,Math.min(1,(y-__top)/(__front1-__top))),s1=__camSB+v1*(1-__camSB);return tableHalfAt(T.BACK+(1-(1/s1-1)/CAM_K)*(T.FRONT-T.BACK))/((T.R-T.L)/2);}
const __WARP_Y0=120,__WARP_Y1=680;
function __warpTable(src){const d=src.height/420,c=newCanvas(src.width,Math.round((__WARP_Y1-__WARP_Y0)*d)),g=c.getContext('2d'),dx=src.width/400;
 for(let r=0;r<c.height;r++){const yo=__WARP_Y0+(r+.5)/d,m=__camBack(yo),f=__rowFunnel(yo),sy=Math.floor((m.y-180)*d);if(!(sy>=0&&sy<src.height))continue;
  g.drawImage(src,0,sy,src.width,1,(200-200*m.k*f)*dx,r,400*m.k*f*dx,1);}return c;}
for(const r of __felt){const m=__camFwd(r[0]),f=__rowFunnel(m.y);r[0]=m.y;r[1]=200+(r[1]-200)*m.k*f;r[2]=200+(r[2]-200)*m.k*f;}
''')
sub(" Object.assign(ART,{head,table,", " Object.assign(ART,{head,table:__warpTable(table),")
# The back slot the pusher comes out of follows the table's new back width.
sub("p.rect(112,-1000,176,1228)", "p.rect(198-__slotHalf,-1000,2*__slotHalf+4,1228)")
sub("ctx.roundRect(112,218,176,11,3)", "ctx.roundRect(198-__slotHalf,218,2*__slotHalf+4,11,3)")
sub("ctx.moveTo(113,221);ctx.lineTo(287,221)", "ctx.moveTo(199-__slotHalf,221);ctx.lineTo(201+__slotHalf,221)")
sub(" ctx.save();ctx.beginPath();ctx.rect(0,180,400,368);ctx.rect(0,548,40,52);ctx.rect(358,548,42,52);ctx.clip();\n ctx.drawImage(ART.table,0,180,400,420);ctx.restore();",
    " ctx.save();ctx.beginPath();ctx.rect(0,__WARP_Y0,400,__front1-__WARP_Y0);ctx.rect(0,__front1,40,__WARP_Y1-__front1);ctx.rect(358,__front1,42,__WARP_Y1-__front1);ctx.clip();\n ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();")

# Step 2: during play the mitts (full approved sprite with its black cuff, Rest-pose size) rest on the table's back
# corners beside the face, like Bear Coin's paws, with a plain black arm continuing the cuff up behind the head.
sub(" const waitingX=side<0?-35:W+35,waitingY=VIEW.y+proj(200,410).y*VIEW.zy-12;",
    " const waitingX=200+side*MITT_X,waitingY=VIEW.y+MITT_Y*VIEW.zy;")
sub("ctx.rotate(waiting?-.25+Math.sin(time*1.7)*.018:", "ctx.rotate(waiting?MITT_TURN+Math.sin(time*1.7)*.018:")
sub("  const w=280*recoveryScale(),h=w*ART.paw.height/ART.paw.width; // Impact/sweep stay full size; retreat adds perspective.",
    "  const w=waiting?MITT_W:280*recoveryScale(),h=w*ART.paw.height/ART.paw.width; // Impact/sweep stay full size; retreat adds perspective.\n  if(waiting)drawMittArm(w,h);")
sub("function drawPaws() {", """// CP-21: where the mitts rest during play (game units; Rest-pose size) and the arm drawn up from each cuff.
const MITT_X=""" + mitt_x + """,MITT_Y=""" + mitt_y + """,MITT_W=182,MITT_TURN=""" + mitt_turn + """,ARM_LEN=""" + arm_len + """;
function drawMittArm(w,h){if(ARM_LEN<=0)return;const top=-h/2+.06*h,half=.205*w;ctx.fillStyle='rgb(8,8,7)';ctx.beginPath();ctx.moveTo(-half,top+30);ctx.lineTo(-half,top-ARM_LEN);ctx.lineTo(half,top-ARM_LEN);ctx.lineTo(half,top+30);ctx.closePath();ctx.fill();}
function drawPaws() {""")
# Step 3: funnel table (physics). About 4 coins across beside the pusher, slanting out to today's width.
sub("const PUSH_HALF=170, LEDGE_BACK=205;", """// CP-21 funnel: the table is FUNNEL_BACK either side of centre beside the pusher (about 4 coins across), then widens
// steadily from depth FUNNEL_D1 to FUNNEL_D2 to the full width (T.L..T.R): about 4, 5, then 6 coins across.
const FUNNEL_BACK=""" + funnel_back + """, FUNNEL_D1=""" + funnel_d1 + """, FUNNEL_D2=""" + funnel_d2 + """;
function tableHalfAt(y){const hw=(T.R-T.L)/2;return y<=FUNNEL_D1?FUNNEL_BACK:y>=FUNNEL_D2?hw:FUNNEL_BACK+(hw-FUNNEL_BACK)*(y-FUNNEL_D1)/(FUNNEL_D2-FUNNEL_D1);}
const PUSH_HALF=FUNNEL_BACK, LEDGE_BACK=205;""")
sub("""  box(10, 200, (T.FRONT + 100) / 2, T.L - 10, 190, (T.FRONT - 100) / 2, 0.2);               // side walls
  box(10, 200, (T.FRONT + 100) / 2, T.R + 10, 190, (T.FRONT - 100) / 2, 0.2);""",
"""  // side walls (CP-21 funnel): straight beside the pusher, a slant, then straight to the front
  const wall=(x0,y0,x1,y1,side)=>{const len=Math.hypot(x1-x0,y1-y0),a=Math.atan2(x1-x0,y1-y0),nx=Math.cos(a)*side,nz=-Math.sin(a)*side;
   world.createCollider(RAPIER.ColliderDesc.cuboid(10*M,200*M,(len/2+2)*M).setTranslation(((x0+x1)/2+nx*10)*M,190*M,((y0+y1)/2+nz*10)*M)
    .setRotation({x:0,y:Math.sin(a/2),z:0,w:Math.cos(a/2)}).setFriction(0.2),fixed);};
  for(const s of [-1,1]){wall(200+s*FUNNEL_BACK,-100,200+s*FUNNEL_BACK,FUNNEL_D1,s);wall(200+s*FUNNEL_BACK,FUNNEL_D1,200+s*halfW,FUNNEL_D2,s);wall(200+s*halfW,FUNNEL_D2,200+s*halfW,T.FRONT+100,s);}""")
sub("""   for(let x=T.L+COIN_R+1+(row%2)*d/2;x<T.R-COIN_R;x+=d) {
""", """   for(let x=T.L+COIN_R+1+(row%2)*d/2;x<T.R-COIN_R;x+=d) {
    if(Math.abs(x-200)>tableHalfAt(y)-COIN_R-1)continue;
""")
sub("x = rand(T.L + 40, T.R - 40), y = rand(PUSH_MAX + 40, T.FRONT - 90);", "y = rand(PUSH_MAX + 40, T.FRONT - 90), x = 200 + rand(-1, 1) * (tableHalfAt(y) - 40);")
sub("const x=Math.max(T.L+COIN_R,Math.min(T.R-COIN_R,at.x)),exit", "const x=Math.max(200-PUSH_HALF+COIN_R,Math.min(200+PUSH_HALF-COIN_R,at.x)),exit")
sub("rand(T.L + 30, T.R - 30), DROP_H, DROP_Y + rand(-3, 10)", "rand(200 - PUSH_HALF + 30, 200 + PUSH_HALF - 30), DROP_H, DROP_Y + rand(-3, 10)")

# Step 3b: with the steady taper, Board 3's three small back-left towers would stand inside the left wall; shift them
# 12 units toward the centre (spacing unchanged).
if funnel_d2 == '640':
    sub("{x:92,y:365,n:4},{x:126,y:365,n:10},{x:160,y:365,n:4}", "{x:104,y:365,n:4},{x:138,y:365,n:10},{x:172,y:365,n:4}")

sub(" ctx.fillStyle='#18352c';ctx.fillRect(42,547.5,314,3.5);ctx.fillStyle='#a16b25';ctx.fillRect(42,550,314,1);",
    " ctx.fillStyle='#18352c';ctx.fillRect(42,__front1-.5,314,3.5);ctx.fillStyle='#a16b25';ctx.fillRect(42,__front1+2,314,1);")
# Board 3: 160 coins (Jenny, Oct 20: "for now").
sub("{id:'tuna-terraces',name:'Board 3',seed:316,coins:140,", "{id:'tuna-terraces',name:'Board 3',seed:316,coins:160,")

# Step 6 (Jenny, Oct 20): no wood rails, only the felt (and its front lip); zoom the whole view in so the table's
# front edge sits near the bottom of the screen. The mitts are drawn in screen space and keep their approved size.
if rails == 'off':
    sub(" ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();",
        " ctx.clip(__cachedBoardPath());ctx.drawImage(ART.table,0,__WARP_Y0,400,__WARP_Y1-__WARP_Y0);ctx.restore();")
sub(" VIEW.z=Math.min(.98,z);VIEW.zy=z;VIEW.y=top-upper*z;",
    " VIEW.z=Math.min(.98,z);VIEW.zy=z;if(CAM_FILL){const k=Math.min(CAM_ZOOM_MAX,Math.max(1,(bottom-top)/(__front1+FRONT_MARGIN-upper)/z));VIEW.z*=k;VIEW.zy*=k;}VIEW.y=top-upper*VIEW.zy;")
sub("const VIEW = { z: 1, zy: 1, y: 0 };", """const VIEW = { z: 1, zy: 1, y: 0 };
// CP-21: zoom in until the table's front edge is FRONT_MARGIN above the buttons (the ears stay just under the HUD).
// CAM_ZOOM_MAX caps the zoom (a partial zoom leaves some space below the table).
const CAM_FILL=""" + ('false' if zoom == 'none' else 'true') + """,CAM_ZOOM_MAX=""" + ('9' if zoom in ('fill','none') else zoom) + """,FRONT_MARGIN=18;""")

# Step 7: coins drawn thicker (drawing only; physics keeps COIN_HALF). The coin's bottom stays where it was; the rim is
# built from layers no more than ~1.5 units apart so its side reads as solid, and the face sits on top.
sub("""  for (const k of [-1, 0]) { // darker lower lip separates the satin-gold stack layers
    if(kind==='coin'||kind==='silver')ctx.fillStyle=k===-1?'#80551d':'#b98d39';
    ctx.save(); ctx.translate(c.x + pn.x * half * k, c.y + pn.y * half * k); ctx.transform(pu.x, pu.y, pw.x, pw.y, 0, 0);""",
"""  // CP-21: gold and silver coins are drawn COIN_LOOK times thicker; their bottom stays on what they rest on.
  const look=kind==='coin'||kind==='silver'?COIN_LOOK:1,face=-half+2*half*look,layers=look===1?1:Math.ceil(face/1.5);
  for (let i = 0; i <= layers; i++) { const k=(-half+i*face/layers)/half; // darker lower lip separates the satin-gold stack layers
    if(kind==='coin'||kind==='silver')ctx.fillStyle=i===0?'#80551d':'#b98d39';
    ctx.save(); ctx.translate(c.x + pn.x * half * k, c.y + pn.y * half * k); ctx.transform(pu.x, pu.y, pw.x, pw.y, 0, 0);""")
sub("""  ctx.save(); ctx.translate(c.x + pn.x * half, c.y + pn.y * half); ctx.transform(pu.x, pu.y, pw.x, pw.y, 0, 0);
  ctx.drawImage(sp.cv,""", """  ctx.save(); ctx.translate(c.x + pn.x * face, c.y + pn.y * face); ctx.transform(pu.x, pu.y, pw.x, pw.y, 0, 0);
  ctx.drawImage(sp.cv,""")
sub("const COIN_HALF = 2, LUCKY_HALF = 3.5, ITEM_HALF = 9; // half thicknesses", """const COIN_HALF = 2, LUCKY_HALF = 3.5, ITEM_HALF = 9; // half thicknesses
const COIN_LOOK = """ + coin_look + """; // CP-21: how many times thicker coins are drawn than they are in the physics""")

# Step 8 (Jenny, Oct 20): no towers. Every board starts as a perfectly ordered single layer: straight rows of coins side
# by side, all faces turned the same way, from just in front of the fully pushed pusher to the front edge, as many per row
# as the table's width allows (4, 5, then 6). Prizes (and Board 3's Quake coin) rest on top of the rows.
if layout == 'rows':
    i = s.index('function prefill() {'); j = s.index('function load()', i)
    s = s[:i] + """function prefill() {
 // CP-21: an ordered start. Straight rows, one coin layer, no towers; prizes rest on top.
 const d=COIN_R*2+1;
 for(let y=PUSH_MAX+COIN_R+3;y+COIN_R<=T.FRONT;y+=d){
  const n=Math.floor(2*Math.min(tableHalfAt(y-COIN_R),tableHalfAt(y+COIN_R))/d);
  for(let i=0;i<n;i++)addCoin(seededRandom()<.25?'silver':'coin',null,200+(i-(n-1)/2)*d,COIN_HALF+.2,y,yawTurn(0));
 }
 if(BOARD.id==='tuna-terraces')addCoin('quake',null,200,COIN_HALF*2+halfOf('quake')+1,595,yawTurn(0));
 for(const target of BOARD.targets) {
  const b=addCoin('item',target.id,target.x,COIN_HALF*2+halfOf('item')+1,target.y,yawTurn(0));
  b.boardTarget=true;
 }
}

""" + s[j:]

# Step 9 (Jenny, Oct 21): a U shape, all in frame. The head is drawn at a fixed size that fits the screen (HEAD_Z), chin
# on the table's back edge; the table below it is zoomed to fill the rest of the screen. The mitts are the U's arms,
# drawn above the coins. A row of 4 coins starts in the narrow part at the top.
if frame == 'u':
    sub(" VIEW.z=Math.min(.98,z);VIEW.zy=z;if(CAM_FILL){const k=Math.min(CAM_ZOOM_MAX,Math.max(1,(bottom-top)/(__front1+FRONT_MARGIN-upper)/z));VIEW.z*=k;VIEW.zy*=k;}VIEW.y=top-upper*VIEW.zy;",
        " const z0=Math.min(.98,z);VIEW.hz=HEAD_Z;VIEW.hzy=HEAD_Z*z/z0;const chin=top+(CHIN_Y-upper)*VIEW.hzy;\n // The table zooms to reach the bottom, but never wider than the screen (front edge at most TABLE_W wide); any height\n // left over is split above the head and below the table.\n VIEW.zy=Math.max(z,Math.min((bottom-FRONT_MARGIN-chin)/(__front1-CHIN_Y),TABLE_W/(2*__spanFront)*z/z0));VIEW.z=VIEW.zy*z0/z;\n const spare=bottom-FRONT_MARGIN-(chin+(__front1-CHIN_Y)*VIEW.zy);VIEW.y=chin+spare/2-CHIN_Y*VIEW.zy;VIEW.headDown=spare/2;")
    sub("const CAM_FILL=", "const HEAD_Z=" + head_z + ",CHIN_Y=215,TABLE_W=" + table_w + ",HEAD_DROP=" + head_drop + "; // HEAD_DROP: head lowered over the back of the pusher (game units) // CP-21: head size on screen (whole cat in frame), the head row on the table's back edge, widest table front\nconst CAM_FILL=")
    sub(" const down=quakeHeadOffset();ctx.save();ctx.translate(0,down);",
        " const down=quakeHeadOffset();ctx.save();ctx.translate(200,CHIN_Y+HEAD_DROP);ctx.scale(VIEW.hz/VIEW.z,VIEW.hzy/VIEW.zy);ctx.translate(-200,-CHIN_Y);ctx.translate(0,down);")
    paws = " if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()){ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);drawPaws();ctx.restore();}"
    sub(paws + "\n", "")
    sub("  __drawBoardBodies();\n", "  __drawBoardBodies();\n  // CP-21: idle mitts are the U's arms, drawn above the coins (the head still covers their cuffs).\n" + paws + "\n")
    sub(" for(let y=PUSH_MAX+COIN_R+3;y+COIN_R<=T.FRONT;y+=d){", " for(let y=PUSH_MIN+COIN_R+2;y+COIN_R<=T.FRONT-START_CLEAR;y+=d){")
    sub(" const d=COIN_R*2+1;\n", " const d=COIN_R*2+1,START_CLEAR=" + start_clear + "; // keep the front rows this far from the edge\n")

# Step 10 (Jenny, Oct 21): soft shadows. Each coin, tower and prize gets a soft dark patch under its bottom, a little
# toward the player, drawn just before it (so an upper coin also shades the coin it rests on). Drawing only.
if shadow != '0':
    sub("for(const b of bodies)if(!b.danceDown)drawBody(b);", "for(const b of bodies)if(!b.danceDown){drawShadow(b);drawBody(b);}")
    sub("function __drawBoardBodies(){", """// CP-21: one soft shadow sprite, scaled under each body. SHADOW is its darkness at the centre.
const SHADOW=""" + shadow + """,SHADOW_SIZE=1.5,SHADOW_OFF=16;let __shadowSprite=null;
function drawShadow(b){
 if(b.input&&b.fresh)return;
 if(!__shadowSprite){__shadowSprite=newCanvas(64,64);const g=__shadowSprite.getContext('2d'),r=g.createRadialGradient(32,32,0,32,32,32);
  r.addColorStop(0,'rgba(0,0,0,'+SHADOW+')');r.addColorStop(.55,'rgba(0,0,0,'+SHADOW*.75+')');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);}
 const t=b.rb.translation(),x=t.x/M,y=t.z/M,h=t.y/M,half=b.kind==='stack'?b.half:halfOf(b.kind),r=radius(b.kind)*SHADOW_SIZE;
 const p=__plane(y+SHADOW_OFF),c=screenOf(x,y+SHADOW_OFF,Math.max(0,h-half)),rx=r*p.gx,ry=r*p.dy;
 ctx.drawImage(__shadowSprite,c.x-rx,c.y-ry,rx*2,ry*2);
}
function __drawBoardBodies(){""")

# Step 11 (Jenny, Oct 21): a dark edge around each gold/silver coin, like the reference: a dark border around the whole
# coin (face and rim) and a darker line where the face meets the rim. Drawing only.
if outline != '0':
    sub("""  for (let i = 0; i <= layers; i++) { const k=(-half+i*face/layers)/half; // darker lower lip separates the satin-gold stack layers""",
        """  if(look!==1){ctx.fillStyle=COIN_EDGE;for(let i=0;i<=layers;i++){const k=(-half+i*face/layers)/half; // CP-21: dark border round the whole coin
    ctx.save();ctx.translate(c.x+pn.x*half*k,c.y+pn.y*half*k);ctx.transform(pu.x,pu.y,pw.x,pw.y,0,0);ctx.beginPath();ctx.arc(0,0,r+COIN_EDGE_W,0,7);ctx.fill();ctx.restore();}
    ctx.save();ctx.translate(c.x+pn.x*face,c.y+pn.y*face);ctx.transform(pu.x,pu.y,pw.x,pw.y,0,0);ctx.beginPath();ctx.arc(0,0,r+COIN_EDGE_W,0,7);ctx.fill();ctx.restore();}
  for (let i = 0; i <= layers; i++) { const k=(-half+i*face/layers)/half; // darker lower lip separates the satin-gold stack layers""")
    sub("""  ctx.drawImage(sp.cv, -sp.half, -sp.half, sp.half * 2, sp.half * 2); ctx.restore();""",
        """  ctx.drawImage(sp.cv, -sp.half, -sp.half, sp.half * 2, sp.half * 2);
  if(look!==1){ctx.strokeStyle=COIN_EDGE;ctx.lineWidth=COIN_EDGE_W*.7;ctx.beginPath();ctx.arc(0,0,r-COIN_EDGE_W*.2,0,7);ctx.stroke();} // CP-21: face/rim line
  ctx.restore();""")
    sub("const COIN_LOOK = ", "const COIN_EDGE = '" + outline + "', COIN_EDGE_W = " + outline_w + "; // CP-21: dark coin edge colour and width (game units)\nconst COIN_LOOK = ")

# Step 12 (Jenny, Oct 21): dark coin sides, bright faces (reference: the sides are shaded dark, the faces stay bright).
# The rim layers run from RIM_BOTTOM up to RIM_TOP just under the face. Drawing only.
if rim != 'off':
    sub("""    if(kind==='coin'||kind==='silver')ctx.fillStyle=i===0?'#80551d':'#b98d39';""",
        """    if(kind==='coin'||kind==='silver')ctx.fillStyle=look===1?(i===0?'#80551d':'#b98d39'):__rimColour(kind,i/layers);""")
    sub("const COIN_LOOK = ", """// CP-21: coin side colours, bottom to just under the face (silver coins share the gold sides).
const RIM={coin:[[""" + rim + """]]};RIM.silver=RIM.coin; // silver coins use the gold face art, so the gold side too
function __rimColour(kind,t){const [a,b]=RIM[kind];return 'rgb('+a.map((v,i)=>Math.round(v+(b[i]-v)*t)).join(',')+')';}
const COIN_LOOK = """)

# Step 13 (Jenny, Oct 21: "the shiny coins are cool"): gold and silver coins use the older shiny face (img/art/coin.webp,
# already in the payload) instead of the UAT-18 satin paw face. The Quake coin keeps its UAT-18 face.
if coin_face == 'shiny':
    sub("sprites.coin=atlasCoin([0,0,softPaw.width,softPaw.height],COIN_R,softPaw);sprites.silver=sprites.coin;",
        "sprites.coin={cv:face,half:COIN_R};sprites.silver=sprites.coin; // CP-21: the shiny coin.webp face")

# Step 13b (preview, Jenny Oct 21: "so are the cartoon ones"): a cartoon coin face drawn in code after Codex's Oct 11
# mockup (outputs/quirky-cat-mockups/illustrated-coins-paw-4.png): bright yellow face, darker inner ring, thick dark
# outline, flat brown paw print. New art drawn by code; preview only until Jenny picks.
if coin_face == 'cartoon':
    sub("sprites.coin=atlasCoin([0,0,softPaw.width,softPaw.height],COIN_R,softPaw);sprites.silver=sprites.coin;",
        "sprites.coin=cartoonCoin(COIN_R);sprites.silver=sprites.coin; // CP-21 preview: cartoon coin drawn in code")
    sub("async function loadArt() {", """// CP-21 preview: a flat cartoon coin face (after Codex's Oct 11 mockup), drawn once into a sprite.
function cartoonCoin(r){const n=Math.ceil(r*2*SPR),cv=newCanvas(n,n),g=cv.getContext('2d'),k=n/2/r;g.scale(k,k);g.translate(r,r);
 const o=r*.11;g.fillStyle='#4a2a04';g.beginPath();g.arc(0,0,r,0,7);g.fill(); // thick dark outline
 let f=g.createRadialGradient(-r*.3,-r*.35,r*.1,0,0,r-o);f.addColorStop(0,'#fff27a');f.addColorStop(.55,'#ffd21f');f.addColorStop(1,'#f4a90c');
 g.fillStyle=f;g.beginPath();g.arc(0,0,r-o,0,7);g.fill();
 g.strokeStyle='#c27a06';g.lineWidth=r*.07;g.beginPath();g.arc(0,0,r*.72,0,7);g.stroke(); // inner ring
 g.fillStyle='#8a4f0c'; // paw print: one pad and four toes
 g.beginPath();g.ellipse(0,r*.17,r*.27,r*.21,0,0,7);g.fill();
 for(const [x,y,rx,ry,a] of [[-.33,-.12,.1,.13,-.35],[-.12,-.3,.1,.14,-.1],[.12,-.3,.1,.14,.1],[.33,-.12,.1,.13,.35]]){g.beginPath();g.ellipse(x*r,y*r,rx*r,ry*r,a,0,7);g.fill();}
 g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(-r*.42,-r*.45,r*.16,r*.07,-.7,0,7);g.fill(); // shine
 return {cv,half:r};}
async function loadArt() {""")

# Step 13c (Jenny, Oct 21): keep the real gold coin, but make it easier to see. 'bigpaw' uses the approved big raised-paw
# gold face from the UAT-18 sheet (uat18-coin-faces.png, left coin; the Quake coin is the right one, unchanged).
# 'bigpaw-clear' is the same art with its contrast and colour turned up once when the sprite is made, so the raised paw's
# light and shade survive at phone size. No redrawing.
if coin_face in ('bigpaw', 'bigpaw-clear'):
    sub("sprites.coin=atlasCoin([0,0,softPaw.width,softPaw.height],COIN_R,softPaw);sprites.silver=sprites.coin;",
        "sprites.coin=atlasCoin([55,44,775,765],COIN_R);" + ("coinClarity(sprites.coin.cv,COIN_CONTRAST,COIN_SATURATE);" if coin_face == 'bigpaw-clear' else "") + "sprites.silver=sprites.coin; // CP-21: big raised-paw gold face")
    sub("async function loadArt() {", """// CP-21: contrast (around the gold's mid-tone) and saturation boost for a coin sprite, applied once.
const COIN_CONTRAST=""" + contrast + """,COIN_SATURATE=""" + saturate + """;
function coinClarity(cv,k,sat){const g=cv.getContext('2d'),im=g.getImageData(0,0,cv.width,cv.height),d=im.data;
 for(let i=0;i<d.length;i+=4){if(!d[i+3])continue;const l=.3*d[i]+.59*d[i+1]+.11*d[i+2];
  for(let c=0;c<3;c++){const v=l+(d[i+c]-l)*sat;d[i+c]=Math.max(0,Math.min(255,(v-140)*k+140));}}
 g.putImageData(im,0,0);}
async function loadArt() {""")

# Step 14 (Jenny, Oct 21: "yes please"): smooth coin sides and softer grain. The thick coin's side is one shape (hull of
# its bottom and top discs) with one smooth shade, darkest at its lowest point on screen: no stripes, and cheaper than layers. The clearer coin face is softened very slightly before its contrast boost. Drawing only.
if smooth == 'on':
    sub("""  for (let i = 0; i <= layers; i++) { const k=(-half+i*face/layers)/half; // darker lower lip separates the satin-gold stack layers""",
        """  const det=pu.x*pw.y-pw.x*pu.y;
  if(look!==1&&Math.abs(det)>1e-6){ // CP-21: the side as one shape (hull of bottom and top discs) with one smooth shade
    const D=face+half,A=r*Math.hypot(pu.y,pw.y),inv=(X,Y)=>({x:(pw.y*X-pw.x*Y)/det,y:(pu.x*Y-pu.y*X)/det});
    const d=inv(pn.x*D,pn.y*D),l=Math.hypot(d.x,d.y)||1e-6,nx=-d.y/l*r,ny=d.x/l*r,g0=inv(0,A),t=Math.min(.9,Math.abs(pn.y)*D/(A+Math.abs(pn.y)*D)+.05);
    ctx.save();ctx.translate(c.x-pn.x*half,c.y-pn.y*half);ctx.transform(pu.x,pu.y,pw.x,pw.y,0,0);
    // shade runs from the coin's lowest point on screen (darkest) up toward its top: dark at the front, lighter toward the top
    const g=ctx.createLinearGradient(g0.x,g0.y,d.x,d.y);g.addColorStop(0,__rimColour(kind,0));g.addColorStop(t,__rimColour(kind,1));g.addColorStop(1,__rimColour(kind,1));ctx.fillStyle=g;
    ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nx+d.x,ny+d.y);ctx.lineTo(d.x-nx,d.y-ny);ctx.lineTo(-nx,-ny);ctx.closePath();ctx.fill();ctx.beginPath();ctx.arc(d.x,d.y,r,0,7);ctx.fill();ctx.restore();
  }
  else for (let i = 0; i <= layers; i++) { const k=(-half+i*face/layers)/half; // darker lower lip separates the satin-gold stack layers""")
    sub("""function coinClarity(cv,k,sat){const g=cv.getContext('2d'),im=g.getImageData(0,0,cv.width,cv.height),d=im.data;
 for(let i=0;i<d.length;i+=4){""", """function coinClarity(cv,k,sat){const g=cv.getContext('2d'),im=g.getImageData(0,0,cv.width,cv.height),d=im.data,w=cv.width,src=d.slice();
 // soften the satin grain a little first (half a 3x3 average), so the boost doesn't make it speckly
 for(let y=1;y<cv.height-1;y++)for(let x=1;x<w-1;x++){const i=(y*w+x)*4;if(!src[i+3])continue;for(let c=0;c<3;c++){let t=0;for(let j=-1;j<=1;j++)for(let m=-1;m<=1;m++)t+=src[i+(j*w+m)*4+c];d[i+c]=(src[i+c]+t/9)/2;}}
 for(let i=0;i<d.length;i+=4){""")

# Step 15 (Jenny, Oct 21): the Quake coin gets the same brightening as the gold coins (same contrast and colour boost,
# applied once to its approved face; the blue ceramic bolt and ring stay its own art).
if quake_bright == 'on':
    sub(" sprites.quake=atlasCoin([934,45,780,775],radius('quake'));", " sprites.quake=atlasCoin([934,45,780,775],radius('quake'));coinClarity(sprites.quake.cv,COIN_CONTRAST,COIN_SATURATE); // CP-21: as bright as the gold coins")

# Step 16 (Jenny, Oct 21): the Quake coin matches the paw coins. Its face gets a slightly stronger boost of its own (it
# started paler); its side is the paw coins' dark gold with its blue ceramic band kept in the middle; it is drawn as thick
# as the paw coins ('same'), or a little thicker and wider ('big': physical radius QUAKE_R x the paw coin's, a physics
# change for this one coin). The side is drawn by __coinSide (one smoothly shaded shape per band).
if quake_side == 'on':
    hull_start = s.index("  if(look!==1&&Math.abs(det)>1e-6){ // CP-21: the side as one shape")
    hull_end = s.index("  else for (let i = 0; i <= layers; i++)", hull_start)
    s = s[:hull_start] + """  if(look!==1&&Math.abs(det)>1e-6){ // CP-21: the side as smoothly shaded shapes; the Quake coin keeps a blue ceramic band
    if(kind==='quake'){const D=face+half,g0=__rimColour('coin',0),g1=__rimColour('coin',1);
     __coinSide(c,pn,pu,pw,det,r,-half,face,g0,g1);__coinSide(c,pn,pu,pw,det,r,-half+.3*D,-half+.62*D,QUAKE_BLUE[0],QUAKE_BLUE[1]);__coinSide(c,pn,pu,pw,det,r,-half+.62*D,face,__rimColour('coin',.55),g1);}
    else __coinSide(c,pn,pu,pw,det,r,-half,face,__rimColour(kind,0),__rimColour(kind,1));
  }
""" + s[hull_end:]
    sub("function drawCoinAt(kind, c, q, id) {", """// CP-21: a thick coin's side between heights h0 and h1 above its centre: the hull of the two discs, shaded from col0 at its
// lowest point on screen to col1 toward the top.
function __coinSide(c,pn,pu,pw,det,r,h0,h1,col0,col1){
 const D=h1-h0,A=r*Math.hypot(pu.y,pw.y),inv=(X,Y)=>({x:(pw.y*X-pw.x*Y)/det,y:(pu.x*Y-pu.y*X)/det});
 const d=inv(pn.x*D,pn.y*D),l=Math.hypot(d.x,d.y)||1e-6,nx=-d.y/l*r,ny=d.x/l*r,g0=inv(0,A),t=Math.min(.9,Math.abs(pn.y)*D/(A+Math.abs(pn.y)*D)+.05);
 ctx.save();ctx.translate(c.x+pn.x*h0,c.y+pn.y*h0);ctx.transform(pu.x,pu.y,pw.x,pw.y,0,0);
 const g=ctx.createLinearGradient(g0.x,g0.y,d.x,d.y);g.addColorStop(0,col0);g.addColorStop(t,col1);g.addColorStop(1,col1);ctx.fillStyle=g;
 ctx.beginPath();ctx.arc(0,0,r,0,7);ctx.fill();ctx.beginPath();ctx.moveTo(nx,ny);ctx.lineTo(nx+d.x,ny+d.y);ctx.lineTo(d.x-nx,d.y-ny);ctx.lineTo(-nx,-ny);ctx.closePath();ctx.fill();
 ctx.beginPath();ctx.arc(d.x,d.y,r,0,7);ctx.fill();ctx.restore();}
function drawCoinAt(kind, c, q, id) {""")
    sub("const look=kind==='coin'||kind==='silver'?COIN_LOOK:1,", "const look=kind==='coin'||kind==='silver'?COIN_LOOK:kind==='quake'?QUAKE_THICK/(2*half):1,")
    sub("  if(kind==='quake'){\n    if(kind==='quake')for(const k of [-.48,-.12,.28])", "  if(kind==='quake'&&look===1){\n    if(kind==='quake')for(const k of [-.48,-.12,.28])")
    sub("coinClarity(sprites.quake.cv,COIN_CONTRAST,COIN_SATURATE);", "coinClarity(sprites.quake.cv,QUAKE_CONTRAST,QUAKE_SATURATE);")
    sub("  if(kind==='quake')return COIN_R*1.08;", "  if(kind==='quake')return COIN_R*QUAKE_R;")
    big = quake_size == 'big'
    sub("const COIN_LOOK = ", "// CP-21: the Quake coin: drawn thickness (game units; paw coins are 8), width vs a paw coin (physics too), face boost\nconst QUAKE_THICK = " + ('10' if big else '8') + ", QUAKE_R = " + ('1.2' if quake_size in ('big','wide') else '1.08') + ", QUAKE_CONTRAST = 1.8, QUAKE_SATURATE = 1.4;\n// the side's blue band: the face ring's blue after the boost (measured: rgb(0,12,255)), a touch darker at its lowest edge\nconst QUAKE_BLUE = ['rgb(0,10,215)','rgb(0,12,255)'];\nconst COIN_LOOK = ")

# Step 17 (Jenny, Oct 21): things resting on coins sit on the coins' drawn tops. Coins are drawn COIN_LOOK times thicker
# than the physics, so anything lying on a coin was drawn sunk into it (the Quake coin looked tucked under). Its drawn
# height above the surface below (table or pusher) is stretched by the same factor. Drawing only.
if lift == 'on':
    sub("""function drawBody(b) {""", """// CP-21: drawn height of a body resting on coins: its height above the table (or the pusher top) times COIN_LOOK.
function __lift(b,y,h){const half=b.half??halfOf(b.kind),onPusher=y<=tongueDrawY+2&&h-half>=TONGUE_H-2,base=onPusher?TONGUE_H:0;
 return h+Math.max(0,h-half-base)*(COIN_LOOK-1);}
function drawBody(b) {""")
    sub("""    const c = screenOf(x, y, h - b.half);
    drawPrize""", """    const c = screenOf(x, y, __lift(b, y, h) - b.half);
    drawPrize""")
    sub("""  else drawCoinAt(b.kind, screenOf(x, y, h), b.rb.rotation(), b.id);
}""", """  else drawCoinAt(b.kind, screenOf(x, y, __lift(b, y, h)), b.rb.rotation(), b.id);
}""")

# Step 18 (Jenny, Oct 21): a longer table. T.FRONT moves table_front units from the back (640 before), so there are more
# rows of coins; prizes (and Board 3's Quake coin) keep their distance from the front edge. Physics change: rebalance
# checks needed. The old picture-fitted projection (proj/depthScale), which only sets the drop's start height, keeps
# the old 640 so drops start where they did.
if table_front != '640':
    import re
    delta = int(table_front) - 640
    sub("const T = { L: 30, R: 370, BACK: 190, FRONT: 640 };", "const T = { L: 30, R: 370, BACK: 190, FRONT: " + table_front + " }; // CP-21: longer table (was 640)")
    sub("function depthScale(y) { return 1 / (1 + P_K * (1 - (y - T.BACK) / (T.FRONT - T.BACK))); }",
        "function depthScale(y) { return 1 / (1 + P_K * (1 - (y - T.BACK) / (640 - T.BACK))); } // CP-21: the picture's own table depth")
    sub("const ds=P_K/(T.FRONT-T.BACK)*depthScale(at.depth)**2;", "const ds=P_K/(640-T.BACK)*depthScale(at.depth)**2;")
    i = s.index('const BOARDS = Object.freeze(['); j = s.index(']);', i)
    s = s[:i] + re.sub(r"(\{id:'(?:cheese|shrimp|tuna)',x:\d+,y:)(\d+)\}", lambda m: m.group(1) + str(int(m.group(2)) + delta) + '}', s[i:j]) + s[j:]
    sub("addCoin('quake',null,200,COIN_HALF*2+halfOf('quake')+1,595,yawTurn(0));", "addCoin('quake',null,200,COIN_HALF*2+halfOf('quake')+1," + str(595 + delta) + ",yawTurn(0));")

# Step 19 (Jenny, Oct 21): armrests. A raised teal block with a brass top runs along each side of the table's narrow back,
# from behind the back edge to where the table reaches full width; its inner side follows the table edge. The mitts rest
# on the armrest tops, off the coins. Simple shapes in the game's teal/brass style; drawing only (the walls are unchanged).
if armrests == 'on':
    sub("drawMachine=function(){", """// CP-21: the armrests (game units: height above the table, how far they reach back and forward).
const ARM_H=""" + arm_h + """,ARM_BACK=T.BACK-40,ARM_FRONT=""" + arm_front + """,ARM_OUT=330;
function __armPoint(side,d,outer,h){const x=200+side*(outer?ARM_OUT:tableHalfAt(Math.max(T.BACK,d))+1);return screenOf(x,d,h);}
function drawArmrests(){
 for(const side of [-1,1]){
  const steps=[];for(let i=0;i<=8;i++)steps.push(ARM_BACK+(ARM_FRONT-ARM_BACK)*i/8);
  const quad=(pts,fill,stroke)=>{ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);for(const q of pts.slice(1))ctx.lineTo(q.x,q.y);ctx.closePath();ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();}};
  // inner side (faces the table), then the front, then the brass top
  const inner=[...steps.map(d=>__armPoint(side,d,false,0)),...steps.slice().reverse().map(d=>__armPoint(side,d,false,ARM_H))];
  quad(inner,'#0b3a36');
  const f0=__armPoint(side,ARM_FRONT,false,0),f1=__armPoint(side,ARM_FRONT,true,0),f2=__armPoint(side,ARM_FRONT,true,ARM_H),f3=__armPoint(side,ARM_FRONT,false,ARM_H);
  const fg=ctx.createLinearGradient(0,f3.y,0,f0.y);fg.addColorStop(0,'#17605a');fg.addColorStop(1,'#0c3f3a');quad([f0,f1,f2,f3],fg);
  const top=[...steps.map(d=>__armPoint(side,d,false,ARM_H)),...steps.slice().reverse().map(d=>__armPoint(side,d,true,ARM_H))];
  const tg=ctx.createLinearGradient(0,top[0].y,0,f3.y);tg.addColorStop(0,'#b77d24');tg.addColorStop(.6,'#e2b24c');tg.addColorStop(1,'#f6cf67');quad(top,tg,'#805613');
  ctx.strokeStyle='#ffe9a1';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(f3.x,f3.y);ctx.lineTo(f2.x,f2.y);ctx.stroke(); // bright brass front edge
 }
}
// Where an idle mitt rests: on its armrest's top, near the front, in screen units.
function mittRest(side){const d=MITT_D,p=screenOf(200+side*(tableHalfAt(d)+1),d,ARM_H),edge=200+(p.x-200)*VIEW.z; // the armrest's inner front corner
 return {x:edge+side*(MITT_W/2-MITT_HOOK),y:VIEW.y+p.y*VIEW.zy-MITT_LIFT+(typeof HEAD_DROP==='number'?HEAD_DROP*VIEW.zy:0)};} // mitts move down with the head // claws hook MITT_HOOK over the inner edge
drawMachine=function(){""")
    sub(" drawTongue();\n};", " drawArmrests();drawTongue();\n};")
    sub(" const waitingX=200+side*MITT_X,waitingY=VIEW.y+MITT_Y*VIEW.zy;", " const __mr=mittRest(side),waitingX=__mr.x,waitingY=__mr.y;")
    sub(",ARM_LEN=", ",MITT_LIFT=" + mitt_lift + ",MITT_HOOK=" + mitt_hook + ",MITT_D=" + mitt_d + ",ARM_LEN=")

# Step 19b (option, 'front'): mitts drawn in front of the head, their black arms behind it. Jenny preferred 'behind'
# (arm1.png, Oct 21): mitts tucked behind the cheeks with only their claws and the edge of the paw showing on the ledges.
if armrests == 'on' and mitt_layer == 'front':
    sub("""  if(waiting)drawMittArm(w,h);
  if(recoveryMix>0)drawRestMitt(w,recoveryMix);else ctx.drawImage(ART.paw,-w/2,-h/2,w,h);ctx.restore();""",
        """  if(waiting&&__pawPass!=='mitts')drawMittArm(w,h);
  if(!(waiting&&__pawPass==='arms')){if(recoveryMix>0)drawRestMitt(w,recoveryMix);else ctx.drawImage(ART.paw,-w/2,-h/2,w,h);}ctx.restore();""")
    idle = " if(sweepTime===0&&catquakeTime===0&&powerFace()!=='happy'&&!isRestPose()){ctx.save();ctx.setTransform(scale*devicePixelRatio,0,0,scale*devicePixelRatio,0,0);drawPaws();ctx.restore();}"
    sub(idle, idle.replace("drawPaws();", "__pawPass='arms';drawPaws();__pawPass='';"))
    sub(" if(face==='happy')drawHappyPaws();", " if(face==='happy')drawHappyPaws();\n // CP-21: idle mitts rest on the armrests in front of the head (their arms were drawn behind it)\n" + idle.replace("drawPaws();", "__pawPass='mitts';drawPaws();__pawPass='';"))
    sub("function drawPaws() {", "let __pawPass=''; // CP-21: '' draws arms and mitts; 'arms' or 'mitts' draws just that part of the idle pose\nfunction drawPaws() {")

# Step 19c (Jenny, Oct 21): the mitts sit out at the sides beside the table (partly off screen is fine), not over the
# board. Optional: the approved clawless mitt (the Happy pose's art) for the idle pose ('clawless').
if mitt_art == 'clawless':
    sub("  if(!(waiting&&__pawPass==='arms')){if(recoveryMix>0)drawRestMitt(w,recoveryMix);else ctx.drawImage(ART.paw,-w/2,-h/2,w,h);}ctx.restore();",
        "  if(!(waiting&&__pawPass==='arms')){if(recoveryMix>0)drawRestMitt(w,recoveryMix);else ctx.drawImage(waiting?ART.happyMitt:ART.paw,-w/2,-h/2,w,h);}ctx.restore(); // CP-21: idle = approved clawless mitt")

# Step 19d (Jenny, Oct 21, arm1.png): the idle mitts are drawn without their black cuff, the way the Rest pose already
# draws them (drawRestMitt), and without the black arm, so no black corners show beside the cheeks.
if cuff == 'off':
    sub("  if(recoveryMix>0)drawRestMitt(w,recoveryMix);else ctx.drawImage(ART.paw,-w/2,-h/2,w,h);ctx.restore();",
        "  if(recoveryMix>0)drawRestMitt(w,recoveryMix);else if(waiting)drawRestMitt(w);else ctx.drawImage(ART.paw,-w/2,-h/2,w,h);ctx.restore(); // CP-21: idle mitts without the cuff")

# Steps 22-24 (Jenny, Oct 26, layout lock): the cat and table move up until the ears reach the HUD (the background
# stays fixed to the screen); a longer table keeps the 640 table's row size, so extra rows run further down the screen
# instead of squeezing (the camera used to spread the whole table over a fixed screen height); the painted felt is
# extended past the old front edge (the row just before it repeats, widening with the perspective).
# Gutters (Jenny, Oct 26): coins can slide over the table's left and right edges and hang off them naturally, instead of
# being held by an invisible wall. The funnel walls beside the pusher stay (the armrests are there); from where the table
# reaches full width to the front, the sides are open and the table top ends exactly at the edge. A coin that drops off a
# side is lost (it does not pay), like a real pusher's side gutters.
if gutters == 'on':
    sub("box(halfW + 40, 10, (T.FRONT + 100) / 2, 200, -10, (T.FRONT - 100) / 2, TABLE_FRICTION); // table top, open at the front",
        "box(halfW + 40, 10, (FUNNEL_D2 + 100) / 2, 200, -10, (FUNNEL_D2 - 100) / 2, TABLE_FRICTION); box(halfW, 10, (T.FRONT - FUNNEL_D2) / 2, 200, -10, (T.FRONT + FUNNEL_D2) / 2, TABLE_FRICTION); // table top: as before beside the funnel walls, then (CP-21) ending at the open side edges")
    # Pure physics lost over half the coins off the sides (0/18 test wins), so a low invisible lip (one coin thick) runs
    # 0.9 coin radius outside each edge: a coin slides out until it hangs most of its width over the edge, while coins
    # riding on others can still tip over (about 1 in 100 lost; 18/18 test wins).
    # UAT 3 (Jenny): the first push spread the first two full-width rows and shoved their outer coins far over the edges, so
    # the side wall stays up along those two rows (to GUARD_END); the open edges with the low lip start after them.
    sub("wall(200+s*halfW,FUNNEL_D2,200+s*halfW,T.FRONT+100,s);}", "wall(200+s*halfW,FUNNEL_D2,200+s*halfW,GUARD_END,s);}/* CP-21: side wall only along the first two full-width rows, then open gutters */for(const s of [-1,1]){const x=200+s*(halfW+COIN_R*0.9),hh=2,len=T.FRONT+100-GUARD_END;world.createCollider(RAPIER.ColliderDesc.cuboid(2*M,hh*M,len/2*M).setTranslation(x*M,hh*M,(GUARD_END+len/2)*M).setFriction(0.2),fixed);} /* CP-21: low side lip */")
    sub("const FUNNEL_BACK=110, FUNNEL_D1=225, FUNNEL_D2=315;", "const FUNNEL_BACK=110, FUNNEL_D1=225, FUNNEL_D2=315, GUARD_END=FUNNEL_D2+116; // CP-21: side wall to here (two rows of 53, plus 10)")
    # Safety net (Oct 26): a coin can very rarely be squeezed down through the table by the moving ledge (about 1 in 1,000
    # taps, also in UAT 2). Anything that drops below the table well inside its edges is put back on top where it was.
    sub("function fallOff(b, x) {\n", "function fallOff(b, x) {\n {const t=b.rb.translation(),z=t.z/M;if(Math.abs(x-200)<=(T.R-T.L)/2-2&&z<T.FRONT-30){b.rb.setTranslation({x:(200+(x-200)*.6)*M,y:30*M,z:Math.max(z,PUSH_MAX+COIN_R+4)*M},true);b.rb.setLinvel({x:0,y:0,z:0},true);b.rb.setAngvel({x:0,y:0,z:0},true);return;}} // CP-21: rescue a coin squeezed through the table\n if(Math.abs(x-200)>(T.R-T.L)/2-2&&b.rb.translation().z/M<T.FRONT-4)return gutterOff(b,x); // CP-21: off a side\n")
    sub("// Lightning coin: a flash,", """// CP-21: a coin (or prize) that drops off a side edge is lost: it falls out of sight beside the table and does not pay.
function gutterOff(b,x){
 const t=b.rb.translation(),at=screenOf(t.x/M,t.z/M,t.y/M);
 const rotation={...b.rb.rotation()};falling.push({x:at.x,y:at.y,vx:(x<200?-40:40),vy:60,kind:b.kind,id:b.id,won:false,t:0,s:at.s,gutter:true,__screenStart:at,__sourceX:at.x,__sourceY:at.y,__rotation:rotation});
 removeCoin(b);
}
// Lightning coin: a flash,""")

if lock == 'on':
    # UAT 1 fix: the physical drop starts where it did before the layout lock (the old view's screen top), so coins
    # land on the moving ledge at the tested speed; the lower, slower start let about 1 in 10 fall through the ledge.
    sub("VIEW.y=chin+spare/2-CHIN_Y*VIEW.zy;VIEW.headDown=spare/2;", "VIEW.y=chin-CHIN_Y*VIEW.zy;VIEW.headDown=0; // CP-21: scene up to the HUD\n // CP-21: the physical drop starts from the pre-lock view's screen top (coins fell through the ledge from lower)\n {const f1=__top+(__front-__top)*0.65,zy=Math.max(z,Math.min((bottom-FRONT_MARGIN-chin)/(f1-CHIN_Y),330/(2*__spanFront)*z/z0)),sp=bottom-FRONT_MARGIN-(chin+(f1-CHIN_Y)*zy);VIEW.dropTop=-(chin+sp/2-CHIN_Y*zy)/zy-14;} // (camera tilt 0.65, table width 330)")
    sub("const entry=screenOf(x,depth,0),entryTop=-VIEW.y/VIEW.zy-14;", "const entry=screenOf(x,depth,0),entryTop=VIEW.dropTop??(-VIEW.y/VIEW.zy-14);")
    i = s.index('// CP-21 flatter camera.'); j = s.index('function __cachedBoardPath', i)
    assert s[i:j].count('(T.FRONT-T.BACK)') == 3
    s = s[:i] + s[i:j].replace('(T.FRONT-T.BACK)', '(640-T.BACK)') + s[j:]
    # UAT 2 fix (Jenny, Oct 26: coins always stay whole unless falling off screen or behind art): the coin matte was the
    # old picture's felt outline, which no longer matches the table, so coins were cut off on the ledge and at the sides.
    # Coins now show everywhere in front of the slot the ledge slides out of (the back wall still hides what goes under it).
    sub("q.fill(__cachedBoardPath());}", "q.fillRect(-1000,218,3000,3000);} // CP-21: coins whole everywhere in front of the slot")
    sub("const p=new Path2D(__cachedBoardPath());p.rect(198-__slotHalf,-1000", "const p=new Path2D();p.rect(-1000,218,3000,3000);p.rect(198-__slotHalf,-1000")
    # UAT 4 (Jenny): the front-edge trim was still drawn at the old (640) front, a seam across the lengthened table.
    sub("ctx.fillStyle='#18352c';ctx.fillRect(42,__front1-.5,314,3.5);ctx.fillStyle='#a16b25';ctx.fillRect(42,__front1+2,314,1);",
        "ctx.fillStyle='#18352c';ctx.fillRect(42,__NF-.5,314,3.5);ctx.fillStyle='#a16b25';ctx.fillRect(42,__NF+2,314,1); // CP-21: trim at the real front edge")
    sub("const __WARP_Y0=120,__WARP_Y1=680;",
        "const __NF=__plane(T.FRONT).py,__EXT=Math.max(0,__NF-__front1),__GXR=__plane(T.FRONT).gx/__plane(640).gx; // CP-21: longer table, rows keep their size\nconst __WARP_Y0=120,__WARP_Y1=680+__EXT;")
    sub("for(let r=0;r<c.height;r++){const yo=__WARP_Y0+(r+.5)/d,m=__camBack(yo),f=__rowFunnel(yo)",
        "for(let r=0;r<c.height;r++){const y0=__WARP_Y0+(r+.5)/d,yo=y0<=__front1-4?y0:y0<__NF-4?__front1-4-((m=>m<50?m:100-m)((y0-__front1+4)%100)):y0-__EXT,wr=y0<=__front1-4?1:y0<__NF-4?1+(__GXR-1)*(y0-__front1+4)/Math.max(1,__EXT):__GXR,m=__camBack(yo),f=__rowFunnel(yo)*wr")
    sub("ctx.rect(0,__WARP_Y0,400,__front1-__WARP_Y0);ctx.rect(0,__front1,40,__WARP_Y1-__front1);ctx.rect(358,__front1,42,__WARP_Y1-__front1);",
        "ctx.rect(0,__WARP_Y0,400,__NF-__WARP_Y0);ctx.rect(0,__NF,40,__WARP_Y1-__NF);ctx.rect(358,__NF,42,__WARP_Y1-__NF);")

(here / 'draft.html').write_text(s, encoding='utf-8')
print('draft.html built:', sys.argv[1:])
