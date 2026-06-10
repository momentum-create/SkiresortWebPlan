export interface ResortMeta {
  name: string;
  slug: string;
  tagline: string;
  description: string;
}

export interface HeroData {
  imageUrl: string;
  imageAlt: string;
  overlayLines: string[];
  /** 編集指定の改行（句点・読点単位。自動折り返しに任せない） */
  descriptionLines: string[];
}

export interface LiveStatus {
  snowDepthCm: number;
  weather: string;
  temperatureC: number;
  liftsOpen: number;
  liftsTotal: number;
  updatedAt: string;
}

export interface CtaLink {
  label: string;
  href: string;
}

export interface BentoItem {
  id: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  badge?: string;
}

export interface TicketPlan {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: string;
  href: string;
  category: string;
}

export interface AccessInfo {
  address: string;
  hours: string;
  mapUrl: string;
  transitNote: string;
}

export type NavIcon = "home" | "map" | "ticket" | "today" | "access";

export interface NavItem {
  label: string;
  href: string;
  icon: NavIcon;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
}

export interface ResortTemplateData {
  meta: ResortMeta;
  hero: HeroData;
  liveStatus: LiveStatus;
  ctas: {
    primary: CtaLink;
    secondary: CtaLink;
  };
  explore: BentoItem[];
  tickets: TicketPlan[];
  news: NewsItem[];
  access: AccessInfo;
  nav: NavItem[];
  footer: {
    links: FooterLink[];
    social: SocialLink[];
    copyright: string;
  };
}

/** ロケール非依存の設定（messages と合成して ResortTemplateData を生成） */
export interface ResortConfig {
  meta: { slug: string };
  hero: { imageUrl: string };
  liveStatus: {
    snowDepthCm: number;
    weatherKey: string;
    temperatureC: number;
    liftsOpen: number;
    liftsTotal: number;
    updatedAt: string;
  };
  ctas: {
    primary: { href: string; labelKey: string };
    secondary: { href: string; labelKey: string };
  };
  explore: Array<{
    id: string;
    href: string;
    imageUrl: string;
    badgeKey?: string;
  }>;
  tickets: Array<{
    id: string;
    price: number;
    highlighted?: boolean;
    badgeKey?: string;
  }>;
  news: Array<{
    id: string;
    date: string;
    href: string;
    categoryKey: string;
  }>;
  access: { mapUrl: string };
  nav: Array<{ href: string; icon: NavIcon; labelKey: string }>;
  footer: {
    links: Array<{ href: string; labelKey: string }>;
    social: SocialLink[];
  };
}
