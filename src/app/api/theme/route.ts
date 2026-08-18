import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data } = await supabase.from("site_settings").select("value").eq("key", "frontend_theme").maybeSingle();
  return NextResponse.json({ theme: data?.value === "dimension" ? "dimension" : "vscode" });
}

export async function PUT(req: NextRequest) {
  if (req.cookies.get("dashboard_session")?.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { theme } = await req.json();
  if (theme !== "vscode" && theme !== "dimension") {
    return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
  }
  const supabase = createServerClient();
  const { error } = await supabase.from("site_settings").upsert({ key: "frontend_theme", value: theme, updated_at: new Date().toISOString() });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  revalidatePath("/", "layout");
  return NextResponse.json({ success: true, theme });
}
