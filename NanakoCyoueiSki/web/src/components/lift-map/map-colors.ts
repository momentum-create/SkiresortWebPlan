import type { MapFeature } from "./types";
import { STATUS_COLORS } from "./types";

const TRAIL_BASE = "#0ea5e9";
const LIFT_BASE = "#15803d";

export function strokeForFeature(
  id: string,
  statusById: Record<string, MapFeature | undefined>,
  kind: "lift" | "trail",
): string {
  const status = statusById[id]?.status;
  if (status && STATUS_COLORS[status]) return STATUS_COLORS[status];
  return kind === "lift" ? LIFT_BASE : TRAIL_BASE;
}

export function isStoppedLift(
  id: string,
  statusById: Record<string, MapFeature | undefined>,
): boolean {
  const status = statusById[id]?.status;
  return status === "stopped" || status === "closed";
}

export function trailOpacity(
  id: string,
  statusById: Record<string, MapFeature | undefined>,
): number {
  const status = statusById[id]?.status;
  if (status === "closed") return 0.35;
  if (status === "partial") return 0.65;
  return 0.9;
}
