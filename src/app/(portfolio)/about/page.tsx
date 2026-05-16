import { createAnonClient } from "@/lib/supabase/server";
import AboutClient from "@/components/pages/AboutClient";

export const revalidate = 60;

export default async function AboutPage() {
  const supabase = createAnonClient();
  const { data: about } = await supabase.from("about").select("*").single();
  const { data: profile } = await supabase.from("profile").select("*").single();
  return <AboutClient about={about} profile={profile} />;
}
