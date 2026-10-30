// Valori da marketing/predy-modulo1/brand/brand.md
export const C = {
  tiffany: "#A7E6D8",
  teal: "#0F2D2E",
  light: "#F6FBFA",
  neutral: "#E8E4DE",
  tealSoft: "rgba(15,45,46,0.62)",
  lightSoft: "rgba(246,251,250,0.72)",
  tiffanyDeep: "#6FCDB8",
} as const;

export const FONT_TITOLI = "Plus Jakarta Sans";
export const FONT_TESTO = "Inter";

// Regole di layout: testo minimo 56 px, margini 80 px.
export const MIN_TESTO = 56;
export const MARGINE = 80;

// Area sicura del taglio verticale: niente testo nei primi 150 px e negli ultimi 250 px.
export const VERTICALE = { alto: 150, basso: 250 } as const;
