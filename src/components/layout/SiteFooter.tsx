import { Link } from "@/i18n/navigation";
import type { ResortMeta, FooterLink, SocialLink } from "@/types/resort";

interface SiteFooterProps {
  meta: ResortMeta;
  links: FooterLink[];
  social: SocialLink[];
  copyright: string;
}

export function SiteFooter({ meta, links, social, copyright }: SiteFooterProps) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--ink)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-lg font-semibold">{meta.name}</p>
            <p className="mt-2 max-w-sm text-sm text-white/70">{meta.tagline}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="interactive-focus rounded text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-white/10 pt-8">
          {social.map((item) => (
            <a
              key={item.platform}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive-focus rounded text-sm text-white/70 transition-colors hover:text-white"
            >
              {item.platform}
            </a>
          ))}
        </div>

        <p className="mt-6 text-xs text-white/50">{copyright}</p>
      </div>
    </footer>
  );
}
