import type { Metadata } from "next";
import { AwardButton } from "@/components/AwardButton";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "Transit Powder",
  description:
    "駅からの移動負荷を抑えつつ、パウダー滑走を狙う方向けのモデルページ（準備版）です。",
};

export default function TransitPowderPage() {
  return (
    <AwardPageShell
      eyebrow="Powder"
      title="Transit Powder"
      titleLines={["Transit", "Powder"]}
      description="「Aomori powder ski access」等の高意図クエリ向けLP骨格です。アクセス短縮・運行確認・パウダー導線の3点で構成します。"
      footer={
        <div className="flex flex-wrap gap-4">
          <AwardButton href="/today" variant="primary">
            今日の運営
          </AwardButton>
          <AwardButton href="/access" variant="ghost">
            アクセス
          </AwardButton>
        </div>
      }
    >
      <p className="lead">
        準備版ページです。公開時にコース紹介・雪質ガイド・当日確認フローを追加します。
      </p>
    </AwardPageShell>
  );
}
