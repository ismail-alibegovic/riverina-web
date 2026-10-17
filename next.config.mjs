/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/en/stanovi', destination: '/en/apartments', permanent: true }];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [72, 75, 78, 80],
    remotePatterns: [{ protocol: 'https', hostname: '*.supabase.co', pathname: '/storage/v1/object/public/**' }],
  },
};
export default nextConfig;
