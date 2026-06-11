"use client";

import type { AccessMapData } from "@/lib/resort-data";
import { AccessMapActions } from "./AccessMapActions";
import { AccessMapBackground } from "./AccessMapBackground";

type Labels = {
  heroEyebrow: string;
  heroHeadline: string;
  heroSub: string;
  navFromHere: string;
  navApple: string;
  openGoTaxi: string;
  stationRoute: string;
  goTaxiNote: string;
  parking: string;
  parkingValue: string;
  sourceNote: string;
};

type Props = {
  map: AccessMapData;
  labels: Labels;
};

export function AccessMapHeroShell({ map, labels }: Props) {
  return (
    <section
      className="access-map-hero relative left-1/2 w-screen max-w-none -translate-x-1/2 overflow-hidden"
      aria-labelledby="access-map-heading"
    >
      <div className="relative min-h-[min(72dvh,560px)] w-full md:min-h-[min(64vh,520px)]">
        <AccessMapBackground bounds={map.bounds} />

        <div
          className="pointer-events-none absolute inset-0 bg-[color:var(--award-color-bg)]/25"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[color:var(--award-color-bg)]/80 via-transparent to-[color:var(--award-color-bg)]/30"
          aria-hidden
        />

        <div className="relative flex h-full min-h-[inherit] items-center px-4 py-10 sm:px-8 md:px-12 lg:px-16">
          <div className="w-full max-w-md rounded-2xl border border-[color:var(--award-color-border)] bg-white/96 p-6 shadow-[0_24px_64px_rgb(20_26_38_/12%)] backdrop-blur-md sm:p-8 md:max-w-lg">
            <p className="award-eyebrow text-[color:var(--award-color-muted)]">
              {labels.heroEyebrow}
            </p>
            <h2
              id="access-map-heading"
              className="mt-4 text-[clamp(1.375rem,4.5vw,1.875rem)] font-semibold leading-[1.2] tracking-tight text-[color:var(--award-color-fg)]"
            >
              {labels.heroHeadline}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--award-color-muted)]">
              {labels.heroSub}
            </p>

            <AccessMapActions map={map} labels={labels} />

            <p className="mt-4 text-sm text-[color:var(--award-color-muted)]">
              <span className="font-semibold text-[color:var(--foreground)]">
                {labels.parking}:
              </span>{" "}
              {labels.parkingValue}
            </p>
            <p className="mt-3 text-[0.6875rem] leading-relaxed text-[color:var(--award-color-muted)]">
              {labels.sourceNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
