/**
 * Layer toggles + spot focus for embedded area-map iframes on LP detail pages.
 * Uses postMessage after first load to avoid iframe reload + page scroll jumps.
 */
(function () {
  function lang() {
    return document.documentElement.lang === "en" ? "en" : "ja";
  }

  function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function spotIdFromHash() {
    const m = location.hash.match(/^#spot-(.+)$/);
    return m ? m[1] : null;
  }

  function entryIdFromHash() {
    const m = location.hash.match(/^#entry-(.+)$/);
    return m ? m[1] : null;
  }

  function scrollEntryIntoView(id) {
    const target =
      document.getElementById(`entry-${id}`) ||
      document.querySelector(`[data-spot-entry="${id}"]`);
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  function mapSectionEl(root) {
    return (
      root.closest("section") ||
      document.getElementById("food-map") ||
      document.getElementById("onsen-map")
    );
  }

  function scrollMapIntoView(root) {
    const section = mapSectionEl(root);
    if (!section) return;
    section.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "start",
    });
  }

  function buildMapSrc(layers, focus) {
    const u = new URL("/area-map.html", location.href);
    u.searchParams.set("resort", "biei");
    u.searchParams.set("embed", "1");
    u.searchParams.set("layers", layers.join(","));
    if (focus) u.searchParams.set("focus", focus);
    if (lang() === "en") u.searchParams.set("lang", "en");
    return u.pathname + u.search;
  }

  function syncParentListFocus(id) {
    document.querySelectorAll(".food-spot.is-map-focused").forEach((el) => {
      el.classList.remove("is-map-focused");
      el.removeAttribute("aria-current");
    });
    if (!id) return;
    const row = document.querySelector(
      `.food-spot[data-spot-entry="${CSS.escape(id)}"]`,
    );
    if (!row) return;
    row.classList.add("is-map-focused");
    row.setAttribute("aria-current", "location");
  }

  function initMapEmbed(root) {
    const iframe = root.querySelector(".map-embed iframe");
    const toggles = root.querySelectorAll("[data-map-layer]");
    if (!iframe || !toggles.length) return;

    let active = new Set(
      (root.dataset.defaultLayers || "food,anchor")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );

    let focusId = spotIdFromHash();
    let mapReady = false;

    function postToMap(payload) {
      if (!mapReady || !iframe.contentWindow) return;
      iframe.contentWindow.postMessage(
        { source: "map-embed-layers", ...payload },
        location.origin,
      );
    }

    function syncIframeSrc() {
      iframe.src = buildMapSrc([...active], focusId);
    }

    function syncLive() {
      toggles.forEach((btn) => {
        btn.setAttribute("aria-pressed", active.has(btn.dataset.mapLayer) ? "true" : "false");
      });
      if (mapReady) {
        postToMap({ layers: [...active], focus: focusId || null });
      } else {
        syncIframeSrc();
      }
    }

    function ensureLayersForSpot(id) {
      if (!id) return;
      const foodIds = new Set([
        "junpei",
        "biei-farm",
        "aruno",
        "chiyoda",
        "ferme",
        "between",
        "gosh",
        "asperge",
        "sabo",
        "santouka",
      ]);
      const onsenIds = new Set([
        "ao-no-bi-yuyu",
        "park-hills",
        "tsuewasure",
        "mori-no-ryotei",
        "mori-no-shizuku",
        "kokumin",
        "ryounkaku",
        "hakuginso",
        "fukiage-roten",
        "yukoma",
      ]);
      if (foodIds.has(id)) {
        active.add("food");
        active.add("anchor");
      } else if (onsenIds.has(id)) {
        active.add("onsen");
        active.add("anchor");
      }
    }

    function clearMapFocus() {
      focusId = null;
      if (location.hash.match(/^#spot-/)) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      syncParentListFocus(null);
      syncLive();
    }

    function focusSpot(id, nudgeMap, options = {}) {
      const { fromIframe = false } = options;
      if (id) {
        ensureLayersForSpot(id);
        focusId = id;
        const nextHash = `#spot-${id}`;
        if (location.hash !== nextHash) {
          history.replaceState(null, "", nextHash);
        }
        syncParentListFocus(id);
      } else {
        syncParentListFocus(null);
        focusId = null;
        if (location.hash.match(/^#spot-/)) {
          history.replaceState(null, "", location.pathname + location.search);
        }
      }
      if (!fromIframe) syncLive();
      if (nudgeMap) scrollMapIntoView(root);
    }

    function applyIframeFocus(id) {
      if (id) {
        if (id === focusId) {
          syncParentListFocus(id);
          return;
        }
        focusSpot(id, false, { fromIframe: true });
        return;
      }
      if (!focusId) {
        syncParentListFocus(null);
        return;
      }
      focusId = null;
      if (location.hash.match(/^#spot-/)) {
        history.replaceState(null, "", location.pathname + location.search);
      }
      syncParentListFocus(null);
    }

    if (!root.dataset.mapEmbedInit) {
      root.dataset.mapEmbedInit = "1";

      iframe.addEventListener("load", () => {
        mapReady = true;
        postToMap({ layers: [...active], focus: focusId || null });
      });

      window.addEventListener("message", (e) => {
        if (e.origin !== location.origin) return;
        const data = e.data;
        if (!data || data.source !== "area-map") return;
        if (data.type === "ready") {
          mapReady = true;
          postToMap({ layers: [...active], focus: focusId || null });
          return;
        }
        if (data.type === "focus") {
          applyIframeFocus(data.id || null);
        }
      });

      toggles.forEach((btn) => {
        btn.addEventListener("click", () => {
          const layer = btn.dataset.mapLayer;
          if (active.has(layer)) active.delete(layer);
          else active.add(layer);
          clearMapFocus();
        });
      });

      document.querySelectorAll(".food-spot__map-link").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const u = new URL(a.getAttribute("href"), location.href);
          const id = u.searchParams.get("focus");
          if (!id) return;
          focusSpot(id, true);
        });
      });

      window.addEventListener("hashchange", () => {
        const entry = entryIdFromHash();
        if (entry) {
          scrollEntryIntoView(entry);
          return;
        }
        const id = spotIdFromHash();
        if (id) focusSpot(id, true);
        else clearMapFocus();
      });
    }

    root._mapEmbedSync = syncLive;
    root._mapEmbedFocus = focusSpot;
    root._mapEmbedClearFocus = clearMapFocus;
    syncLive();

    if (focusId) syncParentListFocus(focusId);

    const entryId = entryIdFromHash();
    if (entryId) {
      requestAnimationFrame(() => scrollEntryIntoView(entryId));
    } else if (focusId) {
      requestAnimationFrame(() => scrollMapIntoView(root));
    }
  }

  function boot() {
    document.querySelectorAll("[data-map-embed]").forEach(initMapEmbed);
  }

  boot();
  window.addEventListener("mock-i18n-ready", boot);
})();
