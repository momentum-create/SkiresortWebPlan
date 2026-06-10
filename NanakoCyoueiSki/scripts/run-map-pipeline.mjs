#!/usr/bin/env node
/** 実座標マップパイプライン一括実行 */
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function run(script) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [path.join(__dirname, script)], {
      stdio: "inherit",
      cwd: __dirname,
    });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(script))));
  });
}

await run("build-hero-gsi.mjs");
await run("fetch-skimap-reference.mjs");
await run("calibrate-overlay.mjs");
console.log("pipeline done — open /maps/calibration-qa.html to verify");
