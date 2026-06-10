import { getTranslations } from "next-intl/server";

const MAP_PREVIEW = "/maps/map-preview.html";

/** Root template: static map preview (七戸 LiftMapViewer は sichinohe/web) */
export async function CoursesMapEmbed() {
  const t = await getTranslations("courses");

  return (
    <section
      aria-label={t("mapAria")}
      className="not-prose -mx-4 w-[calc(100%+2rem)] max-w-none overflow-hidden border-y border-[var(--border)] bg-[var(--canvas)] sm:mx-0 sm:w-full sm:rounded-2xl sm:border"
    >
      <iframe
        title={t("mapAria")}
        src={MAP_PREVIEW}
        className="block h-[min(60dvh,640px)] min-h-[50dvh] w-full border-0"
        loading="lazy"
      />
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--border)] bg-white px-4 py-3">
        <p className="text-sm text-[var(--slate)]">{t("mapHint")}</p>
        <a
          href={MAP_PREVIEW}
          className="interactive-focus inline-flex min-h-[44px] items-center justify-center rounded-xl border border-[var(--border)] bg-white px-5 py-2.5 text-sm font-medium text-[var(--ink)] transition-colors hover:bg-[var(--alpine-soft)]"
        >
          {t("openMap")}
        </a>
      </div>
    </section>
  );
}
