/**
 * Validate guides/public asset links return 200 against local serve.
 * Usage: node scripts/validate-links.mjs [baseUrl]
 */
import { readFileSync, readdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(__dirname, "..", "public");
const BASE = process.argv[2] || "http://localhost:3457";

const RESORT_IDS = [
  "sichinohe",
  "biei",
  "unabetsu",
  "kiyosato",
  "gokazan",
  "tsunan",
  "minami-furano",
  "asahigaoka",
  "otoifuji",
  "shimukappu",
  "abashiri-lv",
];

function collectFiles(dir, base = "") {
  const out = [];
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${ent.name}` : ent.name;
    const full = join(dir, ent.name);
    if (ent.isDirectory()) out.push(...collectFiles(full, rel));
    else out.push(rel.replace(/\\/g, "/"));
  }
  return out;
}

function extractUrls(html) {
  const urls = [];
  const attrRe = /(?:href|src)=["']([^"']+)["']/g;
  let m;
  while ((m = attrRe.exec(html))) {
    const u = m[1];
    if (u.startsWith("http") || u.startsWith("#") || u.startsWith("mailto:") || u.startsWith("tel:")) continue;
    if (u.includes("fonts.googleapis.com") || u.includes("fonts.gstatic.com")) continue;
    urls.push(u.split("?")[0]);
  }
  return urls;
}

function resolveUrl(pagePath, ref) {
  if (ref.startsWith("/")) return ref;
  const pageDir = pagePath.includes("/") ? pagePath.replace(/\/[^/]+$/, "") : "";
  const parts = (pageDir ? `${pageDir}/${ref}` : ref).split("/").filter(Boolean);
  const stack = [];
  for (const p of parts) {
    if (p === "..") stack.pop();
    else if (p !== ".") stack.push(p);
  }
  return "/" + stack.join("/");
}

async function check(path) {
  const url = `${BASE}${path}`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    return { path, status: res.status, ok: res.ok };
  } catch (e) {
    return { path, status: 0, ok: false, error: e.message };
  }
}

async function main() {
  const registry = JSON.parse(readFileSync(join(PUBLIC, "registry.json"), "utf8"));
  const ids = registry.resorts.map((r) => r.id).sort();
  const missing = RESORT_IDS.filter((id) => !ids.includes(id));
  const extra = ids.filter((id) => !RESORT_IDS.includes(id));
  if (missing.length || extra.length) {
    console.error("Registry ID mismatch:", { missing, extra });
    process.exit(1);
  }

  for (const id of RESORT_IDS) {
    const dir = join(PUBLIC, id);
    if (!existsSync(join(dir, "index.html"))) {
      console.error(`Missing public/${id}/index.html`);
      process.exit(1);
    }
  }

  const checks = new Set([
    "/",
    "/registry.json",
    "/map.html",
    "/_shared/mock-i18n.js",
    "/_shared/mock-i18n.css",
    "/_shared/mock-hub.js",
    "/_shared/mock-hub.css",
    "/_shared/resort-map.js",
    "/messages/hub.ja.json",
    ...RESORT_IDS.map((id) => `/${id}/`),
    ...RESORT_IDS.map((id) => `/map.html?resort=${id}`),
  ]);

  for (const id of RESORT_IDS) {
    const html = readFileSync(join(PUBLIC, id, "index.html"), "utf8");
    if (html.includes("../_shared/") || html.includes("../map.html") || html.includes("../index.html")) {
      console.error(`✗ ${id}/index.html still has ../ paths`);
      process.exit(1);
    }
    if (!html.includes(`/map.html?resort=${id}`)) {
      console.error(`✗ ${id}/index.html missing /map.html?resort=${id}`);
      process.exit(1);
    }
    for (const ref of extractUrls(html)) {
      checks.add(resolveUrl(`${id}/index.html`, ref));
    }
    for (const f of ["ja.json", "en.json"]) {
      checks.add(`/${id}/messages/${f}`);
    }
    const mapJson = join(PUBLIC, "data", "maps", `${id}.json`);
    if (existsSync(mapJson)) {
      checks.add(`/data/maps/${id}.json`);
      const hero = JSON.parse(readFileSync(mapJson, "utf8")).hero?.src;
      if (hero) checks.add(hero.startsWith("/") ? hero : `/${hero}`);
    }
  }

  const hubJs = readFileSync(join(PUBLIC, "_shared", "mock-hub.js"), "utf8");
  if (hubJs.includes("r.slug}/index.html")) {
    console.error("✗ mock-hub.js still uses slug/index.html");
    process.exit(1);
  }

  let failed = 0;
  for (const path of [...checks].sort()) {
    const r = await check(path);
    if (!r.ok) {
      console.error(`✗ ${r.status} ${path}${r.error ? ` (${r.error})` : ""}`);
      failed++;
    }
  }

  if (failed) {
    console.error(`\n${failed} link(s) failed. Start: npm run preview`);
    process.exit(1);
  }

  console.log(`✓ All ${checks.size} paths OK (${RESORT_IDS.length} resorts)`);
  console.log(`✓ Rename: *-lp → public/{id}/ verified`);
  console.log(`✓ Map links: /map.html?resort={id}`);
  console.log(`✓ Hub links: /{id}/`);
}

main();
