import { createAnonClient } from "@/lib/supabase/server";
import HomeClient from "@/components/pages/HomeClient";

export const revalidate = 60;

export default async function HomePage() {
  const supabase = createAnonClient();
  const { data: profile } = await supabase.from("profile").select("*").single();
  const { data: about } = await supabase.from("about").select("*").single();
  
  return <HomeClient profile={profile} about={about} />;
}
