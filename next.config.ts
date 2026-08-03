import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript & ESLint errors during build on shared hosting
  // (symlinked node_modules causes false type resolution errors)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Explicitly set project root to avoid wrong workspace root detection
  outputFileTracingRoot: path.join(__dirname),
  // Explicit webpack alias to ensure @/ resolves correctly on CloudLinux
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": path.join(__dirname, "src"),
    };
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
