"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { usePanZoom } from "./usePanZoom";

type HeroConfig = {
  src: string;
  width: number;
  height: number;
};

type Props = {
  hero: HeroConfig;
};

export function HeroMapCanvas({ hero }: Props) {
  const panZoom = usePanZoom();
  const [imageReady, setImageReady] = useState(false);

  const aspect = hero.width / hero.height;

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#0c1220]">
      <div
        className="h-full w-full cursor-grab active:cursor-grabbing"
        onWheel={panZoom.onWheel}
        onPointerDown={panZoom.onPointerDown}
        onPointerMove={panZoom.onPointerMove}
        onPointerUp={panZoom.onPointerUp}
        onPointerCancel={panZoom.onPointerUp}
      >
        <div
          className="flex h-full w-full items-center justify-center transition-transform duration-75 will-change-transform"
          style={{ transform: panZoom.transform }}
        >
          <div
            className="relative shadow-2xl"
            style={{
              width: `min(100%, calc((100dvh - 8rem) * ${aspect}))`,
              aspectRatio: `${hero.width} / ${hero.height}`,
              opacity: imageReady ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          >
            <Image
              src={hero.src}
              alt="七戸町営スキー場 俯瞰マップ"
              width={hero.width}
              height={hero.height}
              priority
              className="h-full w-full rounded-sm object-cover"
              style={{ imageRendering: "auto" }}
              onLoad={() => setImageReady(true)}
            />
          </div>
        </div>
      </div>

      {!imageReady ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0c1220]">
          <div className="h-10 w-10 animate-pulse rounded-full border-2 border-white/20 border-t-white/80" />
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="pointer-events-auto absolute right-4 top-1/2 flex -translate-y-1/2 flex-col gap-2">
          <MapFab label="拡大" onClick={panZoom.zoomIn}>
            +
          </MapFab>
          <MapFab label="縮小" onClick={panZoom.zoomOut}>
            −
          </MapFab>
          <MapFab label="全体表示" onClick={panZoom.resetView}>
            ⊡
          </MapFab>
        </div>
      </div>
    </div>
  );
}

function MapFab({
  children,
  label,
  onClick,
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-slate-900/80 text-lg font-medium text-white shadow-lg backdrop-blur-md hover:bg-slate-800/90"
    >
      {children}
    </button>
  );
}
