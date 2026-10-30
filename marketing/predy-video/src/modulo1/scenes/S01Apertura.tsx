import React from "react";
import { AbsoluteFill, useVideoConfig } from "remotion";
import { fineFrase, inizioFrase } from "../data";
import { C, FONT_TITOLI, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Clip, Scena, Titolo, isVerticale } from "../components/Base";

const ID = 1;

/** Scena 1 — STOCK+ANIM: appartamento all'ora dorata, il simbolo del prezzo diventa un punto interrogativo. */
export const S01Apertura: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const { width, height } = useVideoConfig();
  const vert = isVerticale(width, height);
  const titolo = entra(t, inizioFrase(ID, 1), 1.1);
  // il "€" si trasforma in "?" mentre la voce chiede "quanto vale?"
  const morph = entra(t, fineFrase(ID, 1) - 1.2, 1.0);
  const cerchio = entra(t, inizioFrase(ID, 0) + 0.4, 1.0);
  const lato = vert ? 260 : 220;

  return (
    <Scena sfondo={C.teal} durata={durata}>
      <Clip file="s1_appartamento_ora_dorata.mp4" durata={durata} zoom={[1.02, 1.1]} style={{ inset: 0 }} />
      <AbsoluteFill
        style={{
          background: vert
            ? "linear-gradient(180deg, rgba(15,45,46,0.15) 0%, rgba(15,45,46,0.78) 55%, rgba(15,45,46,0.9) 100%)"
            : "linear-gradient(90deg, rgba(15,45,46,0.9) 0%, rgba(15,45,46,0.7) 45%, rgba(15,45,46,0.05) 80%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: MARGINE,
          top: vert ? 470 : 190,
          width: lato,
          height: lato,
          borderRadius: "50%",
          backgroundColor: C.tiffany,
          opacity: cerchio,
          scale: String(mix(0.85, 1, cerchio)),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: FONT_TITOLI,
          fontWeight: 800,
          fontSize: lato * 0.62,
          color: C.teal,
        }}
      >
        <span style={{ position: "absolute", opacity: 1 - morph, rotate: `${morph * -40}deg`, scale: String(1 - morph * 0.4) }}>€</span>
        <span style={{ position: "absolute", opacity: morph, rotate: `${(1 - morph) * 40}deg`, scale: String(0.6 + morph * 0.4) }}>?</span>
      </div>
      <Titolo
        size={vert ? 116 : 112}
        colore={C.light}
        style={{
          position: "absolute",
          left: MARGINE,
          top: vert ? 800 : 470,
          width: vert ? width - 2 * MARGINE : 1100,
          opacity: titolo,
          translate: `0px ${(1 - titolo) * 40}px`,
        }}
      >
        Quanto vale la tua casa?
      </Titolo>
    </Scena>
  );
};
