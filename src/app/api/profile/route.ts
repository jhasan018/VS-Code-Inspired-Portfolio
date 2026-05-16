import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createServerClient();
  const { data: profile } = await supabase.from("profile").select("*").single();
  const { data: about } = await supabase.from("about").select("*").single();
  return NextResponse.json({ profile, about });
}

export async function PUT(req: NextRequest) {
  const supabase = createServerClient();
  const { profile, about } = await req.json();

  const [profileRes, aboutRes] = await Promise.all([
    supabase.from("profile").update({ ...profile, updated_at: new Date().toISOString() }).eq("id", profile.id),
    supabase.from("about").update({ ...about, updated_at: new Date().toISOString() }).eq("id", about.id),
  ]);

  if (profileRes.error) return NextResponse.json({ error: profileRes.error.message }, { status: 500 });
  if (aboutRes.error) return NextResponse.json({ error: aboutRes.error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
