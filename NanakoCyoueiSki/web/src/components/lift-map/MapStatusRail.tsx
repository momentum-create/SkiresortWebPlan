"use client";

import type { MapFeature } from "./types";
import { STATUS_COLORS, STATUS_LABELS } from "./types";

type Props = {
  features: MapFeature[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: "all" | "lift" | "trail";
};

export function MapStatusRail({ features, selectedId, onSelect, filter }: Props) {
  const visible = features.filter((f) => filter === "all" || f.type === filter);
  if (visible.length === 0) return null;

  const lifts = visible.filter((f) => f.type === "lift");
  const trails = visible.filter((f) => f.type === "trail");
  const groups =
    filter === "lift"
      ? [{ title: "リフト", items: lifts }]
      : filter === "trail"
        ? [{ title: "コース", items: trails }]
        : [
            { title: "リフト", items: lifts },
            { title: "コース", items: trails },
          ].filter((g) => g.items.length > 0);

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-20 mx-auto max-w-lg px-3">
      <div className="max-h-[38dvh] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900/88 shadow-2xl backdrop-blur-md">
        {groups.map((group) => (
          <section key={group.title} className="border-b border-white/10 last:border-b-0">
            <h2 className="px-4 pb-1 pt-3 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-white/50">
              {group.title}
            </h2>
            <ul className="px-2 pb-2">
              {group.items.map((feature) => {
                const color = STATUS_COLORS[feature.status] ?? "#94a3b8";
                const statusLabel = STATUS_LABELS[feature.status] ?? feature.status;
                const selected = selectedId === feature.id;

                return (
                  <li key={feature.id}>
                    <button
                      type="button"
                      onClick={() => onSelect(feature.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                        selected ? "bg-white/15" : "hover:bg-white/8"
                      }`}
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: color }}
                        aria-hidden
                      />
                      <span className="min-w-0 flex-1 truncate text-sm font-medium text-white">
                        {feature.label}
                      </span>
                      <span
                        className="shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-semibold text-white"
                        style={{ backgroundColor: color }}
                      >
                        {statusLabel}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
