import type { NextConfig } from "next";
import { buildByokCspConnectSrc } from "./src/lib/api/byok-security";

const byokConnectSrc = buildByokCspConnectSrc();

const analyticsAndConsentScriptSrc = [
  "https://www.googletagmanager.com",
  "https://cs.iubenda.com",
  "https://cdn.iubenda.com",
].join(" ");

const analyticsAndConsentConnectSrc = [
  "https://www.googletagmanager.com",
  "https://www.google-analytics.com",
  "https://analytics.google.com",
  "https://region1.google-analytics.com",
  "https://cs.iubenda.com",
  "https://cdn.iubenda.com",
  "https://idb.iubenda.com",
].join(" ");

const analyticsAndConsentStyleSrc = "https://cdn.iubenda.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' 'unsafe-eval' ${analyticsAndConsentScriptSrc}`,
  `style-src 'self' 'unsafe-inline' ${analyticsAndConsentStyleSrc}`,
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co wss://*.supabase.co ${byokConnectSrc} https://api.telegram.org ${analyticsAndConsentConnectSrc}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-site" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
];

const nextConfig: NextConfig = {
  async headers() {
    const headers = [...securityHeaders];

    if (process.env.NODE_ENV === "production") {
      headers.push({
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      });
    }

    return [
      {
        source: "/:path*",
        headers,
      },
    ];
  },
};

export default nextConfig;
