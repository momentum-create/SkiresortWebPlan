# G4 チェックリスト — LAAX 級（七戸スケール）

> **完了条件**: L1–L5 の **4/5 以上 PASS** + 本チェックリスト必須 ✅  
> **更新**: 2026-06-08

---

## 1. タスク

| # | タスク | 状態 |
|---|--------|------|
| G4-1 | interaction spec G4 | ✅ |
| G4-2 | SSE `/map-status/stream` | ✅ |
| G4-3 | 30s poll フォールバック | ✅ |
| G4-4 | 監査ログ JSONL | ✅ |
| G4-5 | 難易度フィルタ | ✅ |
| G4-6 | GPS 距離（sidebar） | ✅ |
| G4-7 | ライブバッジ UI | ✅（G6 一時解除 → **2026-06-08 再マウント**） |
| G4-8 | i18n G4 文言 | ✅ |
| G4-9 | G3 検索 UI 再マウント | ✅（G6 §6 承認後） |
| G4-10 | map-ux-evaluator 再評価 | ✅ PASS — `qa_report_map.md` §G4 再評価 |
| G4-11 | map-interaction-evaluator 再評価 | ✅ PASS |
| G4-12 | preview G3/G4 同期 | ✅ `build-map-preview.mjs`（2026-06-08） |
| G4-13 | **実機 SSE 反映** | ✅ admin → SSE **2279ms**（2026-06-10） |

---

## 2. LAAX スコア（G4 完了）

| ID | 判定 | 根拠 |
|----|------|------|
| L1 | **PASS** | 2D 焼き込みイラストで地形・林間可読（3D 不要） |
| L2 | PASS | G2 継承 |
| L3 | PASS | SSE + admin + 監査 |
| L4 | PASS | 検索 + 凡例 + 種別 + 難易度 + GPS 距離 |
| L5 | PASS | G2/G3 継承 |

**5/5 PASS**

---

## 3. 完了記録

| 項目 | 日付 | 結果 |
|------|------|------|
| G4 実装 | 2026-06-08 | SSE・監査・難易度・GPS |
| **LAAX 級宣言** | 2026-06-08 | **完了** — 七戸スケール LAAX 簡易版 |
| G4-13 実機 SSE | 2026-06-10 | `verify-g4-1-sse.mjs` — `lift-pony` toggle → SSE update 2279ms |

---

## 4. G5 以降（任意）

- PostgreSQL + 監査 UI 本格化
- LINE / 現場端末連携
- WebGL 3D（別判断）
- `feature.label` API i18n
