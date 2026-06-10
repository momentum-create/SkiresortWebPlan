"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import type { NewsItem } from "@/types/resort";
import type { AppLocale } from "@/i18n/routing";

interface NewsSectionProps {
  news: NewsItem[];
}

const dateLocaleMap: Record<AppLocale, string> = {
  ja: "ja-JP",
  en: "en-US",
};

export function NewsSection({ news }: NewsSectionProps) {
  const t = useTranslations("news");
  const locale = useLocale() as AppLocale;
  const { containerVariants, itemVariants, motionProps } = useScrollReveal();

  const formatDate = (iso: string) =>
    new Intl.DateTimeFormat(dateLocaleMap[locale], {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));

  return (
    <section className="py-16 md:py-24" aria-labelledby="news-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            titleId="news-heading"
            eyebrow={t("eyebrow")}
            title={t("title")}
          />
          <Link
            href="/news"
            className="interactive-focus shrink-0 text-sm font-medium text-[var(--alpine)] hover:underline"
          >
            {t("viewAll")}
          </Link>
        </div>

        <motion.ul
          className="mt-8 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-white"
          variants={containerVariants}
          {...motionProps}
        >
          {news.map((item) => (
            <motion.li key={item.id} variants={itemVariants}>
              <Link
                href={item.href}
                className="interactive-focus flex flex-col gap-2 px-5 py-4 transition-colors hover:bg-[var(--alpine-soft)]/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <time
                      dateTime={item.date}
                      className="text-xs text-[var(--slate)]"
                    >
                      {formatDate(item.date)}
                    </time>
                    <Badge>{item.category}</Badge>
                  </div>
                  <p className="mt-1 font-medium text-[var(--ink)]">
                    {item.title}
                  </p>
                </div>
                <span className="shrink-0 text-[var(--alpine)]" aria-hidden>
                  →
                </span>
              </Link>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
