import type { LiveCamsData } from "@/lib/resort-data";
import { AwardButton } from "@/components/AwardButton";
import { LiveCamFrame } from "@/components/live-cam/LiveCamFrame";

type ImmersiveLiveCamProps = {
  liveCams: LiveCamsData;
};

export function ImmersiveLiveCam({ liveCams }: ImmersiveLiveCamProps) {
  const main = liveCams.items[0];
  if (!main) return null;

  return (
    <section className="home-section bg-white">
      <div className="home-inner mb-10 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Live</p>
          <h2 className="display-xl mt-4">Now</h2>
        </div>
        <AwardButton href="/live-cams" variant="ghost" className="shrink-0 pb-1">
          全カメラ
        </AwardButton>
      </div>

      <div className="relative left-1/2 w-screen max-w-none -translate-x-1/2 px-4 sm:px-8">
        <LiveCamFrame camera={main} priority aspect="video" />
        <p className="lead-whisper mx-auto mt-6 max-w-xl text-center">
          {liveCams.notice}
        </p>
      </div>
    </section>
  );
}
