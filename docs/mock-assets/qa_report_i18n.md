# L3 i18n QA Report — docs/mock-assets/

**Date:** 2026-06-13  
**Scope:** 7 resort LP mocks + hub index  
**Verdict:** **PASS**

## Summary

日英バイリンガル管理基盤を構築し、7施設すべてで JSON キー parity・HTML 配線・言語切替 UX を検証済み。静的プレビューはローカル HTTP サーバー必須。

## Per-question results

| Rubric | Result | Notes |
|--------|--------|-------|
| Q-i18n-1 ja/en key parity | **PASS** | `validate-mock-i18n.mjs` exit 0（7施設 + ui 29 keys） |
| Q-i18n-2 HTML wiring | **PASS** | `validate-mock-html-i18n.mjs` exit 0（配列キー対応済み） |
| Q-i18n-3 UX | **PASS** | localStorage + `?lang=en` + aria-pressed/current + 44px タップ領域 |
| Q-i18n-4 Content | **PASS** | EN 翻訳・住所方針遵守。Sichinohe 表記・美瑛 JA 混在を修正済み |
| Q-i18n-5 Hub | **PASS** | registry.json 駆動の日英テーブル |
| Q-i18n-6 Limitations | **PASS** | file:// 不可を i18n_spec.md に明記 |

## 管理構成

| ファイル | 役割 |
|----------|------|
| `i18n_spec.md` | 仕様・プレビュー手順 |
| `registry.json` | 7施設メタデータ |
| `_shared/mock-i18n.js` | LP 言語ローダー |
| `_shared/messages/ui.*.json` | 共通ナビ・ボタン |
| `{resort}-lp/messages/*.json` | 施設固有コピー |
| `scripts/validate-mock-i18n.mjs` | JSON parity |
| `scripts/validate-mock-html-i18n.mjs` | HTML↔JSON 整合 |

## 修正履歴（本監査で実施）

1. HTML 検証スクリプトの配列キー（`hashtags.0` 等）対応
2. 七戸 EN: Shichinohe → Sichinohe（registry 統一）
3. 美瑛 JA: `guides.responsible.body` の英語混在を除去
4. 言語切替 `aria-label` を `lang.switch` に i18n 配線（全8ページ）

## プレビュー

```bash
npx serve docs/mock-assets -p 3456
```

- 索引: http://localhost:3456/
- 七戸（英語）: http://localhost:3456/sichinohe-lp/index.html?lang=en

## 本番への移行時

ルート `messages/ja.json` / `en.json` と `next-intl` へは `resort-i18n-spec` → `resort-template-implementer` パイプラインで別途 handoff。モック JSON は参考データとして利用可。
