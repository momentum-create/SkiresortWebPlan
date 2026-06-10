# アセットブリーフ — ヒーロー画像（Gemini 用）

> **resort-asset-brief** | 2026-06-07  
> 対象: 七戸町営スキー場トップページ ヒーロー  
> **Cursor / コードエージェントは画像を生成しない。** 本ファイルのプロンプトで Gemini（または Imagen）から出し、人間が選定 → `public/images/` に配置 → `resort-template-implementer` がパス差し替えのみ。

---

## 0. Gemini 指定プロンプト（これだけ貼る）

**ツール**: [Google AI Studio](https://aistudio.google.com) → 画像生成（Gemini 2.0 Flash / Imagen 3 等）

| 設定項目 | 値 |
|----------|-----|
| アスペクト比 | **16:9**（Landscape / Wide） |
| 枚数 | 4〜8 枚ずつ。計 20 枚以上見て 1 枚採用 |
| 出力名 | `hero-sichinohe.webp` → `public/images/` |

### メインプロンプト（英語・全文コピー）

```text
Create a photorealistic wide hero banner image for a Japanese municipal ski resort website.

Subject: Sichinohe Town Ski Area (七戸町営スキー場), a modest town-operated ski hill at the foot of Mount Hakkoda in Aomori Prefecture, northern Japan. A gentle groomed mid-slope runs through natural birch and conifer forest — quiet, family-friendly, regional resort scale, NOT a huge commercial European-style alpine resort.

Lighting and mood: clear winter morning, crisp cold air, soft natural sunlight, realistic shadows on snow. Sky occupies upper 35% with pale blue and thin high clouds.

Composition (critical for web UI):
- Aspect ratio 16:9, landscape orientation, minimum 1920×1080 quality
- Main ski slope and tree line placed center-right
- Lower-left quadrant (40% width × 35% height) kept relatively empty and darker — white headline text will overlay here in Japanese
- Bottom third overall slightly darker tonal values for gradient overlay
- No people in foreground; at most one tiny distant skier silhouette

Color direction: bright snow highlights (#F7F9FB), cool teal-blue shadows (#2D6B7A), deep forest green tree line (#2D5A4A). Natural, muted, trustworthy — like official Japanese regional tourism photography.

Technical style: editorial travel photography, full-frame 35mm lens look, subtle depth of field, high detail snow texture, absolutely photorealistic.

STRICTLY AVOID: cartoon, anime, illustration, vector, CGI, 3D render, flat clip-art, neon colors, HDR overload, European Alps mega-resort, Matterhorn, fantasy mountains, crowded slopes, lift queue, readable text, logos, signs, watermarks, ski trail map drawn on snow, V-shaped fan of fake ski runs.
```

### 日本語追記（メインプロンプトの直後に 1 行足す場合）

```text
日本の地方町営スキー場の公式サイト用。八甲田麓・林間コース（青森県七戸町）。イラストやアニメ調は絶対に不可。写真のみ。
```

### ネガティブプロンプト（UI に欄がある場合のみ）

```text
cartoon, anime, illustration, vector, flat design, low poly, 3D render, CGI, clip art,
watermark, text, logo, signboard, European alps, Matterhorn, mega resort, neon, oversaturated HDR,
crowd, selfie, fisheye, map overlay, trail map on snow, childish, unsplash cliché
```

### 再生成用（微調整 1 行）

晴れが強すぎる場合:

```text
Same scene, slightly softer overcast winter light, keep photorealistic municipal Japanese ski hill.
```

林を強調する場合:

```text
Same scene, denser birch and conifer forest framing the slope, more "forest ski run" feeling.
```

---

## 1. 目的

| 項目 | 内容 |
|------|------|
| 用途 | トップ `/` ヒーロー背景（65dvh、`object-fit: cover`、微ズーム 1→1.04） |
| 上に載る UI | 白文字 2 行見出し + 1 行説明 + 下部グラデ（`hero-gradient`） |
| 品質目標 | ニセコ系リゾート公式写真の **信頼感**（町営・家族向け・林間） |
| 禁止 | Cursor 生成 SVG、汎用 Unsplash、手置き地形の AI イラスト、画像内テキスト |

---

## 2. リゾート文脈（プロンプトに入れる事実）

- **名称**: 七戸町営スキー場（青森県七戸町・町営）
- **地形**: 八甲田山連峰の麓、**林間コース**、中斜面中心（家族・初級〜中級向け）
- **雰囲気**: 大規模商業リゾートではなく、**静か・澄んだ冬空・自然林** の町営ゲレンデ
- **色調**: 雪 `#F7F9FB`、寒色空、深緑の針葉樹 `#2D5A4A`、アクセント寒色 `#2D6B7A`
- **避ける印象**: ネオン、欧州アルプスの巨大峰、過剰なパウダースプレー、スキー場名の看板・ロゴ

---

## 3. 構図要件（実装と整合）

```
┌─────────────────────────────────────┐
│  空（明るい冬空 30–40%）              │  ← 文字は載らないが明るすぎない
│                                     │
│  林線 + ゲレンデ斜面（中央〜右）      │  ← 主被写体
│                                     │
│ ████████ 暗めグラデ想定域 ████████  │  ← 下端 35% は暗くても OK（CSS で更に暗くする）
│  [八甲田の麓、] [林の中のゲレンデ。]   │  ← 実際のテキストは HTML 側
└─────────────────────────────────────┘
```

- **アスペクト**: 16:9（推奨 1920×1080 以上）
- **セーフゾーン**: 左下 40%×30% に主要被写体を置かない（見出しと重なる）
- **人物**: 0〜2 人の小シルエットは可。顔のアップ・大群衆は避ける
- **リフト**: 遠景に 1 本まで可。詳細な支柱配置は **正確さ不要**（イラスト扱いの場合）

---

## 4. 推奨プロンプト（A: フォトリアル — 第一候補）

Gemini / Imagen に **英語メイン** で渡す（品質が安定しやすい）。日本語は補足用。

### Prompt A（コピペ用）

```text
Editorial ski resort hero photograph, Sichinohe Town municipal ski area at the foot of Mount Hakkoda, Aomori Prefecture, Japan. Gentle mid-slope groomed run winding through natural birch and conifer forest, quiet local Japanese ski hill atmosphere—not a massive commercial alpine resort. Fresh winter snow, soft powder texture on the edges, crisp cold blue sky with thin high clouds. Late morning natural light, realistic photography, shot on full-frame camera 35mm lens, subtle depth of field. Color palette: cool alpine teal shadows, deep forest green tree line, bright snow highlights #F7F9FB, no oversaturated neon. Wide landscape composition 16:9, main slope in center-right, generous negative space in upper sky, darker tonal values in bottom third for text overlay. No text, no logos, no watermarks, no lift station branding, no cartoon, no illustration style. Photorealistic, trustworthy resort marketing quality like official Japanese regional ski tourism photography.
```

### 日本語補足（必要なら追記）

```text
青森県七戸町の町営スキー場。八甲田麓の林間ゲレンデ。家族向けのやさしい中斜面。日本の地方スキー場の落ち着いた信頼感。イラスト調・アニメ調は不可。
```

---

## 5. 代替プロンプト

### B: シネマティック（ややドラマチック）

```text
Cinematic wide shot of a small Japanese municipal ski resort in Aomori, forest-lined ski run under Mount Hakkoda foothills. Blue hour winter light transitioning to soft daylight, volumetric light through trees, premium travel magazine cover quality. Realistic photography only. 16:9, bottom third darker for UI overlay. No people in foreground, no text, no logos, no European Alps peaks, no fantasy mountains.
```

### C: エディトリアル aerial（遠景）

```text
Aerial drone photograph at moderate altitude, Japanese town-operated ski resort nestled in snow-covered forest, Hakkoda region Aomori Japan. Single main slope visible between tree lines, modest scale, peaceful regional resort. High resolution photorealistic, winter clarity, cool color grade matching teal-green forest and white snow. 16:9 landscape. No labels, no maps drawn on image, no illustrated map overlay.
```

### D: ソフトフォト（曇り・粉雪、ムード重視）

```text
Overcast winter day at a small ski area in northern Japan, soft diffused light on groomed run through birch forest, fine powder snow surface, serene and family-friendly mood. Photorealistic, muted cool tones, no harsh contrast. 16:9 hero banner composition, empty slope without crowds. No illustration, no CGI look, no text.
```

> **イラスト系は本番非推奨。** どうしても使う場合のみ D の下に `soft watercolor` は付けないこと（V3 で FAIL リスク）。

---

## 6. ネガティブプロンプト（共通）

```text
cartoon, anime, illustration, vector art, flat design, low poly, clip art, childish drawing,
generic stock photo watermark, unsplash style cliché, Swiss mega resort, Matterhorn, 
European alps village, neon colors, cyberpunk, night club lighting, heavy HDR, oversaturated,
text, typography, logo, signboard with readable words, watermark, border, frame,
crowded lift queue, selfie stick, instagram filter, fisheye distortion,
fake map lines, ski trail map overlay, hand-drawn course map on snow
```

---

## 7. 生成パラメータ（目安）

| 項目 | 推奨 |
|------|------|
| 枚数 | **20〜40 枚** バッチ生成 → 人間が **3 枚に絞る** → 最終 1 枚 |
| アスペクト | 16:9（Gemini: Landscape / Wide） |
| 解像度 | 最大（後で `1920×1080` 以上を確認） |
| モデル | Gemini 画像生成（Imagen 3 等）— 利用可能な最高品質 |
| シード | 気に入った 1 枚のシードをメモし、微調整で再生成 |

### バリエーション軸（A をベースに 1 要素だけ変える）

| # | 変更 | 意図 |
|---|------|------|
| 1 | 晴れ / 薄曇り | ライブステータス「晴れ」と矛盾しない方を選ぶ |
| 2 | 林の密度 多 / 少 | 七戸「林間」を強調 |
| 3 | 斜面の見え方 正面 / 斜め | 下端グラデと被写体の重なりを確認 |

---

## 8. 書き出し・配置

| 項目 | 値 |
|------|-----|
| ファイル名 | `hero-sichinohe.webp`（第一候補）または `hero-sichinohe.jpg` |
| 配置先 | `public/images/hero-sichinohe.webp` |
| 実装参照 | `src/data/resort-template.ts` → `hero.imageUrl` |
| alt 文言 | `messages/*.json` → `hero.imageAlt`（実写/雰囲気に合わせて更新） |
| 圧縮 | WebP quality 82〜88、目標 **&lt; 400KB**（LCP） |

```typescript
// 承認後のみ implementer が変更
hero: {
  imageUrl: "/images/hero-sichinohe.webp",
},
```

---

## 9. 人間 QA チェックリスト（実装前必須）

すべて YES でないと `public/images/` に置かない。

- [ ] **イラスト/ベクター感がない**（写真として自然）
- [ ] 下端 35% にグラデを重ねても **見出しが読める**（試しに HTML プレビューで確認）
- [ ] 欧州巨大リゾート・別国の山に見えない
- [ ] 画像内に **文字・ロゴ・看板の読める文字がない**
- [ ] 不自然なリフト配置・V字の扇形コース（AI 典型失敗）がない
- [ ] 色が七戸パレット（寒色・深緑・白雪）と大きく矛盾しない
- [ ] 解像度 1920×1080 以上
- [ ] 利用規約上 **商用 Web 掲載 OK**（Gemini の出力ポリシーを確認）

**選定記録**:

```markdown
採用: hero-sichinohe.png（Gemini 生成）
プロンプト: §0 メインプロンプト（晴れ・林間・パノラマ）
QA: フォトリアル PASS。左下テキスト重ね要目視。規模はやや大きめ → 町営よりリゾート感強め（WARN）
配置: public/images/hero-sichinohe.png（ユーザーが Gemini から保存）
承認者: ユーザー / 2026-06-07
```

---

## 10. エージェント連携

```
docs/asset_brief.md（本ファイル）
  → [人間 + Gemini] 生成・QA
  → public/images/hero-sichinohe.webp 配置
  → resort-template-implementer（パス・alt のみ）
  → resort-visual-evaluator V3 再評価
```

| エージェント | 役割 |
|-------------|------|
| Cursor 実装系 | **プロンプト実行・画像生成禁止** |
| `resort-visual-evaluator` | エージェント生成 SVG / 汎用ストック → **FAIL** |
| `resort-template-implementer` | 承認済みファイルパスの差し替えのみ |

---

## 11. 最終手段（品質優先）

Gemini で満足いく写真が出ない場合の優先順:

1. **七戸町・公式 / 現地撮影** の実写（最良）
2. 有料ストック（地域名で検索: Aomori ski, Hakkoda winter forest）
3. Gemini B/C の再試行
4. イラスト・Cursor SVG — **本番不可**

---

## 関連

- デザイン文脈: `docs/design_concepts.md`（七戸パレット）
- HTML プレビュー: `docs/preview/alpine-clarity-v2.html`（グラデ重ね確認用）
- ビジュアルゲート: `agents/resort-visual-evaluator.prompt.md` V3
