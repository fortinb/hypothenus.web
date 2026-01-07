/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
  reactStrictMode: true,
  sassOptions: { 
    includePaths: ["./styles/scss", "node_modules"], 
    quiet: true
},
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "lorempixel.com",
      },
    ],
  },
};

export default createNextIntlPlugin({
  // path to the request config
  localeConfig: "./i18n/request.ts",
})(nextConfig);

//export default nextConfig;
