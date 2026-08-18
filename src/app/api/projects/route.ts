import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const projectTypes = new Set(["company", "client", "personal"]);

function validateProjectType(value: unknown) {
  return typeof value === "string" && projectTypes.has(value);
}

export async function GET() {
  const supabase = createServerClient();
  const { data, error } = await supabase.from("projects").select("*").order("order_index");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient();
  const body = await req.json();
  const project = { project_type: "company", ...body };
  if (!validateProjectType(project.project_type)) {
    return NextResponse.json({ error: "Invalid project type" }, { status: 400 });
  }
  const { data, error } = await supabase.from("projects").insert(project).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest) {
  const supabase = createServerClient();
  const { id, ...body } = await req.json();
  if (body.project_type !== undefined && !validateProjectType(body.project_type)) {
    return NextResponse.json({ error: "Invalid project type" }, { status: 400 });
  }
  const { data, error } = await supabase.from("projects").update({ ...body, updated_at: new Date().toISOString() }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath(`/projects/${body.slug}`);
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = createServerClient();
  const { id } = await req.json();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  
  revalidatePath("/");
  revalidatePath("/projects");
  return NextResponse.json({ success: true });
}
