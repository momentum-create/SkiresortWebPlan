# ビジュアル評価レポート — `/today`（七戸本番）

> **Agent**: `resort-visual-evaluator`（スコープ: `resorts/Sichinohe-CyoueiSki/web`）  
> **初回**: 2026-06-11 — **FAIL**  
> **再評価**: 2026-06-12 — **PASS**  
> **Target**: `/ja/today`, `/en/today`  
> **参照**: `agents/AWARD_TYPOGRAPHY_DESIGN_SYSTEM.md`, `/access` カードパターン, `award-design-system.css`

---

## Verdict

**PASS**

2026-06-11 のブロッカー（`award-stat-mono` 誤用・1列レイアウト）は修正済み。スナップショット行は `/access` と同型の `award-eyebrow` + `text-xl font-semibold` + `text-sm` 注釈。`md:grid-cols-3` グリッドで余白も access カードと整合。

---

## ルーブリック（再評価）

| ID | 結果 | 根拠 |
|----|------|------|
| **V1** タイポグラフィ | **PASS** | `today/page.tsx` L47–54: `dt` = `award-eyebrow`、値 `dd` = `text-xl font-semibold`（`award-stat-mono` なし）。注 `dd` = `text-sm leading-relaxed`。比較: `/access` L39–42 と同ジャンプ率 |
| **V2** 余白リズム | **PASS** | L39–45: `md:grid-cols-3` + `py-7 md:px-8 md:py-10` + 罫線グリッド — `/access` L33–37 と同型。`wide` 行は `md:col-span-3` |
| **V3** 写真・アセット | **PASS** | ヒーロー写真なし。`notice-banner` 適切 |
| **V4** マイクロインタラクション | **PASS** | 静的コンテンツページ。必須演出なし |
| **V5** ブランド一貫性 | **PASS** | `award-stat-mono` / `stat-value` をコンテンツ行から排除。ヒーロー専用トークンは `CinematicHero` L59 のみ |
| **V6** ベンチマーク整合 | **PASS** | 同一リゾート内 `/access` エディトリアルカード言語と一致 |

---

## 前回 FAIL → 修正確認

| ブロッカー | 修正 | 確認 |
|-----------|------|------|
| 値に `award-stat-mono` | `text-xl font-semibold` | ✅ L50 |
| 縦1列のみ | `md:grid-cols-3` | ✅ L39 |
| 注に `award-lead` | `text-sm leading-relaxed` | ✅ L53 |
| `wide` リフト行 | `md:col-span-3` | ✅ L44 |

---

## WARN（出荷ブロック外）

| 項目 | 内容 |
|------|------|
| `AwardPageShell` `space-y-10` | notice → グリッド間がやや広い（L29）。全ページ共通のため today 単体ではブロックしない。必要なら Phase 2 で `space-y-8` |

---

## タイポ階層（確定）

```
eyebrow (0.625rem) → 値 (1.25rem) → 注 (0.875rem)
ページ title heading-lg (1.75–3rem) は値より常に大 — 階層 OK
```

---

## 再発防止

> **コンテンツページのデータ行に `award-stat-mono` / `award-stat-mega` / `stat-value` を使わない。** 行リストは `/access` の `award-eyebrow` + `text-xl font-semibold` + `mt-3` に揃える。

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → /today 出荷可
```

**現状: PASS**
