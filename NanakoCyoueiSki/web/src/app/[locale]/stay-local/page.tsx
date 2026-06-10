import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "周辺情報",
  description: "温泉・食・滞在情報を公式確認のうえ順次掲載します。",
};

export default async function StayLocalPage() {
  const data = await getResortData();
  const localSpots = data.stayLocal.spots;

  return (
    <AwardPageShell
      eyebrow="Local"
      title="周辺情報"
      description="周辺温泉・食事・滞在モデルコースは、提携表現や営業時間を確認してから掲載します。"
    >
      <p role="note" className="notice-banner">
        {data.stayLocal.notice}
      </p>

      <div className="space-y-0 border-t border-[color:var(--award-color-border)]">
        {localSpots.map((spot, index) => (
          <article
            key={spot.name}
            className={`border-b border-[color:var(--award-color-border)] py-8 ${
              index % 2 === 1 ? "ml-[8%] max-w-xl" : "max-w-2xl"
            }`}
          >
            <p className="award-eyebrow text-[color:var(--award-color-muted)]">
              {spot.category}
            </p>
            <h2 className="heading-md mt-3">{spot.name}</h2>
            <p className="lead mt-4">{spot.summary}</p>
          </article>
        ))}
      </div>
    </AwardPageShell>
  );
}
