import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "img.icons8.com", "upload.wikimedia.org", "sarkariparcha.in", "cms.sarkariparcha.in"],
  },
  env: {
    SITE_URL: process.env.SITE_URL || "https://cms.sarkariparcha.in",
    SITE_NAME: process.env.SITE_NAME || "Sarkari Parcha CMS",
    MAIN_SITE_URL: process.env.MAIN_SITE_URL || "https://sarkariparcha.in",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["sarkariparcha.in", "cms.sarkariparcha.in", "localhost:3000", "localhost:3001"],
    },
  },
};

export default nextConfig;