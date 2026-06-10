"use client";

import { useState } from "react";
import { AwardButton } from "@/components/AwardButton";

const GUIDES = [
  {
    slug: "transit-powder",
    href: "/plan/transit-powder" as const,
    title: "Transit Powder",
    summary: "駅近アクセスで狙う、七戸のパウダー体験。",
  },
  {
    slug: "transit-shinkansen",
    href: "/plan/transit-shinkansen" as const,
    title: "Transit Shinkansen",
    summary: "東北新幹線を軸にした、短時間の雪山トリップ。",
  },
  {
    slug: "beginners",
    href: "/plan/beginners-hidden-gem" as const,
    title: "Beginners Hidden Gem",
    summary: "初めての方・ファミリー向けの緩やかな滑走案内。",
  },
] as const;

type GuidesRevealProps = {
  sectionTitle: string;
};

export function GuidesReveal({ sectionTitle }: GuidesRevealProps) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="home-section border-t border-[color:var(--surface-border)]">
      <div className="home-inner">
        <p className="eyebrow">Guides</p>
        <h2 className="heading-lg mt-4">{sectionTitle}</h2>

        <ul className="mt-14 space-y-0">
          {GUIDES.map((guide) => {
            const isOpen = active === guide.slug;
            return (
              <li
                key={guide.slug}
                className="border-t border-[color:var(--surface-border)] last:border-b"
              >
                <button
                  type="button"
                  className="flex w-full items-baseline justify-between gap-6 py-7 text-left"
                  aria-expanded={isOpen}
                  onClick={() =>
                    setActive(isOpen ? null : guide.slug)
                  }
                >
                  <span className="text-xl font-semibold tracking-tight sm:text-2xl">
                    {guide.title}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-lg font-light text-[color:var(--muted)]"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen ? (
                  <div className="pb-8">
                    <p className="lead max-w-lg">{guide.summary}</p>
                    <AwardButton href={guide.href} variant="ghost" className="mt-5">
                      読む
                    </AwardButton>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
