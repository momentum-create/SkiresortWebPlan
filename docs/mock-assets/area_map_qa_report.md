# 周辺エリアマップ — QA / a11y レポート

**Date:** 2026-06-15 (re-eval: scroll fix + margin fix + Mapular pins)  
**Evaluator:** `resort-qa-a11y` (L3)  
**対象:** `area-map.html`（standalone + embed）、`biei-lp/nearby-food.html`、`biei-lp/nearby-onsen.html`  
**基準:** `area_map_requirements.md` §3–§5

---

## Verdict

**PASS**

---

## ルーブリック（Q1–Q6）

| ID | 結果 | 根拠 |
|----|------|------|
| **Q1** Mobile-first | **PASS** | `.map-embed` `aspect-ratio: 16/9` + `max-height: min(22rem, 56vw)`。FAB / フィルタ / CTA ≥ 44px。embed は地図のみ（レール非表示）。 |
| **Q2** Accessibility | **PASS** | `:focus-visible` 全インタラクティブ要素。popup `role="dialog"` + `aria-labelledby`。`prefers-reduced-motion` 対応。lang switch `aria-current`。 |
| **Q3** Conversion path | **PASS** | ショップ「地図で見る」→ `#food-map` へスクロール + iframe `postMessage` focus（ページ遷移なし）。popup Primary CTA → Google Maps。 |
| **Q4** i18n | **PASS** | `UI.ja` / `UI.en`。`filterLabel` i18n。POI は JSON `{ja,en}`。 |
| **Q5** Performance | **PASS** | 初回 iframe load 後は `postMessage` 同期。無限アニメーションなし。 |
| **Q6** Data separation | **PASS** | POI / 座標は `biei-area.json`。ピン定義は `marker-icons.json`。UI 文言は `area-map.js` のみ。 |

---

## a11y（A1–A7）

| ID | 結果 | 根拠 |
|----|------|------|
| **A1–A7** | **PASS** | popup dialog / aria-label / 44px / Esc 閉じ / reduced-motion — 前回 PASS 維持。 |

---

## 機能（F1–F23 抜粋）

| ID | 結果 | 備考 |
|----|------|------|
| F1–F5 | **PASS** | `fitBounds` のみ。選択時 zoom 不変。 |
| F6–F8 | **PASS** | Mapular PNG ピン（`marker-icons.json`）。ski 40px / active 48px。 |
| F9–F17 | **PASS** | 地図上 popup 主詳細。リスト↔ピン同期。 |
| F18–F20 | **PASS** | embed `postMessage` + レイヤーチップ。FAB（モバイル）。 |
| F21–F23 | **PASS** | `schemaVersion: 2026-06-14-bkkdw`。サンプル POI ≥3。 |

---

## 2026-06-15 修正ログ（ブロッカー解消）

| 問題 | 原因 | 修正 | 結果 |
|------|------|------|------|
| `#spot-*` で表示位置がおかしい | リスト `id="spot-*"` と hash 衝突 → ブラウザが下部リストへ自動スクロール | リスト `id` 廃止（`data-spot-entry`）。hash 時は `#food-map` / `#onsen-map` へ `scrollIntoView({ block: "start" })` + `scroll-margin-top: 5.5rem` | **PASS** |
| マップ下部の巨大余白 | `.area-shell` の `align-items: stretch` で stage がレール高に引き伸ばされ、地図下が空白 | `align-items: flex-start`。免責文を stage 外 → `.area-rail-foot` へ移動 | **PASS** |
| マップが大きすぎる | 72vh / 60dvh 全画面化 | BKKDW 型 `aspect-ratio: 16/9` + capped height（前回修正維持） | **PASS** |

---

## WARN（出荷ブロック外）

| 項目 | 内容 |
|------|------|
| W1 | food + onsen 同時 ON 時 maxZoom 10 広域俯瞰（既知トレードオフ） |
| W2 | embed デスクトップは地図のみ — リストは親 LP 側（意図通り） |

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → mock LP 周辺マップ v2 出荷可
```

**本レポート:** ✅ PASS
