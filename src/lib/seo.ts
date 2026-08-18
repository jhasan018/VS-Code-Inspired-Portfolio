import { createServerClient } from "./supabase/server";
import { Metadata } from "next";

export async function getMetadata(pageSlug: string): Promise<Metadata> {
  const supabase = await createServerClient();
  const { data: meta } = await supabase
    .from("page_meta")
    .select("*")
    .eq("page_slug", pageSlug)
    .single();

  if (!meta) return {};

  const baseUrl = "https://devjahid.vercel.app";
  const url = pageSlug === "home" ? baseUrl : `${baseUrl}/${pageSlug}`;
  const legacyAboutTitle = meta.meta_title?.trim() === "Full Stack Web Developer";
  const legacyAboutDescription = meta.meta_description?.includes("Working as a full stack web developer");
  const title = pageSlug === "about" && legacyAboutTitle
    ? "About Jahid Hasan | Full-Stack Developer"
    : meta.meta_title || "Jahid Hasan | Full-Stack Developer";
  const description = pageSlug === "about" && legacyAboutDescription
    ? "Learn about Jahid Hasan, a full-stack developer and project delivery professional building dependable web products with Next.js, React, Node.js, PHP, and Laravel."
    : meta.meta_description || "Portfolio of Jahid Hasan, a specialist in building high-performance web applications.";

  return {
    title: { absolute: title },
    description,
    alternates: {
      canonical: meta.canonical_url || url,
    },
    openGraph: {
      title: meta.og_title || title,
      description: meta.og_description || description,
      siteName: "Jahid Hasan",
      url,
      images: [meta.og_image || "/og-image-dimension.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.og_title || title,
      description: meta.og_description || description,
      images: [meta.og_image || "/og-image-dimension.png"],
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
