import { Composition } from "remotion";
import { FPS, SCENE_16X9, SCENE_9X16 } from "./modulo1/data";
import { Modulo1Orizzontale, Modulo1Verticale, framesTotali } from "./modulo1/Modulo1";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Modulo1-16x9"
        component={Modulo1Orizzontale}
        durationInFrames={framesTotali(SCENE_16X9)}
        fps={FPS}
        width={1920}
        height={1080}
      />
      <Composition
        id="Modulo1-9x16"
        component={Modulo1Verticale}
        durationInFrames={framesTotali(SCENE_9X16)}
        fps={FPS}
        width={1080}
        height={1920}
      />
    </>
  );
};
