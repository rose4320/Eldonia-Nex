import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  generateBuildId: async () =>
    process.env.VERCEL_GIT_COMMIT_SHA ?? `local-${Date.now()}`,
  reactCompiler: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    localPatterns: [
      {
        pathname: "/logo.png",
      },
      {
        pathname: "/aset/**",
      },
      {
        pathname: "/design/**",
      },
    ],
  },
};

export default nextConfig;
