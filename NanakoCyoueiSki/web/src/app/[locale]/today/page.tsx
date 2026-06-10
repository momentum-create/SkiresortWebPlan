import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";
import { FreshnessBadge } from "@/components/FreshnessBadge";

export const metadata: Metadata = {
  title: "今日の運営・雪",
  description:
    "七戸町営スキー場の積雪・降雪・リフト運行などの最新情報（運用開始後に更新予定）。",
};

export default async function TodayPage() {
  const data = await getResortData();
  const todaySnapshot = data.today.snapshot;

  return (
    <AwardPageShell
      eyebrow="Conditions"
      title="今日の運営・雪"
      description="運営開始後、公式が確認した内容のみを掲載します。時刻・数値は変わることがあります。"
      footer={
        <FreshnessBadge
          label="最終更新"
          updatedAt={data.today.lastUpdated}
          verified={data.today.lastUpdated !== "運用準備中"}
        />
      }
    >
      <p role="note" className="notice-banner">
        {data.today.notice}
      </p>

      <dl className="space-y-0">
        {todaySnapshot.map((item, index) => (
          <div
            key={item.key}
            className={`border-t border-[color:var(--award-color-border)] py-7 ${
              index === todaySnapshot.length - 1 ? "border-b" : ""
            }`}
          >
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              {item.title}
            </dt>
            <dd className="award-stat-mono mt-3 text-[clamp(1.75rem,6vw,2.75rem)]">
              {item.value}
            </dd>
            <p className="award-lead mt-3 text-[color:var(--award-color-muted)]">
              {item.note}
            </p>
          </div>
        ))}
      </dl>
    </AwardPageShell>
  );
}
