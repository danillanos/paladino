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
  serverExternalPackages: [],
};

export default nextConfig;
