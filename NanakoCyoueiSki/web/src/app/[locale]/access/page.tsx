import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardFold } from "@/components/AwardFold";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "アクセス",
  description:
    "東北新幹線「七戸十和田駅」方面から七戸町営スキー場へのアクセス概要（詳細・運賃は公式確認）。",
};

export default async function AccessPage() {
  const data = await getResortData();

  return (
    <AwardPageShell
      eyebrow="Transit"
      title="アクセス"
      description="公共交通機関の時刻・運賃は季節やダイヤで変わります。必ず交通機関・タクシーの公式情報でご確認ください。"
    >
      <div className="space-y-0 border-t border-[color:var(--award-color-border)]">
        {data.access.cards.map((item) => (
          <div
            key={item.k}
            className="border-b border-[color:var(--award-color-border)] py-7"
          >
            <p className="award-eyebrow text-[color:var(--award-color-muted)]">
              {item.k}
            </p>
            <p className="mt-3 text-xl font-semibold tracking-tight">{item.v}</p>
          </div>
        ))}
      </div>

      <AwardFold title="新幹線・アクセスの骨子">
        <ul className="lead list-inside list-disc space-y-3">
          {data.access.bullets.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </AwardFold>
    </AwardPageShell>
  );
}
