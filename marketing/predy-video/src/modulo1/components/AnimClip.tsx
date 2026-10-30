import React from "react";
import { AbsoluteFill } from "remotion";
import { CLIP_PRESENTI } from "../data";
import { C } from "../theme";
import { entra, mix, useT } from "./anim";
import { Clip, Testo } from "./Base";

// Animazioni disegnate al posto delle clip che non si sono trovate con licenza adatta.
// Se il file della clip viene aggiunto in predy-modulo1/clips, si usa la clip vera.

const mixColore = (a: string, b: string, p: number) => {
  const h = (s: string) => [1, 3, 5].map((i) => parseInt(s.slice(i, i + 2), 16));
  const A = h(a);
  const B = h(b);
  return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], p))).join(",")})`;
};

/** Scena 3: la stessa cucina, prima da ristrutturare e poi rinnovata (tendina da sinistra a destra). */
const CucinaPrimaDopo: React.FC<{ durata: number; da: number }> = ({ durata, da }) => {
  const t = useT() - da;
  const p = entra(t, Math.min(0.5, durata * 0.2), Math.max(1, durata * 0.55));
  const cucina = (rinnovata: boolean) => {
    const mobili = rinnovata ? C.teal : "#B9B2A6";
    const ante = rinnovata ? "#1E4445" : "#A39B8E";
    const parete = rinnovata ? C.light : "#D9D3C8";
    const piastrelle = rinnovata ? C.tiffany : "#C9C1B3";
    return (
      <svg viewBox="0 0 900 660" width="100%" height="100%" preserveAspectRatio="xMidYMid slice">
        <rect width="900" height="660" fill={parete} />
        <rect x="560" y="70" width="240" height="190" rx="8" fill={rinnovata ? "#DDF3EE" : "#C7CFCD"} stroke={rinnovata ? C.teal : "#8F887C"} strokeWidth="10" />
        <line x1="680" y1="70" x2="680" y2="260" stroke={rinnovata ? C.teal : "#8F887C"} strokeWidth="8" />
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <rect x={70 + i * 150} y="60" width="140" height="170" rx="6" fill={mobili} />
            <rect x={82 + i * 150} y="72" width="116" height="146" rx="4" fill={ante} transform={!rinnovata && i === 1 ? "rotate(4 140 145)" : undefined} />
          </g>
        ))}
        <rect x="60" y="300" width="780" height="110" fill={piastrelle} />
        {!rinnovata
          ? [0, 1, 2, 3, 4, 5, 6, 7].map((i) => <line key={i} x1={60 + i * 98} y1="300" x2={60 + i * 98} y2="410" stroke="#B1A897" strokeWidth="4" />)
          : null}
        {!rinnovata ? <path d="M300 310 L320 340 L310 365 L330 400" fill="none" stroke="#8F887C" strokeWidth="4" /> : null}
        <rect x="40" y="410" width="820" height="26" rx="4" fill={rinnovata ? "#FFFFFF" : "#CFC6B6"} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={60 + i * 200} y="436" width="190" height="180" rx="6" fill={mobili} />
            <rect x={74 + i * 200} y="452" width="162" height="148" rx="4" fill={ante} />
            <rect x={140 + i * 200} y="470" width="30" height="8" rx="4" fill={rinnovata ? C.tiffany : "#8F887C"} />
          </g>
        ))}
        <rect x="0" y="616" width="900" height="44" fill={rinnovata ? "#E8E4DE" : "#BDB5A8"} />
      </svg>
    );
  };
  return (
    <AbsoluteFill style={{ backgroundColor: C.neutral }}>
      <AbsoluteFill>{cucina(false)}</AbsoluteFill>
      <AbsoluteFill style={{ clipPath: `inset(0 ${100 - p * 100}% 0 0)` }}>{cucina(true)}</AbsoluteFill>
      <div style={{ position: "absolute", left: `${p * 100}%`, top: 0, bottom: 0, width: 8, marginLeft: -4, backgroundColor: C.tiffany, opacity: p > 0.02 && p < 0.98 ? 1 : 0 }} />
      <div style={{ position: "absolute", left: 30, bottom: 30, backgroundColor: "rgba(246,251,250,0.92)", borderRadius: 16, padding: "4px 22px", opacity: 1 - entra(p, 0.3, 0.3) }}>
        <Testo peso={700}>prima</Testo>
      </div>
      <div style={{ position: "absolute", right: 30, bottom: 30, backgroundColor: "rgba(246,251,250,0.92)", borderRadius: 16, padding: "4px 22px", opacity: entra(p, 0.7, 0.3) }}>
        <Testo peso={700}>dopo</Testo>
      </div>
    </AbsoluteFill>
  );
};

/** Scena 7: una parete di salotto e una quota che si estende, come una misura presa sul posto. */
const Sopralluogo: React.FC<{ durata: number; da: number }> = ({ durata, da }) => {
  const t = useT() - da;
  const misura = entra(t, 0.3, Math.max(1, durata - 0.8));
  const verticale = entra(t, 0.8, Math.max(1, durata - 1.2));
  const x0 = 360;
  const x1 = mix(x0, 1560, misura);
  return (
    <AbsoluteFill style={{ backgroundColor: C.light }}>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <rect width="1920" height="820" fill="#EEF5F3" />
        <rect y="820" width="1920" height="260" fill={C.neutral} />
        <line x1="0" y1="820" x2="1920" y2="820" stroke={C.teal} strokeWidth="6" />
        {/* finestra */}
        <rect x="1240" y="190" width="380" height="430" rx="10" fill="#DDF3EE" stroke={C.teal} strokeWidth="10" />
        <line x1="1430" y1="190" x2="1430" y2="620" stroke={C.teal} strokeWidth="8" />
        {/* divano stilizzato */}
        <rect x="420" y="610" width="560" height="150" rx="40" fill={C.tiffany} />
        <rect x="380" y="560" width="90" height="230" rx="36" fill={C.tiffanyDeep} />
        <rect x="930" y="560" width="90" height="230" rx="36" fill={C.tiffanyDeep} />
        <rect x="470" y="520" width="460" height="120" rx="36" fill={C.tiffanyDeep} opacity="0.85" />
        {/* quota orizzontale */}
        <g stroke={C.teal} strokeWidth="6" strokeLinecap="round">
          <line x1={x0} y1="140" x2={x0} y2="200" />
          <line x1={x0} y1="170" x2={x1} y2="170" />
          <line x1={x1} y1="140" x2={x1} y2="200" opacity={misura > 0.02 ? 1 : 0} />
        </g>
        {Array.from({ length: 24 }, (_, i) => x0 + i * 50)
          .filter((x) => x < x1)
          .map((x) => (
            <line key={x} x1={x} y1="170" x2={x} y2={(x - x0) % 250 === 0 ? 195 : 185} stroke={C.teal} strokeWidth="3" />
          ))}
        {/* quota verticale */}
        <g stroke={C.teal} strokeWidth="6" strokeLinecap="round" opacity={verticale > 0 ? 1 : 0}>
          <line x1="1720" y1="820" x2="1720" y2={mix(820, 190, verticale)} />
          <line x1="1690" y1="820" x2="1750" y2="820" />
          <line x1="1690" y1={mix(820, 190, verticale)} x2="1750" y2={mix(820, 190, verticale)} />
        </g>
        <circle cx={x1} cy="170" r="14" fill={C.tiffanyDeep} opacity={misura < 0.99 ? 1 : 0} />
      </svg>
    </AbsoluteFill>
  );
};

/** Scena 9: facciata con un cartello senza scritte; la luce passa dall'autunno all'inverno. */
const CartelloStagioni: React.FC<{ durata: number; da: number }> = ({ durata, da }) => {
  const t = useT() - da;
  const p = entra(t, 0, Math.max(1, durata));
  const cielo = mixColore("#F2C9A0", "#C9D6DC", p);
  const cieloAlto = mixColore("#E9A97A", "#A9BCC6", p);
  const facciata = mixColore("#E8C9A8", "#D9DCD8", p);
  const foglie = 1 - entra(p, 0.2, 0.4);
  const neve = entra(p, 0.55, 0.4);
  return (
    <AbsoluteFill>
      <svg viewBox="0 0 1920 1080" width="100%" height="100%">
        <defs>
          <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={cieloAlto} />
            <stop offset="1" stopColor={cielo} />
          </linearGradient>
        </defs>
        <rect width="1920" height="1080" fill="url(#cielo)" />
        <rect x="420" y="120" width="1080" height="960" fill={facciata} />
        <rect x="400" y="100" width="1120" height="40" fill={mixColore("#C9A27E", "#B9BDBA", p)} />
        {Array.from({ length: 4 }, (_, r) =>
          Array.from({ length: 5 }, (_, c) => {
            const x = 500 + c * 200;
            const y = 200 + r * 210;
            const accesa = entra(p, 0.5 + ((r * 5 + c) % 7) * 0.05, 0.15);
            return (
              <g key={`${r}-${c}`}>
                <rect x={x} y={y} width="110" height="140" rx="6" fill={mixColore("#8FA3A3", "#F5E3A6", accesa * 0.8)} />
                <rect x={x - 12} y={y} width="16" height="140" fill={C.teal} opacity="0.75" />
                <rect x={x + 106} y={y} width="16" height="140" fill={C.teal} opacity="0.75" />
              </g>
            );
          }),
        )}
        {/* balcone con cartello senza scritte */}
        <rect x="860" y="600" width="400" height="16" fill={C.teal} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect key={i} x={872 + i * 50} y="616" width="8" height="90" fill={C.teal} />
        ))}
        <rect x="860" y="700" width="400" height="14" fill={C.teal} />
        <rect x="930" y="620" width="260" height="150" rx="10" fill={C.tiffany} stroke={C.teal} strokeWidth="8" />
        <path d="M1060 652 L1110 690 V735 H1010 V690 Z" fill="none" stroke={C.teal} strokeWidth="8" strokeLinejoin="round" />
        {/* foglie che cadono, poi neve */}
        {Array.from({ length: 14 }, (_, i) => {
          const x = (i * 157) % 1920;
          const y = ((t * 120 + i * 97) % 1100) - 20;
          return <ellipse key={`f${i}`} cx={x + Math.sin(t * 2 + i) * 30} cy={y} rx="14" ry="8" fill="#D08A4E" opacity={foglie * 0.8} transform={`rotate(${(t * 90 + i * 40) % 360} ${x} ${y})`} />;
        })}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 211) % 1920;
          const y = ((t * 90 + i * 61) % 1100) - 20;
          return <circle key={`n${i}`} cx={x + Math.sin(t + i) * 12} cy={y} r={i % 3 === 0 ? 7 : 5} fill="#FFFFFF" opacity={neve * 0.9} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ANIMAZIONI: Record<string, React.FC<{ durata: number; da: number }>> = {
  "s3_cucina_prima_dopo.mp4": CucinaPrimaDopo,
  "s7_professionista_sopralluogo.mp4": Sopralluogo,
  "s9_cartello_in_vendita_timelapse.mp4": CartelloStagioni,
};

/** Clip vera se presente in clips/, altrimenti la sua animazione sostitutiva. `da` = secondo della scena in cui la clip compare. */
export const ClipOAnimazione: React.FC<{ file: string; durata: number; da?: number; zoom?: [number, number]; style?: React.CSSProperties }> = ({
  file,
  durata,
  da = 0,
  zoom,
  style,
}) => {
  const Animazione = ANIMAZIONI[file];
  if (CLIP_PRESENTI.has(file) || !Animazione) return <Clip file={file} durata={durata} zoom={zoom} style={style} />;
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      <Animazione durata={durata} da={da} />
    </div>
  );
};
