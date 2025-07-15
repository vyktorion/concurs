/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true,
    domains: ['ik.imagekit.io', 'images.pexels.com']
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  }
};

module.exports = nextConfig;
