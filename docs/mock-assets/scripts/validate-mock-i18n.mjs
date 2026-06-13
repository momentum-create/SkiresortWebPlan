#!/usr/bin/env node
/**
 * Validates ja/en key parity for all LP mock message files.
 * Usage: node docs/mock-assets/scripts/validate-mock-i18n.mjs
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
  return keys.sort();
}

function loadJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function findResortDirs() {
  return readdirSync(root).filter((name) => {
    const full = join(root, name);
    return (
      statSync(full).isDirectory() &&
      name.endsWith("-lp") &&
      statSync(join(full, "messages", "ja.json")).isFile() &&
      statSync(join(full, "messages", "en.json")).isFile()
    );
  });
}

let failed = false;

for (const dir of findResortDirs()) {
  const jaPath = join(root, dir, "messages", "ja.json");
  const enPath = join(root, dir, "messages", "en.json");
  const jaKeys = flattenKeys(loadJson(jaPath));
  const enKeys = flattenKeys(loadJson(enPath));

  const missingInEn = jaKeys.filter((k) => !enKeys.includes(k));
  const missingInJa = enKeys.filter((k) => !jaKeys.includes(k));

  if (missingInEn.length || missingInJa.length) {
    failed = true;
    console.error(`\n✗ ${dir}`);
    if (missingInEn.length) {
      console.error("  Missing in en.json:", missingInEn.join(", "));
    }
    if (missingInJa.length) {
      console.error("  Missing in ja.json:", missingInJa.join(", "));
    }
  } else {
    console.log(`✓ ${dir} (${jaKeys.length} keys)`);
  }
}

const uiJa = join(root, "_shared", "messages", "ui.ja.json");
const uiEn = join(root, "_shared", "messages", "ui.en.json");
const uiJaKeys = flattenKeys(loadJson(uiJa));
const uiEnKeys = flattenKeys(loadJson(uiEn));
const uiMissingEn = uiJaKeys.filter((k) => !uiEnKeys.includes(k));
const uiMissingJa = uiEnKeys.filter((k) => !uiJaKeys.includes(k));
if (uiMissingEn.length || uiMissingJa.length) {
  failed = true;
  console.error("\n✗ _shared/messages/ui");
  if (uiMissingEn.length) console.error("  Missing in ui.en.json:", uiMissingEn.join(", "));
  if (uiMissingJa.length) console.error("  Missing in ui.ja.json:", uiMissingJa.join(", "));
} else {
  console.log(`✓ _shared/messages/ui (${uiJaKeys.length} keys)`);
}

if (failed) {
  console.error("\nValidation FAILED");
  process.exit(1);
}
console.log("\nValidation PASSED");
