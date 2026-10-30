// Copia nel progetto Remotion i materiali del Modulo 1 (voce, tempi, logo, font, clip, musica)
// e prepara i sottotitoli per scena a partire da modulo1_16x9.srt.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, "..", "predy-modulo1");
const pub = path.join(root, "public", "modulo1");
const gen = path.join(root, "src", "modulo1", "generated");

const copy = (from, to) => {
  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
};
fs.rmSync(pub, { recursive: true, force: true });
fs.mkdirSync(gen, { recursive: true });

const tempi = JSON.parse(fs.readFileSync(path.join(src, "tempi.json"), "utf8"));
const scene = JSON.parse(fs.readFileSync(path.join(src, "scene.json"), "utf8"));
for (const s of tempi.scene) copy(path.join(src, s.file), path.join(pub, "voce", path.basename(s.file)));
copy(path.join(src, "brand", "logo_predy_originale.webp"), path.join(pub, "logo.webp"));
for (const f of ["PlusJakartaSans-Variable.ttf", "InterVariable.ttf"]) copy(path.join(src, "brand", "fonts", f), path.join(pub, "fonts", f));

const clipDir = path.join(src, "clips");
const clips = fs.existsSync(clipDir) ? fs.readdirSync(clipDir).filter((f) => /\.(mp4|mov|webm)$/i.test(f)) : [];
for (const c of clips) copy(path.join(clipDir, c), path.join(pub, "clips", c));

const musica = JSON.parse(fs.readFileSync(path.join(src, "musica", "musica.json"), "utf8"));
if (musica.file) copy(path.join(src, "musica", musica.file), path.join(pub, "musica", musica.file));

// SRT -> cue per scena, in secondi relativi all'inizio della scena
const toSec = (t) => { const [h, m, s] = t.replace(",", ".").split(":"); return +h * 3600 + +m * 60 + +s; };
const cues = fs.readFileSync(path.join(src, "modulo1_16x9.srt"), "utf8").trim().split(/\r?\n\r?\n/).map((b) => {
  const lines = b.split(/\r?\n/);
  const [a, z] = lines[1].split(" --> ");
  return { start: toSec(a), end: toSec(z), text: lines.slice(2).join("\n") };
});
const captions = {};
for (const s of tempi.scene) {
  const fine = s.inizio_scena + s.durata_scena;
  captions[s.id] = cues.filter((c) => c.start >= s.inizio_scena && c.start < fine)
    .map((c) => ({ start: +(c.start - s.inizio_scena).toFixed(3), end: +(c.end - s.inizio_scena).toFixed(3), text: c.text }));
}

// Nel verticale le righe sono più corte: i sottotitoli lunghi si dividono in due, con tempi proporzionali ai caratteri.
const MAX_VERTICALE = 58;
const dividi = (c) => {
  const testo = c.text.replace(/\n/g, " ");
  if (testo.length <= MAX_VERTICALE) return [{ ...c, text: testo }];
  const parole = testo.split(" ");
  let migliore = 1, punteggio = Infinity;
  for (let i = 1; i < parole.length; i++) {
    const sx = parole.slice(0, i).join(" ");
    const p = Math.abs(sx.length - testo.length / 2) - (/[,:;]$/.test(sx) ? 8 : 0);
    if (p < punteggio) { punteggio = p; migliore = i; }
  }
  const a = parole.slice(0, migliore).join(" "), z = parole.slice(migliore).join(" ");
  const m = c.start + (c.end - c.start) * (a.length / (a.length + z.length));
  return [{ start: c.start, end: +m.toFixed(3), text: a }, { start: +m.toFixed(3), end: c.end, text: z }];
};
const captionsVerticale = {};
for (const id of [1, 2, 10]) captionsVerticale[id] = captions[id].flatMap(dividi);

// SRT del taglio verticale (scene 1, 2, 10 in sequenza)
const ts = (x) => { const ms = Math.round(x * 1000); const p = (n, l = 2) => String(n).padStart(l, "0");
  return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };
let t0 = 0, n = 0, srt = [];
for (const id of [1, 2, 10]) {
  const s = tempi.scene.find((x) => x.id === id);
  for (const c of captionsVerticale[id]) srt.push(`${++n}\n${ts(t0 + c.start)} --> ${ts(t0 + c.end)}\n${c.text}\n`);
  t0 += s.durata_scena;
}
fs.writeFileSync(path.join(src, "modulo1_9x16.srt"), srt.join("\n"));

fs.writeFileSync(path.join(gen, "tempi.json"), JSON.stringify(tempi, null, 1));
fs.writeFileSync(path.join(gen, "scene.json"), JSON.stringify(scene, null, 1));
fs.writeFileSync(path.join(gen, "captions.json"), JSON.stringify(captions, null, 1));
fs.writeFileSync(path.join(gen, "captions_verticale.json"), JSON.stringify(captionsVerticale, null, 1));
fs.writeFileSync(path.join(gen, "assets.json"), JSON.stringify({ clips, musica }, null, 1));
console.log(`sync: ${tempi.scene.length} scene, ${cues.length} sottotitoli, clip presenti: ${clips.length ? clips.join(", ") : "nessuna"}, musica: ${musica.file ?? "nessuna"}`);
