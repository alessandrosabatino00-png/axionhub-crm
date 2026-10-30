# Predy — Modulo 1 «Quanto vale davvero la tua casa?»

## File consegnati

| File | Contenuto |
|---|---|
| `modulo1_16x9.mp4` | video completo, 1920x1080, 30 fps, sottotitoli incorporati |
| `modulo1_9x16.mp4` | taglio verticale (scene 1, 2, 10), 1080x1920, 30 fps, sottotitoli incorporati |
| `modulo1_16x9.srt`, `modulo1_9x16.srt` | sottotitoli dal `testo_originale` |
| `clips_da_procurare.md`, `LICENZE_CLIP.md` | clip da inserire e registro delle licenze |
| `NOTE_VERIFICA.md` | dubbi per la revisione tecnica delle scene 4-7 |
| `LICENZE.md` | licenze di tutte le dipendenze |

## Come si rigenera

1. **Voce e tempi** (Python con Chatterbox, faster-whisper, soundfile, librosa):
   `python gen_voce.py` (tutte le scene) oppure `python gen_voce.py 4 6` (solo alcune).
   Scrive `voce/`, `tempi.json` e `modulo1_16x9.srt`. Le grafie di pronuncia sono in `pronuncia.json`.
2. **Video** (in `marketing/predy-video`, Node.js):
   - `npm install`
   - `npm run dev`: copia i materiali e apre Remotion Studio per l'anteprima;
   - `npm run render:modulo1`: copia i materiali e produce i due MP4 qui.

## Cosa si cambia senza toccare il codice

- **Clip**: metti il file in `clips/` con il nome indicato e rigenera il video; il segnaposto viene sostituito.
- **Musica**: metti la traccia in `musica/` e scrivi il nome del file in `musica/musica.json` (`"file": "traccia.mp3"`). Il volume scende automaticamente sotto la voce (ducking).
- **Logo**: sostituisci `brand/logo_predy_originale.webp` (stesso nome). Il logo è sempre caricato come file separato.
