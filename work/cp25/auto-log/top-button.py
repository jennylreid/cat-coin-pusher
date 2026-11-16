from pathlib import Path
p=Path('work/cp25/auto-log/build.py');lines=p.read_text(encoding='utf-8').splitlines();out=[]
for line in lines:
 if 'rep(' in line and 'devmode' in line and 'copy-perf-log' in line:
  out.append('rep(\'<h2>UAT Settings</h2>\',\'<h2>UAT Settings</h2><button id="copy-perf-log" class="wide">Copy performance log</button>\')')
 else:out.append(line)
p.write_text('\n'.join(out)+'\n',encoding='utf-8')
