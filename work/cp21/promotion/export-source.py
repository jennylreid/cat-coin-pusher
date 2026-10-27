"""Export only this signed-off batch's source/evidence, respecting Git exclusions."""
from pathlib import Path
import base64, json, subprocess, shutil
r=Path(__file__).resolve().parents[3]
repo=Path('C:/Users/jenny/GitHub/cat-coin-pusher')
assert subprocess.check_output(['git','status','--porcelain'],cwd=repo,text=True)==''
def allowed(name):
    assert not any(x in name.lower() for x in ['ibear-','ref-other-pusher-','screenshots/ref-'])
    return subprocess.run(['git','check-ignore','-q','--',name],cwd=repo).returncode==1
def write(name,data):
    if not allowed(name): return
    dest=repo/name
    if dest.exists() and dest.read_bytes()==data:return
    dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(data)
    print(name)
j=json.loads((Path(__file__).parent/'CatCoinPusher-game.json').read_bytes())
for name,data in j['files'].items():write(name,base64.b64decode(data))
for name in ['CODEX_BRIEF.md','DEVELOPER.md','tickets/CP-21.md','tickets/CP-21-promotion-brief.md',
             'tickets/UAT-16.md','tickets/UAT-17.md','tickets/UAT-18.md','tickets/UAT-19.md']:
    write(name,(r/name).read_bytes())
for f in (r/'tickets/CP-21-evidence').glob('production-*'):
    write(str(f.relative_to(r)),f.read_bytes())
for f in Path(__file__).parent.iterdir():
    if f.is_file() and f.name!='CatCoinPusher-game.json':write(str(f.relative_to(r)),f.read_bytes())
