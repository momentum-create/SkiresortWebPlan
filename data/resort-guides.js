/**
 * JAPOWSERCH マップ「詳細確認」→ guides.japowserch.com
 * data/resort-guides.json と併用。JAPOWSERCH リポジトリへコピーする。
 *
 * guides に無い resortId → null → scrollToCard へフォールバック。
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.ResortGuides = factory();
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DEFAULT_BASE = "https://guides.japowserch.com";

  function isGuideLocaleEn() {
    if (typeof document === "undefined") return false;
    if (document.documentElement.lang === "en") return true;
    if (typeof location !== "undefined" && /-en\.html$/i.test(location.pathname)) {
      return true;
    }
    if (typeof location !== "undefined") {
      const params = new URLSearchParams(location.search);
      if (params.get("lang") === "en") return true;
    }
    return false;
  }

  /**
   * @param {number|string} resortId - JAPOW マップの施設 ID
   * @param {object} resortGuides - resort-guides.json の内容
   * @returns {string|null}
   */
  function getResortGuideUrl(resortId, resortGuides) {
    const data = resortGuides || {};
    const g = data.guides && data.guides[String(resortId)];
    if (!g || !g.registryId) return null;
    const base = (data.baseUrl || DEFAULT_BASE).replace(/\/$/, "");
    const q = isGuideLocaleEn() ? "?lang=en" : "";
    return `${base}/${g.registryId}/${q}`;
  }

  /**
   * @returns {boolean} true = 外部ガイドへ遷移 / false = scrollToCard へフォールバック
   */
  function openGuideOrFallback(resortId, resortGuides, scrollToCard, options) {
    const url = getResortGuideUrl(resortId, resortGuides);
    if (url) {
      const target = options?.target || "_blank";
      if (target === "_self") {
        window.location.href = url;
      } else {
        window.open(url, target, "noopener,noreferrer");
      }
      return true;
    }
    if (typeof scrollToCard === "function") {
      scrollToCard(resortId);
    }
    return false;
  }

  return {
    DEFAULT_BASE,
    isGuideLocaleEn,
    getResortGuideUrl,
    /** @deprecated use getResortGuideUrl */
    getGuideUrl: getResortGuideUrl,
    openGuideOrFallback,
  };
});
