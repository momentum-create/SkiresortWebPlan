# ゲレンデマップ用データソース

## 座標（確定版・MVP）

| 項目 | 値 | 出典 |
|------|-----|------|
| 中心 | 40.69839, 141.099714 | OpenSkiMap `ski_areas.csv` |
| 標高 | 88〜210 m | tenki.jp / 公式概要 |
| ペアリフト（OSM） | way/631879096 | OpenStreetMap（1本のみ） |
| 参考イラストマップ | 2012年版 | [skimap.org/SkiAreas/view/1345](https://www.skimap.org/SkiAreas/view/1345) |

## ヒーロー画像 + SVG オーバーレイ（2026-06 地形照合イラスト）

| ファイル | 内容 |
|----------|------|
| `public/maps/nanako-hero.png` | 1536×1024 GSI+skimap照合イラスト（v2・パンフレット風） |
| `public/maps/nanako-hero-gsi.png` | 国土地理院正射（build-hero-gsi.mjs） |
| `reference/skimap-2012.jpg` | skimap.org 2012 パンフレット参照 |
| `hero-illustrated-trace.json` | イラスト生成の参照・手順メモ |
| `control-points-hero-ai.json` | イラスト座標系のリフト端点 |
| `control-points-gsi.json` | 正射座標系のリフト端点 |
| `lift-markers.json` | イラスト/正射の両方のリフト線 |
| `overlay-paths.json` | 画像座標系でのリフト・コース SVG path |
| `features.manifest.json` | feature-id マスタ + `heroImage` メタ |
| `status.json` | 運行状況（手編集） |
| `HeroMapCanvas.tsx` | 画像 + SVG + パンズーム |

### 推奨パイプライン（手順1〜6）

```bash
node scripts/build-hero-gsi.mjs              # 1 国土地理院正射
node scripts/fetch-skimap-reference.mjs        # 2 skimap 2012
node scripts/build-hero-illustrated.mjs <png>  # 3 イラスト配置（Figma/AI生成物）
# control-points-hero-ai.json を絵上のリフトに合わせて編集
node scripts/fit-overlay-similarity.mjs        # 5 類似変換
node scripts/align-hero-gsi.mjs                # 6 正射/イラスト両方の端点
node scripts/build-map-preview.mjs             # QA HTML
```

リフト構成（公開情報ベース）: **ペアリフト1基 + ポニーリフト1基**、コース計6本（マップ上は主要4コースを表示）。

## 未整備（要公式 or 手トレース）

- 残り2コースの個別ライン（`runs.geojson`）
- ヒュッテ・駐車場の正確なポリゴン
- 公式イラストとの位置合わせ精査

## 更新手順

```bash
node scripts/fetch-lift-way.mjs
```

`web/data/map/lifts.geojson` を再生成します。

## 免責

OSM / OpenSkiMap データは ODbL 等のライセンスに従い、出典表示が必要です。公開前に運営元でレイアウトを確認してください。
