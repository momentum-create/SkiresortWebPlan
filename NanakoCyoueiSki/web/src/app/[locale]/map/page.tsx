import type { Metadata } from "next";
import { LiftMapViewer } from "@/components/lift-map/LiftMapViewer";

export const metadata: Metadata = {
  title: "マップ",
  description:
    "七戸町営スキー場の俯瞰マップ。高解像度3D風ヒーロー画像の上にリフト・コースの運行状況を表示します。",
};

export default function MapPage() {
  return <LiftMapViewer />;
}
