# Fase 1 — Confronto voci italiane

Testi di prova: `testo_per_voce` delle scene 2 (60 parole) e 6 (34 parole), senza modifiche.
Tutti i campioni in `audio/` sono normalizzati con `ffmpeg loudnorm` (I = -16 LUFS, TP = -1,5 dBTP), 48 kHz.
Generazione su CPU (4 core, nessuna GPU): in produzione i tempi scalano con la lunghezza del testo.

Le colonne tecniche non dicono nulla sulla naturalezza: quella la valuti tu ascoltando.

## Riepilogo

| File (scena 2 / 6) | Modello | Voce | Licenza codice | Licenza pesi/voce | Uso commerciale |
|---|---|---|---|---|---|
| `qwen3_donna_*` | Qwen3-TTS 1.7B VoiceDesign | voce femminile progettata da descrizione testuale | Apache-2.0 | Apache-2.0 | Sì |
| `qwen3_uomo_*` | Qwen3-TTS 1.7B VoiceDesign | voce maschile progettata da descrizione testuale | Apache-2.0 | Apache-2.0 | Sì |
| `chatterbox_default_*` | Chatterbox Multilingual V3 | voce integrata nel modello | MIT | MIT | Sì |
| `chatterbox_rif_donna_*` | Chatterbox Multilingual V3 | timbro clonato dal campione `qwen3_donna_s6` | MIT | MIT (+ riferimento Apache-2.0) | Sì |
| `chatterbox_rif_uomo_*` | Chatterbox Multilingual V3 | timbro clonato dal campione `qwen3_uomo_s6` | MIT | MIT (+ riferimento Apache-2.0) | Sì |
| `piper_serena_*` | Piper (high) | serena | GPL-3.0 (piper-tts 1.8) | modello MIT; dataset CC-BY-4.0 | Sì, con attribuzione del dataset |
| `piper_paola_*` | Piper (medium) | paola | GPL-3.0 | dataset CC0, ma addestrata partendo dalla voce inglese *lessac* (Blizzard 2013) | Da verificare |
| `piper_riccardo_*` | Piper (x_low) | riccardo | GPL-3.0 | dataset M-AILABS | Da verificare |
| `kokoro_*` | Kokoro-82M | if_sara, im_nicola | Apache-2.0 / MIT | Apache-2.0 | Sì (scartata: poco naturale) |
| — | Google Cloud TTS / Azure TTS | — | proprietario | termini del servizio | Non provati: servono credenziali |

## Misure tecniche

Velocità = parole al minuto, pause incluse (per un corso si sta di solito tra 140 e 170).
Controllo testo = trascrizione automatica con Whisper *medium* confrontata con il copione (WER = quota di parole diverse).
Whisper può sbagliare a sua volta: una differenza è un punto da ascoltare, non un errore certo.

| File | Durata | Velocità | Pause > 0,25 s (n / media / max) | Tempo di generazione | WER | Differenze rilevate |
|---|---|---|---|---|---|---|
| qwen3_donna_s2 | 26,2 s | 137 | 9 / 0,65 / 1,03 s | 146 s | 0 | — |
| qwen3_donna_s6 | 14,7 s | 139 | 6 / 0,55 / 0,89 s | 81 s | 0 | — |
| qwen3_uomo_s2 | 28,5 s | 126 | 4 / 0,27 / 0,29 s | 162 s | 0 | — |
| qwen3_uomo_s6 | 15,0 s | 136 | 2 / 0,59 / 0,62 s | 82 s | 0,06 | «dell'OMI» → «dell'om e» |
| chatterbox_default_s2 | 20,2 s | 179 | 5 / 0,87 / 1,00 s | 101 s | 0,05 | un «ah» in più; «nel rogito» → «nell'orgito» |
| chatterbox_default_s6 | 12,8 s | 160 | 3 / 0,58 / 0,97 s | 60 s | 0,03 | «dell'OMI» → «dell'omei» |
| chatterbox_rif_donna_s2 | 23,7 s | 152 | 6 / 0,66 / 0,94 s | 124 s | 0,02 | «rogito» → «rugito» |
| chatterbox_rif_donna_s6 | 13,1 s | 156 | 2 / 0,59 / 0,72 s | 60 s | 0 | — |
| chatterbox_rif_uomo_s2 | 21,6 s | 166 | 6 / 0,75 / 1,00 s | 106 s | 0 | — |
| chatterbox_rif_uomo_s6 | 13,0 s | 157 | 3 / 0,58 / 0,91 s | 60 s | 0,06 | «e stato» → «è stata» |
| piper_serena_s2 | 17,6 s | 205 | 3 / 0,30 / 0,34 s | 3,6 s | 0 | — |
| piper_serena_s6 | 11,8 s | 173 | 1 / 0,26 / 0,26 s | 2,3 s | 0,03 | «le» → «i» |
| piper_paola_s2 | 16,6 s | 216 | 0 | 0,7 s | 0,05 | «prezzo» → «pezzo»; «nel rogito» → «nell'oggetto» |
| piper_paola_s6 | 11,8 s | 172 | 0 | 0,5 s | 0,18 | «partenza», «Osservatorio», «Immobiliare», «Entrate» storpiate |
| piper_riccardo_s2 | 18,8 s | 191 | 5 / 0,33 / 0,51 s | 0,5 s | 0,15 | più parole storpiate (es. «trattativa» → «tatta attiva») |
| piper_riccardo_s6 | 12,6 s | 162 | 1 / 0,30 s | 0,3 s | 0,21 | «Osservatorio», «Agenzia delle Entrate» storpiate |
| kokoro (4 file) | 12,7–20,1 s | 140–207 | vedi fase 1 precedente | 3–6 s | 0 | — |

Loudness misurata su tutti i file: tra -16,0 e -17,0 LUFS, picco ≤ -1,5 dBFS.

## Note tecniche per modello

**Qwen3-TTS VoiceDesign (Alibaba Qwen, Apache-2.0)**
- Supporta ufficialmente l'italiano. Non ha voci italiane predefinite: la voce si "progetta" con una descrizione testuale (nei file: voce adulta, timbro caldo, tono calmo e rassicurante, ritmo moderato). Non clona nessuna persona reale.
- Ritmo lento (126–139 parole al minuto): si può chiedere un ritmo più sostenuto nella descrizione.
- Una voce progettata può variare leggermente da una generazione all'altra. In produzione la si fissa: si genera un campione di riferimento e poi si usa il modello Qwen3-TTS *Base* (stessa licenza) per ripetere sempre lo stesso timbro su tutte le scene.
- Il più lento da generare: circa 5–6 s di calcolo per secondo di audio su CPU, quindi circa 25–30 minuti per l'intero modulo.

**Chatterbox Multilingual V3 (Resemble AI, MIT)**
- Supporta l'italiano. Non ha un pacchetto dedicato all'italiano (esistono solo per cinese, spagnolo, portoghese e hindi).
- Ogni file contiene un **watermark Perth inudibile** (MIT), rilevabile via software. Non limita l'uso commerciale.
- `default`: la voce integrata non è italiana; ho usato `cfg_weight = 0` come consiglia il README per non trasferire l'accento.
- `rif_*`: timbro preso dai campioni Qwen3. Così la voce resta uguale in tutte le scene (utile in fase 2).
- Il testo è generato frase per frase: le pause fino a 1 s comprendono i 0,35 s che ho inserito tra le frasi più il silenzio finale del modello. In fase 2 si regolano.
- La parola «rogito» è a rischio in due varianti su tre: in fase 2 la si può scrivere in `testo_per_voce` in forma fonetica (es. «ròghito» o «ròʤito» a seconda del modello).
- Nota d'installazione: il componente del watermark richiede `setuptools < 81` su Python 3.13; l'ho aggiunto (correzione d'installazione, il watermark resta attivo).

**Piper**
- `serena` (high): nessun errore evidente, ma ritmo molto veloce (205 parole al minuto) e pause brevi. Dataset sintetico generato con Qwen3-TTS, licenza CC-BY-4.0: va citato.
- `paola` e `riccardo`: varie parole storpiate e licenza non verificabile da qui (vedi `LICENZE.md`). Le sconsiglio.

**"O-emme-i"**: letta bene da Qwen3 donna, Chatterbox con riferimenti, Kokoro, Piper serena; dubbia in Qwen3 uomo e Chatterbox default. Da ascoltare.

## Esclusi per licenza

XTTS v2 (Coqui Public Model License, non commerciale) e F5-TTS (pesi CC-BY-NC): non installati né usati.
