import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  highlighted?: boolean;
}

export function Card({ children, className = "", highlighted = false }: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border bg-white p-5 shadow-sm transition-shadow",
        highlighted
          ? "border-[var(--alpine)] ring-2 ring-[var(--alpine-soft)]"
          : "border-[var(--border)]",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
