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
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Increase timeout for slow image responses
    unoptimized: false,
  },
  // Increase server timeout for image optimization
  experimental: {
    serverMinification: true,
    proxyTimeout: 120000, // 2 minutes
  },
};

export default nextConfig;
