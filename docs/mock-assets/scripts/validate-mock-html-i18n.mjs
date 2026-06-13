#!/usr/bin/env node
/**
 * Checks each LP index.html wires i18n and data-i18n keys exist in ja.json.
 */
import { readFileSync, readdirSync, statSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function flattenKeys(obj, prefix = "") {
  const keys = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        if (item && typeof item === "object") {
          keys.push(...flattenKeys(item, `${path}.${i}`));
        } else {
          keys.push(`${path}.${i}`);
        }
      });
    } else if (v && typeof v === "object") {
      keys.push(...flattenKeys(v, path));
    } else {
      keys.push(path);
    }
  }
  return keys;
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function extractI18nKeys(html) {
  const keys = new Set();
  const re = /data-i18n(?:-html|-attr)?="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[1].includes(":")) {
      m[1].split(";").forEach((pair) => {
        const path = pair.split(":")[1]?.trim();
        if (path) keys.add(path);
      });
    } else {
      keys.add(m[1]);
    }
  }
  return [...keys].sort();
}

let failed = false;

for (const dir of readdirSync(root).filter((n) => n.endsWith("-lp"))) {
  const htmlPath = join(root, dir, "index.html");
  const jaPath = join(root, dir, "messages", "ja.json");
  if (!statSync(htmlPath).isFile()) continue;

  const html = readFileSync(htmlPath, "utf8");
  const checks = [
    ["data-mock-resort", /data-mock-resort="/],
    ["mock-i18n.js", /mock-i18n\.js/],
    ["data-lang-switch", /data-lang-switch="/],
    ["mock-i18n.css", /mock-i18n\.css/],
  ];

  for (const [name, re] of checks) {
    if (!re.test(html)) {
      failed = true;
      console.error(`✗ ${dir}: missing ${name}`);
    }
  }

  const ui = loadJson(join(root, "_shared", "messages", "ui.ja.json"));
  const resort = loadJson(jaPath);
  const allKeys = new Set([...flattenKeys(ui), ...flattenKeys(resort)]);
  const used = extractI18nKeys(html);
  const missing = used.filter((k) => !allKeys.has(k));
  const unused = [...flattenKeys(resort)].filter((k) => !used.includes(k));

  if (missing.length) {
    failed = true;
    console.error(`✗ ${dir}: HTML keys not in JSON: ${missing.join(", ")}`);
  } else {
    console.log(`✓ ${dir}: ${used.length} HTML keys OK`);
  }
  if (unused.length) {
    console.warn(`  ⚠ ${dir}: ${unused.length} unused resort keys (OK if reserved)`);
  }
}

if (failed) {
  console.error("\nHTML validation FAILED");
  process.exit(1);
}
console.log("\nHTML validation PASSED");
