/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/HR3',
        destination: 'http://localhost:5174/HR3/',
      },
      {
        source: '/HR3/:path*',
        destination: 'http://localhost:5174/HR3/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
