# One-off: turns progress49.js (UAT 49) into progress50.js (UAT 50, CP-45 rework: CatCoin title screen, the coin
# board is home, buttons on the board; plain-text stars line, code-drawn paw, no font-dependent symbols).
from pathlib import Path
p = Path(__file__).parent
s = (p.parent / 'cp49/progress49.js').read_text(encoding='utf-8')
def rep(old, new, count=1):
    global s
    assert s.count(old) == count, (old[:100], s.count(old)); s = s.replace(old, new)
def cut(a, b, new):  # replaces from anchor a up to (not including) anchor b
    global s
    i = s.index(a); j = s.index(b, i); assert s.count(a) == 1; s = s[:i] + new + s[j:]

rep("// ---------- CP-45 Gameplay map prototype (UAT 49) ----------\n// The chain from GAMEPLAY_MAP.md, with placeholder art drawn in code: Home (doors, level bar, coins, Catnip, the current\n// cat) -> a cat's board",
    "// ---------- CP-45 Gameplay map prototype (UAT 49; UAT 50 rework) ----------\n// UAT 50 (Jenny, Nov 14): the game opens on a short CatCoin title screen, then the Tuxedo's coin board. The board is\n// home: no Home screen; a bar across the top of the board between rounds opens Kitchen, Porch, Album, Shop and Boards.\n// The chain from GAMEPLAY_MAP.md, with placeholder art drawn in code: the coin board (level, coins, Catnip, buttons)\n// -> a cat's board")
rep("const PGU={screen:'home',t:0,T:0,", "const PGU={screen:'title',title:{t:0,coins:[],snd:0},fade:0,warmT:0,reenter:false,oldBoards:false,t:0,T:0,")
rep(" if(PG_HOME_OFF)PGU.screen='board';\n}", " PGU.screen=PG_HOME_OFF?'board':'title';PGU.title={t:0,coins:[],snd:0};\n}")
rep("if(L===2)pgToast('Kitchen, Porch and Shop are open','#ffe08a');", "if(L===2)pgToast('Kitchen, Porch and Shop are open: buttons up top','#ffe08a');")
rep("if(L===PG_SWITCH_LEVEL)pgToast('You can switch boards now','#ffe08a');", "if(L===PG_SWITCH_LEVEL)pgToast('You can switch boards now: Boards, up top','#ffe08a');")
# back buttons and album arrows: chevrons drawn in code (no font-dependent symbols)
rep("ctx.fillText('‹ Home',b.x+b.w/2,b.y+b.h/2+1);", "pgChevron(b.x+17,b.y+b.h/2,-1,'#fff',6);ctx.fillText('Board',b.x+b.w/2+7,b.y+b.h/2+1);")
rep("ctx.fillText(k==='prev'?'‹':'›',r.x+r.w/2,r.y+r.h/2);", "pgChevron(r.x+r.w/2,r.y+r.h/2,k==='prev'?-1:1,'#fff',11);")
rep("function pgGearIcon(", "function pgChevron(x,y,d,c,s){ctx.save();ctx.strokeStyle=c;ctx.lineWidth=Math.max(3,s*.5);ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-d*s*.5,y-s);ctx.lineTo(x+d*s*.5,y);ctx.lineTo(x-d*s*.5,y+s);ctx.stroke();ctx.restore();}\n"
    "function pgPlayTri(x,y,c){ctx.save();ctx.fillStyle=c;ctx.strokeStyle='#0c3a12';ctx.lineWidth=3;ctx.lineJoin='round';ctx.beginPath();ctx.moveTo(x-9,y-12);ctx.lineTo(x+12,y);ctx.lineTo(x-9,y+12);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore();}\n"
    "function pgGearIcon(")
rep("ctx.fillText('for the '+PG_CAT[r.cat].name+(done?' · photographed ✓':''),", "ctx.fillText('for the '+PG_CAT[r.cat].name+(done?' · photographed':''),")
rep("if(Math.random()<.2)pgFloat('♪',rand(40,360),H*.6,'#ff7ad5');", "if(Math.random()<.03)pgFloat('MEOW!',rand(60,340),H*.62,'#ff7ad5');")
rep("pgToast('Someone ate the '+dn+' \U0001f43e','#ffe08a','paw');", "pgToast('Someone ate the '+dn,'#ffe08a','paw');")
rep("const PG_STAR_LINE=['pgstars','Win ★ · '+PG_STAR2+' s left ★★','and a perfect side game ★★★'];",
    "const PG_STAR_LINE=['pgstars','Win: 1 star · '+PG_STAR2+' s left: 2 stars','and a perfect side game: 3 stars'];")
# the win comes up at the next rest on the board (never over a round)
rep("pgCheckWin(){if(PG.won)return;if(PG_CATS.every(c=>PG.photos[c]>0&&PG.open[c])){PG.won=true;PGU.win={t:0};pgSfx('fanfare');",
    "pgCheckWin(){if(PG.won)return;if(PG_CATS.every(c=>PG.photos[c]>0&&PG.open[c])){PG.won=true;")

# ---- Home goes: doors, gear, MODES chip and pgDrawHome become the board's top bar and the title screen ----
DOCK = (p / 'dock57.js').read_text(encoding='utf-8')
cut("function pgDoors(){", "function pgDoorIcon(", DOCK)
cut("function pgDrawHome(dt){", "function pgPlayCat(){", (p / 'title57.js').read_text(encoding='utf-8'))
# board picker: stars and the play mark drawn in code; the board being played says so
rep("  ctx.fillText(open?C.board+(PG.stars[r.c]?'  '+'★'.repeat(PG.stars[r.c]):''):'Win its cat coin to open',r.x+100,r.y+50,r.w-150);",
    "  ctx.fillText(open?C.board:'Win its cat coin to open',r.x+100,r.y+50,r.w-150);if(open&&PG.stars[r.c]){const tw=Math.min(r.w-150,ctx.measureText(C.board).width);for(let i=0;i<PG.stars[r.c];i++)w43Star(r.x+112+tw+i*17,r.y+49,7,'#ffd23f');}")
rep("  else if(open){ctx.textAlign='center';wildText('▶',r.x+r.w-34,r.y+r.h/2,26,'#7dff6a','#0c3a12',4);}}",
    "  else if(open&&WILD.on&&r.c===PGU.boardCat){ctx.textAlign='center';ctx.font='900 13px Impact, system-ui';ctx.fillStyle='#7dff6a';ctx.fillText('PLAYING',r.x+r.w-38,r.y+r.h/2+1);}\n  else if(open)pgPlayTri(r.x+r.w-34,r.y+r.h/2,'#7dff6a');}")
rep("// --- the board picker (Home's PLAY door when more than one board is open) ---", "// --- the board picker (the Boards button on the board) ---")
rep("ctx.fillText(PG_CAT[M2.cat].board+' · play it from Home',200,y+100);",
    "ctx.fillText(PG_CAT[M2.cat].board+(PG.level>=PG_SWITCH_LEVEL?' · pick it from Boards, up top':' · it plays from the next round'),200,y+100);")

# ---- entering and leaving boards: the board is home ----
rep("const __pgExit=wildExit;wildExit=function(){PGU.moment=null;const r=__pgExit();pgRestoreArt();pgSetList(PG_DEFAULT_LIST);if(r&&!PG_HOME_OFF&&!PGU.entering){PGU.screen='home';PGU.t=0;}return r;};",
    "// Leaving a board (EXIT during a round) comes straight back to a cat's board and its next goal card, on the next frame\n"
    "// (so Developer code that leaves one board for another doesn't bounce).\n"
    "const __pgExit=wildExit;wildExit=function(){PGU.moment=null;const r=__pgExit();pgRestoreArt();pgSetList(PG_DEFAULT_LIST);if(r&&PG&&!PG_HOME_OFF&&!PGU.entering&&!PGU.oldBoards){PGU.screen='board';PGU.reenter=true;}return r;};\n"
    "function pgBoardCatNow(){return PGU.boardCat&&pgCanPlay(PGU.boardCat)?PGU.boardCat:pgPlayCat();}\n"
    "function pgReenter(){PGU.reenter=false;if(!PG||PG_HOME_OFF||PGU.oldBoards||WILD.on)return;PGU.screen='board';pgPlay(pgBoardCatNow());}\n"
    "// Switches to another cat's board (its goal card).\n"
    "function pgSwitchBoard(cat){PGU.entering=true;try{if(WILD.on)wildExit();}finally{PGU.entering=false;}PGU.pick=false;PGU.reenter=false;const ok=pgPlay(cat);if(ok)PGU.fade=.3;return ok;}")

# ---- input ----
rep("function pgGo(screen){PGU.screen=screen;", "function pgGo(screen){if(screen==='board'){PGU.screen='board';PGU.pick=false;PGU.t=0;if(!WILD.on&&!PG_HOME_OFF&&!PGU.oldBoards)pgPlay(pgBoardCatNow());try{diagEvent('progress','screen board');}catch(e){}return;}PGU.screen=screen;")
i = s.index(" if(sc==='home'){\n"); j = s.index(" if(contains(pgBack(),p)", i); s = s[:i] + s[j:]
rep("if(sc==='kitchen'&&PGU.k.cook){PGU.k.cook=null;return;}pgGo('home');return;}", "if(sc==='kitchen'&&PGU.k.cook){PGU.k.cook=null;return;}pgGo('board');return;}")
rep("let pgDevPick=false;\n", "")
rep("function pgPointerMove(e){const sc=PGU.screen;if(WILD.on||sc!=='kitchen')return false;", "function pgPointerMove(e){const sc=PGU.screen;if(sc!=='kitchen')return false;")
rep("function pgPointerUp(e){const sc=PGU.screen;if(WILD.on)return false;", "function pgPointerUp(e){const sc=PGU.screen;if(sc==='board'||sc==='title')return false;")
rep(" if(!PG_HOME_OFF&&PG&&!WILD.on&&PGU.screen!=='board'){if(PGU.door)return true;pgPointerDown(e,p);return true;}\n"
    " if(!PG_HOME_OFF&&PG&&!WILD.on&&PGU.screen==='board'&&pgDevPick&&MODES_UI.open){const R=modesPickerRects();if(!R.rows.some(r=>contains(r,p))){MODES_UI.open=false;pgDevPick=false;PGU.screen='home';return true;}pgDevPick=false;}\n",
    " if(!PG_HOME_OFF&&PG){if(PGU.screen==='title'){pgTitleSkip();return true;}\n"
    "  if(PGU.screen!=='board'){if(PGU.door)return true;pgPointerDown(e,p);return true;}\n"
    "  if(pgBoardPointer(p))return true;}\n")
rep("const __pgPointer=wildPointer;",
    "// Taps on the board: the YOU WON card, the board picker, and between rounds the top bar and the end card's New goal.\n"
    "function pgBoardPointer(p){\n"
    " if(PGU.win){if(PGU.win.t>1.5)PGU.win=null;return true;}\n"
    " if(PGU.pick){const R=pgPickRects();for(const r of R.rows)if(contains(r,p)){if(WILD.on&&r.c===PGU.boardCat){PGU.pick=false;pgSfx('back');}else if(pgCanPlay(r.c)){pgSfx('door');pgSwitchBoard(r.c);}else{pgSfx('lock');pgToast(PG.open[r.c]?'Switching boards opens at level '+PG_SWITCH_LEVEL:'Win its cat coin to open this board','#ffe08a');}return true;}PGU.pick=false;pgSfx('back');return true;}\n"
    " if(PGU.door)return true;if(!pgRestPhase())return false;\n"
    " if(WILD.phase==='end'){const R=wildEndRects();if(contains(R.back,p)||(contains(R.again,p)&&!pgCanPlay(PGU.boardCat))){pgSfx('tap');if(!pgCanPlay(PGU.boardCat))pgSwitchBoard(pgPlayCat());else wildReset();return true;}}\n"
    " const D=pgDock();if(p.y>D.bottom)return false; // below the bar: the card's own taps\n"
    " if(contains(D.gear,p)){openCredits();return true;}\n"
    " for(const t of D.tiles){if(!contains(t,p))continue;if(t.level&&PG.level<t.level){pgSfx('lock');pgToast(pgDockName(t.id)+' opens at level '+t.level,'#ffe08a');return true;}pgSfx('door');PGU.door={id:t.id,t:0};return true;}\n"
    " return true;} // the bar swallows the rest of its taps\n"
    "function pgBackText(){return PG_HOME_OFF||!PG?'Back to the game':'New goal';}\n"
    "const __pgPointer=wildPointer;")

# ---- the frame ----
rep("// ---------- the frame: Home screens replace the board (no physics while they show) ----------\nconst __pgStep=step;step=function(){if(!PG_HOME_OFF&&PG&&!WILD.on&&PGU.screen!=='board')return;return __pgStep();};",
    "// ---------- the frame: the title and the Kitchen, Porch, Album and Shop replace the board (no physics while they show) ----------\nconst __pgStep=step;step=function(){if(!PG_HOME_OFF&&PG&&PGU.screen!=='board')return;return __pgStep();};")
rep(" if(PGU.door){PGU.door.t+=dt;if(PGU.door.t>=.32){const id=PGU.door.id;PGU.door=null;if(id==='board'){const n=PG_CATS.filter(c=>PG.open[c]).length;if(n>1){PGU.pick=true;PGU.pickT=0;}else pgPlay(pgPlayCat());}else pgGo(id);}}",
    " if(!PG_HOME_OFF&&PGU.screen==='title')pgTitleTick(dt);if(PGU.reenter)pgReenter();if(PGU.fade>0)PGU.fade=Math.max(0,PGU.fade-dt);\n"
    " if(PGU.door){PGU.door.t+=dt;if(PGU.door.t>=.24){const id=PGU.door.id;PGU.door=null;if(id==='board'){PGU.pick=true;PGU.pickT=0;}else pgGo(id);}}")
rep(" if(PGU.win)PGU.win.t+=dt;else if(PG.won&&!PG.wonShown&&!WILD.on){PG.wonShown=true;PGU.win={t:0};pgSfx('fanfare');pgSave();}\n if(!WILD.on&&PGU.screen==='home'&&!PGU.door)pgWarm();};",
    " if(PGU.win)PGU.win.t+=dt;else if(PG.won&&!PG.wonShown&&!PG_HOME_OFF&&((PGU.screen!=='board'&&PGU.screen!=='title')||pgRestPhase())){PG.wonShown=true;PGU.win={t:0};pgSfx('fanfare');pgSave();}\n"
    " // the cats' recoloured copies are made one picture at a time, between rounds and on the other screens\n"
    " PGU.warmT-=dt;if(PGU.warmT<=0&&!PGU.door&&((PGU.screen!=='board'&&PGU.screen!=='title')||pgRestPhase())){PGU.warmT=.25;pgWarm();}};")
rep("draw=function(){\n if(PG_HOME_OFF||!PG||WILD.on||PGU.screen==='board'){__pgDraw();if(PG&&!PG_HOME_OFF&&WILD.on)pgBoardOverlay();if(PG&&!PG_HOME_OFF&&WILD.on===false&&PGU.screen==='board')pgToastsDraw();return;}\n"
    " ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';const dt=Math.min(.05,PGU.lastDraw!=null?(performance.now()-PGU.lastDraw)/1000:.016);PGU.lastDraw=performance.now();\n"
    " try{({home:pgDrawHome,kitchen:pgDrawKitchen,porch:pgDrawPorch,album:pgDrawAlbum,shop:pgDrawShop}[PGU.screen]||pgDrawHome)(dt);}catch(e){try{frameError(e);}catch(_){}}\n"
    " pgFloatsDraw();pgToastsDraw();pgLevelDraw();pgWinDraw();\n",
    "function pgDrawDt(){const n=performance.now(),dt=Math.min(.05,PGU.lastDraw!=null?(n-PGU.lastDraw)/1000:.016);PGU.lastDraw=n;return Math.max(0,dt);}\n"
    "draw=function(){\n if(PG_HOME_OFF||!PG){__pgDraw();return;}\n if(PGU.reenter)pgReenter();\n"
    " if(PGU.screen==='board'){__pgDraw();pgBoardOverlay();return;}\n"
    " ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';const dt=pgDrawDt();\n"
    " try{({title:pgDrawTitle,kitchen:pgDrawKitchen,porch:pgDrawPorch,album:pgDrawAlbum,shop:pgDrawShop}[PGU.screen]||pgDrawTitle)(dt);}catch(e){try{frameError(e);}catch(_){}}\n"
    " if(PGU.screen!=='title'){pgFloatsDraw();pgToastsDraw();pgLevelDraw();pgWinDraw();}\n")
# messages: on the goal card they sit in the card's free bottom slot (never over the title); a paw drawn in code
rep("function pgToastsDraw(){const T3=PGU.toasts[0];if(!T3)return;const onBoard=WILD.on||PGU.screen==='board',y=onBoard?(typeof w43ChinY==='function'?w43ChinY():300)+34:PGU.screen==='home'?pgDoors().board.y-26:PGU.screen==='porch'?pgTop()+104:pgBot()-56,a=Math.min(1,T3.t/.2,(T3.dur-T3.t)/.3);",
    "function pgToastsDraw(){const T3=PGU.toasts[0];if(!T3)return;const onBoard=PGU.screen==='board',card=onBoard&&WILD.on&&WILD.v2&&WILD.phase==='card'&&!inventoryOpen,L=card?w2CardLayout():null,\n"
    " y=card?L.back.y+L.back.h/2:onBoard?(typeof w43ChinY==='function'?w43ChinY():300)+34:PGU.screen==='porch'?pgTop()+104:pgBot()-56,a=Math.min(1,T3.t/.2,(T3.dur-T3.t)/.3);")
rep("ctx.font='bold 16px system-ui';const w=Math.min(380,ctx.measureText(T3.text).width+40);\n uiRound(200-w/2,y-17,w,34,17,'rgba(20,10,30,.88)',T3.color,2);ctx.fillStyle=T3.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(T3.text,200,y+1,w-20);ctx.restore();}",
    "ctx.font='bold 16px system-ui';const ic=T3.icon==='paw'?26:0,w=Math.min(380,ctx.measureText(T3.text).width+40+ic);\n uiRound(200-w/2,y-17,w,34,17,'rgba(20,10,30,.88)',T3.color,2);ctx.fillStyle=T3.color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(T3.text,200-ic/2,y+1,w-20-ic);\n if(ic)pgPaw(200+w/2-24,y+1,.3,T3.color);ctx.restore();}")
rep("function pgLevelDraw(){const L=PGU.level;if(!L||WILD.on)return;", "function pgLevelDraw(){const L=PGU.level;if(!L||PGU.screen==='board')return;")
# board overlay: the top bar between rounds, the picker, YOU WON and the fade in from the title
rep(" ctx.restore();pgToastsDraw();}\n// Music on Home, Kitchen, Album and Shop; the Porch has garden sounds instead.",
    " if(WILD.on&&pgRestPhase())pgDrawDock();\n ctx.restore();pgToastsDraw();\n"
    " const dt=pgDrawDt();ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';\n"
    " if(PGU.pick)pgDrawBoardPick(dt);pgWinDraw();if(PGU.fade>0){ctx.fillStyle='rgba(10,4,20,'+Math.min(1,PGU.fade/.3)+')';ctx.fillRect(0,0,W,H);}ctx.restore();}\n"
    "// Music on the Kitchen, Album and Shop; the Porch has garden sounds; the title screen its own jingle.")
rep("function pgBoardOverlay(){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);\n const cat=",
    "function pgBoardOverlay(){ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);if(!WILD.on){ctx.restore();pgToastsDraw();return;}\n const cat=")
rep("const __pgBgm=bgmWanted;bgmWanted=function(){if(!PG_HOME_OFF&&PG&&!WILD.on&&PGU.screen!=='board'){if(S.muted||!(W2.music>0)||document.hidden||(typeof inBackground!=='undefined'&&inBackground))return false;return PGU.screen!=='porch';}return __pgBgm();};",
    "const __pgBgm=bgmWanted;bgmWanted=function(){if(!PG_HOME_OFF&&PG&&PGU.screen!=='board'){if(S.muted||!(W2.music>0)||document.hidden||(typeof inBackground!=='undefined'&&inBackground))return false;return PGU.screen!=='porch'&&PGU.screen!=='title';}return __pgBgm();};")
rep("function pgDrawBoardPick(dt){PGU.pickT+=dt;", "function pgDrawBoardPick(dt){")
rep(" if(PGU.moment){PGU.moment.t+=dt;", " if(PGU.pick)PGU.pickT+=dt;\n if(PGU.moment){PGU.moment.t+=dt;")
# ---- Developer ----
rep("mb('home-off','Old boards 1–3 (leave Home)')", "mb('home-off','Old boards 1–3 (leave the cat boards)')")
rep("on('pg-reset',()=>{PG=pgFresh();PGU.toasts=[];PGU.screen=WILD.on?'board':'home';pgToast('Progression reset','#fff');});",
    "on('pg-reset',()=>{PG=pgFresh();PGU.toasts=[];PGU.pick=false;PGU.screen='board';if(WILD.on&&PGU.boardCat!=='tuxedo')pgSwitchBoard('tuxedo');pgToast('Progression reset','#fff');});")
rep("  if(id==='home-off'){if(WILD.on)wildExit();PGU.screen='board';return;}if(WILD.on)wildExit();if(id==='wild2'){PGU.boardCat='tuxedo';if(wild2Enter())pgApplyArt('tuxedo');}else wildModeEnter(id);};};",
    "  if(id==='home-off'){PGU.oldBoards=true;if(WILD.on)wildExit();PGU.screen='board';return;}PGU.oldBoards=false;PGU.entering=true;try{if(WILD.on)wildExit();}finally{PGU.entering=false;}PGU.screen='board';if(id==='wild2'){PGU.boardCat='tuxedo';if(wild2Enter())pgApplyArt('tuxedo');}else wildModeEnter(id);};};")
rep("// Test hook: the UAT 47/48 suites start on the old board (no Home).", "// Test hook: the UAT 47/48 suites start on the old board (no title, no cat boards).")
leftover = [w for w in ['pgDoors', 'pgGear(', 'pgModesChip', "'home'", 'pgDrawHome', 'pgDevPick', '\U0001f43e', '★', '▶', '✓', '♪', '♥', '♛', '‹', '›'] if w in s]
assert not leftover, leftover
exec((p / 'extra52.py').read_text(encoding='utf-8'))
exec((p / 'extra53.py').read_text(encoding='utf-8'))
exec((p / 'extra55.py').read_text(encoding='utf-8'))
exec((p / 'extra56.py').read_text(encoding='utf-8'))
(p / 'progress57.js').write_text(s, encoding='utf-8'); print('progress57.js', len(s))
