"use client";

import Link from "next/link";

const FILTERS = [
  { id: "lifts", label: "リフト", icon: "🚡", filter: "lift" as const },
  { id: "trails", label: "コース", icon: "⛷", filter: "trail" as const },
  { id: "cams", label: "ライブカメラ", icon: "📹", href: "/live-cams" },
  { id: "access", label: "アクセス", icon: "🚃", href: "/access" },
  { id: "today", label: "今日の運営", icon: "❄", href: "/today" },
] as const;

type StatusFilter = "all" | "lift" | "trail";

type Props = {
  resortName: string;
  updatedLabel: string;
  statusFilter: StatusFilter;
  onStatusFilterChange: (filter: StatusFilter) => void;
  onRefresh?: () => void;
};

export function MapOverlayChrome({
  resortName,
  updatedLabel,
  statusFilter,
  onStatusFilterChange,
  onRefresh,
}: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col">
      <header className="pointer-events-auto mx-3 mt-3 flex flex-wrap items-center gap-2 rounded-2xl border border-white/20 bg-white/75 px-4 py-3 shadow-lg backdrop-blur-md sm:mx-4">
        <div className="min-w-0 flex-1">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Resort Map
          </p>
          <h1 className="truncate text-sm font-bold text-slate-900 sm:text-base">
            {resortName}
          </h1>
          <p className="text-[0.625rem] text-slate-500">最終更新 {updatedLabel}</p>
        </div>
        {onRefresh ? (
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[0.625rem] font-semibold text-slate-700 hover:bg-slate-50"
          >
            更新
          </button>
        ) : null}
      </header>

      <nav
        aria-label="マップメニュー"
        className="pointer-events-auto mx-auto mt-3 flex max-w-full gap-1 overflow-x-auto rounded-full border border-white/25 bg-slate-900/80 px-2 py-2 shadow-xl backdrop-blur-md"
      >
        {FILTERS.map((item) => {
          const inner = (
            <>
              <span aria-hidden className="text-sm">
                {item.icon}
              </span>
              <span className="whitespace-nowrap text-[0.6875rem] font-medium text-white">
                {item.label}
              </span>
            </>
          );
          if ("href" in item && item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-white/90 transition hover:bg-white/15"
              >
                {inner}
              </Link>
            );
          }
          if ("filter" in item) {
            const active = statusFilter === item.filter;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onStatusFilterChange(active ? "all" : item.filter)
                }
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 transition ${
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/90 hover:bg-white/15"
                }`}
              >
                {inner}
              </button>
            );
          }
          return null;
        })}
      </nav>

      <p className="pointer-events-none mt-auto px-4 pb-3 text-[0.625rem] text-white/90 drop-shadow-md">
        俯瞰画像 · 運行状況は下の一覧から確認
      </p>
    </div>
  );
}
