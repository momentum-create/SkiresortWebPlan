"use client";

import { useMemo } from "react";
import { AwardButton } from "@/components/AwardButton";
import type { AccessMapData } from "@/lib/resort-data";
import {
  appleMapsNavigateUrl,
  detectMobilePlatform,
  goTaxiAppUrl,
  googleMapsNavigateUrl,
  googleMapsRouteUrl,
} from "@/lib/access-deep-links";

type Labels = {
  navFromHere: string;
  navApple: string;
  openGoTaxi: string;
  stationRoute: string;
  goTaxiNote: string;
};

type Props = {
  map: AccessMapData;
  labels: Labels;
};

export function AccessMapActions({ map, labels }: Props) {
  const resort = map.landmarks.find((l) => l.role === "destination");
  const transit = map.landmarks.find((l) => l.role === "transit");

  const platform = useMemo(() => detectMobilePlatform(), []);

  if (!resort) return null;

  const dest = {
    lat: resort.lat,
    lng: resort.lng,
    label: resort.label,
    labelEn: resort.labelEn,
  };

  const googleNav = googleMapsNavigateUrl(dest);
  const appleNav = appleMapsNavigateUrl(dest);
  const goTaxi = goTaxiAppUrl(platform);
  const stationRoute =
    transit != null ? googleMapsRouteUrl(transit, dest) : map.mapUrl;

  return (
    <div className="mt-6 space-y-3">
      <AwardButton
        href={googleNav}
        variant="primary"
        external
        block
        showArrow={false}
        className="!min-h-[3.25rem] !text-base !font-semibold"
      >
        {labels.navFromHere}
      </AwardButton>

      <div
        className={
          platform === "android"
            ? "grid grid-cols-1 gap-2"
            : "grid grid-cols-2 gap-2"
        }
      >
        {platform !== "android" ? (
          <AwardButton
            href={appleNav}
            variant="secondary"
            external
            block
            showArrow={false}
            className="!min-h-[2.75rem] !px-3 !text-xs !font-semibold sm:!text-sm"
          >
            {labels.navApple}
          </AwardButton>
        ) : null}
        <AwardButton
          href={goTaxi}
          variant="secondary"
          external
          block
          showArrow={false}
          className="!min-h-[2.75rem] !px-3 !text-xs !font-semibold sm:!text-sm"
        >
          {labels.openGoTaxi}
        </AwardButton>
      </div>

      <p className="text-center">
        <a
          href={stationRoute}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-[color:var(--award-color-accent)] underline-offset-2 hover:underline"
        >
          {labels.stationRoute}
        </a>
      </p>

      <p className="text-[0.625rem] leading-relaxed text-[color:var(--award-color-muted)]">
        {labels.goTaxiNote}
      </p>
    </div>
  );
}
