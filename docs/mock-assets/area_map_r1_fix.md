# R1 — standalone レールリスト高さ潰れ

**Date:** 2026-06-15  
**Verdict:** FAIL → 是正済み（`area-map.css`）

## 症状

`/area-map.html` standalone で、フィルタヒントと免責の間の `.area-list` が **1 行分**しか見えない（`max-height: min(14rem, 32vh)` がレール全体に適用され、ヘッダ＋フッタが高さを食う）。

## 原因

- 768–1023px / ≤768px で `.area-rail { max-height: min(14rem, 32vh) }`
- `.area-list` に `min-height` なし。flex 子が潰れる
- 評価 J1 は「embed は地図のみ PASS」とし、**standalone レールの可読性を未検証**

## 修正

| 変更 | 内容 |
|------|------|
| `--area-map-widget-max` | `min(36rem, 70vh)` に拡張 |
| `--area-list-min` | `min(16rem, 38vh)` をリスト最低高に |
| tablet/mobile standalone | レール `max-height` 撤廃、`min-height: min(24–26rem, 52–55vh)` |
| embed mobile シート | `max-height: min(58%, 20rem)` |

## 完了条件

- [ ] standalone 375px / 820px でリスト **4 行以上**がスクロールなしで見える
- [ ] フィルタヒントと免責の間にリスト領域がある（1 行だけではない）
