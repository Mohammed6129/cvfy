import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Native / worker-based packages that must not be bundled.
  serverExternalPackages: ["pdf-parse", "@napi-rs/canvas"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com", pathname: "/**" },
      { protocol: "https", hostname: "**.googleusercontent.com", pathname: "/**" },
    ],
  },
  async redirects() {
    // Pages from the previous version of the site.
    return [
      { source: "/enhance", destination: "/create", permanent: false },
      { source: "/chat", destination: "/create", permanent: false },
      { source: "/features", destination: "/#how", permanent: false },
      { source: "/dashboard", destination: "/my-cvs", permanent: false },
      { source: "/register", destination: "/login", permanent: false },
    ];
  },
};

export default nextConfig;
