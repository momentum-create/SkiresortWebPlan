# M1 + A1 — エージェント引き渡し（地図空白・固定拠点ピン）

**Date:** 2026-06-15  
**Author:** L1 横断（ユーザー報告 + 本番 `guides.japowserch.com` 確認）  
**Implementer:** `@resort-template-implementer`  
**L3 再評価:** `area_map_ux_eval.md` 更新必須（M1/A1 行追加）

**対象 URL（本番）**

- https://guides.japowserch.com/area-map.html?resort=biei&layers=food,anchor
- embed: `/biei/nearby-food.html` の iframe

---

## 優先度

| ID | 内容 | 優先 |
|----|------|------|
| **M1** | standalone で Leaflet タイルが出ない（白画面・ヒントのみ） | **P0** |
| **A1** | スキー場・駅は地図に常時表示、リスト先頭から除外、個別トグル | **P1** |

---

## M1 — 地図が表示されない（P0）

### 症状

- `/area-map.html` standalone（幅 ≥1024px）で左ペインが **白／灰の空枠**
- 「ピンをタップすると地図上に詳細が表示されます」は出る → JS は動いているが **`.area-leaflet-map` の高さが 0**

### 根因

`area-map.css` で standalone の `.area-stage` が `height: auto` のまま。子の `.area-leaflet-wrap` / `.area-leaflet-map` は `flex: 1` だが **親に確定高さがない**ため Leaflet コンテナが潰れる。

embed は `height: 100%` チェーンがあるため再現しにくい。**本番 standalone のみ再現**。

### 実装タスク（`area-map.css`）

1. standalone（`body.area-map-page:not(.area-map-page--embed)`）の `.area-shell` に **確定高さ**を付与:
   - `height: var(--area-map-widget-max);`
   - `min-height: 22rem;`
2. `.area-stage` を `height: 100%`（または shell と同じ max）、`align-self: stretch`
3. `.area-leaflet-wrap` / `.area-leaflet-map` に `min-height: 0` を維持しつつ親高さを継承
4. `initLeafletMap` 内の `invalidateSize()` は維持（resize 後もタイル再描画）

### 完了条件（M1）

| # | 環境 | 期待 |
|---|------|------|
| 1 | guides.japowserch.com standalone 1440px | Carto タイル + ピン表示 |
| 2 | 同上 820px / 375px | タイル表示（R1 リスト高さと両立） |
| 3 | embed `nearby-food.html` | 回帰なし（地図 + ピン） |
| 4 | DevTools → `.area-leaflet-map` | `offsetHeight ≥ 200` |

```bash
cd guides && node scripts/sync.mjs && npm run dev
# http://localhost:3456/area-map.html?resort=biei&layers=food,anchor
```

---

## A1 — スキー場・駅を固定拠点ピンに（P1）

### 要件（ユーザー指示）

1. **スキー場（`ski`）と駅（`biei-station`）は地図上に常時表示してよい**（デフォルト ON）
2. **リストの 01 / 02 に並べない** — リスト先頭は飲食・温泉・その他拠点（青い池など）から
3. レール上部に **小さなチェックボックス**（または同等のトグル）で:
   - 「スキー場を表示」
   - 「駅を表示」
   - 個別に ON/OFF 可能
4. レイヤーチップ（飲食 / 温泉 / 拠点）とは **別 UI**（拠点レイヤー OFF でもスキー場・駅トグルは独立）

### データ契約（`biei-area.json`）

`anchors` の `ski` / `biei-station` に任意フィールドを追加可:

```json
{
  "id": "ski",
  "fixedOnMap": true,
  "listExclude": true,
  ...
}
```

JS 側フォールバック: `FIXED_ANCHOR_IDS = ["ski", "biei-station"]`（`resortId === "biei"` のみでも可）

### 実装タスク（`area-map.js`）

#### A. 状態

```js
const FIXED_ANCHOR_IDS = ["ski", "biei-station"];
let fixedAnchorVisible = { ski: true, "biei-station": true };
```

#### B. マーカー描画 `renderMarkers()`

- `fixedAnchorVisible[id] === true` のとき **レイヤー `anchor` が OFF でも**ピンを描画
- `false` のときピン非表示（marker 削除 or layer から除外）

#### C. リスト `sortForList()` / `renderList()`

- `FIXED_ANCHOR_IDS` を **リストから常に除外**
- 件数表示 `spotCount` は **リスト対象のみ**（固定拠点は含めない）

#### D. `fitBounds`

- 固定拠点が表示中なら bounds に **常に含める**（町民スキー場起点の俯瞰を維持）
- 両方 OFF のときは food/onsen/anchor フィルタのみ（稀ケース）

#### E. UI（`area-map.html` + CSS）

レール `.area-rail-head` 内、レイヤーチップの **上または下** に:

```html
<div class="area-fixed-toggles" role="group" aria-label="…">
  <label class="area-fixed-toggle">
    <input type="checkbox" data-fixed-anchor="ski" checked />
    <span>スキー場</span>
  </label>
  <label class="area-fixed-toggle">
    <input type="checkbox" data-fixed-anchor="biei-station" checked />
    <span>駅</span>
  </label>
</div>
```

- コンパクト（フォント 0.75rem 前後）、**チェックボックス + ラベル**
- タップ領域は `min-height: 44px` または label 全体クリック可
- embed: トグルは **非表示**（地図のみ。固定ピンは常時 ON）でも可 — 要: standalone のみ表示でよい

#### F. i18n

`messages` または `area-map.js` UI ブロック:

| key | ja | en |
|-----|----|----|
| fixedToggleLabel | 拠点の表示 | Show hubs |
| fixedSki | スキー場 | Ski area |
| fixedStation | 駅 | Station |

### 完了条件（A1）

| # | 操作 | 期待 |
|---|------|------|
| 1 | standalone 初回 | 地図にスキー場・駅ピン。リスト 01 は **青い池 or 最初の飲食店**（スキー場・駅ではない） |
| 2 | 駅チェック OFF | 駅ピンのみ消える。リスト変化なし |
| 3 | スキー場チェック OFF | スキー場ピンのみ消える |
| 4 | 「拠点」レイヤー OFF | 青い池等は消えるが、スキー場・駅トグル ON なら **残る** |
| 5 | 両トグル OFF + food のみ | 飲食ピンのみの俯瞰 |

---

## ファイル一覧

| ファイル | M1 | A1 |
|----------|----|----|
| `_shared/area-map.css` | ✅ 高さ修正 | トグルスタイル |
| `_shared/area-map.js` | invalidateSize 確認 | 固定拠点ロジック + トグル |
| `area-map.html` | — | トグル DOM（または JS 生成） |
| `data/maps/biei-area.json` | — | `fixedOnMap` / `listExclude` 任意 |
| `biei-lp/messages/ja.json` `en.json` | — | トグル文言（embed 用ヒント追記は任意） |

ビルド: `guides/scripts/sync.mjs` → Vercel `guides/` Root。

---

## L3 評価更新

`area_map_ux_eval.md` に追加:

| ID | 観点 | 合格条件 |
|----|------|----------|
| M1 | standalone タイル表示 | 1440/820/375 で Carto タイル可視 |
| A1 | 固定拠点 + リスト分離 | 上表 1–5 |

**M1 が FAIL の間は出荷不可。**

---

## 依頼文（コピペ）

### Implementer

```
@resort-template-implementer
docs/mock-assets/area_map_m1_a1_handoff.md に従い実装してください。

P0: M1 — standalone area-map で Leaflet が白画面になる CSS 高さバグを修正。
P1: A1 — ski / biei-station をリストから除外し、地図上はデフォルト表示。レールに小さなチェックボックスで個別 ON/OFF。

完了後 guides/scripts/sync.mjs を実行し、area_map_ux_eval.md に M1/A1 行を追記。
```

### L3 再評価

```
area_map_ux_eval.md を更新し、M1（本番 standalone でタイル表示）と A1（固定拠点・リスト分離）を実機確認して PASS/FAIL を記録。
guides.japowserch.com/area-map.html?resort=biei&layers=food,anchor を 1440px で必ず開くこと。
```
