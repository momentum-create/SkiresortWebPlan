type AwardFoldProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function AwardFold({
  title,
  children,
  defaultOpen = false,
}: AwardFoldProps) {
  return (
    <details className="award-fold group" open={defaultOpen}>
      <summary className="award-fold__summary">
        <span className="award-fold__title">{title}</span>
        <span className="award-fold__marker" aria-hidden="true" />
      </summary>
      <div className="award-fold__body">{children}</div>
    </details>
  );
}
