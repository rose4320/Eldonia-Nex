import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  generateBuildId: async () =>
    process.env.VERCEL_GIT_COMMIT_SHA ?? `local-${Date.now()}`,
  reactCompiler: true,
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
