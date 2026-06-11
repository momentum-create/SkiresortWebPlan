# ビジュアル評価レポート — ホーム LP（PathMagnet グリッド）

> **Agent**: `resort-visual-evaluator`（スコープ: `resorts/Sichinohe-CyoueiSki/web`）  
> **Date**: 2026-06-11  
> **Target**: `/ja`, `/en` — `PathMagnet` + `CinematicHero` 周辺の LP 骨格  
> **参照**: `agents/AWARD_TYPOGRAPHY_DESIGN_SYSTEM.md`, `award-design-system.css` L455–504, `/access` カードパターン

---

## Verdict

**FAIL**

ユーザー指摘は妥当。**フォント管理が二重系統**（`globals.css` の `.eyebrow` / `.heading-lg` と `award-design-system.css` の `.award-*`）、**PathMagnet が既存 `award-tile-link*` を未使用**、**タイトルが tall カードだけ `text-2xl sm:text-3xl` で過大**、**矢印が `--surface-border`（#e2e8f0）でほぼ不可視**、**行内 min-height 不一致でベントが歪む**。LP 骨格（ヒーロー直下のナビゲーション）として `/access` と同じカード言語に揃える必要がある。

---

## ルーブリック

| ID | 結果 | 根拠 |
|----|------|------|
| **V1** タイポグラフィ | **FAIL** | `PathMagnet.tsx` L54–60: ラベルは `globals.css` `.eyebrow`（Syne なし・weight 600）、タイトルは tall=`text-2xl sm:text-3xl` / short=`text-xl` の二段階。比較: `CinematicHero` L48 は `award-eyebrow`、`/access` L39–42 は `award-eyebrow` + `text-xl font-semibold` 均一。セクション H2 `heading-lg`（clamp 1.75–3rem）がカードタイトル（最大 1.875rem）とジャンプ率が不足し、かつ同一グリッド内でサイズが列幅と連動して「Terrain だけデカい」に見える |
| **V2** 余白リズム | **FAIL** | `PathMagnet.tsx` L45: 見出し→グリッド `mt-14`（3.5rem 固定）。`/access` は `award-section` + カード `py-7 md:py-10 md:px-8`。カード内ラベル→タイトル `mt-4`（PathMagnet）vs `/access` `mt-3`。`tall` フラグで `min-h-[14rem]` vs `min-h-[8rem]`（L51）— 同一行の 8+4 ペアで背が揃わずグリッドが段差になる |
| **V3** 写真・アセット | **PASS** | `CinematicHero` L37: `/images/hero-sichinohe.png` 本番資産。グラデオーバーレイ L44 で文字可読 |
| **V4** マイクロインタラクション | **WARN** | カード `hover:shadow` + 矢印 `group-hover:translate-x-1` はあるが、`award-design-system.css` L455–504 の `award-tile-link` トランジション（`--ease-award` 0.28s）未使用。ホーム他セクション（`award-rise`）と演出粒度が不一致 |
| **V5** ブランド一貫性 | **FAIL** | **デッドコード**: CSS に `award-tile-link*` が PathMagnet 用に定義済みだが TSX が Tailwind 直書き。矢印 L66: `text-[color:var(--surface-border)]` — ボーダー色を前景に流用しコントラスト不足（白上 ≈2.5:1）。アクセント `#0b5f8c` はホバーのみ |
| **V6** ベンチマーク整合 | **WARN** | 8+4 ベントはエディトリアル Alpine（Zermatt / Wallpaper* 型）として方向は正しい。ただし LAAX / 同一サイト `/access` の「均一カード行」言語と衝突し、実装が意図より粗く見える |

---

## 根本原因

| 症状 | 原因ファイル | 詳細 |
|------|-------------|------|
| フォント管理が messy | `PathMagnet.tsx` + `globals.css` L172–200 | ホーム LP がレガシー `.eyebrow` / `.heading-lg`、ヒーロー・内页は `.award-*` |
| カードタイトル過大 | `PathMagnet.tsx` L58–59 | `tall ? text-2xl sm:text-3xl` — 幅 8 列とサイズ 2 段階が重なり Terrain/Today が過強調 |
| グリッドが uneven | `PathMagnet.tsx` L13–35, L51 | `col-span-8` は意図通りだが `tall` + 異なる min-height で行内高さ不一致 |
| 矢印が faint | `PathMagnet.tsx` L66 | `--surface-border` (#e2e8f0) を文字色に使用 |

---

## 具体レイアウト仕様（実装者向け — PathMagnet）

`/access` のカード行（`access/page.tsx` L33–42）を **ベント配置のナビタイル** に拡張した単一仕様。`award-design-system.css` の `award-tile-link*` をそのまま使うこと（再定義しない）。

### 1. セクションシェル

| 要素 | クラス / トークン | 値 |
|------|------------------|-----|
| Section | `home-section` または `award-section` | `padding-block: clamp(5rem, 14vw, 9rem)` |
| Inner | `home-inner` または `award-inner` | `max-width: 80rem`, `padding-inline: clamp(1.25rem, 4vw, 3rem)` |
| Eyebrow | `award-eyebrow` | `0.625rem`, Syne 700, `letter-spacing: 0.2em`, `--award-color-accent` |
| Section H2 | `heading-lg`（現状維持可） | `clamp(1.75rem, 5vw, 3rem)` — カードタイトルより常に大 |
| H2 → Grid | `mt-[var(--space-block)]` または `mt-8 sm:mt-12` | `clamp(2rem, 6vw, 4rem)` — **`mt-14` 禁止** |

### 2. タイプスケール（カード内）

**全カード同一。`tall` によるフォント分岐を廃止。**

| 役割 | クラス | size | weight | tracking | font | 色 |
|------|--------|------|--------|----------|------|-----|
| **Label**（Today / Access / Terrain / Tickets） | `award-tile-link__label` | `0.625rem` (`--text-eyebrow`) | 700 | `0.18em` | Syne | `--award-color-muted` → hover `--award-color-accent` |
| **Title**（今日の運営 / アクセス / ゲレンデマップ / 料金） | `award-tile-link__title` + サイズ固定 | **`1.25rem` (`text-xl`)** 全ブレークポイント | 600 | `-0.03em` | Noto Sans JP | `--award-color-fg` |
| Title 長文保険 | 任意 `line-clamp-2` | — | — | — | — | 2 行超は省略（JP 6 文字程度は 1 行） |

**ジャンプ率（カード内）**

```
label 0.625rem  →  title 1.25rem   ≈ 2.0×
section H2 1.75–3rem  →  card title 1.25rem   ≈ 1.4–2.4×  ✓
```

**禁止**

- `text-2xl` / `text-3xl` on card titles（ヒーロー・セクション H2 専用）
- `globals.css` `.eyebrow` on card labels（`award-tile-link__label` に統一）

### 3. グリッド比率

12 列ベント（現行構成維持）。**列幅の非対称は意図的** — 不均に見える主因は列幅ではなく **タイポ二段階 + min-height 差**。

| カード | href | span (sm+) | 行 |
|--------|------|------------|-----|
| Today | `/today` | `col-span-8` (66.7%) | 1 |
| Access | `/access` | `col-span-4` (33.3%) | 1 |
| Terrain (Map) | `/map` | `col-span-8` | 2 |
| Tickets | `/tickets-rental` | `col-span-4` | 2 |
| Mobile | 全カード | `col-span-12` | 縦積み |

| トークン | 値 |
|----------|-----|
| `grid-cols` | `12` |
| `gap` | **`gap-4`（16px）全幅** — `gap-3` 廃止 |
| `grid` 上マージン | `mt-[var(--space-block)]` |

**代替案（ユーザーが「幅不均」を解消したい場合のみ）**

- `sm:grid-cols-2` 均一 2×2、`col-span-1` 全カード — エディトリアル性は下がるが視覚的均一

### 4. Min-height（行内揃え）

**`tall` フラグ廃止。行ペアで同一高さ。**

| ブレークポイント | 全タイル共通 `min-height` |
|-----------------|---------------------------|
| default | `10rem` (160px) |
| `sm:` | `12rem` (192px) |

実装: CSS Grid `auto-rows: 1fr` または同一 `min-h-*` を 4 カードすべてに適用。  
**禁止**: `min-h-[8rem]` と `min-h-[14rem]` の混在。

### 5. カードパディング・内部余白（/access 準拠）

| 要素 | クラス | 値 |
|------|--------|-----|
| Tile root | `award-tile-link` + span クラス | `padding: 1.5rem` → `sm: 2rem`（= `/access` `py-7 px-6` → `md:py-10 md:px-8` と同等） |
| Label → Title | — | **`mt-3`（12px）** — `mt-4` 廃止 |
| Arrow inset | `award-tile-link__arrow` | `right: 1.5rem; bottom: 1.5rem`（padding と同値） |

### 6. 矢印コントラスト

| 状態 | プロパティ | 値 |
|------|-----------|-----|
| Default | `color` | **`var(--award-color-muted)`** `#64748b`（白上 ≈4.6:1） |
| Default | `font-size` | `1.25rem`（20px）— `text-2xl` 過大 |
| Default | `font-weight` | `300` |
| Hover / focus-within | `color` | `var(--award-color-accent)` `#0b5f8c` |
| Hover | `transform` | `translateX(4px)` |
| Transition | — | `0.28s var(--ease-award)` |

**禁止**: `var(--surface-border)` / `var(--award-color-border)` を矢印前景色に使うこと。

### 7. コンポーネント置換マップ（PathMagnet.tsx）

```tsx
// Before (抜粋 — 削除対象)
className={`... p-6 ... sm:p-8 ${path.span} ${path.tall ? "min-h-[11rem] sm:min-h-[14rem]" : "min-h-[8rem]"}`}
<span className="eyebrow text-[color:var(--muted)] ...">
<span className={`mt-4 block font-semibold ... ${path.tall ? "text-2xl sm:text-3xl" : "text-xl"}`}>
<span className="... text-2xl font-light text-[color:var(--surface-border)] ...">→</span>

// After（構造）
<Link className={`award-tile-link ${path.span} min-h-[10rem] sm:min-h-[12rem]`}>
  <span className="award-tile-link__label">{path.label}</span>
  <span className="award-tile-link__title">{path.title}</span>
  <span className="award-tile-link__arrow" aria-hidden="true">→</span>
</Link>
```

セクション見出し:

```tsx
<p className="award-eyebrow">{t("eyebrow")}</p>
<h2 className="heading-lg mt-4">{t("title")}</h2>
```

`award-tile-link__title` に `text-xl` 相当を CSS 側で固定するなら `award-design-system.css` L483–489 に `font-size: 1.25rem` を追記（現状サイズ未指定で継承）。

---

## LP 骨格チェックリスト（ホーム `page.tsx`）

| 順 | セクション | タイポ系統 | 判定 |
|----|-----------|-----------|------|
| 1 | `CinematicHero` | `award-*` ✓ | PASS |
| 2 | `AsymmetricTransit` | `eyebrow` + `heading-lg` | WARN（次イテレで `award-eyebrow` 化推奨） |
| 3 | `ImmersiveLiveCam` | `eyebrow` | WARN |
| 4 | **`PathMagnet`** | **レガシー + Tailwind 直書き** | **FAIL（本レポート）** |
| 5 | `AudienceDuet` / `NewsTeaser` / `GuidesReveal` | `eyebrow` + `heading-lg` | WARN |

**LP 全体の再発防止**: ホーム `sections/*` の eyebrow は段階的に `award-eyebrow` へ。PathMagnet を先に直す（ユーザー導線の要）。

---

## ブロッカー（優先順）

1. **`PathMagnet.tsx`** — `award-tile-link*` 採用、`tall` タイポ分岐削除、min-height 統一、矢印色修正  
2. **`award-design-system.css` L483–489** — `.award-tile-link__title { font-size: 1.25rem; line-height: 1.25; }` 明示（任意だが推奨）  
3. **ホーム eyebrow 統一** — PathMagnet セクション header を `award-eyebrow` に（`CinematicHero` と同系統）

---

## 再発防止

> **PathMagnet / ナビタイルは `award-tile-link*` のみ。カードタイトルに `text-2xl+` や `tall` フラグによるタイポ分岐を禁止。装飾矢印の静止色は `--award-color-muted` 以上のコントラスト。コンテンツカードの基準は常に `/access` の `award-eyebrow` + `text-xl font-semibold` + `mt-3`。**

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS（ホーム PathMagnet 再評価後）→ ホーム LP 出荷可
```

現状: **PathMagnet 単体で V1・V2・V5 FAIL → ホーム LP ビジュアル出荷不可。**
