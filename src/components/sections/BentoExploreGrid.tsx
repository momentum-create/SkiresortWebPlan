"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cardLift } from "@/lib/motion";
import { useScrollReveal } from "@/lib/use-scroll-reveal";
import type { BentoItem } from "@/types/resort";

interface BentoExploreGridProps {
  items: BentoItem[];
}

export function BentoExploreGrid({ items }: BentoExploreGridProps) {
  const t = useTranslations("explore");
  const prefersReducedMotion = useReducedMotion();
  const { containerVariants, itemVariants, motionProps } = useScrollReveal();

  return (
    <section className="py-16 md:py-24" aria-labelledby="explore-heading">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          titleId="explore-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={t("description")}
        />

        <motion.ul
          className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2 md:gap-4"
          variants={containerVariants}
          {...motionProps}
        >
          {items.map((item, index) => (
            <motion.li
              key={item.id}
              variants={itemVariants}
              className={
                index === 0
                  ? "col-span-2 aspect-[16/9] md:col-span-2 md:row-span-2 md:aspect-auto md:min-h-[280px]"
                  : "aspect-[4/3] md:col-span-1"
              }
            >
              <motion.div
                variants={prefersReducedMotion ? undefined : cardLift}
                initial="rest"
                whileHover={prefersReducedMotion ? undefined : "hover"}
                className="h-full"
              >
                <Link
                  href={item.href}
                  className="interactive-focus group relative block h-full overflow-hidden rounded-2xl border border-[var(--border)] bg-white shadow-sm"
                >
                  <Image
                    src={item.imageUrl}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes={
                      index === 0 ? "(max-width:768px) 100vw, 50vw" : "50vw"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)]/80 via-[var(--ink)]/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    {item.badge && (
                      <Badge tone="gold" className="mb-2">
                        {item.badge}
                      </Badge>
                    )}
                    <h3 className="text-lg font-semibold text-white md:text-xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      {item.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
