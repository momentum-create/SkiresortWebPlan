# QA / A11y 評価レポート — 七戸サイト全站

> **Agent**: `resort-qa-a11y`（L3）  
> **Date**: 2026-06-10（全站再評価）  
> **Target**: `resorts/Sichinohe-CyoueiSki/web/src/app/[locale]/**` + 共有コンポーネント  
> **前回**: 2026-06-08 トップ `/` のみ PASS  
> **L2 前提**: 全コンテンツページ i18n + G4 マップ UI 再マウント + `resort-data.en.json`

---

## 総合判定: **PASS**

全 `[locale]` ルート（16 ページ + `/courses` リダイレクト）を Q1–Q6 で再評価。ブロッカーなし。

**ビジュアル**: `resort-visual-evaluator` ヒーロー **PASS**（解像度 WARN 解消済 2026-06-08）

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → サイト UI 出荷可
```

---

## 評価範囲

| ルート | metadata i18n | 本文 i18n | 備考 |
|--------|---------------|-----------|------|
| `/` | `meta` template | `home.*` | CinematicHero 版 |
| `/today` | ✅ | `today.*` | `AwardPageShell` |
| `/access` | ✅ | `access.*` | 地図ヒーロー再評価 2026-06-11 PASS |
| `/contact` | ✅ | `contact.*` | |
| `/news` | ✅ | `news.*` | |
| `/tickets-rental` | ✅ | `ticketsRental.*` | 表 `aria-label` + `scope` |
| `/lessons-events` | ✅ | `lessonsEvents.*` | |
| `/stay-local` | ✅ | `stayLocal.*` | |
| `/lift-deals` | ✅ | `liftDeals.*` | |
| `/faq` | ✅ | `faq.*` | |
| `/live-cams` | ✅ | `liveCams.*` | `LiveCamFrame` status i18n |
| `/map` | ✅ `map.page` | `map.*` | 右レール・コース/リフトタブ（検索・難易度・GPS は削除済） |
| `/plan/*`（3） | ✅ | `plan.*` | |
| `/courses` | — | — | `/map` 恒久リダイレクト |
| `loading.tsx` | — | `common.loading*` | |
| `/admin` | — | JA 固定 | スタッフ用（locale 外）— 評価対象外 |

---

## ルーブリック（全站）

### Q1 Mobile-first — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| タッチターゲット ≥ 44px | PASS | `LangSwitcher` `min-h-11 min-w-11`。`AwardButton` 52px。`MapQuickNav` `min-h-11` |
| 375px 横スクロールなし | PASS | `.home-canvas { overflow-x: clip }`。`AwardPageShell` / 表は横スクロール containment |
| マップレール行 | WARN（非ブロック） | リスト行 `py-2.5` は密 UI（≈40px）。FAB・QuickNav・言語切替は 44px 以上 |

### Q2 Accessibility — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| フォーカスリング | PASS | `globals.css` `.reveal-trigger:focus-visible`。マップ `mapFocusRing` 全インタラクティブ |
| 画像 `alt` | PASS | 装飾 `alt=""`。意味ある画像は `messages` キー |
| `prefers-reduced-motion` | PASS | rise / reveal 無効化 |
| 言語切替 a11y | PASS | `lang.switch` + `aria-current` + `role` group |
| スキップリンク | PASS | `a11y.skipToContent`（`layout.tsx`） |
| `/map` レール | PASS | タブ `role="tablist"` / `aria-selected`、リスト `aria-pressed`（検索・難易度・GPS UI は削除済 2026-06） |
| 表 | PASS | `tickets-rental` `aria-label` + `th scope="col"` |

### Q3 Conversion path — **PASS**

| ページ | 導線 |
|--------|------|
| `/` | ヒーロー Primary → `/today` 1タップ。PathMagnet → 料金・マップ |
| コンテンツ | `SiteHeader` + `MapQuickNav`（/map）で主要導線 ≤3 タップ |
| `/map` | QuickNav A–F + レール選択 → 詳細（stage 内、sheet なし） |

### Q4 i18n — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| ルーティング | PASS | `next-intl` ja / en、`generateStaticParams` |
| ページシェル | PASS | 全コンテンツ `getTranslations` + `AwardPageShell` |
| 動的データ | PASS | `getResortData()` → `resolveDataLocale` + `resort-data.en.json` |
| マップ UI | PASS | `map.*` namespace（レール・ライブバッジ等。検索・難易度・GPS は削除済） |
| 残存固定 JA（非ブロック） | 許容 | `SkiResortJsonLd` description、`feature.label`（manifest）、admin UI、`CinematicHero` 空 snapshot フォールバック |

### Q5 Performance — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| ヒーロー | PASS | `next/image` + `priority` 1920×1080 |
| アニメーション | PASS | `prefers-reduced-motion` ガード |
| ビルド | PASS | `npm run build` 2026-06-10 green（44 static routes） |

### Q6 Data separation — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| 価格・本文 | PASS | `resort-data.json` / `resort-data.en.json` |
| UI 文言 | PASS | `messages/ja.json` / `en.json` |
| マップ status | PASS | `data/map/status.json`（locale 非依存の運行データ） |

---

## マップ（`/map`）— a11y 拡張（resort-qa-a11y 管轄分）

| 項目 | 判定 |
|------|------|
| G4 ライブバッジ（SSE） | PASS — `MapTopBar` transport=sse 時表示 |
| レールタブ・リスト | PASS — コース/リフト切替、stage 内詳細（sheet なし） |

> **2026-06 以降**: レールから検索・難易度フィルタ・GPS パネルを削除（`.cursor/rules/map-rail-no-clutter.mdc`）。旧 PASS 記述は [`qa_report_map.md`](./qa_report_map.md) の履歴を参照。

レイアウト・インタラクション詳細は [`qa_report_map.md`](./qa_report_map.md)（map-ux / map-interaction evaluator）。

---

## G4-1 実機（関連）

| 項目 | 結果 |
|------|------|
| admin POST → SSE | **PASS** 2279ms（2026-06-10） |
| スクリプト | `resorts/Sichinohe-CyoueiSki/scripts/verify-g4-1-sse.mjs` |

---

## 残タスク（出荷ブロック外）

- `SkiResortJsonLd` / `feature.label` の locale 別文案（SEO・任意）
- admin 更新時の en JSON 自動同期
- 未使用レガシーコンポーネント（`AudienceSplitCards` 等）の削除整理

---

## 再発防止

1. **新規 `[locale]` ページ** — `messages` キー → `generateMetadata` → `AwardPageShell` の順で追加  
2. **マップ UI** — レールはコース/リフト選択のみ（検索・GPS・難易度は本番レールに載せない）  
3. **出荷前** — 本レポート（全站）+ `qa_report_visual.md` + `qa_report_map.md` の3点セット

---

## `/access` 再評価 — 2026-06-11

> **Agent**: `resort-qa-a11y`（L3）  
> **Target**: `AccessMapHeroShell` / `AccessMapBackground` / `AccessMapSigns` / `AccessMapActions`  
> **Trigger**: 全幅地図ヒーロー・OSM フォールバック・装飾サイン・駅ルートリンク削除・CSP `frame-src`

### 総合判定: **PASS**

| Rubric | 結果 | 根拠 |
|--------|------|------|
| **Q1** Mobile-first | PASS | CTA `min-h-[3.25rem]`。ヒーロー `overflow-hidden`。サイン/iframe は `pointer-events-none` |
| **Q2** Accessibility | PASS | `AwardButton` フォーカス。装飾地図・サイン `aria-hidden`。見出し `h2` + `aria-labelledby`。OSM iframe `tabIndex={-1}` |
| **Q3** Conversion | PASS | Primary「ルート案内を開始」→ 目的地のみ Google Maps navigate、1タップ。駅起点ルートリンク削除済 |
| **Q4** i18n | PASS | `access.map.*`。ランドマーク `shortLabel` / `shortLabelEn`。`resort-data.en.json` |
| **Q5** Performance | PASS | OSM `loading="lazy"`。地図 JS は env 未設定時ロードしない |
| **Q6** Data separation | PASS | 座標・ランドマークは JSON。URL は `access-deep-links.ts` で生成 |

### ブロッカー

なし

### 非ブロッカー（P2 整理候補）

- 未使用 i18n `access.map.stationRoute`
- 未使用 `googleMapsRouteUrl` / `mapUrl` データフィールド

### Ship gate（/access ヒーロー）

```
resort-qa-a11y PASS (/access 2026-06-11) + resort-visual-evaluator PASS (AccessMapSigns) → /access 出荷可
```

---

## `/access` 再評価 — 2026-06-11

> **Agent**: `resort-qa-a11y`（L3）  
> **Scope**: `resorts/Sichinohe-CyoueiSki/web/src/app/[locale]/access` + `src/components/access/*`  
> **L2 変更**: `AccessMapHeroShell`（full-bleed）、`AccessMapBackground`（Google → Mapbox → OSM iframe）、`AccessMapSigns`（装飾・`aria-hidden`）、`AccessMapActions`（目的地ナビのみ）、駅ルートリンク削除、`vercel.json` CSP `frame-src`

### 総合判定: **PASS**

`/access` ヒーロー再設計後、Q1–Q6 ブロッカーなし。

```
resort-qa-a11y PASS（/access）+ resort-visual-evaluator PASS → サイト UI 出荷可
```

（a11y PASS のみでは出荷不可 — ビジュアル評価は別途必須）

---

### Q1 Mobile-first — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| タッチターゲット ≥ 44px | PASS | Primary `!min-h-[3.25rem]`（52px）。Secondary / GO `!min-h-[2.75rem]`（44px） |
| 375px 横スクロールなし | PASS | `.access-map-hero` `overflow-hidden` + `.award-canvas` / `body` `overflow-x: clip`。`w-screen` full-bleed は親 clip で containment |
| サイン・背景の誤タップ | PASS | `AccessMapSigns` / OSM iframe `pointer-events-none`。地図 JS `gestureHandling: "none"` / `interactive: false` |

---

### Q2 Accessibility — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| フォーカスリング | PASS | `AwardButton` → `.award-btn:focus-visible`（accent outline） |
| 装飾地図・サイン | PASS | `AccessMapBackground` / OSM iframe 親 `aria-hidden`。`AccessMapSigns` 全体 `aria-hidden` + `pointer-events-none` |
| セマンティクス | PASS | `<section aria-labelledby="access-map-heading">` + `<h2 id="access-map-heading">` |
| OSM iframe | PASS | 装飾のみ：`tabIndex={-1}`、`loading="lazy"`、CSP `frame-src` に `openstreetmap.org` |
| `prefers-reduced-motion` | PASS | `.award-btn-*:hover` transform 無効化（`award-design-system.css`） |
| 言語切替（ページ共通） | PASS | 変更なし — `LangSwitcher` `aria-current` + group label |

---

### Q3 Conversion path — **PASS**

| 導線 | タップ数 |
|------|----------|
| ヒーロー Primary「ルート案内を開始」→ Google Maps ナビ（目的地のみ） | **1** |
| Apple Maps / GO タクシー | 1（secondary） |
| 駅起点ルートリンク | **削除済** — 意図どおり簡素化 |

アクセス目的（現在地→ゲレンデ）に直結。ブロッカーなし。

---

### Q4 i18n — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| シェル・metadata | PASS | `generateMetadata` + `AwardPageShell` は `access.*` |
| ヒーロー文言 | PASS | `AccessTransitMap` → `getTranslations("access.map")` |
| サインラベル | PASS | `landmarkShortLabel(landmark, en)` — `shortLabel` / `shortLabelEn` |
| 駐車場 | PASS | `en ? map.parkingEn : map.parking` |
| カード・折りたたみ | PASS | `getResortData()` → locale 別 `resort-data.json` / `resort-data.en.json` |

**非ブロック（整理推奨）**: `messages` の `access.map.stationRoute` は UI 未使用の dead key。

---

### Q5 Performance — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| ヒーロー画像 | N/A | 静的 `next/image` ではなく JS 地図 / OSM iframe フォールバック（意図的） |
| 地図初期化 | PASS | Mapbox `fadeDuration: 0`。OSM `loading="lazy"` |
| アニメーション | PASS | ヒーローにループアニメなし。ボタン hover は reduced-motion ガード |
| ビルド | PASS | `npm run build` 2026-06-11 green |

---

### Q6 Data separation — **PASS**

| 項目 | 判定 | 根拠 |
|------|------|------|
| 座標・ランドマーク | PASS | `data/resort-data*.json` `access.map.landmarks`（locale 非依存の地理データ） |
| 駐車場文案 | PASS | `parking` / `parkingEn` 分離 |
| ナビ URL | PASS | `googleMapsNavigateUrl` / `appleMapsNavigateUrl` はコンポーネント内で座標から生成（`mapUrl` フィールドは未参照） |

---

### 本レポート内の **stale 記述**（`/map` — 要修正）

以下は **2026-06-10 全站 PASS 時点の記述** で、現行 `/map` から検索・難易度・GPS レール UI は **削除済み**。ドキュメント整合のため更新が必要（出荷ブロッカーではない）:

| 行付近 | 記述 | 現状 |
|--------|------|------|
| L38 評価範囲表 | `G4 レール・検索・難易度・GPS` | 検索・難易度・GPS UI なし |
| L65 Q2 表 | `/map` レール — 検索 `aria-label`、難易度 `aria-pressed` | 該当 UI なし |
| L83 Q4 表 | `map.*`（検索・難易度・ライブ・GPS） | 検索・難易度・GPS キー未使用の可能性 |
| L104–111 | 「マップ（`/map`）— a11y 拡張」検索・難易度・GPS PASS | 機能削除に追随せず |
| L136 再発防止 | 「検索・フィルタはレール state のみ」 | 検索・フィルタ自体が存在しない |

→ `map-ux-evaluator` / `map-interaction-evaluator` の `qa_report_map.md` と合わせて本ファイルを改訂すること。

---

## `/access` 差分再評価 — 2026-06-11（L2 直後クイック）

> **Agent**: `resort-qa-a11y`（L3）  
> **Trigger**: `AwardPageShell` 撤去・ヒーロー header 直下・サイン `googleMapsPlaceUrl`・`AccessTaxiBlock`（駅から）・`h1` 化

### 変更確認

| 要件 | 判定 | 根拠 |
|------|------|------|
| `AwardPageShell` トップ帯撤去、ヒーロー header 直下 | PASS | `access/page.tsx` は `AccessTransitMap` を先頭に直置き。`main` の `pt-16` のみ |
| サインリンク → `googleMapsPlaceUrl`（地点ピン） | PASS | `AccessTransitMap` が `googleMapsPlaceUrl` を生成。CTA は引き続き `googleMapsNavigateUrl` |
| 駅からカード下に `縦貫タクシー` | PASS | `fromStationIndex` + `AccessTaxiBlock`。`resort-data*.json` `access.taxi` |
| ヒーローカード内 `h1` | PASS | `AccessMapHeroShell` `<h1 id="access-map-heading">`。ページ内 h1 は 1 つ |

### ルーブリック（差分）

| Rubric | 結果 | 備考 |
|--------|------|------|
| **Q1** | PASS | サイン `min-h-11 min-w-11`。CTA 52px / 44px。`overflow-x: clip` |
| **Q2** | PASS | サイン `map-focus-ring` + `aria-label` + `role="group"`。`h1` + `aria-labelledby`。`motion-safe:` on hover |
| **Q3** | PASS | Primary ナビ 1 タップ。サインは地点表示（ルート誤誘導なし） |
| **Q4** | PASS | `access.map.*` + locale 別 `resort-data`。タクシー `companyEn` / `addressEn` |
| **Q5** | PASS | 地図背景 lazy / 非インタラクティブ。ループアニメなし |
| **Q6** | PASS | タクシー・座標は JSON。URL は `access-deep-links.ts` |

### ブロッカー

**なし**

### 非ブロッカー（P2）

- タクシー TEL インラインリンクは 44px 未満の可能性（電話番号テキストのみ）
- `access.map.stationRoute` dead key（継続）
- `fromStationIndex` がカード `k` 文字列依存（`id` 化は将来整理）

### 総合判定: **PASS**

```
resort-qa-a11y PASS（/access 差分 2026-06-11）+ resort-visual-evaluator PASS → /access 出荷可
```

**注**: 上記「`/access` 再評価 — 2026-06-11」セクションのサイン `pointer-events-none` / `h2` / `AwardPageShell` 記述は本差分で **obsolete**。

---

## `/today` 差分再評価 — 2026-06-11（L2 直後クイック）

> **Agent**: `resort-qa-a11y`（L3）  
> **Target**: `resorts/Sichinohe-CyoueiSki/web/src/app/[locale]/today/page.tsx`  
> **L2 変更**: スナップショット値 `text-xl font-semibold`、注 `text-sm`、`/access` 同型 `md:grid-cols-3` グリッド、`award-stat-mono` 削除

### 変更確認

| 要件 | 判定 | 根拠 |
|------|------|------|
| 値 `text-xl font-semibold` | PASS | L50 — `/access` L42 と同型 |
| 注 `text-sm leading-relaxed` | PASS | L53 |
| 3 列グリッド（access パターン） | PASS | L39–45 — `md:grid-cols-3` + `md:px-8 md:py-10` + 罫線 |
| `award-stat-mono` 削除 | PASS | 当該ページに未使用（ヒーロー `CinematicHero` のみ残存） |
| `wide` 行フル幅 | PASS | `md:col-span-3`（リフト運行等） |

### ルーブリック（差分）

| Rubric | 結果 | 備考 |
|--------|------|------|
| **Q1** Mobile-first | PASS | 静的リスト。375px で縦スタック → md 3 列。横スクロールなし |
| **Q2** Accessibility | PASS | `<dl>` / `<dt>` / `<dd>`。notice `role="note"`。`FreshnessBadge` `<time>` |
| **Q3** Conversion | PASS | トップヒーロー CTA → `/today` 1 タップ（ページ共通導線） |
| **Q4** i18n | PASS | `today.*` + `getResortData()` locale 別 snapshot |
| **Q5** Performance | PASS | ヒーロー画像なし。ループアニメなし |
| **Q6** Data separation | PASS | `resort-data.json` / `resort-data.en.json` `today.snapshot` |

### ブロッカー

**なし**

### 非ブロッカー（P2）

- `FreshnessBadge` の `dateTime` が人間可読文字列の場合 ISO 厳密性は弱い（全站共通・継続）
- `AwardPageShell` 子 `space-y-10` は notice→グリッド間がやや広い（ビジュアル側の任意調整）

### 総合判定: **PASS**

```
resort-qa-a11y PASS（/today 差分 2026-06-11）+ resort-visual-evaluator PASS（/today 再評価後）→ /today 出荷可
```

**注**: a11y PASS のみでは出荷不可。タイポ修正は `qa_report_visual_today.md` の V1/V2/V5 ブロッカー解消を意図 — **ビジュアル再評価は別途必須**。
