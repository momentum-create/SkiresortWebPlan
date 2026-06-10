"use client";

import { useCallback, useEffect, useState } from "react";
import type { MapStatusPayload } from "./types";

const POLL_MS = 12_000;

async function fetchMapStatus(endpoint: string): Promise<MapStatusPayload> {
  const res = await fetch(endpoint, { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as MapStatusPayload;
}

export function useMapStatus(endpoint = "/api/public/map-status") {
  const [data, setData] = useState<MapStatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const json = await fetchMapStatus(endpoint);
      setData(json);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取得に失敗しました");
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const json = await fetchMapStatus(endpoint);
        if (!active) return;
        setData(json);
        setError(null);
      } catch (e) {
        if (!active) return;
        setError(e instanceof Error ? e.message : "取得に失敗しました");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    const id = window.setInterval(() => void load(), POLL_MS);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [endpoint]);

  return { data, error, loading, refresh };
}
