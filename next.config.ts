import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.icons8.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'developer.apple.com',
      },
      {
        protocol: 'https',
        hostname: 'sarkariparcha.in',
      },
      {
        protocol: 'https',
        hostname: 'cms.sarkariparcha.in',
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  env: {
    SITE_URL: process.env.SITE_URL || "https://sarkariparcha.in",
    SITE_NAME: process.env.SITE_NAME || "Sarkari Parcha",
    CMS_URL: process.env.CMS_URL || "https://cms.sarkariparcha.in",
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["sarkariparcha.in", "cms.sarkariparcha.in", "localhost:3000", "localhost:3001"],
    },
  },
  async rewrites() {
    return [
      {
        source: '/cms/:path*',
        destination: `${process.env.CMS_URL || 'http://localhost:3001'}/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
