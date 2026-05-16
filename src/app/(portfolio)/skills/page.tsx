import { createAnonClient } from "@/lib/supabase/server";
import SkillsClient from "@/components/pages/SkillsClient";

export const revalidate = 60;

export default async function SkillsPage() {
  const supabase = createAnonClient();
  const { data: skills } = await supabase.from("skills").select("*").order("order_index");
  return <SkillsClient skills={skills ?? []} />;
}
