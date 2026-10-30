import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { FONT_TESTO, FONT_TITOLI } from "./theme";

// Font con licenza SIL OFL 1.1 (vedi predy-modulo1/LICENZE.md)
loadFont({ family: FONT_TITOLI, url: staticFile("modulo1/fonts/PlusJakartaSans-Variable.ttf"), weight: "200 800" });
loadFont({ family: FONT_TESTO, url: staticFile("modulo1/fonts/InterVariable.ttf"), weight: "100 900" });
