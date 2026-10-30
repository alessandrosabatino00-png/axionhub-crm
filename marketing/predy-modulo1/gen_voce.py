"""Fase 2: voce, tempi e sottotitoli del Modulo 1.

Legge scene.json e, per ogni scena:
  1. divide `testo_per_voce` in frasi e le genera una per una con Chatterbox Multilingual V3
     (voce integrata, italiano, cfg_weight=0);
  2. controlla ogni frase trascrivendola con Whisper: se il testo non coincide col copione
     la rigenera con un altro seed (fino a MAX_TENTATIVI) e tiene la versione migliore;
  3. unisce le frasi con una pausa fissa e normalizza la scena a -16 LUFS (ffmpeg loudnorm);
  4. scrive durata e tempi delle frasi in tempi.json.
Poi genera i sottotitoli da `testo_originale` (non da trascrizione automatica).

Le correzioni di pronuncia in pronuncia.json si applicano solo al testo inviato alla voce:
sottotitoli e copione restano invariati.

Uso:  python gen_voce.py            # tutte le scene
      python gen_voce.py 2 6        # solo alcune scene (le altre restano come sono)
"""
import json, re, subprocess, sys
from pathlib import Path

import numpy as np
import soundfile as sf
import torch
from chatterbox.mtl_tts import ChatterboxMultilingualTTS
from faster_whisper import WhisperModel

BASE = Path(__file__).parent
VOCE_DIR = BASE / "voce"
LUFS = -16
PAUSA_FRASE = 0.40     # silenzio tra due frasi, in secondi
ATTACCO = 0.60         # silenzio prima della voce all'inizio di ogni scena
CODA = 1.00            # silenzio dopo la voce alla fine di ogni scena
MAX_TENTATIVI = 4
MAX_CARATTERI_CUE = 84  # due righe da 42 caratteri

NUMERI = {"0": "zero", "1": "uno", "2": "due", "3": "tre", "4": "quattro", "5": "cinque",
          "6": "sei", "7": "sette", "8": "otto", "9": "nove", "10": "dieci"}


def frasi(testo):
    return [f.strip() for f in re.split(r"(?<=[.!?])\s+", testo) if f.strip()]


def normalizza(testo):
    t = testo.lower().replace("’", "'")
    t = t.replace("o-emme-i", "omi").replace("o emme i", "omi")
    t = re.sub(r"[^\w\s']", " ", t).replace("'", "' ")
    t = re.sub(r"\bo m i\b", "omi", t)
    t = " ".join(NUMERI.get(w, w) for w in t.split())
    return t


def differenze(atteso, ottenuto):
    a, b = normalizza(atteso).split(), normalizza(ottenuto).split()
    import difflib
    sm = difflib.SequenceMatcher(None, a, b)
    diff = [f"«{' '.join(a[i1:i2])}» → «{' '.join(b[j1:j2])}»" for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal"]
    errori = sum(max(i2 - i1, j2 - j1) for op, i1, i2, j1, j2 in sm.get_opcodes() if op != "equal")
    return errori / max(1, len(a)), diff


def taglia_silenzio(w, sr, soglia=0.01, margine=0.04):
    idx = np.where(np.abs(w) > soglia)[0]
    if len(idx) == 0:
        return w
    m = int(margine * sr)
    return w[max(0, idx[0] - m): idx[-1] + m]


def trascrivi(asr, w, sr):
    import librosa
    pcm = librosa.resample(w.astype(np.float32), orig_sr=sr, target_sr=16000)
    seg, _ = asr.transcribe(pcm, language="it", beam_size=5)
    return " ".join(s.text for s in seg).strip()


def normalizza_lufs(src, dst):
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", str(src), "-af", f"loudnorm=I={LUFS}:TP=-1.5:LRA=11",
                    "-ar", "48000", "-ac", "1", str(dst)], check=True)


def cue_da_frase(testo, inizio, fine):
    """Divide una frase in sottotitoli di al massimo MAX_CARATTERI_CUE caratteri,
    preferendo i tagli dopo la punteggiatura; tempi proporzionali ai caratteri."""
    pezzi, resto = [], testo
    while len(resto) > MAX_CARATTERI_CUE:
        finestra = resto[:MAX_CARATTERI_CUE + 1]
        tagli = [m.end() for m in re.finditer(r"[,:;]\s", finestra)]
        taglio = tagli[-1] if tagli and tagli[-1] > MAX_CARATTERI_CUE // 3 else finestra.rfind(" ") + 1
        pezzi.append(resto[:taglio].strip())
        resto = resto[taglio:].strip()
    pezzi.append(resto)
    tot, t, cues = sum(len(p) for p in pezzi), inizio, []
    for p in pezzi:
        d = (fine - inizio) * len(p) / tot
        cues.append((t, t + d, p))
        t += d
    return cues


def a_due_righe(testo, max_riga=42):
    if len(testo) <= max_riga:
        return testo
    parole, meta = testo.split(), len(testo) / 2
    migliore = min(range(1, len(parole)), key=lambda i: abs(len(" ".join(parole[:i])) - meta))
    return " ".join(parole[:migliore]) + "\n" + " ".join(parole[migliore:])


def ts(s):
    ms = round(s * 1000)
    return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"


def scrivi_srt(path, cues):
    path.write_text("\n".join(f"{i}\n{ts(a)} --> {ts(b)}\n{a_due_righe(t)}\n" for i, (a, b, t) in enumerate(cues, 1)), encoding="utf-8")


def main():
    scene = json.loads((BASE / "scene.json").read_text())
    pronuncia = json.loads((BASE / "pronuncia.json").read_text()) if (BASE / "pronuncia.json").exists() else {}
    solo = {int(a) for a in sys.argv[1:]}
    tempi_path = BASE / "tempi.json"
    precedenti = {s["id"]: s for s in json.loads(tempi_path.read_text())["scene"]} if tempi_path.exists() else {}
    VOCE_DIR.mkdir(exist_ok=True)

    torch.set_num_threads(4)
    tts = ChatterboxMultilingualTTS.from_pretrained(device="cpu", t3_model="v3")
    asr = WhisperModel("medium", device="cpu", compute_type="int8")
    sr = tts.sr

    risultati = []
    for sc in scene:
        if solo and sc["id"] not in solo and sc["id"] in precedenti:
            risultati.append(precedenti[sc["id"]])
            continue
        voce, orig = frasi(sc["testo_per_voce"]), frasi(sc["testo_originale"])
        assert len(voce) == len(orig), f"scena {sc['id']}: testo_per_voce e testo_originale hanno un numero di frasi diverso"
        parti, info, t = [], [], 0.0
        for k, (fv, fo) in enumerate(zip(voce, orig)):
            fv_tts = fv
            for da, a in pronuncia.items():
                fv_tts = fv_tts.replace(da, a)
            migliore = None
            for tentativo in range(1, MAX_TENTATIVI + 1):
                torch.manual_seed(1000 * sc["id"] + 10 * k + tentativo)
                w = tts.generate(fv_tts, language_id="it", exaggeration=0.5, cfg_weight=0.0).squeeze(0).numpy()
                w = taglia_silenzio(w, sr)
                trascritto = trascrivi(asr, w, sr)
                err, diff = differenze(fo, trascritto)
                if migliore is None or err < migliore[1]:
                    migliore = (w, err, diff, trascritto, tentativo)
                if err == 0:
                    break
            w, err, diff, trascritto, tentativo = migliore
            durata = len(w) / sr
            info.append({"testo_originale": fo, "testo_inviato": fv_tts, "inizio": round(t, 3), "fine": round(t + durata, 3),
                         "tentativi": tentativo, "errore_trascrizione": round(err, 3), "differenze": diff, "trascrizione": trascritto})
            print(f"scena {sc['id']} frase {k + 1}: {durata:.2f}s, tentativo {tentativo}, errore {err:.2f} {diff}", flush=True)
            parti.append(w)
            t += durata
            if k < len(voce) - 1:
                parti.append(np.zeros(int(PAUSA_FRASE * sr), dtype=np.float32))
                t += PAUSA_FRASE
        grezzo = VOCE_DIR / f"_grezzo_s{sc['id']:02d}.wav"
        sf.write(grezzo, np.concatenate(parti), sr)
        file_voce = VOCE_DIR / f"voce_s{sc['id']:02d}.wav"
        normalizza_lufs(grezzo, file_voce)
        grezzo.unlink()
        durata_voce = sf.info(file_voce).duration
        risultati.append({"id": sc["id"], "file": str(file_voce.relative_to(BASE)), "durata_voce": round(durata_voce, 3),
                          "attacco": ATTACCO, "coda": CODA, "durata_scena": round(ATTACCO + durata_voce + CODA, 3),
                          "frasi": info})

    inizio, cues = 0.0, []
    for r in risultati:
        r["inizio_scena"] = round(inizio, 3)
        for f in r["frasi"]:
            cues += cue_da_frase(f["testo_originale"], inizio + r["attacco"] + f["inizio"], inizio + r["attacco"] + f["fine"])
        inizio += r["durata_scena"]
    tempi = {"voce": "Chatterbox Multilingual V3, voce integrata, cfg_weight=0, exaggeration=0.5", "lufs": LUFS,
             "pausa_tra_frasi": PAUSA_FRASE, "durata_totale": round(inizio, 3), "scene": risultati}
    tempi_path.write_text(json.dumps(tempi, ensure_ascii=False, indent=1), encoding="utf-8")
    scrivi_srt(BASE / "modulo1_16x9.srt", cues)

    # traccia unica di anteprima, con i silenzi di attacco e coda di ogni scena
    pezzi = []
    for r in risultati:
        w, s = sf.read(BASE / r["file"], dtype="float32")
        pezzi += [np.zeros(int(r["attacco"] * s), np.float32), w, np.zeros(int(r["coda"] * s), np.float32)]
    sf.write(VOCE_DIR / "voce_completa.wav", np.concatenate(pezzi), 48000)
    print(f"durata totale: {inizio:.1f}s")


if __name__ == "__main__":
    main()
