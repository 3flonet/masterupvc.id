import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable Turbopack for production build
  // (Turbopack has issues with symlinked node_modules on CloudLinux/shared hosting)
  experimental: {
    turbopack: false,
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
