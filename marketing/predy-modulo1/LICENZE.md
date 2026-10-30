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
| Piper (codice, `piper-tts` 1.8) | TTS | GPL-3.0 | pypi.org/project/piper-tts, github.com/OHF-Voice/piper1-gpl | Sì (l'audio generato non è soggetto alla GPL) |
| Piper voce `it_IT-serena-high` | TTS | modello: MIT (huggingface.co/rhasspy/piper-voices); dataset: CC-BY-4.0 (huggingface.co/datasets/committa/serena-synthetic-it-27h, sintetico generato con Qwen3-TTS) | model card e dataset card su Hugging Face | Sì, con attribuzione del dataset |
| Piper voce `it_IT-paola-medium` | TTS | dataset CC0-1.0 (paolapersico1/Voice-Dataset-Italian), ma il modello è addestrato a partire dalla voce inglese *lessac*, il cui dataset (Blizzard 2013, Lessac Technologies) ha una licenza propria non raggiungibile da qui | model card su Hugging Face | Da verificare |
| Piper voce `it_IT-riccardo-x_low` | TTS | dataset M-AILABS (pagina della licenza su caito.de non raggiungibile da qui) | model card su Hugging Face | Da verificare |
| Chatterbox Multilingual V3 (codice) | TTS | MIT | github.com/resemble-ai/chatterbox (LICENSE), installato dal branch master per il modello V3 | Sì |
| Chatterbox Multilingual V3 (pesi) | TTS | MIT | huggingface.co/ResembleAI/chatterbox (model card: license mit) | Sì |
| resemble-perth | watermark audio inserito da Chatterbox | MIT | github.com/resemble-ai/Perth (LICENSE) | Sì |
| s3tokenizer | dipendenza Chatterbox | Apache-2.0 | pypi | Sì |
| Qwen3-TTS (codice, `qwen-tts`) | TTS | Apache-2.0 | github.com/QwenLM/Qwen3-TTS (LICENSE) | Sì |
| Qwen3-TTS-12Hz-1.7B-VoiceDesign (pesi) | TTS | Apache-2.0 | huggingface.co/Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign | Sì |
| PyTorch, Transformers | runtime | BSD-3-Clause, Apache-2.0 | repo ufficiali | Sì |
| faster-whisper + Whisper medium | solo controllo tecnico (trascrizione) | MIT, MIT | github.com/SYSTRAN/faster-whisper, huggingface.co/Systran/faster-whisper-medium | Sì |
| jiwer | calcolo WER | Apache-2.0 | pypi | Sì |
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

## Logo

Si usa il file originale fornito (`brand/logo_predy_originale.webp`). Nessuno strumento di terze parti coinvolto.
