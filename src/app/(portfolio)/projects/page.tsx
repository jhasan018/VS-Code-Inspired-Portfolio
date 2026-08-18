import { createAnonClient } from "@/lib/supabase/server";
import ProjectsClient from "@/components/pages/ProjectsClient";
import { ProjectsPage as DimensionProjects } from "@/themes/dimension/DimensionPages";
import { getActiveTheme } from "@/lib/theme";
import { Metadata } from "next";
import { getMetadata, getPageSchema } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  return await getMetadata("projects");
}

export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = createAnonClient();
  const { data: projects } = await supabase.from("projects").select("*").order("order_index");
  const schema = await getPageSchema("projects");
  const theme = await getActiveTheme();

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}
      {theme === "dimension" ? <DimensionProjects projects={projects ?? []} /> : <ProjectsClient projects={projects ?? []} />}
    </>
  );
}
