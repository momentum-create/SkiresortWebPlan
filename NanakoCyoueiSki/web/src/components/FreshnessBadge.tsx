type FreshnessBadgeProps = {
  label: string;
  updatedAt?: string;
  verified?: boolean;
};

export function FreshnessBadge({
  label,
  updatedAt,
  verified = true,
}: FreshnessBadgeProps) {
  return (
    <p className="muted-note flex flex-wrap items-center gap-x-2 gap-y-2 text-sm">
      <span>{label}</span>
      {updatedAt ? (
        <>
          <span aria-hidden="true" className="text-[color:var(--surface-border)]">
            /
          </span>
          <time dateTime={updatedAt}>{updatedAt}</time>
        </>
      ) : null}
      {verified ? (
        <span className="inline-flex items-center rounded-full bg-[color:var(--accent-soft)] px-2.5 py-0.5 text-xs font-medium text-[color:var(--accent)]">
          スタッフ確認
        </span>
      ) : null}
    </p>
  );
}
