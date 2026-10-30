import React from "react";
import { inizioFrase } from "../data";
import { C, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Scena, Testo, Titolo } from "../components/Base";

const ID = 6;

// Isolati della mappa stilizzata: [x, y, w, h, zona]
const ISOLATI: [number, number, number, number, number][] = [
  [0, 0, 220, 150, 0], [250, 0, 190, 150, 0], [470, 0, 290, 150, 1],
  [0, 180, 150, 230, 0], [180, 180, 260, 110, 1], [180, 320, 260, 90, 1], [470, 180, 140, 230, 2], [640, 180, 120, 230, 2],
  [0, 440, 300, 160, 1], [330, 440, 200, 160, 2], [560, 440, 200, 160, 2],
];
const COLORI_ZONA = [C.neutral, "rgba(167,230,216,0.55)", C.tiffany];

/** Scena 6 — ANIM (DA VERIFICARE): quotazioni OMI come fascia di riferimento, mai un numero. */
export const S06Omi: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const mappa = entra(t, f(0), 1.2);
  const zona = entra(t, f(0) + 1.8, 1);
  const fascia = entra(t, f(1) + 1.6, 1.4);
  const fonte = entra(t, f(1) + 0.4, 1);

  return (
    <Scena sfondo={C.light} durata={durata}>
      <svg width={780} height={620} viewBox="-10 -10 780 620" style={{ position: "absolute", left: MARGINE, top: 110 }}>
        {ISOLATI.map(([x, y, w, h, z], i) => {
          const p = entra(t, f(0) + 0.1 + i * 0.07, 0.8);
          return (
            <rect
              key={i}
              x={x}
              y={y}
              width={w}
              height={h}
              rx={14}
              fill={COLORI_ZONA[z]}
              opacity={p * (z === 2 ? 1 : mix(1, 0.45, zona))}
              stroke={z === 2 ? C.teal : "none"}
              strokeWidth={z === 2 ? mix(0, 5, zona) : 0}
            />
          );
        })}
        <circle cx={540} cy={300} r={22} fill={C.teal} opacity={mappa} />
        <circle cx={540} cy={300} r={mix(22, 60, zona)} fill="none" stroke={C.teal} strokeWidth={3} opacity={zona * 0.5} />
      </svg>
      <div style={{ position: "absolute", left: 980, right: MARGINE, top: 110 }}>
        <Titolo size={72} style={{ opacity: mappa }}>Quotazioni OMI</Titolo>
        <Testo colore={C.tealSoft} style={{ marginTop: 12, opacity: zona }}>per zona e stato di conservazione</Testo>
        {/* scala senza valori: solo la fascia evidenziata */}
        <div style={{ position: "relative", marginTop: 70, height: 150, opacity: entra(t, f(1), 0.9) }}>
          <div style={{ position: "absolute", left: 0, right: 0, top: 70, height: 18, borderRadius: 9, background: `linear-gradient(90deg, ${C.neutral}, rgba(15,45,46,0.25))` }} />
          <div
            style={{
              position: "absolute",
              left: `${mix(48, 30, fascia)}%`,
              width: `${mix(4, 36, fascia)}%`,
              top: 52,
              height: 54,
              borderRadius: 27,
              backgroundColor: C.tiffany,
              border: `4px solid ${C.teal}`,
              boxSizing: "border-box",
            }}
          />
          <Testo peso={700} style={{ position: "absolute", left: "30%", width: "36%", top: -14, textAlign: "center", opacity: fascia }}>
            fascia
          </Testo>
        </div>
        <div style={{ marginTop: 34, opacity: fonte }}>
          <Testo peso={700}>Fonte: OMI, Agenzia delle Entrate.</Testo>
          <Testo colore={C.tealSoft} style={{ marginTop: 10 }}>Fascia indicativa, non una perizia.</Testo>
        </div>
      </div>
    </Scena>
  );
};
