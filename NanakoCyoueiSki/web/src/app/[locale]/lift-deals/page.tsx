import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardFold } from "@/components/AwardFold";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "リフト割引・提携情報",
  description:
    "リフト券や旅行商品の提携情報を掲載予定です。広告・アフィリエイト表記の方針に従って公開します。",
};

export default async function LiftDealsPage() {
  const data = await getResortData();

  return (
    <AwardPageShell
      eyebrow="Deals"
      title="リフト割引・提携情報"
      description="リフト割引・旅行商品連携を掲載するページです。公開時は「広告」「プロモーション」等の表示義務に従って掲出します。"
    >
      <p role="note" className="notice-banner">
        {data.liftDeals.notice}
      </p>

      <div className="space-y-0">
        {data.liftDeals.sections.map((section) => (
          <AwardFold key={section.title} title={section.title}>
            <p className="lead">{section.body}</p>
          </AwardFold>
        ))}
      </div>
    </AwardPageShell>
  );
}
