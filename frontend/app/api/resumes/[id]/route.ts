import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  // 🔑 Next.js 16: params is async
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Missing resume id" },
      { status: 400 }
    );
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("resumes")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
