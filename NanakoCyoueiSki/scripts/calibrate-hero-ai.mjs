/**
 * nanako-hero.png（冬景AIヒーロー）を基準に OSM/skimap 実座標をアフィン投影
 *
 * 用法: node calibrate-hero-ai.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_DIR = path.join(__dirname, "..", "web", "data", "map");
const MANIFEST = path.join(MAP_DIR, "features.manifest.json");

function main() {
  const cp = path.join(MAP_DIR, "control-points-hero-ai.json");
  if (!fs.existsSync(cp)) {
    console.error("missing", cp);
    process.exit(1);
  }

  const tune = spawnSync(process.execPath, [path.join(__dirname, "tune-hero-ai-geo.mjs")], {
    stdio: "inherit",
    cwd: __dirname,
  });
  if (tune.status !== 0) process.exit(tune.status ?? 1);

  const fit = spawnSync(
    process.execPath,
    [path.join(__dirname, "fit-overlay-similarity.mjs"), `--input=${cp}`],
    { stdio: "inherit", cwd: __dirname },
  );
  if (fit.status !== 0) process.exit(fit.status ?? 1);

  const manifest = JSON.parse(fs.readFileSync(MANIFEST, "utf-8"));
  manifest.mapAsset = "/maps/nanako-hero.png";
  manifest.heroImage = {
    src: "/maps/nanako-hero.png",
    width: 1536,
    height: 1024,
    viewBox: "0 0 1536 1024",
    projection: "affine-hero-ai",
    attribution: "七戸町営スキー場イラストベース",
    credit: "OSM/skimap 照合オーバーレイ。β版",
  };
  manifest.disclaimer =
    "イラストベース俯瞰マップ（β）。リフト・コース線は OSM/skimap 照合済み。現場最終確認前。";
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));

  console.log("updated features.manifest.json → nanako-hero.png");
  console.log("verify: npm run dev → /ja/map , /maps/calibration-qa.html");
}

main();
