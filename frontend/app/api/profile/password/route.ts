import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  // 1. Get current session user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || !user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 2. Read body
  const { currentPassword, newPassword } = await req.json();

  if (!currentPassword || !newPassword) {
    return NextResponse.json(
      { error: "Current password and new password are required" },
      { status: 400 }
    );
  }

  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: "New password must be at least 8 characters" },
      { status: 400 }
    );
  }

  // 3. Re-authenticate user with current password
  const { error: signInError } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

  if (signInError) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 401 }
    );
  }

  // 4. Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true });
}
