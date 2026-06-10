"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { NavItem } from "@/types/resort";

interface MobileBottomNavProps {
  items: NavItem[];
}

const iconPaths: Record<NavItem["icon"], string> = {
  home: "M3 10.5L10 4l7 6.5V18a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1v-7.5z",
  map: "M4 6l6-3 6 3v12l-6 3-6-3V6zm6 0v15",
  ticket: "M4 8h16v2H4V8zm0 4h16v2H4v-2zm0 4h10v2H4v-2z",
  today: "M6 4h8v2H6V4zm-2 4h12v10H4V8zm4 2v6h4v-6H8z",
  access: "M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6zm0 8a2 2 0 110-4 2 2 0 010 4z",
};

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();
  const a11y = useTranslations("a11y");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--border)] bg-white/95 backdrop-blur-md md:hidden"
      aria-label={a11y("bottomNav")}
    >
      <ul className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "interactive-focus flex min-h-[56px] flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors",
                  isActive
                    ? "text-[var(--alpine)]"
                    : "text-[var(--slate)] hover:text-[var(--ink)]",
                ].join(" ")}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d={iconPaths[item.icon]}
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                    fill={isActive ? "currentColor" : "none"}
                    fillOpacity={isActive ? 0.15 : 0}
                  />
                </svg>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
