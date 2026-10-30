import React from "react";
import { useVideoConfig } from "remotion";
import { fineFrase, inizioFrase, tempiScena } from "../data";
import { C, MARGINE, VERTICALE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Logo, Scena, Testo, Titolo, isVerticale } from "../components/Base";
import { IconaSpunta } from "../components/Icone";

const ID = 10;

// Ogni voce si spunta quando la voce la nomina (posizione nel testo della frase).
const VOCI = [
  { testo: "Visura e planimetria catastale", cerca: "visura" },
  { testo: "Anno di costruzione", cerca: "anno" },
  { testo: "Classe energetica", cerca: "classe" },
  { testo: "Spese di condominio", cerca: "spese" },
];

/** Secondi in più dopo la voce per la chiusura sul logo (spazio libero sotto per il pulsante della pagina ospitante). */
export const CHIUSURA_S = 2.5;

const quando = (cerca: string) => {
  const frase = tempiScena(ID).frasi[0].testo_originale.toLowerCase();
  const a = inizioFrase(ID, 0);
  const b = fineFrase(ID, 0);
  return a + (b - a) * (frase.indexOf(cerca) / frase.length);
};

const Strumento: React.FC<{ p: number; range: number; larghezza: number }> = ({ p, range, larghezza }) => (
  <div style={{ width: larghezza, borderRadius: 28, backgroundColor: "#fff", boxShadow: "0 20px 60px rgba(15,45,46,0.12)", overflow: "hidden", opacity: p, translate: `0px ${(1 - p) * 40}px` }}>
    <div style={{ height: 54, backgroundColor: C.neutral, display: "flex", alignItems: "center", paddingLeft: 24, gap: 12 }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: "rgba(15,45,46,0.25)" }} />
      ))}
    </div>
    <div style={{ padding: "36px 44px 48px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Testo peso={800}>Fascia di valore</Testo>
        <div style={{ backgroundColor: C.tiffany, borderRadius: 999, padding: "6px 22px" }}>
          <Testo peso={700}>esempio</Testo>
        </div>
      </div>
      <div style={{ position: "relative", height: 90, marginTop: 50 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 36, height: 18, borderRadius: 9, backgroundColor: C.neutral }} />
        <div style={{ position: "absolute", left: `${mix(50, 28, range)}%`, width: `${mix(0, 40, range)}%`, top: 20, height: 50, borderRadius: 25, backgroundColor: C.tiffany, border: `4px solid ${C.teal}`, boxSizing: "border-box" }} />
      </div>
    </div>
  </div>
);

/** Scena 10 — ANIM: checklist, schermata schematica dello strumento, chiusura sul logo. */
export const S10Checklist: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const { width, height } = useVideoConfig();
  const vert = isVerticale(width, height);
  const fineVoce = fineFrase(ID, 1) + 0.4;
  const contenuto = 1 - entra(t, fineVoce, 0.8);
  const chiusura = entra(t, fineVoce + 0.4, 1);
  const strumento = entra(t, inizioFrase(ID, 1) + 0.3, 1);
  const range = entra(t, inizioFrase(ID, 1) + 1.4, 1.6);
  const cta = entra(t, inizioFrase(ID, 1) + 2.2, 1);

  const lista = (
    <div>
      <Titolo size={72} style={{ opacity: entra(t, inizioFrase(ID, 0), 0.9) }}>Prima raccogli i dati</Titolo>
      {VOCI.map((v) => {
        const p = entra(t, quando(v.cerca) - 0.2, 0.7);
        return (
          <div key={v.testo} style={{ display: "flex", alignItems: "center", marginTop: 34, opacity: mix(0.35, 1, p) }}>
            <div style={{ width: 76, height: 76, borderRadius: 18, border: `4px solid ${C.teal}`, backgroundColor: p > 0.1 ? C.tiffany : "transparent", display: "flex", alignItems: "center", justifyContent: "center", marginRight: 28, flexShrink: 0 }}>
              <IconaSpunta size={60} progresso={p} spessore={7} />
            </div>
            <Testo peso={p > 0.5 ? 700 : 500}>{v.testo}</Testo>
          </div>
        );
      })}
    </div>
  );
  const invito = (
    <Testo peso={700} style={{ marginTop: 34, opacity: cta }}>
      Calcola la tua fascia di valore — predy.it
    </Testo>
  );

  return (
    <Scena sfondo={C.light} durata={durata}>
      <div style={{ position: "absolute", inset: 0, opacity: contenuto }}>
        {vert ? (
          <>
            <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: VERTICALE.alto + 60 }}>{lista}</div>
            <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 840 }}>
              <Strumento p={strumento} range={range} larghezza={width - 2 * MARGINE} />
              {invito}
            </div>
          </>
        ) : (
          <>
            <div style={{ position: "absolute", left: MARGINE, width: 820, top: 100 }}>{lista}</div>
            <div style={{ position: "absolute", left: 1000, right: MARGINE, top: 130 }}>
              <Strumento p={strumento} range={range} larghezza={840} />
              {invito}
            </div>
          </>
        )}
      </div>
      {/* chiusura: logo in alto, metà inferiore libera per il pulsante della pagina ospitante */}
      <div style={{ position: "absolute", left: 0, right: 0, top: vert ? 520 : 230, display: "flex", flexDirection: "column", alignItems: "center", opacity: chiusura, scale: String(mix(0.94, 1, chiusura)) }}>
        <Logo altezza={vert ? 200 : 170} />
        <Testo peso={700} colore={C.tealSoft} style={{ marginTop: 36 }}>predy.it</Testo>
      </div>
    </Scena>
  );
};
