/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/merchant-center-europe/sample-data/goodstore/**',
      },
    ],
  },
};

export default nextConfig;
