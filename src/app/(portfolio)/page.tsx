import { createAnonClient } from "@/lib/supabase/server";
import HomeClient from "@/components/pages/HomeClient";
import { Home as DimensionHome } from "@/themes/dimension/DimensionPages";
import { getActiveTheme } from "@/lib/theme";
import { Metadata } from "next";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("home");
}

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createAnonClient();
  const [{ data: profile }, { data: about }, { data: skills }, { data: projects }, { data: blogs }] = await Promise.all([
    supabase.from("profile").select("*").single(),
    supabase.from("about").select("*").single(),
    supabase.from("skills").select("*").order("order_index"),
    supabase.from("projects").select("*").eq("featured", true).order("order_index"),
    supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false }).limit(3),
  ]);
  const schema = await getPageSchema("home");
  const theme = await getActiveTheme();
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Jahid Hasan",
    alternateName: ["JH", "devjahid.vercel.app"],
    url: "https://devjahid.vercel.app/",
  };
  const hasWebsiteSchema = schema && (
    schema["@type"] === "WebSite" ||
    (Array.isArray(schema["@graph"]) && schema["@graph"].some((item: { "@type"?: string }) => item["@type"] === "WebSite"))
  );
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c") }}
      />
      {schema && !hasWebsiteSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      )}
      {theme === "dimension" ? <DimensionHome profile={profile} about={about} skills={skills ?? []} projects={projects ?? []} blogs={blogs ?? []} /> : <HomeClient profile={profile} about={about} />}
    </>
  );
}
