import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "問い合わせ",
  description: "問い合わせ先と連絡方法を掲載します。",
};

export default async function ContactPage() {
  const data = await getResortData();

  return (
    <AwardPageShell
      eyebrow="Contact"
      title="問い合わせ"
      description="電話・フォームなどの連絡方法は準備中です。急ぎの場合は公式案内をご確認ください。"
    >
      <section className="border-t border-[color:var(--award-color-border)] py-8">
        <h2 className="heading-md">一般問い合わせ</h2>
        <p className="lead mt-4">{data.contact.general.description}</p>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              電話
            </dt>
            <dd className="award-stat-inline mt-2 text-lg">
              {data.contact.general.phone}
            </dd>
          </div>
          <div>
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              受付時間
            </dt>
            <dd className="mt-2 font-medium">{data.contact.general.hours}</dd>
          </div>
        </dl>
      </section>

      <section className="border-t border-[color:var(--award-color-border)] py-8">
        <h2 className="heading-md">団体・取材</h2>
        <p className="lead mt-4">{data.contact.group.description}</p>
        <dl className="mt-6 space-y-5">
          <div>
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              メール
            </dt>
            <dd className="mt-2 font-medium">{data.contact.group.email}</dd>
          </div>
          <div>
            <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
              フォーム
            </dt>
            <dd className="mt-2 font-medium">{data.contact.group.form}</dd>
          </div>
        </dl>
      </section>
    </AwardPageShell>
  );
}
