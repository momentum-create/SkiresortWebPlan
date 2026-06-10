import { Button } from "@/components/ui/Button";
import type { CtaLink } from "@/types/resort";

interface PrimaryCtaBandProps {
  primary: CtaLink;
  secondary: CtaLink;
}

export function PrimaryCtaBand({ primary, secondary }: PrimaryCtaBandProps) {
  return (
    <section className="bg-[var(--canvas)] py-6" aria-label="主要アクション">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-3 px-4">
        <Button href={primary.href} variant="primary" size="lg" className="w-full">
          {primary.label}
        </Button>
        <Button href={secondary.href} variant="secondary" size="lg" className="w-full">
          {secondary.label}
        </Button>
      </div>
    </section>
  );
}
