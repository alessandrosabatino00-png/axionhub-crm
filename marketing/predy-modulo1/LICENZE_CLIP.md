# Licenze delle clip — Modulo 1

Una riga per ogni clip inserita in `clips/`. Archivi ammessi per le STOCK: Pexels, Pixabay, Coverr (licenze che consentono l'uso commerciale senza attribuzione obbligatoria; verifica comunque la pagina della singola clip).
Per le clip AI: strumento usato, data, e i termini che consentono l'uso commerciale.

Le clip Pixabay sono state cercate e scaricate con l'API ufficiale (https://pixabay.com/api/videos/); link e autore sono quelli restituiti dall'API (`pageURL`, `user`). Pixabay Content License: uso commerciale consentito, attribuzione non obbligatoria.
Le clip non trovate (cucina, sopralluogo, scena 9) sono state sostituite da animazioni disegnate (2026-10-30).

| File | Tipo | Fonte (link alla pagina della clip) | Autore | Licenza | Verificata il | Note (volti, insegne, marchi) |
|---|---|---|---|---|---|---|
| `s1_appartamento_ora_dorata.mp4` | STOCK | [pixabay.com/videos/id-51171](https://pixabay.com/videos/id-51171/) | caelan | Pixabay Content License | 2026-10-30 | Facciate di palazzi a Genova con persiane verdi, luce calda; controllati 6 fotogrammi a 1920x1080: nessuna persona, nessuna insegna, targa o scritta leggibile. Usati i primi 10 s, audio rimosso. |
| `s3_strada_negozi_tram.mp4` | STOCK | [pixabay.com/videos/id-53208](https://pixabay.com/videos/id-53208/) | svetjekolem | Pixabay Content License | 2026-10-30 | Tram su un ponte a Praga, ripresa da lontano (non è una via con negozi: su Pixabay le riprese di tram ad altezza strada hanno tutte numeri di linea, loghi o targhe leggibili). Sorgente 4K ritagliata a sinistra (2880x1620 → 1920x1080) per escludere la scritta sul battello che entra a destra nell'ultima parte; passanti minuscoli e non riconoscibili. Controllati fotogrammi a 4K e nel montaggio. |
| `s3_finestra_luce_salotto.mp4` | STOCK | [pixabay.com/videos/id-128321](https://pixabay.com/videos/id-128321/) | Leolo212 | Pixabay Content License | 2026-10-30 | Luce calda che entra da una finestra attraverso tende mosse dal vento, ombra di una sedia; nessuna persona, nessuna scritta. Sorgente 3840x2024 scalata e ritagliata a 1920x1080, primi 7 s, audio rimosso. |
| `s3_cucina_prima_dopo.mp4` | ANIM (sostituisce STOCK) | — | — | disegnata da codice (nessun asset di terze parti) | 2026-10-30 | Su Pixabay nessuna cucina reale adatta: sostituita da un'animazione «prima/dopo» (`predy-video/src/modulo1/components/AnimClip.tsx`). Se il file viene aggiunto in `clips/`, il video usa la clip. |
| `s7_professionista_sopralluogo.mp4` | ANIM (sostituisce STOCK) | — | — | disegnata da codice (nessun asset di terze parti) | 2026-10-30 | Su Pixabay nessuna ripresa adatta: sostituita da un salotto stilizzato con quote che si estendono. Se il file viene aggiunto in `clips/`, il video usa la clip. |
| `s9_cartello_in_vendita_timelapse.mp4` | ANIM (era AI) | — | — | disegnata da codice (nessun asset di terze parti) | 2026-10-30 | Nessuna clip adatta: sostituita da una facciata stilizzata con cartello senza scritte e luce che passa dall'autunno all'inverno. Se il file viene aggiunto in `clips/`, il video usa la clip. |
