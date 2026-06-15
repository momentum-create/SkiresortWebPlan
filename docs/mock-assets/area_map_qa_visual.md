# 周辺エリアマップ — ビジュアル QA レポート

**Date:** 2026-06-15 (re-eval: compact widget + Mapular pins + margin fix)  
**Evaluator:** `resort-visual-evaluator` (L3)  
**対象:** `area-map.html`、`biei-lp/nearby-food.html`、`biei-lp/mock.css`  
**基準:** `area_map_requirements.md` §4（V1–V6）

---

## Verdict

**PASS**

---

## ルーブリック

| ID | 結果 | 根拠 |
|----|------|------|
| **V1** タイポグラフィ階層 | **PASS** | popup 3段（title / category / district）。リスト mono → Syne eyebrow → title。CTA Syne uppercase。 |
| **V2** 余白リズム | **PASS** | LP embed: `aspect-ratio: 16/9`, `max-height: min(22–25rem, 42–56vw)` — BKKDW セクション内ワイド・コンパクト。standalone: stage `align-items: flex-start` で地図下の空白廃止。8px グリッド維持。 |
| **V3** 写真・ビジュアルアセット | **PASS** | Carto light タイル。Mapular PNG ピン（food / onsen / ski / transit / blue-pond）。ダーク popup `#1a1f26`。統一ドットは **非採用**（ユーザー指定で Mapular 復帰）。 |
| **V4** マイクロインタラクション | **PASS** | active pin 48px + drop-shadow。fitBounds animate + reduced-motion 無効。選択時 zoom 不変。 |
| **V5** ブランド一貫性 | **PASS** | `--area-accent: #5a6f85`。pressed chip `#1a2332`。ネオン `#E2FC07` なし。絵文字ピンなし。 |
| **V6** ベンチマーク整合 | **PASS** | BKKDW 識別要素: fitBounds 俯瞰 / 地図上 popup / コンパクト横長ウィジェット / 淡色タイル / VIEW MAP CTA。ピンは美瑛 LP 既存 Mapular（BKKDW 統一ドットから差し替え — ユーザー指示）。 |

---

## 2026-06-15 修正ログ

| 問題 | 修正 | V 判定 |
|------|------|--------|
| マップ全画面化（72vh） | `aspect-ratio: 16/9` + capped height | V2 **PASS** |
| 地図下巨大グレー余白 | `align-self: flex-start`、免責を rail-foot へ | V2 **PASS** |
| 統一ドットピン | Mapular PNG 復帰 | V3 **PASS**（LP ブランド資産） |

---

## ブロッカー

なし（V1・V5 とも PASS）

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → mock LP 周辺マップ v2 出荷可
```

**本レポート:** ✅ PASS — 両 L3 PASS 達成。
