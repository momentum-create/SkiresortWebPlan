/**
 * Apply English address lines with <ruby> place-name annotations to *-lp/messages/en.json
 */
import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function ruby(en, ja) {
  return `<ruby>${en}<rt>${ja}</rt></ruby>`;
}

function line(parts) {
  return parts.map(([en, ja]) => ruby(en, ja)).join(", ");
}

/** slug dir → address parts (specific → general) */
const EN_ADDRESSES = {
  "abashiri-lv-lp": {
    postal: "099-2421, Japan",
    parts: [
      ["Yobito 28-3", "字呼人28-3"],
      ["Abashiri", "網走市"],
      ["Hokkaido", "北海道"],
    ],
  },
  "asahigaoka-lp": {
    postal: "044-0083, Japan",
    parts: [
      ["Asahi 37-1", "字旭37番地1"],
      ["Kutchan", "倶知安町"],
      ["Abuta District", "虻田郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "biei-lp": {
    postal: "071-0218, Japan",
    parts: [
      ["Omura-Murayama", "字大村村山"],
      ["Biei Town", "美瑛町"],
      ["Kamikawa District", "上川郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "gokazan-lp": {
    postal: "099-6323, Japan",
    parts: [
      ["Kitahei Village Section 2, No. 100", "北兵村二区100番地"],
      ["Yubetsu", "湧別町"],
      ["Mombetsu District", "紋別郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "kiyosato-lp": {
    postal: "099-4525, Japan",
    parts: [
      ["Midori 51-1", "緑町51-1"],
      ["Kiyosato", "清里町"],
      ["Shari District", "斜里郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "minami-furano-lp": {
    postal: "079-2402, Japan",
    parts: [
      ["Kito", "字幾寅"],
      ["Minami-Furano", "南富良野町"],
      ["Sorachi District", "空知郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "otoifuji-lp": {
    postal: "098-2501, Japan",
    parts: [
      ["Otoifuke 200-6", "字音威子府200-6"],
      ["Otoifuke Village", "音威子府村"],
      ["Nakagawa District", "中川郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "shimukappu-lp": {
    postal: "079-2201, Japan",
    parts: [
      ["Chuo", "字中央"],
      ["Shimukappu", "占冠村"],
      ["Yubari District", "勇払郡"],
      ["Hokkaido", "北海道"],
    ],
  },
  "sichinohe-lp": {
    postal: "039-2568, Japan",
    parts: [
      ["Hidarikumi 106-5", "字左組106-5"],
      ["Sichinohe", "七戸町"],
      ["Kamikita District", "上北郡"],
      ["Aomori Prefecture", "青森県"],
    ],
  },
  "tsunan-lp": {
    postal: "949-8122, Japan",
    parts: [
      ["Kamigo Kamida Ko 1745-1", "大字上郷上田甲1745-1"],
      ["Tsunan", "津南町"],
      ["Nakauonuma District", "中魚沼郡"],
      ["Niigata Prefecture", "新潟県"],
    ],
  },
  "unabetsu-lp": {
    postal: "099-4122, Japan",
    parts: [
      ["Minehama 110", "字峰浜110番地"],
      ["Shari Town", "斜里町"],
      ["Shari District", "斜里郡"],
      ["Hokkaido", "北海道"],
    ],
  },
};

const dirs = readdirSync(ROOT).filter((d) => d.endsWith("-lp"));
let updated = 0;

for (const dir of dirs) {
  const spec = EN_ADDRESSES[dir];
  if (!spec) {
    console.warn(`skip (no spec): ${dir}`);
    continue;
  }
  const path = join(ROOT, dir, "messages", "en.json");
  const data = JSON.parse(readFileSync(path, "utf8"));
  const addrLine = line(spec.parts);
  data.access.postal = spec.postal;
  data.access.line = addrLine;
  data.footer.location = `${spec.postal.split(",")[0]} · ${addrLine}`;
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log(`✓ ${dir}`);
  updated++;
}

console.log(`\n${updated} en.json files updated`);
