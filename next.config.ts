import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  async redirects() {
    return [
      { source: '/', destination: '/ar', permanent: false },
      { source: '/about', destination: '/ar/about', permanent: false },
      { source: '/news', destination: '/ar/news', permanent: false },
      { source: '/news/:slug', destination: '/ar/news/:slug', permanent: false },
      { source: '/projects', destination: '/ar/investments', permanent: false },
      { source: '/projects/:slug', destination: '/ar/investments/:slug', permanent: false },
      { source: '/contact', destination: '/ar/contact-us', permanent: false },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
