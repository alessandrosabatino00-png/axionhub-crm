// node render.js preview 3,9,... | node render.js full out.mp4
const { chromium } = require("playwright");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");
const FPS = 30, DUR = 60;
(async () => {
  const [mode, arg] = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto("file://" + path.join(__dirname, "index.html"));
  await page.waitForFunction(() => window.READY === true);
  if (mode === "preview") {
    fs.mkdirSync(path.join(__dirname, "preview"), { recursive: true });
    for (const t of arg.split(",").map(Number)) {
      await page.evaluate(t => render(t), t);
      await page.screenshot({ path: path.join(__dirname, "preview", `t${t}.png`) });
    }
  } else {
    const ff = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
      ...(process.argv[4] ? ["-i", process.argv[4]] : ["-f", "lavfi", "-i", "anullsrc=r=48000:cl=stereo"]), "-shortest",
      "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-pix_fmt", "yuv420p",
      "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-r", String(FPS), arg], { stdio: ["pipe", "inherit", "inherit"] });
    for (let f = 0; f < FPS * DUR; f++) {
      await page.evaluate(t => render(t), f / FPS);
      const buf = await page.screenshot({ type: "png" });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once("drain", r));
      if (f % 150 === 0) console.log("frame", f);
    }
    ff.stdin.end();
    await new Promise(r => ff.on("close", r));
  }
  await browser.close();
})();
