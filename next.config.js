/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uwckvdrgakjckgzpnlev.supabase.co',
      },
    ],
  },
};

module.exports = nextConfig;
