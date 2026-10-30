import React from "react";
import { AbsoluteFill, Img, staticFile, useVideoConfig } from "remotion";
import { Video } from "@remotion/media";
import { CAPTIONS, CAPTIONS_VERTICALE, CLIP_PRESENTI } from "../data";
import { C, FONT_TESTO, FONT_TITOLI, MARGINE, VERTICALE } from "../theme";
import { entra, useT } from "./anim";

export const isVerticale = (w: number, h: number) => h > w;

/** Sfondo della scena con dissolvenza morbida in entrata e in uscita. */
export const Scena: React.FC<{ sfondo: string; durata: number; children: React.ReactNode }> = ({ sfondo, durata, children }) => {
  const t = useT();
  const opacita = Math.min(entra(t, 0, 0.45), 1 - entra(t, durata - 0.45, 0.45));
  return (
    <AbsoluteFill style={{ backgroundColor: C.light }}>
      <AbsoluteFill style={{ backgroundColor: sfondo, opacity: opacita, fontFamily: FONT_TESTO, color: C.teal }}>{children}</AbsoluteFill>
    </AbsoluteFill>
  );
};

/** Grande chevron a tetto del brand, come decorazione di sfondo. */
export const Chevron: React.FC<{ colore: string; opacita: number; spostamento?: number }> = ({ colore, opacita, spostamento = 0 }) => {
  const { width, height } = useVideoConfig();
  const s = Math.max(width, height);
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: "absolute", inset: 0, opacity: opacita }}>
      <path
        d={`M${width * 0.42 - spostamento} ${height * 1.05} L${width * 0.98 - spostamento} ${height * 0.3} L${width * 0.98 - spostamento + s * 0.18} ${height * 0.3 + s * 0.12} L${width * 0.5 - spostamento + s * 0.12} ${height * 1.1} Z`}
        fill={colore}
      />
    </svg>
  );
};

/** Logo Predy: sempre il file originale, caricato come immagine separata. */
export const Logo: React.FC<{ altezza: number; style?: React.CSSProperties }> = ({ altezza, style }) => (
  <Img src={staticFile("modulo1/logo.webp")} style={{ height: altezza, width: "auto", ...style }} />
);

/** Grading uniforme delle clip, in linea con la palette (desaturazione leggera e velatura teal/tiffany). */
const GRADING: React.CSSProperties = { filter: "saturate(0.86) contrast(1.04) brightness(1.02)" };

/** Clip STOCK/AI da predy-modulo1/clips; se manca, segnaposto neutro con il nome del file. */
export const Clip: React.FC<{ file: string; zoom?: [number, number]; durata: number; style?: React.CSSProperties }> = ({
  file,
  zoom = [1, 1.06],
  durata,
  style,
}) => {
  const t = useT();
  const { width, height } = useVideoConfig();
  const scala = zoom[0] + (zoom[1] - zoom[0]) * Math.min(1, t / Math.max(1, durata));
  const presente = CLIP_PRESENTI.has(file);
  return (
    <div style={{ position: "absolute", overflow: "hidden", ...style }}>
      {presente ? (
        <>
          <Video src={staticFile(`modulo1/clips/${file}`)} muted loop objectFit="cover" style={{ width: "100%", height: "100%", scale: String(scala), ...GRADING }} />
          <AbsoluteFill style={{ backgroundColor: C.teal, opacity: 0.1, mixBlendMode: "multiply" }} />
          <AbsoluteFill style={{ backgroundColor: C.tiffany, opacity: 0.1, mixBlendMode: "soft-light" }} />
        </>
      ) : (
        <AbsoluteFill style={{ backgroundColor: C.neutral }}>
          <svg viewBox="0 0 400 300" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
            <path d="M-20 300 L200 120 L420 300" fill="none" stroke={C.tiffany} strokeWidth={36} />
          </svg>
          {/* etichetta in alto a destra, per non coprire i testi della scena */}
          <div style={{ position: "absolute", top: isVerticale(width, height) ? VERTICALE.alto + 30 : 40, right: 40, maxWidth: "70%", backgroundColor: "rgba(246,251,250,0.9)", borderRadius: 18, padding: "10px 24px", fontFamily: FONT_TESTO, fontSize: 56, fontWeight: 600, color: C.teal, textAlign: "right", wordBreak: "break-all" }}>
            {file}
          </div>
        </AbsoluteFill>
      )}
    </div>
  );
};

/** Sottotitoli incorporati, da testo_originale (via modulo1_16x9.srt). */
export const Sottotitoli: React.FC<{ scena: number }> = ({ scena }) => {
  const t = useT();
  const { width, height } = useVideoConfig();
  const vert = isVerticale(width, height);
  const cue = ((vert ? CAPTIONS_VERTICALE : CAPTIONS)[String(scena)] ?? []).find((c) => t >= c.start && t < c.end);
  if (!cue) return null;
  const opacita = Math.min(entra(t, cue.start, 0.15), 1 - entra(t, cue.end - 0.12, 0.12));
  return (
    <div
      style={{
        position: "absolute",
        left: MARGINE,
        right: MARGINE,
        bottom: vert ? VERTICALE.basso : MARGINE - 40,
        display: "flex",
        justifyContent: "center",
        opacity: opacita,
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(15,45,46,0.92)",
          color: C.light,
          fontFamily: FONT_TESTO,
          fontWeight: 600,
          fontSize: 56,
          lineHeight: 1.22,
          letterSpacing: "-0.01em",
          padding: "14px 34px 18px",
          borderRadius: 22,
          textAlign: "center",
          whiteSpace: "pre-line",
          maxWidth: vert ? width - 2 * MARGINE : 1500,
        }}
      >
        {cue.text}
      </div>
    </div>
  );
};

export const Titolo: React.FC<{ size?: number; colore?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 72,
  colore = C.teal,
  style,
  children,
}) => (
  <div style={{ fontFamily: FONT_TITOLI, fontWeight: 800, fontSize: Math.max(56, size), letterSpacing: "-0.025em", lineHeight: 1.08, color: colore, ...style }}>
    {children}
  </div>
);

export const Testo: React.FC<{ size?: number; peso?: number; colore?: string; style?: React.CSSProperties; children: React.ReactNode }> = ({
  size = 56,
  peso = 500,
  colore = C.teal,
  style,
  children,
}) => (
  <div style={{ fontFamily: FONT_TESTO, fontWeight: peso, fontSize: Math.max(56, size), lineHeight: 1.18, letterSpacing: "-0.01em", color: colore, ...style }}>
    {children}
  </div>
);
