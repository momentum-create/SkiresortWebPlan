import { getTranslations } from "next-intl/server";
import { resortConfig } from "@/data/resort-template";
import type { ResortTemplateData } from "@/types/resort";

export async function getResortData(): Promise<ResortTemplateData> {
  const meta = await getTranslations("meta");
  const hero = await getTranslations("hero");
  const live = await getTranslations("liveStatus");
  const cta = await getTranslations("cta");
  const explore = await getTranslations("explore");
  const tickets = await getTranslations("tickets");
  const news = await getTranslations("news");
  const access = await getTranslations("access");
  const nav = await getTranslations("nav");

  return {
    meta: {
      name: meta("siteName"),
      slug: resortConfig.meta.slug,
      tagline: meta("tagline"),
      description: meta("description"),
    },

    hero: {
      imageUrl: resortConfig.hero.imageUrl,
      imageAlt: hero("imageAlt"),
      overlayLines: [hero("overlayLine1"), hero("overlayLine2")],
      descriptionLines: [
        hero("descriptionLine1"),
        hero("descriptionLine2"),
        hero("descriptionLine3"),
      ],
    },

    liveStatus: {
      snowDepthCm: resortConfig.liveStatus.snowDepthCm,
      weather: live(`weatherValues.${resortConfig.liveStatus.weatherKey}`),
      temperatureC: resortConfig.liveStatus.temperatureC,
      liftsOpen: resortConfig.liveStatus.liftsOpen,
      liftsTotal: resortConfig.liveStatus.liftsTotal,
      updatedAt: resortConfig.liveStatus.updatedAt,
    },

    ctas: {
      primary: {
        label: cta(resortConfig.ctas.primary.labelKey),
        href: resortConfig.ctas.primary.href,
      },
      secondary: {
        label: cta(resortConfig.ctas.secondary.labelKey),
        href: resortConfig.ctas.secondary.href,
      },
    },

    explore: resortConfig.explore.map((item) => ({
      id: item.id,
      href: item.href,
      imageUrl: item.imageUrl,
      title: explore(`items.${item.id}.title`),
      description: explore(`items.${item.id}.description`),
      badge: item.badgeKey
        ? explore(`items.${item.id}.${item.badgeKey}`)
        : undefined,
    })),

    tickets: resortConfig.tickets.map((plan) => ({
      id: plan.id,
      price: plan.price,
      highlighted: plan.highlighted,
      name: tickets(`plans.${plan.id}.name`),
      unit: tickets("unit"),
      description: tickets(`plans.${plan.id}.description`),
      features: tickets.raw(`plans.${plan.id}.features`) as string[],
      badge: plan.badgeKey ? tickets(`badges.${plan.badgeKey}`) : undefined,
    })),

    news: resortConfig.news.map((item) => ({
      id: item.id,
      date: item.date,
      href: item.href,
      title: news(`items.${item.id}.title`),
      category: news(`categories.${item.categoryKey}`),
    })),

    access: {
      address: access("address"),
      hours: access("hours"),
      mapUrl: resortConfig.access.mapUrl,
      transitNote: access("transit"),
    },

    nav: resortConfig.nav.map((item) => ({
      href: item.href,
      icon: item.icon,
      label: nav(item.labelKey),
    })),

    footer: {
      links: resortConfig.footer.links.map((link) => ({
        href: link.href,
        label: nav(link.labelKey),
      })),
      social: resortConfig.footer.social,
      copyright: meta("copyright"),
    },
  };
}
