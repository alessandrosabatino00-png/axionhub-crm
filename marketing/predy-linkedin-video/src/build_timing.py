# usage: build_timing.py <voice> -> writes timing.js, vo_<voice>.wav, predy_<voice>.srt
import json, sys, subprocess, soundfile as sf
V = sys.argv[1]; D = sys.argv[2]
lines = json.load(open(f"{D}/vo.json"))
dur = [sf.info(f"{D}/../vo/{V}_{i:02d}.wav").duration for i in range(len(lines))]
st = [0.0] * len(lines)
st[0] = 0.35; st[1] = 6.1
st[2] = st[1] + dur[1] + .2; st[3] = st[2] + dur[2] + .2
st[4] = 20.25; st[5] = st[4] + dur[4] + .35
st[6] = 32.25; st[7] = 40.7; st[8] = 46.25; st[9] = 55.35
bounds = {0: 6, 3: 20.05, 5: 32, 6: 40.5, 7: 46, 8: 55, 9: 60}
for i in bounds:
    assert st[i] + dur[i] <= bounds[i] + .05, (i, st[i] + dur[i])
cues = []
for i, L in enumerate(lines):
    tot = sum(len(c) for c in L["show"]); t = st[i]
    for c in L["show"]:
        d = dur[i] * len(c) / tot
        cues.append([round(t, 3), round(t + d, 3), c]); t += d
# step nodes: chunk 3 of line 6 holds "Stima. Situazione. Documenti."
c6 = [c for c in cues if c[2].startswith("Stima.")][0]
w = c6[1] - c6[0]
nodes = [c6[0] - .1, c6[0] + w * .3, c6[0] + w * .66, [c for c in cues if c[2].startswith("E i passi")][0][0] - .1]
s5b = [c for c in cues if c[2].startswith("Ora testiamo")][0][0] - .2
T = {"own": [6, st[2] - .15, st[3] - .15], "agB": st[5] - .3, "nodes": nodes, "s5b": s5b}
open(f"{D}/timing.js", "w").write(f"window.CUES={json.dumps(cues, ensure_ascii=False)};\nwindow.TIMING={json.dumps(T)};\n")
def ts(s):
    ms = round(s * 1000); return f"{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d},{ms%1000:03d}"
open(f"{D}/predy_{V}.srt", "w").write("\n".join(f"{i+1}\n{ts(a)} --> {ts(b)}\n{c}\n" for i, (a, b, c) in enumerate(cues)))
# audio mix
inp, flt = [], []
for i in range(len(lines)):
    inp += ["-i", f"{D}/../vo/{V}_{i:02d}.wav"]
    flt.append(f"[{i}:a]aresample=48000,adelay={int(st[i]*1000)}:all=1[a{i}]")
flt.append("".join(f"[a{i}]" for i in range(len(lines))) + f"amix=inputs={len(lines)}:normalize=0,highpass=f=70,acompressor=threshold=-20dB:ratio=2.5:attack=5:release=120,apad,atrim=0:60,loudnorm=I=-16:TP=-1.5:LRA=7,aresample=48000,pan=stereo|c0=c0|c1=c0[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", *inp, "-filter_complex", ";".join(flt), "-map", "[out]", f"{D}/vo_{V}.wav"], check=True)
print(T)
