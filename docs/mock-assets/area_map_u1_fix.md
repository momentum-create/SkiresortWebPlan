# U1 修正指示 — 遠方 POI focus 時のピン視認性

**Date:** 2026-06-15  
**Author:** `resort-map-bridge`（bounds 契約・導線仕様）  
**Implementer:** `@resort-template-implementer`  
**起因:** `area_map_ux_eval.md` **U1** — `skiFood` profile の `excludeFoodIds`（千代田・Gosh・BTB）を focus したとき、コンパクト embed の初期俯瞰にピンが入らず `autoPan` 頼みになる

---

## 0. 修正方針（1 行）

**レイヤー俯瞰のデフォルトは維持しつつ、focus / select 時だけ当該 POI を `fitBounds` 対象に加える。** 選択時ズームイン（`flyTo` / `selectionZoom`）は禁止のまま。

---

## 1. データ契約（`resort-map-bridge`）

| 項目 | 規則 |
|------|------|
| 通常 `fitBounds` | `boundsProfiles[resolveBoundsProfile()]` の filter のみ（遠方 food は除外可） |
| focus / select 時 | 上記集合 **∪ { focusedFeature }** で `fitBounds` を 1 回実行 |
| トリガー | `select(id)`、URL `?focus=` 初回、`postMessage { focus }` |
| 禁止 | focus 専用の `maxZoom` 引き上げ、`flyTo`、profile 永続変更 |

`excludeFoodIds` の意味は「**初期俯瞰の密度管理**」であり「**focus 不可**」ではない。

---

## 2. ファイル別タスク

### 2.1 `docs/mock-assets/_shared/area-map.js`

#### A. `featuresForBounds(profile, ensureIds = [])`

- 第 2 引数 `ensureIds: string[]` を追加。
- 通常 filter で除外された feature でも、`ensureIds` に含まれる ID は **必ず bounds 計算に含める**。
- `ensureIds` が空のときは現行挙動と同一。

#### B. `fitMapToProfile(animate, ensureIds = [])`

- `featuresForBounds(profile, ensureIds)` を呼ぶ。
- `padding` / `maxZoom` は profile 設定を維持。

#### C. `select(id, options)`

- popup 表示前に `fitMapToProfile(true, [id])` を呼ぶ（`fromList` / embed postMessage 共通）。
- `afterLayerChange()` では `ensureIds` なし（popup は `closePopup` 済み）。

#### D. boot `?focus=` 初回

- 既存の `select(focus)` 経路で U1 が効くこと（二重 fit 不要）。

---

## 3. 完了条件（U1 クローズ）

| # | 操作 | 期待 |
|---|------|------|
| 1 | embed `food,anchor` 初回表示 | 美馬牛クラスター俯瞰（遠方 3 店は画面外でも可） |
| 2 | リスト「地図で見る」→ **千代田** | マップへスクロール + **千代田ピンが画面内** + popup |
| 3 | 同上 **Gosh / BTB** | 同上 |
| 4 | focus 後レイヤー「温泉」切替 | 俯瞰が白金方面に切替（focus はクリア） |
| 5 | standalone レール選択（遠方店） | popup + ピン視認（ズームインなし） |

```bash
npx serve docs/mock-assets -p 3456
# /biei-lp/nearby-food.html — 375px 幅
```

---

## 4. L3 再評価

実装後 `area_map_ux_eval.md` の U1 行を **PASS** に更新。

---

## 5. 依頼文（コピペ）

```
@resort-template-implementer
docs/mock-assets/area_map_u1_fix.md に従い U1（遠方 POI focus 視認性）を修正。
featuresForBounds / fitMapToProfile に ensureIds を追加し select() から呼ぶ。
禁止: flyTo / selectionZoom
確認: nearby-food.html 375px — chiyoda / gosh / between focus
```
