import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
