# U3 修正指示 — コンパクト embed のピン密集・タップ困難

**Date:** 2026-06-15  
**Author:** `resort-ux-designer`（WARN 是正指示）  
**Implementer:** `@resort-template-implementer`  
**起因:** `area_map_ux_eval.md` **U3** — モバイル embed（高さ ~14–22rem）で 10+ ピンが重なり、指タップの成功率が低い

---

## 0. 修正方針（1 行）

**モバイル embed では「地図ピン直タップ」を補助経路に格下げし、タッチ領域 48px 化 + FAB リスト + 親「地図で見る」を主経路として明示する。** 俯瞰維持・選択時ズーム禁止は変えない。

---

## 1. 採用する対策（優先順）

| 優先 | 対策 | 効果 | 採用 |
|------|------|------|------|
| P0 | embed モバイルでピン **hit area ≥ 48px**（見た目は現サイズ維持可） | 誤タップ低減 | ✅ 必須 |
| P0 | FAB「スポット一覧」を **常時表示**（≤768px embed）+ `aria-expanded` 維持 | リスト選択が主経路に | ✅ 必須（既存を仕上げ） |
| P1 | 親 LP に **モバイル専用ヒント** 1 行 | 「地図で見る」誘導 | ✅ 必須 |
| P1 | 親 `postMessage` focus 時 **必ず popup + autoPan**（再確認） | リスト経路の完了感 | ✅ 必須 |
| P2 | モバイルのみ embed 高さ **微増**（`24rem` / `45dvh` cap） | ピン視認性 | ✅ 推奨 |
| — | 選択時ズームイン | — | ❌ 禁止 |
| — | 全画面マップ化（50dvh+） | — | ❌ 禁止 |
| — | markercluster 導入 | 実装コスト大 | ❌ v2 見送り |

---

## 2. ファイル別タスク

### 2.1 `docs/mock-assets/_shared/area-map.js`

#### A. `makeIcon()` — embed モバイル用ヒットボックス

`isEmbedMobile()` が true のとき:

```javascript
// 見た目 size: 通常 32 / ski 40 / active 48（現行維持）
// タッチ枠: 常に 48×48px（active 時 52×52px 可）
```

**実装案（推奨）:** `L.divIcon` ラッパー

```html
<span class="area-pin-hit" style="width:48px;height:48px;display:flex;align-items:center;justify-content:center">
  <img src="..." width="32" height="32" alt="" draggable="false" />
</span>
```

- `iconSize: [48, 48]`, `iconAnchor: [24, 24]`
- active 時: 内側 img を 40–48px、外枠 52px まで可
- **standalone / デスクトップ embed は現行 `L.icon` のまま**（U3 スコープ外）

#### B. `select()` / `openPopupForFeature()` — focus 時 autoPan 強化

- `postMessage` / `?focus=` 受信時: `openPopupForFeature` 後 `leafletMap.panTo(marker.getLatLng(), { animate, duration: 0.25 })` は **禁止**（ズーム変更と混同されやすい）
- Leaflet popup の `autoPan: true` + `autoPanPadding: [56, 56]`（embed モバイルのみ）で十分か確認
- focus 受信時に該当マーカーが非表示レイヤーなら `ensureLayersForSpot` 相当を iframe 内でも実行済みか確認（親が担当）

#### C. `initEmbedMobileRail()` — FAB 常時化の確認

- `embed && max-width: 768px` で FAB が **必ず** 生成されること
- 地図読込前でも FAB は表示（リストは空でも可）
- FAB 文言: 既存 `UI.embedListFab` / `embedListFabClose`

---

### 2.2 `docs/mock-assets/_shared/area-map.css`

```css
/* ピンタッチ枠（embed モバイルのみ JS が class 付与） */
.area-pin-hit {
  background: transparent;
  border: none;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .area-map-page--embed .area-embed-list-fab {
    /* 地図右下・popup/FAB 非重複は既存 offset 維持 */
    min-width: 48px;
    min-height: 48px;
  }
}
```

- FAB が popup 下に隠れる場合: 既存 `popupOffset()` `[0, -44]` を `[0, -52]` に微調整可

---

### 2.3 `docs/mock-assets/biei-lp/mock.css`

**モバイルのみ** embed 高さ微増（BKKDW コンパクトは維持しつつ U3 緩和）:

```css
@media (max-width: 768px) {
  .map-embed {
    max-height: min(24rem, 45dvh);
    min-height: 13rem;
  }
}
```

- Desktop `≥769px` は現行 `min(25rem, 42vw)` **変更しない**

---

### 2.4 `docs/mock-assets/biei-lp/messages/ja.json` / `en.json`

新規キー（例）:

| キー | ja | en |
|------|----|----|
| `nearbyFood.mapLayers.mobileHint` | ピンが重なるときは下の店舗一覧の「地図で見る」か、地図右下の「スポット一覧」をご利用ください | If pins overlap, use **View on map** in the list below or **Spot list** on the map |
| `nearbyOnsen.mapLayers.mobileHint` | （同上・温泉向け文言） | （同上） |

`nearby-food.html` / `nearby-onsen.html`:

```html
<p class="map-layer-hint map-layer-hint--mobile" data-i18n="nearbyFood.mapLayers.mobileHint"></p>
```

```css
.map-layer-hint--mobile {
  display: none;
}
@media (max-width: 768px) {
  .map-layer-hint--mobile { display: block; }
}
```

---

### 2.5 触らない

- `fitBounds` / `maxZoom` ロジック（U1 とは別タスク）
- スタンドアロン `area-map.html` のピンサイズ（レールリストがあるため U3 対象外）
- 七戸 `/map`

---

## 3. IA ルール（仕様として固定）

| ブレークポイント | 主経路 | 補助経路 |
|------------------|--------|----------|
| Desktop embed | 地図ピンタップ + 下部店舗リスト | — |
| Mobile embed ≤768px | **① 店舗「地図で見る」 ② FAB リスト** | 地図ピン直タップ |
| Standalone | レールリスト + ピンタップ | — |

モバイル embed で「ピンをタップ」と書く既存 `mapHint`（iframe 内）は **非表示のまま**（embed では既に hidden）。誤誘導を増やさない。

---

## 4. 完了条件（U3 クローズ）

| # | 検証（375px 幅・iPhone SE 相当） | 合格 |
|---|----------------------------------|------|
| 1 | 親「地図で見る」→ マップスクロール + popup 表示 | |
| 2 | FAB → リストタップ → popup（ズーム不変） | |
| 3 | ピン直タップ: **48px 枠**で隣接ピンを誤選択しにくい（隣接 2 店で A/B 手動テスト） | |
| 4 | モバイルヒント文言が 768px 以下でのみ表示 | |
| 5 | Desktop embed レイアウト・高さが退行していない | |
| 6 | `prefers-reduced-motion` で pan/animate 無効 | |

```bash
npx serve docs/mock-assets -p 3456
# /biei-lp/nearby-food.html — DevTools 375×667
```

---

## 5. L3 再評価

実装後:

```
@resort-qa-a11y   — A4（48px）再確認
area_map_ux_eval.md U3 行を PASS に更新
```

---

## 6. 依頼文（コピペ）

```
@resort-template-implementer
docs/mock-assets/area_map_u3_fix.md に従い U3（モバイル embed ピン密集）を修正。
P0: 48px hit area + FAB 主経路 + モバイルヒント
P2: mock.css モバイル embed 高さ微増
確認: 375px / nearby-food.html
```
