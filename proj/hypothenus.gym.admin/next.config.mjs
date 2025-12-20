/** @type {import('next').NextConfig} */

import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
 /* output: "export", */
  reactStrictMode: true,
  sassOptions: { includePaths: ["./styles/scss"] },
  images: {
  /* unoptimized: true,*/
    domains: ['lorempixel.com'],
  },
};

export default createNextIntlPlugin({
  // path to the request config
  localeConfig: "./i18n/request.ts",
})(nextConfig);

//export default nextConfig;
