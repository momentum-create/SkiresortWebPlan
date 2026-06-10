import { Link } from "@/i18n/navigation";
import { AwardButton } from "@/components/AwardButton";

const PATHS = [
  {
    href: "/today" as const,
    label: "Today",
    title: "今日の運営",
    span: "col-span-12 sm:col-span-8",
    tall: true,
  },
  {
    href: "/access" as const,
    label: "Access",
    title: "アクセス",
    span: "col-span-12 sm:col-span-4",
    tall: false,
  },
  {
    href: "/tickets-rental" as const,
    label: "Tickets",
    title: "料金",
    span: "col-span-6 sm:col-span-5",
    tall: false,
  },
  {
    href: "/map" as const,
    label: "Terrain",
    title: "ゲレンデマップ",
    span: "col-span-6 sm:col-span-7",
    tall: false,
  },
];

export function PathMagnet() {
  return (
    <section className="home-section">
      <div className="home-inner">
        <p className="eyebrow">Navigate</p>
        <h2 className="heading-lg mt-4">山へ向かう</h2>

        <div className="mt-14 grid grid-cols-12 gap-3 sm:gap-4">
          {PATHS.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className={`group relative overflow-hidden bg-white p-6 transition hover:shadow-[0_20px_48px_rgb(20_26_38_/8%)] sm:p-8 ${path.span} ${
                path.tall ? "min-h-[11rem] sm:min-h-[14rem]" : "min-h-[8rem]"
              }`}
            >
              <span className="eyebrow text-[color:var(--muted)] group-hover:text-[color:var(--accent)]">
                {path.label}
              </span>
              <span
                className={`mt-4 block font-semibold tracking-tight text-[color:var(--foreground)] ${
                  path.tall ? "text-2xl sm:text-3xl" : "text-xl"
                }`}
              >
                {path.title}
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-6 right-6 text-2xl font-light text-[color:var(--surface-border)] transition group-hover:translate-x-1 group-hover:text-[color:var(--accent)]"
              >
                →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-6 text-right">
          <AwardButton href="/faq" variant="ghost">
            FAQ・詳細仕様
          </AwardButton>
        </div>
      </div>
    </section>
  );
}
