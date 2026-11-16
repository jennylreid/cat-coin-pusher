from pathlib import Path
p=Path('work/cp25/two-intervals/readout.cjs');s=p.read_text(encoding='utf-8').replace("stopReason:a.board.status==='won'?'board clear':'20s elapsed'", "stopReason:a.board.status==='won'?'board clear':a.board.status==='lost'?'prize lost':'20s elapsed'");p.write_text(s,encoding='utf-8')
