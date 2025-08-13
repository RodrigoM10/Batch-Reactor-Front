import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
 allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.84:3000",
  ],
};

export default nextConfig;
