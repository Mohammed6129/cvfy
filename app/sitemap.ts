import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cvfy-rosy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/create", "/about-ats", "/terms", "/privacy"].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.6,
  }));
}
