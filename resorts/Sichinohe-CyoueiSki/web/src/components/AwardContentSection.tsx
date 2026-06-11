type AwardContentSectionProps = {
  title: string;
  children: React.ReactNode;
};

/** Static section for reference pages (pricing, tables) — no accordion. */
export function AwardContentSection({ title, children }: AwardContentSectionProps) {
  return (
    <section className="award-content-section">
      <h3 className="award-content-section__title">{title}</h3>
      <div className="award-content-section__body">{children}</div>
    </section>
  );
}
