import { Link } from "@/i18n/navigation";
import type { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "md" | "lg";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--alpine)] text-white hover:bg-[var(--alpine-dark)] shadow-sm",
  secondary:
    "bg-white text-[var(--ink)] border border-[var(--border)] hover:bg-[var(--alpine-soft)]",
  ghost: "bg-transparent text-[var(--alpine)] hover:bg-[var(--alpine-soft)]",
};

const sizeClasses: Record<ButtonSize, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

export function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  children,
  ariaLabel,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium",
    "transition-colors duration-200 cursor-pointer",
    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    "focus-visible:outline-[var(--alpine)]",
    "min-h-[44px]",
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(" ");

  if (href) {
    const isExternal = href.startsWith("http");

    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          aria-label={ariaLabel}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
