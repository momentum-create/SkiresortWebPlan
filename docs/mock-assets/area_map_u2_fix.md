# U2 修正指示 — ハッシュ分離（マップ vs 特集記事エントリ）

**Date:** 2026-06-15  
**Author:** `resort-i18n-spec`（URL・ハッシュ方針）+ `resort-map-bridge`（導線）  
**Implementer:** `@resort-template-implementer`  
**起因:** `area_map_ux_eval.md` **U2** — popup「特集を読む」が `#spot-*` を使い、LP 上でマップへスクロールしてしまい店舗紹介段落に届かない

---

## 0. 修正方針（1 行）

**`#spot-{id}` = マップ focus、`#entry-{id}` = 10 選リストの店舗段落** に役割を分離する。

---

## 1. URL / ハッシュ契約（`resort-i18n-spec`）

| ハッシュ | 意味 | スクロール先 | マップ focus |
|----------|------|--------------|--------------|
| `#spot-{id}` | 地図でこの店を見る | `#food-map` / `#onsen-map` | ✅ `postMessage` focus |
| `#entry-{id}` | 特集記事の店舗段落へ | `[data-spot-entry="{id}"]`（`id="entry-{id}"`） | ❌ しない |

### リンク発行元

| 発行元 | ハッシュ |
|--------|----------|
| リスト「地図で見る」 | `?focus=` + 親 JS → `#spot-{id}`（現行維持） |
| popup「特集を読む」 | `#entry-{id}` |
| 外部 deep link（記事共有） | `#entry-{id}` 推奨 |

`?lang=en` クエリは既存どおりハッシュの前に付与可。

---

## 2. ファイル別タスク

### 2.1 `docs/mock-assets/_shared/area-map.js`

`guideHref(feature)` を変更:

```javascript
// food / onsen
return `${resortId}-lp/nearby-food.html#entry-${feature.id}${langQ}`;
// onsen → nearby-onsen.html
```

`#spot-*` は **guide リンクでは使わない**。

### 2.2 `docs/mock-assets/_shared/map-embed-layers.js`

- `entryIdFromHash()` — `/^#entry-(.+)$/` を追加。
- 初回 boot: `#entry-*` なら `scrollEntryIntoView(id)` のみ（マップ focus しない）。
- `#spot-*` は現行どおり `focusSpot(id, true)`。
- `hashchange`: `#entry-*` 優先でリストスクロール。`#spot-*` はマップ focus。
- レイヤー切替で `#spot-*` クリアは現行維持。`#entry-*` は触らない。

```javascript
function scrollEntryIntoView(id) {
  const el = document.getElementById(`entry-${id}`) ||
    document.querySelector(`[data-spot-entry="${id}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
}
```

### 2.3 `biei-lp/nearby-food.html` / `nearby-onsen.html`

各 `<li class="food-spot" data-spot-entry="…">` に **`id="entry-{同ID}"`** を付与（deep link 安定化）。

### 2.4 `biei-lp/mock.css`

- `.food-spot { scroll-margin-top: 5rem; }` は既存利用。
- 壊れている `.map-layer-toggles` セレクタを復元（`display: flex` ブロック）。

---

## 3. 完了条件（U2 クローズ）

| # | 操作 | 期待 |
|---|------|------|
| 1 | standalone popup「特集を読む」（じゅんぺい） | `nearby-food.html#entry-junpei` → **リスト 01 段落**へスクロール。マップ focus しない |
| 2 | `#spot-junpei` 直リンク | 上部マップへスクロール + popup |
| 3 | `#entry-chiyoda` 直リンク | 04 千代田段落へスクロール。マップは動かない |
| 4 | EN `?lang=en#entry-*` | 同様に EN ページで該当段落へ |

```bash
npx serve docs/mock-assets -p 3456
```

---

## 4. L3 再評価

実装後 `area_map_ux_eval.md` の U2 行を **PASS** に更新。

---

## 5. 依頼文（コピペ）

```
@resort-template-implementer
docs/mock-assets/area_map_u2_fix.md に従い U2（#spot / #entry 分離）を実装。
guideHref → #entry-*、map-embed-layers に entry ハッシュ処理、LP li に id="entry-*"
確認: popup 特集リンク / #entry-chiyoda / #spot-junpei の 3 パターン
```
