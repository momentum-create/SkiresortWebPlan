"use client";

import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import type { TicketPlan } from "@/types/resort";
import type { AppLocale } from "@/i18n/routing";

interface TicketPricingProps {
  tickets: TicketPlan[];
}

const priceLocaleMap: Record<AppLocale, string> = {
  ja: "ja-JP",
  en: "en-US",
};

export function TicketPricing({ tickets }: TicketPricingProps) {
  const t = useTranslations("tickets");
  const locale = useLocale() as AppLocale;
  const { containerVariants, itemVariants, motionProps } = useScrollReveal();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat(priceLocaleMap[locale]).format(price);

  const currencyPrefix = "¥";

  return (
    <section
      className="bg-[var(--canvas)] py-16 md:py-24"
      aria-labelledby="tickets-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          titleId="tickets-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <motion.ul
          className="mt-10 grid gap-4 md:grid-cols-3"
          variants={containerVariants}
          {...motionProps}
        >
          {tickets.map((plan) => (
            <motion.li key={plan.id} variants={itemVariants}>
              <Card highlighted={plan.highlighted} className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-semibold text-[var(--ink)]">
                    {plan.name}
                  </h3>
                  {plan.badge && <Badge tone="gold">{plan.badge}</Badge>}
                </div>

                <p className="mt-4 flex items-baseline gap-1">
                  <span className="font-mono-metrics text-3xl font-semibold text-[var(--ink)]">
                    {currencyPrefix}
                    {formatPrice(plan.price)}
                  </span>
                  <span className="text-sm text-[var(--slate)]">
                    / {plan.unit}
                  </span>
                </p>

                <p className="mt-3 text-sm text-[var(--slate)]">
                  {plan.description}
                </p>

                <ul className="mt-4 flex-1 space-y-2">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-[var(--ink)]"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        className="mt-0.5 shrink-0 text-[var(--alpine)]"
                        aria-hidden
                      >
                        <path
                          d="M3 8l3.5 3.5L13 5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  href="/tickets"
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="mt-6 w-full"
                >
                  {t("buy")}
                </Button>
              </Card>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
