import React from "react";
import { C } from "../theme";

// Icone lineari disegnate per il modulo (nessun asset di terze parti).
type P = { size?: number; colore?: string; spessore?: number };
const Svg: React.FC<P & { children: React.ReactNode }> = ({ size = 64, colore = C.teal, spessore = 4.5, children }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none" stroke={colore} strokeWidth={spessore} strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);

export const IconaZona: React.FC<P> = (p) => (
  <Svg {...p}><path d="M32 58s-18-17-18-31a18 18 0 0 1 36 0c0 14-18 31-18 31z" /><circle cx="32" cy="27" r="7" /></Svg>
);
export const IconaLuce: React.FC<P> = (p) => (
  <Svg {...p}><circle cx="32" cy="32" r="11" /><path d="M32 6v7M32 51v7M6 32h7M51 32h7M13.6 13.6l5 5M45.4 45.4l5 5M13.6 50.4l5-5M45.4 18.6l5-5" /></Svg>
);
export const IconaImpianti: React.FC<P> = (p) => (
  <Svg {...p}><path d="M40 8a12 12 0 0 0-11 16L9 44a6 6 0 0 0 9 9l20-20a12 12 0 0 0 16-11l-7 4-6-3-1-7 7-4z" /></Svg>
);
export const IconaEnergia: React.FC<P> = (p) => (
  <Svg {...p}><path d="M36 6L14 36h16l-4 22 22-30H32z" /></Svg>
);
export const IconaAccessori: React.FC<P> = (p) => (
  <Svg {...p}><path d="M8 24l24-14 24 14v30H8z" /><path d="M20 54V36h24v18M20 44h24" /></Svg>
);
export const IconaCondominio: React.FC<P> = (p) => (
  <Svg {...p}><rect x="14" y="8" width="36" height="48" rx="3" /><path d="M23 18h6M35 18h6M23 28h6M35 28h6M23 38h6M35 38h6M28 56v-8h8v8" /></Svg>
);
export const IconaCasa: React.FC<P> = (p) => (
  <Svg {...p}><path d="M8 30L32 10l24 20" /><path d="M14 26v28h36V26" /><path d="M27 54V40h10v14" /></Svg>
);
export const IconaDocumento: React.FC<P> = (p) => (
  <Svg {...p}><path d="M16 6h22l12 12v40H16z" /><path d="M38 6v12h12M23 30h20M23 39h20M23 48h12" /></Svg>
);
export const IconaAgenzia: React.FC<P> = (p) => (
  <Svg {...p}><path d="M8 26h48M12 26l4-14h32l4 14M12 26v28h40V26" /><path d="M26 54V40h12v14" /></Svg>
);
export const IconaPerizia: React.FC<P> = (p) => (
  <Svg {...p}><path d="M8 44L44 8l12 12-36 36z" /><path d="M18 34l5 5M25 27l5 5M32 20l5 5M39 13l5 5" /></Svg>
);
export const IconaOnline: React.FC<P> = (p) => (
  <Svg {...p}><rect x="6" y="10" width="52" height="34" rx="3" /><path d="M24 54h16M32 44v10" /><path d="M16 34l8-8 6 5 10-11 8 8" /></Svg>
);
export const IconaCosto: React.FC<P> = (p) => (
  <Svg {...p}><path d="M10 54h44M16 54V30h14v24M34 54V18h14v36" /><path d="M10 30l10-12 8 6" /></Svg>
);
export const IconaAffitto: React.FC<P> = (p) => (
  <Svg {...p}><circle cx="22" cy="32" r="12" /><path d="M34 32h22M48 32v9M56 32v7" /></Svg>
);
export const IconaSpunta: React.FC<P & { progresso?: number }> = ({ progresso = 1, ...p }) => (
  <Svg {...p}><path d="M14 33l12 12 24-26" strokeDasharray={60} strokeDashoffset={60 * (1 - progresso)} /></Svg>
);
