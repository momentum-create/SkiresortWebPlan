import type { ResortConfig } from "@/types/resort";

/**
 * ロケール非依存のリゾート設定（画像・料金・URL・数値）。
 * テキスト類は messages/{locale}.json に記載する。
 */
export const resortConfig: ResortConfig = {
  meta: {
    slug: "sichinohe-chouei-ski",
  },

  hero: {
    imageUrl: "/images/hero-sichinohe.png",
  },

  liveStatus: {
    snowDepthCm: 128,
    weatherKey: "sunny",
    temperatureC: -4,
    liftsOpen: 5,
    liftsTotal: 6,
    updatedAt: "2026-02-07T08:30:00+09:00",
  },

  ctas: {
    primary: { href: "/tickets", labelKey: "buyTickets" },
    secondary: { href: "/today", labelKey: "todayStatus" },
  },

  explore: [
    {
      id: "courses",
      href: "/map",
      imageUrl:
        "https://images.unsplash.com/photo-1605540436563-5bca5d0c4d74?w=800&q=80",
      badgeKey: "badge",
    },
    {
      id: "lessons",
      href: "/lessons",
      imageUrl:
        "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800&q=80",
    },
    {
      id: "stay",
      href: "/stay",
      imageUrl:
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
      badgeKey: "badge",
    },
    {
      id: "events",
      href: "/events",
      imageUrl:
        "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b6d?w=800&q=80",
    },
  ],

  tickets: [
    { id: "day", price: 5200 },
    { id: "early", price: 4200, highlighted: true, badgeKey: "popular" },
    { id: "season", price: 68000 },
  ],

  news: [
    { id: "1", date: "2026-02-05", href: "/news/night-skiing", categoryKey: "notice" },
    { id: "2", date: "2026-02-01", href: "/news/kids-lesson", categoryKey: "event" },
    { id: "3", date: "2026-01-28", href: "/news/snow-report", categoryKey: "snow" },
  ],

  access: {
    mapUrl: "https://maps.google.com",
  },

  nav: [
    { href: "/", icon: "home", labelKey: "home" },
    { href: "/map", icon: "map", labelKey: "map" },
    { href: "/tickets", icon: "ticket", labelKey: "ticket" },
    { href: "/today", icon: "today", labelKey: "today" },
    { href: "/access", icon: "access", labelKey: "access" },
  ],

  footer: {
    links: [
      { href: "/map", labelKey: "map" },
      { href: "/tickets", labelKey: "tickets" },
      { href: "/stay", labelKey: "stay" },
      { href: "/contact", labelKey: "contact" },
      { href: "/privacy", labelKey: "privacy" },
    ],
    social: [
      { platform: "Instagram", href: "https://instagram.com" },
      { platform: "X", href: "https://x.com" },
      { platform: "YouTube", href: "https://youtube.com" },
    ],
  },
};
