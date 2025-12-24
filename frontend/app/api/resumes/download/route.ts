import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename") ?? "resume";

  if (!url) {
    return NextResponse.json({ error: "Missing file url" }, { status: 400 });
  }

  const fileRes = await fetch(url);
  if (!fileRes.ok) {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 });
  }

  const blob = await fileRes.arrayBuffer();

  return new NextResponse(blob, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
