import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/* =========================
   GET: Fetch resume history
   ========================= */
export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ resumes: data });
}

/* =========================
   POST: Save new resume
   ========================= */
export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const {
    resume_name,
    original_pdf_url,
    tailored_pdf_url,
    tailored_tex_url,
  } = await req.json();

  if (!resume_name || !tailored_pdf_url || !tailored_tex_url) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const { error } = await supabase.from("resumes").insert({
    user_id: user.id,
    resume_name,
    original_pdf_url: original_pdf_url ?? null,
    tailored_pdf_url,
    tailored_tex_url,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
