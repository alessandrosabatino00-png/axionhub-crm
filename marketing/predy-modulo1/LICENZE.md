# Licenze delle dipendenze — Modulo 1

Verificate sul repository ufficiale di ciascun progetto. "Da verificare" = non è stato possibile leggere la fonte ufficiale da questa sessione.

## Voce (fase 1)

| Componente | Uso | Licenza | Fonte | Uso commerciale |
|---|---|---|---|---|
| Kokoro-82M (codice) | modello TTS | Apache-2.0 | github.com/hexgrad/kokoro (LICENSE) | Sì |
| Kokoro-82M (pesi e voci `if_sara`, `im_nicola`) | modello TTS | Apache-2.0 | README di hexgrad/kokoro ("Apache-licensed weights") | Sì |
| kokoro-onnx + file `kokoro-v1.0.onnx`, `voices-v1.0.bin` | runtime ONNX | MIT | github.com/thewh1teagle/kokoro-onnx (LICENSE, release model-files) | Sì |
| espeak-ng (via espeakng-loader) | fonetizzazione | GPL-3.0 | github.com/espeak-ng/espeak-ng (COPYING) | Sì (l'audio generato non è soggetto alla GPL) |
| ONNX Runtime | inferenza | MIT | github.com/microsoft/onnxruntime | Sì |
| Piper (codice) | non usato | MIT (rhasspy/piper) / GPL-3.0 (OHF-Voice/piper1-gpl) | repo ufficiali | Sì |
| Piper voci italiane | non usate | Da verificare (model card su Hugging Face non raggiungibile) | huggingface.co/rhasspy/piper-voices | Da verificare |
| Chatterbox Multilingual (codice e pesi) | non usato | MIT | github.com/resemble-ai/chatterbox (LICENSE) | Sì |
| XTTS v2, F5-TTS | esclusi | non commerciali | — | No |

## Strumenti

| Componente | Licenza | Uso commerciale |
|---|---|---|
| FFmpeg (build di sistema) | LGPL/GPL | Sì |
| Python | PSF | Sì |

## Font

| Font | Uso | Licenza | Fonte | Uso commerciale |
|---|---|---|---|---|
| Plus Jakarta Sans | titoli, numeri (al posto di Satoshi) | SIL OFL 1.1 | github.com/google/fonts, ofl/plusjakartasans (file in `brand/fonts/`) | Sì |
| Inter | testo | SIL OFL 1.1 | github.com/rsms/inter, release 4.1 (file in `brand/fonts/`) | Sì |

## Video

| Componente | Licenza | Fonte | Uso commerciale |
|---|---|---|---|
| Remotion 4.x | Remotion License: gratuita per singoli, aziende con al massimo 3 dipendenti e organizzazioni non profit; oltre serve la Company License | github.com/remotion-dev/remotion (LICENSE.md) | Sì, nel piano gratuito (confermato dal committente) |

## Strumenti usati una volta

| Componente | Uso | Licenza |
|---|---|---|
| potracer | tracciatura del logo in SVG | GPL-2.0+ (solo strumento; il file SVG prodotto non è soggetto alla GPL) |
