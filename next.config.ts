import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
      },
    ],
  },
  experimental: {
    // Optimize middleware bundle size
    serverMinification: true,
  },
};

export default nextConfig;
