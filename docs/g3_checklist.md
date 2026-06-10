# G3 チェックリスト — LAAX 運用・探索

> **目的**: [`laax_gap_spec.md`](./laax_gap_spec.md) §G3 — B3 ライブ感 + B4 探索前半  
> **前提**: G2 完了（2026-06-08）  
> **更新**: 2026-06-08

---

## 0. 現在地サマリ

| 領域 | 状態 |
|------|------|
| G3 interaction spec | ✅ `map-interaction-spec-g3.md` |
| サイドバー検索 | ✅ `MapStatusRail` + `map-search.ts` |
| status 手運用 | ✅ `/api/admin/map-status` + `MapStatusAdmin` |
| status-stale UI | ✅ `MapOverlayChrome` 琥珀帯 |
| マップ UI i18n | ✅ `map.search.*` / `map.stale.*` |
| L3 10s ポーリング | ✅ `useMapStatus` POLL_MS=10000 |
| Phase E 3 ゲート | ✅ コード監査 PASS（§3） |

---

## 1. タスク一覧

| # | タスク | 状態 | 合格条件 |
|---|--------|------|----------|
| G3-1 | interaction spec G3 | ✅ | `search-active` / `status-stale` |
| G3-2 | サイドバー検索 | ✅ | 地図不変・部分一致・該当なし |
| G3-3 | admin map-status API | ✅ | Bearer・manifest id 検証・`status.json` 書込 |
| G3-4 | admin UI トグル | ✅ | `/admin` セクション |
| G3-5 | status-stale 帯 | ✅ | chrome 琥珀帯 + 再試行 |
| G3-6 | L3 ポーリング | ✅ | 10s |
| G3-7 | i18n 検索文言 | ✅ | ja/en |
| G3-8 | 3 ゲート | ✅ | §3 |

---

## 2. G3 完了時 LAAX スコア

| ID | 目標 | いま |
|----|------|------|
| L1 | PARTIAL（2D） | ✅ 継承 |
| L2 | PASS | ✅ 継承 |
| L3 | PASS（10s 反映） | ✅ admin + 10s poll |
| L4 | PASS（検索+凡例+フィルタ） | ✅ |
| L5 | PASS | ✅ 継承 |

**4/5 PASS → G3 完了宣言可**

---

## 3. Phase E — G3 再評価（2026-06-08）

### code-reviewer

**PASS** — `status.json` 書込は manifest id のみ。admin 認証共有。幾何・A 方式無変更。

### map-ux-evaluator

**PASS** — 検索は rail 内のみ（R1/R2）。`status-stale` は stage 外 chrome（R2）。

### map-interaction-evaluator

**PASS** — G3-1〜5 spec 整合。I1 地図面積不変（検索時）。

---

## 4. 完了記録

| 項目 | 日付 | 結果 |
|------|------|------|
| G3 実装 | 2026-06-08 | 検索・admin・stale・i18n・10s poll |
| **G3 完了宣言** | 2026-06-08 | **完了** — L3/L4 PASS、次は G4 |

---

## 5. 次（G4）

→ ✅ 完了 [`g4_checklist.md`](./g4_checklist.md) — **LAAX 級宣言** 2026-06-08
