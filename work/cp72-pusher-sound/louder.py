"""CP-72 Zoomies sound fix for UAT 101 (Jenny on her phone, UAT 99/100: "I don't hear anything when I click P1, P2, P3").
make.py levelled the beds by RMS over the "sounding part" only and then limited their peaks to -1 dBFS. Coin rattles are
spiky, so the peak limit pulled P1/P2 down to about -30/-31 dBFS over the whole file (P3 -22), and the game played them at
0.11: about -50 dBFS in game, 20 dB under the yawn sounds (-21 dBFS files at 0.35). Here each finished bed (audio/
zoomies-sound-P*.wav) is compressed and limited so the whole file sits at -20 dBFS mean with peaks <= -1 dBFS, like the
yawn files; the game then plays them at 0.35, as the yawns. Out: audio/zoomies-game-P*-v2.mp3 (mono 48 kHz 112 kbps) and
audio/info-v2.json with the measured levels. Usage: python louder.py"""
from pathlib import Path
import subprocess,re,json
A=Path(__file__).parent/'audio';info={}
def meas(f):
    o=subprocess.run(['ffmpeg','-hide_banner','-i',str(f),'-af','volumedetect','-f','null','-'],capture_output=True,text=True).stderr
    return float(re.search(r'mean_volume: (-?[\d.]+)',o).group(1)),float(re.search(r'max_volume: (-?[\d.]+)',o).group(1))
for k in ['P1','P2','P3']:
    src=A/f'zoomies-sound-{k}.wav';out=A/f'zoomies-game-{k}-v2.mp3';m0=meas(src);mk=0.0
    for it in range(8):
        af=f"acompressor=threshold=-28dB:ratio=5:attack=2:release=80:makeup=1,volume={mk:.2f}dB,alimiter=limit=0.89:attack=1:release=40:level=disabled"
        subprocess.run(['ffmpeg','-v','error','-y','-i',str(src),'-af',af,'-ac','1','-ar','48000','-b:a','112k',str(out)],check=True)
        mean,peak=meas(out)
        if abs(mean+20)<=.4:break
        mk+=(-20-mean)
    info[k]={'before':{'mean':m0[0],'max':m0[1]},'after':{'mean':mean,'max':peak},'makeup_dB':round(mk,2),'filter':af,'bytes':out.stat().st_size}
    print(k,info[k])
(A/'info-v2.json').write_text(json.dumps(info,indent=1))
