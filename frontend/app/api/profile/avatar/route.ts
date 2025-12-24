import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (!user || authError) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // ✅ Validate file type
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { error: "Only image files are allowed" },
      { status: 400 }
    );
  }

  // ✅ Validate size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Image must be under 2MB" },
      { status: 400 }
    );
  }

  const extension = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${extension}`;

  // ✅ Upload (overwrite old avatar)
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) {
    return NextResponse.json(
      { error: uploadError.message },
      { status: 500 }
    );
  }

  // ✅ Public URL
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // ✅ Save URL in users table
  const { error: updateError } = await supabase
    .from("users")
    .update({ profile_url: data.publicUrl })
    .eq("id", user.id);

  if (updateError) {
    return NextResponse.json(
      { error: updateError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    profilePicture: data.publicUrl,
  });
}
