/** 全体表示（リセット）時の基準ビュー — split レール時は地図列のみに cover */
export const MAP_FIT_SCALE = 1.12;

export function mapDefaultView(
  containerWidth: number,
  railOverlay: boolean,
): { scale: number; x: number; y: number } {
  const railWidth = Math.min(containerWidth * 0.42, 240);
  const x = railOverlay ? -railWidth * 0.5 : 0;
  return {
    scale: MAP_FIT_SCALE,
    x,
    y: -Math.min(16, containerWidth * 0.008),
  };
}
