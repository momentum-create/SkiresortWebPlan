# 汎用ゲレンデマップイラスト — プロンプト・制作指示書テンプレート

**版**: v1.0（2026-06-05）  
**用途**: 変数を置換するだけで、任意ゲレンデの鳥瞰マップイラストを生成／発注する  
**置換規則**: `[変数名]` をシステムまたは手動で実値に差し替える

---

## 変数マスタ一覧

| 変数ID | 説明 | 例（七戸） |
|--------|------|------------|
| `[RESORT_NAME]` | ゲレンデ名 | Shichinohe Town Ski Resort |
| `[RESORT_NAME_JA]` | 日本語名 | 七戸町営スキー場 |
| `[BASE_ELEVATION_M]` | ベース標高 | 88 |
| `[TOP_ELEVATION_M]` | 山頂標高 | 210 |
| `[VERTICAL_DROP_M]` | 標高差 | 122 |
| `[MOUNTAIN_SHAPE]` | 山形の言語化 | single open slope, forested ridgeline on east |
| `[BBOX_DESCRIPTION]` | 地理範囲（方位） | base SE, summit NW, Pacific visible east |
| `[COURSE_SUMMARY]` | コース構成概要 | 5 runs: 25% beg / 36% int / 39% adv |
| `[COURSE_DATA]` | コース詳細（構造化） | 下記フォーマット参照 |
| `[LIFT_DATA]` | リフト詳細 | 下記フォーマット参照 |
| `[FACILITY_DATA]` | 施設配置 | 下記フォーマット参照 |
| `[LANDMARK_DATA]` | 景観ランドマーク | Mt. Hakkoda range west, rice fields east |
| `[SEASON]` | 季節 | midwinter |
| `[WEATHER]` | 天候 | clear cold day |
| `[TIME_OF_DAY]` | 時間帯 | late morning |
| `[VISUAL_TONE]` | トーン | crisp realistic winter, soft shadows |
| `[COLOR_PALETTE]` | 配色方針 | groomed blue-white, gladed green-gray trees |
| `[CAMERA_HEADING_DEG]` | 方位（北=0°） | 295 |
| `[CAMERA_TILT_DEG]` | 傾き（0=真下, 90=水平） | 78 |
| `[CAMERA_ALTITUDE_M]` | カメラ高度AGL | 800 |
| `[HORIZONTAL_FOV_DEG]` | 水平画角 | 40 |
| `[SCALE_REFERENCE]` | 縮尺根拠 | pair lift 408m runs diagonal lower-right to upper-left |
| `[ASPECT_RATIO]` | 出力比率 | 3:2 |
| `[OUTPUT_WIDTH_PX]` | 出力幅 | 1536 |
| `[REFERENCE_MAP_NOTE]` | 参照図の扱い | match skimap 2012 layout, not copy verbatim |
| `[GSI_ALIGNMENT_NOTE]` | 地理整合 | control points: pair lift bottom [lng,lat], top [lng,lat] |

### `[COURSE_DATA]` 記述フォーマット（1本ずつ繰り返し）

```
- [COURSE_NAME]: [DIFFICULTY], [LENGTH_M]m, max slope [MAX_SLOPE_DEG]°, [SNOW_TYPE], runs from [START_DESC] to [END_DESC], visible as [COLOR_ON_MAP] band on [ASPECT_SIDE] of mountain
```

### `[LIFT_DATA]` 記述フォーマット

```
- [LIFT_NAME] ([LIFT_TYPE]): [LENGTH_M]m, [VERTICAL_M]m vertical, bottom at [BOTTOM_DESC] ([BOTTOM_LNG_LAT]), top at [TOP_DESC] ([TOP_LNG_LAT]), line runs [DIRECTION_ON_IMAGE]
```

### `[FACILITY_DATA]` 記述フォーマット

```
- [FACILITY_NAME] ([TYPE]): located at [POSITION_DESC] near [LANDMARK], [SIZE_HINT]
```

---

## A. 画像生成AI向け — 英語プロンプトテンプレート

### A-1. メインプロンプト（Positive）

```
Professional ski resort bird's-eye map illustration of [RESORT_NAME], [RESORT_NAME_JA].
Accurate topographic fidelity, not fantasy stylization.

=== GEOGRAPHY & SCALE (MANDATORY) ===
Elevation: base [BASE_ELEVATION_M]m, summit [TOP_ELEVATION_M]m, vertical drop [VERTICAL_DROP_M]m.
Mountain form: [MOUNTAIN_SHAPE].
Geographic layout: [BBOX_DESCRIPTION].
Scale anchor: [SCALE_REFERENCE]. Maintain true relative distances between lifts, runs, and base area.

=== CAMERA & PERSPECTIVE (MANDATORY) ===
Oblique aerial view (ski resort map style, NOT satellite flat orthophoto).
Camera heading [CAMERA_HEADING_DEG]° from north (0°=north, 90°=east).
Camera tilt [CAMERA_TILT_DEG]° (0°=nadir/top-down, 90°=horizon).
Viewpoint altitude approximately [CAMERA_ALTITUDE_M]m above ground.
Horizontal field of view [HORIZONTAL_FOV_DEG]°.
Show entire ski area in frame with minimal cropping. Consistent single vanishing perspective across all runs.

=== RUNS / COURSES ===
Course mix: [COURSE_SUMMARY].
Detailed placement:
[COURSE_DATA]

Runs must follow natural fall lines on the actual terrain. No invented V-shaped fan patterns.
Beginner zones wider and lower; advanced zones steeper and upper-mountain.

=== LIFTS ===
[LIFT_DATA]
Lift lines straight along actual routes; visible towers at regular intervals.
Bottom and top stations clearly distinguishable.

=== BASE & FACILITIES ===
[FACILITY_DATA]
Parking, lodge, and lift terminals at correct relative positions to slopes.

=== ENVIRONMENT & MOOD ===
Season: [SEASON]. Weather: [WEATHER]. Time: [TIME_OF_DAY].
Landscape context: [LANDMARK_DATA].
Visual tone: [VISUAL_TONE]. Color palette: [COLOR_PALETTE].
Fresh snow on slopes, subtle tree shadows, clear legibility for map overlay.

=== STYLE ===
High-resolution resort map illustration, clean edges, print-ready.
Similar quality to Japanese ski resort pamphlet maps and skimap.org resort posters.
Slight artistic enhancement allowed on snow texture only; geometry must stay survey-accurate.
[REFERENCE_MAP_NOTE]

--ar [ASPECT_RATIO] --style raw --v 6
```

### A-2. ネガティブプロンプト（Negative）

```
wrong scale, distorted perspective, multiple conflicting vanishing points, flat satellite view,
cartoon, anime, childish scribble lines, glowing neon trails, random V-shaped course fan,
lifts floating off terrain, lifts at wrong angles, missing base buildings,
summer green season, fog obscuring layout, text labels, watermark, logo,
people, cars oversized, duplicated lifts, fantasy mountains not matching real topography,
aerial photo collage seams, low resolution, blurry
```

### A-3. Midjourney パラメータ例

```
--ar 3:2 --style raw --v 6 --s 120 --q 2
```

（写実寄り・幾何重視なら `--s` を下げる。120〜250 推奨）

### A-4. システム置換後の記入例（七戸・抜粋）

```
[COURSE_DATA] =
- Champion (Advanced): 400m, max 35°, ungroomed upper, upper NW face
- Intermediate Slope: groomed, center-left of pair lift
- Pony Area (Beginner): 180m, wide gentle, lower east base

[LIFT_DATA] =
- Pair Lift: 408m, bottom SE base, top NW ridge, diagonal on image
- Pony Lift (surface): 180m, lower east beginner zone, short northeast line
```

---

## B. 人間のイラストレーター／3Dデザイナー向け — 日本語制作指示書テンプレート

---

# ゲレンデ鳥瞰マップ 制作指示書

**案件名**: [RESORT_NAME_JA]（[RESORT_NAME]）ゲレンデマップイラスト  
**版**: [VERSION]  
**発行日**: [ISSUE_DATE]  
**発注者**: [CLIENT_NAME]  
**納期**: [DEADLINE]

---

## 1. 制作目的

[RESORT_NAME_JA] の公式Web・パンフレット用**鳥瞰ゲレンデマップ**を制作する。  
来場者が「どのコースがどこにあるか」「リフトの上下関係」を一目で理解できること。  
**現場に忠実で正確**であることを最優先とし、装飾的な誇張は禁止する。

---

## 2. 座標・縮尺・パース仕様（必須遵守）

| 項目 | 指定値 |
|------|--------|
| ベース標高 | [BASE_ELEVATION_M] m |
| 山頂標高 | [TOP_ELEVATION_M] m |
| 標高差 | [VERTICAL_DROP_M] m |
| カメラ方位（Heading） | [CAMERA_HEADING_DEG]°（北=0°） |
| カメラ傾き（Tilt） | [CAMERA_TILT_DEG]°（0°=真上、90°=水平） |
| 視点高度（目安） | [CAMERA_ALTITUDE_M] m AGL |
| 水平画角 | [HORIZONTAL_FOV_DEG]° |
| 縮尺の根拠 | [SCALE_REFERENCE] |
| 地理整合メモ | [GSI_ALIGNMENT_NOTE] |

### パースの意図

- **斜め俯瞰（鳥瞰図）**であり、真上の航空写真ではない。
- 画面内のすべてのオブジェクト（コース・リフト・建物）が**同一の消失点系**に乗ること。
- リフト全長・コース幅の**相対距離**を、添付の参照データどおりに維持すること。

### 禁止事項

- 根拠のないコース線の追加・扇形（V字）配置
- リフト線の曲げ誇張、発光エフェクト、角丸の太い「落書き」風ライン
- 参照資料と無関係な山形の創作

---

## 3. 地形・山の形状

**山形**: [MOUNTAIN_SHAPE]

**方位関係**: [BBOX_DESCRIPTION]

**周辺景観**: [LANDMARK_DATA]

---

## 4. コース構成

**全体比率**: [COURSE_SUMMARY]

### コース一覧

| # | コース名 | 難易度 | 全長 | 最大斜度 | 雪面 | 配置（画面・山面） |
|---|----------|--------|------|----------|------|-------------------|
| [COURSE_TABLE_ROWS] |

※ 詳細テキスト:

```
[COURSE_DATA]
```

**配色（マップ上）**

| 難易度 | 色 |
|--------|-----|
| 初級 | [COLOR_BEGINNER] |
| 中級 | [COLOR_INTERMEDIATE] |
| 上級 | [COLOR_ADVANCED] |

---

## 5. リフト・ゴンドラ配置

| # | 名称 | 種別 | 全長 | 標高差 | 下駅位置 | 上駅位置 | 画面上の向き |
|---|------|------|------|--------|----------|----------|--------------|
| [LIFT_TABLE_ROWS] |

※ 詳細テキスト:

```
[LIFT_DATA]
```

- リフト線は**細い実線**（塔位置が推測できる程度）。太い蛍光線は不可。
- 下駅・上駅はシンボル（□・○等）で明示。

---

## 6. 山麓・施設配置

```
[FACILITY_DATA]
```

| 施設 | 種別 | 位置 | 備考 |
|------|------|------|------|
| [FACILITY_TABLE_ROWS] |

---

## 7. 季節・天候・トーン＆マナー

| 項目 | 指定 |
|------|------|
| 季節 | [SEASON] |
| 天候 | [WEATHER] |
| 時間帯 | [TIME_OF_DAY] |
| 全体トーン | [VISUAL_TONE] |
| 配色方針 | [COLOR_PALETTE] |

**参考にする画風**: 日本のスキー場パンフレット鳥瞰図、skimap.org のリゾートポスター（**構図参考。トレース不可**）

---

## 8. 参照資料（必ず照合）

| # | 資料 | 用途 |
|---|------|------|
| 1 | 国土地理院正射写真（添付） | 地形・建物位置の正 |
| 2 | [REFERENCE_MAP_NOTE] | コース配置の照合 |
| 3 | OSM / 測量座標（添付 GeoJSON） | リフト端点の正 |
| 4 | 現地写真（添付） | 雪面・建物外観 |

---

## 9. 納品仕様

| 項目 | 仕様 |
|------|------|
| サイズ | [OUTPUT_WIDTH_PX] × [OUTPUT_HEIGHT_PX] px（[ASPECT_RATIO]） |
| 形式 | PNG（最高品質）、レイヤー分け PSD 任意 |
| 色空間 | sRGB |
| 地物 | コース・リフト線は**画像に焼き込み**（後工程で SVG 重ねない前提） |
| テキスト | コース名ラベル [INCLUDE_LABELS: yes/no] |

---

## 10. 品質チェックリスト（納品前）

- [ ] ペア／主要リフトの上下駅が参照座標と画面上で ±20px 以内
- [ ] コースの上下関係が公式マップと一致
- [ ] 同一パースで建物・リフト・斜面が揃っている
- [ ] 初級・上級の位置取りが逆転していない
- [ ] 担当者（[CLIENT_CONTACT]）の目視承認

---

## 11. 連絡・承認

| 項目 | 内容 |
|------|------|
| 窓口 | [CLIENT_CONTACT] |
| 修正ラウンド | [MAX_REVISION_ROUNDS] 回まで |
| 承認方法 | [APPROVAL_METHOD] |

---

*本指示書は `[RESORT_NAME_JA]` 用にシステム自動生成されたテンプレート `[TEMPLATE_VERSION]` です。*

---

## C. システム連携用 — 一括置換 JSON スキーマ（参考）

```json
{
  "resort_name": "[RESORT_NAME]",
  "resort_name_ja": "[RESORT_NAME_JA]",
  "elevation": { "base_m": "[BASE_ELEVATION_M]", "top_m": "[TOP_ELEVATION_M]" },
  "camera": {
    "heading_deg": "[CAMERA_HEADING_DEG]",
    "tilt_deg": "[CAMERA_TILT_DEG]",
    "altitude_m": "[CAMERA_ALTITUDE_M]",
    "fov_deg": "[HORIZONTAL_FOV_DEG]"
  },
  "courses": "[COURSE_DATA]",
  "lifts": "[LIFT_DATA]",
  "facilities": "[FACILITY_DATA]",
  "tone": {
    "season": "[SEASON]",
    "weather": "[WEATHER]",
    "visual": "[VISUAL_TONE]"
  }
}
```

`illustration-brief-generator.mjs`（未実装）から本テンプレートへ流し込む想定。

---

## D. 品質原則（テンプレート共通）

1. **地理の正**（GSI / OSM / 現地）を先に、**見た目の正**（イラスト）を後からキャリブレーション
2. 変数未入力のまま生成しない（`[LIFT_DATA]` が空 → ブロック）
3. イラストに線を焼き込む場合、Web 上に太い SVG を重ねない

---

*関連: [UNIVERSAL_RESORT_MAP_SYSTEM_REQUIREMENTS.md](./UNIVERSAL_RESORT_MAP_SYSTEM_REQUIREMENTS.md)*
