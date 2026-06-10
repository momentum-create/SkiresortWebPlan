import type { Metadata } from "next";
import { AwardButton } from "@/components/AwardButton";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "Beginners Hidden Gem",
  description:
    "初心者・ファミリー向けに、緩斜面・講習・ローカル体験を整理する準備ページです。",
};

export default function BeginnersHiddenGemPage() {
  return (
    <AwardPageShell
      eyebrow="Family"
      title="Beginners Hidden Gem"
      titleLines={["Beginners", "Hidden Gem"]}
      description="初めて雪に触れる来場者向けに、安心導線・講習・周辺体験をまとめるLP骨格です。"
      footer={
        <div className="flex flex-wrap gap-4">
          <AwardButton href="/lessons-events" variant="primary">
            スクール・イベント
          </AwardButton>
          <AwardButton href="/courses" variant="ghost">
            コース一覧
          </AwardButton>
        </div>
      }
    >
      <p className="lead">
        準備版ページです。公開時に緩斜面マップ・講習予約導線・ファミリー向けTipsを追加します。
      </p>
    </AwardPageShell>
  );
}
