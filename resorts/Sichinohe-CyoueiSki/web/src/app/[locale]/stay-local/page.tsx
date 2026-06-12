import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";
import { StayLocalFeatured } from "@/components/stay-local/StayLocalFeatured";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("stayLocal");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function StayLocalPage() {
  const data = await getResortData();
  const t = await getTranslations("stayLocal");
  const localSpots = data.stayLocal.spots;
  const featured = data.stayLocal.featuredSpot;

  return (
    <AwardPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("shellDescription")}
    >
      <p role="note" className="notice-banner">
        {data.stayLocal.notice}
      </p>

      {featured ? <StayLocalFeatured spot={featured} /> : null}

      {localSpots.length > 0 ? (
        <section className="mt-16 border-t border-[color:var(--award-color-border)] pt-12">
          <h2 className="heading-md">{t("otherSpotsTitle")}</h2>
          <div className="mt-10 space-y-0 border-t border-[color:var(--award-color-border)]">
            {localSpots.map((spot, index) => (
              <article
                key={spot.name}
                className={`border-b border-[color:var(--award-color-border)] py-8 ${
                  index % 2 === 1 ? "ml-[8%] max-w-xl" : "max-w-2xl"
                }`}
              >
                <p className="award-eyebrow text-[color:var(--award-color-muted)]">
                  {spot.category}
                </p>
                <h3 className="heading-md mt-3">{spot.name}</h3>
                <p className="lead mt-4">{spot.summary}</p>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </AwardPageShell>
  );
}
