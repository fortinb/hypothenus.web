/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  reactStrictMode: true,
  sassOptions: { 
    includePaths: ["styles", "node_modules"], 
    quiet: true,
    quietDeps: true
},
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "lorempixel.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default createNextIntlPlugin({
  // path to the request config
  localeConfig: "./i18n/request.ts",
})(nextConfig);

//export default nextConfig;
