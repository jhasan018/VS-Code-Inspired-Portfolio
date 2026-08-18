import { createAnonClient } from "@/lib/supabase/server";
import SkillsClient from "@/components/pages/SkillsClient";
import { SkillsPage as DimensionSkills } from "@/themes/dimension/DimensionPages";
import { getActiveTheme } from "@/lib/theme";
import { Metadata } from "next";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("skills");
}

export const revalidate = 60;

export default async function SkillsPage() {
  const supabase = createAnonClient();
  const { data: skills } = await supabase.from("skills").select("*").order("order_index");
  const schema = await getPageSchema("skills");
  const theme = await getActiveTheme();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {theme === "dimension" ? <DimensionSkills skills={skills ?? []} /> : <SkillsClient skills={skills ?? []} />}
    </>
  );
}
