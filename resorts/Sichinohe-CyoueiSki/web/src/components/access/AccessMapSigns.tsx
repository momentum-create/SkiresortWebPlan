import type { AccessLandmark, AccessMapData } from "@/lib/resort-data";

type Props = {
  bounds: AccessMapData["bounds"];
  landmarks: AccessMapData["landmarks"];
  en?: boolean;
};

function landmarkShortLabel(landmark: AccessLandmark, en: boolean): string {
  if (en) return landmark.shortLabelEn ?? landmark.labelEn;
  return landmark.shortLabel ?? landmark.label;
}

/** 右カラム内の X（地理 lng をサインゾーン幅に正規化） */
function projectSignX(lng: number, bounds: AccessMapData["bounds"]): number {
  const geoX = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
  const xMin = 14;
  const xMax = 86;
  return xMin + geoX * (xMax - xMin);
}

type SignSlot = {
  x: number;
  y: number;
  labelBelow: boolean;
};

function signSlotForRole(
  lat: number,
  lng: number,
  bounds: AccessMapData["bounds"],
  role: AccessLandmark["role"],
): SignSlot {
  const geoY = 1 - (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
  const x = projectSignX(lng, bounds);

  if (role === "destination") {
    const band = { min: 16, max: 28 };
    return { x, y: band.min + geoY * (band.max - band.min), labelBelow: true };
  }

  const band = { min: 72, max: 84 };
  return { x, y: band.min + geoY * (band.max - band.min), labelBelow: false };
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
    ? "rounded-full bg-white px-3 py-1.5 text-center text-[0.6875rem] font-semibold leading-tight text-[color:var(--award-color-fg)] shadow-[0_8px_24px_rgb(20_26_38_/16%)] sm:text-xs"
    : "rounded-full border border-[color:var(--award-color-border)] bg-white/95 px-3 py-1.5 text-center text-[0.6875rem] font-medium leading-tight text-[color:var(--award-color-muted)] shadow-[0_6px_20px_rgb(20_26_38_/10%)] sm:text-xs";

  const dotClass = isDestination
    ? "h-2.5 w-2.5 rounded-full bg-[color:var(--award-color-accent)] ring-2 ring-white"
    : "h-2 w-2 rounded-full bg-[color:var(--award-color-muted)] ring-2 ring-white";

  const pill = (
    <div className={`max-w-[8.5rem] whitespace-nowrap sm:max-w-[9.5rem] ${pillClass}`}>
      {label}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-1.5">
      {!labelBelow ? pill : null}
      <span className={dotClass} />
      {labelBelow ? pill : null}
    </div>
  );
}

/** 装飾用フローティングサイン（駅・ゲレンデのみ、ルート線なし） */
export function AccessMapSigns({ bounds, landmarks, en = false }: Props) {
  const transit = landmarks.find((l) => l.role === "transit");
  const destination = landmarks.find((l) => l.role === "destination");

  return (
    <>
      {/* md+ — カード右 55% のサインゾーンに配置 */}
      <div
        className="pointer-events-none absolute inset-y-0 z-[5] hidden md:block md:left-[var(--access-sign-zone-left,45%)] md:right-0"
        aria-hidden={true}
      >
        {destination ? (() => {
          const slot = signSlotForRole(
            destination.lat,
            destination.lng,
            bounds,
            "destination",
          );
          return (
          <div
            className="absolute -translate-x-1/2"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <SignMarker
              label={landmarkShortLabel(destination, en)}
              isDestination
              labelBelow
            />
          </div>
          );
        })() : null}
        {transit ? (() => {
          const slot = signSlotForRole(transit.lat, transit.lng, bounds, "transit");
          return (
          <div
            className="absolute -translate-x-1/2 -translate-y-full"
            style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
          >
            <SignMarker
              label={landmarkShortLabel(transit, en)}
              isDestination={false}
              labelBelow={false}
            />
          </div>
          );
        })() : null}
      </div>

      {/* モバイル — 右上（ゲレンデ）・右下（駅）に固定 */}
      <div
        className="pointer-events-none absolute inset-0 z-[5] md:hidden"
        aria-hidden={true}
      >
        {destination ? (
          <div className="absolute right-4 top-[var(--access-sign-inset-y,12%)]">
            <SignMarker
              label={landmarkShortLabel(destination, en)}
              isDestination
              labelBelow
            />
          </div>
        ) : null}
        {transit ? (
          <div className="absolute bottom-[var(--access-sign-inset-y,12%)] right-4">
            <SignMarker
              label={landmarkShortLabel(transit, en)}
              isDestination={false}
              labelBelow={false}
            />
          </div>
        ) : null}
      </div>
    </>
  );
}
