import { createAnonClient } from "@/lib/supabase/server";
import BlogsClient from "@/components/pages/BlogsClient";

export const revalidate = 60;

export default async function BlogsPage() {
  const supabase = createAnonClient();
  const { data: blogs } = await supabase.from("blogs").select("*").eq("published", true).order("created_at", { ascending: false });
  return <BlogsClient blogs={blogs ?? []} />;
}
