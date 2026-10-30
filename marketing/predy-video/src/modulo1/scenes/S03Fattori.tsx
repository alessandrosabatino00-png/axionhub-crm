import React from "react";
import { AbsoluteFill } from "remotion";
import { inizioFrase } from "../data";
import { C, FONT_TITOLI, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Clip, Scena, Testo } from "../components/Base";
import { IconaAccessori, IconaCondominio, IconaDocumento, IconaEnergia, IconaImpianti, IconaLuce, IconaZona } from "../components/Icone";

const ID = 3;

const VOCI = [
  { testo: "Zona e servizi", Icona: IconaZona },
  { testo: "Piano e luce", Icona: IconaLuce },
  { testo: "Stato e impianti", Icona: IconaImpianti },
  { testo: "Classe energetica", Icona: IconaEnergia },
  { testo: "Accessori", Icona: IconaAccessori },
  { testo: "Spese di condominio", Icona: IconaCondominio },
];

const PANNELLO = { left: MARGINE, top: 90, width: 900, height: 660 };

const Energetica: React.FC<{ t: number; da: number }> = ({ t, da }) => (
  <AbsoluteFill style={{ backgroundColor: C.light, padding: 60, justifyContent: "center" }}>
    {["A", "B", "C", "D", "E", "F", "G"].map((l, i) => {
      const p = entra(t, da + 0.15 + i * 0.12, 0.8);
      return (
        <div key={l} style={{ display: "flex", alignItems: "center", height: 72, marginBottom: 8 }}>
          <div
            style={{
              height: 64,
              width: mix(0, 300 + i * 70, p),
              backgroundColor: i < 3 ? C.teal : i < 5 ? C.tiffanyDeep : C.tiffany,
              opacity: 1 - i * 0.07,
              borderRadius: "10px 32px 32px 10px",
              display: "flex",
              alignItems: "center",
              paddingLeft: 22,
              boxSizing: "border-box",
              fontFamily: FONT_TITOLI,
              fontWeight: 800,
              fontSize: 56,
              color: i < 3 ? C.light : C.teal,
            }}
          >
            {p > 0.3 ? l : ""}
          </div>
        </div>
      );
    })}
  </AbsoluteFill>
);

const Accessori: React.FC<{ t: number; da: number }> = ({ t, da }) => (
  <AbsoluteFill style={{ backgroundColor: C.light, flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
    {["Balcone", "Cantina", "Box"].map((n, i) => {
      const p = entra(t, da + 0.2 + i * 0.35, 0.8);
      return (
        <div key={n} style={{ textAlign: "center", opacity: p, translate: `0px ${(1 - p) * 30}px` }}>
          <div style={{ width: 170, height: 170, borderRadius: "50%", backgroundColor: C.tiffany, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <IconaAccessori size={96} />
          </div>
          <Testo peso={700}>{n}</Testo>
        </div>
      );
    })}
  </AbsoluteFill>
);

const Regolamento: React.FC<{ t: number; da: number }> = ({ t, da }) => {
  const p = entra(t, da + 0.2, 1);
  return (
    <AbsoluteFill style={{ backgroundColor: C.light, justifyContent: "center", alignItems: "center" }}>
      <div style={{ opacity: p, scale: String(mix(0.92, 1, p)), textAlign: "center" }}>
        <div style={{ width: 300, height: 360, margin: "0 auto", backgroundColor: "#fff", borderRadius: 18, boxShadow: "0 18px 50px rgba(15,45,46,0.14)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconaDocumento size={190} />
        </div>
        <Testo peso={700} style={{ marginTop: 36 }}>
          Regolamento condominiale
        </Testo>
      </div>
    </AbsoluteFill>
  );
};

/** Scena 3 — STOCK+ANIM: gli elementi che fanno il valore; un'icona si accende per ogni voce. */
export const S03Fattori: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  // frase 0 = introduzione; frasi 1..6 = una voce ciascuna
  const inizio = (k: number) => inizioFrase(ID, k);
  const pannelli: { da: number; nodo: React.ReactNode }[] = [
    { da: 0, nodo: <Clip file="s3_strada_negozi_tram.mp4" durata={inizio(2)} style={{ inset: 0 }} /> },
    { da: inizio(2), nodo: <Clip file="s3_finestra_luce_salotto.mp4" durata={inizio(3) - inizio(2)} style={{ inset: 0 }} /> },
    { da: inizio(3), nodo: <Clip file="s3_cucina_prima_dopo.mp4" durata={inizio(4) - inizio(3)} style={{ inset: 0 }} /> },
    { da: inizio(4), nodo: <Energetica t={t} da={inizio(4)} /> },
    { da: inizio(5), nodo: <Accessori t={t} da={inizio(5)} /> },
    { da: inizio(6), nodo: <Regolamento t={t} da={inizio(6)} /> },
  ];

  return (
    <Scena sfondo={C.light} durata={durata}>
      <div style={{ position: "absolute", ...PANNELLO, borderRadius: 28, overflow: "hidden", backgroundColor: C.neutral, opacity: entra(t, 0.1, 0.9) }}>
        {pannelli.map((p, i) => {
          const fine = pannelli[i + 1]?.da ?? durata + 1;
          const visibile = Math.min(entra(t, p.da - (i ? 0.3 : 0), 0.6), 1 - entra(t, fine, 0.6));
          if (visibile <= 0) return null;
          return (
            <AbsoluteFill key={i} style={{ opacity: visibile }}>
              {p.nodo}
            </AbsoluteFill>
          );
        })}
      </div>
      <div style={{ position: "absolute", left: 1080, right: MARGINE, top: 92 }}>
        {VOCI.map(({ testo, Icona }, i) => {
          const accesa = entra(t, inizio(i + 1), 0.7);
          const corrente = i + 1 < 6 ? Math.min(accesa, 1 - entra(t, inizio(i + 2), 0.6)) : accesa;
          return (
            <div key={testo} style={{ display: "flex", alignItems: "center", height: 110, opacity: mix(0.28, 1, accesa) }}>
              <div
                style={{
                  width: 88,
                  height: 88,
                  borderRadius: "50%",
                  backgroundColor: corrente > 0 ? `rgba(167,230,216,${mix(0.35, 1, corrente)})` : "transparent",
                  border: `3px solid ${accesa > 0.5 ? C.tiffany : "rgba(15,45,46,0.25)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 28,
                  flexShrink: 0,
                }}
              >
                <Icona size={52} />
              </div>
              <Testo peso={corrente > 0.5 ? 700 : 500}>{testo}</Testo>
            </div>
          );
        })}
      </div>
    </Scena>
  );
};
