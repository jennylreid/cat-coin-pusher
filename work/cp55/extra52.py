# UAT 51 additions, applied by patch51.py after UAT 50's changes (exec'd with patch51's rep()).
# Taps on the board: MODES picker first; between rounds Collections, Inventory, MODES; during a round the top gear.
rep(" if(PGU.door)return true;if(!pgRestPhase())return false;\n",
    " if(PGU.modes){pgModesTap(p);return true;}\n"
    " if(PGU.door)return true;\n"
    " if(WILD.on&&!inventoryOpen&&!pgRestPhase()&&contains(pgPlayGear(),p)){openCredits();return true;}\n"
    " if(!pgRestPhase())return false;\n")
rep(" if(contains(D.gear,p)){openCredits();return true;}\n",
    " if(contains(D.gear,p)){openCredits();return true;}\n"
    " if(contains(D.coll,p)){pgSfx('tap');openLoopScreen('water');return true;}\n"
    " if(contains(D.inv,p)){pgSfx('tap');openLoopScreen('inventory');return true;}\n"
    " if(D.modes&&contains(D.modes,p)){pgSfx('tap');PGU.modes=true;PGU.modesT=0;return true;}\n")
# drawing on the board: the top gear during a round, the MODES picker
rep(" if(WILD.on&&pgRestPhase())pgDrawDock();\n",
    " if(WILD.on&&pgRestPhase())pgDrawDock();else if(WILD.on&&!inventoryOpen)pgDrawPlayGear();\n")
rep(" if(PGU.pick)pgDrawBoardPick(dt);pgWinDraw();",
    " if(PGU.pick)pgDrawBoardPick(dt);ctx.restore();pgDrawModes();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';pgWinDraw();")
# Developer is on by default in UAT (Jenny, Nov 14: "start UAT with dev mode on by default"): set once on this
# device, then her own choice is kept. Production builds (no "UAT" in the build name) never do this.
rep(" PGU.screen=PG_HOME_OFF?'board':'title';PGU.title={t:0,coins:[],snd:0};\n}",
    " PGU.screen=PG_HOME_OFF?'board':'title';PGU.title={t:0,coins:[],snd:0};\n"
    " try{if(/UAT/.test(BUILD)&&!localStorage.getItem(PG_DEVON_KEY)){S.dev=true;save();localStorage.setItem(PG_DEVON_KEY,'1');try{diagEvent('progress','developer on by default (UAT)');}catch(e){}}}catch(e){}\n}")
rep("const PG_KEY='catpusher.uat.progress.v1',PG_DEV_KEY='catpusher.uat.progressdev.v1';",
    "const PG_KEY='catpusher.uat.progress.v1',PG_DEV_KEY='catpusher.uat.progressdev.v1',PG_DEVON_KEY='catpusher.uat.devdefault.v1';")
rep("const PGU={screen:'title',", "const PGU={modes:false,modesT:0,sc:{at:-9,kind:null,hearts:[]},screen:'title',")
# ---- the floating cat head (UAT 49's Home cat) at the top of the Kitchen, Porch, Album and Shop: the current board's
# cat breathes, blinks and looks around; it reacts there (happy at the DING, perks up at a visit or the camera, purrs at
# an album stamp, nods at a sale); a tap gets the sweet face, hearts, a meow and a purr. The header's title and counters
# sit on the left, the cat on the right, clear of the controls.
rep("function pgHeader(title,color){const y0=pgTop(),b=pgBack();ctx.fillStyle='rgba(18,11,28,.85)';ctx.fillRect(0,0,W,y0+70);",
    "function pgScreenCatRect(){const y0=pgTop();return {x:262,y:y0+4,w:128,h:80};}\n"
    "function pgScreenReact(kind){PGU.sc.at=PGU.T;PGU.sc.kind=kind;if(kind==='tap'||kind==='happy'||kind==='purr'){const r=pgScreenCatRect();for(let i=0;i<(kind==='purr'?3:5);i++)PGU.sc.hearts.push({x:r.x+r.w/2+rand(-36,36),y:r.y+30,t:-i*.08});}}\n"
    "function pgHeart(x,y,s,c){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle=c;ctx.beginPath();ctx.moveTo(0,6);ctx.bezierCurveTo(-12,-2,-7,-12,0,-5);ctx.bezierCurveTo(7,-12,12,-2,0,6);ctx.fill();ctx.restore();}\n"
    "function pgScreenCat(dt){const r=pgScreenCatRect(),t=PGU.T,S2=PGU.sc,el=t-S2.at,k=S2.kind,cat=PGU.boardCat||PG.current||'tuxedo';\n"
    " let dy=0,rot=0,face='calm',sc2=1;const live=el<1.6;\n"
    " if(live){if(k==='tap'||k==='happy'){face='sweet';dy=-Math.abs(Math.sin(el*9))*9*(1-el/1.6);}else if(k==='perk'){face='sweet';dy=-14*Math.max(0,1-el*2.2);sc2=1+.08*Math.max(0,1-el*2);}\n"
    "  else if(k==='purr'){face='sweet';rot=Math.sin(el*24)*.035;}else if(k==='nod'){dy=el<.9?Math.abs(Math.sin(el*Math.PI*2/.45))*6:0;face=el>.3?'sweet':'calm';}}\n"
    " const breathe=Math.sin(t*1.6)*2,cx=r.x+r.w/2,cy=r.y+r.h/2+2;ctx.save();ctx.translate(cx,cy+dy+breathe*.5);ctx.rotate(rot);ctx.scale(sc2*(1+breathe*.004),sc2*(1-breathe*.004));\n"
    " pgHead(cat,0,0,r.w,face,{look:Math.sin(t*.5)*.8,lookY:Math.sin(t*.37),blink:((t+.3)%5.3)<.13?1:0});ctx.restore();\n"
    " for(let i=S2.hearts.length-1;i>=0;i--){const h=S2.hearts[i];h.t+=dt;if(h.t>1.3){S2.hearts.splice(i,1);continue;}if(h.t<0)continue;ctx.save();ctx.globalAlpha=Math.max(0,1-h.t/1.3);pgHeart(h.x+Math.sin(h.t*5)*7,h.y-h.t*50,.9,'#ff6ab8');ctx.restore();}}\n"
    "function pgHeader(title,color){const y0=pgTop(),b=pgBack();ctx.fillStyle='rgba(18,11,28,.85)';ctx.fillRect(0,0,W,y0+86);")
rep(" wildText(title,236,y0+45,30,color||'#ffd23f','#2a0b3e',6);pgCounters(y0+16);}",
    " ctx.save();ctx.textAlign='left';ctx.font='italic 900 28px Impact, \"Arial Black\", system-ui';const tz=Math.min(28,28*146/Math.max(1,ctx.measureText(title).width));wildText(title,108,y0+38,tz,color||'#ffd23f','#2a0b3e',6);ctx.restore();\n"
    " pgCounters(y0+76);pgScreenCat(PGU.hdt||.016);}")
rep("function pgCounters(y){ctx.save();ctx.textBaseline='middle';ctx.textAlign='right';ctx.font='bold 13px system-ui';\n const c=PG.coins,n=PG.catnip;ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins',W-14,y);ctx.fillStyle='#8dff9a';ctx.fillText(n+' Catnip',W-14-ctx.measureText(c+' coins').width-14,y);ctx.restore();}",
    "function pgCounters(y){ctx.save();ctx.textBaseline='middle';ctx.textAlign='left';ctx.font='bold 13px system-ui';\n const c=PG.coins,n=PG.catnip;ctx.fillStyle='#ffd76a';ctx.fillText(c+' coins',16,y);ctx.fillStyle='#8dff9a';ctx.fillText(n+' Catnip',16+ctx.measureText(c+' coins').width+14,y);ctx.restore();}")
# the screens' frame time for the hearts
rep(" try{({title:pgDrawTitle,", " PGU.hdt=dt;try{({title:pgDrawTitle,")
# taps on the cat
rep("function pgPointerDown(e,p){\n const sc=PGU.screen;if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return;}\n",
    "function pgPointerDown(e,p){\n const sc=PGU.screen;if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return;}\n"
    " if(['kitchen','porch','album','shop'].includes(sc)&&contains(pgScreenCatRect(),p)){pgScreenReact('tap');pgSfx('meow');pgSfx('purr',.7);return;}\n")
s += '''
// The screen cat reacts to what happens on its screen.
const __pgFinishCook=pgFinishCook;pgFinishCook=function(){const r=__pgFinishCook();pgScreenReact('happy');pgSfx('meow',.8);return r;};
const __pgPhotoR=pgPhoto;pgPhoto=function(i){const n=PG.porch[i]&&PG.porch[i].state;const r=__pgPhotoR(i);if(n==='visit')pgScreenReact('perk');return r;};
const __pgPorchTickR=pgPorchTick;pgPorchTick=function(){const v=PG?PG.porch.filter(s=>s&&s.state==='visit').length:0;const r=__pgPorchTickR();if(PG&&PGU.screen==='porch'&&PG.porch.filter(s=>s&&s.state==='visit').length>v){pgScreenReact('perk');pgSfx('meow',.7);}return r;};
const __pgStampsR=pgCheckStamps;pgCheckStamps=function(){const n=PG?PG.catnip:0;const r=__pgStampsR();if(PG&&PG.catnip>n){pgScreenReact('purr');pgSfx('purr',.9);}return r;};
const __pgShopTapR=pgShopTap;pgShopTap=function(r){const c=PG.coins;const out=__pgShopTapR(r);if(PG.coins>c)pgScreenReact('nod');return out;};
'''
# Album messages sit above the page arrows
rep(":PGU.screen==='porch'?pgTop()+104:pgBot()-56,a=Math.min(1,T3.t/.2,(T3.dur-T3.t)/.3);", ":PGU.screen==='porch'?pgTop()+104:PGU.screen==='album'?pgBot()-112:pgBot()-56,a=Math.min(1,T3.t/.2,(T3.dur-T3.t)/.3);")
