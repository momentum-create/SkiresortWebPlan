# Visual QA Report — `resort-visual-evaluator` (L3)

**Date:** 2026-06-14  
**Scope:** Biei LP mock — `nearby-food.html` embedded area map (Leaflet Plan A) + custom marker icons  
**Files reviewed:** `docs/mock-assets/biei-lp/nearby-food.html`, `docs/mock-assets/biei-lp/mock.css` (map-embed block), `docs/mock-assets/_shared/area-map.js`, `docs/mock-assets/_shared/area-map.css`, `docs/mock-assets/_shared/icons/marker-icons.json`, `docs/mock-assets/_shared/icons/*.png`  
**Out of scope:** Root template `src/`, `resorts/Sichinohe-CyoueiSki/web/` map fleet

---

## Verdict

**PASS**

---

## Rubric

| ID | Result | Evidence |
|----|--------|----------|
| **V1** Typography hierarchy | **PASS** | Parent page (`nearby-food.html` § `#food-map`): clear stack — `.eyebrow` (Syne 0.625rem, uppercase) → `.heading-lg` (`clamp(1.75rem, 5vw, 2.75rem)`) → `.lead` (`clamp(0.9375rem, 2.5vw, 1.125rem)`). Layer toggles reuse Syne at 0.6875rem (`mock.css` L993–1010). Food list uses editorial ladder: `.food-spot__tag` → `.food-spot__title` (1.125rem) → `.food-spot__lead` — not BBS flat `text-sm` repetition. Full `area-map.html` rail (non-embed) uses smaller utility scale (`area-rail-title` 0.875rem, list title 0.8125rem) appropriate to sidebar; embed iframe shows map + pin tooltips only (0.6875rem, `area-map.css` L112–118). Japanese hero uses `line-break: strict; word-break: keep-all` on `.hero-title` (mock.css L233–234). |
| **V2** Spacing rhythm | **PASS** | Section rhythm via `--section: clamp(5rem, 14vw, 9rem)` (mock.css L11, L65) — aligns with 8px grid and Alpine Clarity+ vertical breathing room. Map block: toggles `margin-top: 2rem`, `gap: 0.5rem` (8px); `.map-embed` `margin-top: 1rem`, `border-radius: 0.75rem`, `min-height: 50dvh` (L977–991). CTA row `margin-top: 1.5rem`, `gap: 0.75rem` (nearby-food.html L96). Embed fit padding `[24, 24]` px (`area-map.js` L241). Minor: inline `style="margin-top:1rem"` on leads (nearby-food.html L74–75) duplicates tokenized spacing — not a grid break. |
| **V3** Photo / visual assets | **PASS** | Leaflet Plan A uses custom Mapular PNG pins via `marker-icons.json` — not default Leaflet blue markers (`area-map.js` L175–198, manifest L6–48). Category differentiation: food `#5a6f85`, onsen `#7ec8e3`, transit `#2f8f8f`, ski `#5e6f8a`, blue-pond `#4588b5` (manifest + PNG review). Ski anchor renders at 40px vs 32px peers; active selection scales to 48px (`area-map.js` L181–185). Hero on page uses resort mock `lp-mock-biei-recovery.png` with `.hero-overlay` gradient (nearby-food.html L36–44; mock.css L209–218) — not generic Unsplash placeholder. OSM raster tiles are acceptable base layer for area mock. |
| **V4** Micro-interactions | **PASS** | Layer toggles: explicit `transition` + `--ease: cubic-bezier(0.22, 1, 0.36, 1)` (mock.css L13, L1012–1017) — matches `final_requirements.md` motion easing. Active pin: `area-pin--active` drop-shadow + 32→48px icon swap (`area-map.css` L104–110; `area-map.js` L257–265). Buttons: `.btn-primary:hover` `translateY(-1px)` + shadow (mock.css L178–181). `prefers-reduced-motion` partially implemented (mock.css L1118–1121: scroll + `.btn` only); pin/toggle transitions omit reduced-motion — **non-blocking** for mock static HTML (no Framer reveal). Iframe layer sync reloads `src` (`map-embed-layers.js` L38–39) — functional, may flash; acceptable for mock embed. |
| **V5** Brand consistency | **PASS** | Light Alpine Clarity+ baseline: `--bg: #fafbfc`, `--fg: #1a2332`, `--accent: #5a6f85` (mock.css L3–8) mirrors mock area map `--area-accent: #5a6f85` (`area-map.css` L3–9). Food marker color matches `--accent` (manifest L9). No emoji as UI icons in map chrome; `↗` is typographic suffix only (`mock.css` L957–960; `area-map.js` L336). Pressed layer pill uses `--fg` fill (mock.css L1020–1024) — consistent with `.btn-primary`. Embed hides dark chrome (`area-map-page--embed .area-topbar`, `.area-rail` display none — `area-map.css` L46, L178). |
| **V6** Benchmark alignment | **PASS** | Identifiable Alpine Clarity+ / LAAX-adjacent patterns: (1) multi-layer map filter UX — food / onsen / anchor toggles with simultaneous layers (`nearby-food.html` L78–84; Plan A bounds profiles in `area-map.js` L201–207); (2) Syne display on eyebrows + map filters; (3) IBM Plex Mono on numbered `.food-spot__num` / `.area-list-item__num`; (4) editorial numbered list vs uniform card grid; (5) custom resort pins (Niseko “real asset” principle) vs stock map markers. |

---

## Blockers

None. All mandatory items (V1, V5) pass.

---

## Non-blocking findings

1. **Reduced-motion gap:** Add `@media (prefers-reduced-motion: reduce)` rules for `.area-pin`, `.map-layer-btn`, and `.path-tile` transitions before production port to `src/`.
2. **Inline spacing:** Replace inline `margin-top` / `max-width` on map-section leads with utility classes for V2 consistency.
3. **Iframe reload flash:** Layer toggle rebuilds iframe `src` — consider `postMessage` layer sync if ported to Next embed without full reload.
4. **PNG transparency QA:** Verify 32/48px exports on live OSM tiles under both light map and `#e8edf2` embed chrome (manifest notes baked circle+glyph; black matte in asset previews is likely alpha, not a halo defect).

---

## Re-occurrence prevention

Mock map UI must keep **one accent source of truth** — `marker-icons.json` `color` fields must match CSS `--accent` / `--area-accent` when adding categories.

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → root template UI shippable
```

**Note:** This report covers **Biei LP mock assets** only. Root `src/` template requires a separate evaluation pass before monorepo UI ship.
