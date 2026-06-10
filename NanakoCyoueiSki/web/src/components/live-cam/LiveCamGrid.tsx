import type { LiveCamsData } from "@/lib/resort-data";
import { LiveCamFrame } from "@/components/live-cam/LiveCamFrame";

type LiveCamGridProps = {
  liveCams: LiveCamsData;
};

export function LiveCamGrid({ liveCams }: LiveCamGridProps) {
  return (
    <div className="flex flex-col gap-8">
      {liveCams.items.map((camera, index) => (
        <LiveCamFrame
          key={camera.id}
          camera={camera}
          priority={index === 0}
          aspect="video"
        />
      ))}
    </div>
  );
}
