"""Controllo tecnico: trascrive ogni campione con Whisper e lo confronta con il testo atteso.
Non misura la naturalezza: segnala solo parole saltate, aggiunte o sostituite."""
import json, re, sys, difflib, subprocess
import numpy as np
from pathlib import Path
import jiwer
from faster_whisper import WhisperModel

audio_dir, testi = Path(sys.argv[1]), json.load(open(sys.argv[2]))
testi["s6"] = testi["s6"].replace("O-emme-i", "OMI")
norm = lambda s: re.sub(r"\s+", " ", re.sub(r"[^\w\s']", " ", s.lower().replace("’", "'").replace("o-emme-i", "omi").replace("o emme i", "omi"))).strip()
m = WhisperModel("medium", device="cpu", compute_type="int8")
res = {}
for f in sorted(audio_dir.glob("*_s[26].wav")):
    sid = f.stem[-2:]
    pcm = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", str(f), "-ac", "1", "-ar", "16000", "-f", "f32le", "-"], capture_output=True, check=True).stdout, np.float32)
    seg, _ = m.transcribe(pcm, language="it", beam_size=5, vad_filter=False)
    hyp = " ".join(s.text for s in seg)
    r, h = norm(testi[sid]).split(), norm(hyp).split()
    diffs = []
    for op, a1, a2, b1, b2 in difflib.SequenceMatcher(None, r, h).get_opcodes():
        if op != "equal":
            diffs.append(f"{op}: «{' '.join(r[a1:a2])}» → «{' '.join(h[b1:b2])}»")
    res[f.name] = {"wer": round(jiwer.wer(" ".join(r), " ".join(h)), 3), "differenze": diffs, "trascrizione": hyp.strip()}
    print(f.name, res[f.name]["wer"], diffs, flush=True)
json.dump(res, open(audio_dir.parent / "tools" / "controllo_asr.json", "w"), ensure_ascii=False, indent=1)
