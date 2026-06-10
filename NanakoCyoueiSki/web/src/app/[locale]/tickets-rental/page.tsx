import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { AwardFold } from "@/components/AwardFold";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "料金・レンタル",
  description: "リフト券・レンタル・支払い方法の情報を順次掲載します。",
};

export default async function TicketsRentalPage() {
  const data = await getResortData();
  const ticketRows = data.ticketsRental.tickets;
  const rentalRows = data.ticketsRental.rentals;
  const paymentRows = data.ticketsRental.payments;

  return (
    <AwardPageShell
      eyebrow="Tickets"
      title="料金・レンタル"
      description="券種、レンタル内容、支払い方法は公式確認後に更新します。"
    >
      <p role="note" className="notice-banner">
        {data.ticketsRental.notice}
      </p>

      <AwardFold title="リフト券">
        <table className="award-table" aria-label="リフト券料金">
          <thead>
            <tr>
              <th scope="col">券種</th>
              <th scope="col">料金</th>
              <th scope="col">メモ</th>
            </tr>
          </thead>
          <tbody>
            {ticketRows.map((row) => (
              <tr key={row.name}>
                <td className="font-semibold">{row.name}</td>
                <td className="award-stat-inline">{row.price}</td>
                <td className="text-[color:var(--award-color-muted)]">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AwardFold>

      <AwardFold title="レンタル">
        <table className="award-table" aria-label="レンタル">
          <thead>
            <tr>
              <th scope="col">項目</th>
              <th scope="col">状況</th>
            </tr>
          </thead>
          <tbody>
            {rentalRows.map((row) => (
              <tr key={row.item}>
                <td>
                  <p className="font-semibold">{row.item}</p>
                  <p className="mt-1 text-sm text-[color:var(--award-color-muted)]">
                    {row.note}
                  </p>
                </td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AwardFold>

      <AwardFold title="支払い方法">
        <table className="award-table" aria-label="支払い方法">
          <thead>
            <tr>
              <th scope="col">方法</th>
              <th scope="col">対応状況</th>
            </tr>
          </thead>
          <tbody>
            {paymentRows.map((row) => (
              <tr key={row.method}>
                <td className="font-semibold">{row.method}</td>
                <td>{row.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </AwardFold>
    </AwardPageShell>
  );
}
