"use client";

import type { MapFeature } from "./types";
import { STATUS_COLORS, STATUS_LABELS } from "./types";

type Props = {
  feature: MapFeature | null;
  updatedAt?: string;
  onClose: () => void;
};

export function FeatureSheet({ feature, updatedAt, onClose }: Props) {
  if (!feature) return null;

  const color = STATUS_COLORS[feature.status] ?? "#94a3b8";
  const label = STATUS_LABELS[feature.status] ?? feature.status;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border border-[color:var(--award-color-border)] bg-white shadow-2xl"
      role="dialog"
      aria-modal="true"
      aria-labelledby="feature-sheet-title"
    >
      <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-[color:var(--award-color-border)]" />
      <div className="space-y-4 px-5 pb-8 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="award-eyebrow text-[color:var(--award-color-muted)]">
              {feature.type === "lift" ? "リフト" : "コース"}
            </p>
            <h2 id="feature-sheet-title" className="heading-md mt-2">
              {feature.label}
            </h2>
          </div>
          <span
            className="rounded-full px-3 py-1 text-xs font-semibold text-white"
            style={{ backgroundColor: color }}
          >
            {label}
          </span>
        </div>

        {feature.reason ? (
          <p className="lead">理由: {feature.reason}</p>
        ) : null}

        {feature.meta ? (
          <dl className="grid grid-cols-2 gap-2 text-sm">
            {Object.entries(feature.meta).map(([k, v]) => (
              <div key={k}>
                <dt className="text-[color:var(--award-color-muted)]">{k}</dt>
                <dd className="font-medium">{String(v)}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        {updatedAt ? (
          <p className="text-xs text-[color:var(--award-color-muted)]">
            データ更新: {updatedAt}
          </p>
        ) : null}

        <button
          type="button"
          onClick={onClose}
          className="award-btn-primary award-btn-block"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}
