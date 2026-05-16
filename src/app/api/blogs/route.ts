import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("blogs").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const { data, error } = await supabase.from("blogs").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/blogs");
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const supabase = createServerClient();
  const { id, ...body } = await req.json();
  const { data, error } = await supabase.from("blogs").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/blogs");
  revalidatePath(`/blogs/${body.slug}`);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();
  const { id } = await req.json();
  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/blogs");
  return NextResponse.json({ success: true });
}
