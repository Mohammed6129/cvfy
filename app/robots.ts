import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvfy-rosy.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/preview", "/my-cvs", "/account", "/login"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
