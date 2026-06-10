import type { Metadata } from "next";
import { AwardButton } from "@/components/AwardButton";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "Transit Shinkansen",
  description:
    "東北新幹線利用者向けに、途中下車・短時間利用を想定した導線を示す準備ページです。",
};

export default function TransitShinkansenPage() {
  return (
    <AwardPageShell
      eyebrow="Shinkansen"
      title="Transit Shinkansen"
      titleLines={["Transit", "Shinkansen"]}
      description="新幹線利用でのアクセス性、滞在時間の使い方、運行確認ページへの導線を整理するLP骨格です。"
      footer={
        <div className="flex flex-wrap gap-4">
          <AwardButton href="/access" variant="primary">
            アクセス
          </AwardButton>
          <AwardButton href="/today" variant="ghost">
            今日の運営
          </AwardButton>
        </div>
      }
    >
      <p className="lead">
        準備版ページです。公開時に新幹線ダイヤ連携・所要時間・当日チェックリストを追加します。
      </p>
    </AwardPageShell>
  );
}
