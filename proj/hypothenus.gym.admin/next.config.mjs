/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  sassOptions: { includePaths: ["./styles/scss"] },
  images: {
    domains: ['lorempixel.com'],
    // OR (preferred for HTTP/HTTPS/patterns):
    // remotePatterns: [
    //   { protocol: 'http', hostname: 'lorempixel.com', pathname: '/**' }
    // ]
  },
};

export default nextConfig;
