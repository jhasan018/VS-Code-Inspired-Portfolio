import { createAnonClient } from "@/lib/supabase/server";
import BlogsClient from "@/components/pages/BlogsClient";
import { BlogsPage as DimensionBlogs } from "@/themes/dimension/DimensionPages";
import { BlogsPage as LumeBlogs } from "@/themes/lume/LumePages";
import { getActiveTheme } from "@/lib/theme";
import { Metadata } from "next";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("blogs");
}

export const revalidate = 60;

export default async function BlogsPage() {
  const supabase = createAnonClient();
  const { data: blogs } = await supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false });
  const schema = await getPageSchema("blogs");
  const theme = await getActiveTheme();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {theme === "dimension" ? <DimensionBlogs blogs={blogs ?? []} /> : theme === "lume" ? <LumeBlogs blogs={blogs ?? []} /> : <BlogsClient blogs={blogs ?? []} />}
    </>
  );
}
