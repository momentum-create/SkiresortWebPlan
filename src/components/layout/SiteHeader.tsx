"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { LangSwitcher } from "@/components/layout/LangSwitcher";
import type { ResortMeta } from "@/types/resort";

interface SiteHeaderProps {
  meta: ResortMeta;
}

export function SiteHeader({ meta }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const nav = useTranslations("nav");
  const a11y = useTranslations("a11y");

  const navItems = [
    { label: nav("map"), href: "/map" as const },
    { label: nav("tickets"), href: "/tickets" as const },
    { label: nav("todayStatus"), href: "/today" as const },
    { label: nav("access"), href: "/access" as const },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:h-16">
        <Link
          href="/"
          className="interactive-focus text-lg font-semibold tracking-tight text-[var(--ink)]"
        >
          {meta.name}
        </Link>

        <nav
          className="hidden items-center gap-6 md:flex"
          aria-label={nav("main")}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="nav-link interactive-focus"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LangSwitcher />
          <button
            type="button"
            className="interactive-focus flex h-11 w-11 items-center justify-center rounded-xl md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label={a11y("openMenu")}
          >
            <span className="sr-only">{a11y("menu")}</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 5h14M3 10h14M3 15h14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav
          className="border-t border-[var(--border)] bg-white px-4 py-3 md:hidden"
          aria-label={a11y("mobileMenu")}
        >
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="interactive-focus block rounded-lg px-3 py-3 text-[var(--ink)] hover:bg-[var(--alpine-soft)]"
                  onClick={() => setMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
