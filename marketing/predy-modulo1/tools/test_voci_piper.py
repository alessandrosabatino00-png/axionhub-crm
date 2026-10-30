"""Fase 1: campioni Piper (voci italiane) per le scene 2 e 6."""
import json, sys, time, wave, subprocess
from pathlib import Path
from piper import PiperVoice

voices_dir, out_dir, testi = Path(sys.argv[1]), Path(sys.argv[2]), json.load(open(sys.argv[3]))
for name in ["it_IT-paola-medium", "it_IT-riccardo-x_low", "it_IT-serena-high"]:
    voice = PiperVoice.load(str(voices_dir / f"{name}.onnx"))
    for sid, testo in testi.items():
        raw = out_dir / f"_raw_{name}_{sid}.wav"
        t0 = time.time()
        with wave.open(str(raw), "wb") as w:
            voice.synthesize_wav(testo, w)
        gen = time.time() - t0
        out = out_dir / f"piper_{name.split('-')[1]}_{sid}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
        with wave.open(str(raw)) as w: dur = w.getnframes() / w.getframerate()
        raw.unlink()
        print(json.dumps({"voce": name, "scena": sid, "durata_s": round(dur, 2), "generazione_s": round(gen, 2)}))
