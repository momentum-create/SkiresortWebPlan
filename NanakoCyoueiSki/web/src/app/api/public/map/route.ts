import { NextResponse } from "next/server";
import {
  getLiftGeoJson,
  getMapCenter,
  getOverlayPaths,
  getTrailGeoJson,
} from "@/lib/map-data";
import { getFeatureManifest } from "@/lib/map-features";

export const runtime = "nodejs";

export async function GET() {
  const [center, lifts, trails, overlay, manifest] = await Promise.all([
    getMapCenter(),
    getLiftGeoJson(),
    getTrailGeoJson(),
    getOverlayPaths(),
    getFeatureManifest(),
  ]);

  return NextResponse.json({
    center,
    lifts,
    trails,
    hero: manifest?.heroImage ?? overlay?.image ?? null,
    overlay,
    controlPoints: overlay?.controlPoints ?? null,
    attribution: {
      osm: "© OpenStreetMap contributors (ODbL)",
      openskimap: "Skimap.org / SkiAreas/view/1345",
      gsi: "© 国土地理院",
      hero: "イラストヒーロー + OSM/skimap 投影オーバーレイ",
    },
  });
}
