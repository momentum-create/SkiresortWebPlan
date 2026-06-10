import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing, type AppLocale } from "@/i18n/routing";

const MAP_SRC = "/maps/map-preview.html";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return {
    title: t("map"),
    description: t("map"),
  };
}

export default async function MapPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);
  const nav = await getTranslations("nav");
  const a11y = await getTranslations("a11y");

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[var(--canvas)]">
      <header className="flex shrink-0 items-center justify-between border-b border-[var(--border)] bg-white/85 px-4 py-3 backdrop-blur-md">
        <Link
          href="/"
          className="interactive-focus text-sm font-semibold text-[var(--ink)]"
        >
          ← {nav("home")}
        </Link>
        <span className="text-sm font-medium text-[var(--slate)]">
          {nav("map")}
        </span>
        <span className="sr-only">{a11y("skipToContent")}</span>
      </header>
      <iframe
        title={nav("map")}
        src={MAP_SRC}
        className="min-h-0 flex-1 w-full border-0"
      />
    </div>
  );
}
