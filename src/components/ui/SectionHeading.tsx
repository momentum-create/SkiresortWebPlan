interface SectionHeadingProps {
  titleId?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  titleId,
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {eyebrow && (
        <p className="mb-2 text-sm font-medium tracking-wide text-[var(--alpine)] uppercase">
          {eyebrow}
        </p>
      )}
      <h2
        id={titleId}
        className="font-display text-2xl font-bold tracking-tight text-[var(--ink)] md:text-3xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base leading-relaxed text-[var(--slate)]">
          {description}
        </p>
      )}
    </div>
  );
}
