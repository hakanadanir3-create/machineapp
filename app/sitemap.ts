export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://machinegym.biz";
  const supabase = await createClient();

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("slug, published_at")
    .eq("published", true);

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl,                        lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${baseUrl}/bolu-dovus-salonu`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.95 },
    { url: `${baseUrl}/hizmetler`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/fiyatlar`,          lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/program-al`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/randevu`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/hakkimizda`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/sss`,               lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`,              lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${baseUrl}/iletisim`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.6 },
    { url: `${baseUrl}/bki`,               lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${baseUrl}/gizlilik`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/kvkk`,              lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
    { url: `${baseUrl}/kosullar`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Bolu dövüş sporları SEO blog yazıları (statik sayfalar, DB'den bağımsız)
  const dovusSporlariBlogSlugs = [
    { slug: "bolu-da-dovus-sporlari-neden-gym-machine", date: "2026-01-10" },
    { slug: "boks-ozel-dersi-ile-fitness", date: "2026-01-17" },
    { slug: "kickboks-muay-thai-baslangic-rehberi", date: "2026-01-24" },
  ];
  const dovusSporlariPages: MetadataRoute.Sitemap = dovusSporlariBlogSlugs.map(({ slug, date }) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const blogPages: MetadataRoute.Sitemap = posts?.map(post => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.published_at ? new Date(post.published_at) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  })) || [];

  return [...staticPages, ...dovusSporlariPages, ...blogPages];
}
