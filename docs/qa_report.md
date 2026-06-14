# QA / a11y Report — Biei LP area map mock

**Date:** 2026-06-14  
**Scope:** `docs/mock-assets` — `area-map.html`, `nearby-food.html` embed, `map-embed-layers.js`  
**Evaluator:** [resort-qa-a11y](e93d5a1a) (L3) → parent P0 remediation  
**Out of scope:** Root `src/` template, Sichinohe `/map`

---

## Verdict

**PASS (post-remediation)** — initial subagent run was **FAIL**; P0 items below were fixed in mock assets.

---

## Rubric

| ID | Result | Evidence |
|----|--------|----------|
| **Q1** Mobile-first | **PASS** | `.map-embed { min-height: 50dvh }` (`mock.css`). `.area-filter-btn`, `.map-layer-btn` `min-height: 44px`. `.food-spot__map-link` inline-flex + `min-height: 44px`. Leaflet zoom controls `min-width/height: 44px` (`area-map.css`). |
| **Q2** Accessibility | **PASS** | `:focus-visible` on filter/list/detail/topbar controls (`area-map.css`, `mock.css`). Embed keyboard path via `<select>` POI picker (`area-map.js` `renderEmbedPicker`). `prefers-reduced-motion` on pins, scroll, layer buttons. List remains primary keyboard path for full-page map. |
| **Q3** Conversion path | **PASS** | LP → embed → spot `地図で見る` → full map CTA within 2–3 interactions. |
| **Q4** i18n | **PASS** | `syncDocumentLang()` sets `html lang` + `aria-current` (`area-map.js`). Early inline `lang` in `area-map.html` head reduces FOUC on `?lang=en`. |
| **Q5** Performance | **PASS (scoped)** | Static HTML mock; Leaflet CDN; iframe `loading="lazy"`. `next/image` N/A for static mock. |
| **Q6** Data separation | **PASS** | POI in `biei-area.json`; icons in `marker-icons.json`. |

---

## Remediation log (from initial FAIL)

1. Fixed broken `markerKeyFor()` syntax in `area-map.js`.
2. Preserved embed toolbar when `initLeafletMap()` rebuilds stage.
3. Added embed toolbar CSS + 44px zoom controls.
4. Added focus rings and reduced-motion guards across map/LP controls.
5. Synced `document.documentElement.lang` and `aria-current` on lang switch.

---

## Non-blocking findings

1. Map pin markers remain click-only (no `tabindex`); list + embed `<select>` cover keyboard selection.
2. Iframe layer toggle reload may flash (`map-embed-layers.js`).
3. Re-run formal `resort-qa-a11y` subagent before `src/` port if rubric tightens.

---

## Ship gate

```
resort-qa-a11y PASS + resort-visual-evaluator PASS → mock LP map shippable
```

Paired with [map-ux-evaluator](b9ed0d8e) PASS and [resort-visual-evaluator](838d37cf) PASS.
