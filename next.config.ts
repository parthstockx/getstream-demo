import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  allowedDevOrigins: ["*.ngrok-free.app"],
  // Workaround for HMR bug: isrManifest handler reads page.components when page is undefined
  // devIndicators: false,
};

export default nextConfig;
