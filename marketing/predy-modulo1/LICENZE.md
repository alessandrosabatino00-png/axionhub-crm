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

## Da decidere nelle fasi successive

- **Font**: Satoshi (brand) è distribuito da Fontshare con ITF Free Font License, che consente l'uso commerciale, ma Fontshare non è raggiungibile da questa sessione: per scaricarlo serve il tuo file. Alternativa simile già disponibile: Plus Jakarta Sans (SIL OFL 1.1). Inter: SIL OFL 1.1.
- **Remotion**: non è open source in senso stretto. È gratuito per singoli e aziende fino a 3 persone; oltre serve una licenza aziendale a pagamento. Lo verifico e te lo segnalo prima della fase 3.
