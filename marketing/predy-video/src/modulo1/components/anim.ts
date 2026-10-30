import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

// Curva morbida e lenta usata per tutte le comparse.
export const MORBIDO = Easing.bezier(0.33, 0, 0.15, 1);

/** Tempo corrente in secondi dall'inizio della Sequence. */
export const useT = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame / fps;
};

/** 0 → 1 tra `da` e `da + durata` secondi, con curva morbida. */
export const entra = (t: number, da: number, durata = 0.9) =>
  interpolate(t, [da, da + durata], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: MORBIDO });

/** Comparsa a `da` e scomparsa che termina a `a`. */
export const finestra = (t: number, da: number, a: number, durata = 0.8) =>
  Math.min(entra(t, da, durata), 1 - entra(t, a - durata, durata));

export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
