import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    localPatterns: [
      {
        pathname: "/aset/**",
      },
    ],
  },
};

export default nextConfig;
