import type { NextConfig } from "next";
import { PHASE_DEVELOPMENT_SERVER } from "next/constants";

export default function createNextConfig(phase: string): NextConfig {
  const isDevelopment = phase === PHASE_DEVELOPMENT_SERVER;
  const trustedMediaHosts: Array<{ protocol: "http" | "https"; hostname: string }> = [];

  for (const value of [
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL,
    process.env.WORDPRESS_API_URL,
    process.env.NEXT_PUBLIC_WORDPRESS_GRAPHQL_URL,
    process.env.WORDPRESS_GRAPHQL_URL,
  ]) {
    if (!value) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== "http:" && url.protocol !== "https:") continue;
      const isLoopbackOrLocalName =
        url.hostname === "localhost"
        || url.hostname === "127.0.0.1"
        || url.hostname.endsWith(".localhost")
        || url.hostname.endsWith(".test");
      if (!isDevelopment && isLoopbackOrLocalName) continue;
      const protocol = url.protocol === "http:" ? "http" : "https";
      if (!trustedMediaHosts.some((host) =>
        host.protocol === protocol && host.hostname === url.hostname
      )) {
        trustedMediaHosts.push({ protocol, hostname: url.hostname });
      }
    } catch {
      // Ignore invalid optional media-host environment values.
    }
  }

  if (isDevelopment && !trustedMediaHosts.some((host) => host.hostname === "almoar-wp.test")) {
    trustedMediaHosts.push({ protocol: "https", hostname: "almoar-wp.test" });
  }

  return {
    images: {
      remotePatterns: trustedMediaHosts.map((host) => ({
        protocol: host.protocol,
        hostname: host.hostname,
        pathname: '/wp-content/uploads/**',
      })),
      dangerouslyAllowLocalIP: isDevelopment,
    },
    cacheComponents: true,
    partialPrefetching: true,
    async redirects() {
      return [
        { source: '/', destination: '/ar', permanent: false },
        { source: '/about', destination: '/ar/about', permanent: false },
        { source: '/news', destination: '/ar/news', permanent: false },
        { source: '/news/:slug', destination: '/ar/news/:slug', permanent: false },
        { source: '/investments', destination: '/ar/investments', permanent: false },
        { source: '/projects', destination: '/ar/investments', permanent: false },
        { source: '/projects/:slug', destination: '/ar/investments/:slug', permanent: false },
        { source: '/contact', destination: '/ar/contact-us', permanent: false },
      ];
    },
    turbopack: {
      rules: {
        "*.css": {
          loaders: ["@tailwindcss/turbopack"],
        },
      },
    },
  };
}
