/**
 * マップ評価・IA 説明を静的 HTML で出力
 * 用法: node scripts/build-evaluation-html.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "public/preview");
const DOCS_OUT = path.join(ROOT, "docs/preview");

const GENERATED = new Date().toISOString().slice(0, 10);

function shell({ title, current, body }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title} — 七戸マップ評価</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+JP:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="static-preview.css" />
  <link rel="stylesheet" href="evaluation.css" />
</head>
<body>
  <p class="eval-banner">静的評価レポート — ${GENERATED} 生成 | npm run preview:evaluation</p>
  <div class="eval-page">
    <nav class="eval-nav" aria-label="評価ドキュメント">
      <a href="index.html">トップ</a>
      <a href="../maps/map-preview.html">ゲレンデマップ（静的）</a>
      <a href="courses-vs-map.html"${current === "ia" ? ' aria-current="page"' : ""}>IA 統合方針</a>
      <a href="qa-map-evaluation.html"${current === "qa" ? ' aria-current="page"' : ""}>QA 評価（層 A–C）</a>
    </nav>
    ${body}
  </div>
</body>
</html>`;
}

function badge(kind, text) {
  return `<span class="badge badge-${kind}">${text}</span>`;
}

const coursesVsMap = shell({
  title: "IA 統合方針",
  current: "ia",
  body: `
    <h1>LAAX 型 — マップ1画面に統合</h1>
    <p class="eval-lead">
      2026-06-09 ユーザー監査により、G5 の「コースガイド / ゲレンデマップ」<strong>2ページ分離は撤回</strong>しました。
      LAAX と同様、運行・コース情報は <code>/map</code> のみです。
    </p>

    <div class="compare-grid">
      <article class="compare-card">
        <p class="role">正 · 1画面</p>
        <h3>ゲレンデマップ <code>/map</code></h3>
        <ul>
          <li>全画面 <code>MapPageShell</code> + <code>LiftMapViewer</code></li>
          <li>リスト選択 → <code>MapFeatureDetail</code>（距離・斜度は <code>meta</code>）</li>
          <li>SSE / 検索 / 難易度フィルタ</li>
        </ul>
        <div class="links">
          <a class="btn-link btn-link-primary" href="http://localhost:3000/map">本番 dev で開く</a>
          <a class="btn-link" href="../maps/map-preview.html">静的マップ</a>
        </div>
      </article>
      <article class="compare-card">
        <p class="role">廃止</p>
        <h3><code>/courses</code></h3>
        <p>恒久リダイレクト → <code>/map</code>。静的 <code>courses.html</code> も同様。</p>
        <p>G5 の PARTIAL/PASS 判定は<strong>採用しない</strong>（実 UI が要件を満たさなかったため）。</p>
      </article>
    </div>

    <section class="eval-section">
      <h2>IA 評価（§F 更新）</h2>
      <table class="eval-table">
        <thead><tr><th>時点</th><th>判定</th><th>メモ</th></tr></thead>
        <tbody>
          <tr><td>G5 2ページ IA</td><td>${badge("fail", "FAIL · 撤回")}</td><td>LAAX と乖離。ユーザー全面否定</td></tr>
          <tr><td>統合後</td><td>${badge("partial", "再監査待ち")}</td><td>map-preview UI 刷新 + ナビ1本化</td></tr>
        </tbody>
      </table>
      <p class="eval-lead" style="margin-top:1rem;font-size:0.8125rem">
        詳細: <code>docs/qa_report_map.md</code> §F
      </p>
    </section>
  `,
});

const qaMap = shell({
  title: "QA マップ評価",
  current: "qa",
  body: `
    <h1>マップ QA 評価サマリー</h1>
    <p class="eval-lead">
      <code>docs/qa_report_map.md</code> の要約。三層モデルで LAAX との差を分けて見ます。
      ベンチマーク: <a href="https://www.laax.com/map" target="_blank" rel="noopener">laax.com/map</a>
    </p>

    <section class="eval-section">
      <h2>総合</h2>
      <table class="eval-table">
        <thead><tr><th>層</th><th>内容</th><th>判定</th></tr></thead>
        <tbody>
          <tr><td><strong>A</strong></td><td>UX R1–R6（map-ux-evaluator）</td><td>${badge("pass", "PASS")} G5 後</td></tr>
          <tr><td><strong>A</strong></td><td>操作 I1–I5（map-interaction-evaluator）</td><td>${badge("pass", "PASS")}</td></tr>
          <tr><td><strong>B</strong></td><td>LAAX ギャップ L1–L5（七戸スケール）</td><td>${badge("pass", "5/5 PASS")}</td></tr>
          <tr><td><strong>C</strong></td><td>LAAX 本家並置 P0–P6（§E）</td><td>${badge("fail", "0/6")}</td></tr>
          <tr><td><strong>F</strong></td><td>コース vs マップ IA</td><td>${badge("partial", "PARTIAL")}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="eval-section">
      <h2>層 B — L1–L5（七戸スケール）</h2>
      <table class="eval-table">
        <thead><tr><th>ID</th><th>軸</th><th>判定</th><th>根拠</th></tr></thead>
        <tbody>
          <tr><td>L1</td><td>地形表現</td><td>${badge("pass", "PASS")}</td><td>3D風2D焼き込みイラスト（WebGL不要）</td></tr>
          <tr><td>L2</td><td>コース網羅</td><td>${badge("pass", "PASS")}</td><td>リフト2 + コース5、ヒットボックス選択可</td></tr>
          <tr><td>L3</td><td>ライブ感</td><td>${badge("pass", "PASS")}</td><td>SSE 3s + poll fallback + admin</td></tr>
          <tr><td>L4</td><td>探索 UX</td><td>${badge("pass", "PASS")}</td><td>検索・凡例・フィルタ・GPS距離</td></tr>
          <tr><td>L5</td><td>ビジュアル</td><td>${badge("pass", "PASS")}</td><td>トークン・i18n 統一</td></tr>
        </tbody>
      </table>
      <div class="callout"><strong>注意:</strong> 層 B の「LAAX級」≠ laax.com と同等。機能充足の内部ラベルです。</div>
    </section>

    <section class="eval-section">
      <h2>層 C — LAAX 本家並置（§E）</h2>
      <table class="eval-table">
        <thead><tr><th>ID</th><th>質問</th><th>判定</th></tr></thead>
        <tbody>
          <tr><td>P0</td><td>地図が viewport ≥80%</td><td>${badge("fail", "FAIL")}</td></tr>
          <tr><td>P1</td><td>マップ専用シェル</td><td>${badge("partial", "PARTIAL")} MapPageShell 実装済・本家比は未達</td></tr>
          <tr><td>P2</td><td>scale=1 でも連続パン</td><td>${badge("fail", "FAIL")}</td></tr>
          <tr><td>P3</td><td>選択の主戦場は地図</td><td>${badge("fail", "FAIL")}</td></tr>
          <tr><td>P4</td><td>ライブが線色で一目</td><td>${badge("fail", "FAIL")}</td></tr>
          <tr><td>P5</td><td>初見30秒で理解</td><td>${badge("fail", "FAIL")}</td></tr>
          <tr><td>P6</td><td>並置 screencast 記録</td><td>${badge("fail", "FAIL")}</td></tr>
        </tbody>
      </table>
    </section>

    <section class="eval-section">
      <h2>層 A — R1–R6（G5 後）</h2>
      <table class="eval-table">
        <thead><tr><th>ID</th><th>結果</th><th>要点</th></tr></thead>
        <tbody>
          <tr><td>R1</td><td>${badge("pass", "PASS")}</td><td>運行リストは stage 外サイドバー</td></tr>
          <tr><td>R2</td><td>${badge("pass", "PASS")}</td><td>P0 地図優先の階層</td></tr>
          <tr><td>R3</td><td>${badge("pass", "PASS")}</td><td>モバイル FAB・preview も FAB 化</td></tr>
          <tr><td>R4</td><td>${badge("pass", "PASS")}</td><td>map-preview flex、#sheet なし</td></tr>
          <tr><td>R5</td><td>${badge("pass", "PASS")}</td><td>キーボード・aria-pressed</td></tr>
          <tr><td>R6</td><td>${badge("pass", "PASS")}</td><td>cover fit、MIN_SCALE=1</td></tr>
        </tbody>
      </table>
    </section>

    <section class="eval-section">
      <h2>G5 実装（2026-06-09）</h2>
      <ul style="color:var(--slate);font-size:0.875rem;line-height:1.8">
        <li><code>map-cover-dimensions.ts</code> + HeroMapCanvas cover</li>
        <li><code>MapPageShell</code> / <code>MapTopBar</code></li>
        <li><code>build-map-preview.mjs</code> parity</li>
        <li>IA: ナビ・コピー・双方向導線</li>
      </ul>
    </section>
  `,
});

function writePair(name, html) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.mkdirSync(DOCS_OUT, { recursive: true });
  const publicPath = path.join(OUT, name);
  fs.writeFileSync(publicPath, html, "utf8");
  const docsHtml = html
    .replace(/href="static-preview.css"/g, 'href="../../public/preview/static-preview.css"')
    .replace(/href="evaluation.css"/g, 'href="../../public/preview/evaluation.css"')
    .replace(/href="index.html"/g, 'href="../../public/preview/index.html"')
    .replace(/href="courses.html"/g, 'href="../../public/preview/courses.html"')
    .replace(/href="courses-vs-map.html"/g, 'href="../../public/preview/courses-vs-map.html"')
    .replace(/href="qa-map-evaluation.html"/g, 'href="../../public/preview/qa-map-evaluation.html"')
    .replace(/href="\.\.\/maps\//g, 'href="../../public/maps/');
  fs.writeFileSync(path.join(DOCS_OUT, name), docsHtml, "utf8");
  console.log("  public/preview/" + name);
  console.log("  docs/preview/" + name);
}

writePair("courses-vs-map.html", coursesVsMap);
writePair("qa-map-evaluation.html", qaMap);

console.log("build-evaluation-html: done");
console.log("  open: npm run preview:static");
console.log("  → http://localhost:5500/preview/courses-vs-map.html");
console.log("  → http://localhost:5500/preview/qa-map-evaluation.html");
