
// ---------- CP-102 Developer tidy-up (Jenny, Nov 19: proposal approved, "1 remove +1,000 coins (the jar is gone), keep the
// prize gift; 2 Start Dance break now at the top of Developer"; Nov 20: "Developer: a start-now button for every side game and
// power, broken Treat toss button removed. CP-102 in 132: yes.") UAT Developer panel only (production has no Developer panel).
// 1. The panel, rearranged from its own buttons (every element ID and saved setting kept; removed buttons are hidden, their
//    code stays): Developer = Endless board, Start now (Dance break first, then one button per side game and per power, the
//    wheel, Jackpot, Cat visits), Basics. Engineer tools = Give, Dance and music, Start a board round, Previews, Boards and
//    tuning, Logs, Reset.
// 2. Start now: each button starts that side game or power at once on the board in play (the endless board included; from
//    Home, the current cat's board), with no coin or power needed and nothing taken from the player's own stock. If another
//    side game or power is running it starts as soon as that one ends.
// 3. Start Dance break now: the current cat's board and its own dance; a cat with no dance yet gets a short note instead.
// 4. Developer only: a "Music A B C" row under the Dance break lane for a cat with a music choice (Orange, Ragdoll). A tap
//    switches the music from the next beat and saves it (the same choice as in Engineer tools); it is never a dance tap.
const CP102={want:null,log:[],
 GAMES:[{id:'toss',name:'Treat toss',pend:'tossPending',run:'toss'},{id:'chase',name:'Laser chase',pend:'chasePending',run:'chase'},
  {id:'pet',name:'Pet the cat',pend:'petPending',run:'petGame'},{id:'pounce',name:'Mouse pounce',pend:'pouncePending',run:'pounce'}],
 POWERS:['tuxedo','orange','ragdoll','siamese','tortie'],
 CAT:{tuxedo:'Tuxedo',orange:'Orange',ragdoll:'Ragdoll',siamese:'Siamese',tortie:'Tortie'}};
function cp102Note(t){try{callout(t,{color:'#ffd23f',dur:1.6});}catch(e){}}
function cp102Busy(){return !!(pgpSideGame()||PGPX||sweepTime>0||catquakeTime>0||WILD.dancePending||WILD.tossPending||WILD.chasePending||WILD.petPending||WILD.pouncePending);}
// the board in play stays (the endless board included); from Home or anywhere else, the current cat's own board
function cp102Board(){if(!PG)pgInit();
 if(!(WILD.on&&PGU.screen==='board')){const cat=PG.current&&PG.open[PG.current]?PG.current:'tuxedo';if(!PG.open[cat])PG.open[cat]=1;pgSwitchBoard(cat);}
 if(WILD.phase==='card'||WILD.phase==='end'){if(WILD.phase==='end')wildReset();PGU.screen='board';wildStartCountdown();}}
function cp102Start(kind,id){panel.style.display='none';cp102Board();
 if(kind==='dance'&&!wildFeature('dance')){cp102Note('No dance for this cat yet');return;}
 CP102.want={kind,id,t:time};try{diagEvent('cp102','start-now '+kind+' '+id+' board='+(PGU.boardCat||'')+(typeof endActive==='function'&&endActive()?' endless':''));}catch(e){}}
// fires once the round is in play and nothing else is running (no coin used; the player's power stock is unchanged)
function cp102Fire(){const W0=CP102.want;if(!W0||!WILD.on||WILD.phase!=='play'||board.status!=='playing'||(WILD.goT||0)<.8||cp102Busy())return;
 CP102.want=null;
 if(W0.kind==='dance'){WILD.dancePending={f:null,wait:9};}
 else if(W0.kind==='game'){const G=CP102.GAMES.find(g=>g.id===W0.id);if(G)WILD[G.pend]={f:null,wait:9};}
 else if(W0.kind==='power'){const cat=W0.id;if(!PG.powers)PG.powers={};PG.powers[cat]=pgpCount(cat)+1;const own=pgpCat;pgpCat=()=>cat;try{pgpUse();}finally{pgpCat=own;}}
 CP102.log.push({kind:W0.kind,id:W0.id,board:PGU.boardCat,endless:typeof endActive==='function'&&endActive()});}
const __cp102Update=update;update=function(dt){__cp102Update(dt);try{if(CP102.want)cp102Fire();}catch(e){CP102.err=String(e);CP102.want=null;}};
// 3. Start Dance break now: the current cat's board and dance (not the generic Wild board)
danceStartNow=function(){cp102Start('dance','');};

// 4. the music row (Developer only): cats with a music choice
function cp102Music(){const D=WILD.on&&WILD.dance;if(!S.dev||!D||D.phase==='finale')return null;
 if(D.ragdoll&&typeof CP101!=='undefined')return {D,M:CP101};if(D.orange&&typeof CP94!=='undefined')return {D,M:CP94};return null;}
function cp102MusicRects(){const Y=DANCE_LANE_Y+60;return ['A','B','C'].map((k,i)=>({k,x:150+i*50,y:Y-13,w:42,h:26}));}
const __cp102DanceDraw=danceDraw;danceDraw=function(){const r=__cp102DanceDraw.apply(this,arguments);const m=cp102Music();if(!m)return r;
 ctx.save();ctx.setTransform(scale*renderPixelRatio,0,0,scale*renderPixelRatio,0,0);ctx.textAlign='center';ctx.textBaseline='middle';
 const R=cp102MusicRects(),Y=R[0].y+13;uiRound(76,Y-17,248,34,17,'rgba(26,10,44,.78)','#ff9ad8',1.5);
 ctx.font='bold 12px system-ui';ctx.fillStyle='#ffe0f4';ctx.fillText('Music',112,Y);
 for(const b of R){const on=m.D.music===b.k;uiRound(b.x,b.y,b.w,b.h,13,on?'#ff7ad5':'rgba(255,255,255,.12)',on?'#ffffff':'rgba(255,255,255,.4)',1.2);
  ctx.font='bold 14px system-ui';ctx.fillStyle=on?'#2a0b3e':'#ffffff';ctx.fillText(b.k,b.x+b.w/2,Y+1);}
 ctx.restore();return r;};
const __cp102Pointer=wildPointer;wildPointer=function(e,p){const m=cp102Music();
 if(m&&WILD.phase==='play'){const b=cp102MusicRects().find(b=>p.x>=b.x-4&&p.x<=b.x+b.w+4&&p.y>=b.y-6&&p.y<=b.y+b.h+6);
  if(b){if(m.D.music!==b.k){m.D.music=b.k;m.M.set(b.k);}return true;} // a music tap, never a dance tap
  if(p.x>=72&&p.x<=328&&p.y>=cp102MusicRects()[0].y-8&&p.y<=cp102MusicRects()[0].y+34)return true;} // the row's own pill: no dance tap either
 return __cp102Pointer.apply(this,arguments);};

// 1. the panel
const __cp102Credits=openCredits;
openCredits=function(){const r=__cp102Credits.apply(this,arguments);try{if(S.dev)cp102Panel();}catch(e){CP102.panelErr=String(e&&e.stack||e);}return r;};
function cp102Panel(){const P=panel,$=s=>P.querySelector(s),$$=s=>Array.from(P.querySelectorAll(s)),main=$('#cp70-main'),eng=$('#cp70-engineer');if(!main||!eng||$('#cp102-start'))return;
 const hide=n=>{if(n)n.style.display='none';};
 const h=t=>{const e=document.createElement('h3');e.textContent=t;return e;};
 const box=(id,title,nodes)=>{const d=document.createElement('div');d.id='cp102-'+id;d.style.margin='0 0 10px';if(title)d.appendChild(h(title));for(const n of nodes)if(n)d.appendChild(n);return d;};
 const btn=(id,t,f)=>{const b=document.createElement('button');b.id=id;b.className='wide';b.textContent=t;b.style.cssText='width:100%;margin:0;padding-left:6px;padding-right:6px;font-size:15px';b.onclick=f;return b;};
 const grid=bs=>{const d=document.createElement('div');d.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 10px';for(const x of bs)d.appendChild(x);return d;};
 // removed: the level buttons, Give all cats / cat coins, +1,000 coins, the duplicates, the old per-game start buttons (the
 // Treat toss one switched to the Orange's board instead of starting a game)
 for(const s of ['#pgl-all','#pgl-pass','#pgt-reset','#pgt-cats','#pg-coins','#pgl-reset','#pgt-pounce','#pgt-title','#pgt-tc','#pgp-give','#pgp-pounce','#toss-now','#laser-now','#pet-now'])hide($(s));
 for(const b of $$('button'))if(/^\+1,000 coins$/.test(b.textContent.trim()))hide(b);
 for(const b of $$('button'))if(b.textContent.trim()==='−'||b.textContent.trim()==='+'){const row=b.parentElement;if(row&&/Start on level/.test(row.textContent))hide(row);}
 for(const hh of $$('h3'))if(/^Levels/.test(hh.textContent)||/^Powers \(CP-47\)/.test(hh.textContent)||/^Give$/.test(hh.textContent))hide(hh);
 const w2=$('#w2-dev');if(w2)for(const b of w2.querySelectorAll('[data-slice]'))hide(b);
 const pgt=$('#pgt');if(pgt)for(const d of pgt.querySelectorAll('div'))if(/Title coins/.test(d.textContent))hide(d);
 // Developer, top to bottom
 const title=main.querySelector('h3'),endless=$('#cp92-endless'),dance=$('#dance-now');if(dance)dance.textContent='Start Dance break now';
 const basics=['#devmode','#sound-test','#checkupd','#diag-send-file'].map(s=>$(s)).filter(Boolean);
 const wheel=[$('#w2-spin'),...Array.from(main.querySelectorAll('[data-slice]')),$('#cp64-now'),$('#pg-visit')].filter(Boolean);
 const give=[$('#pgt-powers'),$('#pg-give')].filter(Boolean);if(give[0])give[0].textContent='Give powers (3 each)';
 const reset=$('#pg-reset');
 const games=CP102.GAMES.map(g=>btn('cp102-game-'+g.id,g.name,()=>cp102Start('game',g.id)));
 const powers=CP102.POWERS.map(c=>btn('cp102-power-'+c,PGP[c].name.charAt(0)+PGP[c].name.slice(1).toLowerCase()+' ('+CP102.CAT[c]+')',()=>cp102Start('power',c)));
 const note=document.createElement('p');note.style.cssText='margin:2px 0 8px;font-size:13px;opacity:.8';note.textContent='On the board you are on (Endless too); no coin or power used.';
 const was=Array.from(main.children);main.innerHTML='';if(title)main.appendChild(title);
 if(endless){const eh=endless.querySelector('h3');if(eh)eh.textContent='Endless board';main.appendChild(endless);}
 const sg=h('Side games'),pw=h('Powers');sg.style.fontSize=pw.style.fontSize='14px';
 main.appendChild(box('start','Start now',[dance,sg,grid(games),pw,grid(powers),note,...wheel]));
 main.appendChild(box('basics','Basics',basics));
 // Engineer tools, grouped
 const sum=eng.querySelector('summary'),rest=Array.from(eng.children).filter(n=>n!==sum),pick=s=>$(s);
 const groups=[['Give',give],
  ['Dance and music',[pick('#cp101-music'),pick('#cp94-music'),pick('#cp79-yawn'),pick('#dance-dev')]],
  ['Start a board round',[pick('#tw-start'),pick('#paw40-tip'),pick('#w2-visitor')]],
  ['Previews',[pick('#happy-test'),pick('#dance-test'),pick('#pg-title'),pick('#pg-dhint'),pick('#safe-guides'),pick('#tap-areas')]],
  ['Boards and tuning',[pick('#pg-dev'),pick('#wild-dev'),pick('#w2-dev'),pick('#toss-dev'),pick('#laser-dev'),pick('#pet-dev'),pick('#paw40-dev'),pick('#tw-dev'),pick('#cp83-tower'),pick('#cp83-timing'),pick('#pfx')]],
  ['Logs',[pick('#diag-link-file'),pick('#diag-share-file'),pick('#diag-file-status')]],
  ['Reset',[pick('#empty-purse'),reset]]];
 for(const n of rest)n.remove();
 for(const [t,nodes] of groups)eng.appendChild(box(t.toLowerCase().replace(/ /g,'-'),t,nodes.filter(Boolean)));
 for(const n of rest)if(!n.isConnected){hide(n);eng.appendChild(n);} // what is left (the old "Test this build" box) stays folded away
 for(const n of was)if(!n.isConnected){hide(n);main.appendChild(n);} // removed buttons stay in the page, hidden (IDs kept)
}
// ---------- end CP-102 ----------
