import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      canvas: './src/empty.js',
    },
  },
};

export default nextConfig;
