import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.clerk.dev'], // Add any other image domains you might use
  },
  // Ensure TypeScript checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Ensure ESLint checking during build
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
