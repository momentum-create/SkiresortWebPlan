import { NextResponse } from "next/server";

/** 本番デプロイ版の確認用（短縮 SHA / 機能世代） */
export async function GET() {
  const fullSha = process.env.VERCEL_GIT_COMMIT_SHA ?? "local";
  const hasGoogle =
    Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) &&
    Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAP_ID);
  const hasMapbox = Boolean(process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN);

  return NextResponse.json(
    {
      commit: fullSha === "local" ? "local" : fullSha.slice(0, 7),
      ref: process.env.VERCEL_GIT_COMMIT_REF ?? "local",
      railUi: "split-rail-right-trail-default",
      accessHero: "map-first-v2-clickable-signs-rentacar",
      accessMapTier: hasGoogle ? "google" : hasMapbox ? "mapbox" : "osm",
      statusSource: "git-deployed-json-first",
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
