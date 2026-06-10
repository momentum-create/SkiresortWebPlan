# 標高忠実イラスト生成モデル（Elevation → Illustration Pipeline）

**目的**: Mapbox 衛星タイルでも手描き SVG でもない、**現実の標高・起伏に根ざした高品質ゲレンデイラスト**を、全国スキー場テンプレとして再現可能に生成する。

**品質の定義**:
- 低品質（禁止）: 座標と無関係な図形、平坦なベタ塗り、ざっくりトレース
- Mapbox 衛星（不採用）: 写真は鮮明でも「スキー場マップ」としての読みやすさ・うねり表現に不向き
- **目標**: skimap / 公式パンフレット級の**イラスト読みやすさ** + DEM 由来の**山形・斜面の正しさ**

---

## 1. 「モデル」の意味（2層構造）

ここでのモデルは **ML 単体**ではなく、次の2段を組み合わせた **パイプライン全体** を指す。

| 層 | 名称 | 役割 | 出力の信頼性 |
|----|------|------|--------------|
| **L1 地形真理層** | `TerrainTruthEngine` | DEM から形状・斜度・曲率・等高線を**数値的に確定** | 高（測量・国土地理院ベース） |
| **L2 イラスト化層** | `IllustrationStylizer` | L1 を入力に、統一デザイン言語で**見た目を生成** | スタイル学習で向上、形状は L1 に拘束 |

```
[DEM + OSM + ゲレンデ境界]
        │
        ▼
┌───────────────────────┐
│ L1 TerrainTruthEngine │  ← ここが「現実の標高を元にした」核心
│  hillshade / slope    │
│  curvature (うねり)   │
│  contours / mesh      │
└───────────┬───────────┘
            │ 拘束付き中間表現 (TerrainTensor)
            ▼
┌───────────────────────┐
│ L2 IllustrationStylizer│ ← 高品質の「絵」はここ
│  ルールベース v1       │
│  → 学習モデル v2      │
└───────────┬───────────┘
            ▼
[ レイヤーSVG / 高解像度タイル / WebGL ]
            │
            ▼
[ feature-id + map-status API（既存）]
```

**原則**: イラストの「形」は L1 が決める。L2 は色・線質・木・建物などの**スタイル**を決める。デザイナーが自由に山を描き換えない。

---

## 2. 入力データ（日本・スキー場テンプレ）

| 入力 | ソース | 用途 |
|------|--------|------|
| **DEM** | 国土地理院 数値標高モデル（DEM5A/5B、なければ DEM10B） | 標高グリッド・hillshade |
| **DSM**（任意） | 航空レーザー DSM | 樹頂・建物（後期） |
| **境界** | OpenSkiMap / 手動ポリゴン | ゲレンデクリップ |
| **リフト・コース** | OSM `aerialway` / `piste` | 線の拘束・検証 |
| **参照イラスト** | skimap.org、公式 PDF | L2 学習・QA 比較 |
| **メタ** | 基準標高・リフト上端/下端 | 誤差チェック |

### 国土地理院 DEM の位置づけ

- タイル: `https://tiles.gsj.jp/tiles/elev/{z}/{x}/{y}.png` は**そのまま terrain メッシュには使えない**（グレースケール PNG）
- パイプラインでは **GeoTIFF または基盤地図ダウンロードの DEM ラスタ** を取得し、内部で hillshade / slope / curvature を計算する
- Mapbox Terrain-DEM は **L1 の代替ソース**（海外・検証用）として併記可。本番日本施設は GSI 優先

---

## 3. L1: TerrainTruthEngine（地形真理層）

### 3.1 生成する中間表現 `TerrainTensor`

ゲレンデ bbox 内の同一グリッド上に、次をスタックする。

| チャネル | 計算 | マップ表現への効き |
|----------|------|-------------------|
| `Z` | DEM 標高（m） | 山の骨格 |
| `hillshade` | 太陽方位 315° / 45° 等 | 立体感・陰影 |
| `slope` | 傾斜角（°） | 急斜面（チャンピオン）の根拠 |
| `aspect` | 向き | 雪溜まり・日照（任意） |
| `plan_curvature` | 平面曲率 | **うねり・凹凸**の検出 |
| `profile_curvature` | 断面曲率 | 急峻な切れ目 |

**うねり表現**: 小規模ゲレンデでは `Z` の差分だけでは見えない。**curvature + 局所 slope 変化** をイラストの線の密度・コントラストにマッピングする。

### 3.2 ベクター抽出（L2 への入力）

| 出力 | 手法 |
|------|------|
| 等高線 `contours.geojson` | GDAL `gdal_contour` または richdem |
| 急斜面マスク `steep_mask` | slope > 25° 等 |
| リッジ・谷線（任意） | 曲率極値トレース |
| 地形メッシュ `terrain.mesh` | DEM →三角分割（表示・エクスポート用） |

### 3.3 品質ゲート（L1 完了条件）

- [ ] 既知標高（山頂 210m / ベース 88m）と DEM サンプルの誤差 < **5m**（DEM 解像度に依存）
- [ ] OSM ペアリフト両端の標高差が DEM 上の線形補間と整合（±10m）
- [ ] ゲレンデ境界内の slope 分布が公式コース難易度と矛盾しない（目視 QA）

---

## 4. L2: IllustrationStylizer（イラスト化層）

### 4.1 v1 ルールベース（最初に作る「モデル」）

ML なしでも高品質に到達できる領域。LAAX / skimap 系の**デザインルール**をコード化。

| ルール | 内容 |
|--------|------|
| 陰影 | hillshade を 2〜3 層に量子化し、雪面グラデーション |
| 等高線 | 10m 刻み、上部は濃く・下部は薄く |
| コース | OSM piste + slope 沿いのスナップ（手修正許容） |
| リフト | OSM aerialway を固定、イラスト線は上に重ねる |
| うねり | plan_curvature 高い区間にハッチ / 線幅変化 |
| 木・建物 | OSM + 簡略シンボル（後追い） |

**出力形式（推奨）**:
- `base-relief.svg` — 地形のみ（L1 拘束）
- `overlay-lifts-trails.svg` — `data-feature-id` 付き操作層
- `manifest.json` — 既存 `features.manifest` と統合

### 4.2 v2 学習モデル（スタイル転移）

v1 で「形が正しい」中間画像を量産したうえで、**見た目だけ**を学習。

| 項目 | 内容 |
|------|------|
| 入力 | L1 の multi-channel tensor（Z, hillshade, slope, curvature）+ 線画（リフト/コース） |
| 参照スタイル | skimap / 欧州リゾート図（著作権に注意・学習用と本番用を分離） |
| アーキテクチャ候補 | ControlNet（depth/normal）+ SD、または軽量 U-Net で hillshade→イラスト |
| 拘束 | 出力の輪郭は Canny/等高線との **Hausdorff 距離** で L1 から逸脱したら棄却 |
| 推論 | 施設ごと 1 回オフライン生成 → SVG/PNG タイルを CDN 配信 |

**重要**: 学習モデルは「山を捏造」させない。入力は常に L1 のテンソル。

### 4.3 v3 インタラクティブ（Web）

- オフライン生成した **ベクター＋ラスター混合** を `LiftMapViewer` で表示
- パン・ズーム: タイル or SVG viewBox + `react-zoom-pan-pinch`
- 状態色: 既存 `map-status` API（変更なし）
- Mapbox は **配信エンジンとしても不要**（自前タイルで可）

---

## 5. パイプライン CLI 設計（テンプレ化）

```bash
# 施設 slug ごとに再実行可能
elevation-illustration ingest   --resort sichinohe-choei-ski --bbox 141.09,40.69,141.11,40.70
elevation-illustration analyze  --dem data/dem.tif --out data/terrain-tensor/
elevation-illustration stylize  --tensor data/terrain-tensor/ --style default-ski-v1 --out public/maps/
elevation-illustration validate --manifest data/map/features.manifest.json --report qa.json
elevation-illustration publish  --out web/public/maps/sichinohe/
```

### ディレクトリ案

```
tools/elevation-illustration/
  ingest/          # GSI DEM 取得・クリップ
  analyze/         # hillshade, curvature, contours
  stylize/         # v1 ルール / v2 モデル推論
  validate/        # 標高・リフト端点 QA
  styles/          # 色・線幅トークン（Figma 連携）
  models/          # v2 学習済みウェイト（git LFS）
```

---

## 6. 七戸町営でのパイロット手順

| 週 | 成果物 |
|----|--------|
| W1 | bbox 確定、GSI DEM クリップ、`terrain-tensor` 生成 |
| W2 | L1 等高線 + hillshade SVG エクスポート（白黒でも可） |
| W3 | L2 v1 スタイル適用、skimap 2012 と並置 QA |
| W4 | `feature-id` 統合、`/map` を新 SVG に差し替え |
| W5+ | curvature うねり表現チューニング、v2 学習データ収集 |

**成功画像**: 公式・skimap と並べて「コースの上下関係が同じ」と現場が言える状態。

---

## 7. Mapbox / 衛星 3D との関係

| 方式 | 役割 |
|------|------|
| Mapbox 衛星 3D | **採用しない**（品質目標とずれる） |
| Mapbox DEM | L1 の**代替入力**として検証時のみ可 |
| 自パイプライン | **本番の見た目の正** |

起伏が分かればよい、かつ高品質 → **L1 の hillshade + curvature を効かせたイラスト（L2 v1）** が最短。

---

## 8. 他ゲレンデへの展開（テンプレの価値）

新規ゲレンデオンボーディング時:

1. `center.json` + bbox だけ渡す
2. `ingest` → `analyze` → `stylize` を自動（30分〜数時間）
3. 現場がリフト名・コース名を manifest で確認
4. LINE / API は既存のまま

紙マップしかない施設も、**DEM + OSM があれば L1 は自動**、L2 でパンフレット品質に近づける。

---

## 9. 次のアクション

1. **L1 プロトタイプ**: 七戸 bbox で DEM 取得スクリプト + hillshade PNG 出力
2. **QA 基準書**: skimap 2012 との比較チェックリスト
3. **`/map` 方針**: Mapbox 3D をデフォルトから外し、生成 SVG ビューアに切替
4. **v2 学習**: v1 成果物が 10 施設分たまってから着手

関連: [ROADMAP_LIFT_MAP_VISUAL_FIRST.md](./ROADMAP_LIFT_MAP_VISUAL_FIRST.md) / [LIFT_MAP_WEBDX_TEMPLATE.md](./LIFT_MAP_WEBDX_TEMPLATE.md)
