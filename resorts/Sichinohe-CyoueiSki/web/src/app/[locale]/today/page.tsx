import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";
import { FreshnessBadge } from "@/components/FreshnessBadge";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("today");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function TodayPage() {
  const data = await getResortData();
  const hero = await getTranslations("home.hero");
  const t = await getTranslations("today");
  const todaySnapshot = data.today.snapshot;

  return (
    <AwardPageShell
      eyebrow={t("eyebrow")}
      title={t("title")}
      description={t("shellDescription")}
      footer={
        <FreshnessBadge
          label={hero("freshnessLabel")}
          staffVerifiedLabel={hero("staffVerified")}
          updatedAt={data.today.lastUpdated}
          verified={data.today.lastUpdated !== t("prepLastUpdated")}
        />
      }
    >
      <p role="note" className="notice-banner text-sm leading-relaxed">
        {data.today.notice}
      </p>

      <dl className="grid gap-0 border-t border-[color:var(--award-color-border)] md:grid-cols-3">
        {todaySnapshot.map((item) => (
          <div
            key={item.key}
            className={`border-b border-[color:var(--award-color-border)] py-7 md:border-b-0 md:border-r md:px-8 md:py-10 md:last:border-r-0 ${
              item.wide ? "md:col-span-3 md:border-r-0" : ""
            }`}
          >
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              {item.title}
            </dt>
            <dd className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--award-color-fg)]">
              {item.value}
            </dd>
            <dd className="mt-3 text-sm leading-relaxed text-[color:var(--award-color-muted)]">
              {item.note}
            </dd>
          </div>
        ))}
      </dl>
    </AwardPageShell>
  );
}
