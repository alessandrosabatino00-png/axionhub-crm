"""Fase 1: genera i campioni Kokoro per le scene 2 e 6 e stampa fonemi e tempi."""
import json, sys, time, subprocess
from pathlib import Path
import soundfile as sf
from kokoro_onnx import Kokoro

model_dir, out_dir = Path(sys.argv[1]), Path(sys.argv[2])
TESTI = {
    "s2": "Prima di tutto, una distinzione che confonde molti. Il valore è quanto la casa vale per il mercato in questo momento. Il prezzo di annuncio è quello che decidi di chiedere. Il prezzo di vendita è quello che finisce scritto nel rogito, ed è l'unico che conta davvero. Spesso non coincidono: tra annuncio e vendita c'è di mezzo la trattativa.",
    "s6": "Un punto di partenza serio sono le quotazioni dell'O-emme-i, l'Osservatorio del Mercato Immobiliare dell'Agenzia delle Entrate. Non danno il valore della tua casa, ma una fascia di riferimento per zona e stato di conservazione.",
}
k = Kokoro(str(model_dir / "kokoro-v1.0.onnx"), str(model_dir / "voices-v1.0.bin"))
report = []
for voce in ["if_sara", "im_nicola"]:
    for sid, testo in TESTI.items():
        t0 = time.time()
        audio, sr = k.create(testo, voice=voce, speed=1.0, lang="it")
        gen = time.time() - t0
        raw = out_dir / f"_raw_kokoro_{voce}_{sid}.wav"
        sf.write(raw, audio, sr)
        out = out_dir / f"kokoro_{voce}_{sid}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
        raw.unlink()
        report.append({"voce": voce, "scena": sid, "durata_s": round(len(audio) / sr, 2), "generazione_s": round(gen, 2)})
print(json.dumps(report, indent=1))
for sid, testo in TESTI.items():
    print(sid, k.tokenizer.phonemize(testo, "it"))
