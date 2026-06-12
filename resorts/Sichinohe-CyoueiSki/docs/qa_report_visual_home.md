# ビジュアル評価レポート — ホーム LP（PathMagnet グリッド）

> **Agent**: `resort-visual-evaluator`（スコープ: `resorts/Sichinohe-CyoueiSki/web`）  
> **初回**: 2026-06-11 — **FAIL**（PathMagnet）  
> **再評価**: 2026-06-12 — **PASS**（PathMagnet）  
> **Target**: `/ja`, `/en` — `PathMagnet` + `CinematicHero` 周辺の LP 骨格  
> **参照**: `agents/AWARD_TYPOGRAPHY_DESIGN_SYSTEM.md`, `award-design-system.css` L455–519, `/access` カードパターン

---

## Verdict

**PASS**

PathMagnet は `award-tile-link*` 一式を採用。`tall` タイポ分岐・レガシー `.eyebrow`・`--surface-border` 矢印はすべて解消。セクション見出しは `award-eyebrow` + `heading-lg`。カードタイトルは CSS で `1.25rem` 固定、min-height 全タイル統一。

---

## ルーブリック（再評価 — PathMagnet）

| ID | 結果 | 根拠 |
|----|------|------|
| **V1** タイポグラフィ | **PASS** | `PathMagnet.tsx` L38–49: セクション `award-eyebrow` + `heading-lg`。カードは `award-tile-link__label` / `__title`（`award-design-system.css` L489–496: `font-size: 1.25rem` 固定）。`text-2xl` / `tall` 分岐なし |
| **V2** 余白リズム | **PASS** | L41: `mt-[var(--space-block)]` + `gap-4`。L46: 全タイル `min-h-[10rem] sm:min-h-[12rem]` 統一。`award-tile-link` padding 1.5rem → sm 2rem（CSS L461–469）。label→title `margin-top: 0.75rem`（= `mt-3`） |
| **V3** 写真・アセット | **PASS** | `CinematicHero` `/images/hero-sichinohe.png` + グラデオーバーレイ |
| **V4** マイクロインタラクション | **PASS** | `award-tile-link`: `box-shadow` + `__arrow` `0.28s var(--ease-award)` + hover `translateX(4px)`（CSS L463–518） |
| **V5** ブランド一貫性 | **PASS** | TSX はデザインシステムクラスのみ。矢印静止色 `--award-color-muted`（L505）。アクセントホバー `--award-color-accent` |
| **V6** ベンチマーク整合 | **PASS** | 8+4 ベントはエディトリアル Alpine 型。カード内タイポは `/access` と同系統（eyebrow + xl title） |

---

## 前回 FAIL → 修正確認

| ブロッカー | 修正 | 確認 |
|-----------|------|------|
| `award-tile-link*` 未使用 | Link に `award-tile-link` + 子要素3クラス | ✅ L46–52 |
| `tall` で `text-2xl sm:text-3xl` | フラグ削除、CSS `1.25rem` 固定 | ✅ paths 配列 + CSS L489 |
| min-height 8rem / 14rem 混在 | `min-h-[10rem] sm:min-h-[12rem]` 全タイル | ✅ L46 |
| 矢印 `--surface-border` | `--award-color-muted` | ✅ CSS L505 |
| セクション `.eyebrow` | `award-eyebrow` | ✅ L38 |

---

## LP 骨格チェックリスト（ホーム `page.tsx`）

| 順 | セクション | タイポ系統 | 判定 |
|----|-----------|-----------|------|
| 1 | `CinematicHero` | `award-*` | **PASS** |
| 2 | `AsymmetricTransit` | `eyebrow` + `heading-lg` | **WARN**（Phase 2: `award-eyebrow` 化推奨） |
| 3 | `ImmersiveLiveCam` | `eyebrow` | **WARN** |
| 4 | **`PathMagnet`** | **`award-tile-link*`** | **PASS** |
| 5 | `AudienceDuet` / `NewsTeaser` / `GuidesReveal` | `eyebrow` + `heading-lg` | **WARN** |

PathMagnet はユーザー導線の要 — **出荷ブロッカー解消**。他セクションの eyebrow 統一は Phase 2（`template-diff-inventory.md` P2）。

---

## WARN（出荷ブロック外）

- ホーム後段セクション（`AsymmetricTransit` 等）の `globals.css` `.eyebrow` → `award-eyebrow` 段階移行
- `heading-lg` と `award-*` の二系統はホーム LP で意図的併存（セクション H2 用）

---

## 再発防止

> **PathMagnet / ナビタイルは `award-tile-link*` のみ。カードタイトルに `text-2xl+` や `tall` フラグによるタイポ分岐を禁止。装飾矢印の静止色は `--award-color-muted` 以上のコントラスト。**

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS（PathMagnet）→ ホーム LP 出荷可
```

**現状: PASS**（PathMagnet ブロッカー解消。他セクション WARN は Phase 2）
