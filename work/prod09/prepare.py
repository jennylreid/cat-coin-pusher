# PROD-09: production build of UAT 105 (CP-71, 72, 73, 75, 78, 80, 82 + Developer-only CP-79/CP-83/Engineer tools, on PROD-08)
# from work/cp105/release.html, pinned by hash. Jenny, Nov 18: "Let's get this stuff to production before we continue to update UAT."
# Same production adaptations as PROD-05/06/08 (work/prod08/prepare.py), nothing else.
# Production-only changes (same kind as the CP-25 promotion): release label and title, production storage keys
# (catpusher.uat.* -> catpusher.*), the UAT log-file buttons removed from Settings, test previews and the local
# performance log only with Developer on. No play, art, balance or sound change. Output: work/prod09/release.html
# Usage (from the CoinPusher folder): python work/prod09/prepare.py
from pathlib import Path
import json, hashlib, re
r = Path(__file__).resolve().parents[2]; p = Path(__file__).parent
SRC = r / 'work/cp105/release.html'
PIN = 'd08597d1a6e355071a67742cd070a687156b7dd40ea791d3d71b1f57b4e6db39'  # UAT 105 release.html (work/cp105/publication-manifest.json)
v = json.loads((p / 'release-version.json').read_text())
h = SRC.read_text(encoding='utf-8', newline='')
assert hashlib.sha256(h.encode('utf-8')).hexdigest() == PIN, 'source must be the published UAT 105'
CRLF = chr(13) + chr(10); LF = chr(10)
N = LF  # PROD-09: the file is LF; only two appended JS blocks (UAT 102 peek, UAT 103 lab) carry CRLF lines, left as they are
adapt = []
def rep(a, b, count=1):
    global h
    a, b = a.replace(LF, N), b.replace(LF, N)
    assert h.count(a) == count, (a[:100], h.count(a)); h = h.replace(a, b); adapt.append({'before': a, 'after': b, 'count': count})
rep("const BUILD = '2026.11.18 UAT 105';", "const BUILD = '%s';" % v['displayName'])
rep('<title>Cat Pusher UAT</title>', '<title>CatCoin</title>')
n = h.count('catpusher.uat.'); rep('catpusher.uat.', 'catpusher.', n)
# Settings: production heading, no log-file buttons (production's app has no log bridge).
rep('<h2>UAT Settings</h2><button id="diag-send-file" class="wide">Send performance log</button><button id="diag-link-file" class="wide">Connect log file to OneDrive</button><button id="diag-share-file" class="wide">Share log file to OneDrive</button><p id="diag-file-status"></p>', '<h2>Settings</h2>')
rep(" panel.querySelector('#diag-send-file').onclick=diagSendFile;" + LF
    + " panel.querySelector('#diag-link-file').onclick=()=>{diagFlush('link-file');if(diagnosticFileBridge())Android.connectDiagnosticFile();};" + LF
    + " panel.querySelector('#diag-share-file').onclick=diagShareFile;" + LF
    + " onDiagnosticStatus(diagnosticFileStatus());" + LF
    + " diagFlush('settings');" + LF, '')
# Test previews only with Developer on (as in the Oct 31 production).
rep("+'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>'",
    "+(S.dev?'<button id=\"safe-guides\" class=\"wide\">Show/hide safe-area guides</button><button id=\"happy-test\" class=\"wide\">Preview Happy (6 seconds)</button>':'')")
rep("+'<p>Calm is the default gameplay face. Rest is the small smile with raised mitts, used for board clear. The original toothy Waiting face is saved for a future power. Recovery returns from Quake. Happy usage is TBD; preview only.</p>'",
    "+(S.dev?'<p>Calm is the default gameplay face. Rest is the small smile with raised mitts, used for board clear. The original toothy Waiting face is saved for a future power. Recovery returns from Quake. Happy usage is TBD; preview only.</p>':'')")
rep(" panel.querySelector('#safe-guides').onclick=", " const safeG=panel.querySelector('#safe-guides');if(safeG)safeG.onclick=")
rep(" panel.querySelector('#happy-test').onclick=", " const happyT=panel.querySelector('#happy-test');if(happyT)happyT.onclick=")
# Local performance log: Developer only (no automatic logging for players).
for fn in ['diagEvent', 'diagInput', 'diagEndHold', 'diagDrop', 'diagFrame', 'diagFlush', 'diagPersist']:
    h, k = re.subn(r'(function ' + fn + r'\([^\r\n]*?\)\{)', r'\1if(!S.dev)return;', h, count=1); assert k == 1, fn
    adapt.append({'before': 'function ' + fn + '(...){', 'after': 'function ' + fn + '(...){if(!S.dev)return;'})
rep('try{const raw=localStorage.getItem(DIAG_KEY);', 'try{const raw=S.dev?localStorage.getItem(DIAG_KEY):null;')
assert 'catpusher.uat' not in h and "UAT 105';" not in h
(p / 'release.html').write_text(h, encoding='utf-8', newline='')
m = {**v, 'sourceHTML': 'work/cp105/release.html', 'sourceHTMLSHA256': PIN, 'releaseHTMLSHA256': hashlib.sha256(h.encode('utf-8')).hexdigest(), 'adaptations': adapt}
(p / 'adaptations.json').write_text(json.dumps(m, indent=2)); print(m['releaseHTMLSHA256'], len(adapt), 'adaptations')
