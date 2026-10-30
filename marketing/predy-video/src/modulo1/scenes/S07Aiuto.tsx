import React from "react";
import { AbsoluteFill } from "remotion";
import { inizioFrase } from "../data";
import { C, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Clip, Scena, Testo, Titolo } from "../components/Base";
import { IconaAgenzia, IconaOnline, IconaPerizia } from "../components/Icone";

const ID = 7;

const CARD = [
  { Icona: IconaAgenzia, titolo: "Valutazione di un'agenzia", nota: "mercato locale", frase: 1 },
  { Icona: IconaPerizia, titolo: "Perizia di un tecnico", nota: "documento firmato", frase: 2 },
  { Icona: IconaOnline, titolo: "Strumenti online", nota: "solo un'indicazione", frase: 3 },
];

/** Scena 7 — STOCK+ANIM (DA VERIFICARE): tre modi per farsi aiutare, poi la domanda da fare sempre. */
export const S07Aiuto: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const clip = 1 - entra(t, f(1) - 0.4, 0.8);
  const domanda = entra(t, f(4), 1);
  const largCard = (1920 - 2 * MARGINE - 2 * 60) / 3;

  return (
    <Scena sfondo={C.light} durata={durata}>
      {CARD.map(({ Icona, titolo, nota, frase }, i) => {
        const p = entra(t, f(frase), 1);
        return (
          <div
            key={titolo}
            style={{
              position: "absolute",
              left: MARGINE + i * (largCard + 60),
              width: largCard,
              top: mix(140, 90, domanda),
              height: 400,
              borderRadius: 28,
              backgroundColor: "#fff",
              boxShadow: "0 20px 60px rgba(15,45,46,0.10)",
              padding: "44px 40px",
              boxSizing: "border-box",
              opacity: p * mix(1, 0.35, domanda),
              translate: `0px ${(1 - p) * 40}px`,
              scale: String(mix(1, 0.9, domanda)),
            }}
          >
            <div style={{ width: 110, height: 110, borderRadius: "50%", backgroundColor: C.tiffany, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icona size={64} />
            </div>
            <Testo peso={800} style={{ marginTop: 28 }}>{titolo}</Testo>
            <Testo colore={C.tealSoft} style={{ marginTop: 10 }}>{nota}</Testo>
          </div>
        );
      })}
      <div
        style={{
          position: "absolute",
          left: 260,
          right: 260,
          top: 560,
          borderRadius: 32,
          backgroundColor: C.teal,
          padding: "44px 60px 52px",
          textAlign: "center",
          opacity: domanda,
          translate: `0px ${(1 - domanda) * 40}px`,
        }}
      >
        <Testo colore={C.tiffany} peso={600}>Chiedi sempre:</Testo>
        <Titolo size={80} colore={C.light} style={{ marginTop: 14 }}>
          su quali immobili si basa?
        </Titolo>
      </div>
      {clip > 0 ? (
        <AbsoluteFill style={{ opacity: clip }}>
          <Clip file="s7_professionista_sopralluogo.mp4" durata={f(1) + 0.4} style={{ inset: 0 }} />
        </AbsoluteFill>
      ) : null}
    </Scena>
  );
};
