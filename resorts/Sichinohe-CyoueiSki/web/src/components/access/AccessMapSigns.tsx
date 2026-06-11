import type { CSSProperties } from "react";
import type { AccessLandmark, AccessMapData } from "@/lib/resort-data";

export type SignLink = {
  landmark: AccessLandmark;
  href: string;
  ariaLabel: string;
};

type Props = {
  bounds: AccessMapData["bounds"];
  signLinks: SignLink[];
  en?: boolean;
};

type SignSlot = {
  x: number;
  y: number;
  labelBelow: boolean;
};

function landmarkShortLabel(landmark: AccessLandmark, en: boolean): string {
  if (en) return landmark.shortLabelEn ?? landmark.labelEn;
  return landmark.shortLabel ?? landmark.label;
}

/** OSM bbox 埋め込みと同じ Web メルカトル投影（%） */
function mercatorY(lat: number): number {
  const rad = (lat * Math.PI) / 180;
  return Math.log(Math.tan(Math.PI / 4 + rad / 2));
}

function projectSign(
  lat: number,
  lng: number,
  bounds: AccessMapData["bounds"],
): SignSlot {
  const { minLat, maxLat, minLng, maxLng } = bounds;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;

  const yMin = mercatorY(minLat);
  const yMax = mercatorY(maxLat);
  const y = ((yMax - mercatorY(lat)) / (yMax - yMin)) * 100;

  const xClamped = Math.max(4, Math.min(96, x));
  const yClamped = Math.max(6, Math.min(94, y));

  return {
    x: xClamped,
    y: yClamped,
    labelBelow: yClamped < 50,
  };
}

function SignMarker({
  label,
  isDestination,
  labelBelow,
}: {
  label: string;
  isDestination: boolean;
  labelBelow: boolean;
}) {
  const pillClass = isDestination
    ? "rounded-full bg-white px-3 py-1.5 text-center text-[0.6875rem] font-semibold leading-tight text-[color:var(--award-color-fg)] shadow-[0_8px_24px_rgb(20_26_38_/16%)] transition-transform duration-200 ease-[var(--ease-award)] motion-safe:group-hover:scale-[1.03] sm:text-xs"
    : "rounded-full border border-[color:var(--award-color-border)] bg-white/95 px-3 py-1.5 text-center text-[0.6875rem] font-medium leading-tight text-[color:var(--award-color-muted)] shadow-[0_6px_20px_rgb(20_26_38_/10%)] transition-transform duration-200 ease-[var(--ease-award)] motion-safe:group-hover:scale-[1.03] sm:text-xs";

  const dotClass = isDestination
    ? "h-2.5 w-2.5 rounded-full bg-[color:var(--award-color-accent)] ring-2 ring-white"
    : "h-2 w-2 rounded-full bg-[color:var(--award-color-muted)] ring-2 ring-white";

  const pill = (
    <div
      className={`inline-flex max-w-[min(13rem,calc(100vw-3rem))] items-center justify-center whitespace-nowrap ${pillClass}`}
    >
      {label}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      {!labelBelow ? pill : null}
      <span className={dotClass} aria-hidden={true} />
      {labelBelow ? pill : null}
    </div>
  );
}

function SignLinkAnchor({
  link,
  en,
  slot,
}: {
  link: SignLink;
  en: boolean;
  slot: SignSlot;
}) {
  const isDestination = link.landmark.role === "destination";

  return (
    <a
      href={link.href}
      target="_blank"
      rel="nofollow noopener noreferrer"
      aria-label={link.ariaLabel}
      className={`group map-focus-ring pointer-events-auto absolute flex min-h-11 min-w-11 -translate-x-1/2 items-center justify-center ${
        slot.labelBelow ? "" : "-translate-y-full"
      }`}
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <SignMarker
        label={landmarkShortLabel(link.landmark, en)}
        isDestination={isDestination}
        labelBelow={slot.labelBelow}
      />
    </a>
  );
}

/** 地図上のフローティングサイン（bbox 座標に合わせて配置） */
export function AccessMapSigns({ bounds, signLinks, en = false }: Props) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5]"
      role="group"
      aria-label={en ? "Locations on map" : "地図上の地点"}
    >
      {signLinks.map((link) => (
        <SignLinkAnchor
          key={link.landmark.id}
          link={link}
          en={en}
          slot={projectSign(link.landmark.lat, link.landmark.lng, bounds)}
        />
      ))}
    </div>
  );
}
