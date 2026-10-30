"""Fase 1: campioni Chatterbox Multilingual V3 (italiano) per le scene 2 e 6.

Varianti:
- default: voce di riferimento inclusa nel modello, cfg_weight=0 (consigliato dal README
  quando il riferimento non è nella lingua del testo, per non trasferire l'accento);
- rif_<nome>: voce clonata da un campione italiano sintetico (Qwen3-TTS, Apache-2.0).
Il testo è generato frase per frase e unito con 0,35 s di pausa.
"""
import json, re, sys, time, subprocess
from pathlib import Path
import numpy as np, torch, soundfile as sf
from chatterbox.mtl_tts import ChatterboxMultilingualTTS

out_dir, testi = Path(sys.argv[1]), json.load(open(sys.argv[2]))
riferimenti = {Path(p).stem.split("_")[1]: p for p in sys.argv[3:]}
torch.set_num_threads(4)
model = ChatterboxMultilingualTTS.from_pretrained(device="cpu", t3_model="v3")
sr = model.sr
pausa = np.zeros(int(.35 * sr), dtype=np.float32)
varianti = [("default", None, 0.0)] + [(f"rif_{n}", p, 0.5) for n, p in riferimenti.items()]
for nome, rif, cfg in varianti:
    for sid, testo in testi.items():
        frasi = [f for f in re.split(r"(?<=[.!?])\s+", testo) if f]
        torch.manual_seed(42)
        t0 = time.time(); parti = []
        for f in frasi:
            w = model.generate(f, language_id="it", audio_prompt_path=rif, exaggeration=0.5, cfg_weight=cfg)
            parti += [w.squeeze(0).numpy(), pausa]
        gen = time.time() - t0
        audio = np.concatenate(parti[:-1])
        raw = out_dir / f"_raw_cb_{nome}_{sid}.wav"
        sf.write(raw, audio, sr)
        out = out_dir / f"chatterbox_{nome}_{sid}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
        raw.unlink()
        print(json.dumps({"voce": nome, "scena": sid, "durata_s": round(len(audio) / sr, 2), "generazione_s": round(gen, 1)}), flush=True)
