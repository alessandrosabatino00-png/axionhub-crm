# Clip da procurare — Modulo 1

Nel video attuale tutte le clip sono sostituite da un segnaposto con i colori del brand e il nome del file.
Per inserirle: salva il file in `clips/` con il nome esatto qui sotto, poi in `marketing/predy-video` esegui `npm run render:modulo1` (oppure `npm run dev` per l'anteprima).

Regole per tutte le clip:
- niente volti riconoscibili, niente insegne, targhe o marchi leggibili;
- orizzontale 16:9, almeno 1920x1080, meglio 4K; senza audio (l'audio della clip viene comunque silenziato);
- movimento lento o camera fissa; luce naturale e calda, colori non saturi (il grading uniforme viene applicato nel montaggio);
- **STOCK**: solo da Pexels, Pixabay o Coverr; registra link, autore e licenza in `LICENZE_CLIP.md`;
- **AI**: genera con il prompt indicato, con uno strumento i cui termini consentano l'uso commerciale del risultato, e annota strumento e termini in `LICENZE_CLIP.md`.

## Stato al 2026-10-30

Inserite da Pixabay: `s1_appartamento_ora_dorata.mp4`, `s3_strada_negozi_tram.mp4`, `s3_finestra_luce_salotto.mp4` (dettagli in `LICENZE_CLIP.md`).
Ancora da procurare (segnaposto nel video): `s3_cucina_prima_dopo.mp4`, `s7_professionista_sopralluogo.mp4`, `s9_cartello_in_vendita_timelapse.mp4`; su Pixabay non c'era nulla che rispettasse le regole qui sotto.
La scena 9 è passata da AI a STOCK: il prompt AI resta in fondo come riferimento, se si decide di tornare alla generazione.

La durata minima è quella effettivamente mostrata nel montaggio (da `tempi.json`) più circa un secondo di margine.
Se la clip è più corta, viene ripetuta in loop.

| Scena | Tipo | Nome file | Descrizione | Durata minima |
|---|---|---|---|---|
| 1 | STOCK | `s1_appartamento_ora_dorata.mp4` | Facciata di un condominio residenziale italiano all'ora dorata, carrellata lenta laterale o in avvicinamento, da fuori. Nessuna persona riconoscibile, nessuna insegna. La parte sinistra dell'inquadratura verrà coperta dal titolo: meglio il soggetto a destra. | 8 s |
| 3 | STOCK | `s3_strada_negozi_tram.mp4` | Via urbana italiana con negozi e un tram che passa, ripresa da lontano o ad altezza strada; vetrine senza scritte leggibili, passanti non riconoscibili (di spalle o sfocati). | 8 s |
| 3 | STOCK | `s3_finestra_luce_salotto.mp4` | Luce naturale che entra da una finestra in un salotto luminoso, camera fissa o movimento lento; nessuna persona. | 5 s |
| 3 | STOCK | `s3_cucina_prima_dopo.mp4` | Cucina da ristrutturare che si dissolve nella stessa cucina rinnovata (stessa inquadratura). Se non esiste già montata, servono due clip della stessa cucina da unire con una dissolvenza; nessuna persona. | 4 s |
| 7 | STOCK | `s7_professionista_sopralluogo.mp4` | Persona di spalle o inquadrata dalle mani in giù che prende misure in un salotto con un metro laser o a nastro; volto non visibile, nessun logo su abiti o strumenti. | 4 s |
| 9 | STOCK (era AI) | `s9_cartello_in_vendita_timelapse.mp4` | Time-lapse di un cartello "in vendita"/"affitto" su una facciata, la luce cambia; senza scritte leggibili. In mancanza: facciata residenziale italiana con luce che cambia. | 6 s |

## Prompt AI (scena 9, non più usato: la scena è passata a STOCK)

**`s9_cartello_in_vendita_timelapse.mp4`** (da `scene.json`):

> Time-lapse di un cartello 'in vendita' su una facciata di palazzo in una via italiana, nessuna scritta leggibile, nessuna persona, luce naturale che passa dall'autunno all'inverno, inquadratura fissa, toni caldi e naturali, 6 secondi.

Versione inglese, per gli strumenti che rendono meglio in inglese:

> Fixed-camera time-lapse of a blank "for sale" sign on the facade of an Italian apartment building on a quiet street, no readable text anywhere, no people, natural light shifting from autumn to winter, warm natural tones, 16:9, 6 seconds.
