/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com",'s3-alpha-sig.figma.com', 'cms.imgworlds.com',"lh3.googleusercontent.com","hubsite-storage.s3.ap-south-1.amazonaws.com"], 
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async middlewareMatcher() {
    return [
      // Match only the pages endpoints
      '/:path*', // Matches all top-level pages and their subpaths
    ];
  },
};

export default nextConfig;
