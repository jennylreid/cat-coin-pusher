# UAT 87 = CP-64's final source (work/cp86/release.html, never published on its own: Jackpot cascade on UAT 85) + CP-57's title
# sound switch (work/cp57-title/build-title87.py: Settings > Developer > Title sound A/B/C/D, default A, + Replay title).
# Jenny (Nov 17): "Publish Jackpot + title sound together as one UAT." Usage: python build.py   Output: release.html
from pathlib import Path
import subprocess, hashlib
p = Path(__file__).parent
PIN = 'e43e77f8051194c2bf5eb190658d10ad8db51b3ab2041355a2f1a2ab6215936c'  # work/cp86/release.html (CP-64 final, PM Nov 17)
subprocess.run(['python', str(p.parent / 'cp57-title/build-title87.py'), str(p.parent / 'cp86/release.html'), PIN, str(p / 'release.html'), str(p / 'release-version.json')], check=True, capture_output=True)
print(p / 'release.html', hashlib.sha256((p / 'release.html').read_bytes()).hexdigest())
