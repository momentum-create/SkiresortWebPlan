"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const LOCALES: AppLocale[] = ["ja", "en"];

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("lang");

  return (
    <div
      role="group"
      aria-label={t("switch")}
      className="flex items-center gap-1 rounded-full border border-[var(--border)] bg-white p-1"
    >
      {LOCALES.map((code) => {
        const isActive = locale === code;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            aria-current={isActive ? "true" : undefined}
            className={[
              "interactive-focus inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full px-3 text-xs font-semibold tracking-wide transition",
              isActive
                ? "bg-[var(--alpine-soft)] text-[var(--alpine)]"
                : "text-[var(--slate)] hover:text-[var(--ink)]",
            ].join(" ")}
          >
            {t(code)}
          </Link>
        );
      })}
    </div>
  );
}
