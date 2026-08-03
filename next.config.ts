import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Explicitly set project root to avoid wrong workspace root detection
  // (when multiple package-lock.json exist on shared hosting)
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/login",
        destination: "/admin/login",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
