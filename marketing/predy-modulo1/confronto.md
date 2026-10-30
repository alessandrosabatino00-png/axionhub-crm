# Fase 1 — Confronto voci italiane

Testi di prova: `testo_per_voce` delle scene 2 e 6, generati senza modifiche, velocità 1.0.
Campioni in `audio/`, normalizzati con `ffmpeg loudnorm` (I = -16 LUFS, TP = -1.5 dBTP), 48 kHz.
Generazione su CPU (4 core), nessuna GPU.

## Riepilogo

| Modello | Voce | Licenza codice | Licenza voce/pesi | Uso commerciale | Stato |
|---|---|---|---|---|---|
| Kokoro-82M (via kokoro-onnx) | `if_sara` (F) | Apache-2.0 (kokoro), MIT (kokoro-onnx) | Apache-2.0 | Sì | Generata |
| Kokoro-82M (via kokoro-onnx) | `im_nicola` (M) | Apache-2.0 (kokoro), MIT (kokoro-onnx) | Apache-2.0 | Sì | Generata |
| Piper | `it_IT-paola-medium`, `it_IT-riccardo-x_low` | MIT (rhasspy/piper, archiviato), GPL-3.0 (OHF-Voice/piper1-gpl, attuale) | Da verificare per ogni voce (model card su Hugging Face) | Da verificare | **Non generata**: download bloccato |
| Chatterbox Multilingual V3 | voce di default / clonazione | MIT | MIT (dichiarata nel repo ufficiale) | Sì (da riconfermare sulla model card) | **Non generata**: download bloccato |
| Google Cloud TTS / Azure TTS | — | proprietario | termini del servizio | Sì, nei limiti dei termini | **In attesa di credenziali** |

## Kokoro-82M — dettagli misurati

| File | Durata | Tempo di generazione | Loudness / picco | Pause > 0,25 s |
|---|---|---|---|---|
| `kokoro_if_sara_s2.wav` | 17,4 s | 6,3 s | -16,2 LUFS / -1,5 dBFS | 1 (0,36 s) |
| `kokoro_if_sara_s6.wav` | 12,7 s | 3,5 s | -16,3 LUFS / -1,5 dBFS | 0 |
| `kokoro_im_nicola_s2.wav` | 20,1 s | 5,8 s | -16,5 LUFS / -1,5 dBFS | 5 (media 0,34 s) |
| `kokoro_im_nicola_s6.wav` | 14,6 s | 4,0 s | -16,6 LUFS / -1,5 dBFS | 4 (media 0,36 s) |

Note tecniche:
- **Italiano supportato** (`lang="it"`), 2 voci: `if_sara`, `im_nicola`. La fonetizzazione usa espeak-ng (incluso in `espeakng-loader`, GPL-3.0: si usa come programma, l'audio prodotto non è soggetto alla GPL).
- **Pause**: `if_sara` lega quasi tutte le frasi (una sola pausa sopra 0,25 s in 17 s): ritmo serrato per un corso. `im_nicola` fa pause regolari tra le frasi. In fase 2 si possono generare le frasi separatamente e inserire pause fisse (es. 0,4 s) per entrambe.
- **Accenti controllati sulla trascrizione fonetica** (non ascoltando): corretti *ròGito*, *coinCÌdono*, *deCÌdi*, *CHIÈdere*, *PRÈzzo*, *di MÈzzo*, *ZÒna*, *Agenzia delle Entrate*. "O-emme-i" viene letto come una parola unica (*dell'oÈmmeÌ*).
- **Possibili difetti da verificare all'ascolto**: "è" fonetizzata chiusa (/e/ invece di /ɛ/); le *i* e *u* finali atone sono rese con vocali "rilassate" di tipo inglese (/ɪ/, /ʊ/: *moltɪ*, *dɪ*, *ʊna*), il che può dare un leggero accento non italiano.
- Gli errori di pronuncia di una singola parola si possono correggere in fase 2 riscrivendo `testo_per_voce` (come per "O-emme-i").

## Piper — perché manca

- Le voci italiane ufficiali (`it_IT-paola-medium`, `it_IT-riccardo-x_low`) sono distribuite solo su Hugging Face (`rhasspy/piper-voices`), che la rete di questa sessione blocca (huggingface.co non raggiungibile). Non ho usato mirror non ufficiali.
- Le licenze delle singole voci sono nelle `MODEL_CARD` su Hugging Face, quindi non le ho potute verificare. Restano "da verificare".
- Nota: il pacchetto `piper-tts` attuale (OHF-Voice/piper1-gpl) è GPL-3.0. L'uso commerciale è consentito; gli obblighi GPL riguardano la redistribuzione del software, non l'audio generato.

## Chatterbox Multilingual — perché manca

- Il README ufficiale (resemble-ai/chatterbox, MIT) elenca **l'italiano (`it`)** tra le 23 lingue del modello multilingue.
- I pesi (`ResembleAI/chatterbox`) sono solo su Hugging Face, bloccato come sopra. Serve anche PyTorch (~ qualche GB, solo CPU: generazione lenta).
- Nota tecnica: ogni audio Chatterbox contiene un **watermark Perth** inudibile (rilevabile via software). Non impedisce l'uso commerciale, ma va saputo.

## Google Cloud TTS / Azure TTS

Non usati: servono credenziali tue (chiave API o account di servizio con quota gratuita). Se vuoi includerli, mandami le credenziali e ti indico come passarmele in modo sicuro (variabile d'ambiente della sessione, non in chat né nel repo).

## Esclusi per licenza

XTTS v2 (Coqui Public Model License, non commerciale) e F5-TTS (pesi CC-BY-NC): non installati né usati.
