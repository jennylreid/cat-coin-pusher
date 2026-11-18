# CP-54 phase A: builds coin-landing-listen.html (sounds embedded so it opens from disk). Run: python make-page.py
import base64,json,pathlib
d=pathlib.Path(__file__).parent;S=d/'sounds'
C=[
 dict(id='A',files=['A1','A2','A3'],title='A. A coin onto a pile of change: lower and chunkier',
      what='A single coin dropped onto coins: a dull clack and a short clatter of the coins around it. Three takes in rotation.',
      src='voicebosch-single-coin-170397.mp3 (in the project folder), cut at 19.09 s, 23.98 s and 12.97 s'),
 dict(id='B',files=['B1','B2','B3'],title='B. A little pour of change',
      what='Busier: like a few coins landing in a heap at once. Slices of the coin-spill recording, three in rotation.',
      src='freesound_community-coin-spill-105867.mp3 (in the project folder; also the game\'s coin-spill.mp3), cut at 1.66 s, 2.39 s and 0.90 s'),
 dict(id='C',files=['C1','C2','C3'],title='C. A coin onto change: brighter rattle',
      what='A single coin with a higher, lighter rattle as it settles among other coins. Three takes in rotation.',
      src='voicebosch-single-coin-170397.mp3, cut at 3.71 s, 9.92 s and 5.63 s'),
 dict(id='E',uat59=True,title='E. Before Nov 14: the recording every time',
      what='Every landing plays the recorded coin landing, exactly as UAT 59 and the Oct 31 production build played it: the same file, volume 0.25, cut at 0.84 s, no pitch change, 0.09 s gap, at most 3 at once. Not level-matched: this is its real level, about 13 dB above the code-made drops. Its title pile-up is the same steel clink as today; the title has played that since it was added.',
      src='coin-land.mp3 = dragon-studio-dropping-a-coin-478359.mp3 (project folder), the same file in UAT 59 and UAT 70 (MD5 checked)'),
 dict(id='F',files=['A1','A2','A3'],pour=['P1','P2','P3','P4'],title='F. A, with a soft pour underneath',
      what='Each landing is one of A’s coin-on-pile takes with a short, quieter slice of the coin pour (B’s recording) under it, starting just after the strike, so the pile seems to shift and rustle. The take and the pour slice both change each time; the pour lasts 0.2 s so fast taps stay clear. Matched in loudness to A.',
      src='voicebosch-single-coin-170397.mp3 (A’s three takes) + freesound_community-coin-spill-105867.mp3, four 0.2 s slices at 1.10, 1.45, 1.85 and 2.20 s, 9 dB under the take'),
 dict(id='D',synth=True,title='D. Made in code: change hitting change',
      what='A dry clack and a quick scatter of tiny jingles, all over in about 0.2 s. No low "plop" and no long pure ring. Each one is different.',
      src='Original, made in code with the same sound calls the game uses; no recording, no licence needed'),
]
cards=''
for c in sorted(C,key=lambda c:c['id']):
    cards+=f'''<div class="card"><h2>{c["title"]}</h2><p>{c["what"]}</p><p class="dim">Source: {c["src"]}.</p>
<div class="row"><button data-play="{c["id"]}:single">One coin</button><button data-play="{c["id"]}:hold">Holding (a coin every 0.40 s)</button><button data-play="{c["id"]}:taps">Fast taps (4 a second)</button><button data-play="{c["id"]}:pile">Title: coin pile-up</button></div></div>
'''
snd={'today':base64.b64encode((S/'today-coin-land.mp3').read_bytes()).decode()}
for c in C:
    for f in c.get('files',[])+c.get('pour',[]):snd[f]=base64.b64encode((S/(f+'.wav')).read_bytes()).decode()
t=(d/'page-template.html').read_text(encoding='utf-8')
t=t.replace('<!--CARDS-->',cards).replace('/*SOUNDS*/{}',json.dumps(snd)).replace('/*CANDS*/[]',json.dumps([{k:c[k] for k in c if k in('id','files','synth','uat59','pour')} for c in C]))
(d/'coin-landing-listen.html').write_text(t,encoding='utf-8');print('ok',len(t))
