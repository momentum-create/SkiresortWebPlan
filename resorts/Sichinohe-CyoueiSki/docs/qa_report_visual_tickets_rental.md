# ビジュアル評価レポート — `/tickets-rental`

> **Agent**: `resort-visual-evaluator`（L3）  
> **Date**: 2026-06-11  
> **Target**: `resorts/Sichinohe-CyoueiSki/web/src/app/[locale]/tickets-rental/`  
> **Trigger**: アコーディオン撤去 → `AwardContentSection` 常時表示 + `AwardFold` 開閉 UI 改善

---

## Verdict

**PASS**

---

## Rubric

| ID | Result | 根拠 |
|----|--------|------|
| **V1** Typography | **PASS** | h2 `heading-lg` → h3 `award-content-section__title` (1.125rem) → table `th` (0.625rem)。価格列 `award-stat-inline`（IBM Plex Mono）で編集型差別化 |
| **V2** Spacing | **PASS** | `award-section` padding はサイト共通。セクション区切り 2rem（8px グリッド）。`AwardPageShell` `mt-12 space-y-10` 準拠 |
| **V3** Assets | **PASS** (N/A) | 参照データページ。ヒーロー画像なし |
| **V4** Micro-interactions | **PASS** | `AwardFold`: 円形 +/−、`--ease-award`、hover `--award-color-accent-soft`、`focus-visible` ring。`AwardContentSection` は参照表のため非インタラクティブ（意図通り） |
| **V5** Brand | **PASS** | `--award-color-accent` / `--award-color-accent-soft` トークン準拠。絵文字なし |
| **V6** Benchmark | **PASS** | 1px 区切り + 縦余白 = Swiss editorial。料金常時表示は LAAX 型参照ページと整合 |

---

## WARN（非ブロッカー）

1. `notice-banner` ハードコード hex（既存・本差分外）
2. `award-content-section__body` margin-top 20px — 8px グリッド純粋値から 4px ずれ（ cosmetic のみ）

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → /tickets-rental 出荷可
```
