import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { AccessInfo } from "@/types/resort";

interface AccessSectionProps {
  access: AccessInfo;
}

export async function AccessSection({ access }: AccessSectionProps) {
  const t = await getTranslations("access");

  return (
    <section
      className="bg-[var(--canvas)] py-16 md:py-24"
      aria-labelledby="access-heading"
    >
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeading
          titleId="access-heading"
          eyebrow={t("eyebrow")}
          title={t("title")}
          description={access.transitNote}
        />

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-[var(--slate)]">
              {t("addressLabel")}
            </h3>
            <p className="mt-2 text-base text-[var(--ink)]">{access.address}</p>

            <h3 className="mt-6 text-sm font-medium text-[var(--slate)]">
              {t("hoursLabel")}
            </h3>
            <p className="mt-2 text-base text-[var(--ink)]">{access.hours}</p>

            <Button href={access.mapUrl} variant="primary" className="mt-6">
              {t("mapButton")}
            </Button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--alpine-soft)]">
            <div className="flex h-full min-h-[240px] flex-col items-center justify-center p-8 text-center">
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                className="text-[var(--alpine)]"
                aria-hidden
              >
                <path
                  d="M24 4C16.268 4 10 10.268 10 18c0 10.5 14 26 14 26s14-15.5 14-26C38 10.268 31.732 4 24 4zm0 24a8 8 0 110-16 8 8 0 010 16z"
                  fill="currentColor"
                  fillOpacity="0.2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
              <p className="mt-4 text-sm text-[var(--slate)]">
                {t("mapPreview")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
