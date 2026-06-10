import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardFold } from "@/components/AwardFold";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "スクール・イベント",
  description: "スクール受付やイベント情報を順次掲載します。",
};

export default async function LessonsEventsPage() {
  const data = await getResortData();
  const lessons = data.lessonsEvents.items;

  return (
    <AwardPageShell
      eyebrow="School"
      title="スクール・イベント"
      description="講習、無料ナイター講習、イベント予定は公式確認後に掲載します。"
    >
      <p role="note" className="notice-banner">
        {data.lessonsEvents.notice}
      </p>

      <div className="space-y-0">
        {lessons.map((lesson) => (
          <AwardFold key={lesson.name} title={lesson.name}>
            <span className="rounded-full bg-[color:var(--award-color-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--award-color-accent)]">
              {lesson.status}
            </span>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                  時間
                </dt>
                <dd className="mt-1 font-medium">{lesson.time}</dd>
              </div>
              <div>
                <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                  対象
                </dt>
                <dd className="mt-1 font-medium">{lesson.target}</dd>
              </div>
            </dl>
            <p className="lead mt-4">{lesson.note}</p>
          </AwardFold>
        ))}
      </div>
    </AwardPageShell>
  );
}
