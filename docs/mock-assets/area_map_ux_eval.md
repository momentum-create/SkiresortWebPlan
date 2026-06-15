# 周辺エリアマップ — UX 評価レポート（厳格再評価）

**Date:** 2026-06-15（U1/U2 是正後・厳格ゲート）  
**Evaluator:** `resort-ux-designer` / L3 横断レビュー  
**基準:** `area_map_ux_spec.md` §2 設計原則、`area_map_u1_fix.md`、`area_map_u2_fix.md`  
**対象:** `nearby-food.html` embed、`nearby-onsen.html` embed、`area-map.html` standalone

---

## Verdict

**FAIL（R1 是正前）→ 再評価待ち** — U1/U2/U3/J2-a は合格だが、**standalone レールリストの可読性で致命的欠陥（R1）**。embed 合格だけで全体 PASS としたのは評価漏れ。

| ゲート | 結果 |
|--------|------|
| 設計原則 §2（6 項） | **5/6 PASS**（統一ピンは Mapular 上書き・許容） |
| WARN / FAIL 是正 | **4/4 PASS**（U1–U3, J2-a） |
| **R1 レールリスト高さ** | **FAIL → 修正済み**（`area_map_r1_fix.md`） |
| 厳格総合 | **再確認まで出荷不可** |

---

## ジャーニー別評価（厳格）

### J1 LP 埋め込み — 初回表示

| 観点 | 結果 | 根拠 |
|------|------|------|
| 地図サイズ | **PASS** | `aspect-ratio: 16/9`, `max-height: ~22–25rem`。記事主役を奪わない。 |
| 俯瞰 | **PASS** | `skiFood` profile + `fitBounds`。遠方 3 店は初期除外（密度管理）。 |
| レイヤーチップ | **PASS** | `postMessage` 同期。リロードなし。 |
| embed 内リスト | **PASS** | デスクトップ embed は地図のみ。10 選はページ下部。 |

### J2 ショップ「地図で見る」→ マップ

| 観点 | 結果 | 根拠 |
|------|------|------|
| スクロール先 | **PASS** | `#spot-*` → `#food-map` / `#onsen-map`。`#entry-*` とは分離済み。 |
| 遠方店 focus 視認 | **PASS（U1 是正）** | `select()` → `fitMapToProfile(true, [id])`。千代田/Gosh/BTB でピンが bounds に含まれる。 |
| ピン focus + popup | **PASS** | `postMessage` + `select` + Mapular active + popup。 |
| リスト連動 | **PASS（J2-a 是正）** | `.is-map-focused` + `aria-current="location"`。親↔iframe 双方向 `postMessage`。 |

### J3 popup CTA・ハッシュ導線

| 観点 | 結果 | 根拠 |
|------|------|------|
| 「地図で開く →」 | **PASS** | Google Maps 外部 CTA。Primary 階層維持。 |
| 「特集を読む」 | **PASS（U2 是正）** | `guideHref` → `#entry-{id}`。店舗段落へスクロール。マップ focus しない。 |
| `#spot-*` deep link | **PASS** | マップセクション + focus + popup。 |
| `#entry-*` deep link | **PASS** | `scrollEntryIntoView` + `id="entry-*"` + `scroll-margin-top`。 |

### J4 地図操作（共通）

| 観点 | 結果 | 根拠 |
|------|------|------|
| 選択時ズーム | **PASS** | `flyTo` / `selectionZoom` なし。focus 時は bounds 拡張のみ。 |
| Esc / 空白閉じ | **PASS** | 実装済み。 |
| ピン識別 | **PASS** | Mapular PNG。密度高クラスタでは識別有利。 |
| モバイル embed タップ | **PASS（U3 是正）** | 48px hit area（divIcon）+ FAB 主経路 + モバイルヒント。ピン直タップは補助経路。 |

### J5 フルサイズマップ

| 観点 | 結果 | 根拠 |
|------|------|------|
| 下部余白 | **PASS** | `align-items: flex-start` + `.area-rail-foot`。 |
| 70/30 + 高さ cap | **PASS** | `--area-map-widget-max`。全画面化しない。 |
| レール↔ピン | **PASS** | 双方向同期。遠方店レール選択で U1 bounds 適用。 |
| **レールリスト可読性** | **FAIL → 修正** | R1: `max-height: 14rem` でリスト 1 行化。評価漏れ。 |

---

## 設計原則（ux_spec §2）厳格照合

| # | 原則 | 結果 | 厳格メモ |
|---|------|------|----------|
| 1 | Map-first | **PASS** | |
| 2 | Popup-primary | **PASS** | |
| 3 | No zoom-on-select | **PASS** | U1 は bounds 拡張のみ。ズームインではない。 |
| 4 | Unified pin | **N/A** | Mapular 採用（ユーザー上書き）。 |
| 5 | Layer = filter, not zoom trap | **PASS** | レイヤ切替後 fitBounds。focus POI は select 時のみ加算。 |
| 6 | リスト→全画面 sheet 禁止 | **PASS** | |

---

## WARN / FAIL 一覧

| ID | 内容 | 状態 | 影響 |
|----|------|------|------|
| **U1** | 遠方店 focus 時ピン視認 | **PASS** ✅ | `ensureIds` + `fitMapToProfile`（`area_map_u1_fix.md`） |
| **U2** | 特集リンクハッシュ | **PASS** ✅ | `#entry-*` / `#spot-*` 分離（`area_map_u2_fix.md`） |
| **U3** | モバイル embed ピン密集 | **PASS** ✅ | 48px hit area + FAB + モバイルヒント + embed 高さ微増（`area_map_u3_fix.md`） |
| **J2-a** | 親リスト active 表示 | **PASS** ✅ | `is-map-focused` 双方向同期（`area_map_j2a_fix.md`） |
| **R1** | standalone レールリスト高さ | **FAIL → 修正** | `max-height: 14rem` 撤廃 + `--area-list-min`（`area_map_r1_fix.md`） |

---

## 修正指示（参照）

| WARN | ドキュメント | 担当 |
|------|--------------|------|
| U1 | `area_map_u1_fix.md` | `resort-map-bridge` → implementer ✅ |
| U2 | `area_map_u2_fix.md` | `resort-i18n-spec` → implementer ✅ |
| U3 | `area_map_u3_fix.md` | implementer ✅ |
| J2-a | `area_map_j2a_fix.md` | implementer ✅ |

---

## 手動確認チェックリスト（厳格）

```bash
npx serve docs/mock-assets -p 3456
```

| # | 操作 | 期待 | 厳格 |
|---|------|------|------|
| 1 | 下部「地図で見る」→ 千代田 | マップ + popup + **ピン画面内** | ✅ U1 |
| 2 | standalone popup「特集を読む」 | `#entry-*` → **店舗段落**（マップ動かない） | ✅ U2 |
| 3 | `#spot-junpei` 直リンク | マップ focus | ✅ |
| 4 | `#entry-chiyoda` 直リンク | 04 段落へ | ✅ |
| 5 | 375px embed ピン直タップ 10 店 | 誤タップ許容範囲 | ✅ U3 |
| 6 | focus 中リスト行 | active 表示 | ✅ J2-a |

---

## Ship gate（厳格）

```
厳格 UX: FAIL（R1）— standalone リスト可読性。CSS 修正後に再評価
+ resort-qa-a11y PASS + resort-visual-evaluator PASS → mock LP 出荷可
```

**評価上の反省:** J1「embed は地図のみ PASS」を standalone レール品質の代替と誤認。フルサイズマップのリストは別ジャーニー（J5）で **最低 4 行の可読高さ**を必須とする。

**FAIL に格下げする条件（未達）:** U1/U2/J2-a の回帰、選択時ズームインの再導入、`#spot`/`#entry` 混同の再発。

---

## 変更サマリ（J2-a 含む）

| ファイル | 変更 |
|----------|------|
| `area-map.js` | `notifyParentFocus`、`focus: null` 処理、select 重複ガード |
| `map-embed-layers.js` | `syncParentListFocus`、`clearMapFocus`、iframe focus 受信 |
| `mock.css` | `.food-spot.is-map-focused` |
| `area_map_j2a_fix.md` | J2-a 設計・完了条件 |
