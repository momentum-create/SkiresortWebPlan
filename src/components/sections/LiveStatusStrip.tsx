"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { Badge } from "@/components/ui/Badge";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import type { LiveStatus } from "@/types/resort";
import type { AppLocale } from "@/i18n/routing";

interface LiveStatusStripProps {
  status: LiveStatus;
}

const dateLocaleMap: Record<AppLocale, string> = {
  ja: "ja-JP",
  en: "en-US",
};

export function LiveStatusStrip({ status }: LiveStatusStripProps) {
  const t = useTranslations("liveStatus");
  const a11y = useTranslations("a11y");
  const locale = useLocale() as AppLocale;
  const { containerVariants, itemVariants, motionProps } =
    useScrollReveal("-20px");

  const liftRatio = status.liftsOpen / status.liftsTotal;
  const liftTone =
    liftRatio >= 0.8 ? "success" : liftRatio >= 0.5 ? "default" : "danger";

  const updatedAt = new Intl.DateTimeFormat(dateLocaleMap[locale], {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(status.updatedAt));

  const metrics = [
    {
      key: "snow",
      label: t("snow"),
      value: (
        <span className="font-mono-metrics text-2xl font-semibold text-[var(--ink)] md:text-3xl">
          <AnimatedCounter value={status.snowDepthCm} />
          <span className="ml-1 text-base font-medium text-[var(--slate)] md:text-lg">
            cm
          </span>
        </span>
      ),
    },
    {
      key: "weather",
      label: t("weather"),
      value: (
        <span className="font-mono-metrics text-xl font-semibold text-[var(--ink)] md:text-2xl">
          {status.weather}{" "}
          <span className="text-[var(--alpine)]">
            {status.temperatureC > 0 ? "+" : ""}
            {status.temperatureC}°C
          </span>
        </span>
      ),
    },
    {
      key: "lifts",
      label: t("lifts"),
      value: (
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono-metrics text-xl font-semibold text-[var(--ink)] md:text-2xl">
            {status.liftsOpen}/{status.liftsTotal}
          </span>
          <Badge tone={liftTone}>{t("operating")}</Badge>
        </div>
      ),
    },
  ];

  return (
    <section
      className="border-b border-[var(--border)] bg-[var(--alpine-soft)]"
      aria-label={a11y("todayStatus")}
    >
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="live-pulse" aria-hidden />
            <span className="text-xs font-semibold tracking-[0.2em] text-[var(--alpine-dark)] uppercase">
              {t("liveLabel")}
            </span>
          </div>
          <p className="text-xs text-[var(--slate)]">
            {t("updated")}: {updatedAt}
          </p>
        </div>

        <motion.ul
          className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-[var(--border)]"
          variants={containerVariants}
          {...motionProps}
        >
          {metrics.map((metric) => (
            <motion.li
              key={metric.key}
              variants={itemVariants}
              className="sm:px-6 sm:first:pl-0 sm:last:pr-0"
            >
              <p className="text-xs font-medium tracking-wide text-[var(--slate)] uppercase">
                {metric.label}
              </p>
              <div className="mt-2">{metric.value}</div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
