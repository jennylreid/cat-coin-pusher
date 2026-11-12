from pathlib import Path
p=Path('work/cp25/log-file/build.py');s=p.read_text(encoding='utf-8')
s=s.replace("rep('y: DROP_Y, lookX };','y: DROP_Y, lookX, screenX:sx };')", "rep('y: DROP_Y, lookX };','y: DROP_Y, lookX, screenX:sx };')\nrep('y:DROP_Y,lookX};','y:DROP_Y,lookX,screenX:sx};')")
s=s.replace('Number.isFinite(at.screenX)?unprojX(screenToGameX(at.screenX),depth):at.x','Number.isFinite(at.screenX)?200+(screenToGameX(at.screenX)-200)/__plane(depth).gx:at.x')
s=s.replace("rep('diagDrop(at.x,b.rb.translation().x/M,','diagDrop(requestedX,b.rb.translation().x/M,')", "rep('diagDrop(at.x,b.rb.translation().x/M,200+(p.x-200)*VIEW.z);', 'const diagWorldX=b.rb.translation().x/M;diagDrop(requestedX,diagWorldX,200+(screenOf(diagWorldX,depth,entryHeight).x-200)*VIEW.z);')\nrep('renderPixelRatio},samples:[]','renderPixelRatio},releaseProjection:\\'fitted-camera\\',samples:[]')")
p.write_text(s,encoding='utf-8')
p=Path('work/cp25/log-file/functional.cjs');s=p.read_text(encoding='utf-8').replace('proj(x,depth).x','screenOf(x,depth,0).x');p.write_text(s,encoding='utf-8')
import json
p=Path('tickets/CP-25-evidence/log-file/phone-analysis.json');d=json.loads(p.read_text());d['legacyReportedCanvasGap']=d.pop('maxRightClampCanvasGap');d['canvasEstimateCaveat']='UAT19 releaseCanvasX used legacy proj rather than fitted screenOf; do not treat that gap as exact visible screen distance. World release coordinates and clamp evidence remain valid.';p.write_text(json.dumps(d,indent=2))
p=Path('tickets/CP-25.md');s=p.read_text(encoding='utf-8').replace('An input at308.2 canvas units released at261.7:46.5 units short. That fixed edge is distinct from lag.', 'UAT19 screen-release estimates used the legacy projection, so the reported46.5-unit gap is not a reliable visible distance. Actual world releases still hit the fixed bound284; that edge clamp is distinct from lag. UAT20 corrects the screen measurement to the fitted camera.')
p.write_text(s,encoding='utf-8')
