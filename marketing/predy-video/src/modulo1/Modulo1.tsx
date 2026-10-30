import "./fonts";
import React from "react";
import { AbsoluteFill, Series, staticFile, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import { FPS, MUSICA, durataFrames, tempiScena } from "./data";
import { C } from "./theme";
import { Sottotitoli } from "./components/Base";
import { S01Apertura } from "./scenes/S01Apertura";
import { S02ValorePrezzo } from "./scenes/S02ValorePrezzo";
import { S03Fattori } from "./scenes/S03Fattori";
import { S04Superficie } from "./scenes/S04Superficie";
import { S05Confronto } from "./scenes/S05Confronto";
import { S06Omi } from "./scenes/S06Omi";
import { S07Aiuto } from "./scenes/S07Aiuto";
import { S08Confronti } from "./scenes/S08Confronti";
import { S09Prezzo } from "./scenes/S09Prezzo";
import { CHIUSURA_S, S10Checklist } from "./scenes/S10Checklist";

const SCENE: Record<number, React.FC<{ durata: number }>> = {
  1: S01Apertura,
  2: S02ValorePrezzo,
  3: S03Fattori,
  4: S04Superficie,
  5: S05Confronto,
  6: S06Omi,
  7: S07Aiuto,
  8: S08Confronti,
  9: S09Prezzo,
  10: S10Checklist,
};

/** Durata della scena nel montaggio: quella di tempi.json, più la chiusura sul logo per la scena 10. */
export const framesScena = (id: number) => durataFrames(id) + (id === 10 ? Math.round(CHIUSURA_S * FPS) : 0);
export const framesTotali = (ids: number[]) => ids.reduce((a, id) => a + framesScena(id), 0);

/** Intervalli (in secondi) in cui parla la voce, per il ducking della musica. */
const intervalliVoce = (ids: number[]) => {
  let inizio = 0;
  const out: [number, number][] = [];
  for (const id of ids) {
    const t = tempiScena(id);
    for (const f of t.frasi) out.push([inizio + t.attacco + f.inizio, inizio + t.attacco + f.fine]);
    inizio += framesScena(id) / FPS;
  }
  return out;
};

/** Musica: traccia vuota finché predy-modulo1/musica/musica.json non indica un file; si abbassa sotto la voce. */
const Musica: React.FC<{ ids: number[] }> = ({ ids }) => {
  const { fps, durationInFrames } = useVideoConfig();
  if (!MUSICA.file) return null;
  const voce = intervalliVoce(ids);
  const r = MUSICA.rampa_s;
  const volume = (f: number) => {
    const s = f / fps;
    // distanza dalla voce più vicina: 0 dentro un intervallo, poi rampa morbida
    const d = Math.min(...voce.map(([a, b]) => (s < a ? a - s : s > b ? s - b : 0)));
    const sotto = MUSICA.volume_sotto_voce + (MUSICA.volume - MUSICA.volume_sotto_voce) * Math.min(1, d / r);
    const dissolvenza = Math.min(1, s / 1.5, (durationInFrames / fps - s) / 2);
    return sotto * Math.max(0, dissolvenza);
  };
  return <Audio name="Musica" src={staticFile(`modulo1/musica/${MUSICA.file}`)} loop volume={volume} />;
};

const Montaggio: React.FC<{ ids: number[] }> = ({ ids }) => {
  const { fps } = useVideoConfig();
  return (
    <AbsoluteFill style={{ backgroundColor: C.light }}>
      <Series>
        {ids.map((id) => {
          const Scena = SCENE[id];
          const t = tempiScena(id);
          return (
            <Series.Sequence key={id} name={`Scena ${id}`} durationInFrames={framesScena(id)}>
              <Scena durata={framesScena(id) / fps} />
              {/* -3 dB: i file voce sono mono a -16 LUFS e diventano doppio mono nel mix stereo (+3 dB) */}
              <Audio name={`Voce scena ${id}`} from={Math.round(t.attacco * fps)} volume={0.708} src={staticFile(`modulo1/voce/voce_s${String(id).padStart(2, "0")}.wav`)} />
              <Sottotitoli scena={id} />
            </Series.Sequence>
          );
        })}
      </Series>
      <Musica ids={ids} />
    </AbsoluteFill>
  );
};

export const Modulo1Orizzontale: React.FC = () => <Montaggio ids={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} />;
export const Modulo1Verticale: React.FC = () => <Montaggio ids={[1, 2, 10]} />;
