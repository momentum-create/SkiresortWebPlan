"use client";

import { useCallback, useRef, useState, type PointerEvent, type WheelEvent } from "react";

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export function usePanZoom() {
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{
    active: boolean;
    lastX: number;
    lastY: number;
    pointerId: number | null;
  }>({ active: false, lastX: 0, lastY: 0, pointerId: null });

  const clampScale = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s));

  const zoomBy = useCallback((delta: number, origin?: { x: number; y: number }) => {
    setScale((prev) => {
      const next = clampScale(prev + delta);
      if (!origin || next === prev) return next;
      const ratio = next / prev;
      setTranslate((t) => ({
        x: origin.x - (origin.x - t.x) * ratio,
        y: origin.y - (origin.y - t.y) * ratio,
      }));
      return next;
    });
  }, []);

  const resetView = useCallback(() => {
    setScale(1);
    setTranslate({ x: 0, y: 0 });
  }, []);

  const onWheel = useCallback(
    (e: WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      zoomBy(e.deltaY < 0 ? 0.15 : -0.15, {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [zoomBy],
  );

  const onPointerDown = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    dragRef.current = {
      active: true,
      lastX: e.clientX,
      lastY: e.clientY,
      pointerId: e.pointerId,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== e.pointerId) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    setTranslate((t) => ({ x: t.x + dx, y: t.y + dy }));
  }, []);

  const onPointerUp = useCallback((e: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.pointerId === e.pointerId) {
      dragRef.current.active = false;
      dragRef.current.pointerId = null;
    }
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
  }, []);

  return {
    scale,
    transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
    zoomIn: () => zoomBy(0.2),
    zoomOut: () => zoomBy(-0.2),
    resetView,
    onWheel,
    onPointerDown,
    onPointerMove,
    onPointerUp,
  };
}
