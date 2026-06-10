"use client";

import { useLocale } from "next-intl";
import { usePathname, Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

const LOCALES: Array<{ code: AppLocale; label: string }> = [
  { code: "ja", label: "JA" },
  { code: "en", label: "EN" },
];

export function LangSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  return (
    <div
      role="group"
      aria-label="言語切替"
      className="flex items-center gap-1 rounded-full border border-[color:var(--surface-border)] bg-white p-1"
    >
      {LOCALES.map((item) => {
        const isActive = locale === item.code;
        return (
          <Link
            key={item.code}
            href={pathname}
            locale={item.code}
            aria-current={isActive ? "true" : undefined}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold tracking-wide transition ${
              isActive
                ? "bg-[color:var(--accent-soft)] text-[color:var(--accent)]"
                : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
