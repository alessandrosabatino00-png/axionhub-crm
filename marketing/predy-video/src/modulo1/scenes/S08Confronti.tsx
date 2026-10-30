import React from "react";
import { inizioFrase } from "../data";
import { C, FONT_TITOLI, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Scena, Testo, Titolo } from "../components/Base";
import { IconaZona } from "../components/Icone";

const ID = 8;

const VICINE = [0.44, 0.5, 0.55];
const LONTANE = [0.14, 0.5, 0.87];

/** Scena 8 — ANIM: tre segnaposto su una scala di prezzo, prima vicini poi distanti. */
export const S08Confronti: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const pin = (i: number) => entra(t, f(0) + 0.8 + i * 0.4, 0.8);
  const area = Math.min(entra(t, f(1) + 0.4, 0.9), 1 - entra(t, f(2), 0.7));
  const allarga = entra(t, f(2), 1.6);
  const domanda = entra(t, f(2) + 1.4, 0.9);
  const x0 = 160;
  const L = 1920 - 2 * x0;
  const pos = (i: number) => x0 + L * mix(VICINE[i], LONTANE[i], allarga);

  return (
    <Scena sfondo={C.light} durata={durata}>
      <Titolo size={88} style={{ position: "absolute", left: MARGINE, top: 90, opacity: entra(t, f(0), 1) }}>
        2-3 confronti
      </Titolo>
      {/* scala di prezzo, senza valori */}
      <div style={{ position: "absolute", left: x0, width: L, top: 470, height: 16, borderRadius: 8, background: `linear-gradient(90deg, ${C.neutral}, rgba(15,45,46,0.3))`, opacity: entra(t, f(0) + 0.3, 0.9) }} />
      <div
        style={{
          position: "absolute",
          left: x0 + L * VICINE[0] - 60,
          width: L * (VICINE[2] - VICINE[0]) + 120,
          top: 440,
          height: 76,
          borderRadius: 38,
          backgroundColor: C.tiffany,
          opacity: area * 0.9,
        }}
      />
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ position: "absolute", left: pos(i) - 40, top: 360, opacity: pin(i), translate: `0px ${(1 - pin(i)) * -30}px` }}>
          <IconaZona size={80} spessore={5} />
        </div>
      ))}
      <Testo peso={700} style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 600, textAlign: "center", opacity: area }}>
        Cifre vicine = area affidabile
      </Testo>
      <div
        style={{
          position: "absolute",
          left: 960 - 60,
          top: 210,
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: C.teal,
          color: C.tiffany,
          fontFamily: FONT_TITOLI,
          fontWeight: 800,
          fontSize: 84,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: domanda,
          scale: String(mix(0.7, 1, domanda)),
        }}
      >
        ?
      </div>
      <Testo peso={700} style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 600, textAlign: "center", opacity: domanda }}>
        Cifre lontane = chiedi perché
      </Testo>
    </Scena>
  );
};
