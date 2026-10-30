import React from "react";
import { inizioFrase } from "../data";
import { C, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Scena, Testo, Titolo } from "../components/Base";
import { IconaAffitto, IconaCasa, IconaCosto } from "../components/Icone";

const ID = 5;

const SIMILI = [
  { x: 360, etichetta: "piano più alto" },
  { x: 960, etichetta: "da ristrutturare" },
  { x: 1560, etichetta: "più piccola" },
];

/** Scena 5 — ANIM (DA VERIFICARE): stima per confronto, poi gli altri metodi. */
export const S05Confronto: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const intro = Math.min(entra(t, f(0), 0.9), 1 - entra(t, f(1) + 1.6, 0.8));
  const schema = Math.min(entra(t, f(1) + 1.4, 0.9), 1 - entra(t, f(2), 0.8));
  const altri = entra(t, f(2) + 0.5, 1);

  return (
    <Scena sfondo={C.light} durata={durata}>
      {/* titolo: stima per confronto */}
      <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 230, textAlign: "center", opacity: intro, translate: `0px ${(1 - intro) * 30}px` }}>
        <Titolo size={96}>Stima per confronto</Titolo>
        <Testo size={60} colore={C.tealSoft} style={{ marginTop: 28 }}>
          immobili simili · venduti di recente · stessa zona
        </Testo>
      </div>

      {/* schema: tre case simili e la tua al centro */}
      <div style={{ position: "absolute", inset: 0, opacity: schema }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          {SIMILI.map((s, i) => {
            const p = entra(t, f(1) + 1.9 + i * 0.45, 0.9);
            return (
              <path
                key={s.x}
                d={`M${s.x} 400 Q ${mix(s.x, 960, 0.5)} ${i === 1 ? 470 : 520} 960 ${560}`}
                fill="none"
                stroke={C.tiffanyDeep}
                strokeWidth={5}
                strokeDasharray="12 10"
                opacity={p}
              />
            );
          })}
        </svg>
        {SIMILI.map((s, i) => {
          const p = entra(t, f(1) + 1.6 + i * 0.45, 0.9);
          return (
            <div key={s.x} style={{ position: "absolute", left: s.x - 260, width: 520, top: 110, textAlign: "center", opacity: p, translate: `0px ${(1 - p) * 24}px` }}>
              <div style={{ width: 150, height: 150, margin: "0 auto", borderRadius: 28, backgroundColor: C.neutral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconaCasa size={100} />
              </div>
              <Testo peso={600} style={{ marginTop: 16 }}>{s.etichetta}</Testo>
            </div>
          );
        })}
        <div style={{ position: "absolute", left: 960 - 110, top: 560, width: 220, height: 220, borderRadius: 40, backgroundColor: C.tiffany, display: "flex", alignItems: "center", justifyContent: "center", scale: String(mix(0.85, 1, schema)) }}>
          <IconaCasa size={150} />
        </div>
        <Testo peso={800} style={{ position: "absolute", left: 1110, top: 630 }}>
          La tua casa
        </Testo>
      </div>

      {/* altri metodi, per casi particolari */}
      <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 170, opacity: altri, display: "flex", justifyContent: "center", gap: 140 }}>
        {[
          { Icona: IconaCosto, testo: "Costo di ricostruzione" },
          { Icona: IconaAffitto, testo: "Reddito da affitto" },
        ].map(({ Icona, testo }, i) => {
          const p = entra(t, f(2) + 0.6 + i * 0.6, 0.9);
          return (
            <div key={testo} style={{ width: 640, textAlign: "center", opacity: p, translate: `0px ${(1 - p) * 24}px` }}>
              <div style={{ width: 170, height: 170, margin: "0 auto", borderRadius: "50%", backgroundColor: C.neutral, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icona size={100} />
              </div>
              <Testo peso={700} style={{ marginTop: 24 }}>{testo}</Testo>
            </div>
          );
        })}
      </div>
      <Testo colore={C.tealSoft} style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 560, textAlign: "center", opacity: entra(t, f(2) + 2.2, 1) }}>
        Solo in casi particolari
      </Testo>
    </Scena>
  );
};
