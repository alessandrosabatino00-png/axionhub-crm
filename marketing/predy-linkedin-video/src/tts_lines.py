import sys, json, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
d, out, voice, speed = sys.argv[1], sys.argv[2], sys.argv[3], float(sys.argv[4])
lines = json.load(open(sys.argv[5]))
k = Kokoro(d+"/kokoro-v1.0.onnx", d+"/voices-v1.0.bin")
res = []
for i, L in enumerate(lines):
    s, sr = k.create(L["say"], voice=voice, speed=speed, lang="it")
    # trim silence
    idx = np.where(np.abs(s) > 0.01)[0]
    s = s[max(0, idx[0]-int(.03*sr)): idx[-1]+int(.08*sr)]
    sf.write(f"{out}/{voice}_{i:02d}.wav", s, sr)
    res.append(round(len(s)/sr, 2))
print(json.dumps(res))
