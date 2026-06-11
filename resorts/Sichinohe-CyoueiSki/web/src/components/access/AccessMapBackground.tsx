"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { AccessMapData } from "@/lib/resort-data";

type Props = {
  bounds: AccessMapData["bounds"];
};

/** 装飾用のモノクローム地図背景（ルート・ピンなし）— Google Map ID 優先、なければ Mapbox */
export function AccessMapBackground({ bounds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const googleMapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let disposed = false;
    let mapboxMap: mapboxgl.Map | null = null;
    let googleMap: google.maps.Map | null = null;

    const fitGoogleBounds = (map: google.maps.Map) => {
      const gBounds = new google.maps.LatLngBounds(
        { lat: bounds.minLat, lng: bounds.minLng },
        { lat: bounds.maxLat, lng: bounds.maxLng },
      );
      map.fitBounds(gBounds, 48);
    };

    const init = async () => {
      if (googleKey && googleMapId) {
        try {
          const { setOptions, importLibrary } = await import(
            "@googlemaps/js-api-loader"
          );
          setOptions({ key: googleKey, v: "weekly" });
          await importLibrary("maps");
          if (disposed) return;

          googleMap = new google.maps.Map(el, {
            mapId: googleMapId,
            disableDefaultUI: true,
            gestureHandling: "none",
            keyboardShortcuts: false,
            clickableIcons: false,
            center: {
              lat: (bounds.minLat + bounds.maxLat) / 2,
              lng: (bounds.minLng + bounds.maxLng) / 2,
            },
            zoom: 9,
          });
          fitGoogleBounds(googleMap);
          return;
        } catch {
          /* Mapbox へフォールバック */
        }
      }

      if (!mapboxToken || disposed) return;

      mapboxgl.accessToken = mapboxToken;
      mapboxMap = new mapboxgl.Map({
        container: el,
        style: "mapbox://styles/mapbox/light-v11",
        center: [(bounds.minLng + bounds.maxLng) / 2, (bounds.minLat + bounds.maxLat) / 2],
        zoom: 9,
        interactive: false,
        attributionControl: false,
        fadeDuration: 0,
      });

      mapboxMap.on("load", () => {
        mapboxMap?.fitBounds(
          [
            [bounds.minLng, bounds.minLat],
            [bounds.maxLng, bounds.maxLat],
          ],
          { padding: 48, duration: 0 },
        );
      });
    };

    void init();

    return () => {
      disposed = true;
      mapboxMap?.remove();
      if (googleMap) {
        google.maps.event.clearInstanceListeners(googleMap);
        googleMap = null;
      }
    };
  }, [bounds, googleKey, googleMapId, mapboxToken]);

  const hasMapProvider = Boolean((googleKey && googleMapId) || mapboxToken);

  if (!hasMapProvider) {
    return (
      <div
        className="absolute inset-0 bg-gradient-to-br from-[color:var(--award-color-accent-soft)] via-[#eef2f6] to-[color:var(--award-color-bg)]"
        aria-hidden
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className="access-map-bg absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
