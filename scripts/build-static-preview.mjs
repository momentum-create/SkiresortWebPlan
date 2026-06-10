/**
 * 静的サイトプレビューを messages/ja.json から再生成する。
 * 出力:
 *   public/preview/index.html
 *   public/preview/courses.html
 *   docs/preview/alpine-clarity-v2.html（設計用・パス差し替え）
 *
 * 用法: node scripts/build-static-preview.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const MESSAGES = JSON.parse(
  fs.readFileSync(path.join(ROOT, "messages/ja.json"), "utf8"),
);

const LIVE = {
  snowDepthCm: 128,
  weatherKey: "sunny",
  temperatureC: -4,
  liftsOpen: 5,
  liftsTotal: 6,
  updatedLabel: "2/7 8:30",
};

const TICKET_PRICES = { day: 5200, early: 4200, season: 68000 };
const NEWS = [
  { id: "1", date: "2026-02-05", categoryKey: "notice" },
  { id: "2", date: "2026-02-01", categoryKey: "event" },
  { id: "3", date: "2026-01-28", categoryKey: "snow" },
];

const COURSE_IDS = [
  "champion",
  "upper",
  "intermediate",
  "forest",
  "pony",
];

const BENTO_GRADIENTS = {
  courses: "linear-gradient(135deg,#2d6b7a,#e8f3f0)",
  lessons: "linear-gradient(160deg,#5a6578,#dce8ee)",
  stay: "linear-gradient(160deg,#b8862b,#f7f9fb)",
  events: "linear-gradient(160deg,#2d5a4a,#8ecae6)",
};

const PATH_PROFILES = {
  public: {
    css: "static-preview.css",
    home: "index.html",
    courses: "courses.html",
    heroImg: "../images/hero-sichinohe.png",
    map: "../maps/map-preview.html",
    banner:
      "静的プレビュー — messages/ja.json から生成 | npm run preview:site",
  },
  docs: {
    css: "../../public/preview/static-preview.css",
    home: "alpine-clarity-v2.html",
    courses: "../../public/preview/courses.html",
    heroImg: "../../public/images/hero-sichinohe.png",
    map: "../../public/maps/map-preview.html",
    banner:
      "設計プレビュー — public/preview と同期 | npm run preview:site",
  },
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function formatYen(amount) {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

function head({ title, paths }) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${esc(title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500;600&family=Noto+Sans+JP:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${paths.css}" />
</head>`;
}

function revealScript() {
  return `<script>
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); }
        });
      }, { rootMargin: "-40px" });
      document.querySelectorAll(".reveal").forEach(function (el) { obs.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("visible"); });
    }
  </script>`;
}

function header({ paths, current }) {
  const nav = MESSAGES.nav;
  const items = [
    { href: paths.map, label: nav.map, key: "map" },
    { href: `${paths.home}#tickets`, label: nav.tickets, key: "tickets" },
    { href: `${paths.home}#access`, label: nav.access, key: "access" },
  ];

  return `<header class="header">
    <div class="container header-inner">
      <a href="${paths.home}" class="logo font-display">${esc(MESSAGES.meta.siteName)}</a>
      <nav aria-label="${esc(nav.main)}">
        <ul class="nav-desktop">
          ${items
            .map(
              (item) =>
                `<li><a href="${item.href}"${current === item.key ? ' aria-current="page"' : ""}>${esc(item.label)}</a></li>`,
            )
            .join("\n          ")}
        </ul>
      </nav>
      <button type="button" class="lang-btn" aria-label="${esc(MESSAGES.lang.switch)}">${esc(MESSAGES.lang.ja)}</button>
    </div>
  </header>`;
}

function bottomNav({ paths, current }) {
  const nav = MESSAGES.nav;
  const items = [
    {
      href: paths.home,
      label: nav.home,
      key: "home",
      icon: '<path d="M3 10.5L10 4l7 6.5V18a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1v-7.5z" stroke="currentColor" stroke-width="1.4" fill="currentColor" fill-opacity=".15"/>',
    },
    {
      href: paths.map,
      label: nav.map,
      key: "map",
      icon: '<path d="M4 6l6-3 6 3v12l-6 3-6-3V6z" stroke="currentColor" stroke-width="1.4"/>',
    },
    {
      href: `${paths.home}#tickets`,
      label: nav.ticket,
      key: "ticket",
      icon: '<path d="M4 8h12v2H4V8zm0 4h12v2H4v-2z" stroke="currentColor" stroke-width="1.4"/>',
    },
    {
      href: `${paths.home}#access`,
      label: nav.access,
      key: "access",
      icon: '<path d="M10 2C6.7 2 4 4.7 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z" stroke="currentColor" stroke-width="1.4"/>',
    },
  ];

  return `<nav class="bottom-nav" aria-label="${esc(MESSAGES.a11y.bottomNav)}">
    <ul>
      ${items
        .map(
          (item) =>
            `<li>
        <a href="${item.href}" class="${current === item.key ? "active" : ""}">
          <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">${item.icon}</svg>
          ${esc(item.label)}
        </a>
      </li>`,
        )
        .join("\n      ")}
    </ul>
  </nav>`;
}

function footer({ paths }) {
  return `<footer class="footer">
    <div class="container">
      <p style="margin-bottom:0.75rem;font-size:0.8125rem">
        <a href="${paths.map}" style="color:var(--alpine);font-weight:500">ゲレンデマップ</a>
        ·
        <a href="qa-map-evaluation.html" style="color:var(--alpine);font-weight:500">QA評価レポート（HTML）</a>
      </p>
      <p>${esc(MESSAGES.meta.copyright)}</p>
    </div>
  </footer>`;
}

function renderIndex(paths) {
  const m = MESSAGES;
  const explore = m.explore.items;
  const weather =
    m.liveStatus.weatherValues[LIVE.weatherKey] ?? LIVE.weatherKey;

  const bentoCards = [
    {
      id: "courses",
      href: paths.map,
      feature: true,
      badge: explore.courses.badge,
      title: explore.courses.title,
      description: explore.courses.description,
    },
    {
      id: "lessons",
      href: "#",
      title: explore.lessons.title,
      description: explore.lessons.description,
    },
    {
      id: "stay",
      href: "#",
      badge: explore.stay.badge,
      title: explore.stay.title,
      description: explore.stay.description,
    },
    {
      id: "events",
      href: "#",
      title: explore.events.title,
      description: explore.events.description,
    },
  ];

  const tickets = ["day", "early", "season"].map((id) => {
    const plan = m.tickets.plans[id];
    return {
      id,
      highlighted: id === "early",
      badge: id === "early" ? m.tickets.badges.popular : null,
      name: plan.name,
      price: TICKET_PRICES[id],
      description: plan.description,
      features: plan.features.slice(0, 2),
    };
  });

  return `${head({ title: `${m.meta.siteName} — Alpine Clarity+ v2 プレビュー`, paths })}
<body>
  <p class="preview-banner">${esc(paths.banner)}</p>
  <a class="skip-link" href="#main-content">${esc(m.a11y.skipToContent)}</a>
  ${header({ paths, current: "home" })}

  <main id="main-content">
    <section class="hero" aria-label="ヒーロー">
      <div class="hero-media" aria-hidden="true">
        <img src="${paths.heroImg}" width="1920" height="1280" alt="${esc(m.hero.imageAlt)}" />
      </div>
      <div class="hero-gradient" aria-hidden="true"></div>
      <div class="container hero-content">
        <p class="hero-tagline">${esc(m.meta.tagline)}</p>
        <h1 class="hero-title font-display hero-editorial">
          <span class="hero-line">${esc(m.hero.overlayLine1)}</span>
          <span class="hero-line">${esc(m.hero.overlayLine2)}</span>
        </h1>
        <p class="hero-desc hero-editorial">
          <span class="hero-line">${esc(m.hero.descriptionLine1)}</span>
          <span class="hero-line">${esc(m.hero.descriptionLine2)}</span>
          <span class="hero-line">${esc(m.hero.descriptionLine3)}</span>
        </p>
      </div>
    </section>

    <section class="live-bar" aria-label="${esc(m.a11y.todayStatus)}">
      <div class="container">
        <div class="live-head">
          <div class="live-label-wrap">
            <span class="live-pulse" aria-hidden="true"></span>
            <span class="live-label">${esc(m.liveStatus.liveLabel)}</span>
          </div>
          <p class="live-updated">${esc(m.liveStatus.updated)}: ${esc(LIVE.updatedLabel)}</p>
        </div>
        <ul class="metrics">
          <li>
            <p class="metric-label">${esc(m.liveStatus.snow)}</p>
            <p class="metric-value font-mono">${LIVE.snowDepthCm}<span class="unit">cm</span></p>
          </li>
          <li>
            <p class="metric-label">${esc(m.liveStatus.weather)}</p>
            <p class="metric-value font-mono">${esc(weather)} <span class="temp">${LIVE.temperatureC}°C</span></p>
          </li>
          <li>
            <p class="metric-label">${esc(m.liveStatus.lifts)}</p>
            <p class="metric-value font-mono">${LIVE.liftsOpen}/${LIVE.liftsTotal} <span class="badge">${esc(m.liveStatus.operating)}</span></p>
          </li>
        </ul>
      </div>
    </section>

    <section class="cta-band" aria-label="主要アクション">
      <div class="container cta-grid">
        <a href="#tickets" class="btn btn-primary">${esc(m.cta.buyTickets)}</a>
        <a href="${paths.map}" class="btn btn-secondary">${esc(explore.courses.title)}</a>
      </div>
    </section>

    <section id="explore" class="section reveal">
      <div class="container">
        <p class="eyebrow">${esc(m.explore.eyebrow)}</p>
        <h2 class="section-title font-display">${esc(m.explore.title)}</h2>
        <p class="section-desc">${esc(m.explore.description)}</p>
        <ul class="bento">
          ${bentoCards
            .map((card) => {
              const badge = card.badge
                ? `<span class="badge badge-gold">${esc(card.badge)}</span>`
                : "";
              return `<li${card.feature ? ' class="feature"' : ""}>
            <a href="${card.href}" class="bento-card">
              <div class="bento-bg" style="background-image:${BENTO_GRADIENTS[card.id]}"></div>
              <div class="bento-overlay"></div>
              <div class="bento-text">
                ${badge}
                <h3>${esc(card.title)}</h3>
                <p>${esc(card.description)}</p>
              </div>
            </a>
          </li>`;
            })
            .join("\n          ")}
        </ul>
      </div>
    </section>

    <section id="tickets" class="section reveal" style="background:#fff">
      <div class="container">
        <p class="eyebrow">${esc(m.tickets.eyebrow)}</p>
        <h2 class="section-title font-display">${esc(m.tickets.title)}</h2>
        <p class="section-desc">${esc(m.tickets.description)}</p>
        <div class="tickets">
          ${tickets
            .map(
              (ticket) => `<article class="ticket${ticket.highlighted ? " highlight" : ""}">
            <h3>${esc(ticket.name)}${ticket.badge ? ` <span class="badge badge-gold">${esc(ticket.badge)}</span>` : ""}</h3>
            <p class="ticket-price font-mono">${formatYen(ticket.price)} <span>/ ${esc(m.tickets.unit)}</span></p>
            <p style="margin:.5rem 0 0;font-size:.875rem;color:var(--slate)">${esc(ticket.description)}</p>
            <ul>${ticket.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul>
          </article>`,
            )
            .join("\n          ")}
        </div>
      </div>
    </section>

    <section id="news" class="section reveal">
      <div class="container">
        <p class="eyebrow">${esc(m.news.eyebrow)}</p>
        <h2 class="section-title font-display">${esc(m.news.title)}</h2>
        <ul class="news-list">
          ${NEWS.map(
            (item) => `<li class="news-item">
            <time class="news-date" datetime="${item.date}">${item.date}</time>
            <span class="news-cat">${esc(m.news.categories[item.categoryKey])}</span>
            <a href="#" class="news-title">${esc(m.news.items[item.id].title)}</a>
          </li>`,
          ).join("\n          ")}
        </ul>
      </div>
    </section>

    <section id="access" class="section reveal" style="background:#fff">
      <div class="container">
        <p class="eyebrow">${esc(m.access.eyebrow)}</p>
        <h2 class="section-title font-display">${esc(m.access.title)}</h2>
        <p class="section-desc">${esc(m.access.transit)}</p>
        <div class="access-grid">
          <div>
            <p style="font-size:.75rem;font-weight:600;color:var(--slate);text-transform:uppercase">${esc(m.access.addressLabel)}</p>
            <p style="margin:.25rem 0 1rem">${esc(m.access.address)}</p>
            <p style="font-size:.75rem;font-weight:600;color:var(--slate);text-transform:uppercase">${esc(m.access.hoursLabel)}</p>
            <p style="margin:.25rem 0 0">${esc(m.access.hours)}</p>
          </div>
          <div class="access-map">
            ${esc(m.access.mapPreview)}
            <a href="${paths.map}" class="btn btn-secondary" style="margin-top:.75rem;display:inline-flex">${esc(explore.courses.title)}</a>
          </div>
        </div>
      </div>
    </section>
  </main>

  ${footer({ paths })}
  ${bottomNav({ paths, current: "home" })}
  ${revealScript()}
</body>
</html>
`;
}

/** LAAX 型: /courses は廃止。静的も map-preview へリダイレクト */
function renderCoursesRedirect(paths) {
  return `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta http-equiv="refresh" content="0;url=${paths.map}" />
  <link rel="canonical" href="${paths.map}" />
  <title>ゲレンデマップへ移動 — ${esc(MESSAGES.meta.siteName)}</title>
  <script>location.replace("${paths.map}");</script>
</head>
<body>
  <p><a href="${paths.map}">ゲレンデマップへ</a>（コース情報はマップ内で確認できます）</p>
</body>
</html>
`;
}

const outPublic = path.join(ROOT, "public/preview");
const outDocs = path.join(ROOT, "docs/preview");

fs.mkdirSync(outPublic, { recursive: true });
fs.mkdirSync(outDocs, { recursive: true });

const indexPublic = renderIndex(PATH_PROFILES.public);
const coursesPublic = renderCoursesRedirect(PATH_PROFILES.public);
const indexDocs = renderIndex(PATH_PROFILES.docs);

fs.writeFileSync(path.join(outPublic, "index.html"), indexPublic, "utf8");
fs.writeFileSync(path.join(outPublic, "courses.html"), coursesPublic, "utf8");
const indexDocsFixed = indexDocs
  .replace(/href="courses-vs-map\.html"/g, 'href="../../public/preview/courses-vs-map.html"')
  .replace(/href="qa-map-evaluation\.html"/g, 'href="../../public/preview/qa-map-evaluation.html"');
fs.writeFileSync(path.join(outDocs, "alpine-clarity-v2.html"), indexDocsFixed, "utf8");

console.log("build-static-preview: wrote");
console.log("  public/preview/index.html");
console.log("  public/preview/courses.html");
console.log("  docs/preview/alpine-clarity-v2.html");
console.log("  open: npm run preview:static → http://localhost:5500/preview/");
