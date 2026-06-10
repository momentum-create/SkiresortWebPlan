import Image from "next/image";
import type { ResortData } from "@/lib/resort-data";
import { FreshnessBadge } from "@/components/FreshnessBadge";

type ConditionHeroProps = {
  today: ResortData["today"];
  area: string;
  resortName: string;
};

export function ConditionHero({ today, area, resortName }: ConditionHeroProps) {
  return (
    <section className="-mx-5 sm:-mx-7">
      <div className="relative aspect-[5/4] w-full overflow-hidden sm:aspect-[16/10]">
        <Image
          src="/images/hero-slope.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[color:var(--background)] via-[color:var(--background)]/80 to-transparent" />
      </div>

      <div className="relative -mt-10 px-5 sm:-mt-14 sm:px-7">
        <p className="eyebrow">{area}</p>
        <h1 className="display-xl mt-3">{resortName}</h1>
        <p className="lead mt-5 max-w-prose">
          今日の積雪と運行状況を、はじめにご確認ください。
        </p>

        <dl className="mt-10 space-y-0">
          {today.snapshot.map((item, index) => (
            <div
              key={item.key}
              className={`border-t border-[color:var(--surface-border)] py-7 ${
                index === today.snapshot.length - 1 ? "border-b" : ""
              }`}
            >
              <dt className="eyebrow text-[color:var(--muted)]">{item.title}</dt>
              <dd className="stat-value mt-3">{item.value}</dd>
              {item.note ? (
                <p className="muted-note mt-3 text-sm">{item.note}</p>
              ) : null}
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <FreshnessBadge
            label="最終更新"
            updatedAt={today.lastUpdated}
            verified={today.lastUpdated !== "運用準備中"}
          />
        </div>
      </div>

      {today.notice ? (
        <p role="notice" className="notice-banner mx-5 mt-8 sm:mx-7">
          {today.notice}
        </p>
      ) : null}
    </section>
  );
}
