from pathlib import Path
p=Path('work/cp25/auto-log/logger.js');s=p.read_text(encoding='utf-8').replace('if(!holding&&diagNeedSave){diagFinishBin();diagPersist();}','if(!holding&&diagNeedSave&&performance.now()-diagLastSave>=5000){diagFinishBin();diagPersist();}')
s=s.replace('if(b.ms>=1000)diagFinishBin();','if(wasHolding&&!holding){diagEvent(\'game-stopped-hold\',pickupBlocksPlay()?\'pickup-paused\':board.status);diagNeedSave=true;}\n if(b.ms>=1000)diagFinishBin();')
p.write_text(s,encoding='utf-8')
p=Path('work/cp25/auto-log/build.py');s=p.read_text(encoding='utf-8').replace("'function stopDrops(){diagEndHold();holding=false;streamPointer=null;}'", "\"function stopDrops(reason='stop'){diagEndHold(reason);holding=false;streamPointer=null;}\"")
s=s.replace("rep('b.mouthExit=exit.id;", "rep('if(e.pointerId===streamPointer)stopDrops();','if(e.pointerId===streamPointer)stopDrops(ev);')\nrep('b.mouthExit=exit.id;")
p.write_text(s,encoding='utf-8')
