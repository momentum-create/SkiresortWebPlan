import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "お知らせ",
  description: "七戸町営スキー場からの最新情報を掲載します。",
};

export default async function NewsPage() {
  const data = await getResortData();
  const newsItems = data.news.items;

  return (
    <AwardPageShell
      eyebrow="News"
      title="お知らせ"
      description="現在、初期公開に向けてコンテンツ準備中です。"
    >
      <div className="space-y-0 border-t border-[color:var(--award-color-border)]">
        {newsItems.map((item) => (
          <article
            key={item.id ?? `${item.date}-${item.title}`}
            className="border-b border-[color:var(--award-color-border)] py-8"
          >
            <div className="flex flex-wrap items-center gap-3">
              <span className="award-eyebrow text-[color:var(--award-color-accent)]">
                {item.category}
              </span>
              <time
                className="text-sm text-[color:var(--award-color-muted)]"
                dateTime={item.date}
              >
                {item.date}
              </time>
            </div>
            <h2 className="heading-md mt-4">{item.title}</h2>
            <p className="lead mt-4">{item.body}</p>
          </article>
        ))}
      </div>
    </AwardPageShell>
  );
}
