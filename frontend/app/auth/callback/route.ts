import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${origin}/`);
  }

  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookieStore).getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(async ({ name, value, options }) => {
            (await cookieStore).set(name, value, options);
          });
        },
      },
    }
  );

  // 🔑 THIS IS THE CRITICAL STEP
  await supabase.auth.exchangeCodeForSession(code);

  return NextResponse.redirect(`${origin}/dashboard`);
}
