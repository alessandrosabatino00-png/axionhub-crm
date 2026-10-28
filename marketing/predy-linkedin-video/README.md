# Predy – video LinkedIn 60s (9:16)

- `predy_linkedin_60s_im_nicola.mp4` – voce maschile, 1080x1920, 30 fps, H.264 + AAC, sottotitoli incorporati.
- `predy_linkedin_60s_if_sara.mp4` – stessa versione con voce femminile.
- `*.srt` – sottotitoli sincronizzati con la rispettiva voce.
- `src/` – animazione (HTML + timeline JS), testo della voce (`vo.json`), script TTS e di render.

Rigenerare (servono Playwright, ffmpeg, `kokoro-onnx` con i file del modello Kokoro v1.0):
1. `python tts_lines.py <dir-modello> ../vo <voce> 1.05 vo.json`
2. `python build_timing.py <voce> src/` → `timing.js`, `vo_<voce>.wav`, `.srt`
3. `node render.js full out.mp4 vo_<voce>.wav`
