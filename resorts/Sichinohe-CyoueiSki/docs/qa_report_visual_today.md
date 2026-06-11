# ビジュアル評価レポート — `/today`（七戸本番）

> **Agent**: `resort-visual-evaluator`（スコープ: `resorts/Sichinohe-CyoueiSki/web`）  
> **Date**: 2026-06-11  
> **Target**: `/ja/today`, `/en/today`  
> **参照**: `agents/AWARD_TYPOGRAPHY_DESIGN_SYSTEM.md`, `/access` カードパターン, `award-design-system.css`

---

## Verdict

**FAIL**

ユーザー指摘「文字サイズが馬鹿げてる」は妥当。スナップショット行に **ヒーロー専用トークン**（`award-stat-mono` → `--text-stat-mega` = `clamp(3.25rem, 16vw, 7.5rem)`）を流用しており、和文の状態文（「シーズン終了（2026/3/1）」等）がモノスペース巨大表示になる。`/access`・`contact`・`stay-local` と同一画面内でタイポ階層が乖離している。

---

## ルーブリック

| ID | 結果 | 根拠 |
|----|------|------|
| **V1** タイポグラフィ | **FAIL** | `today/page.tsx` L50: `award-stat-mono` + `text-[clamp(1.75rem,6vw,2.75rem)]`。`award-stat-mono` は `award-design-system.css` L177–184 で `--text-stat-mega`（最大 7.5rem）固定。上書きが効いても 28–44px の Plex Mono が和文長文に適用。比較: `/access` L42 は `text-xl font-semibold`（≈1.25rem）、`RevealPanel` L50 は折りたたみ内のみ `stat-value` |
| **V2** 余白リズム | **FAIL** | スナップショットが縦1列 `py-7` のみ。`/access` L33–37 は `md:grid-cols-3` + `md:px-8 md:py-10`。`AwardPageShell` L29 の `mt-12 space-y-10` で notice とリスト間が過剰。カード階層（ラベル→値→注）の行間は `mt-3` 均一で値が lead と同重量 |
| **V3** 写真・アセット | **PASS** | 本ページにヒーロー写真なし。`notice-banner` の警告帯は適切 |
| **V4** マイクロインタラクション | **PASS** | 静的コンテンツページ。必須演出なし |
| **V5** ブランド一貫性 | **FAIL** | デザインシステム上 `award-stat-mono` / `award-stat-mega` は `CinematicHero` L59 の **1 指標ヒーロー** 用（`AWARD_TYPOGRAPHY_DESIGN_SYSTEM.md` L69–69）。コンテンツ行への誤用。`award-lead` を note に重ねると shell の `lead`（`SectionHeader` L27）と同サイズで階層が潰れる |
| **V6** ベンチマーク整合 | **WARN** | 同一リゾート内 `/access` のエディトリアルカードとパターン不一致。LAAX 型「データは大きく」は **トップヒーロー 1 点** に閉じる設計（`home-hero-spec` 準拠） |

---

## 根本原因（タイポマップ）

| レイヤ | クラス | 実効サイズ | 正しい用途 |
|--------|--------|------------|------------|
| ページ H2 | `heading-lg`（SectionHeader） | clamp(1.75–3rem) | ページタイトル ✓ |
| シェル説明 | `lead` | clamp(0.94–1.125rem) | リード ✓ |
| **スナップショット値（現状）** | `award-stat-mono` | **clamp(3.25–7.5rem)** または上書き 1.75–2.75rem | **誤り** |
| **スナップショット値（目標）** | `text-xl font-semibold` 相当 | clamp(1.125–1.25rem) | `/access` カード値と同型 |
| スナップショット注 | `award-lead`（現状） | lead と同サイズ | `text-sm` / `award-whisper` に格下げ |
| ホーム折りたたみ内 | `stat-value` | 1.75–2.75rem | ヒーロー配下の二次情報 ✓ |

---

## ブロッカー — 具体修正（実装者向け）

### 1. `src/app/[locale]/today/page.tsx` — スナップショット行

**削除するクラス（値 `<dd>`）:**
- `award-stat-mono`
- `text-[clamp(1.75rem,6vw,2.75rem)]`

**値 `<dd>` に置換:**
```tsx
className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--award-color-fg)]"
```

数値のみの行（将来 `reported_depth_cm` が `"45cm"` 等）にはオプションで:
```tsx
className="award-stat-inline mt-3 text-xl font-semibold tracking-tight"
```

**注 `<p>` を置換:**
```tsx
// 変更前
className="award-lead mt-3 text-[color:var(--award-color-muted)]"
// 変更後
className="mt-3 text-sm leading-relaxed text-[color:var(--award-color-muted)]"
```

### 2. レイアウト — `/access` と同型グリッド

**`<dl>` ラッパーを置換:**
```tsx
<div className="grid gap-0 border-t border-[color:var(--award-color-border)] md:grid-cols-3">
```

**各行 `<div>` を置換:**
```tsx
className={`border-b border-[color:var(--award-color-border)] py-7 md:border-b-0 md:border-r md:px-8 md:py-10 md:last:border-r-0${
  item.wide ? " md:col-span-3 md:border-r-0" : ""
}`}
```

`wide: true` のリフト行（`resort-data.json` L37）は3列スパンで全幅注釈に。

### 3. `src/styles/award-design-system.css` — トークン追加（推奨）

ヒーロー用 `award-stat-mono` と混同しない **コンテンツ行用** クラスを1つ追加:

```css
:root {
  --text-stat-row: clamp(1.125rem, 2.5vw, 1.25rem);
}

.award-stat-row {
  font-size: var(--text-stat-row);
  font-weight: 600;
  letter-spacing: -0.025em;
  line-height: 1.25;
  color: var(--award-color-fg);
}

.award-stat-row--mono {
  font-family: var(--award-font-mono);
  font-variant-numeric: tabular-nums;
  font-weight: 500;
}
```

`/today` の値は和文が多いため **デフォルトは `award-stat-row`（Noto Sans）**。cm・時刻のみ `--mono` 修飾子。

### 4. `AwardPageShell.tsx` — 任意（軽微）

子ブロック間 `space-y-10` → `space-y-8` にすると notice→グリッドの跳躍が緩和。全ページ影響のため **today ページ側で `<div className="space-y-8">` ラップ** が安全。

---

## 修正後の期待ジャンプ率

```
eyebrow (0.625rem)
  → 値 (1.125–1.25rem)     ≈ 1.8–2.0×
  → 注 (0.875rem)          ≈ 0.78×（値より小）
ページ title heading-lg (1.75–3rem) は値より常に大 — 階層 OK
```

---

## 再発防止

> **コンテンツページのデータ行に `award-stat-mono` / `award-stat-mega` / `stat-value` を使わない。** ヒーロー（`CinematicHero`）と `RevealPanel` 内のみ。行リストは `/access` の `text-xl font-semibold` または `award-stat-row` に揃える。

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS（/today 再評価後）→ /today 出荷可
```

現状: **/today は単体でもビジュアル FAIL のため出荷不可。** 修正後に本レポートを再実行すること。
