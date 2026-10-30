import tempiJson from "./generated/tempi.json";
import captionsJson from "./generated/captions.json";
import captionsVerticaleJson from "./generated/captions_verticale.json";
import assetsJson from "./generated/assets.json";

export type Frase = { testo_originale: string; inizio: number; fine: number };
export type TempiScena = {
  id: number;
  file: string;
  durata_voce: number;
  attacco: number;
  coda: number;
  durata_scena: number;
  inizio_scena: number;
  frasi: Frase[];
};
export type Cue = { start: number; end: number; text: string };

export const FPS = 30;
export const TEMPI = tempiJson.scene as TempiScena[];
export const CAPTIONS = captionsJson as unknown as Record<string, Cue[]>;
export const CAPTIONS_VERTICALE = captionsVerticaleJson as unknown as Record<string, Cue[]>;
export const CLIP_PRESENTI = new Set<string>(assetsJson.clips as string[]);
export const MUSICA = assetsJson.musica as {
  file: string | null;
  volume: number;
  volume_sotto_voce: number;
  rampa_s: number;
};

export const tempiScena = (id: number) => {
  const t = TEMPI.find((s) => s.id === id);
  if (!t) throw new Error(`Scena ${id} assente in tempi.json`);
  return t;
};

export const durataFrames = (id: number) => Math.round(tempiScena(id).durata_scena * FPS);

/** Inizio (in secondi dall'inizio della scena) della frase n, contando da 0. */
export const inizioFrase = (id: number, n: number) => {
  const t = tempiScena(id);
  return t.attacco + t.frasi[n].inizio;
};
export const fineFrase = (id: number, n: number) => {
  const t = tempiScena(id);
  return t.attacco + t.frasi[n].fine;
};

export const SCENE_16X9 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
export const SCENE_9X16 = [1, 2, 10];
export const durataTotale = (ids: number[]) => ids.reduce((a, id) => a + durataFrames(id), 0);
