import { createServerClient } from "./supabase/server";
import { Metadata } from "next";
import { PAGE_SEO, SITE_URL, type SeoPageSlug } from "./content-seo";

function conciseTitle(value: string, maxLength = 60) {
  const clean = value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
  if (clean.length <= maxLength) return clean;
  const shortened = clean.slice(0, maxLength + 1).replace(/\s+\S*$/, "").trim();
  return shortened || clean.slice(0, maxLength).trim();
}

export async function getMetadata(pageSlug: string): Promise<Metadata> {
  const supabase = await createServerClient();
  const { data: meta } = await supabase
    .from("page_meta")
    .select("*")
    .eq("page_slug", pageSlug)
    .single();

  const defaults = PAGE_SEO[pageSlug as SeoPageSlug] || PAGE_SEO.home;
  const url = pageSlug === "home" ? SITE_URL : `${SITE_URL}/${pageSlug}`;
  const title = conciseTitle(meta?.meta_title?.trim() || defaults.title);
  const description = meta?.meta_description?.trim() || defaults.description;

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: meta?.canonical_url || url,
    },
    openGraph: {
      title: meta?.og_title || title,
      description: meta?.og_description || description,
      siteName: "Jahid Hasan",
      url,
      images: [meta?.og_image || "/og-image-dimension.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.og_title || title,
      description: meta?.og_description || description,
      images: [meta?.og_image || "/og-image-dimension.png"],
    },
  };
}

export async function getPageSchema(pageSlug: string) {
  const supabase = await createServerClient();
  const { data: meta } = await supabase
    .from("page_meta")
    .select("schema_data")
    .eq("page_slug", pageSlug)
    .single();

  return meta?.schema_data;
}
