import React from "react";
import { useVideoConfig } from "remotion";
import { inizioFrase } from "../data";
import { C, FONT_TESTO, MARGINE } from "../theme";
import { entra, useT } from "../components/anim";
import { Chevron, Scena, Testo, isVerticale } from "../components/Base";

const ID = 2;

// Altezze relative, senza valori numerici: la terza colonna è leggermente più bassa della seconda.
const COLONNE = [
  { etichetta: "Valore", definizione: "Quanto vale per il mercato, oggi", h: 0.8, colore: C.tiffany, frase: 1 },
  { etichetta: "Prezzo di annuncio", definizione: "Quanto decidi di chiedere", h: 1, colore: C.neutral, frase: 2 },
  { etichetta: "Prezzo di vendita", definizione: "Quello scritto nel rogito", h: 0.9, colore: C.teal, frase: 3 },
];

/** Scena 2 — ANIM: valore, prezzo di annuncio, prezzo di vendita. */
export const S02ValorePrezzo: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const { width, height } = useVideoConfig();
  const vert = isVerticale(width, height);
  const trattativa = entra(t, inizioFrase(ID, 4) + 0.6, 1.0);

  if (vert) {
    const larghezza = width - 2 * MARGINE;
    return (
      <Scena sfondo={C.light} durata={durata}>
        <Chevron colore={C.tiffany} opacita={0.25} />
        {COLONNE.map((c, i) => {
          const p = entra(t, inizioFrase(ID, c.frase), 1.0);
          const crescita = entra(t, inizioFrase(ID, c.frase) + 0.2, 1.6);
          const top = 230 + i * 420;
          return (
            <div key={c.etichetta} style={{ position: "absolute", left: MARGINE, top, width: larghezza, opacity: p }}>
              <Testo peso={700}>{c.etichetta}</Testo>
              <div style={{ position: "relative", marginTop: 22, height: 64, width: larghezza }}>
                <div style={{ position: "absolute", left: 0, top: 0, height: 64, width: larghezza * c.h * crescita, backgroundColor: c.colore, borderRadius: 14, border: c.colore === C.neutral ? `4px solid ${C.teal}` : "none", boxSizing: "border-box" }} />
                {i === 2 ? (
                  <div style={{ position: "absolute", left: larghezza * c.h, top: 0, height: 64, width: larghezza * (1 - c.h), border: `4px dashed ${C.tiffanyDeep}`, borderRadius: 14, boxSizing: "border-box", opacity: trattativa }} />
                ) : null}
              </div>
              <Testo colore={C.tealSoft} style={{ marginTop: 18 }}>{c.definizione}</Testo>
              {i === 2 ? (
                <Testo peso={700} colore={C.tiffanyDeep} style={{ marginTop: 14, opacity: trattativa, textAlign: "right" }}>
                  ↑ trattativa
                </Testo>
              ) : null}
            </div>
          );
        })}
      </Scena>
    );
  }

  const slot = (width - 2 * MARGINE) / 3;
  const base = 560;
  const hMax = 380;
  const largBarra = 300;
  const cx = (i: number) => MARGINE + slot * i + slot / 2;
  const top2 = base - hMax * COLONNE[1].h;
  const top3 = base - hMax * COLONNE[2].h;

  return (
    <Scena sfondo={C.light} durata={durata}>
      <Chevron colore={C.tiffany} opacita={0.25} />
      <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: base, height: 4, backgroundColor: C.teal, opacity: entra(t, 0.3, 1) * 0.3 }} />
      {COLONNE.map((c, i) => {
        const p = entra(t, inizioFrase(ID, c.frase), 1.0);
        const crescita = entra(t, inizioFrase(ID, c.frase) + 0.15, 1.6);
        const h = hMax * c.h * crescita;
        return (
          <React.Fragment key={c.etichetta}>
            <div
              style={{
                position: "absolute",
                left: cx(i) - largBarra / 2,
                top: base - h,
                width: largBarra,
                height: h,
                backgroundColor: c.colore,
                borderRadius: "18px 18px 0 0",
                border: c.colore === C.neutral ? `4px solid ${C.teal}` : "none",
                borderBottom: "none",
                boxSizing: "border-box",
                opacity: p,
              }}
            />
            <div style={{ position: "absolute", left: cx(i) - slot / 2 + 10, width: slot - 20, top: base + 26, textAlign: "center", opacity: p, translate: `0px ${(1 - p) * 20}px` }}>
              <Testo peso={700}>{c.etichetta}</Testo>
              <Testo colore={C.tealSoft} style={{ marginTop: 8 }}>
                {c.definizione}
              </Testo>
            </div>
          </React.Fragment>
        );
      })}
      {/* la trattativa: dal prezzo di annuncio al prezzo di vendita */}
      <svg width={width} height={height} style={{ position: "absolute", inset: 0, opacity: trattativa }}>
        <path
          d={`M${cx(1) + largBarra / 2 - 30} ${top2 - 20} C ${cx(1) + slot * 0.45} ${top2 - 90}, ${cx(2) - slot * 0.2} ${top3 - 90}, ${cx(2) - 40} ${top3 - 18}`}
          fill="none"
          stroke={C.tiffanyDeep}
          strokeWidth={6}
          strokeDasharray="14 12"
          strokeLinecap="round"
        />
        <path d={`M${cx(2) - 62} ${top3 - 36} L${cx(2) - 38} ${top3 - 14} L${cx(2) - 70} ${top3 - 6}`} fill="none" stroke={C.tiffanyDeep} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ position: "absolute", left: cx(1) + 40, width: slot, top: top2 - 170, textAlign: "center", opacity: trattativa, fontFamily: FONT_TESTO, fontWeight: 700, fontSize: 56, color: C.teal }}>
        trattativa
      </div>
    </Scena>
  );
};
