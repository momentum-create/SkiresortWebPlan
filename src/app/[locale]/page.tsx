import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { HeroSection } from "@/components/sections/HeroSection";
import { LiveStatusStrip } from "@/components/sections/LiveStatusStrip";
import { PrimaryCtaBand } from "@/components/sections/PrimaryCtaBand";
import { BentoExploreGrid } from "@/components/sections/BentoExploreGrid";
import { TicketPricing } from "@/components/sections/TicketPricing";
import { NewsSection } from "@/components/sections/NewsSection";
import { AccessSection } from "@/components/sections/AccessSection";
import { getResortData } from "@/lib/get-resort-data";
import { routing, type AppLocale } from "@/i18n/routing";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale as AppLocale);

  const data = await getResortData();
  const a11y = await getTranslations("a11y");

  return (
    <>
      <a
        href="#main-content"
        className="interactive-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-md"
      >
        {a11y("skipToContent")}
      </a>
      <SiteHeader meta={data.meta} />

      <main id="main-content">
        <HeroSection meta={data.meta} hero={data.hero} />
        <LiveStatusStrip status={data.liveStatus} />
        <PrimaryCtaBand
          primary={data.ctas.primary}
          secondary={data.ctas.secondary}
        />
        <BentoExploreGrid items={data.explore} />
        <TicketPricing tickets={data.tickets} />
        <NewsSection news={data.news} />
        <AccessSection access={data.access} />
      </main>

      <SiteFooter
        meta={data.meta}
        links={data.footer.links}
        social={data.footer.social}
        copyright={data.footer.copyright}
      />

      <MobileBottomNav items={data.nav} />
    </>
  );
}
