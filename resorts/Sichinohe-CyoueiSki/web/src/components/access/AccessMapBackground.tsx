"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { AccessMapData } from "@/lib/resort-data";

type Props = {
  bounds: AccessMapData["bounds"];
};

function OsmMapFallback({ bounds }: { bounds: AccessMapData["bounds"] }) {
  const bbox = `${bounds.minLng},${bounds.minLat},${bounds.maxLng},${bounds.maxLat}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik`;

  return (
    <div className="access-map-osm absolute inset-0 h-full w-full overflow-hidden">
      <iframe
        title="アクセス概略地図"
        src={src}
        className="pointer-events-none h-full w-full border-0"
        loading="lazy"
        tabIndex={-1}
        aria-hidden={true}
      />
      <p className="pointer-events-auto absolute bottom-1.5 right-1.5 z-10 rounded bg-white/85 px-1.5 py-0.5 text-[0.625rem] leading-tight text-[color:var(--award-color-muted)] shadow-sm">
        ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2"
        >
          OpenStreetMap
        </a>{" "}
        contributors
      </p>
    </div>
  );
}

/** 装飾用のモノクローム地図背景（ルート・ピンなし）— Google Map ID → Mapbox → OSM */
export function AccessMapBackground({ bounds }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const googleKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const googleMapId = process.env.NEXT_PUBLIC_GOOGLE_MAP_ID;
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const hasJsMapProvider = Boolean((googleKey && googleMapId) || mapboxToken);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !hasJsMapProvider) return;

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
        fadeDuration: 0,
      });
      mapboxMap.addControl(new mapboxgl.AttributionControl({ compact: true }), "bottom-right");

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
  }, [bounds, googleKey, googleMapId, mapboxToken, hasJsMapProvider]);

  if (!hasJsMapProvider) {
    return <OsmMapFallback bounds={bounds} />;
  }

  return (
    <div
      ref={containerRef}
      className="access-map-bg absolute inset-0 h-full w-full"
      aria-hidden
    />
  );
}
