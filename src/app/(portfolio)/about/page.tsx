import { createAnonClient } from "@/lib/supabase/server";
import AboutClient from "@/components/pages/AboutClient";
import { AboutPage as DimensionAbout } from "@/themes/dimension/DimensionPages";
import { AboutPage as LumeAbout } from "@/themes/lume/LumePages";
import { getActiveTheme } from "@/lib/theme";
import { Metadata } from "next";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("about");
}

export const revalidate = 60;

export default async function AboutPage() {
  const supabase = createAnonClient();
  const { data: about } = await supabase.from("about").select("*").single();
  const { data: profile } = await supabase.from("profile").select("*").single();
  const schema = await getPageSchema("about");
  const theme = await getActiveTheme();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {theme === "dimension" ? <DimensionAbout about={about} profile={profile} /> : theme === "lume" ? <LumeAbout about={about} profile={profile} /> : <AboutClient about={about} profile={profile} />}
    </>
  );
}
