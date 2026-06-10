import type { Metadata } from "next";
import { getResortData } from "@/lib/resort-data";
import { getLiftGeoJson, getMapCenter } from "@/lib/map-data";
import { AwardButton } from "@/components/AwardButton";
import { AwardFold } from "@/components/AwardFold";
import { AwardPageShell } from "@/components/AwardPageShell";

export const metadata: Metadata = {
  title: "コース",
  description: "七戸町営スキー場のコース情報（距離・斜度・公開状況）を順次掲載します。",
};

export default async function CoursesPage() {
  const data = await getResortData();
  const mapCenter = await getMapCenter();
  const lifts = await getLiftGeoJson();
  const courses = data.courses.items;
  const gsiMapUrl = mapCenter
    ? `https://maps.gsi.go.jp/#16/${mapCenter.center.lat}/${mapCenter.center.lng}/&base=std&ls=std&disp=1&vs=c1j0l0u0f0&d=vl`
    : null;

  return (
    <AwardPageShell
      eyebrow="Terrain"
      title="コース"
      description="コースごとの距離・斜度・圧雪/非圧雪・公開状況は公式確認後に掲載します。"
      footer={
        gsiMapUrl ? (
          <AwardButton href={gsiMapUrl} variant="secondary" external>
            国土地理院で開く
          </AwardButton>
        ) : null
      }
    >
      <p role="note" className="notice-banner">
        {data.courses.notice}
      </p>

      <AwardFold title="ゲレンデマップ（準備版）" defaultOpen>
        <p className="lead">
          LAAX型のインタラクティブマップに向け、OpenStreetMap から取得したリフトライン（
          {lifts?.features.length ?? 0}本）と中心座標を整備中です。
        </p>
        {mapCenter ? (
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                中心座標
              </dt>
              <dd className="award-stat-inline mt-2 text-lg">
                {mapCenter.center.lat}, {mapCenter.center.lng}
              </dd>
            </div>
            <div>
              <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                標高
              </dt>
              <dd className="award-stat-inline mt-2 text-lg">
                {mapCenter.elevationM.base}〜{mapCenter.elevationM.top} m
              </dd>
            </div>
          </dl>
        ) : null}
      </AwardFold>

      <div className="space-y-0">
        {courses.map((course) => (
          <AwardFold key={course.name} title={course.name}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[color:var(--award-color-accent-soft)] px-3 py-1 text-xs font-semibold text-[color:var(--award-color-accent)]">
                {course.status}
              </span>
            </div>
            <dl className="mt-5 space-y-4">
              <div>
                <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                  距離
                </dt>
                <dd className="award-stat-inline mt-1 text-lg">{course.distance}</dd>
              </div>
              <div>
                <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                  最大斜度
                </dt>
                <dd className="award-stat-inline mt-1 text-lg">{course.maxSlope}</dd>
              </div>
              <div>
                <dt className="award-eyebrow text-[color:var(--award-color-muted)]">
                  雪面
                </dt>
                <dd className="mt-1 font-medium">{course.snowType}</dd>
              </div>
            </dl>
          </AwardFold>
        ))}
      </div>
    </AwardPageShell>
  );
}
