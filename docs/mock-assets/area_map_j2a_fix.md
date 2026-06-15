# J2-a 修正 — 親 LP リスト ↔ マップ focus 双方向同期

**Date:** 2026-06-15  
**Implementer:** `@resort-template-implementer`  
**起因:** `area_map_ux_eval.md` J2-a — マップ focus 中、下部 10 選リストで「どの店か」が分からない

---

## 0. 設計判断（厳格）

| 決定 | 理由 |
|------|------|
| `.is-map-focused` は **`#spot-*` / マップ選択と連動** | 地図上の「今見ている店」のミラー。`#entry-*`（記事段落）とは独立 |
| **リスト自動スクロールはしない** | ピンタップ時に下部へ飛ぶと文脈が逆転。ハイライトのみ |
| **iframe → 親の `postMessage`** を追加 | ピン直タップ・FAB リスト経路でも親リストを更新 |
| **`aria-current="location"`** | スクリーンリーダーに「地図上の現在地」として通知 |
| ビジュアルは standalone レール `.is-active` と同型 | inset 3px + `--accent-soft` 背景 |

---

## 1. 状態遷移

```
地図で見る / #spot-*  → focusSpot(id) → .is-map-focused + postMessage focus
ピンタップ / FAB      → iframe select → postMessage focus → 親 sync
popup 閉じ / Esc      → closePopup → postMessage focus:null → 親 clear
レイヤー切替          → clearMapFocus → focus:null
#entry-*              → 段落スクロールのみ（is-map-focused は触らない）
```

---

## 2. 変更ファイル

| ファイル | 内容 |
|----------|------|
| `map-embed-layers.js` | `syncParentListFocus`, `clearMapFocus`, iframe `focus` 受信 |
| `area-map.js` | `notifyParentFocus`, `focus: null` 処理, select 重複ガード |
| `mock.css` | `.food-spot.is-map-focused` |

---

## 3. 完了条件

| # | 操作 | 期待 |
|---|------|------|
| 1 | 「地図で見る」→ 千代田 | 04 行に `.is-map-focused` + `aria-current="location"` |
| 2 | embed ピンタップ（別店） | 親リスト active が切り替わる |
| 3 | popup 閉じる | 全行から active 解除、`#spot-*` クリア |
| 4 | レイヤー切替 | active 解除 |
| 5 | `#entry-chiyoda` のみ | 段落スクロール、**is-map-focused なし**（マップ未操作時） |
