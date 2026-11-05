import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

function supabaseOrigins(): string[] {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!raw) return [];
  try {
    const { origin, protocol } = new URL(raw);
    const ws = origin.replace(/^https?:/, protocol === "https:" ? "wss:" : "ws:");
    return [origin, ws];
  } catch {
    return [];
  }
}

const connectSrc = new Set([
  "'self'",
  "https://*.mapbox.com",
  "https://events.mapbox.com",
  ...supabaseOrigins(),
  // Local Supabase and the dev server's HMR websocket.
  ...(isDev ? ["http://127.0.0.1:54321", "ws://127.0.0.1:54321", "ws://localhost:*", "ws://127.0.0.1:*"] : []),
]);

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://api.mapbox.com",
  "img-src 'self' data: blob: https://*.mapbox.com",
  `connect-src ${[...connectSrc].join(" ")}`,
  "worker-src 'self' blob:",
  "child-src blob:",
  "font-src 'self' data:",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  // Next 16 blocks cross-origin dev resources (HMR, client runtime) by default. Allowing
  // 127.0.0.1 as well as localhost keeps both ways of opening the dev server working.
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
