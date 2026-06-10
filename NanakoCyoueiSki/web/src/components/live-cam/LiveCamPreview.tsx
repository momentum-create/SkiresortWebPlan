import type { LiveCamsData } from "@/lib/resort-data";
import { AwardButton } from "@/components/AwardButton";
import { LiveCamFrame } from "@/components/live-cam/LiveCamFrame";
import { SectionHeader } from "@/components/SectionHeader";

type LiveCamPreviewProps = {
  liveCams: LiveCamsData;
};

export function LiveCamPreview({ liveCams }: LiveCamPreviewProps) {
  const main = liveCams.items[0];
  if (!main) return null;

  return (
    <section>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeader
          eyebrow="Live"
          title="ライブカメラ"
          description={liveCams.notice}
        />
        <AwardButton
          href="/live-cams"
          variant="ghost"
          className="shrink-0 self-start sm:self-auto"
        >
          すべて見る
        </AwardButton>
      </div>
      <div className="mt-6">
        <LiveCamFrame camera={main} priority aspect="video" />
      </div>
    </section>
  );
}
