"""Fase 1: campioni Qwen3-TTS 1.7B VoiceDesign (voce descritta a parole) per le scene 2 e 6."""
import json, sys, time, subprocess
from pathlib import Path
import torch, soundfile as sf
from qwen_tts import Qwen3TTSModel

out_dir, testi = Path(sys.argv[1]), json.load(open(sys.argv[2]))
VOCI = {
    "donna": "Voce femminile italiana adulta, circa 40 anni, timbro caldo e medio, dizione chiara, accento neutro italiano. Tono calmo, rassicurante e informativo, ritmo moderato con pause naturali tra le frasi, come una docente che spiega.",
    "uomo": "Voce maschile italiana adulta, circa 45 anni, timbro caldo e medio-grave, dizione chiara, accento neutro italiano. Tono calmo, rassicurante e informativo, ritmo moderato con pause naturali tra le frasi, come un docente che spiega.",
}
torch.set_num_threads(4)
model = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign", device_map="cpu", dtype=torch.float32)
for nome, instruct in VOCI.items():
    for sid, testo in testi.items():
        torch.manual_seed(42)
        t0 = time.time()
        wavs, sr = model.generate_voice_design(text=testo, language="Italian", instruct=instruct)
        gen = time.time() - t0
        raw = out_dir / f"_raw_qwen_{nome}_{sid}.wav"
        sf.write(raw, wavs[0], sr)
        out = out_dir / f"qwen3_{nome}_{sid}.wav"
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", raw, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", out], check=True)
        raw.unlink()
        print(json.dumps({"voce": nome, "scena": sid, "durata_s": round(len(wavs[0]) / sr, 2), "generazione_s": round(gen, 1)}), flush=True)
