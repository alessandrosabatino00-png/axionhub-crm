import React from "react";
import { AbsoluteFill } from "remotion";
import { inizioFrase } from "../data";
import { C, MARGINE } from "../theme";
import { entra, mix, useT } from "../components/anim";
import { Scena, Testo } from "../components/Base";
import { ClipOAnimazione } from "../components/AnimClip";

const ID = 9;

/** Scena 9 — AI+ANIM: cartello "in vendita" nel tempo, poi bilancia e margine di trattativa. */
export const S09Prezzo: React.FC<{ durata: number }> = ({ durata }) => {
  const t = useT();
  const f = (k: number) => inizioFrase(ID, k);
  const clip = 1 - entra(t, f(0) + 2.2, 0.8);
  const bilancia = Math.min(entra(t, f(0) + 2.4, 0.9), 1 - entra(t, f(2) - 0.2, 0.8));
  // la bilancia pende prima verso "troppo alto", poi verso "troppo basso"
  const angolo = mix(0, -9, entra(t, f(0) + 2.6, 1.4)) + mix(0, 18, entra(t, f(1), 1.6));
  const alto = entra(t, f(0) + 2.8, 0.9);
  const basso = entra(t, f(1) + 0.3, 0.9);
  const margine = entra(t, f(2) + 0.4, 1);
  const segmento = entra(t, f(2) + 1.4, 1.4);
  const rad = (angolo * Math.PI) / 180;
  const braccio = 420;
  const yA = 330 - Math.sin(rad) * braccio;
  const yB = 330 + Math.sin(rad) * braccio;

  return (
    <Scena sfondo={C.light} durata={durata}>
      <AbsoluteFill style={{ opacity: bilancia }}>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M960 330 L900 620 H1020 Z" fill={C.neutral} />
          <g transform={`rotate(${angolo} 960 330)`}>
            <rect x={960 - braccio - 20} y={322} width={2 * braccio + 40} height={16} rx={8} fill={C.teal} />
          </g>
          <circle cx={960} cy={330} r={18} fill={C.tiffanyDeep} />
          {[
            { x: 960 - Math.cos(rad) * braccio, y: yA },
            { x: 960 + Math.cos(rad) * braccio, y: yB },
          ].map((p, i) => (
            <g key={i}>
              <line x1={p.x} y1={p.y} x2={p.x} y2={p.y + 90} stroke={C.teal} strokeWidth={4} />
              <path d={`M${p.x - 110} ${p.y + 90} Q ${p.x} ${p.y + 160} ${p.x + 110} ${p.y + 90} Z`} fill={i === 0 ? C.tiffany : C.neutral} stroke={C.teal} strokeWidth={4} />
            </g>
          ))}
        </svg>
        <div style={{ position: "absolute", left: MARGINE, width: 700, top: 640, opacity: alto }}>
          <Testo peso={800}>Troppo alto:</Testo>
          <Testo colore={C.tealSoft}>tempi lunghi</Testo>
        </div>
        <div style={{ position: "absolute", right: MARGINE, width: 700, top: 640, textAlign: "right", opacity: basso }}>
          <Testo peso={800}>Troppo basso:</Testo>
          <Testo colore={C.tealSoft}>perdi valore</Testo>
        </div>
      </AbsoluteFill>

      {/* margine di trattativa */}
      <div style={{ position: "absolute", left: MARGINE, right: MARGINE, top: 200, opacity: margine }}>
        <Testo size={72} peso={800}>Lascia margine di trattativa</Testo>
        <div style={{ position: "relative", marginTop: 90, height: 90 }}>
          <div style={{ position: "absolute", left: 0, width: "100%", top: 0, height: 90, borderRadius: 20, backgroundColor: C.neutral }} />
          <div style={{ position: "absolute", left: 0, width: `${mix(100, 82, segmento)}%`, top: 0, height: 90, borderRadius: 20, backgroundColor: C.teal }} />
          <div style={{ position: "absolute", left: "82%", width: "18%", top: 0, height: 90, borderRadius: "0 20px 20px 0", border: `5px dashed ${C.tiffanyDeep}`, boxSizing: "border-box", backgroundColor: C.tiffany, opacity: segmento }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 26 }}>
          <Testo colore={C.tealSoft} style={{ opacity: segmento }}>prezzo che ti aspetti</Testo>
          <Testo peso={700} style={{ opacity: segmento }}>trattativa</Testo>
        </div>
      </div>

      {clip > 0 ? (
        <AbsoluteFill style={{ opacity: clip }}>
          <ClipOAnimazione file="s9_cartello_in_vendita_timelapse.mp4" durata={f(0) + 3} zoom={[1, 1.03]} style={{ inset: 0 }} />
        </AbsoluteFill>
      ) : null}
    </Scena>
  );
};
