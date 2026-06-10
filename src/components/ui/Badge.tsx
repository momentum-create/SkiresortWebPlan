import type { ReactNode } from "react";

type BadgeTone = "default" | "gold" | "success" | "danger";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneClasses: Record<BadgeTone, string> = {
  default: "bg-[var(--alpine-soft)] text-[var(--alpine-dark)]",
  gold: "bg-amber-50 text-amber-800",
  success: "bg-emerald-50 text-emerald-800",
  danger: "bg-red-50 text-red-800",
};

export function Badge({
  children,
  tone = "default",
  className = "",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        toneClasses[tone],
        className,
      ].join(" ")}
    >
      {children}
    </span>
  );
}
