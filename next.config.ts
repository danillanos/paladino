import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'paladinopropiedades.com.ar',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.paladinopropiedades.com.ar',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // Disable problematic features that might cause the routesManifest error
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
