import type { MetadataRoute } from "next";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://eldonia-nex.com"
).replace(/\/$/, "");

// Public, indexable routes. Authenticated / transactional areas
// (admin, dashboard, settings, checkout, auth) are intentionally excluded.
const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "/lp", changeFrequency: "weekly", priority: 1.0 },
  { path: "/gallery", changeFrequency: "daily", priority: 0.9 },
  { path: "/community", changeFrequency: "daily", priority: 0.8 },
  { path: "/shop", changeFrequency: "daily", priority: 0.8 },
  { path: "/events", changeFrequency: "weekly", priority: 0.7 },
  { path: "/works", changeFrequency: "weekly", priority: 0.7 },
  { path: "/lab", changeFrequency: "weekly", priority: 0.6 },
  { path: "/investors", changeFrequency: "monthly", priority: 0.6 },
  { path: "/help", changeFrequency: "monthly", priority: 0.4 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map(({ path, changeFrequency, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}
