/**
 * Biei area map — Leaflet POI map (Plan A: ski-centric cluster + custom pins).
 */
(function () {
  const STORAGE_KEY = "mock-lp-locale";
  const params = new URLSearchParams(location.search);
  const resortId = params.get("resort") || "biei";
  const embed = params.get("embed") === "1";
  const locale = params.get("lang") || localStorage.getItem(STORAGE_KEY) || "ja";
  const ICON_BASE = "_shared/icons/";

  const LAYER_KEYS = ["food", "onsen", "anchor"];

  const UI = {
    ja: {
      backHub: "← 索引",
      backLp: "← LPに戻る",
      title: "周辺マップ",
      lead: "町民スキー場を起点に、周辺の飲食・温泉・拠点を重ねて回遊を設計",
      filterAll: "全表示",
      filterFood: "飲食",
      filterOnsen: "温泉",
      filterAnchor: "拠点",
      filterHint: "飲食と温泉は同時表示できます。温泉のみのときは白金方面に切り替わります",
      mapHint: "ピンをタップするかリストから選ぶとハイライトされます",
      detailPick: "リストまたは地図のピンからスポットを選んでください",
      openMaps: "Google Mapで開く",
      readGuide: "特集を読む",
      spotCount: "{n}件",
      category: {
        anchor: "拠点",
        dairy: "乳製品",
        wagyu: "和牛",
        bakery: "パン・菓子",
        western: "洋食",
        burger: "バーガー",
        cafe: "カフェ",
        "fine-dining": "フレンチ",
        ramen: "ラーメン",
        "onsen-hotel": "温泉ホテル",
        "onsen-day": "日帰り温泉",
        "onsen-ryokan": "高級旅館",
        "onsen-public": "公衆浴場",
        "onsen-mountain": "山の温泉",
        "onsen-sauna": "サウナ",
        "onsen-roten": "野湯・露天",
        ski: "スキー場",
        transit: "駅",
        view: "絶景",
      },
      loadError: "マップデータを読み込めませんでした。",
      needHttp:
        "file:// では動きません。npx serve docs/mock-assets -p 3456 を実行してください。",
      leafletError: "地図ライブラリを読み込めませんでした。",
    },
    en: {
      backHub: "← Index",
      backLp: "← Back to guide",
      title: "Area map",
      lead: "Layer food, onsen, and hubs around Biei Town Ski Area",
      filterAll: "Show all",
      filterFood: "Food",
      filterOnsen: "Onsen",
      filterAnchor: "Hubs",
      filterHint: "Food and onsen can overlap. Onsen-only snaps to Shirogane area",
      mapHint: "Tap a pin or pick from the list to highlight a spot",
      detailPick: "Select a spot from the list or map pins",
      openMaps: "Open in Google Maps",
      readGuide: "Read guide",
      spotCount: "{n} spots",
      category: {
        anchor: "Hub",
        dairy: "Dairy",
        wagyu: "Wagyu",
        bakery: "Bakery",
        western: "Western",
        burger: "Burger",
        cafe: "Café",
        "fine-dining": "French",
        ramen: "Ramen",
        "onsen-hotel": "Onsen hotel",
        "onsen-day": "Day bath",
        "onsen-ryokan": "Ryokan",
        "onsen-public": "Public bath",
        "onsen-mountain": "Mountain onsen",
        "onsen-sauna": "Sauna",
        "onsen-roten": "Wild roten",
        ski: "Ski area",
        transit: "Station",
        view: "View",
      },
      loadError: "Could not load map data.",
      needHttp: "Run npx serve docs/mock-assets -p 3456 (file:// will not work).",
      leafletError: "Could not load the map library.",
    },
  };

  function t(key, vars) {
    const parts = key.split(".");
    let val = UI[locale] || UI.ja;
    for (const p of parts) val = val?.[p];
    let out = val ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        out = out.replace(`{${k}}`, String(v));
      }
    }
    return out;
  }

  function pick(obj) {
    if (!obj) return "";
    return obj[locale] || obj.ja || obj.en || "";
  }

  function googleMapsUrl(query) {
    return (
      "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(query)
    );
  }

  function parseLayers() {
    const raw = params.get("layers");
    if (!raw) return new Set(LAYER_KEYS);
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const valid = parts.filter((p) => LAYER_KEYS.includes(p));
    return valid.length ? new Set(valid) : new Set(LAYER_KEYS);
  }

  let mapData = null;
  let markerManifest = null;
  let leafletMap = null;
  let markerLayer = null;
  const markerById = new Map();
  let selectedId = null;
  let activeLayers = parseLayers();
  let skipNextMoveEnd = false;

  const el = {
    stage: document.getElementById("area-stage"),
    list: document.getElementById("area-list"),
    detail: document.getElementById("area-detail"),
    embedToolbar: null,
    embedFilters: null,
    embedPicker: null,
    title: document.getElementById("area-rail-title"),
    lead: document.getElementById("area-rail-lead"),
    resortName: document.getElementById("area-resort-name"),
    backLink: document.getElementById("area-back-link"),
    hubLink: document.getElementById("area-hub-link"),
    filters: document.getElementById("area-filters"),
    filterHint: document.getElementById("area-filter-hint"),
    disclaimer: document.getElementById("area-disclaimer"),
  };

  function allFeatures() {
    const anchors = (mapData.anchors || []).map((f) => ({ ...f, group: "anchor" }));
    const food = (mapData.food || mapData.pois || []).map((f) => ({
      ...f,
      group: f.group || "food",
    }));
    const onsen = (mapData.onsen || []).map((f) => ({ ...f, group: "onsen" }));
    return [...anchors, ...food, ...onsen];
  }

  function filteredFeatures() {
    return allFeatures().filter((f) => activeLayers.has(f.group));
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function syncDocumentLang() {
    document.documentElement.lang = locale === "en" ? "en" : "ja";
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      const on = btn.dataset.langSwitch === locale;
      btn.setAttribute("aria-pressed", on ? "true" : "false");
      btn.setAttribute("aria-current", on ? "true" : "false");
    });
  }

  function scrollBehavior() {
    return prefersReducedMotion() ? "auto" : "smooth";
  }

  function markerKeyFor(feature) {
    if (!markerManifest) return feature.group === "food" ? "food" : feature.group;
    const mapping = markerManifest.bieiAreaMapping || {};
    if (feature.group === "food") return mapping.food || "food";
    if (feature.group === "onsen") return mapping.onsen || "onsen";
    return mapping[`anchor.${feature.id}`] || "food";
  }

  function iconPath(key, size) {
    const files = markerManifest?.markers?.[key]?.files;
    const file = files?.[size] || files?.["32"];
    return file ? `${ICON_BASE}${file}` : null;
  }

  function markerSize(feature, active) {
    if (active) return 48;
    if (feature.id === "ski") return 40;
    return 32;
  }

  function makeIcon(feature, active) {
    const size = markerSize(feature, active);
    const key = markerKeyFor(feature);
    const assetSize = size >= 48 || (feature.id === "ski" && !active) ? "48" : "32";
    const url = iconPath(key, assetSize);
    if (!url || !window.L) return null;
    return window.L.icon({
      iconUrl: url,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      className: active ? "area-pin area-pin--active" : "area-pin",
    });
  }

  function resolveBoundsProfile() {
    const hasFood = activeLayers.has("food");
    const hasOnsen = activeLayers.has("onsen");
    const hasAnchor = activeLayers.has("anchor");
    if (hasOnsen && !hasFood && !hasAnchor) return "onsen";
    if (hasAnchor && !hasFood && !hasOnsen) return "anchorAll";
    return "skiFood";
  }

  function featuresForBounds(profile) {
    const cfg = mapData.boundsProfiles?.[profile];
    const visible = filteredFeatures();
    if (!cfg) return visible;
    return visible.filter((f) => {
      if (cfg.includeGroups && !cfg.includeGroups.includes(f.group)) return false;
      if (cfg.excludeFoodIds && f.group === "food" && cfg.excludeFoodIds.includes(f.id)) {
        return false;
      }
      if (cfg.excludeAnchorIds && f.group === "anchor" && cfg.excludeAnchorIds.includes(f.id)) {
        return false;
      }
      if (cfg.includeAnchorIds && f.group === "anchor" && !cfg.includeAnchorIds.includes(f.id)) {
        return false;
      }
      return true;
    });
  }

  function fitMapToProfile(animate) {
    if (!leafletMap) return;
    const profile = resolveBoundsProfile();
    const feats = featuresForBounds(profile);
    const cfg = mapData.boundsProfiles?.[profile];
    if (!feats.length) {
      const c = mapData.center || [43.5897, 142.4449];
      skipNextMoveEnd = true;
      leafletMap.setView(c, cfg?.maxZoom || 12, { animate: !!animate });
      return;
    }
    const bounds = window.L.latLngBounds(feats.map((f) => [f.lat, f.lon]));
    const pad = embed ? [24, 24] : [40, 40];
    skipNextMoveEnd = true;
    leafletMap.fitBounds(bounds, {
      padding: pad,
      maxZoom: cfg?.maxZoom ?? 13,
      animate: !!animate,
    });
  }

  function panToFeature(feature) {
    if (!leafletMap || !feature) return;
    skipNextMoveEnd = true;
    leafletMap.setView([feature.lat, feature.lon], 14, { animate: !prefersReducedMotion() });
    syncMarkerStyles();
  }

  function syncMarkerStyles() {
    markerById.forEach((marker, id) => {
      const feature = allFeatures().find((f) => f.id === id);
      if (!feature || !activeLayers.has(feature.group)) return;
      const active = id === selectedId;
      const icon = makeIcon(feature, active);
      if (icon) marker.setIcon(icon);
      marker.setZIndexOffset(active ? 1000 : feature.id === "ski" ? 500 : 0);
    });
  }

  function renderMarkers() {
    if (!leafletMap || !markerLayer) return;
    markerLayer.clearLayers();
    markerById.clear();

    const visible = filteredFeatures();
    for (const f of visible) {
      const icon = makeIcon(f, f.id === selectedId);
      if (!icon) continue;
      const marker = window.L.marker([f.lat, f.lon], {
        icon,
        title: pick(f.shortLabel) || pick(f.label),
      });
      const label = pick(f.shortLabel) || pick(f.label);
      marker.bindTooltip(label, {
        direction: "top",
        offset: [0, -12],
        opacity: 0.95,
        className: "area-pin-tooltip",
      });
      marker.on("click", () => select(f.id));
      marker.addTo(markerLayer);
      markerById.set(f.id, marker);
    }
    syncMarkerStyles();
  }

  function guideHref(feature) {
    const langQ = locale === "en" ? "?lang=en" : "";
    if (feature.group === "onsen") {
      return `${resortId}-lp/nearby-onsen.html#spot-${feature.id}${langQ}`;
    }
    if (feature.group === "food") {
      return `${resortId}-lp/nearby-food.html#spot-${feature.id}${langQ}`;
    }
    if (feature.id === "blue-pond") return `${resortId}-lp/blue-pond.html${langQ}`;
    if (feature.id === "ski") return `${resortId}-lp/snow-play.html${langQ}`;
    return `${resortId}-lp/${langQ}`;
  }

  function select(id, options = {}) {
    const { pan = true, fromList = false } = options;
    selectedId = id;
    const feature = allFeatures().find((f) => f.id === id);
    if (!feature || !activeLayers.has(feature.group)) return;

    document.querySelectorAll(".area-list-item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.featureId === id);
      if (fromList && btn.dataset.featureId === id) {
        btn.scrollIntoView({ block: "nearest", behavior: scrollBehavior() });
      }
    });

    syncMarkerStyles();
    if (pan) panToFeature(feature);
    renderDetail(feature);
    if (embed && el.embedPicker) {
      const sel = el.embedPicker.querySelector("select");
      if (sel) sel.value = id;
    }
  }

  function renderDetail(feature) {
    if (!el.detail) return;
    const catLabel = t(`category.${feature.category}`) || feature.category;
    const region = feature.region ? pick(feature.region) : "";
    const mapsQ = feature.mapsQuery || pick(feature.label);

    el.detail.innerHTML = `
      <h2 class="area-detail__title">${pick(feature.label)}</h2>
      <p class="area-detail__meta">${[region, catLabel, feature.source].filter(Boolean).join(" · ")}</p>
      <div class="area-detail__actions">
        <a href="${googleMapsUrl(mapsQ)}" target="_blank" rel="noopener noreferrer">${t("openMaps")} ↗</a>
        ${
          feature.group === "food" || feature.group === "onsen"
            ? `<a href="${guideHref(feature)}" class="area-link-ghost">${t("readGuide")}</a>`
            : ""
        }
      </div>
    `;
  }

  function listEyebrow(feature) {
    if (feature.region) return pick(feature.region);
    return t(`category.${feature.category}`) || feature.category;
  }

  function renderList() {
    if (!el.list) return;
    const items = filteredFeatures();
    el.list.innerHTML = items
      .map((f, i) => {
        return `
          <button type="button" class="area-list-item${selectedId === f.id ? " is-active" : ""}"
            data-feature-id="${f.id}">
            <span class="area-list-item__num">${String(i + 1).padStart(2, "0")}</span>
            <span class="area-list-item__body">
              <span class="area-list-item__eyebrow">${listEyebrow(f)}</span>
              <span class="area-list-item__title">${pick(f.label)}</span>
            </span>
          </button>`;
      })
      .join("");

    el.list.querySelectorAll("[data-feature-id]").forEach((btn) => {
      btn.addEventListener("click", () => select(btn.dataset.featureId, { fromList: true }));
    });
  }

  function layersQuery() {
    return [...activeLayers].join(",");
  }

  function syncUrlLayers() {
    if (embed && window.parent !== window) return;
    const u = new URL(location.href);
    if (activeLayers.size === LAYER_KEYS.length) u.searchParams.delete("layers");
    else u.searchParams.set("layers", layersQuery());
    window.history.replaceState({}, "", u);
  }

  function afterLayerChange() {
    renderFilters();
    if (embed) {
      ensureEmbedToolbar();
      renderFilters(el.embedFilters);
      renderEmbedPicker();
    }
    renderList();
    syncUrlLayers();

    const stillVisible = selectedId && filteredFeatures().some((f) => f.id === selectedId);
    if (!stillVisible) {
      selectedId = null;
      if (el.detail) el.detail.innerHTML = `<p>${t("detailPick")}</p>`;
    } else {
      renderDetail(allFeatures().find((f) => f.id === selectedId));
    }

    renderMarkers();
    fitMapToProfile(true);
  }

  function setAllLayers(on) {
    activeLayers = on ? new Set(LAYER_KEYS) : new Set();
    afterLayerChange();
  }

  function toggleLayer(layer) {
    if (activeLayers.has(layer)) activeLayers.delete(layer);
    else activeLayers.add(layer);
    afterLayerChange();
  }

  function renderFilters(target) {
    const node = target || el.filters;
    if (!node) return;
    const allOn = activeLayers.size === LAYER_KEYS.length;
    const count = filteredFeatures().length;
    const toggles = [
      ["food", t("filterFood")],
      ["onsen", t("filterOnsen")],
      ["anchor", t("filterAnchor")],
    ];
    node.innerHTML = `
      <button type="button" class="area-filter-btn area-filter-btn--all" data-filter-all aria-pressed="${allOn}">
        ${t("filterAll")}
      </button>
      ${toggles
        .map(
          ([id, label]) =>
            `<button type="button" class="area-filter-btn" data-layer="${id}" aria-pressed="${activeLayers.has(id)}">${label}</button>`,
        )
        .join("")}
      <span class="area-filter-count">${t("spotCount", { n: count })}</span>
    `;

    node.querySelector("[data-filter-all]")?.addEventListener("click", () => setAllLayers(true));

    node.querySelectorAll("[data-layer]").forEach((btn) => {
      btn.addEventListener("click", () => toggleLayer(btn.dataset.layer));
    });

    if (!target && el.filterHint) el.filterHint.textContent = t("filterHint");
  }

  function renderEmbedPicker() {
    if (!embed || !el.embedPicker) return;
    const items = filteredFeatures();
    el.embedPicker.innerHTML = `
      <label class="area-embed-picker">
        <span class="area-embed-picker__label">${t("detailPick")}</span>
        <select class="area-embed-picker__select" aria-label="${t("detailPick")}">
          <option value="">${locale === "en" ? "Choose a spot…" : "スポットを選択…"}</option>
          ${items
            .map(
              (f) =>
                `<option value="${f.id}"${selectedId === f.id ? " selected" : ""}>${pick(f.label)}</option>`,
            )
            .join("")}
        </select>
      </label>`;
    el.embedPicker.querySelector("select")?.addEventListener("change", (e) => {
      if (e.target.value) select(e.target.value, { fromList: true });
    });
  }

  function ensureEmbedToolbar() {
    if (!embed || !el.stage || el.embedToolbar) return;
    const toolbar = document.createElement("div");
    toolbar.className = "area-embed-toolbar";
    toolbar.setAttribute("role", "region");
    toolbar.setAttribute("aria-label", t("title"));

    el.embedFilters = document.createElement("div");
    el.embedFilters.className = "area-filter area-filter--embed";
    el.embedFilters.id = "area-embed-filters";

    el.embedPicker = document.createElement("div");
    el.embedPicker.className = "area-embed-picker-wrap";

    toolbar.appendChild(el.embedFilters);
    toolbar.appendChild(el.embedPicker);
    el.stage.prepend(toolbar);
    el.embedToolbar = toolbar;
  }

  function initLeafletMap() {
    if (!el.stage || !window.L) return;

    const toolbar = el.embedToolbar;
    el.stage.replaceChildren();
    if (toolbar) el.stage.prepend(toolbar);

    const wrap = document.createElement("div");
    wrap.className = "area-leaflet-wrap";

    const mapEl = document.createElement("div");
    mapEl.className = "area-leaflet-map";
    mapEl.id = "area-leaflet-map";
    wrap.appendChild(mapEl);

    if (!embed) {
      const hint = document.createElement("p");
      hint.className = "area-map-hint";
      hint.textContent = t("mapHint");
      wrap.appendChild(hint);
    }

    el.stage.appendChild(wrap);

    if (!embed && mapData.disclaimer) {
      const disclaimer = document.createElement("p");
      disclaimer.className = "area-disclaimer";
      disclaimer.textContent = pick(mapData.disclaimer);
      el.stage.appendChild(disclaimer);
    }

    leafletMap = window.L.map(mapEl, {
      zoomControl: !embed,
      attributionControl: !embed,
    });

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: embed
        ? ""
        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(leafletMap);

    markerLayer = window.L.layerGroup().addTo(leafletMap);

    leafletMap.on("moveend", () => {
      if (skipNextMoveEnd) {
        skipNextMoveEnd = false;
        return;
      }
    });

    renderMarkers();
    fitMapToProfile(false);
    requestAnimationFrame(() => leafletMap.invalidateSize());
  }

  function bindChrome() {
    if (el.title) el.title.textContent = t("title");
    if (el.lead) el.lead.textContent = t("lead");
    if (el.resortName) el.resortName.textContent = pick(mapData.name);

    const lpBack = `${resortId}-lp/${locale === "en" ? "?lang=en" : ""}`;
    if (el.backLink) {
      el.backLink.href = lpBack;
      el.backLink.textContent = t("backLp");
    }
    if (el.hubLink) {
      el.hubLink.href = `index.html${locale === "en" ? "?lang=en" : ""}`;
      el.hubLink.textContent = t("backHub");
    }

    if (el.detail && !selectedId) {
      el.detail.innerHTML = `<p>${t("detailPick")}</p>`;
    }
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.head.appendChild(s);
    });
  }

  async function boot() {
    if (location.protocol === "file:") {
      if (el.stage) el.stage.innerHTML = `<p class="map-error">${t("needHttp")}</p>`;
      return;
    }

    try {
      const [areaRes, manifestRes] = await Promise.all([
        fetch(`data/maps/${resortId}-area.json`),
        fetch(`${ICON_BASE}marker-icons.json`),
      ]);
      if (!areaRes.ok) throw new Error(areaRes.statusText);
      mapData = await areaRes.json();
      if (manifestRes.ok) markerManifest = await manifestRes.json();
    } catch {
      if (el.stage) el.stage.innerHTML = `<p class="map-error">${t("loadError")}</p>`;
      return;
    }

    if (!window.L) {
      try {
        await loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
      } catch {
        if (el.stage) el.stage.innerHTML = `<p class="map-error">${t("leafletError")}</p>`;
        return;
      }
    }

    bindChrome();
    syncDocumentLang();
    if (embed) ensureEmbedToolbar();
    renderFilters();
    if (embed) {
      renderFilters(el.embedFilters);
      renderEmbedPicker();
    }
    renderList();
    initLeafletMap();

    const focus = params.get("focus");
    const focusFeature = focus && allFeatures().find((f) => f.id === focus);
    if (focusFeature && activeLayers.has(focusFeature.group)) {
      select(focus, { pan: true });
    }
  }

  if (embed) {
    document.documentElement.classList.add("area-map-embed-root");
    document.body.classList.add("area-map-page--embed");
  }
  boot();
})();
