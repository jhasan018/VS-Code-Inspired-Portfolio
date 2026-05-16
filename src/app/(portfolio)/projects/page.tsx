import { createAnonClient } from "@/lib/supabase/server";
import ProjectsClient from "@/components/pages/ProjectsClient";

export const revalidate = 60;

export default async function ProjectsPage() {
  const supabase = createAnonClient();
  const { data: projects } = await supabase.from("projects").select("*").order("order_index");
  return <ProjectsClient projects={projects ?? []} />;
}
