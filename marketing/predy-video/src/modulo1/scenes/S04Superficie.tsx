import React from "react";
import { fineFrase, inizioFrase } from "../data";
import { C, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Scena, Testo, Titolo } from "../components/Base";
import { IconaDocumento } from "../components/Icone";

const ID = 4;

/** Scena 4 — ANIM (DA VERIFICARE): superficie commerciale e calpestabile, planimetria stilizzata, nessuna cifra. */
export const S04Superficie: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const meta2 = (f(2) + fineFrase(ID, 2)) / 2;
  const contorno = entra(t, f(0) + 0.2, 2.2);
  const calpestabile = entra(t, f(1) + 0.3, 1);
  const muri = entra(t, f(2), 1);
  const accessori = entra(t, meta2 - 0.3, 1);
  const documenti = entra(t, f(3), 1);
  const titolo = entra(t, f(1), 1);

  // planimetria in coordinate locali 800x560
  const muro = 22;
  const legenda = [
    { colore: "rgba(167,230,216,0.75)", bordo: "none", testo: "Calpestabile", p: calpestabile },
    { colore: C.teal, bordo: "none", testo: "+ muri", p: muri },
    { colore: "url(#tratteggio)", bordo: `3px solid ${C.teal}`, testo: "+ balconi, cantine, box in percentuale", p: accessori },
  ];

  return (
    <Scena sfondo={C.light} durata={durata}>
      <Titolo size={60} style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 70, opacity: titolo }}>
        Superficie commerciale ≠ superficie calpestabile
      </Titolo>
      <svg width={820} height={600} viewBox="-10 -10 820 600" style={{ position: "absolute", left: MARGINE, top: 190 }}>
        <defs>
          <pattern id="tratteggio" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="16" height="16" fill={C.light} />
            <line x1="0" y1="0" x2="0" y2="16" stroke={C.tiffanyDeep} strokeWidth="7" />
          </pattern>
        </defs>
        {/* muri esterni e interni */}
        <g opacity={muri}>
          <path d={`M0 0 H560 V420 H0 Z M${muro} ${muro} V${420 - muro} H${560 - muro} V${muro} Z`} fill={C.teal} fillRule="evenodd" />
          <rect x={300} y={muro} width={14} height={240} fill={C.teal} />
          <rect x={muro} y={250} width={180} height={14} fill={C.teal} />
        </g>
        {/* superficie calpestabile */}
        <rect x={muro} y={muro} width={560 - 2 * muro} height={420 - 2 * muro} fill="rgba(167,230,216,0.75)" opacity={calpestabile} />
        <rect
          x={muro}
          y={muro}
          width={560 - 2 * muro}
          height={420 - 2 * muro}
          fill="none"
          stroke={C.teal}
          strokeWidth={4}
          strokeDasharray={2000}
          strokeDashoffset={2000 * (1 - contorno)}
          opacity={1 - muri * 0.6}
        />
        {/* accessori: balcone, cantina, box */}
        <g opacity={accessori}>
          <rect x={120} y={420} width={300} height={90} fill="url(#tratteggio)" stroke={C.teal} strokeWidth={4} />
          <rect x={600} y={20} width={180} height={150} fill="url(#tratteggio)" stroke={C.teal} strokeWidth={4} />
          <rect x={600} y={210} width={180} height={210} fill="url(#tratteggio)" stroke={C.teal} strokeWidth={4} />
        </g>
      </svg>
      <div style={{ position: "absolute", left: 1000, right: MARGINE, top: 230 }}>
        {legenda.map((l) => (
          <div key={l.testo} style={{ display: "flex", alignItems: "flex-start", marginBottom: 34, opacity: l.p, translate: `${(1 - l.p) * 30}px 0px` }}>
            <svg width={60} height={60} style={{ flexShrink: 0, marginRight: 26, marginTop: 4 }}>
              <defs>
                <pattern id="tratteggioLegenda" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <rect width="12" height="12" fill={C.light} />
                  <line x1="0" y1="0" x2="0" y2="12" stroke={C.tiffanyDeep} strokeWidth="6" />
                </pattern>
              </defs>
              <rect x={2} y={2} width={56} height={56} rx={8} fill={l.colore === "url(#tratteggio)" ? "url(#tratteggioLegenda)" : l.colore} stroke={l.bordo === "none" ? "none" : C.teal} strokeWidth={3} />
            </svg>
            <Testo peso={600}>{l.testo}</Testo>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", marginTop: 20, opacity: documenti, translate: `0px ${mix(20, 0, documenti)}px` }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", backgroundColor: C.tiffany, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 26, flexShrink: 0 }}>
            <IconaDocumento size={60} />
          </div>
          <Testo peso={700}>Visura e planimetria catastale</Testo>
        </div>
      </div>
    </Scena>
  );
};
