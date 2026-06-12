# 七戸本番デプロイ（Vercel）

## プロジェクト設定

| 項目 | 値 |
|------|-----|
| **Root Directory** | `resorts/Sichinohe-CyoueiSki/web` |
| **Framework** | Next.js（自動検出） |
| **Production URL** | https://sichinohe-choei.vercel.app |

### 本番デプロイ（推奨: GitHub Actions）

`main` へ push すると `.github/workflows/vercel-production.yml` が Vercel 本番へデプロイします。

GitHub Repository Secrets（必須）:

| Secret | 内容 |
|--------|------|
| `VERCEL_TOKEN` | Vercel Account → Tokens |
| `VERCEL_ORG_ID` | `resorts/Sichinohe-CyoueiSki/web/.vercel/project.json` の `orgId` |
| `VERCEL_PROJECT_ID` | 同上の `projectId` |

確認: GitHub → **Actions** → **Deploy Sichinohe to Vercel Production**

### 手動デプロイ（フォールバック）

Vercel Git 連携が使えない場合の CLI:

```bash
cd resorts/Sichinohe-CyoueiSki/web
npx vercel --prod --yes
```

## 環境変数（Production）

| 変数 | 用途 |
|------|------|
| `ADMIN_UPDATE_TOKEN` | `/api/admin/*` 認証 |
| `NEXT_PUBLIC_SITE_URL` | OGP / canonical（任意） |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` + `NEXT_PUBLIC_GOOGLE_MAP_ID` | `/access` カスタム地図（優先） |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | `/map` 3D + `/access` 地図（次点） |
| `BLOB_READ_WRITE_TOKEN` | admin 一時保存（任意） |

未設定時 `/access` 背景は **OSM iframe**（API キー不要）。

Mapbox / Google キーはダッシュボードで **HTTP Referrer 制限**を設定すること。

## デプロイ確認

```bash
curl -s https://sichinohe-choei.vercel.app/api/public/build-info
```

`commit`（短縮 SHA）、`accessHero`、`accessMapTier`（`google` / `mapbox` / `osm`）を確認。
