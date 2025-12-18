/** @type {import('next').NextConfig} */

const nextConfig = {
 /* output: "export", */
  reactStrictMode: true,
  sassOptions: { includePaths: ["./styles/scss"] },
  images: {
  /* unoptimized: true,*/
    domains: ['lorempixel.com'],
  },
};

export default nextConfig;
