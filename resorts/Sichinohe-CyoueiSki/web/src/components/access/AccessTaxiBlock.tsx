import type { AccessRentacarAffiliate, AccessTaxiInfo } from "@/lib/resort-data";

type Labels = {
  eyebrow: string;
  phoneLabel: string;
  addressLabel: string;
  rentacarLink: string;
  rentacarNote: string;
};

type Props = {
  taxi: AccessTaxiInfo;
  rentacar?: AccessRentacarAffiliate;
  labels: Labels;
  en?: boolean;
};

export function AccessTaxiBlock({ taxi, rentacar, labels, en = false }: Props) {
  const company = en ? taxi.companyEn : taxi.company;

  return (
    <div className="mt-5 border-t border-[color:var(--award-color-border)] pt-5">
      <p className="award-eyebrow text-[color:var(--award-color-muted)]">
        {labels.eyebrow}
      </p>
      <p className="mt-3 text-base font-semibold tracking-tight text-[color:var(--award-color-fg)]">
        {company}
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--award-color-muted)]">
        <span className="font-semibold text-[color:var(--foreground)]">
          {labels.phoneLabel}
        </span>
        {": "}
        <a
          href={taxi.phoneHref}
          className="award-stat-inline inline-block min-h-11 py-2 font-medium text-[color:var(--award-color-accent)] underline-offset-2 hover:underline"
        >
          {taxi.phone}
        </a>
      </p>
      <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--award-color-muted)]">
        <span className="font-semibold text-[color:var(--foreground)]">
          {labels.addressLabel}
        </span>
        {": "}
        <span className="[word-break:keep-all]">
          {en ? taxi.addressEn : taxi.address}
        </span>
      </p>

      {rentacar ? (
        <div className="mt-4 border-t border-[color:var(--award-color-border)] pt-4">
          <a
            href={rentacar.href}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="inline-flex min-h-11 items-center text-sm font-semibold text-[color:var(--award-color-accent)] underline-offset-2 hover:underline"
          >
            {/* ValueCommerce 計測用（アフィリエイト規約） */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={rentacar.trackingPixel}
              alt=""
              width={0}
              height={1}
              className="inline h-px w-0 border-0 p-0"
              aria-hidden={true}
            />
            {labels.rentacarLink}
          </a>
          <p className="mt-1 text-[0.6875rem] leading-relaxed text-[color:var(--award-color-muted)]">
            {labels.rentacarNote}
          </p>
        </div>
      ) : null}
    </div>
  );
}
