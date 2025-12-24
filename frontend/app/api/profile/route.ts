import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();

  const { data: { user }, error: authError } =
    await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("users")
    .select("name, profile_url")
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    name: data.name,
    email: user.email, // source of truth = auth.users
    profilePicture: data.profile_url,
  });
}

export async function PUT(req: Request) {
  const supabase = await createSupabaseServerClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name } = await req.json();

  // Update public.users table
  if (name) {
    const { error } = await supabase
      .from("users")
      .update({ name })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }  
  

  return NextResponse.json({ success: true });
}


import { createClient } from "@supabase/supabase-js";

export async function DELETE() {
  // 1. Session client (cookies)
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Admin client (service role)
  const adminSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // SERVER ONLY
  );

  const { error: deleteError } =
    await adminSupabase.auth.admin.deleteUser(user.id);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}