# Predy – video LinkedIn 60s (9:16)

- `predy_linkedin_60s.mp4` – 1080x1920, 30 fps, H.264, sottotitoli incorporati (traccia audio muta).
- `predy_linkedin_60s.srt` – sottotitoli.
- `src/` – sorgente dell'animazione (HTML + timeline JS) e script di render.

Rigenerare: mettere `pjs.ttf` (Plus Jakarta Sans) e `inter/InterVariable.ttf` in `src/fonts/`, poi `node src/render.js full out.mp4` (richiede Playwright e ffmpeg).
