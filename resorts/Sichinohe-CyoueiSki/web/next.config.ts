import path from "path";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const contentSecurityPolicy = [
  "default-src 'none'",
  "script-src 'self' 'unsafe-inline' maps.googleapis.com maps.gstatic.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  "img-src 'self' data: blob: maps.gstatic.com *.googleapis.com api.mapbox.com *.mapbox.com tiles.gsj.jp *.tile.openstreetmap.org ad.jp.ap.valuecommerce.com",
  "connect-src 'self' api.mapbox.com events.mapbox.com *.mapbox.com maps.googleapis.com *.googleapis.com tiles.gsj.jp *.openstreetmap.org ck.jp.ap.valuecommerce.com ad.jp.ap.valuecommerce.com",
  "frame-src 'self' www.openstreetmap.org",
  "worker-src blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
