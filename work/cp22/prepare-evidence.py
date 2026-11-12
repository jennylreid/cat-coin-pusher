from pathlib import Path
import json,base64
p=Path(__file__).parent
root=p.parents[1]
u=json.loads((root/'uat/CatCoinPusher-UAT-game.json').read_bytes())
assert u['version']==20261027113731
assert base64.b64decode(u['files']['index.html'])==(p/'baseline.html').read_bytes()
for name,data in u['files'].items():
    target=p/'runtime'/name
    target.parent.mkdir(parents=True,exist_ok=True)
    target.write_bytes(base64.b64decode(data))
original=Path('C:/Users/jenny/Documents/Codex/2026-10-10/referenced-chatgpt-conversation-this-is-an/outputs/uat/game/tests/pusher-runtime.cjs')
s=original.read_text()
s=s.replace("path.resolve(__dirname, '..')", "path.resolve(__dirname, 'runtime')")
s=s.replace("require('@napi-rs/canvas')", "require('C:/Users/jenny/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@napi-rs/canvas')")
(p/'runtime.cjs').write_text(s)
