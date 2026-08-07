import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript errors during build on shared hosting
  // (symlinked node_modules causes false type resolution errors)
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable parallel server compilation - CloudLinux limits child process spawning (EAGAIN)
  experimental: {
    parallelServerCompiles: false,
    parallelServerBuildTraces: false,
  },
  // Explicitly set project root to avoid wrong workspace root detection
  outputFileTracingRoot: path.join(__dirname),
  // Explicit webpack alias + disable parallelism to avoid EAGAIN on CloudLinux
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "src"),
    };
    // Disable parallel compilation
    config.parallelism = 1;
    return config;
  },
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
