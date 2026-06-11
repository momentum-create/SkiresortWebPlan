import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { AwardButton } from "@/components/AwardButton";

export async function PathMagnet() {
  const t = await getTranslations("home.pathMagnet");

  const paths = [
    {
      href: "/today" as const,
      label: t("todayLabel"),
      title: t("todayTitle"),
      span: "col-span-12 sm:col-span-8",
    },
    {
      href: "/access" as const,
      label: t("accessLabel"),
      title: t("accessTitle"),
      span: "col-span-12 sm:col-span-4",
    },
    {
      href: "/map" as const,
      label: t("mapLabel"),
      title: t("mapTitle"),
      span: "col-span-12 sm:col-span-8",
    },
    {
      href: "/tickets-rental" as const,
      label: t("ticketsLabel"),
      title: t("ticketsTitle"),
      span: "col-span-12 sm:col-span-4",
    },
  ];

  return (
    <section className="home-section">
      <div className="home-inner">
        <p className="award-eyebrow">{t("eyebrow")}</p>
        <h2 className="heading-lg mt-4">{t("title")}</h2>

        <div className="mt-[var(--space-block)] grid grid-cols-12 gap-4">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className={`award-tile-link min-h-[10rem] sm:min-h-[12rem] ${path.span}`}
            >
              <span className="award-tile-link__label">{path.label}</span>
              <span className="award-tile-link__title">{path.title}</span>
              <span className="award-tile-link__arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-right">
          <AwardButton href="/faq" variant="ghost">
            {t("faqLink")}
          </AwardButton>
        </div>
      </div>
    </section>
  );
}
