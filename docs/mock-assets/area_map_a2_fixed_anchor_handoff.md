# A2 — 固定拠点（スキー場・駅）リスト除外 + マップ下部トグル

**Date:** 2026-06-15  
**Author:** L1 横断（ユーザー報告・スクリーンショット）  
**前提:** `area_map_m1_a1_handoff.md` A1 を **本書で上書き**（トグル位置・リスト仕様）  
**Implementer:** `@resort-template-implementer`（**L3 評価 FAIL 記録後に着手**）  
**Evaluator:** L3 — `area_map_ux_eval.md` 更新必須

**現状バグ（コード）**

`area-map.js` の `sortForList()` が **意図的に ski / biei-station を先頭に並べている**:

```js
return [...hubs, ...rest]; // ← リスト 01/02 がスキー場・駅で固定
```

レールの表示行数が少ないとき（R1 修正後も狭いビューポート）、**3 行しか見えないのに 2 行が拠点で潰れる**。

---

## 0. 評価 → 実装の順序（必須）

```
① L3: 本書「評価ゲート」で現状を FAIL 記録（area_map_ux_eval.md）
② L2: 本書「実装タスク」どおり修正
③ L3: 完了条件で再評価 PASS
```

**評価なしで実装だけ完了、は不可。**

---

## 1. L3 評価ゲート（現状 → 期待 FAIL）

### A2-FAIL チェック（いずれか該当で FAIL）

| # | 観点 | 現状（ユーザー報告） | 合格 |
|---|------|----------------------|------|
| 1 | リスト先頭 | 01 スキー場・02 駅が常に最上部 | 01 から **飲食 or 青い池等**（拠点固定 2 件なし） |
| 2 | 可視行の浪費 | 3 行しか見えないのに 2 行が拠点 | 可視域は **回遊対象 POI** のみ |
| 3 | 件数 | レール「13件」に ski/station 含む | **リスト対象のみ**カウント（例: food+その他 anchor = 11） |
| 4 | トグル位置 | なし or レール内 | **地図ステージ下部**（下記 §3） |
| 5 | 地図ピン | — | スキー場・駅は **デフォルト ON**（地図上は表示可） |

### 評価記録テンプレ（`area_map_ux_eval.md` に追記）

```markdown
### A2 固定拠点リスト分離
| 観点 | 結果 | メモ |
|------|------|------|
| リスト 01/02 が ski/station | **FAIL** | sortForList が hubs 先頭固定 |
| マップ下部トグル | **FAIL** | 未実装 |
```

---

## 2. 要件（ユーザー指示・確定）

1. **スキー場（`ski`）・駅（`biei-station`）はリストに出さない**（番号 01/02 を占有しない）
2. 地図上では **デフォルト表示**（固定拠点ピン）
3. **マップの下部**に小さなチェックボックスで個別 ON/OFF
   - レール上部・レール内 FAB シートの先頭 **禁止**
4. 「拠点」レイヤー OFF でも、チェック ON ならスキー場・駅ピンは残る（A1 同様）
5. embed（LP iframe）: トグルは **非表示可**（固定ピン常時 ON）。standalone は必須。

---

## 3. 実装タスク

### 3.1 `area-map.js` — リスト

#### `FIXED_ANCHOR_IDS`

```js
const FIXED_ANCHOR_IDS = new Set(["ski", "biei-station"]);
```

#### `sortForList(items)` — **書き換え**

```js
function sortForList(items) {
  return items.filter((f) => !FIXED_ANCHOR_IDS.has(f.id));
  // 既存の [...hubs, ...rest] は削除
}
```

#### `renderFilters()` の `spotCount`

- `filteredFeatures().filter(f => !FIXED_ANCHOR_IDS.has(f.id)).length` を表示

#### `renderMarkers()`

- `fixedAnchorVisible[id]` が true のとき、**anchor レイヤー OFF でも** ski / biei-station を描画
- false のとき非表示

#### `featuresForBounds()`

- 表示中の固定拠点は bounds に含める（町民スキー場起点を維持）

### 3.2 UI — マップ下部トグル（§A1 レール配置は **廃止**）

#### DOM 配置

`.area-stage` 内、`.area-leaflet-wrap` の **兄弟**として JS 生成（standalone のみ）:

```html
<div class="area-stage" id="area-stage">
  <div class="area-leaflet-wrap">…</div>
  <div class="area-map-fixed-toggles" role="group" aria-label="…">
    <label class="area-map-fixed-toggle">
      <input type="checkbox" data-fixed-anchor="ski" checked />
      <span>スキー場</span>
    </label>
    <label class="area-map-fixed-toggle">
      <input type="checkbox" data-fixed-anchor="biei-station" checked />
      <span>駅</span>
    </label>
  </div>
</div>
```

- `initFixedAnchorToggles()` を `initLeafletMap` 前後で呼ぶ
- `embed === true` のときは **生成しない**（または `display: none`）

#### CSS（`area-map.css`）

```css
.area-stage { position: relative; }

.area-map-fixed-toggles {
  position: absolute;
  left: 0.65rem;
  right: 0.65rem;
  bottom: 0.5rem;
  z-index: 5;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  padding: 0.35rem 0.5rem;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid #1a1f26;
  border-radius: 0;
  font-size: 0.6875rem;
  color: #1a1f26;
  pointer-events: auto;
}

.area-map-fixed-toggle {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 32px;
  cursor: pointer;
}

.area-map-fixed-toggle input {
  width: 1rem;
  height: 1rem;
  margin: 0;
  accent-color: #1a1f26;
}
```

#### 重なり回避

| モード | 調整 |
|--------|------|
| standalone | 地図ヒント `.area-map-hint` がある場合はトグルを **ヒントの上**（`bottom: 2.5rem`）またはヒントをトグル上に統合 |
| embed mobile FAB | `.area-embed-list-fab` と重なる場合は `bottom: 3.5rem`（FAB 上） |
| popup 開時 | トグルは地図下に残してよい（z-index < popup） |

### 3.3 データ（任意）

`biei-area.json` の ski / biei-station に:

```json
"fixedOnMap": true,
"listExclude": true
```

JS は `FIXED_ANCHOR_IDS` を正とし、JSON はドキュメント用。

### 3.4 i18n

| key | ja | en |
|-----|----|----|
| `fixedToggleGroup` | 地図の表示 | Map overlays |
| `fixedSki` | スキー場 | Ski area |
| `fixedStation` | 駅 | Station |

---

## 4. L3 完了条件（再評価 PASS）

| # | 操作 | 期待 |
|---|------|------|
| 1 | standalone `food,anchor` 初回 | リスト **01 = 最初の飲食店 or 青い池**（スキー場・駅なし） |
| 2 | レール件数 | 「11件」等（13 − 固定 2） |
| 3 | 地図下部 | チェック 2 つ表示。デフォルト両方 ON |
| 4 | 駅 OFF | 駅ピン消える。リスト不変 |
| 5 | スキー場 OFF | スキー場ピン消える |
| 6 | 狭いレール（3 行可視） | 可視 3 行が **すべて回遊 POI**（拠点で占めない） |
| 7 | embed | トグルなしでもピン 2 つ表示（回帰なし） |

```bash
cd guides && node scripts/sync.mjs && npm run dev
# http://localhost:3456/area-map.html?resort=biei&layers=food,anchor
```

---

## 5. 関連 handoff

| 文書 | 関係 |
|------|------|
| `area_map_m1_a1_handoff.md` | M1 地図高さ。A1 レール内トグル → **A2 で廃止** |
| `area_map_p1_popup_handoff.md` | ポップアップ（並行可） |
| `area_map_r1_fix.md` | レールリスト min-height |

---

## 6. 依頼文（コピペ）

### Step 1 — L3 評価（先に実行）

```
area_map_ux_eval.md に A2 節を追加し、現状を FAIL で記録してください。
確認: guides.japowserch.com/area-map.html?resort=biei&layers=food,anchor
- リスト 01/02 がスキー場・駅か
- 可視 3 行が拠点 2 + 他 1 で潰れていないか
記録後、area_map_a2_fixed_anchor_handoff.md の実装に進む。
```

### Step 2 — L2 実装

```
@resort-template-implementer
docs/mock-assets/area_map_a2_fixed_anchor_handoff.md に従い実装（L3 FAIL 記録後）。

- sortForList から ski/biei-station の先頭固定を削除（リスト完全除外）
- spotCount から固定拠点を除外
- マップ下部 .area-map-fixed-toggles でチェック ON/OFF（レール内トグル禁止）
- embed はトグル非表示・ピン常時 ON

完了後 guides/scripts/sync.mjs、area_map_ux_eval.md の A2 を PASS に更新。
```

### Step 3 — L3 再評価

```
area_map_a2_fixed_anchor_handoff.md §4 の 1–7 を実機確認。1 件でも ski/station がリスト先頭なら FAIL のまま出荷不可。
```
